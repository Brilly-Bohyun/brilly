---
title: "POSTECH: FAQ를 기술 위험 등록부로 바꾸기"
description: "2025년 11월 28일 POSTECH Working Backwards 워크숍에서 기술 아이디어를 제품 가설로 바꾸고 FAQ로 첫 backlog를 만든 기록입니다."
date: "2025-11-28"
lang: "ko"
translationKey: "working-backwards-postech"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "postech", "product-hypothesis", "workshop"]
draft: false
comments: true
---

2025년 11월 28일 POSTECH 환동해 글로컬 연합 아카데미에서 Working Backwards 워크숍을 진행했습니다. 기술 아이디어가 빠르게 나오는 팀에게는 발산 방법보다, 구현 전에 **어떤 가정이 제품을 무너뜨릴 수 있는지 드러내는 멈춤**이 더 필요했습니다.

이번 사례에서는 press release보다 FAQ를 중심 산출물로 사용했습니다. FAQ를 예상 질문에 답하는 부록이 아니라 첫 기술 위험 등록부와 backlog로 바꿨습니다.

![POSTECH 환동해 글로컬 연합 아카데미 Working Backwards 워크숍 안내 배너](/brilly/assets/blog/working-backwards/postech/banner.jpg)

## 기술 아이디어를 세 개의 가설로 분리했다

“AI가 분석해 맞춤형 결과를 제공한다”는 문장에는 서로 다른 가정이 섞여 있습니다. 팀은 이를 세 가지로 나눴습니다.

- **문제 가설** — 첫 고객이 이 문제를 실제로 중요하게 겪는다
- **가치 가설** — 제안한 결과가 고객의 행동 또는 판단을 바꾼다
- **기술 가설** — 필요한 data, model, latency와 cost로 그 결과를 만들 수 있다

가설을 분리하면 하나의 성공한 demo가 모든 것을 증명하지 못한다는 점이 보입니다. model이 동작해도 사용자가 필요로 하지 않을 수 있고, 사용자 반응이 좋아도 data 권한이나 운영 비용 때문에 확장할 수 없을 수 있습니다.

![POSTECH 팀이 문제·고객·데모 약속을 정리하는 장면](/brilly/assets/blog/working-backwards/postech/team-work-01.jpg)

## FAQ를 위험과 검증 방법의 쌍으로 썼다

FAQ에는 답을 아는 질문만 쓰지 않았습니다. 현재의 가장 약한 가정을 드러내고, 어떻게 확인할지 함께 적었습니다.

| 질문 | 제품을 깨뜨리는 위험 | 첫 검증 |
| --- | --- | --- |
| 필요한 데이터가 없으면? | 핵심 결과를 만들 수 없음 | 표본과 접근 권한 확인 |
| model이 틀리면? | 사용자가 잘못된 행동을 함 | confidence와 human review 설계 |
| 응답이 늦으면? | 사용 순간을 놓침 | target latency와 fallback 측정 |
| 사용자가 믿지 않으면? | 결과가 행동으로 이어지지 않음 | 근거 표시 prototype test |

이 표가 첫 backlog가 됐습니다. 기능 구현 순서는 눈에 보이는 화면보다 고객 약속을 가장 크게 깨뜨릴 위험을 먼저 줄이는 순서로 정할 수 있었습니다.

## 데모는 가장 위험한 가정 하나를 겨냥했다

![POSTECH 팀 토론에서 기능 목록보다 고객 장면과 검증 질문을 맞추는 과정](/brilly/assets/blog/working-backwards/postech/team-work-02.jpg)

모든 가설을 한 demo에 넣지 않았습니다. 팀마다 이번 일정에서 가장 불확실하고 중요한 가정 하나를 골랐습니다.

data가 핵심 위험이면 실제 sample로 pipeline을 확인하고, 사용자의 신뢰가 위험이면 결과와 근거를 함께 보여 주는 interaction을 test했습니다. 기술 feasibility가 이미 확인됐다면 model demo를 반복하는 대신 고객이 결과를 이용해 판단하는지 봤습니다.

작은 demo의 기준은 기능이 적다는 것이 아니라 무엇을 확인했는지 분명하다는 것이었습니다. mock과 실제 구현의 경계도 발표에서 구분했습니다.

## 발표 뒤의 질문을 다음 sprint에 연결했다

발표는 아이디어를 방어하는 시간이 아니라 FAQ를 확장하는 시간이었습니다. 청중의 질문이 새로운 risk를 드러내면 “나중에 고려하겠다”로 끝내지 않고 owner, 검증 방법, 결과에 따른 결정을 적었습니다.

예를 들어 privacy 질문은 data masking과 retention task로, 비용 질문은 usage assumption과 budget threshold로, 잘못된 추천 질문은 human review와 safe fallback으로 이어졌습니다.

![POSTECH Working Backwards 워크숍 전경](/brilly/assets/blog/working-backwards/postech/workshop.jpg)

POSTECH 사례에서 Working Backwards는 아이디어를 고객 문장으로 바꾸는 데서 끝나지 않았습니다. 제품 가설을 깨뜨릴 수 있는 질문을 앞당기고, 그 질문을 **architecture와 첫 sprint가 실제로 처리할 risk backlog**로 바꾸는 데 초점을 맞췄습니다.
