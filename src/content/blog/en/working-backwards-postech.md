---
title: "POSTECH: Turning the FAQ into a Technical Risk Register"
description: "How the November 28, 2025 POSTECH workshop separated product hypotheses and converted FAQ questions into the first technical backlog."
date: "2025-11-28"
lang: "en"
translationKey: "working-backwards-postech"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "postech", "product-hypothesis", "workshop"]
draft: false
comments: true
---

On November 28, 2025, I facilitated a Working Backwards workshop at the POSTECH East Coast Glocal Alliance Academy. Teams that generate technology ideas quickly often need less help with ideation and more help pausing to expose **which assumption could break the product before implementation**.

The FAQ became the central artifact. It was not an appendix of anticipated questions; it became the first technical risk register and backlog.

![The POSTECH East Coast Glocal Alliance Academy Working Backwards workshop banner](/brilly/assets/blog/working-backwards/postech/banner.jpg)

## Split a technology idea into three hypotheses

“AI analyzes data and provides a personalized result” mixes several assumptions. Teams separated:

- **problem hypothesis** — the first customer experiences this as an important problem;
- **value hypothesis** — the result changes customer behavior or judgment;
- **technical hypothesis** — available data, model, latency, and cost can produce that result.

A successful demo does not validate all three. A model can work for a product nobody needs. Users may like an experience that cannot scale under data authority or operating cost.

![A POSTECH team organizing problem, customer, and demo promise](/brilly/assets/blog/working-backwards/postech/team-work-01.jpg)

## Write each FAQ as risk plus validation

The FAQ included unknowns and paired each with a first check:

| Question | Product risk | First validation |
| --- | --- | --- |
| What if required data is absent? | Core output cannot be produced | Verify sample and access |
| What if the model is wrong? | User takes a harmful action | Design confidence and human review |
| What if the response is late? | The usage moment is missed | Measure target latency and fallback |
| What if the user does not trust it? | Output does not change behavior | Test an evidence-display prototype |

This table became the first backlog. Work could reduce the risk most likely to break the customer promise rather than prioritizing the most visible screen.

## Aim the demo at the riskiest assumption

![A POSTECH team aligning customer scenes and validation questions](/brilly/assets/blog/working-backwards/postech/team-work-02.jpg)

One demo did not need to contain every hypothesis. Each team selected the most uncertain and consequential assumption.

When data was the risk, the demo tested a pipeline with a real sample. When trust was the risk, it tested an interaction that displayed result and evidence. When feasibility was already known, it stopped repeating a model demo and observed whether the result changed a user's decision.

A small demo was defined by clarity about what it proved, not by low feature count. Mocked and implemented boundaries were disclosed in the presentation.

## Connect presentation questions to the next sprint

The presentation expanded the FAQ instead of defending the original idea. A new risk gained an owner, validation method, and decision consequence.

Privacy questions became masking and retention tasks. Cost questions became usage assumptions and budget thresholds. Wrong-recommendation questions became human review and safe fallback.

![The POSTECH Working Backwards workshop](/brilly/assets/blog/working-backwards/postech/workshop.jpg)

At POSTECH, Working Backwards went beyond rewriting an idea in customer language. It moved product-breaking questions earlier and converted them into a **risk backlog that architecture and the first sprint could actually address**.
