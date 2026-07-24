---
title: "KubeRCA Architecture and Human-in-the-Loop Design"
description: "The Frontend, Backend, Analysis Agent, and PostgreSQL boundaries behind KubeRCA, including review, re-analysis, and feedback."
date: "2026-04-04"
lang: "en"
translationKey: "kuberca-human-in-the-loop-architecture"
category: "projects"
subcategory: "kuberca"
tags: ["kuberca", "architecture", "human-in-the-loop", "kubernetes", "llm"]
draft: false
comments: true
---

Human-in-the-loop in KubeRCA is not a final approval button. It is the division of responsibility and data flow that lets a person define the event boundary, distinguish collected evidence from AI interpretation, request re-analysis, and record which action actually helped.

This article focuses on how that principle became an architecture. The product problem and OOMKilled demo are covered in [Why We Built KubeRCA](/brilly/en/posts/kuberca-why-we-built-it/).

![The actual KubeRCA project architecture](/brilly/assets/blog/kuberca/architecture-linkedin.jpg)

_Alertmanager, Frontend, Backend, Analysis Agent, PostgreSQL with pgvector, and Kubernetes observability sources in the current project architecture._

## Three runtime areas carry different authority

KubeRCA centers on a Frontend, Backend, and Analysis Agent. The separation is not merely about language or deployment. It keeps reviewable operational state separate from generated analysis.

The **Backend** owns Alertmanager webhooks, incident and alert state, analysis requests, SSE updates, feedback, webhook routing, and persistence. Which event is open and which run belongs to it are Backend decisions.

The **Analysis Agent** receives incident context, reads Kubernetes and observability sources, and produces an RCA and incident summary. It does not own the system of record, so an analysis failure cannot silently change incident state or erase a prior result.

The **Frontend** exposes alert and incident lists, analysis detail, feedback, and manual re-analysis. It is a workspace for comparing generated analysis with operator decisions, not just a renderer for the Agent's latest response.

PostgreSQL preserves incidents, alerts, artifacts, feedback, and routing. pgvector supports similarity search over resolved summaries. Prometheus, Loki, Tempo, and Istio are environment-specific enrichers, while Slack is an optional path for reading the same incident in a collaboration channel.

## Incident is the shared key for data and judgment

One failure can produce multiple alerts. Restarts, high memory use, and readiness failures may all describe one workload event. The same alert name across different namespaces, however, may represent unrelated incidents.

The central data model is therefore the incident, which connects:

- included alerts and affected resources;
- analysis runs and progress;
- collected context and artifacts;
- RCA and incident summary;
- operator feedback and manual re-analysis;
- resolved embeddings and historical similarity context.

![KubeRCA Incident Dashboard](/brilly/assets/blog/kuberca/incident-dashboard.png)

_The product manages alerts as incidents with an investigation lifecycle rather than disposable notifications._

Alert resolution and investigation completion are different states. An operator needs to see related signals, analysis progress, and the latest judgment before closing an incident. The common key also lets Frontend and Slack refer to the same event while feedback and new runs extend its history.

## The ReAct loop receives read authority only

The Agent uses a ReAct-style loop to form a hypothesis, select a check, observe the result, and change the next question. The valuable constraint is not longer reasoning prose; it is bounded tool use.

Kubernetes resources, events, logs, and Prometheus metrics form the core path. Loki, Tempo, and Istio can enrich it. Kubernetes access remains read-only. An unavailable source or permission failure becomes an observation and does not delete the results from other sources.

An RCA draft separates:

- facts directly observed from a source;
- hypotheses and confidence built from those facts;
- information that remains unavailable;
- checks that could refute the current hypothesis;
- actions for an operator to review.

This structure lets an operator judge evidence rather than fluency. A run that cannot identify a reliable cause still leaves the missing source and next question for the investigation.

## Live updates and manual re-analysis solve different problems

![KubeRCA Incident Detail](/brilly/assets/blog/kuberca/incident-detail.png)

_The real detail view keeps RCA, impact, mitigation, related alerts, and next checks in one incident._

Incident Detail is not a report page that appears only after completion. Alert and analysis state arrive through SSE, with polling available as a fallback. An operator can follow collection and continue into review without moving the investigation into personal notes.

Manual re-analysis is also more than failure recovery. New logs may arrive, the initial time range may be too narrow, or an operator may want to test a different hypothesis. Automation starts repetitive collection; it does not decide when a person's questions are finished.

A new run should not blindly replace the previous RCA. An operator needs to compare which evidence changed and whether re-analysis improved the result. That is why run history and feedback live inside the incident.

## Human-in-the-loop is implemented as decision authority

An operator must be able to accept, modify, defer, or re-run an RCA. That requires the interface to expose:

- which alerts and resources were in scope;
- which sources and queries were used;
- whether collection failed or lacked permission;
- where observed facts end and Agent interpretation begins;
- the impact and rollback of a recommendation.

Analysis and action therefore have different authority. A proposed command remains review material with verification, preconditions, impact, rollback, and approval context. Automated remediation, if added, requires its own approval and audit path.

Sensitive context is masked at input and output boundaries. Trust comes from knowing what the system read and what it cannot change, not from assuming the model is always right.

## Optional sources extend confidence without owning the core path

Not every environment has Loki, Tempo, Istio, or Slack. KubeRCA can begin with Alertmanager, Kubernetes API, and the core incident path, treating each additional integration as a new evidence path.

An absent optional source neither fails the whole investigation nor disappears behind a success state. The missing observation becomes an artifact and a confidence limit. An operator can distinguish “no RCA exists” from “this hypothesis could not be checked because trace data was unavailable.”

Graceful degradation is therefore an operational contract: say honestly what this environment can and cannot investigate.

## Historical cases remain retrieval, not verdict

When an incident resolves, its summary and embedding support similar-case retrieval. Operator feedback helps identify which historical RCAs were useful. Similarity still does not prove a current cause.

Every new incident requires current resources, events, metrics, and logs to be checked again. A historical case may propose a hypothesis only when current evidence can validate it. Without that boundary, one poor draft can be repeatedly reproduced through embeddings.

Human-in-the-loop appears throughout KubeRCA: defining incident scope, reviewing evidence, requesting another run, approving action, and deciding what a resolved case should contribute to future retrieval.

Read as a component list, the architecture contains Frontend, Backend, Agent, PostgreSQL, and observability systems. Read as a judgment flow, it becomes signal → incident → read-only evidence → RCA draft → operator review → reusable record. The second flow is the architecture KubeRCA is designed to preserve.

> Current code and deployment configuration are available in the [KubeRCA GitHub repository](https://github.com/kube-rca/kuberca).
