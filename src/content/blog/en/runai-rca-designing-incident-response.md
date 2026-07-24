---
title: "Run:AI RCA Architecture: Three Services and Seven Evidence Agents"
description: "How a Go backend, FastAPI agent, React frontend, and seven read-only collectors form a reviewable GPU-platform investigation system."
date: "2026-07-24"
lang: "en"
translationKey: "runai-rca-designing-incident-response"
category: "projects"
subcategory: "runai-rca"
tags: ["runai", "nvidia", "rca", "architecture", "nemo", "kubernetes"]
draft: false
comments: true
---

Run:AI RCA is not a chatbot that produces one sentence about a GPU failure. It reads distinct operational sources—Run:ai, Kubernetes, Prometheus, Loki, the control-plane database, node systems, and change history—through **one investigation contract**, then preserves enough detail to audit what was checked.

This article focuses on how the project is divided and connected. The separate [CrashLoopBackOff investigation article](/brilly/en/posts/runai-rca-alert-to-rca-flow/) follows one real incident through the operational UI instead.

![The official Run:AI RCA architecture — Alertmanager, Backend, Frontend, Agent, PostgreSQL, TypeDB, and seven read-only evidence agents](/brilly/assets/blog/runai-rca/architecture.svg)

_The current architecture published in the repository and GitBook. The Backend owns event lifecycle, the Agent owns investigation, and the Frontend owns operator review._

## The Backend owns incident and run lifecycle

The Go Backend does more than forward an Alertmanager payload to an LLM. It normalizes alerts, correlates them into likely incidents, and persists the start, progress, completion, and failure of every analysis run. Feedback, comments, approval, and similar-incident retrieval attach to the same incident boundary.

Alert and incident are separate because notification grouping is not the same as a root-cause boundary. One Alertmanager group can contain unrelated failures, while differently named alerts may originate from one node problem or queue-policy change. Correlation narrows candidates in this order:

- `cluster + project + queue + namespace + workload`
- `cluster + node`
- Alertmanager `groupKey`

Analysis is asynchronous. The Backend records a run rather than holding the webhook request open, and it streams progress to the Frontend through SSE. A timed-out re-analysis does not overwrite the last successful RCA, because “latest run” and “last trustworthy result” are not always the same thing.

A cooldown limits repeated automatic analysis. Incident reactivation remains visible, but a burst of identical alerts does not create a burst of expensive investigations. Automatic runs and operator-requested runs are also distinct so Slack can open a thread for the first result and add only intentional follow-up analyses.

## The Agent is an investigation pipeline, not one prompt

The FastAPI Agent uses a NeMo Agent Toolkit workflow, but it does not concatenate all context into one prompt. An orchestrator plans scope and hypotheses, runs baseline collection and domain drill-down, ranks candidates, checks counter-evidence, synthesizes the report, and applies a runtime harness.

Seven collectors participate in baseline investigation:

- **Run:ai** — workload, project, queue, quota, priority, and version
- **Kubernetes** — Pods, events, node conditions, and scheduler blockers
- **Prometheus** — queue, project, GPU, restart, and resource metrics
- **Loki** — workload and Run:ai control-plane logs
- **Postgres** — the RCA store, pgvector, feedback, and control-plane queries
- **System** — kernel, GPU-driver, NVIDIA XID, OOM, and MCE signals
- **Change** — controller versions, Pod lifecycle, and node-condition transitions

The separation is not intended to scrape more data. It fixes **which source can answer which question**. Kubernetes receives Kubernetes read tools, Run:ai receives GET-only Run:ai tools, and Postgres receives read-only `SELECT`. Authority lives in code and tool registries, not merely in prompt instructions.

The central investigation loop and collector drill-down have different jobs. The central loop chooses the next evidence plane. A collector loop only explores further inside the selected plane. A Pending workload may lead the central loop to compare Run:ai queue state with Kubernetes scheduling, but a Kubernetes collector never acquires arbitrary Run:ai authority.

## Every collector returns the same evidence contract

A collector returns more than prose. Each artifact retains the actual query, source, status, confidence, and highlighted signals.

```json
{
  "source": "kubernetes",
  "type": "adhoc_query",
  "status": "ok",
  "confidence": "medium",
  "title": "Pod query",
  "query": "kubectl get pod train-0 -n runai",
  "summary": "CrashLoopBackOff, previous termination detected",
  "highlights": ["CrashLoopBackOff"]
}
```

`ok`, `partial`, and `unavailable` describe whether this investigation produced reviewable artifacts, not whether a service passed a health check. A Running Agent Pod and a 200 from `/healthz` do not constitute collected evidence. Conversely, one failed source does not erase useful artifacts from the others.

Time is part of the contract. Collection normally spans five minutes before firing through five minutes after resolution, while firing incidents use a bounded window. A resource that exists now is not proof that it existed during a historical incident, so current state and incident-window evidence remain separate.

Sensitive values are masked before artifacts reach a model. Logs and events are treated as untrusted input: text collected from a cluster cannot grant new authority or instruct the system to execute a different tool.

## Investigation failure is a structured result

An operations tool cannot depend on every integration being healthy. Run:AI RCA has an overall analysis deadline and keeps useful work when a slow source becomes `partial` or `unavailable`. An MCP adapter can fall back to an allowed direct API. If the LLM runtime or NeMo workflow fails, deterministic stages still return a degraded report.

Fallback is not a way to hide failure. It records which path ran, which source was missing, and what the available evidence cannot prove. The Backend timeout stays above the Agent deadline so a report produced during graceful degradation is not lost to an earlier network timeout.

Candidate ranking follows the same rule. Alert catalogs, known issues, failure-mode symptoms, and NVIDIA XID signatures help retrieve candidates, but a signature without supporting live evidence is not promoted into a conclusion. Independent sources, contradiction, and incident lifecycle determine the maximum confidence a candidate may receive.

## Storage preserves review history, not just data

PostgreSQL stores incidents, alerts, runs, artifacts, feedback, comments, and evaluations. pgvector retrieves similar historical incidents, but similarity is not evidence of the current cause. A prior case can suggest the next check; it cannot replace facts observed in the current incident.

The optional TypeDB ontology adds relational context such as node blast radius, workload-to-queue relationships, and previously approved causes and remedies. It also does not learn every generated report automatically. Only an operator-approved immutable RCA snapshot is eligible for promotion after a grace period.

If TypeDB is disabled or unreachable, baseline investigation continues. The report and UI do not imply graph reasoning when no graph query succeeded. Optional capability must degrade visibly rather than masquerade as a complete result.

## The Frontend is a review workspace

The React Frontend separates incident, alert, analysis, knowledge, and chat views, but final review converges in incident detail. Summary, long-form report, similar cases, Evidence Trail, Missing Data, Warnings, self-check, evaluation, feedback, approval, and re-analysis remain in one event record.

Approval is more than a UI state. It establishes the operator-reviewed snapshot that may later become memory or ontology knowledge. Recommended changes also remain recommendations. They include verification, impact, rollback, and approval context rather than being executed automatically.

The main architectural change was a shift from asking “did the Agent answer?” to asking “can another operator review this incident?” Run:AI RCA is designed to preserve the process and limits of a multi-source investigation, not to let AI silently replace operational judgment.

> The implementation and design contracts are maintained in the [Run:AI RCA GitHub repository](https://github.com/uclix-nvidia-sw/runaiRCA) and the [Run:AI RCA GitBook](https://uclix.gitbook.io/run-ai-rca-docs).
