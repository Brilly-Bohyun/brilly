---
title: "A Real Run:AI RCA Investigation: CrashLoopBackOff to Evidence Trail"
description: "A real re-analysis of a resolved CrashLoopBackOff incident, including missing evidence, collector failures, and operator review."
date: "2026-07-24"
lang: "en"
translationKey: "runai-rca-alert-to-rca-flow"
category: "projects"
subcategory: "runai-rca"
tags: ["runai", "alertmanager", "crashloopbackoff", "rca", "operations"]
draft: false
comments: true
---

The clearest way to explain Run:AI RCA is not a component list but a real incident. This article follows a re-analysis of `Pod is crash looping.` from the operational environment. The symptom was clear; the live evidence needed to prove the historical cause was not.

The useful result was not a sentence declaring the cause. It was a record of **what had been checked, what was missing, and why the system declined to overstate the conclusion**.

## Read the incident boundary before the RCA

![The Run:AI RCA Incident Dashboard in the operational environment](/brilly/assets/blog/runai-rca/incident-dashboard.png)

_The real incident list contains workload alerts, Run:ai control-plane failures, node events, and rollout incidents in one cockpit._

The Incident Dashboard keeps severity, `firing`/`resolved`/`analyzing` state, final approval, alert count, and start time visible. Before reading the report, an operator can tell whether the event is ongoing, historical, or already backed by an approved decision.

The incident opened for this article had the following context:

- incident: `INC-1784617627629481310-000003`
- target: `test1 / super-agg-ingress-0-vllmworker-t5xqr`
- symptom: `Pod is crash looping.`
- severity: `warning`
- fired: July 21, 2026 at 16:06
- Alertmanager resolved: July 21 at 16:12
- final decision: `pending`

The incident was re-analyzed on July 23. Current cluster state therefore could not be treated as the state at the time of failure. That temporal gap became the most important limit on confidence.

## The RCA separated symptom from cause

![The RCA Summary and similar incidents for the real CrashLoopBackOff event](/brilly/assets/blog/runai-rca/actual-crashloop-analysis.png)

_A fresh capture from the operating UI. Incident lifecycle appears above the RCA Summary and historical similar incidents._

The summary confirmed that the Pod repeatedly restarted in CrashLoopBackOff. It did not arbitrarily select OOMKilled, a bad entrypoint, an image-pull failure, or missing configuration. The UI marked the evidence as partial and stated that the exact cause could not be identified from the available evidence.

That distinction matters because CrashLoopBackOff is a kubelet-observed restart state, not a cause. A causal claim requires separate evidence such as the prior container termination reason and exit code, previous logs, Pod events, resource limits, or node pressure.

Similarity retrieval displayed another CrashLoopBackOff incident at 28 percent, and that older case concluded OOMKilled. Run:AI RCA did not copy that conclusion. A similar incident proposes what to inspect; it is not live evidence for the current one.

## The Evidence Trail exposes collection success and failure together

![The Collector Evidence Trail from the real analysis](/brilly/assets/blog/runai-rca/evidence-trail.png)

_Artifacts from Run:ai, Kubernetes, Postgres, Prometheus, Loki, System, Change, and the original alert can be inspected by source._

This run retained 9 Run:ai artifacts, 48 Kubernetes artifacts, 9 Postgres artifacts, 31 Prometheus artifacts, 10 Loki artifacts, 6 System artifacts, 8 Change artifacts, and the original alert. Volume alone did not produce high confidence. Several artifacts may describe the same observation, and current-state queries may fall outside the incident window.

The Run:ai artifacts themselves had mixed quality:

- workload context was partially available, while project and queue were not proven;
- a workload query did not establish target coverage and remained `low`;
- the project resource was absent in current state, which did not prove historical absence;
- part of the project node-pool query failed on authorization;
- the alert lacked an immutable Run:ai workload ID for exact state and history correlation.

Collapsing those outcomes into one green “Run:ai collector succeeded” state would be misleading. The operator needs the artifact-level result to understand what the report is allowed to claim.

The screen also recorded four Missing Data items and sixteen Warnings. By re-analysis time the target Pod no longer existed, and part of the Kubernetes query failed. Some Prometheus work did not return a complete result. “The resource is absent now” is not counter-evidence against a historical failure; it means the current source can no longer prove the earlier state.

## The report left executable next checks

An investigation that withholds a cause can still reduce the next operator's work. The report preserved concrete checks:

```bash
kubectl -n runai-test1 describe pod super-agg-ingress-0-vllmworker-t5xqr
kubectl -n runai-test1 logs super-agg-ingress-0-vllmworker-t5xqr --previous
kubectl -n runai-test1 get pod super-agg-ingress-0-vllmworker-t5xqr \
  -o jsonpath='{.status.containerStatuses[0].lastState}'
```

It then proposed verifying ConfigMap and Secret injection, image-registry access, node `MemoryPressure`/`DiskPressure`/`PIDPressure`, and kubelet eviction records. Immediate evidence collection, follow-up diagnosis, and prevention were separated so the next shift would not need to redesign the investigation order.

Those commands may no longer work for a historical incident if the Pod and previous logs have already disappeared. The case therefore also exposed a product requirement: state, events, and previous logs need to be captured while an alert is firing. Post-hoc reasoning cannot recreate evidence that the platform never retained.

## Analysis cost belongs beside quality

This run lasted about 21 minutes and 15 seconds. The UI recorded 53 LLM calls and roughly 259,000 tokens across collection, self-check, synthesis, and repair. A long run and a large evidence count are not signs of a better RCA by themselves.

Instead, the result sharpened the stopping rules:

- do not repeat the same query or observation;
- stop retrying a source that cannot produce incident-window evidence;
- do not raise confidence without an additional independent source;
- allow the final state to remain `insufficient_evidence`;
- prevent report repair from inventing facts.

The Harness separately checked invalid evidence links, missing Evidence Trace, unresolved contradiction, unsafe actions, and unsupported high confidence. This run passed format and safety gates while keeping causal confidence low. **A structurally valid report and a proven root cause are different outcomes.**

## Operator approval starts the knowledge lifecycle

The final decision on this incident remains `pending`. A generated report and a similar historical case are not enough to promote the result as future truth.

Operators can separately evaluate evidence grounding, diagnostic reasoning, investigation plan, uncertainty calibration, operational usefulness, tool efficiency, and safety. Resolution outcome and the action that actually helped are also recorded. Only an approved immutable snapshot is eligible to become similar-incident memory or ontology knowledge.

The practical flow of this incident was:

```text
open a resolved alert as an incident
  → separate incident-time state from current state
  → retain both observations and collection failures as artifacts
  → use similar incidents as prompts, not proof
  → withhold the cause when evidence is insufficient
  → leave manual checks and collection improvements
  → ask an operator to validate the outcome
```

The point of this example is not a polished answer screen. Real investigations contain deleted resources, blocked permissions, malformed queries, and highly persuasive historical cases. Run:AI RCA turns those imperfections into a reviewable incident record instead of hiding them behind fluent prose.

> The full implementation is in the [Run:AI RCA GitHub repository](https://github.com/uclix-nvidia-sw/runaiRCA), with pipeline and operations documentation in the [Run:AI RCA GitBook](https://uclix.gitbook.io/run-ai-rca-docs).
