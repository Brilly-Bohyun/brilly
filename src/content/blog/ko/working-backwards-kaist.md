---
title: "KAIST: 기술 실험에 제품 종료 조건을 붙이기"
description: "2025년 9월과 10월 KAIST Working Backwards 세션에서 기술적 가능성과 사용자 가치의 검증을 분리하고 실험 종료 조건을 만든 기록입니다."
date: "2025-10-15"
lang: "ko"
translationKey: "working-backwards-kaist"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "kaist", "technology-validation", "workshop"]
draft: false
comments: true
---

2025년 9월과 10월에 걸쳐 KAIST에서 진행한 Working Backwards 세션은 기술적 가능성과 제품 가치를 의도적으로 분리하는 데 집중했습니다. 새로운 model이나 infrastructure를 다루는 팀은 먼저 “가능한가”를 확인합니다. 하지만 가능하다는 결과가 누구에게 어떤 변화를 만드는지는 별도의 가설입니다.

이 사례의 핵심 산출물은 기능 목록이나 press release가 아니라 **실험을 계속할지 멈출지 판단하는 종료 조건**이었습니다.

![KAIST Working Backwards 워크숍에서 팀이 고객 장면과 기술 가설을 검토하는 모습](/brilly/assets/blog/working-backwards/kaist/team-work-01.jpg)

## 기술 가설과 제품 가설을 다른 문장으로 썼다

팀은 하나의 아이디어를 두 가설로 나눴습니다.

```text
기술 가설: 이 데이터와 model로 필요한 정확도와 latency를 달성할 수 있다.
제품 가설: 그 결과가 특정 사용자의 결정 시간이나 오류를 줄인다.
```

기술 가설만 맞으면 demo는 동작하지만 제품은 필요 없을 수 있습니다. 제품 가설만 매력적이면 약속을 구현할 방법이 없을 수 있습니다. 두 문장을 분리하면 실패한 실험이 어느 쪽의 정보를 갱신했는지 알 수 있습니다.

예를 들어 model accuracy가 낮은 결과는 기술 접근을 바꿀 이유가 되지만, 사용자가 결과를 이해하지 못한 결과는 interface와 문제 정의를 바꿀 이유가 됩니다. 모두 “성능이 부족하다”로 묶으면 다음 experiment가 모호해집니다.

## 각 실험에 종료 조건을 붙였다

연구와 기술 탐색에서는 더 많은 개선 가능성이 항상 남습니다. 그래서 “가능한 만큼 계속한다”가 아니라 이번 iteration의 판단에 필요한 threshold를 먼저 정했습니다.

- 어느 수준의 accuracy 아래에서는 다른 접근을 검토할 것인가
- 어느 latency를 넘으면 고객의 사용 장면이 깨지는가
- 어떤 data coverage가 없으면 결과를 제공하지 않을 것인가
- 사용자가 어떤 행동을 보이면 제품 가설을 지지한다고 볼 것인가

종료 조건은 실패를 빨리 선언하기 위한 것이 아닙니다. 충분한 evidence가 모인 뒤에도 같은 실험을 반복해 제품 결정을 미루지 않게 하는 장치입니다.

![KAIST 팀별 토론에서 Today statement와 실험 조건을 맞추는 모습](/brilly/assets/blog/working-backwards/kaist/team-work-02.jpg)

## 9월의 질문을 10월의 결정과 연결했다

여러 차례 진행되는 세션에서는 이전 workshop의 문서가 다음 회의에서 사용되지 않는 문제가 생깁니다. 9월에 남긴 가설과 unknown을 10월에 다시 열어 실제로 무엇이 확인됐는지 비교했습니다.

결과는 세 종류로 나눴습니다.

- **지지됨** — 현재 evidence가 가설을 계속 유지할 이유를 준다
- **반박됨** — 접근이나 고객 문제를 바꿀 evidence가 있다
- **아직 모름** — data 또는 experiment 설계가 부족해 판단할 수 없다

“아직 모름”을 실패나 긍정으로 바꾸지 않는 것이 중요했습니다. 다음 실험은 unknown을 줄일 때만 추가했고, 단순히 model을 더 학습시키는 반복은 보류할 수 있었습니다.

## 발표에는 불확실성과 다음 판단을 포함했다

기술 발표에서는 가장 좋은 결과만 보여 주기 쉽습니다. 이번 발표 구조에는 성공한 demo뿐 아니라 가설, experiment condition, 관찰, limitation과 다음 결정을 넣었습니다.

architecture도 이 순서를 따랐습니다. 어떤 component가 어떤 기술 가설을 검증하고, 어느 measurement가 제품 가설을 확인하는지 연결했습니다. component 수가 아니라 검증 경로의 완결성이 평가 기준이 됐습니다.

![KAIST Working Backwards 워크숍 전경](/brilly/assets/blog/working-backwards/kaist/workshop.jpg)

KAIST 사례에서 Working Backwards는 연구를 고객 문장으로 단순화하는 방법이 아니었습니다. 기술 탐색이 언제 제품 evidence로 이어지고, 어느 조건에서 다음 접근으로 이동해야 하는지를 명시하는 방법이었습니다. **좋은 실험은 결과뿐 아니라 다음 결정을 남깁니다.**
