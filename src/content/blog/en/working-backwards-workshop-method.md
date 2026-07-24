---
title: "Applying Working Backwards to Technical Workshops"
description: "A practical method for connecting customer problems and success scenes to documents, demos, architecture, and workshop feedback."
date: "2024-06-23"
lang: "en"
translationKey: "working-backwards-workshop-method"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "workshop", "product-thinking", "education"]
draft: false
comments: true
---

Technical workshop teams often agree on technology before they agree on the problem. Everyone may say “AI recommendation service” or “cloud dashboard,” while imagining different customers and success scenes. Implementation begins, but API, UI, and presentation quietly move toward different products.

I use Working Backwards not to package an idea, but to make **whose moment should change and what the demo must prove** a shared implementation contract.

![A KAIST Working Backwards workshop where teams discuss customer scenes and hypotheses](/brilly/assets/blog/working-backwards/kaist/workshop.jpg)

## Four documents form one decision flow

The workshop uses a small set of connected artifacts:

- **Today statement** — where and why the customer fails today;
- **Press release** — what changes in the customer's day after the solution;
- **FAQ** — which product, technical, and operational assumptions could break the promise;
- **Demo contract** — the one flow that can prove the promise within the available time.

The Today statement excludes the solution name. “AI analyzes it” becomes an observable scene such as “the night operator spends forty minutes crossing dashboards before a cause can be narrowed.” Separating problem from solution lets technology change without erasing the customer need.

The press release acts as a completion condition rather than future marketing. It identifies the first customer, usage moment, and difference from the current workaround. Vague prose predicts an expanding feature list.

The FAQ is a risk register. What happens when data is missing? Who decides when the model is wrong? What are the latency, cost, and authority boundaries? These answers create architecture priorities and backlog items.

The demo contract is not a tour of every feature. It reduces scope to input → essential processing → customer decision.

## Design transitions through Listen, Define, Invent, and Refine

The names matter less than the conditions for moving between them.

**Listen** collects scenes the customer has actually experienced. “It is inconvenient” becomes when, where, and which task was delayed.

**Define** selects one first customer and records frequency, impact, and the current workaround. A demo serving end users, administrators, and operators at once usually carries three incompatible purposes.

**Invent** expands possible features, but each one must point back to a friction in the Today statement. Unconnected ideas are deferred rather than treated as bad ideas.

**Refine** uses the FAQ and demo to reduce implementation scope. If the promise can still be proved without a feature, that feature does not belong in the first iteration.

The process is not linear. A risk found in the FAQ can reopen the problem statement. A demo that fails to show customer change can force the press release to be rewritten. The documents test one another.

## Draw architecture backwards from the promise

Architecture diagrams in workshops can become inventories of familiar services. Working Backwards starts with the responsibilities required by the one demo flow.

For a promise such as “show an operator a failure hypothesis with supporting evidence,” the following questions come before components:

- which signal starts the event;
- which sources can support a causal claim;
- how missing sources appear in the result;
- where a person can revise or defer the conclusion;
- what record remains for the next incident.

Only then do event intake, storage, analysis, UI, and notification responsibilities appear. Each box should connect to a customer promise or an FAQ risk.

![A POSTECH team refining its demo promise](/brilly/assets/blog/working-backwards/postech/team-work-02.jpg)

## Facilitation reviews connections, not ideas

Supplying the answer can move a team quickly while leaving it unable to explain the conditions behind the answer. Feedback therefore tests the links between artifacts:

- who exactly is the first customer;
- what workaround do they use now;
- which behavior or elapsed time changes after success;
- which demo scene proves that change;
- which FAQ risk appears in the architecture;
- what is intentionally outside this iteration.

A midpoint review is an alignment check, not a polish score. If the UI looks complete but does not address the problem, or the architecture is complex while the demo proves no promise, scope is realigned before more implementation is added.

Teams do not need identical answers or speed. They do need the same questions and artifact contract, which lets teams at different technical levels explain and compare decisions.

## Leave a decision record, not a feature list

A useful workshop leaves the first customer, problem scene, success measure, core hypothesis, deferred features, demo scope, technical risks, and next experiment in one chain.

That record can become the first sprint plan. The Today statement becomes a scope test, FAQ becomes a risk backlog, and demo contract becomes acceptance criteria. New requests can be judged by their relationship to the existing customer promise.

Working Backwards does not postpone technology. It creates the reason for choosing it. The case articles that follow therefore avoid repeating this general method and focus on the one operating challenge and artifact that differed in each event.
