---
title: "Youngnam Technical High School AI Hackathon: Design the Action After the AI Output"
description: "How the November 7, 2025 hackathon designed evidence, failure paths, and the user's next decision before optimizing model output."
date: "2025-11-07"
lang: "en"
translationKey: "working-backwards-youngnam-technical-high-school"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "ai", "hackathon", "education"]
draft: false
comments: true
---

On November 7, 2025, I facilitated Working Backwards at the Youngnam Technical High School AWS AI Service Development Hackathon. AI projects are easily explained through model behavior: answer a question, classify an image, or provide a recommendation.

This workshop decided **what a person should do after receiving the result** before focusing on the output itself.

![The Youngnam Technical High School AWS AI Service Development Hackathon](/brilly/assets/blog/working-backwards/youngnam-technical-high-school/workshop.jpg)

## Rewrite an AI feature as a user decision

“AI recommends a career” does not define required data or a safety boundary. The product differs depending on whether the user is a student or teacher and whether recommendation begins exploration or replaces a final choice.

Teams rewrote it as:

```text
user provides a situation
→ AI returns a result with supporting evidence
→ user takes a specific low-risk next action
```

The final action revealed which statements the model could make and which required human confirmation.

## Put input, evidence, decision, and failure in the demo

An AI demo often shows one ideal example. This one also designed the path where a result could not be produced:

- request more information when input is insufficient;
- disclose low confidence;
- let the user inspect recommendation evidence;
- stop harmful or high-risk requests;
- hand a decision to the appropriate person rather than execute it.

These were not presentation edge cases. They defined the first product boundary. High model accuracy did not complete a service when a failed result left the user without a safe next action.

## Use the FAQ to name automation outside scope

A short hackathon cannot build every safety requirement. The FAQ explicitly recorded decisions AI should not make. For high-impact choices involving career, health, money, or safety, the product could organize information and questions while leaving final judgment to a person.

This did not weaken the feature. It clarified what the first demo could responsibly promise. Comparing options or generating the next question could be more valuable than unsupported certainty.

## Present user before and after, not a model tour

Presentations followed the user's previous behavior, information and evidence supplied by AI, changed next action, and remaining human check. Model and cloud architecture appeared as responsibilities enabling that flow.

At Youngnam, Working Backwards moved the first decision from “which AI should we use?” to “where should AI help and where should it stop?” Product quality appeared in the **user action after the result and the safe path after failure**, not only in model output.
