---
title: "RAPA ACS: Leaving a Decision Record from a Two-Day Hackathon"
description: "How the January 11–12, 2025 Working Backwards service hackathon recorded scope and technology decisions instead of only features."
date: "2025-01-11"
lang: "en"
translationKey: "working-backwards-rapa-acs"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "rapa", "acs", "project", "product-thinking"]
draft: false
comments: true
---

On January 11–12, 2025, RAPA ACS participants joined an Amazon Working Backwards-based service development hackathon at the AWS Seoul office. The event required a result in two days, but its purpose was not maximum feature count. It was to leave a record that explained **what each team selected and deliberately deferred**.

![The RAPA AWS Cloud School Amazon Working Backwards service hackathon banner](/brilly/assets/blog/working-backwards/rapa-acs/workshop-01.png)

## Put the reason for selection in the first document

Hackathon outcomes are often summarized as “what we built.” The same feature, however, means something different depending on the problem and constraint.

The first record included:

- the first customer scene;
- why the scene deserved attention;
- one hypothesis testable in two days;
- customers and features intentionally deferred;
- data, authority, and operating assumptions to verify.

This was not merely presentation copy. It became the reference when scope changed during implementation.

![A team organizing Listen, Define, Invent, and Refine artifacts](/brilly/assets/blog/working-backwards/rapa-acs/workshop-02.png)

## Keep a minimal causal chain in the small demo

Reducing scope is not the same as reducing screen count. A small demo still needs to connect customer problem and technical behavior:

```text
customer input or event
→ essential service responsibility
→ information returned
→ changed action or judgment
```

Secondary screens and integrations that did not prove this path were deferred. Validation, error handling, and data freshness stayed when the promise depended on them, even if they were less visible.

Every technology choice also needed to own one responsibility in the chain. The architecture diagram became an explanation of causality rather than an implementation inventory.

## Record feedback as a changed decision

Verbal feedback is remembered differently by each team member. Teams therefore marked which sentence changed after each review:

- customer too broad → revise the first-customer statement;
- required data unavailable → revise FAQ and fallback;
- demo fails to show an effect → revise success measure;
- architecture too large → add deferred items and reasons.

The final presentation could then explain a changed idea as a decision based on evidence rather than a failure to follow the original plan.

![RAPA ACS teams sharing hackathon outcomes](/brilly/assets/blog/working-backwards/rapa-acs/workshop-03.png)

## End with conditions for the next iteration

After an event, demos and slides remain while the next starting point disappears. Each team closed with:

- validated hypotheses and remaining assumptions;
- working demo paths and mocked boundaries;
- the largest technical risk;
- the next customer or operating evidence to collect;
- conditions that would reopen deferred features.

![RAPA ACS teams working during the hackathon](/brilly/assets/blog/working-backwards/rapa-acs/workshop-05.png)

The record also communicated more than a portfolio feature list. It showed which uncertainty the team found, how scope changed, and why technology was chosen.

Working Backwards did not make the two-day RAPA ACS event look like a mature product program. It preserved short-term decisions honestly so the next iteration would not restart from the idea stage.

> The public event overview is also available in the [RAPA ACS Working Backwards record](https://www.naeilsys.com/d0950f29-5d6e-400a-a1cd-5c0abd7d5eac).
