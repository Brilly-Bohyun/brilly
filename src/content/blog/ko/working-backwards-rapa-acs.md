---
title: "RAPA ACS: 이틀의 해커톤을 프로젝트 판단 기록으로 남기기"
description: "2025년 1월 11~12일 Amazon Working Backwards 기반 서비스 개발 해커톤에서 기능 목록 대신 범위와 기술 결정의 이유를 남긴 기록입니다."
date: "2025-01-11"
lang: "ko"
translationKey: "working-backwards-rapa-acs"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "rapa", "acs", "project", "product-thinking"]
draft: false
comments: true
---

2025년 1월 11~12일 AWS 서울 오피스에서 RAPA ACS 참여자와 Amazon Working Backwards 기반 서비스 개발 해커톤을 진행했습니다. 이틀 안에 결과를 만들어야 하는 행사였지만, 이 사례의 목표는 기능을 많이 구현하는 것이 아니었습니다. 팀이 **무엇을 선택하고 무엇을 보류했는지 설명 가능한 기록**을 남기는 것이었습니다.

![RAPA AWS Cloud School Amazon Working Backwards 서비스 개발 해커톤 행사 배너](/brilly/assets/blog/working-backwards/rapa-acs/workshop-01.png)

## 첫 문서에 선택의 이유를 넣었다

해커톤 결과물은 흔히 “무엇을 만들었는가”로 정리됩니다. 그러나 같은 기능도 팀이 어떤 문제와 제약을 봤는지에 따라 의미가 달라집니다. 첫 문서에는 고객과 기능뿐 아니라 판단 근거를 함께 적게 했습니다.

- 가장 먼저 해결할 고객 장면
- 그 장면이 충분히 중요한 이유
- 이번 이틀 안에 검증할 한 가지 가설
- 의도적으로 보류한 고객과 기능
- 구현 전에 확인해야 할 데이터·권한·운영 가정

이 기록은 발표를 위한 설명이 아니라 중간에 scope가 흔들릴 때 돌아갈 기준이 됐습니다.

![팀이 Listen·Define·Invent·Refine 단계의 산출물을 정리한 모습](/brilly/assets/blog/working-backwards/rapa-acs/workshop-02.png)

## 작은 데모에 최소한의 인과관계를 넣었다

범위를 줄인다는 말을 화면 수를 줄이는 것으로만 이해하면 핵심이 사라집니다. 작은 데모도 고객 문제와 기술 처리가 연결돼야 합니다.

팀은 다음 연결을 끝까지 보여 주는 데 집중했습니다.

```text
고객의 입력 또는 사건
→ 서비스가 처리하는 핵심 책임
→ 고객에게 돌아오는 정보
→ 달라진 행동 또는 판단
```

이 흐름을 증명하지 않는 부가 화면과 integration은 보류했습니다. 반대로 눈에 잘 보이지 않아도 고객 약속에 필수인 validation, error handling, data freshness는 데모에 남겼습니다.

기술 선택도 “사용해 보고 싶은 서비스”가 아니라 이 연결의 어느 책임을 맡는지 설명하게 했습니다. architecture diagram은 구현 목록이 아니라 팀의 인과관계를 보여 주는 문서가 됐습니다.

## 피드백은 결정문을 수정하는 방식으로 남겼다

구두 피드백만 주면 팀은 들은 내용을 각자 다르게 기억합니다. 이번에는 질문에 답하면서 기존 문서의 어느 문장이 바뀌었는지 표시하게 했습니다.

- 고객 범위가 넓다는 피드백 → 첫 고객 문장 수정
- 데이터가 실제로 없다는 발견 → FAQ와 fallback 수정
- 데모가 효과를 보여 주지 못함 → 성공 기준 수정
- architecture가 과도함 → 보류 목록과 이유 추가

이 방식이면 최종 발표에서 처음 아이디어와 결과가 달라져도 “계획에 실패했다”가 아니라 “어떤 evidence로 결정을 바꿨다”고 설명할 수 있습니다.

![RAPA ACS 서비스 개발 해커톤 팀 발표와 결과 공유](/brilly/assets/blog/working-backwards/rapa-acs/workshop-03.png)

## 종료 시점에는 다음 iteration의 시작 조건을 적었다

행사가 끝나면 demo와 slide는 남지만, 다음 작업의 출발점은 사라지기 쉽습니다. 각 팀은 종료 기록에 다음 내용을 남겼습니다.

- 검증된 가설과 아직 추정인 부분
- 동작한 demo path와 mock 처리한 경계
- 가장 큰 기술 위험
- 다음에 수집할 사용자 또는 운영 evidence
- 보류 기능을 다시 열 조건

![RAPA ACS 해커톤 팀 활동 현장](/brilly/assets/blog/working-backwards/rapa-acs/workshop-05.png)

이 문서는 포트폴리오에도 기능 목록보다 더 많은 정보를 줍니다. 팀이 어떤 불확실성을 발견했고, 어떤 기준으로 scope를 줄였고, 어떤 기술 선택을 했는지 보여 주기 때문입니다.

RAPA ACS 사례에서 Working Backwards는 이틀짜리 행사를 장기 제품 개발처럼 보이게 포장하지 않았습니다. 짧은 시간 안에서 내린 결정을 정직하게 남겨, 다음 iteration이 다시 아이디어 단계부터 시작하지 않도록 했습니다.

> 행사 개요와 공개 기록은 [RAPA ACS Working Backwards 사례](https://www.naeilsys.com/d0950f29-5d6e-400a-a1cd-5c0abd7d5eac)에서도 확인할 수 있습니다.
