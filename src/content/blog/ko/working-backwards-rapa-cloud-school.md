---
title: "RAPA Cloud School 5·6기: 아키텍처와 발표를 하나의 고객 약속으로 연결하기"
description: "2024년 8월 3~4일 RAPA Cloud School 5·6기에서 프로젝트 아키텍처 공유와 Working Backwards 심사를 연결한 기록입니다."
date: "2024-08-03"
lang: "ko"
translationKey: "working-backwards-rapa-cloud-school"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "rapa", "cloud-school", "architecture"]
draft: false
comments: true
---

2024년 8월 3~4일 RAPA AWS Cloud School 5·6기 참여자와 이틀을 보냈습니다. 첫날에는 6.5개월 과정에서 수행한 프로젝트의 아키텍처와 구현·운영 과정, 프로젝트 설명 방식을 공유했고, 둘째 날에는 Working Backwards 팀 활동을 지원하고 최종 결과를 검토했습니다.

두 세션을 이어서 보니 한 가지 문제가 선명했습니다. 클라우드 프로젝트는 architecture diagram을 크게 그리기 쉽지만, 고객에게 어떤 변화를 약속하는지 설명하지 못하면 다이어그램과 발표가 서로 다른 이야기를 한다는 점입니다.

![RAPA Cloud School 5·6기 세션에서 프로젝트 아키텍처를 공유하는 모습](/brilly/assets/blog/working-backwards/rapa-cloud-school/workshop-01.jpg)

## 첫날에는 완성된 아키텍처보다 결정의 순서를 설명했다

프로젝트를 소개할 때 AWS 서비스 목록을 먼저 보여 주면 기술적 폭은 전달되지만, 왜 그 구성이 필요했는지는 잘 남지 않습니다. 그래서 결과 다이어그램보다 다음 질문의 순서로 설명했습니다.

- 고객이 실패하던 장면은 무엇이었는가
- 데모에서 어떤 흐름 하나를 증명하려 했는가
- 그 흐름을 위해 어떤 책임을 분리했는가
- 구현 중 어떤 가정이 깨져 architecture를 바꿨는가
- 끝까지 넣지 못한 것은 무엇이며 왜 보류했는가

이 구조는 프로젝트의 성공담을 만드는 방식이 아닙니다. component를 추가하거나 포기한 판단을 추적하게 하는 방식입니다. 예를 들어 event-driven 처리를 도입했다면 “확장성이 좋아서”보다 고객이 기다리지 않아야 하는 흐름과 실패 시 복구 요구를 함께 설명해야 합니다.

아키텍처는 완성된 제품의 그림이 아니라 요구사항과 위험의 지도에 가까웠습니다. diagram의 각 박스가 고객 약속 또는 FAQ의 질문에 답하지 못하면, 첫 버전에서 그 박스가 필요한지 다시 봐야 했습니다.

## 둘째 날에는 아이디어와 다이어그램 사이를 검토했다

![RAPA Cloud School 5·6기 참여자가 프로젝트 세션을 듣는 모습](/brilly/assets/blog/working-backwards/rapa-cloud-school/workshop-02.jpg)

Working Backwards 팀 활동에서는 이미 여러 cloud service를 알고 있는 참여자가 많았습니다. 따라서 기술 설명보다 press release의 고객 약속과 실제 architecture가 연결되는지 확인하는 데 시간을 썼습니다.

팀의 문서에 “실시간으로 맞춤 정보를 제공한다”고 적혀 있으면 다음을 물었습니다. 무엇이 실시간이어야 하는가, 몇 초의 지연이 고객 경험을 깨뜨리는가, personalization에 필요한 데이터는 실제로 있는가, 데이터가 비면 서비스는 어떻게 동작하는가.

질문에 답하면서 architecture는 더 커지기도 했지만 자주 작아졌습니다. first demo에서 증명하지 않는 streaming, 다중 리전, 복잡한 권한 모델은 보류하고, 고객 흐름을 끝까지 연결하는 경로에 집중할 수 있었습니다.

## 데모는 배포 성공이 아니라 약속 검증이었다

![RAPA Cloud School Working Backwards 팀이 아이디어와 데모 흐름을 공유하는 모습](/brilly/assets/blog/working-backwards/rapa-cloud-school/workshop-03.jpg)

클라우드 프로젝트에서는 “서비스가 배포됐다”가 데모의 결론이 되기 쉽습니다. 하지만 endpoint가 응답한다는 사실과 고객 문제가 줄었다는 사실은 다릅니다.

최종 결과에서는 입력 → 처리 → 고객 결정의 연결을 봤습니다. 사용자가 무엇을 넣고, 어떤 핵심 처리가 일어나며, 이전보다 무엇을 더 빠르거나 정확하게 결정하는지를 발표 안에서 확인했습니다. error path와 운영 가정도 숨기지 않게 했습니다.

이때 발표 능력은 부가적인 soft skill이 아니었습니다. 팀이 문제, 기술 선택, 데모 결과를 한 인과관계로 설명할 수 있는지 확인하는 마지막 integration test에 가까웠습니다. 구현은 비슷해도 이 연결을 명확히 보여 준 팀의 아이디어가 더 선명하게 전달됐습니다.

## 발표 자료와 기술 문서를 같은 구조로 남겼다

행사가 끝난 뒤 재사용할 수 있는 산출물은 발표 슬라이드만이 아니었습니다. 고객 장면, 성공 기준, architecture 책임, 보류한 위험, 데모 결과를 같은 순서로 남기면 다음 iteration의 설계 문서가 됩니다.

특히 component마다 “왜 지금 필요한가”와 “없으면 어느 고객 약속이 깨지는가”를 적는 방식이 유용했습니다. 새로운 서비스를 추가할 때도 기술적 흥미가 아니라 요구사항과 운영 위험을 기준으로 토론할 수 있기 때문입니다.

RAPA Cloud School 5·6기 사례에서 Working Backwards가 연결한 것은 아이디어와 구현만이 아니었습니다. **고객 약속, architecture, demo, presentation**을 하나의 설명 가능한 프로젝트로 묶는 일이었습니다.

> 당시 공개한 행사 기록은 [LinkedIn 원문](https://kr.linkedin.com/posts/bohyunchoi_cloudschool-activity-7226216108159029249-YUWH)에서도 확인할 수 있습니다.
