---
title: "Run:AI RCA 실제 장애 분석: CrashLoopBackOff에서 Evidence Trail까지"
description: "실제 운영 환경의 resolved CrashLoopBackOff incident를 재분석하며, 부족한 증거를 RCA와 Evidence Trail에 남긴 과정을 따라갑니다."
date: "2026-07-24"
lang: "ko"
translationKey: "runai-rca-alert-to-rca-flow"
category: "projects"
subcategory: "runai-rca"
tags: ["runai", "alertmanager", "crashloopbackoff", "rca", "operations"]
draft: false
comments: true
---

Run:AI RCA의 가치를 설명하려면 구성 요소 목록보다 실제로 어떤 incident를 어떻게 다뤘는지 보여 주는 편이 낫습니다. 이 글은 운영 환경에 남아 있던 `Pod is crash looping.` incident를 다시 분석한 기록입니다. 증상은 분명했지만, 과거 사건의 원인을 증명할 live evidence는 충분하지 않았습니다.

중요한 결과는 “CrashLoopBackOff의 원인은 이것이다”라는 문장이 아니었습니다. **어디까지 확인했고, 무엇이 비어 있으며, 왜 원인을 단정하지 않았는지**가 화면에 남았다는 점이었습니다.

## 목록에서 먼저 사건의 경계를 읽는다

![Run:AI RCA 운영 환경의 Incident Dashboard](/brilly/assets/blog/runai-rca/incident-dashboard.png)

_실제 운영 환경의 incident 목록입니다. 같은 종류의 Pod alert뿐 아니라 Run:ai control-plane, node, rollout 사건이 하나의 cockpit에 쌓입니다._

Incident Dashboard에서는 제목만 보지 않습니다. severity, `firing`·`resolved`·`analyzing` 상태, 최종 승인 여부, 연결된 alert 수, 시작 시각을 같이 봅니다. RCA를 열기 전에 “지금도 진행 중인 사건인가”, “과거 사건을 다시 보는 것인가”, “사람이 승인한 결론이 있는가”를 구분하기 위해서입니다.

이번에 연 incident는 다음 조건을 가지고 있었습니다.

- incident: `INC-1784617627629481310-000003`
- 대상: `test1 / super-agg-ingress-0-vllmworker-t5xqr`
- 증상: `Pod is crash looping.`
- severity: `warning`
- 발생: 2026년 7월 21일 16시 06분
- Alertmanager resolved: 같은 날 16시 12분
- 최종 결정: `pending`

이미 해결된 incident를 7월 23일에 다시 분석했기 때문에, 현재 cluster에서 읽은 상태와 발생 당시 상태를 같은 것으로 취급할 수 없었습니다. 이 시간 차이가 이후 report의 confidence를 제한하는 가장 중요한 조건이 됐습니다.

## 실제 RCA는 증상과 원인을 분리했다

![실제 CrashLoopBackOff incident의 RCA Summary와 유사 incident](/brilly/assets/blog/runai-rca/actual-crashloop-analysis.png)

_운영 UI에서 새로 캡처한 실제 분석 결과입니다. 상단에 사건의 lifecycle이 있고, 아래에는 RCA Summary와 과거 유사 incident가 함께 보입니다._

RCA Summary는 해당 Pod가 CrashLoopBackOff 상태로 반복 재시작했다는 사실은 확인했습니다. 하지만 원인 문장에는 `OOMKilled`, 잘못된 entrypoint, image pull 실패, ConfigMap 누락 중 하나를 임의로 선택하지 않았습니다. 화면에는 `증거 일부 누락`이 표시됐고, “현재 증거로는 정확한 원인을 특정하기 어렵다”는 결론이 남았습니다.

이 구분은 단순해 보이지만 실제로는 중요합니다. CrashLoopBackOff는 원인이 아니라 kubelet이 관찰한 반복 재시작 상태입니다. 원인을 말하려면 이전 container의 종료 reason, exit code, 직전 log, Pod event, resource limit, node pressure 같은 별도의 evidence가 필요합니다.

유사 incident 검색에서는 과거의 다른 CrashLoopBackOff 사례가 28%로 노출됐고, 그 사례에는 OOMKilled 결론이 있었습니다. 그러나 그 기록을 이번 사건의 원인으로 복사하지 않았습니다. 유사 사건은 확인할 항목을 제안하지만, 현재 사건의 live evidence는 아니기 때문입니다.

## Evidence Trail에서 수집 성공과 실패를 같이 읽는다

![실제 분석의 Collector Evidence Trail](/brilly/assets/blog/runai-rca/evidence-trail.png)

_Run:ai, Kubernetes, Postgres, Prometheus, Loki, System, Change, Alert artifact를 출처별로 펼쳐 보는 실제 Evidence Trail입니다._

이번 run의 Evidence Trail에는 Run:ai 9개, Kubernetes 48개, Postgres 9개, Prometheus 31개, Loki 10개, System 6개, Change 8개, Alert 1개의 artifact가 남았습니다. 숫자가 많다는 사실 자체가 높은 confidence를 뜻하지는 않습니다. 같은 관찰을 여러 형태로 반복한 것일 수도 있고, 사건 시점이 아닌 현재 상태를 읽은 결과일 수도 있습니다.

Run:ai 쪽 artifact만 보더라도 결과가 균일하지 않았습니다.

- workload context는 일부 조회됐지만 project와 queue는 확인하지 못했습니다.
- workload query는 대상 범위를 증명하지 못해 `low`로 남았습니다.
- 현재 project resource가 없다는 응답은 있었지만, incident 시점에도 없었다는 증거는 아니었습니다.
- 일부 project node-pool 조회는 권한 문제로 실패했습니다.
- alert에 immutable Run:ai workload ID가 없어 상태와 이력의 정확한 연결이 제한됐습니다.

이 정보는 “Run:ai collector 성공”이라는 하나의 초록색 상태로 합쳐지면 안 됩니다. 무엇을 조회했고 무엇이 실패했는지가 artifact 단위로 남아야, 운영자가 report의 범위를 판단할 수 있습니다.

분석 화면에는 `Missing Data` 4개와 `Warnings` 16개도 기록됐습니다. 예를 들어 재분석 시점에는 대상 Pod가 사라져 Kubernetes 조회가 실패했고, 일부 Prometheus query는 응답 형식 문제로 완전한 결과를 만들지 못했습니다. 과거 incident의 resource가 현재 없다는 사실은 “당시 문제가 없었다”는 반증이 아닙니다. 그저 지금은 해당 source로 과거 상태를 증명할 수 없다는 뜻입니다.

## report는 다음 사람이 실행할 점검을 남겼다

원인을 특정하지 못했다면 자동화가 아무것도 하지 않은 것처럼 보일 수 있습니다. 하지만 이번 report는 불확실성을 줄이기 위한 다음 점검을 구체적으로 남겼습니다.

```bash
kubectl -n runai-test1 describe pod super-agg-ingress-0-vllmworker-t5xqr
kubectl -n runai-test1 logs super-agg-ingress-0-vllmworker-t5xqr --previous
kubectl -n runai-test1 get pod super-agg-ingress-0-vllmworker-t5xqr \
  -o jsonpath='{.status.containerStatuses[0].lastState}'
```

이어 ConfigMap과 Secret 주입, image registry 접근, node의 `MemoryPressure`·`DiskPressure`·`PIDPressure`, kubelet eviction 기록을 확인하도록 제안했습니다. 즉시 확인할 증거와 후속 점검, 재발 방지 항목을 분리해 다음 교대자가 조사 순서를 다시 설계하지 않게 했습니다.

다만 과거 incident에서는 위 명령도 그대로 실행되지 않을 수 있습니다. 이미 Pod가 삭제됐다면 `--previous` log조차 남아 있지 않습니다. 그래서 이 사례는 사후 분석 자동화만으로 충분하다는 결론이 아니라, firing 시점에 Pod state·event·log를 보존하는 수집 경로가 왜 필요한지를 보여 줬습니다.

## 분석 비용도 품질 지표와 함께 봐야 했다

이번 run은 약 21분 15초 동안 진행됐고, UI에는 53번의 LLM call과 약 25만 9천 token이 기록됐습니다. 일곱 collector가 많은 artifact를 만들고 self-check와 report repair까지 수행한 결과입니다. 그러나 긴 실행과 많은 token은 그 자체로 좋은 RCA의 증거가 아닙니다.

오히려 이 결과는 비용과 종료 조건을 더 엄격하게 설계해야 한다는 피드백이 됐습니다.

- 동일한 query와 동일한 관찰은 다시 호출하지 않는다.
- 사건 시점의 evidence를 얻을 수 없는 source는 무한히 재시도하지 않는다.
- 독립적인 source가 추가되지 않으면 confidence를 올리지 않는다.
- 원인을 증명하지 못하면 `insufficient_evidence`로 끝낼 수 있어야 한다.
- report repair가 사실을 새로 만들지 못하게 hard gate를 둔다.

UI의 Harness는 invalid evidence link, Evidence Trace 누락, 미해결 반증, 위험 조치, high-confidence 근거를 각각 검사했습니다. 이 run은 형식과 안전 gate를 통과했지만, 원인 confidence는 낮게 유지됐습니다. **보고서 형식이 유효하다는 것과 원인을 확정했다는 것은 다른 평가**이기 때문입니다.

## 운영자 승인은 분석의 끝이 아니라 지식의 시작이다

이번 incident의 최종 결정은 여전히 `pending`입니다. 유사 incident가 있고 report가 생성됐더라도, 운영자가 실제 해결 결과와 유효한 조치를 확인하지 않았다면 knowledge base에 정답처럼 들어가면 안 됩니다.

운영자는 Evidence grounding, Diagnostic reasoning, Investigation plan, Uncertainty calibration, Operational usefulness, Tool efficiency, Safety를 별도로 평가할 수 있습니다. 실제로 효과가 있었던 조치와 resolution outcome도 기록합니다. 이 검토를 거쳐 승인된 immutable snapshot만 이후 유사 사건 검색과 ontology의 운영 지식 후보가 됩니다.

이 CrashLoopBackOff 사례가 보여 준 Run:AI RCA의 실제 흐름은 다음과 같습니다.

```text
resolved alert를 incident로 다시 연다
  → 사건 시점과 현재 시점의 차이를 확인한다
  → 각 source에서 읽힌 사실과 수집 실패를 artifact로 남긴다
  → 유사 사건을 참고하되 현재 원인으로 복사하지 않는다
  → 증거가 부족하면 원인을 보류한다
  → 다음 수동 점검과 수집 개선점을 제안한다
  → 운영자가 결과와 실제 해결을 검토한다
```

이 글에서 보여 주고 싶었던 것은 멋진 정답 화면이 아닙니다. 실제 장애 조사에서는 데이터가 사라지고, 권한이 막히고, query가 실패하며, 과거 사례가 지나치게 그럴듯하게 보입니다. Run:AI RCA는 그 불완전함을 숨기지 않고 다음 판단에 사용할 수 있는 사건 기록으로 바꾸는 프로젝트입니다.

> 전체 구현은 [Run:AI RCA GitHub 저장소](https://github.com/uclix-nvidia-sw/runaiRCA), 운영·파이프라인 문서는 [Run:AI RCA GitBook](https://uclix.gitbook.io/run-ai-rca-docs)에서 확인할 수 있습니다.
