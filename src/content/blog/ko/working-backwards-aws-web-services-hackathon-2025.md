---
title: "Amazon Web Services Hackathon 2025: 하루 안에 서비스의 첫 약속 정하기"
description: "2025년 3월 29일 AWS 서울 오피스에서 고객 장면과 press release를 이용해 하루의 구현 범위를 정한 Working Backwards 기록입니다."
date: "2025-03-29"
lang: "ko"
translationKey: "working-backwards-aws-web-services-hackathon-2025"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "aws", "hackathon", "service-design", "customer-centricity"]
draft: false
comments: true
---

2025년 3월 29일 AWS 서울 오피스에서 Amazon Web Services Hackathon을 진행했습니다. 하루짜리 해커톤에서는 구현 가능한 기능보다 떠오르는 기능이 훨씬 많습니다. 이번에는 팀이 기술을 선택하기 전에 **오늘 고객에게 증명할 첫 약속**을 press release 한 문장으로 고정했습니다.

![Amazon Web Services Hackathon 2025 Working Backwards 배너](/brilly/assets/blog/working-backwards/linkedin/activity-30.jpg)

## Press release를 구현의 종료 조건으로 사용했다

보도자료를 미래의 홍보문으로 쓰면 “혁신적이고 편리한 플랫폼” 같은 문장이 남습니다. 해커톤에서는 고객이 서비스를 사용한 뒤 실제로 무엇을 할 수 있게 되는지 결과형으로 적었습니다.

```text
누가 + 어느 순간에 + 무엇을 더 잘 결정한다
```

문장이 완성되면 기능의 우선순위를 판단할 수 있었습니다. 첫 약속을 증명하지 않는 관리자 화면, 확장 기능, 다중 사용자 흐름은 보류할 수 있었습니다. 반대로 결과를 신뢰하는 데 꼭 필요한 근거와 error state는 눈에 덜 띄어도 데모 범위에 들어갔습니다.

press release는 아이디어를 크게 보이게 만드는 문서가 아니라 “여기까지 되면 오늘의 실험은 끝난다”는 계약이 됐습니다.

## 데모는 고객과 서비스 사이의 최소 계약이었다

![Amazon Web Services Hackathon 2025 참가자 단체 사진](/brilly/assets/blog/working-backwards/linkedin/activity-29.jpg)

팀은 데모를 화면 tour가 아니라 하나의 서비스 흐름으로 만들었습니다.

```text
고객이 문제 또는 요청을 입력한다
→ 시스템이 핵심 처리를 수행한다
→ 결과와 필요한 근거를 돌려준다
→ 고객이 다음 행동을 선택한다
```

마지막 화면에 model response나 점수만 있으면 약속이 끝나지 않습니다. 그 결과로 고객이 어떤 결정을 내리는지, 결과가 부족하거나 틀릴 때 무엇을 할 수 있는지까지 보여 줘야 했습니다.

이 계약은 구현 중 기능을 걷어 내는 기준으로도 사용했습니다. 기능이 없어도 고객의 다음 행동이 유지된다면 이번 범위에서 제외했습니다. 보류 이유를 남겨 해커톤 뒤에 다시 검토할 수 있게 했습니다.

## Architecture는 약속을 지키는 책임만 남겼다

클라우드 해커톤에서는 익숙한 서비스를 diagram에 빠르게 추가할 수 있습니다. 각 component에는 “이 요소가 없으면 press release의 어느 문장이 깨지는가”를 물었습니다.

즉시 결과가 필요한 장면이면 latency와 timeout이 요구사항이 됐고, 나중에 확인해도 되는 결과라면 asynchronous processing과 notification을 선택할 수 있었습니다. 민감한 입력을 다루면 authentication과 storage boundary가 핵심이 됐습니다. 고객 약속과 연결되지 않는 운영 복잡도는 첫날의 구현이 아니라 FAQ와 다음 단계로 이동했습니다.

architecture를 줄이는 것은 production을 무시하는 일이 아니었습니다. 오늘 증명할 최소 경로와 실제 사용자에게 확장하기 전 검증할 운영 경로를 구분하는 일이었습니다.

## 심사 질문을 다음 backlog로 바꿨다

발표는 고객의 현재 장면 → 첫 약속 → 실제 데모 → architecture의 책임 → 아직 검증하지 못한 위험 순서로 진행했습니다. 질문을 받았을 때 답을 꾸며 내기보다 FAQ에 남기게 했습니다.

- 외부 API가 실패하면 무엇을 보여 줄 것인가
- 필요한 데이터가 충분하지 않으면 약속을 어떻게 제한할 것인가
- AI 결과가 틀렸을 때 사용자가 알아차릴 수 있는가
- 실제 운영에서 누가 승인하고 누가 rollback하는가

이 질문들은 해커톤의 미완성 목록이 아니라 다음 제품 실험의 기술 backlog가 됐습니다. 당일 mock으로 처리한 경계와 실제 연동이 필요한 경계를 분리할 수 있었습니다.

Amazon Web Services Hackathon 2025에서 Working Backwards는 아이디어를 작게 만드는 제약이 아니었습니다. 하루 동안 증명 가능한 약속을 정하고, **문서·구현·architecture·발표가 같은 약속을 가리키게 하는 운영 방식**이었습니다.
