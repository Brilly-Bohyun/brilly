---
title: "Open Source Summit North America 2026: Rethinking KubeRCA Through an English Talk"
description: "What became clearer—and what still needs work—when explaining KubeRCA's ReAct investigation and read-only guardrails to a global audience."
date: "2026-07-01"
lang: "en"
translationKey: "opensource-summit-us-talk"
category: "talks"
subcategory: "conference"
tags: ["open-source-summit", "kubernetes", "kuberca", "public-speaking", "open-source"]
draft: false
comments: true
---

At Open Source Summit + Embedded Linux Conference North America 2026, I presented **“Troubleshooting Like a Senior on Day 1: ReAct Agents with Real-Time Cluster Evidence.”** The session covered how KubeRCA responds to a Kubernetes alert, reads metrics, logs, and events, restricts execution to allowlisted read-only queries, and connects RCA claims back to evidence.

This is not a travel or career retrospective. It is a case study of compressing the project into an English technical talk: what became clearer and what remained insufficient. Product motivation and architecture are covered in the separate KubeRCA articles.

![Speaker badges from Open Source Summit + Embedded Linux North America 2026](/brilly/assets/blog/ossummit-2026/photo-01.jpg)

## Limit the promise in the title

“Troubleshooting like a senior on day one” is memorable, but it can imply that AI replaces an experienced operator. The first job of the talk was to limit that interpretation.

KubeRCA does not reproduce all senior intuition. It structures repeatable investigation work: which source to inspect first, which query could refute a candidate, and how to preserve what current evidence cannot establish.

The central statement became:

```text
AI decides the cause
→ AI structures investigation and evidence for operator review
```

That statement organized the talk around problem → guardrail → evidence → operator review instead of a feature inventory.

![The welcome sign at Open Source Summit + Embedded Linux North America 2026](/brilly/assets/blog/ossummit-2026/photo-05.jpg)

## Explain read-only guardrails before ReAct

Leading with a ReAct loop causes the audience to ask what an Agent is permitted to execute. The safety boundary therefore came first:

- commands and queries come from an allowlist;
- Kubernetes and observability sources are read-only;
- collected observations remain separate from model interpretation;
- insufficient evidence lowers confidence and creates next checks;
- remediation remains an operator-reviewed recommendation.

Only then did the talk introduce the loop that forms a hypothesis from alert context, selects a query, reads the observation, and adjusts the next hypothesis. ReAct appeared as a bounded investigation loop rather than a claim of autonomous cluster control.

![Checking the talk flow near the speaker lounge](/brilly/assets/blog/ossummit-2026/photo-02.jpg)

## Follow the movement of evidence, not every component

KubeRCA contains Alertmanager, Backend, Analysis Agent, PostgreSQL with pgvector, dashboard, Slack, and multiple observability sources. Equal attention to every box leaves an audience remembering names rather than the system contract.

The talk followed one transformation:

```text
Alertmanager signal
→ incident context
→ read-only observations
→ hypothesis and counter-check
→ evidence-backed RCA draft
→ dashboard and team-channel review
```

Each component owned one responsibility in that path. The Backend retained event and run state. The Agent gathered evidence and drafted the analysis. UI and Slack exposed the same incident to operators. pgvector retrieved historical cases without treating them as proof of the current cause.

The public session description made the same distinction: real-time cluster evidence means structured metrics, logs, and events, and each claim needs a path back to that evidence. This is more concrete than saying “AI understands Kubernetes.”

![Presenting KubeRCA at Open Source Summit North America 2026](/brilly/assets/blog/ossummit-2026/photo-06.jpg)

## Accuracy dominated the first English delivery

Preparing the English talk required consistent use of terms with different roles: evidence, hypothesis, root cause, remediation, and read-only guardrail. Literal translation produced sentences too long to deliver naturally, so each slide needed language that could actually be spoken.

That work improved accuracy, but it also had a cost. Concentrating on the prepared wording left less room to adjust pace and examples to audience response. The information could be technically correct while the speaker missed where the audience was forming its questions.

Other sessions made the difference visible. Strong speakers continually told the audience which sentence to retain, why the next diagram mattered, and which detail could be postponed.

The next English version will:

- state one takeaway before each section;
- show a failure scene before project-specific nouns;
- split long sentences into two claims;
- highlight only the active path in an architecture slide;
- create explicit pauses where questions are likely.

![Delivering the session from the conference podium](/brilly/assets/blog/ossummit-2026/photo-07.jpg)

## Conference questions become documentation work

A global open-source audience reads the same architecture through different operating risks. Kubernetes, cloud-native, embedded, and platform engineers ask different questions about authority, reliability, and evidence.

Preparing the talk and listening at the conference made several documentation gaps clearer:

- which queries enter the allowlist and who changes it;
- how untrusted text inside logs and events is handled;
- how one failed source limits RCA confidence;
- how historical incidents remain separate from current evidence;
- when operator feedback may influence a later analysis.

These are not just presentation FAQ. They belong in architecture, security-boundary, and evaluation documentation. The talk acted as a review that found missing project explanations.

![The sponsor board at Open Source Summit North America 2026](/brilly/assets/blog/ossummit-2026/photo-03.jpg)

## The next version should follow one incident deeper

This session introduced problem, ReAct loop, evidence, guardrail, and operator review together. That breadth was useful for the project overview, but it limited how deeply any real failure could be shown.

A future version should follow one incident: an alert opens, the first hypothesis is refuted, a source becomes unavailable, and the final RCA lowers confidence. Keeping the same screen and artifacts through the story would make “evidence-backed” more tangible than another component slide.

![The venue display at Open Source Summit + Embedded Linux North America 2026](/brilly/assets/blog/ossummit-2026/photo-08.jpg)

The main lesson was that a technical talk is not simply a project summary. It redesigns what the project claims, where that claim stops, and which evidence makes it reviewable. The principle KubeRCA applies to incident response was equally necessary in the talk.

> The public abstract is available on the [Sessionize session page](https://sessionize.com/s/bohyun-choi/troubleshooting-like-a-senior-on-day-1-react-agent/170625), and the implementation is in the [KubeRCA GitHub repository](https://github.com/kube-rca/kuberca).
