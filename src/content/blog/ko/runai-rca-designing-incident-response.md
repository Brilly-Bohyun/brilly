---
title: "Run:AI RCA 아키텍처: 세 서비스와 일곱 개의 증거 Agent"
description: "Go Backend, FastAPI Agent, React Frontend와 일곱 개의 읽기 전용 collector로 GPU 플랫폼 장애 조사를 구성한 설계를 정리합니다."
date: "2026-07-24"
lang: "ko"
translationKey: "runai-rca-designing-incident-response"
category: "projects"
subcategory: "runai-rca"
tags: ["runai", "nvidia", "rca", "architecture", "nemo", "kubernetes"]
draft: false
comments: true
---

Run:AI RCA는 GPU 장애의 원인을 한 문장으로 생성하는 챗봇이 아닙니다. Run:ai, Kubernetes, Prometheus, Loki, control-plane database, node system, 변경 이력처럼 서로 다른 운영 출처를 **하나의 조사 계약** 안에서 읽고, 무엇을 확인했는지 다시 추적할 수 있게 만드는 시스템입니다.

이 글에서는 실제 장애 한 건의 분석 결과보다, 그 조사가 가능하도록 프로젝트를 어떻게 나누고 연결했는지에 집중합니다. 실제 운영 화면에서 CrashLoopBackOff를 분석한 과정은 별도의 [Alertmanager에서 Evidence Trail까지의 실제 장애 분석](/brilly/ko/posts/runai-rca-alert-to-rca-flow/)에 정리했습니다.

![Run:AI RCA 공식 아키텍처 — Alertmanager, Backend, Frontend, Agent, PostgreSQL, TypeDB와 일곱 개의 읽기 전용 조사 Agent](/brilly/assets/blog/runai-rca/architecture.svg)

_프로젝트 저장소와 GitBook에 공개한 현재 아키텍처입니다. 판단을 담당하는 Agent와 사건의 수명 주기를 담당하는 Backend, 검토를 담당하는 Frontend의 경계를 분리했습니다._

## Backend는 사건과 실행의 수명 주기를 소유한다

Go Backend의 책임은 Alertmanager payload를 LLM에 전달하는 데서 끝나지 않습니다. alert를 정규화하고, 동일한 운영 문제에 속할 가능성이 있는 alert를 incident로 묶고, 분석 실행의 시작·진행·완료·실패를 저장합니다. 피드백, 코멘트, 승인 상태, 유사 incident 검색도 같은 사건 경계에 붙습니다.

alert와 incident를 분리한 이유는 notification grouping과 원인 분석의 경계가 다르기 때문입니다. 하나의 Alertmanager group에 무관한 장애가 함께 들어올 수 있고, 반대로 이름이 다른 alert가 동일한 node 문제나 queue policy 변경에서 파생될 수도 있습니다. 구현에서는 다음 문맥을 순서대로 사용해 사건 후보를 좁힙니다.

- `cluster + project + queue + namespace + workload`
- `cluster + node`
- Alertmanager `groupKey`

분석은 비동기로 실행됩니다. Backend는 Agent 호출을 기다리는 동안 webhook 응답을 붙잡지 않고, analysis run을 별도 상태로 관리하며 SSE로 진행 상황을 Frontend에 보냅니다. 재분석이 timeout 또는 실패로 끝나도 마지막으로 성공한 RCA를 덮어쓰지 않습니다. “가장 최근 실행”과 “마지막으로 신뢰 가능한 결과”가 같지 않을 수 있기 때문입니다.

반복 alert에는 cooldown을 적용합니다. 사건이 다시 활성화됐다는 사실은 기록하되, 같은 alert가 짧은 시간에 연속으로 들어왔다는 이유만으로 비용이 큰 조사를 계속 복제하지 않습니다. 자동 분석과 운영자 주도 재분석도 구분해, Slack에는 최초 분석과 명시적인 후속 분석만 incident thread로 전달합니다.

## Agent는 단일 프롬프트가 아니라 조사 파이프라인이다

Python FastAPI Agent는 NeMo Agent Toolkit workflow를 사용하지만, 모든 데이터를 하나의 프롬프트에 넣는 구조가 아닙니다. 오케스트레이터가 범위와 가설을 계획하고, 기본 증거 수집과 도메인별 drill-down, 후보 ranking, 반증 점검, report synthesis, runtime harness를 순서대로 진행합니다.

기본 조사에는 일곱 collector가 참여합니다.

- **Run:ai** — workload, project, queue, quota, priority, version
- **Kubernetes** — Pod, event, node condition, scheduler blocker
- **Prometheus** — queue·project·GPU metric과 재시작·자원 신호
- **Loki** — workload와 Run:ai control-plane log
- **Postgres** — RCA store, pgvector, feedback와 Run:ai control-plane 조회
- **System** — kernel, GPU driver, NVIDIA XID, OOM, MCE
- **Change** — controller version, Pod lifecycle, node condition 전이

collector를 나눈 목적은 데이터를 많이 긁기 위해서가 아닙니다. **어떤 질문을 어떤 출처가 답할 수 있는지**를 고정하기 위해서입니다. Kubernetes collector에는 Kubernetes 읽기 도구만, Run:ai collector에는 GET 기반 Run:ai 도구만, Postgres collector에는 read-only `SELECT`만 제공합니다. 권한 경계가 프롬프트의 지시가 아니라 tool registry와 코드에 들어가 있습니다.

중앙 investigation loop와 collector drill-down도 역할이 다릅니다. 중앙 loop는 다음에 어느 증거 평면을 볼지 선택합니다. collector loop는 이미 선택된 평면 안에서만 더 깊이 조사합니다. 예를 들어 Pending workload라면 중앙 loop가 Run:ai queue와 Kubernetes scheduling을 함께 비교할 수 있지만, Kubernetes collector가 임의로 Run:ai API 권한을 얻지는 못합니다.

## 모든 수집 결과는 같은 Evidence Contract로 돌아온다

collector의 산출물은 자연어 요약만이 아닙니다. 실제 query, source, status, confidence, highlight를 artifact로 반환합니다.

```json
{
  "source": "kubernetes",
  "type": "adhoc_query",
  "status": "ok",
  "confidence": "medium",
  "title": "파드 조회",
  "query": "kubectl get pod train-0 -n runai",
  "summary": "CrashLoopBackOff, previous termination detected",
  "highlights": ["CrashLoopBackOff"]
}
```

`ok`, `partial`, `unavailable`은 서비스 health가 아니라 **이번 조사에서 검토 가능한 artifact가 생성됐는가**를 뜻합니다. Agent Pod가 Running이고 `/healthz`가 200이어도, 실제 query 결과가 남지 않았다면 완료된 수집으로 표시하면 안 됩니다. 반대로 한 collector가 실패해도 다른 출처의 artifact는 보존합니다.

시간 범위도 evidence의 일부입니다. 일반적으로 firing 5분 전부터 resolved 5분 후까지를 보고, 아직 firing인 사건은 과거 데이터를 무한히 읽지 않도록 범위를 제한합니다. 현재 존재하는 resource가 과거 incident 시점에도 존재했다는 보장은 없으므로, current state와 incident-window evidence도 분리합니다.

민감 값은 artifact가 모델로 전달되기 전에 masking합니다. 로그나 event에 포함된 문장은 신뢰할 수 없는 입력으로 취급하며, collector가 읽은 텍스트가 새로운 권한이나 도구 실행을 지시하지 못하게 합니다.

## 조사 실패도 구조화된 결과로 남긴다

운영 도구는 모든 의존성이 정상일 때만 동작해서는 안 됩니다. Run:AI RCA는 전체 분석 deadline을 두고, 느리거나 응답하지 않는 collector를 `partial` 또는 `unavailable`로 남긴 채 나머지 조사를 계속합니다. MCP adapter가 실패하면 허용된 direct API로 보완하고, LLM runtime이나 NeMo workflow가 실패하면 결정론적 단계로 저하해 최소 report를 반환합니다.

여기서 fallback은 실패를 감추는 장치가 아닙니다. 어떤 경로가 사용됐는지, 어떤 source가 비었는지, 무엇을 현재 증거로 증명하지 못했는지를 결과에 포함하기 위한 장치입니다. Backend timeout은 Agent의 내부 deadline보다 길게 두어, Agent가 종료 직전에 만든 degraded report가 네트워크 timeout으로 유실되지 않게 했습니다.

후보 원인 ranking도 확률처럼 보이는 숫자를 만드는 것이 목적이 아닙니다. alert catalog, known issue, failure-mode symptom, NVIDIA XID signature를 후보 검색에 사용하되, live evidence가 뒷받침하지 않는 signature는 결론으로 승격하지 않습니다. 독립된 증거 출처, 반증 여부, incident lifecycle을 함께 보고 confidence의 상한을 정합니다.

## 저장소는 데이터베이스가 아니라 검토 이력을 만든다

PostgreSQL에는 incident와 alert뿐 아니라 analysis run, artifact, feedback, comment, 평가가 저장됩니다. pgvector는 비슷한 과거 사건을 찾는 데 쓰이지만, 유사도는 현재 사건의 원인 증거가 아닙니다. 과거 사례는 조사 순서를 제안할 수 있을 뿐, 현재 source에서 확인한 사실을 대신하지 못합니다.

선택적인 TypeDB ontology는 node blast radius, workload와 queue의 관계, 승인된 원인과 조치 같은 관계형 문맥을 제공합니다. 이 그래프도 모든 분석 결과를 자동으로 학습하지 않습니다. 운영자가 승인한 immutable RCA snapshot만 유예 기간을 거쳐 지식으로 승격할 수 있습니다. 미승인 추정이 다음 incident의 prior가 되는 일을 막기 위해서입니다.

TypeDB가 꺼져 있거나 접근할 수 없어도 기본 조사는 계속됩니다. UI와 report도 그래프를 사용하지 못한 상황에서 관계 추론이 수행된 것처럼 표현하지 않습니다. 선택 기능의 부재를 정상 결과처럼 숨기지 않는 것이 이 프로젝트의 공통 설계 원칙입니다.

## Frontend는 결과 페이지가 아니라 검토 작업대다

React Frontend는 incident, alert, analysis, knowledge, chat을 분리해 보여 주지만, 최종 검토는 incident 상세에 모입니다. 요약, 장문의 report, 유사 사건, collector Evidence Trail, Missing Data, Warnings, self-check, 평가, 피드백, 승인과 재분석이 같은 사건 파일 안에 있습니다.

승인은 단순한 UI 상태 변경이 아닙니다. 현재 결과를 운영자가 검토했다는 경계이자, memory와 ontology로 승격할 수 있는 snapshot을 확정하는 행위입니다. 제안된 조치 역시 자동 실행하지 않습니다. 확인 방법, 영향 범위, rollback, 승인 주체를 포함한 recommendation으로 남겨 사람이 결정하게 합니다.

세 서비스를 분리하고 evidence contract를 만든 뒤 가장 크게 달라진 점은, “Agent가 답했는가”보다 “이 사건을 다시 검토할 수 있는가”를 먼저 묻게 됐다는 것입니다. Run:AI RCA의 아키텍처는 AI를 운영자 대신 판단하게 만드는 구조가 아니라, 여러 운영 출처를 읽은 과정과 한계를 사건 기록으로 남기는 구조에 가깝습니다.

> 구현과 설계 문서는 [Run:AI RCA GitHub 저장소](https://github.com/uclix-nvidia-sw/runaiRCA)와 [Run:AI RCA GitBook](https://uclix.gitbook.io/run-ai-rca-docs)에서 계속 갱신하고 있습니다.
