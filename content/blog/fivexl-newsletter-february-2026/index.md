---
title: 'FivexL Newsletter, February 2026'
author_id: FivexL
date: 2026-03-06
description: 'FivexL Newsletter for February 2026 - Latest updates, blog posts, and insights from our cloud engineering team.'
author: FivexL
author_link: https://fivexl.io/
category: Newsletter
panel_image: fivexl-newsletter-white-logo.png
tags: ['Newsletter', 'AWS', 'Cloud Engineering']
---

Greetings!

FivexL kept its usual pace in February: two new case studies for our happy customers, AWS re:Invent 2025 recap webinar, a round of open-source releases, and two podcast episodes covering security patches and agent-native infrastructure. Here's the rundown.

<!--more-->

## Events

If you care about building an organisation where security is a habit, not a hero moment, this webinar is for you.

We're hosting a webinar with Rusty Atkinson, Senior Vice President, Technology at Clearway Health and author of "The Integrity Edge: Unlocking the Hidden Power of Ethical Leadership", on how to translate leadership values into real security decisions and build audit-ready architecture.

Topic: "From Leadership Values to Security: How to Build Audit-Ready Architecture" <br />
Date: Wednesday, 18 March 2026 <br />
Time: 10:00 AM EDT / 3 PM CET <br />
Duration: 1 hour <br />

Join live and stay for the Q&A, where you can ask Rusty and our FivexL principal consultants questions directly.

[Sign up for the webinar](https://lnkd.in/eT7k9pPh)

Want to get a feeling of our webinars? Last month [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/), [Guilherme Ferreira](https://fivexl.io/specialist/guilherme-ferreira/), and [Vladimir Samoylov](https://fivexl.io/specialist/vladimir-samoylov/) went through the 500+ announcements from AWS re:Invent 2025 and picked the ones that actually matter for day-to-day work. The conversation covered what's worth adopting now, what to keep an eye on, and what's safe to ignore. If you missed the live session, the [recording is on YouTube](https://www.youtube.com/watch?v=-POnrk4phR0).

## Updates

### Open-source project updates

We keep a lot of the tooling we build for client work open source so you can plug it into your own environments. In February we shipped updates to our CloudTrail-to-Slack Terraform module and to lprobe, our secure local-only health check tool.

- **[terraform-aws-cloudtrail-to-slack 4.5.0](https://github.com/fivexl/terraform-aws-cloudtrail-to-slack/releases/tag/4.5.0)**  
  Terraform module that parses AWS CloudTrail events and sends selected ones to Slack. This release adds SNS fan-out support for CloudTrail S3 notifications, so multiple consumers can process the same CloudTrail events while keeping S3 batching intact. New inputs include `enable_s3_sns_fanout`, `create_s3_sns_fanout_topic`, and `s3_sns_fanout_topic_arn`. Existing setups using direct S3-to-Lambda delivery require no changes.

- **[lprobe v0.1.8](https://github.com/fivexl/lprobe/releases/tag/v0.1.8)**  
  LProbe is a small CLI for running HTTP/TCP health checks against localhost inside container images (ECS, Docker) - a safer alternative to shipping curl or wget in every image. This release bumps CI tooling and Go to 1.26, keeping the tool aligned with current runtimes.

### Blog post and case study updates

- **[Sirob Technologies Case Study](https://fivexl.io/case-studies/sirob-case-study/)**  
  Sirob Technologies had a working AI product powered by Amazon Bedrock but no production infrastructure to run it on for real customers. FivexL built a secure, multi-tenant AWS platform - Landing Zone, zero-standing-access, security monitoring, and a productized Bedrock deployment on ECS - in under two months. If you're building an AI-native product and wondering how to get from prototype to production without a year-long infrastructure project, this one's for you.

- **[Neverless Case Study](https://fivexl.io/case-studies/neverless-case-study/)**  
  Neverless, a London fintech, needed to expand into AWS while keeping their existing Google Cloud environment running. FivexL delivered a secure, audit-ready AWS foundation via RightStart so the team could start building on AWS immediately without rethinking the basics. Worth reading if you're running multi-cloud or planning a migration and want to see how to set up the AWS side without slowing down your product work.

- **[AWS News You Can Actually Use In 2026](https://fivexl.io/blog/aws-news-you-can-use-2026/)**  
  AWS made 500+ announcements at re:Invent 2025. We went through all of them and pulled out the features that are actually worth adopting this year - things like ECS tmpfs support, Transfer Family web apps, and multi-region IAM Identity Center. If you don't have time to read every changelog but want to know what's changed, start here.

- **[FivexL Newsletter, January 2026](https://fivexl.io/blog/fivexl-newsletter-january-2026/)**  
  Missed last month? Catch up on the January edition - open-source releases, a practical guide to getting AWS credits, and two podcast episodes on AI in dev workflows and Kubernetes vs managed services.

### Podcast: DevSecOps Talks
Our co-founder [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/) hosts the DevSecOps Talks podcast together with Paulina Dubas and Mattias Hemmingsson. Paulina is an independent Lead DevOps Engineer/Architect who spent the last decade building and shaping cloud platforms. Mattias is a former CISO at a car rental company, a certified pentester, and a cloud engineering enthusiast. Together they use the show to sanity-check new trends, share what actually works in the field, and translate "DevSecOps" from buzzword back into day-to-day practice.

In February, they released two new episodes: one on the January security landscape, and another featuring a guest deep-dive into agent-native infrastructure.

#### Episode #91 – January Security Roundup: CVSS 10 in n8n, Self-Hosted AI Scares, and Nonstop Patching

This episode kicks off with a CVSS 10 vulnerability in n8n, then looks at self-hosted AI assistants with weak defaults and prompt injection risks. The crew talks through what happens when a self-hosted bot has access to your API keys, inbox, and drives - and what your team should rotate, patch, and lock down before it becomes a problem.

[Listen the full episode](https://devsecops.fm/episodes/091-january-security-roundup-cvss-10-in-n8n-self-hosted-ai-scares-and-nonstop-patching/)

#### Episode #92 – From System Initiative to SWAMP: Agent-Native Infra with Paul Stack

What can you automate with SWAMP today, from AWS to a Proxmox home lab? In this episode, the team talks with Paul Stack about how skills, scripts, and reusable workflows plug into your stack - and whether this could be the missing guardrails for your infrastructure agents.

[Listen the full episode](https://devsecops.fm/episodes/092-from-system-initiative-to-swamp-agent-native-infra-with-paul-stack/)


Made it till the end? Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do! Sharing is caring!
