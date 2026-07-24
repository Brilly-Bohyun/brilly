---
title: "Open Source Summit North America 2026: KubeRCA를 영어로 설명하며 다시 본 것"
description: "KubeRCA의 ReAct 조사 흐름과 read-only guardrail을 해외 기술 컨퍼런스 청중에게 설명하며 확인한 발표 설계와 개선점을 정리합니다."
date: "2026-07-01"
lang: "ko"
translationKey: "opensource-summit-us-talk"
category: "talks"
subcategory: "conference"
tags: ["open-source-summit", "kubernetes", "kuberca", "public-speaking", "open-source"]
draft: false
comments: true
---

Open Source Summit + Embedded Linux Conference North America 2026에서 **“Troubleshooting Like a Senior on Day 1: ReAct Agents with Real-Time Cluster Evidence”**를 발표했습니다. 세션은 KubeRCA가 Kubernetes alert를 받은 뒤 metrics·logs·events를 읽고, 허용된 read-only query만 실행하며, 각 주장에 evidence를 연결해 RCA 초안을 만드는 과정을 다뤘습니다.

이 글은 해외 발표 자체의 소감보다, 프로젝트를 영어 기술 발표로 압축하면서 무엇을 명확히 할 수 있었고 무엇이 부족했는지를 정리한 사례입니다. KubeRCA의 제품 배경과 전체 아키텍처는 프로젝트 글에서 별도로 다룹니다.

![Open Source Summit + Embedded Linux North America 2026 발표자 배지](/brilly/assets/blog/ossummit-2026/photo-01.jpg)

## 발표 제목의 약속을 기술 범위로 제한했다

“첫날부터 시니어처럼 troubleshooting한다”는 제목은 눈에 띄지만 그대로 두면 AI가 경력자의 판단을 대체한다는 의미로 들릴 수 있습니다. 발표에서 가장 먼저 제한한 것은 이 표현의 범위였습니다.

KubeRCA가 재현하려는 것은 시니어의 모든 직관이 아닙니다. alert가 왔을 때 어느 source를 먼저 보고, 가능한 원인을 어떤 query로 반박하며, 지금 evidence로 말할 수 없는 범위를 어떻게 남기는지와 같은 반복 가능한 조사 절차입니다.

따라서 세션의 핵심 문장은 다음과 같았습니다.

```text
AI가 원인을 대신 결정한다
→ 운영자가 검토할 수 있도록 조사 순서와 evidence를 구조화한다
```

이 문장을 기준으로 제품 기능을 나열하지 않고 문제 → guardrail → 실제 evidence → operator review의 흐름을 만들었습니다.

![Open Source Summit + Embedded Linux North America 2026 행사장 welcome sign](/brilly/assets/blog/ossummit-2026/photo-05.jpg)

## ReAct보다 먼저 read-only guardrail을 설명했다

ReAct loop 자체를 먼저 설명하면 청중은 “Agent가 cluster에서 무엇까지 실행하는가”를 궁금해합니다. 그래서 reasoning 방식보다 안전 경계를 앞에 뒀습니다.

- command와 query는 allowlist 안에서만 선택한다.
- Kubernetes와 observability source는 읽기 전용으로 사용한다.
- 수집 결과와 model의 해석을 분리한다.
- evidence가 부족하면 confidence를 낮추고 추가 점검을 남긴다.
- remediation은 자동 실행하지 않고 operator가 검토한다.

그 뒤에야 Agent가 alert context로 가설을 만들고, query를 선택하고, observation을 받아 다음 가설을 조정하는 loop를 설명했습니다. 순서를 바꾸니 ReAct가 자율 실행을 강조하는 용어가 아니라 제한된 investigation loop로 보였습니다.

![Speaker lounge 앞에서 발표 흐름을 점검하던 장면](/brilly/assets/blog/ossummit-2026/photo-02.jpg)

## Architecture보다 evidence가 이동하는 경로를 보여 줬다

KubeRCA에는 Alertmanager, Backend, Analysis Agent, PostgreSQL·pgvector, dashboard, Slack과 여러 observability source가 있습니다. 모든 component를 같은 무게로 설명하면 짧은 세션에서 기억에 남는 것은 서비스 이름뿐입니다.

발표에서는 한 alert가 다음 형태로 바뀌는 경로를 중심에 뒀습니다.

```text
Alertmanager signal
→ incident context
→ read-only observations
→ hypothesis and counter-check
→ evidence-backed RCA draft
→ dashboard and team channel review
```

이 경로에서 architecture의 각 component는 한 책임만 설명했습니다. Backend는 사건과 분석 상태를 보존하고, Agent는 evidence를 모아 초안을 만들며, UI와 Slack은 운영자가 같은 incident를 검토하게 합니다. pgvector는 과거 사례를 찾지만 현재 원인의 증거를 대신하지 않습니다.

세션 설명에도 이 경계를 명시했습니다. real-time cluster evidence는 metrics, logs, events를 구조화한 context이고, 각 claim은 그 evidence로 다시 찾아갈 수 있어야 합니다. “AI가 Kubernetes를 안다”보다 훨씬 구체적인 약속이 됐습니다.

![KubeRCA 발표 현장 — 세션 제목과 함께 발표를 준비하는 모습](/brilly/assets/blog/ossummit-2026/photo-06.jpg)

## 첫 영어 발표에서는 정확성이 흐름을 압도했다

영어 발표를 준비하며 기술 용어와 문장의 정확성에 많은 시간을 썼습니다. evidence, hypothesis, root cause, remediation, read-only guardrail처럼 비슷하지만 역할이 다른 단어를 일관되게 사용해야 했습니다. 한글 슬라이드를 그대로 번역하면 문장이 길어져, 실제로 말할 수 있는 짧은 문장으로 다시 써야 했습니다.

정확성을 높인 것은 도움이 됐지만 부작용도 있었습니다. 준비한 문장을 놓치지 않는 데 집중하면서 청중의 반응에 맞춰 속도와 예시를 조정할 여유가 줄었습니다. 기술적으로 맞는 내용을 전달했어도, 청중이 어느 지점에서 질문을 만들고 있는지를 충분히 읽지는 못했습니다.

현장에서 다른 세션을 보며 차이가 더 분명해졌습니다. 좋은 발표자는 정확한 정보에 더해 청중이 지금 기억해야 할 한 문장, 다음 diagram을 봐야 하는 이유, 어려운 세부를 잠시 내려놓아도 되는 지점을 계속 알려 줬습니다.

다음 영어 발표에서는 원고의 완성도보다 다음 신호를 더 적극적으로 사용할 계획입니다.

- section마다 청중이 가져갈 한 문장을 먼저 말한다.
- 고유 명사보다 failure scene을 먼저 보여 준다.
- 긴 문장을 두 개의 짧은 claim으로 나눈다.
- architecture slide에는 현재 설명하는 경로만 강조한다.
- 질문을 받을 지점을 미리 만들고 pause를 둔다.

![Open Source Summit 발표 podium에서 세션을 진행한 모습](/brilly/assets/blog/ossummit-2026/photo-07.jpg)

## 컨퍼런스의 질문은 프로젝트 문서를 다시 보게 했다

글로벌 오픈소스 컨퍼런스의 장점은 발표가 끝난 뒤에도 서로 다른 운영 배경의 질문을 받을 수 있다는 점이었습니다. Kubernetes와 cloud native, embedded system, platform engineering을 다루는 사람은 같은 architecture를 다른 위험 관점에서 읽습니다.

발표를 준비하고 현장의 대화를 들으며 다음 질문이 KubeRCA 문서에서 더 선명해야 한다고 느꼈습니다.

- 어떤 query가 allowlist에 포함되고 누가 변경하는가
- log와 event 안의 untrusted text를 어떻게 다루는가
- source 하나가 실패했을 때 RCA의 confidence는 어떻게 제한되는가
- 과거 incident와 현재 evidence를 어떻게 구분하는가
- operator feedback이 다음 분석에 언제, 어떤 형태로 사용되는가

이 질문들은 발표용 FAQ로 끝나지 않습니다. architecture와 security boundary, evaluation 문서가 설명해야 할 내용입니다. 기술 발표가 프로젝트의 빈 문서를 찾는 review가 된 셈입니다.

![Open Source Summit North America 2026 현장 스폰서 보드](/brilly/assets/blog/ossummit-2026/photo-03.jpg)

## 다음 버전의 발표는 한 incident로 더 깊게 들어간다

이번 세션은 KubeRCA의 문제, ReAct loop, evidence, guardrail, operator review를 한 번에 설명했습니다. 프로젝트 전체를 소개하기에는 필요했지만, 각 단계의 실제 failure를 깊게 보여 줄 시간은 부족했습니다.

다음 버전에서는 component를 더 추가하기보다 실제 incident 하나를 중심으로 구성하려고 합니다. alert가 발생하고, 첫 가설이 evidence에 의해 반박되고, source 하나가 unavailable이 되며, 최종 RCA가 confidence를 낮추는 과정을 같은 화면과 artifact로 따라가면 “evidence-backed”가 더 구체적으로 전달될 수 있습니다.

![Open Source Summit + Embedded Linux North America 2026 행사장 안내 화면](/brilly/assets/blog/ossummit-2026/photo-08.jpg)

이번 발표에서 가장 크게 확인한 것은 기술 발표가 프로젝트를 요약하는 작업이 아니라는 점입니다. 무엇을 주장하고, 그 주장의 범위를 어디까지 제한하며, 어떤 evidence로 검토 가능하게 만들 것인지 다시 설계하는 작업입니다. KubeRCA가 제품에서 지키려 한 원칙이 발표에서도 그대로 필요했습니다.

> 세션의 공개 설명은 [Sessionize 발표 페이지](https://sessionize.com/s/bohyun-choi/troubleshooting-like-a-senior-on-day-1-react-agent/170625), 구현은 [KubeRCA GitHub 저장소](https://github.com/kube-rca/kuberca)에서 확인할 수 있습니다.
