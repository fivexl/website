---
title: 'FivexL Newsletter, January 2026'
author_id: FivexL
date: 2026-02-02
description: 'FivexL Newsletter for January 2026 - Latest updates, blog posts, and insights from our cloud engineering team.'
author: FivexL
author_link: https://fivexl.io/
category: Newsletter
panel_image: fivexl-newsletter-black-logo.png
tags: ['Newsletter', 'AWS', 'Cloud Engineering']
---

January at FivexL usually means less writing and more time deep in customer systems, and this year is no exception. Our consultants are busy helping teams turn last year’s plans into concrete AWS changes: tightening security, cleaning up foundations, and making room for the next round of features.

## Upcoming Events

This month we will be hosting a AWSre:Invent 2025 Recap (Wednesday, 11th of February)! [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/), [Guilherme Ferreira](https://fivexl.io/specialist/guilherme-ferreira/), and [Vladimir Samoylov](https://fivexl.io/specialist/vladimir-samoylov/) will be going through the re:Invent announcements and pick the ones they believe are actually worth your time — features you can start using now that will make a visible difference in how you run AWS. There’s still time to join the [webinar](https://fivexl-webinar.scoreapp.com/); it’s a good chance to meet the team, see how we think about these changes, and ask your own questions. 

## FivexL Updates

### Open-source project updates

We keep a lot of the tooling we build for client work open source so you can plug it into your own environments. In January we shipped a few small but useful updates to our CloudTrail-to-Slack Terraform module and to lprobe, our secure local-only health check tool.

- **[terraform-aws-cloudtrail-to-slack 4.4.1](https://github.com/fivexl/terraform-aws-cloudtrail-to-slack/releases/tag/4.4.1)**  
  Terraform module that parses AWS CloudTrail events and sends selected ones to Slack, so you can see sensitive activity without building your own pipeline. This release adds an `enable_eventbridge_notifications` flag, making it easier to use EventBridge for routing notifications (or combine it with other delivery options) instead of relying only on S3 bucket notifications.

- **[terraform-aws-cloudtrail-to-slack 4.4.0](https://github.com/fivexl/terraform-aws-cloudtrail-to-slack/releases/tag/4.4.0)**  
  Same module, but with more control over how it integrates with your existing S3 setup. The new `create_bucket_notification` variable lets you decide whether the module should manage S3 bucket notifications itself, which is useful if that bucket is shared with other consumers or already has complex notification rules.

- **[lprobe v0.1.7](https://github.com/fivexl/lprobe/releases/tag/v0.1.7)**  
  LProbe is a small CLI for running HTTP/TCP health checks against localhost inside container images (ECS, Docker) — a safer alternative to shipping curl or wget in every image. This release updates Go modules and dependencies to the latest versions, keeping it aligned with current runtimes and security fixes.

### Blog post updates

- **[How to Get AWS Credits: Practical Guide for Startups 2026](https://fivexl.io/blog/how-to-get-aws-credits/)**  
  There's a lot of information about AWS credits and the different programs behind them. It's easy to get stuck — unsure which credits apply to your stage, what you actually qualify for, and where to start. This guide breaks down the three main paths: AWS Activate (Founders for self-funded teams, Portfolio for VC/accelerator-backed startups), PoC credits for testing specific ideas before production, and MAP credits for serious migrations. Each section includes eligibility requirements, step-by-step application instructions, and common rejection reasons to avoid.

- **[FivexL Newsletter, December 2025](https://fivexl.io/blog/fivexl-newsletter-december-2025/)**  
  Missed the last newsletter? Now's your chance to catch up — we had plenty of good stuff there: the SSO Elevator 4.1.0 release for automatic group assignments, blog posts on PostgreSQL setup and IAM Identity Center automation, plus a two-part DevSecOps Talks mini-series on EU compliance.

### Podcast: DevSecOps Talks
Our co-founder [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/) hosts the DevSecOps Talks podcast together with Paulina Dubas and Mattias Hemmingsson. Paulina is an independent Lead DevOps Engineer/Architect who spent the last decade building and shaping cloud platforms. Mattias is a former CISO at a car rental company, a certified pentester, and a cloud engineering enthusiast. Together they use the show to sanity-check new trends, share what actually works in the field, and translate "DevSecOps" from buzzword back into day-to-day practice.

In January, they released two new episodes: one on how AI agents and tools fit into real development workflows, and another on the trade-offs between Kubernetes and managed services when you factor in cost, lock-in, and team reality.

#### Episode #89 – Agents, Reviews, and Secrets: Real Talk on AI in Dev

This episode looks at how AI is actually being used in development teams today, beyond the hype. The crew talk about where developers get real value versus where tools are misused or ignored, what happens when agents get access to environment variables, repositories, and pipelines, and how to handle prompts, reviews, and “secret” sharing in a way that keeps trust. It’s a grounded conversation for teams trying to bring AI into their delivery workflow without losing control of security or process.

[Listen the full episode](https://podcasts.apple.com/se/podcast/89-agents-reviews-and-secrets-real-talk-on-ai-in-dev/id1503645730?i=1000743831745)

#### Episode #90 – K8s vs Managed Services: Cost, Lock-In, and Reality

In this episode, the team takes a hard look at when you actually need Kubernetes and when managed services are enough. They compare K8s to native orchestrators, dig into how cost models and vendor lock-in really play out over time, and talk about how your team’s skills should influence the choice. It’s a practical conversation for anyone deciding whether to double down on Kubernetes or simplify around managed services.

[Listen the full episode](https://podcasts.apple.com/se/podcast/90-k8s-vs-managed-services-cost-lock-in-and-reality/id1503645730?i=1000745761013)

### Top 3 articles from the team

Three articles that stood out in our Slack in January — and when they might matter for you.

1. [Amazon ECS now supports tmpfs mounts on AWS Fargate and ECS Managed Instances](https://aws.amazon.com/about-aws/whats-new/2026/01/amazon-ecs-tmpfs-mounts-aws-fargate-managed-instances/)

ECS tasks on Fargate and ECS Managed Instances can now use tmpfs (in-memory) file systems.

Use case: When you need fast, short-lived storage for scratch data or secrets, or want containers with a read-only root filesystem but still need a writable area.

2. [AWS Transfer Family Terraform module now supports web apps](https://aws.amazon.com/about-aws/whats-new/2026/01/aws-transfer-family-terraform-webapps/)

The Terraform module for AWS Transfer Family can now create browser-based web apps for S3 file transfer.

Use case: When non-technical users or partners need a simple web portal to upload/download files to S3, and you want everything managed via Terraform and your existing SSO.

3. [AWS IAM Identity Center enables account access and application use in multiple AWS Regions](https://aws.amazon.com/about-aws/whats-new/2026/02/aws-iam-identity-center-multi-region-aws-account-access-and-application-deployment/)

IAM Identity Center can now replicate from its primary Region to additional Regions of your choice. If the primary Region is disrupted, users continue to have access to their AWS accounts using entitlements provisioned in the additional Regions. If you've been following our work on [SSO Elevator resilience](https://fivexl.io/blog/sso-elevator-3-1-0-resilience/) after the October 2025 us-east-1 incident, this is AWS addressing the same pain point and allows for deployment of a standby SSO Elevator.

Use case: When you need uninterrupted SSO access to AWS accounts even during regional outages, or when you want to deploy AWS applications closer to your users while keeping IAM Identity Center administration centralized.


Made it till the end? Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do! Sharing is caring!
