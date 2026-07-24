---
title: "KubeRCA 아키텍처와 Human-in-the-Loop 설계"
description: "KubeRCA의 Frontend·Backend·Analysis Agent·PostgreSQL 경계와, RCA 검토·재분석·피드백을 제품 흐름에 넣은 방법을 정리합니다."
date: "2026-04-04"
lang: "ko"
translationKey: "kuberca-human-in-the-loop-architecture"
category: "projects"
subcategory: "kuberca"
tags: ["kuberca", "architecture", "human-in-the-loop", "kubernetes", "llm"]
draft: false
comments: true
---

KubeRCA에서 Human-in-the-Loop은 마지막에 승인 버튼 하나를 놓는 일이 아닙니다. 사람이 alert의 범위를 정하고, 수집한 evidence와 AI의 해석을 구분해 읽고, 재분석을 요청하고, 실제로 효과가 있었던 조치를 기록할 수 있게 **전체 시스템의 책임과 데이터 흐름을 나누는 일**입니다.

이 글은 왜 프로젝트를 만들었는지가 아니라 그 원칙을 어떤 아키텍처로 구현했는지에 집중합니다. 제품 문제와 OOMKilled 데모는 [KubeRCA를 만든 이유](/brilly/ko/posts/kuberca-why-we-built-it/)에서 다룹니다.

![KubeRCA 실제 프로젝트 아키텍처](/brilly/assets/blog/kuberca/architecture-linkedin.jpg)

_Alertmanager, Frontend, Backend, Analysis Agent, PostgreSQL·pgvector와 Kubernetes·Prometheus·Loki·Tempo를 연결한 프로젝트 아키텍처입니다._

## 세 실행 영역의 책임을 분리했다

KubeRCA는 Frontend, Backend, Analysis Agent를 중심으로 동작합니다. 이 분리는 언어나 배포 단위를 나누기 위한 것만이 아닙니다. 운영자가 검토할 상태와 Agent가 생성할 분석을 서로 다른 책임으로 두기 위한 경계입니다.

**Backend**는 Alertmanager webhook, incident와 alert 상태, analysis 요청, SSE update, feedback, webhook routing과 영속화를 담당합니다. 어떤 사건이 열려 있고 어떤 run이 그 사건에 속하는지는 Backend의 책임입니다.

**Analysis Agent**는 incident context를 받아 Kubernetes와 관측 source를 읽고 RCA와 incident summary를 만듭니다. Agent가 system of record를 직접 소유하지 않게 해, 분석 실패가 incident 상태를 임의로 바꾸거나 이전 결과를 지우지 못하게 했습니다.

**Frontend**는 alert와 incident 목록, 분석 상세, feedback, 수동 재분석을 제공합니다. 단순히 Agent의 마지막 응답을 렌더링하는 화면이 아니라, 자동화가 만든 결과와 운영자가 내린 결정을 함께 읽는 작업대입니다.

PostgreSQL은 incident·alert·analysis artifact·feedback·routing 정보를 보존합니다. pgvector는 해결된 사건의 summary를 embedding으로 찾아볼 수 있게 합니다. Prometheus, Loki, Tempo, Istio 같은 관측 source는 환경에 맞게 연결되는 enricher이고, Slack도 동일한 incident를 협업 채널에서 읽기 위한 선택 경로입니다.

## Incident가 데이터와 판단의 공통 키가 된다

같은 장애는 여러 alert로 나타날 수 있습니다. Pod 재시작, 높은 memory 사용량, readiness 실패가 각각 들어와도 하나의 workload 문제일 수 있습니다. 반대로 alert 이름이 같더라도 서로 다른 namespace와 workload라면 다른 사건일 수 있습니다.

그래서 KubeRCA의 핵심 data model은 alert가 아니라 incident입니다. incident에는 다음 기록이 연결됩니다.

- 포함된 alert와 대상 resource
- 분석 실행과 진행 상태
- 수집한 context와 artifact
- 생성된 RCA와 incident summary
- 운영자의 feedback과 수동 재분석
- 해결 뒤의 embedding과 유사 사건 문맥

![KubeRCA Incident Dashboard](/brilly/assets/blog/kuberca/incident-dashboard.png)

_여러 alert를 개별 notification으로 소비하지 않고, investigation lifecycle을 가진 incident로 관리하는 화면입니다._

Incident Dashboard가 필요한 이유도 여기에 있습니다. alert가 resolved됐다는 사실과 조사가 끝났다는 사실은 다릅니다. 운영자는 사건의 상태, 연결된 signal, 분석 진행, 마지막 판단을 함께 보고 종결 여부를 결정해야 합니다.

이 모델 덕분에 Frontend와 Slack이 다른 장소에 있어도 같은 사건을 가리킬 수 있습니다. 분석 결과가 바뀌거나 운영자가 feedback을 남겨도 새 문서가 흩어지는 대신 기존 incident history가 갱신됩니다.

## ReAct loop에는 읽기 권한만 준다

Analysis Agent는 가능한 가설을 세우고, 그 가설을 확인할 query를 선택하고, observation에 따라 다음 질문을 바꾸는 ReAct 형태의 loop를 사용합니다. 여기서 중요한 것은 reasoning 문장을 길게 만드는 것이 아니라 도구 사용 범위를 제한하는 것입니다.

기본 조사 경로는 Kubernetes resource·event·log와 Prometheus metric입니다. 선택적으로 Loki log, Tempo trace, Istio context를 보강할 수 있습니다. `kubectl` 계열 도구도 상태 변경이 아닌 조회 범위에 제한합니다. source가 없거나 권한이 부족하면 그 실패를 observation으로 남기고 다른 source의 결과까지 지우지 않습니다.

RCA 초안은 최소한 다음을 분리해야 합니다.

- source에서 직접 관찰한 사실
- 사실을 연결한 가설과 confidence
- 아직 확인하지 못한 정보
- 가설을 반박할 수 있는 다음 점검
- 운영자가 검토할 권장 조치

이 형태가 있어야 운영자는 자연어 문장의 설득력보다 evidence를 기준으로 판단할 수 있습니다. Agent가 좋은 결론을 찾지 못한 경우에도 “어떤 source가 비어 있었는가”가 다음 조사에 남습니다.

## 실시간 갱신과 수동 재분석을 같은 기능으로 보지 않았다

![KubeRCA Incident Detail](/brilly/assets/blog/kuberca/incident-detail.png)

_RCA, 영향 범위, 완화 단계, 연결된 alert와 다음 점검을 같은 incident 안에서 검토하는 실제 상세 화면입니다._

Incident Detail은 분석 완료 뒤에만 열리는 report page가 아닙니다. alert 상태와 분석 진행은 SSE로 갱신되고, 연결이 불안정한 환경에서는 polling fallback을 둘 수 있습니다. 운영자는 수집 중인 사건과 완료된 결과를 같은 화면에서 이어서 봅니다.

수동 재분석은 자동 분석의 실패 처리만도 아닙니다. 처음 선택한 시간 범위가 좁거나, 추가 log가 도착했거나, 운영자가 다른 가설을 확인하고 싶을 때 새 run을 만들 수 있어야 합니다. 자동화는 반복 수집을 시작하지만 사람의 질문이 끝나는 시점을 결정하지 않습니다.

새 run은 이전 RCA를 무조건 덮어쓰지 않아야 합니다. 운영자는 어떤 증거가 추가돼 결론이 달라졌는지, 재분석이 실제로 품질을 높였는지 비교해야 합니다. 분석 이력과 feedback을 incident에 함께 두는 이유입니다.

## Human-in-the-Loop을 화면 요소가 아닌 결정권으로 구현했다

운영자는 생성된 RCA를 수용하거나 수정하거나 보류할 수 있어야 합니다. 그러려면 화면에 결론뿐 아니라 다음 항목이 보여야 합니다.

- 어떤 alert와 resource가 분석 범위에 들어갔는가
- 어떤 query와 source가 사용됐는가
- 수집 실패와 권한 제한이 있었는가
- 관찰된 사실과 Agent의 해석은 어디서 갈리는가
- 권장 조치의 영향과 rollback은 무엇인가

이 요구 때문에 analysis와 action의 권한을 분리했습니다. Agent가 추천한 명령을 바로 실행하는 대신, 확인 방법·적용 전제·영향 범위·되돌리는 방법·승인 주체를 검토 자료로 남깁니다. 자동 remediation이 필요하다면 별도의 승인과 audit 경로를 가져야 합니다.

민감한 context에는 입력·출력 masking을 적용합니다. 운영자의 신뢰는 모델이 항상 맞아서 생기는 것이 아니라, 도구가 무엇을 읽었고 무엇을 바꾸지 않았는지 설명할 수 있을 때 생깁니다.

## 선택적 source는 confidence를 확장하지만 core flow를 소유하지 않는다

모든 환경에 Loki, Tempo, Istio, Slack이 존재하지는 않습니다. KubeRCA는 Alertmanager, Kubernetes API와 핵심 incident 흐름만으로 시작할 수 있게 하고, 추가 integration을 증거 경로의 확장으로 다룹니다.

선택 source가 비어 있으면 분석 전체를 실패시키지도, 성공한 것처럼 숨기지도 않습니다. 얻지 못한 관찰을 artifact와 confidence의 제한으로 남깁니다. 이 방식이면 운영자는 “RCA가 생성되지 않았다”와 “trace가 없어 이 가설을 검증하지 못했다”를 구분할 수 있습니다.

Graceful degradation은 단순한 예외 처리가 아닙니다. 현재 환경에서 가능한 조사와 불가능한 조사를 정직하게 표현하는 제품 계약입니다.

## 과거 사례는 검색되지만 현재 결론을 결정하지 않는다

Incident가 resolved되면 summary와 embedding을 저장해 유사 사례를 찾을 수 있습니다. 운영자 feedback도 어떤 과거 RCA가 유효했는지 판단하는 문맥이 됩니다. 하지만 유사도는 현재 사건의 원인 증거가 아닙니다.

새 incident에서는 다시 현재 resource, event, metric, log를 확인합니다. 과거 사례가 제안한 가설이 이번 evidence와 맞는지 검증한 뒤에만 사용할 수 있습니다. 이 경계가 없으면 잘못된 첫 분석이 embedding을 통해 계속 재생산될 수 있습니다.

KubeRCA의 Human-in-the-Loop은 따라서 분석 마지막 단계에만 있지 않습니다. incident 범위를 정할 때, evidence를 검토할 때, 재분석을 요청할 때, action을 승인할 때, 해결 결과를 다음 사례로 남길 때 모두 사람이 결정권을 가집니다.

아키텍처를 구성 요소 목록으로만 읽으면 Frontend, Backend, Agent, PostgreSQL과 관측 도구가 보입니다. 판단의 흐름으로 읽으면 signal → incident → read-only evidence → RCA draft → operator review → reusable record가 보입니다. KubeRCA가 지키려 한 구조는 바로 두 번째 흐름입니다.

> 현재 코드와 설치 구성은 [KubeRCA GitHub 저장소](https://github.com/kube-rca/kuberca)에서 확인할 수 있습니다.
