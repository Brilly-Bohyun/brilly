---
title: "Dongduk AI and Big Data Hackathon: Design the Decision Before the Chart"
description: "How the November 1–2, 2024 hackathon turned data-led ideas into decision scenes, evidence, and measurable usage."
date: "2024-11-01"
lang: "en"
translationKey: "working-backwards-dongduk-ai-bigdata-hackathon"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "ai", "big-data", "hackathon"]
draft: false
comments: true
---

I facilitated the AI & Big Data Convergence Solution Development Hackathon at Dongduk Women's University on November 1–2, 2024. Data hackathons easily begin with an available dataset and model. This workshop reversed the order by deciding **who needed to make which decision better**.

![The Dongduk AI & Big Data Convergence Solution Development Hackathon](/brilly/assets/blog/working-backwards/linkedin/activity-36.gif)

## Replace “what can we build from this data?” with “which decision changes?”

A dataset quickly suggests familiar outputs such as dashboards, forecasts, and recommendations. Without a user and decision moment, however, more charts do not create a measurable product.

Teams began with a decision rather than a source:

```text
visualize local commercial data
→ a first-time shop owner chooses
   which of two candidate areas to visit first
```

The required data changed immediately. Instead of collecting every local indicator, teams first examined foot traffic, category density, time-of-day change, and data freshness that could affect the first choice.

## Metrics served as evidence for a hypothesis

Prediction accuracy alone did not prove customer value. A strong offline model is not enough when a user cannot understand or act on the result.

Teams separated technical and usage measures:

- model accuracy and stability;
- whether the result arrives before the decision;
- whether the user understands supporting evidence;
- whether the result changes the choice;
- whether a person can recognize a wrong result.

Demos connected a user's input to evidence, output, and decision instead of leading with one accuracy number.

## Data quality became part of the promise

Missing values, bias, refresh cycles, and label quality often appear late in AI projects. The FAQ moved them into the product promise:

- should recommendation stop when one region lacks data;
- how will stale data be disclosed;
- how is confidence limited for small samples;
- where are personal and sensitive attributes removed.

The answers created more than preprocessing tasks. They changed UI warnings, fallback flow, confidence display, and demo scope. Data quality became a condition under which the customer could trust the result.

## Leave one decision flow after two days

Two days cannot fully clean a dataset and optimize a model. Final output therefore prioritized one complete decision flow:

```text
user situation
→ required data and model output
→ evidence and limitations
→ user choice
→ next measure that validates the choice
```

Review focused on that connection rather than dataset size. When a team can explain which data changes which judgment, later model and pipeline investment can follow the same product direction.

At Dongduk, Working Backwards made “data-driven” mean starting from a user's decision and selecting data and metrics backwards—not simply building a product with more data.
