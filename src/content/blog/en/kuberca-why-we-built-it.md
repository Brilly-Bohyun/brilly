---
title: "Why We Built KubeRCA: Closing the Gap Between an Alert and Understanding"
description: "The on-call problem, OOMKilled demo, and product criteria behind KubeRCA: reducing investigation preparation and handoff after a Kubernetes alert."
date: "2026-04-04"
lang: "en"
translationKey: "kuberca-why-we-built-it"
category: "projects"
subcategory: "kuberca"
tags: ["kuberca", "kubernetes", "rca", "aiops", "incident-response"]
draft: false
comments: true
---

The work after a Kubernetes alert usually takes longer than receiving it. An operator identifies the workload, checks Pod state and events, aligns logs and metrics with the incident window, searches recent changes and historical cases, and then explains the current hypothesis at shift handoff.

The work is repetitive for experienced operators and difficult to start for a new one. Investigation order rarely fits entirely in a runbook. “For this signal, look here first” often remains in personal experience and terminal history.

KubeRCA is an open-source project built to reduce that gap. Its goal is not to replace an operator's judgment. It is to turn **the preparation between one alert and a reviewable RCA draft into an event record**.

## Write the problem as one on-call handoff

The project began with a real workflow rather than a feature list:

```text
see an Alertmanager signal
→ identify namespace and workload
→ inspect Pod events and container state
→ gather logs and metrics around the incident
→ note candidate causes and counter-evidence
→ hand the investigation to the next operator
```

Tools for each step already existed. The problem was that results remained scattered across consoles and command output, with no durable connection between an observation and a causal sentence.

The first product hypothesis was deliberately smaller than “more accurate automated diagnosis”:

> If initial evidence and unknowns are organized around one alert, another operator can reach the same decision point faster.

That hypothesis prioritized review and handoff over answer-generation speed.

## Let the alert view show the starting boundary

![KubeRCA Alert Dashboard](/brilly/assets/blog/kuberca/alert-dashboard.png)

_The real view begins with firing state, target, severity, and time._

An alert name alone does not identify the event. Two `CrashLoopBackOff` alerts in different namespaces and windows can describe unrelated problems.

The dashboard therefore leads with investigation scope rather than a model answer. Operators first verify target, state, severity, and time so a resolved event is not mistaken for a current one.

This changed the interface priority. AI prose could not dominate the page at the expense of the original signal and resource boundary. A fluent RCA is useless when attached to the wrong event.

## Separate symptom and cause in the OOMKilled demo

The default demo exceeds a container memory limit, producing OOMKilled and repeated restart behavior. A familiar failure was useful because the product needed to express the difference between the `CrashLoopBackOff` symptom and the `OOMKilled` cause.

A restart alert alone cannot establish OOM. Prior termination reason and exit code, events, restart count, and memory behavior around the incident need to support the same explanation. If those observations have disappeared, the result should preserve that limit rather than claim certainty.

![KubeRCA Alert Analysis](/brilly/assets/blog/kuberca/alert-analysis.png)

_The analysis view separates collected observations, recommendations, state, and operator feedback._

The demo clarified four distinct outputs:

- facts read directly from a source;
- a causal hypothesis connecting those facts;
- observations that remain unavailable;
- checks an operator should perform next.

Combining all four into one paragraph can produce a fluent report while making review much harder.

## Decide what not to automate first

KubeRCA's first explicit non-goal was changing resources automatically. Even when OOMKilled looks likely, the project does not raise a memory limit or restart the workload. One analysis service cannot safely own the consequence of a poor hypothesis, higher cost, or impact on neighboring workloads.

The draft instead aims to preserve verification, expected impact, rollback, and the point where a person decides. Value comes from shortening the path to a safe action, not from executing an action fastest.

The first evaluation also did not assume a perfect observability environment. The important question was not how many integrations appeared, but whether unavailable information remained visible as a limit.

## Keep collaboration attached to the incident

![KubeRCA Slack Thread](/brilly/assets/blog/kuberca/slack-thread.png)

_The first alert, RCA summary, and follow-up discussion continue in one event context._

Handoff and collaboration matter as much as detailed analysis. A Slack message is an entrance that shares which event is open and what needs judgment; it does not replace the full report.

Copying only a summary into a separate conversation removes evidence and limitations. Collaboration therefore needs a path back to the event and a clear reference to the analysis under discussion.

This requirement moved KubeRCA from a personal diagnostic assistant toward a team investigation workspace. Getting one answer and letting the next operator continue the same event are different product problems.

## Fix product criteria during five months of implementation

Across roughly five months in CloudBro Open Project S2, the project repeatedly applied these criteria:

- do not present a cause as fact without displayable evidence;
- separate symptom, hypothesis, unknowns, and next checks;
- prioritize read-only investigation and reviewable recommendations;
- preserve collected observations when one source is unavailable, while showing the limit;
- make analysis a handoff-ready event record rather than disposable output.

The first useful KubeRCA outcome is not autonomous resolution of a difficult incident. It is a new operator finding a starting point, another operator following the same evidence, and both understanding what to inspect next when the cause remains unknown.

The project is not primarily saving the seconds required to generate prose. It aims to reduce the time spent crossing tools, recollecting facts, and explaining the same investigation at handoff—the gap between an alert and **verifiable understanding**.

> Installation and current code are available in the [KubeRCA GitHub repository](https://github.com/kube-rca/kuberca). Service and authority boundaries are covered separately in [KubeRCA Architecture and Human-in-the-Loop Design](/brilly/en/posts/kuberca-human-in-the-loop-architecture/).
