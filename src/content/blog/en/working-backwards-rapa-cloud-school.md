---
title: "RAPA Cloud School Cohorts 5 and 6: Connecting Architecture and Presentation to One Customer Promise"
description: "A record of connecting a project architecture session with Working Backwards facilitation and final review on August 3–4, 2024."
date: "2024-08-03"
lang: "en"
translationKey: "working-backwards-rapa-cloud-school"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "rapa", "cloud-school", "architecture"]
draft: false
comments: true
---

On August 3–4, 2024, I worked with RAPA AWS Cloud School cohorts 5 and 6. The first day covered architecture and implementation lessons from projects developed through a 6.5-month program, along with how to explain project decisions. The second day supported Working Backwards teams and reviewed final outcomes.

Putting the sessions together exposed a recurring issue: cloud architecture diagrams grow quickly, but if the customer promise remains unclear, the diagram and presentation tell different stories.

![Sharing project architecture with RAPA Cloud School cohorts 5 and 6](/brilly/assets/blog/working-backwards/rapa-cloud-school/workshop-01.jpg)

## Explain the order of decisions, not only the final architecture

Leading with an AWS service list communicates technical breadth but rarely explains why the system needed that shape. The session instead followed these questions:

- which customer scene was failing;
- which one flow the demo attempted to prove;
- which responsibilities that flow required;
- which broken assumption changed the architecture;
- what remained outside the project and why.

This is not a polished success narrative. It makes additions and rejected choices traceable. An event-driven design, for example, should connect to a customer wait-time or recovery requirement rather than being justified only as “more scalable.”

Architecture became a map of requirements and risks rather than a finished-product illustration. If a box answered neither a customer promise nor an FAQ risk, its place in the first version needed another review.

## Review the gap between idea and diagram

![Participants listening to the project and architecture session](/brilly/assets/blog/working-backwards/rapa-cloud-school/workshop-02.jpg)

Many participants already knew a broad set of cloud services. The Working Backwards work therefore focused less on service explanation and more on whether the press-release promise matched the actual architecture.

When a team wrote “provide personalized information in real time,” the review asked what needed to be real time, which delay would break the experience, whether personalization data existed, and what happened when it did not.

Architecture sometimes grew after those questions, but it often became smaller. Streaming, multi-region design, and complex authorization could be deferred when the first demo did not test them, leaving a complete path through the customer flow.

## Treat the demo as promise validation

![A RAPA Cloud School team sharing its idea and demo flow](/brilly/assets/blog/working-backwards/rapa-cloud-school/workshop-03.jpg)

“The service was deployed” can easily become the conclusion of a cloud-project demo. A responding endpoint, however, is different from a reduced customer problem.

Final review followed input → essential processing → customer decision. What did the customer provide? What happened? Which decision became faster or more accurate? Error paths and operating assumptions remained visible.

Presentation skill was not an unrelated soft skill here. It acted as a final integration test for the relationship among problem, technology choice, and demo result. Teams that made that relationship explicit communicated similar implementation work much more clearly.

## Leave presentation and technical documentation in the same shape

The reusable outcome was more than a slide deck. Keeping customer scene, success measure, architectural responsibility, deferred risk, and demo result in the same order creates a design record for the next iteration.

Adding “why is this component needed now?” and “which promise breaks without it?” to each component made later technology discussions requirement-led rather than novelty-led.

At RAPA Cloud School, Working Backwards connected more than idea and implementation. It joined **customer promise, architecture, demo, and presentation** into one explainable project.

> The original event record is also available in the [LinkedIn post](https://kr.linkedin.com/posts/bohyunchoi_cloudschool-activity-7226216108159029249-YUWH).
