---
title: "Amazon Web Services Hackathon 2025: Defining the First Service Promise in One Day"
description: "How customer scenes and a press release set the implementation boundary for a one-day Working Backwards hackathon on March 29, 2025."
date: "2025-03-29"
lang: "en"
translationKey: "working-backwards-aws-web-services-hackathon-2025"
category: "methods"
subcategory: "working-backwards"
tags: ["working-backwards", "aws", "hackathon", "service-design", "customer-centricity"]
draft: false
comments: true
---

The Amazon Web Services Hackathon took place at the AWS Seoul office on March 29, 2025. In a one-day event, possible features always outnumber implementable ones. Teams therefore fixed **the first promise they would prove that day** in one press-release sentence before choosing technology.

![The Amazon Web Services Hackathon 2025 Working Backwards banner](/brilly/assets/blog/working-backwards/linkedin/activity-30.jpg)

## Use the press release as an end condition

A future marketing document tends to produce phrases such as “an innovative and convenient platform.” The hackathon version instead described an observable result:

```text
who + at which moment + can make which decision better
```

Once the sentence existed, administrator views, expansion features, and secondary customer journeys could be deferred when they did not prove the first promise. Supporting evidence and error states remained when customer trust depended on them.

The press release became a contract for “the experiment is done when this is true,” not a way to make the idea sound larger.

## Make the demo a minimum service contract

![Participants at Amazon Web Services Hackathon 2025](/brilly/assets/blog/working-backwards/linkedin/activity-29.jpg)

The demo followed one service flow:

```text
customer submits a problem or request
→ system performs the essential work
→ result and evidence return
→ customer chooses the next action
```

A model response or score on the final screen was not enough. The team needed to show the decision it supported and what the customer could do when the result was incomplete or wrong.

The same contract removed features during implementation. If the next customer action survived without a feature, it left the current scope and gained a reason for later review.

## Leave only responsibilities that protect the promise

Cloud services are easy to add to a hackathon diagram. Each component instead answered: “which part of the press release fails without this?”

An immediate result made latency and timeout product requirements. A result that could arrive later allowed asynchronous processing and notification. Sensitive input made authentication and storage boundaries essential. Operating complexity unrelated to the first promise moved into the FAQ.

This did not ignore production. It separated the minimum path proved today from operating paths that needed validation before real users.

## Turn judging questions into the next backlog

Presentations followed current customer scene → first promise → live demo → architectural responsibility → unverified risk. Questions became FAQ and backlog entries:

- what appears when an external API fails;
- how is the promise limited when data is insufficient;
- can a user recognize a wrong AI result;
- who approves and rolls back a production action.

These were not simply signs of an unfinished hackathon. They identified mocked boundaries and the next technical experiments.

Working Backwards at Amazon Web Services Hackathon 2025 did not constrain ideas for the sake of making them smaller. It made document, implementation, architecture, and presentation point to the **same promise that could be tested in one day**.
