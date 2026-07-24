---
title: "Vendor Support RCA Copilot: Turn Support Cases into Investigable Evidence"
description: "A prototype that connects scattered vendor support cases and technical documents to an operator-verifiable RCA workflow."
date: "2026-07-24"
lang: "en"
translationKey: "vendor-support-rca-copilot"
category: "projects"
subcategory: "prototypes"
tags: ["rca", "copilot", "support", "knowledge-management", "ai"]
draft: false
comments: true
---

![Vendor Support RCA Copilot Azure architecture — the actual deployed flow across MSP engineers, Entra ID, App Service, Azure Functions, Graph API, GitHub Models, Slack, and Word export](/brilly/assets/blog/vendor-support-rca/architecture.jpg)

Vendor support cases contain valuable operational clues, but tickets, email, attachments, logs, release notes, and knowledge-base documents are often scattered. When a similar incident returns, teams end up rediscovering the same context. Vendor Support RCA Copilot is an Azure AI prototype that turns long Outlook support-email threads into a Korean RCA draft an engineer can review.

This is not a chatbot intended to answer a ticket on someone’s behalf. It is a workspace for fixing the observations of a new incident, recovering relevant support context, and making the next validation question explicit. The expensive part of support work is not only the answer sentence; it is the reasoning about which condition was checked, which evidence supported the conclusion, and why the conclusion was trustworthy.

[![Vendor Support RCA Copilot demo video thumbnail — the Support Tickets screen is the starting point for generating an RCA](/brilly/assets/blog/vendor-support-rca/demo-video.jpg)](https://www.youtube.com/watch?v=Nad7svF2IQo "Vendor Support RCA Copilot demo video")

> [Watch the demo](https://www.youtube.com/watch?v=Nad7svF2IQo) · [View the GitHub repository](https://github.com/Brilly-Bohyun/lipcoding)

## What had to fit into four hours

This was a solo project built and deployed in roughly four hours through voice coding without keyboard input for the 2026 Cheonha Jeil Lip Coding Competition, where it placed ninth. The time limit made a full support-knowledge system the wrong goal. The goal was one closed, reviewable workflow: read a support thread, generate an RCA, let an engineer edit it, then export it to Word or share it to Slack.

That scope was not about building fewer screens for its own sake. Ticket list, mail-thread context, RCA generation, section-level editing, document export, and Slack sharing each answer one operational question: who reads which evidence, who validates which claim, and where may the reviewed result go next?

## Turn a mail thread into six RCA sections

In the initial MVP, an engineer opens a ticket from the Support Tickets list, reads the email-thread context, and starts RCA generation. The backend structures the mail content and streams a draft with six sections:

- incident summary and user impact;
- timeline of support and operating events;
- root-cause analysis and its assumptions;
- actions already taken;
- prevention or follow-up actions; and
- open issues that still need confirmation.

The point is not to produce six polished paragraphs. Each section must be traceable back to the mail evidence and the conditions of the current investigation. A timeline item needs a source and time; a root-cause statement needs supporting observations and limits; an open issue needs a check that could resolve it. The generated draft is never sent automatically. An engineer can edit each section before any export or sharing action becomes available.

## The deployed architecture and its boundaries

The architecture separates the React SPA from Azure Functions. The frontend runs on Azure App Service and signs in through Microsoft Entra ID. It passes tokens to the API. Azure Functions retrieve Outlook mail threads through Microsoft Graph API, use GitHub Models GPT-4o with the Copilot SDK to prepare the RCA, and stream the result back to the UI.

Storage Account preserves RCA documents and operational data. Application Insights captures telemetry and logs. Key Vault stores runtime secrets such as the GitHub Models token and Slack webhook URL; the Functions App reads them through Managed Identity instead of embedding them in code or deployment configuration. GitHub Actions connects Bicep infrastructure deployment, frontend and backend builds, quality checks, secret scanning, and health checks.

The architecture has many arrows because they describe different responsibilities, not because a diagram needs more services. Mail retrieval, AI generation, human review, Word and Slack delivery, secret access, observability, and deployment all have different safety and operating boundaries.

## Divide the AI workflow by responsibility

The Copilot SDK flow is not one large prompt doing everything. `MailParserAgent` parses and organizes an email thread; `RCAGeneratorAgent` creates the Korean six-section draft; `ReviewAssistantAgent` supports review, regeneration, and questions; and `ExportAgent` prepares Word output and Slack sharing. A `QualityGuardAgent` keeps CI/CD checks such as linting, tests, and secret scanning in place.

This division is not a way to make the response longer. It separates extracting observed facts, composing a draft, letting a person amend it, and transmitting an approved result. In particular, sharing is separate from generation: a model’s text cannot move to Slack or a document merely because it was generated.

## Search results are evidence candidates, not conclusions

The dangerous pattern is to declare a current root cause because an old ticket shares keywords. The copilot treats similar cases as candidate directions. It separates current observations, the conditions of the historical case, the differences that still need verification, and the next check an operator can perform.

Support records therefore need to be reconstructed as incidents: time, product version, configuration, observed signal, action taken, outcome, and unresolved assumptions. The system should preserve the original source while making its conditions queryable. That allows an operator to see not just “five similar tickets,” but why two cases are relevant and where their versions or settings differ.

## Start from current evidence

An investigation begins by fixing a short statement of the current incident: affected service, start time, user impact, and what changed. Live logs, metrics, events, and change history are stored separately as observations. Only then does the copilot retrieve documentation and old cases.

Each retrieved candidate should carry source links, its applicable conditions, differences from the current environment, and a way to verify the claim. This prevents the memory of a previous case from overwriting current evidence.

## Keep a falsification path

A useful recommendation includes the evidence that supports it and the observation that could disprove it. If configuration X is a likely cause, the operator should see the current value, related logs, and change history, plus the next hypothesis if X proves normal. The quality standard is not fluent prose; it is whether an investigator can reproduce the reasoning ten minutes later.

## Promote knowledge with human review

Not every ticket should become reusable knowledge. Sensitive identifiers need masking, factual evidence must be separated from interpretation, and the version and configuration conditions of a fix need to be retained. Reviewers should see candidate knowledge, current evidence, unresolved differences, and proposed checks in one place.

Human-in-the-Loop is therefore more than an approval button. It means that the reviewer can see the source, amend a section, understand what was not established, and decide whether the result is suitable for export or sharing. An RCA draft is a review artifact, not an autonomous operational decision.

## Security and Responsible AI are flow constraints

Support email can contain customer environment details, timestamps, configuration, and contact information. Security therefore cannot be a sentence appended after generation. Microsoft Entra ID and MSAL/OIDC establish the identity and token boundary; HTTPS-only and restricted CORS narrow the browser path; Key Vault and Managed Identity separate runtime secret access; and gitleaks secret scanning catches accidental exposure before deployment.

The same principle governs Responsible AI. Generated RCA content must remain reviewable against the mail source, cannot be delivered automatically, and should make the need for human verification explicit. User input is isolated when it is passed into prompting, and unsupported claims are reduced by grounding the draft in the mail thread rather than treating fluent generated prose as evidence.

## What the first prototype should prove

The first version does not need every support channel. It needs to prove that the investigation and documentation path becomes more traceable: an engineer can find source evidence, reject an irrelevant pattern quickly, edit the draft safely, and avoid repeating the same manual structure in Word and Slack.

Vendor Support RCA Copilot is not meant to close tickets automatically. It is meant to turn complex support conversations into structured, reviewable Korean RCA reports while preserving the human decision boundary. That is what makes accumulated support experience reusable without asking the next engineer to trust a black-box answer.
