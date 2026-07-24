---
title: "KubeRCA를 만든 이유: 알림과 이해 사이의 공백을 줄이기"
description: "Kubernetes 알림 뒤에 반복되는 조사 준비와 인수인계를 줄이기 위해 KubeRCA를 시작한 문제 정의, OOMKilled 데모와 제품 기준입니다."
date: "2026-04-04"
lang: "ko"
translationKey: "kuberca-why-we-built-it"
category: "projects"
subcategory: "kuberca"
tags: ["kuberca", "kubernetes", "rca", "aiops", "incident-response"]
draft: false
comments: true
---

Kubernetes 장애 대응은 alert가 도착한 순간보다 그 다음부터 더 오래 걸립니다. 대상 workload를 찾고, Pod 상태와 event를 확인하고, 직전 log와 metric을 같은 시간대에 놓고, 최근 변경과 과거 사례를 검색해야 합니다. 원인을 찾지 못한 채 교대 시간이 오면 지금까지 본 내용도 다시 설명해야 합니다.

이 일은 숙련자에게도 반복적이고, 처음 대응하는 사람에게는 출발점 자체가 어렵습니다. 조사 순서는 runbook에 모두 적혀 있지 않고, “이 signal이면 여기부터 본다”는 판단은 개인의 경험과 terminal history에 남기 쉽습니다.

KubeRCA는 이 공백을 줄이기 위해 시작한 오픈소스 프로젝트입니다. 목표는 AI가 운영자의 판단을 대신하는 것이 아니라, **한 alert에서 검토 가능한 RCA 초안까지 가는 준비 작업을 사건 기록으로 남기는 것**입니다.

## 해결하고 싶었던 문제를 한 번의 교대로 적어 봤다

프로젝트를 시작할 때 기능 목록보다 실제 on-call 흐름을 먼저 적었습니다.

```text
Alertmanager에서 signal을 본다
→ namespace와 workload를 찾는다
→ Pod event와 container 상태를 확인한다
→ 사건 전후의 log와 metric을 모은다
→ 가능한 원인과 반대 증거를 메모한다
→ 다음 사람이 이어 볼 수 있게 정리한다
```

각 단계의 도구는 이미 존재했습니다. 문제는 결과가 서로 다른 화면과 command output에 흩어지고, 어느 관찰이 어떤 원인 문장을 뒷받침하는지 연결되지 않는다는 점이었습니다.

그래서 첫 제품 가설을 “더 정확한 자동 진단”보다 작게 잡았습니다.

> alert와 관련된 첫 조사 자료를 한곳에 모아 근거와 미확인 항목을 구분하면, 다른 운영자가 더 빠르게 같은 판단 지점에 도달할 수 있다.

이 가설은 답을 맞히는 속도보다 handoff와 review 가능성을 우선하게 했습니다.

## Alert 화면은 원인보다 사건의 출발점을 보여 줬다

![KubeRCA Alert Dashboard](/brilly/assets/blog/kuberca/alert-dashboard.png)

_어떤 alert가 firing 중인지, 어느 대상과 심각도를 가졌는지 먼저 확인하는 실제 화면입니다._

한 줄짜리 alert 이름만으로는 어느 문제를 조사해야 하는지 부족합니다. 같은 `CrashLoopBackOff`도 namespace와 workload, 발생 시각, 이전 상태에 따라 다른 사건입니다.

Alert Dashboard에서 먼저 보이고 싶었던 것은 모델의 답이 아니라 조사 범위였습니다. 운영자가 잘못된 대상이나 이미 끝난 사건을 현재 장애로 읽지 않도록 target, state, severity와 시간을 먼저 확인하게 했습니다.

이 선택은 화면 우선순위도 바꿨습니다. AI 요약을 가장 크게 보여 주기보다, 어떤 signal에서 시작했고 어떤 resource가 범위에 들어갔는지 확인할 수 있어야 했습니다. 좋은 RCA 문장도 사건 경계가 틀리면 쓸모가 없기 때문입니다.

## OOMKilled 데모에서 증상과 원인을 분리했다

기본 데모는 memory limit을 넘은 container가 OOMKilled되고 다시 시작되는 시나리오였습니다. 일부러 익숙한 장애를 골랐습니다. 정답을 맞히기 쉬워서가 아니라 `CrashLoopBackOff`라는 증상과 `OOMKilled`라는 원인의 차이를 제품에서 표현하기 좋았기 때문입니다.

재시작 alert만으로 OOM을 확정하면 안 됩니다. 이전 container의 termination reason과 exit code, event, restart count, 사건 시점의 memory 변화가 같은 설명을 지지해야 합니다. 필요한 관찰이 사라졌다면 “OOM일 수 있다”가 아니라 “현재 자료로는 증명할 수 없다”는 한계가 남아야 합니다.

![KubeRCA Alert Analysis](/brilly/assets/blog/kuberca/alert-analysis.png)

_한 alert의 분석 상태, 수집한 관찰, 권장 점검과 feedback을 분리해 보는 화면입니다._

이 데모를 만들며 제품에서 구분해야 할 네 가지가 정리됐습니다.

- source에서 직접 읽은 사실
- 사실을 연결해 만든 원인 가설
- 아직 얻지 못한 관찰
- 운영자가 다음에 확인할 항목

이 네 가지가 한 문단으로 합쳐지면 자연스러운 RCA는 만들 수 있어도 신뢰할 수 있는 review는 어렵습니다.

## 자동화보다 먼저 “하지 않을 일”을 정했다

KubeRCA가 가장 먼저 하지 않기로 한 일은 resource를 자동 변경하는 것이었습니다. OOMKilled가 유력해도 memory limit을 올리거나 workload를 재시작하지 않습니다. 잘못된 가설, 비용 증가, 다른 workload에 미치는 영향을 한 분석 서비스가 책임질 수 없기 때문입니다.

대신 RCA 초안에는 확인 방법과 예상 영향, 되돌리는 방법, 사람이 판단할 지점을 남기려 했습니다. 제품의 가치는 action을 실행하는 속도가 아니라 operator가 더 짧은 시간에 안전한 action을 고르게 하는 데 있다고 봤습니다.

또한 모든 관측 도구가 연결된 완벽한 환경만 전제하지 않았습니다. 첫 평가에서는 “얼마나 많은 integration이 있는가”보다 source가 비었을 때 결과가 그 한계를 솔직하게 보여 주는지를 확인했습니다.

## 협업 채널에서도 요약이 사건과 떨어지지 않게 했다

![KubeRCA Slack Thread](/brilly/assets/blog/kuberca/slack-thread.png)

_새 alert와 RCA 요약, 후속 논의가 같은 사건 흐름으로 이어지는 예시입니다._

실제 대응에서는 상세 분석 화면만큼 교대와 협업이 중요합니다. Slack message는 긴 report를 대신하지 않고, 어떤 사건이 열렸고 어떤 판단이 필요한지 빠르게 공유하는 입구로 사용했습니다.

요약만 복사해 별도 대화를 만들면 근거와 limitation이 사라질 수 있습니다. 따라서 협업 채널의 메시지도 상세 사건으로 돌아갈 수 있어야 하고, 후속 질문이 어떤 분석을 가리키는지 알아야 했습니다.

이 요구는 KubeRCA를 개인용 진단 도구보다 팀의 investigation workspace로 보게 만들었습니다. 한 사람이 답을 얻는 것과 다음 사람이 같은 사건을 이어 보는 것은 다른 제품 문제였습니다.

## 다섯 달 동안 기능보다 제품 기준을 고정했다

CloudBro Open Project S2에서 약 다섯 달간 구현하면서 다음 기준을 반복해서 사용했습니다.

- 표시할 근거가 없으면 원인을 사실처럼 쓰지 않는다.
- 증상, 가설, 미확인 정보와 다음 점검을 구분한다.
- 자동 변경보다 읽기 전용 조사와 검토 가능한 권고를 먼저 만든다.
- source가 비어도 얻은 관찰은 남기고 한계를 표시한다.
- 분석 결과를 일회성 답변이 아니라 교대 가능한 사건 기록으로 만든다.

이 기준으로 보면 KubeRCA의 첫 성공은 어려운 장애를 완전히 자동 해결하는 장면이 아닙니다. alert를 처음 본 사람이 조사 출발점을 잡고, 다른 운영자가 같은 evidence를 따라가며, 원인을 모를 때도 무엇을 더 확인해야 하는지 이해하는 장면입니다.

KubeRCA가 줄이고 싶은 것은 모델이 문장을 생성하는 몇 초가 아닙니다. 도구를 오가며 같은 자료를 다시 모으고, 이미 확인한 판단을 교대자에게 다시 설명하는 시간입니다. 알림과 답변 사이가 아니라 **알림과 검증 가능한 이해 사이의 공백**을 줄이는 것이 이 프로젝트를 만든 이유입니다.

> 설치와 현재 구현은 [KubeRCA GitHub 저장소](https://github.com/kube-rca/kuberca)에서 확인할 수 있습니다. 서비스와 권한의 경계는 [KubeRCA 아키텍처와 Human-in-the-Loop 설계](/brilly/ko/posts/kuberca-human-in-the-loop-architecture/)에 별도로 정리했습니다.
