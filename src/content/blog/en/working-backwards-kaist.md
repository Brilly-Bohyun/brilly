---
title: "KAIST: Adding Product Exit Conditions to Technical Experiments"
description: "How 2025 KAIST sessions separated technical feasibility from user value and created explicit experiment stopping conditions."
date: "2025-10-15"
lang: "en"
translationKey: "working-backwards-kaist"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "kaist", "technology-validation", "workshop"]
draft: false
comments: true
---

Working Backwards sessions at KAIST across September and October 2025 deliberately separated technical feasibility from product value. A team working with a new model or infrastructure first asks whether something is possible. Whether that result changes a user's outcome is a different hypothesis.

The central artifact was not a feature list or press release. It was an **exit condition for deciding whether an experiment should continue**.

![A KAIST team reviewing customer scenes and technical hypotheses](/brilly/assets/blog/working-backwards/kaist/team-work-01.jpg)

## Write technical and product hypotheses separately

Teams split one idea into two statements:

```text
technical: this data and model can reach the required accuracy and latency
product: the result reduces decision time or error for a specific user
```

A correct technical hypothesis can still produce an unwanted product. An attractive product hypothesis may lack a viable implementation. Separating them shows which knowledge changed after a failed experiment.

Low accuracy may require a different technical approach. A user who cannot understand the output points instead to interface or problem definition. Calling both “performance problems” produces an unclear next experiment.

## Attach an exit condition to each experiment

Research and technology exploration always leave another possible improvement. The session defined thresholds needed for this iteration's decision:

- below which accuracy should another approach be considered;
- above which latency does the usage scene break;
- which data coverage is required before showing a result;
- which user behavior would support the product hypothesis.

An exit condition does not declare failure early. It prevents repeated experimentation from postponing a product decision after enough evidence exists.

![KAIST team discussion aligning Today statements and experiment conditions](/brilly/assets/blog/working-backwards/kaist/team-work-02.jpg)

## Connect September questions to October decisions

Multi-session workshops often leave earlier documents unused. September hypotheses and unknowns were reopened in October and compared with actual observations.

Results fell into three states:

- **supported** — current evidence justifies keeping the hypothesis;
- **refuted** — evidence calls for another approach or problem;
- **unknown** — data or experiment design remains insufficient.

“Unknown” was not converted into success or failure. Another experiment was added only when it could reduce that uncertainty; repeating model training without a decision consequence could be deferred.

## Present uncertainty and the next judgment

Technical presentations tend to show only the strongest result. Here, the structure included hypothesis, experiment condition, observation, limitation, and next decision.

Architecture followed the same order. Each component connected to a technical hypothesis, and each measurement connected to the product hypothesis. Completeness of the validation path mattered more than component count.

![The KAIST Working Backwards workshop](/brilly/assets/blog/working-backwards/kaist/workshop.jpg)

At KAIST, Working Backwards did not simplify research into a customer slogan. It made explicit when technical exploration became product evidence and when a team should move to another approach. **A good experiment leaves a next decision, not only a result.**
