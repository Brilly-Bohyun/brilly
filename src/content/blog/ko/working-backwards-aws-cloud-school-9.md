---
title: "AWS Cloud School 9기: 첫날의 직무 질문을 둘째 날의 제품 결정으로 바꾸기"
description: "2025년 6월 21~22일 이틀 프로그램에서 커리어·기술 질문을 고객 장면, 데모 범위와 발표 기준으로 전환한 Working Backwards 기록입니다."
date: "2025-06-21"
lang: "ko"
translationKey: "working-backwards-aws-cloud-school-9"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "aws-cloud-school", "workshop", "facilitation", "customer-centricity"]
draft: false
comments: true
---

2025년 6월 21~22일 AWS Cloud School 9기 프로그램이 진행됐습니다. 첫날에는 커리어 토크와 모의면접 등 개인의 질문을 꺼내는 세션이 있었고, 둘째 날에는 팀 단위 Working Backwards 워크숍을 진행했습니다.

이 사례에서 둘째 날의 역할은 새로운 방법론을 많이 설명하는 것이 아니었습니다. 전날 나온 기술·직무 관심사를 **팀의 고객 문제와 구현 결정으로 전환하는 것**이었습니다.

![AWS Cloud School 9기 Working Backwards 워크숍 현장](/brilly/assets/blog/working-backwards/aws-cloud-school-9/workshop.jpg)

## 개인의 관심사를 팀이 검증할 문제로 바꿨다

DevOps, Kubernetes, AI, cloud architecture처럼 참여자의 관심사는 다양했습니다. 관심 기술에서 바로 아이디어를 만들면 팀 안에서도 목표가 달라질 수 있습니다. “Kubernetes를 사용한다”는 한 문장 아래에 운영 자동화, 학습, 비용, 배포 등 여러 목적이 섞이기 때문입니다.

팀은 먼저 기술 이름을 빼고 고객의 한 장면을 썼습니다. 그 뒤 각자의 기술 관심사가 그 장면의 어느 마찰을 줄일 수 있는지 연결했습니다. 연결되지 않는 기술은 중요하지 않은 것이 아니라 이번 검증의 범위 밖으로 두었습니다.

첫날의 “어떤 역량을 보여 줘야 하는가”라는 질문도 둘째 날에는 “이 프로젝트에서 어떤 기술 판단을 실제로 증명할 것인가”로 바뀌었습니다. 기술을 많이 나열하는 대신 문제, 제약, 선택, 결과를 설명할 수 있게 했습니다.

![AWS Cloud School 클래스메이트 9기 프로그램 이미지](/brilly/assets/blog/working-backwards/linkedin/activity-31.jpg)

## 짧은 세션에서는 네 질문만 반복했다

정식 문서 양식을 모두 채우게 하면 형식이 과제가 될 수 있습니다. 팀 활동에서는 다음 네 질문을 반복했습니다.

- 첫 고객은 누구인가
- 그 고객이 실패하는 구체적인 순간은 무엇인가
- 해결 뒤 고객이 확인할 변화는 무엇인가
- 그 변화를 보여 주는 데 꼭 필요한 기능은 무엇인가

새 기능이 나오면 마지막 질문으로 돌아갔습니다. 기능이 없어도 고객의 변화가 유지되면 보류했습니다. 이렇게 정한 데모는 단순한 결과 발표가 아니라 implementation scope를 지키는 기준이 됐습니다.

## 질문에 답하기보다 판단 기준을 되돌려 줬다

참여자의 질문이 많았던 세션에서는 개별 질문에 해결책을 제안하는 것보다, 팀이 다음에도 사용할 기준을 갖게 하는 것이 중요했습니다.

“이 기능도 넣어도 되는가”에는 가능 여부보다 “없으면 고객의 어떤 행동이 실패하는가”를 물었습니다. “어떤 cloud service를 써야 하는가”에는 먼저 consistency, latency, cost, authority 중 어떤 요구사항을 해결해야 하는지 확인했습니다.

퍼실리테이터가 선택을 대신하지 않으면 팀의 속도가 잠시 느려질 수 있습니다. 대신 final presentation에서 왜 이 기능과 architecture를 선택했는지 팀이 직접 설명할 수 있습니다.

## 발표는 이틀의 내용을 통합하는 테스트였다

![AWS Cloud School 세션에서 cloud architecture와 운영 맥락을 설명하는 장면](/brilly/assets/blog/working-backwards/linkedin/activity-32.jpg)

발표는 기능 목록보다 고객 장면 → 약속한 변화 → demo evidence → 기술 선택 → 남은 가정 순서로 구성했습니다. 이 순서가 연결되면 구현이 완벽하지 않아도 다음 iteration을 말할 수 있습니다.

반대로 architecture부터 설명하면 청중은 어느 component가 중요한지 판단하기 어렵습니다. 같은 기술을 사용해도 고객 문제와 검증 결과를 연결해 설명한 팀의 프로젝트가 더 선명하게 전달됐습니다.

AWS Cloud School 9기 사례에서 Working Backwards는 이틀짜리 프로그램의 한 강의가 아니었습니다. 첫날의 개인 질문을 둘째 날의 팀 결정으로 바꾸고, 그 결정을 발표에서 다시 검증하는 연결 구간이었습니다.
