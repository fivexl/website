---
title: 'FivexL Newsletter, February 2026'
author_id: FivexL
date: 2026-02-27
description: 'FivexL Newsletter for February 2026 - Latest updates, blog posts, and insights from our cloud engineering team.'
author: FivexL
author_link: https://fivexl.io/
category: Newsletter
panel_image: fivexl-newsletter-white-logo.png
tags: ['Newsletter', 'AWS', 'Cloud Engineering']
---

February was a busy month at FivexL. We published two new case studies, ran our AWS re:Invent 2025 recap webinar, shipped open-source updates, and our podcast crew kept the conversation going on AI agents and infrastructure security. Here's what happened.

## Upcoming Webinar

Our next webinar will focus on healthcare startups and AWS — and we'll have a special guest joining. Stay tuned for the full announcement on our [LinkedIn](https://www.linkedin.com/company/5xl).

## Past Webinar: AWS re:Invent 2025 Recap

We hosted our [AWS re:Invent 2025 Recap](https://www.youtube.com/watch?v=-POnrk4phR0) webinar with [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/), [Guilherme Ferreira](https://fivexl.io/specialist/guilherme-ferreira/), and [Vladimir Samoylov](https://fivexl.io/specialist/vladimir-samoylov/). From 500+ launches, we picked the ones that actually mattered — features you can start using now — and explained what they are, why they count, and how they move the needle. If you missed the live session, the [recording is on YouTube](https://www.youtube.com/watch?v=-POnrk4phR0).

## FivexL Updates

### New case studies

- **[Sirob Technologies Case Study](https://fivexl.io/case-studies/sirob-case-study/)**
  FivexL built a secure, multi-tenant AWS platform for an Estonian AI startup, taking their agentic DevOps product from early MVP to production-ready infrastructure in under two months. The project covered a full Landing Zone via RightStart, zero-standing-access with SSO Elevator, centralized security monitoring, and a productized Bedrock deployment on ECS.

- **[Neverless Case Study](https://fivexl.io/case-studies/neverless-case-study/)**
  FivexL delivered a secure, production-ready AWS foundation for a London fintech company expanding beyond Google Cloud. The team needed to run AWS alongside their existing GCP setup without slowing down product work — RightStart gave them that foundation.

### Blog posts

- **[AWS News You Can Actually Use In 2026](https://fivexl.io/blog/aws-news-you-can-use-2026/)**
  This post is our shortlist of AWS new features worth adopting in 2026 if you want to stay on top of the technology.

- **[FivexL Newsletter, January 2026](https://fivexl.io/blog/fivexl-newsletter-january-2026/)**
  Missed last month? Catch up on the January edition — open-source releases, blog posts on AWS credits, and two podcast episodes on AI in dev workflows and Kubernetes vs managed services.

### Open-source project updates

- **[terraform-aws-cloudtrail-to-slack 4.5.0](https://github.com/fivexl/terraform-aws-cloudtrail-to-slack/releases/tag/4.5.0)**
  Terraform module that parses AWS CloudTrail events and sends selected ones to Slack. This release adds SNS fan-out support for CloudTrail S3 notifications, so multiple consumers can process the same CloudTrail events while keeping S3 batching intact. New inputs include `enable_s3_sns_fanout`, `create_s3_sns_fanout_topic`, and `s3_sns_fanout_topic_arn`. Existing setups using direct S3-to-Lambda delivery require no changes.

- **[lprobe v0.1.8](https://github.com/fivexl/lprobe/releases/tag/v0.1.8)**
  LProbe is a small CLI for running HTTP/TCP health checks against localhost inside container images (ECS, Docker) — a safer alternative to shipping curl or wget in every image. This release bumps CI tooling and Go to 1.26, keeping the tool aligned with current runtimes.

### Podcast: DevSecOps Talks

Our co-founder [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/) hosts the DevSecOps Talks podcast together with Paulina Dubas and Mattias Hemmingsson. In February, they released two new episodes: one on the January security landscape, and another featuring a guest deep-dive into agent-native infrastructure.

#### Episode #91 – January Security Roundup: CVSS 10 in n8n, Self-Hosted AI Scares, and Nonstop Patching

This episode kicks off with a CVSS 10 vulnerability in n8n, then looks at self-hosted AI assistants with weak defaults and prompt injection risks. The crew talks through what happens when a self-hosted bot has access to your API keys, inbox, and drives — and what your team should rotate, patch, and lock down before it becomes a problem.

[Listen to the full episode](https://devsecops.fm/episodes/091-january-security-roundup-cvss-10-in-n8n-self-hosted-ai-scares-and-nonstop-patching/)

#### Episode #92 – From System Initiative to SWAMP: Agent-Native Infra with Paul Stack

What can you automate with SWAMP today, from AWS to a Proxmox home lab? In this episode, the team talks with Paul Stack about how skills, scripts, and reusable workflows plug into your stack — and whether this could be the missing guardrails for your infrastructure agents.

[Listen to the full episode](https://devsecops.fm/episodes/092-from-system-initiative-to-swamp-agent-native-infra-with-paul-stack/)

Made it till the end? Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do! Sharing is caring!
