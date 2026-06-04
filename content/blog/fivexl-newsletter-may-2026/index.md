---
title: 'FivexL Newsletter, May 2026'
author_id: FivexL
date: 2026-06-01
description: 'FivexL Newsletter for May 2026 - Latest updates, blog posts, and insights from our cloud engineering team.'
author: FivexL
author_link: https://fivexl.io/
category: Newsletter
panel_image: fivexl_newsletter-black-logo.png
tags: ['Newsletter', 'AWS', 'Cloud Engineering']
---

Greetings!

Lots happening in May. The team was out at conferences, presenting and sharing knowledge with the AWS community.

Vladimir Samoylov was at AWS Summit Bangkok, where he spoke about building multi-agent systems on AWS: Strands Agents, Amazon Bedrock, Kiro, and why tools and context matter more than prompt policing.

[Andrey Devyatkin and Berit Janson were at Latitude59 in Tallinn - a startup and tech conference bringing together founders, investors, and builders from across the world. They met with potential clients and partners and are already planning to be back next year. Those conversations reminded us how many teams are navigating the same AWS setup questions - so we decided to address them directly.

FivexL team is growing - this month we welcomed [Gilbert Young Jr.](https://fivexl.io/specialist/gilbert-young-jr/), an AWS and AI/ML engineer specialising in large language models, event-driven architecture, and serverless systems. Welcome, Gilbert!

<!--more-->

## Events

On June 17 we're hosting a live session on building a solid AWS foundation you won't outgrow. We'll cover how to set up accounts, security, and infrastructure the right way from day one, so you're not paying for it later with a costly rewrite when you scale or hit your first audit. [Register here](https://aws-foundation.scoreapp.com/)

**This session is recommended for:**
- CTOs, Heads of Engineering, and Founders
- Senior platform or DevOps engineers
- Teams moving production workloads to AWS - from on-prem, from another cloud, or starting a greenfield program on AWS

**What we'll cover:**

- **The principal** - Why the right AWS setup depends on your growth stage, not on copying enterprise patterns too early
- **Best practices** - Default VPC wizard, multi-region KMS keys, shared VPCs via Resource Access Manager, dedicated encryption accounts
- **MVP stage** - What to set up on day one: management account, Identity Center, and the foundations that are painful to add later
- **Growth stage** - When to separate Development, Staging, Production, and Internal Tooling, and how to do it without overengineering
- **Common mistakes** - Overlapping CIDR blocks, databases in public subnets, ClickOps over Terraform, and how to avoid them
- **What comes next** - Control Tower, account vending, centralized egress, and when you're actually ready for them

## Updates

### Open-source project updates

Two releases shipped for `terraform-aws-account-baseline` in May.

- **[terraform-aws-account-baseline v2.1.0](https://github.com/fivexl/terraform-aws-account-baseline/releases/tag/2.1.0)**
  Adds optional controls for regional EBS resources in `modules/region_level`: `create_ebs_snapshot_block_public_access` and `create_ebs_encryption_by_default`, both defaulting to `true`. Also adds the `s3_bucket_regional_domain_name` output to `modules/s3_baseline`, and deprecates the `attach_deny_incorrect_encryption_headers` and `attach_deny_unencrypted_object_uploads` inputs - these are now ignored and will be removed in the next major release in favor of always-managed SSE deny statements with a VPC Flow Logs exception.

- **[terraform-aws-account-baseline v2.0.1](https://github.com/fivexl/terraform-aws-account-baseline/releases/tag/2.0.1)**
  Routine dependency bump for the s3-bucket module from 5.8.2 to 5.10.0. No functional changes.

### Blog post updates

- **[Scaling AI Code Review Without Scaling Your AWS Bill](https://fivexl.io/blog/scaling-ai-code-review/)**
  AI code review across every repository sounds useful until you see the Bedrock invoice. Alexey Eremin walks through how FivexL rolled it out with CloudWatch alarms and an automatic Lambda circuit breaker that cuts off spending before it gets out of hand. Worth reading if you're evaluating AI code review at scale and want the cost story before you commit.

- **[Can You Prove Who Accessed Your Data?](https://fivexl.io/blog/just-in-time-access-aws/)**
  Three questions worth testing right now: who had elevated access to your production environment in the last 30 days, how long did each session last, and what was the stated reason? If you can't answer without digging through logs, this post is for you. Vladimir Samoylov covers the gap between having IAM policies and actually being able to prove access - and how just-in-time access closes it before an auditor asks.

- **[FivexL Newsletter, April 2026](https://fivexl.io/blog/fivexl-newsletter-april-2026/)**
  Missed last month? The April edition covers the live session on just-in-time access, two open-source releases, and what the team flagged in Slack - including AWS sunsetting a long list of services and the community fallout from LocalStack going paid-only.

### Podcast: DevSecOps Talks

Our co-founder Andrey Devyatkin hosts the DevSecOps Talks podcast together with Paulina Dubas and Mattias Hemmingsson. Paulina is an independent Lead DevOps Engineer/Architect who spent the last decade building and shaping cloud platforms. Mattias is a former CISO at a car rental company, a certified pentester, and a cloud engineering enthusiast.

Two episodes in May - one milestone, one deep dive on a topic that started the show six years ago.

<a href="https://podcasts.apple.com/us/podcast/the-devsecops-talks-podcast/id1503645730"><img src="/images/pod_cover.png" alt="DevSecOps Talks Podcast" style="max-width: 300px;" /></a>

- **[Episode #100 - 100 Episodes Later: What Still Matters in DevSecOps](https://devsecops.fm/episodes/100-100-episodes-later-what-still-matters-in-devsecops/)**
  Six years, 100 episodes, and a frank scorecard. The hosts go through what stuck - IaC, observability, platform engineering, incident response - and what didn't: unikernels, Nomad, service mesh as default, HashiCorp Waypoint. Compliance went from a niche concern to a daily one. Supply chain security moved from theoretical to operational. Andrey also announces a second podcast on agentic AI in DevOps, explicitly to keep that material out of this show. The clearest editorial line from the episode: don't become yet another AI podcast.

- **[Episode #101 - Infrastructure as Code in 2026: Still Essential or Already Changing?](https://devsecops.fm/episodes/101-infrastructure-as-code-in-2026-still-essential-or-already-changing-/)**
  Six years after episode #1, the hosts revisit IaC through a 2026 lens. Modules became an industry-wide reuse primitive that Terraform never designed them to be. Stacks are now a standard deployable unit. GitOps makes more sense for Kubernetes than for most other workloads. And agentic AI can write Terraform with some level of success - but determinism is the whole point of IaC, and agents still can't guarantee it. Worth listening if you're deciding what 2020-era IaC advice still applies and what to update.

## Agentic AI in DevOps Podcast

Some of FivexL members are part of [Sirob Technologies](https://www.linkedin.com/company/sirob-technologies/), building [B.O.R.I.S](https://getboris.ai), an infrastructure context layer. B.O.R.I.S connects to your AWS organisation, GitHub repositories, and Slack workspace, and knows the systems, the people behind them, and the changes over time. Read it through Slack, MCP or the API. Your data stays yours.

Building an agent in production teaches you things you can't learn from reading about agents. That's why Fernando Goncalves, Andrey Devyatkin, and Vladimir Samoylov started the podcast - to share what's actually happening when you run AI agents against real systems, not just talk about the theory.

<a href="https://podcasts.apple.com/us/podcast/agentic-ai-in-devops/id1890702822"><img src="/images/Agentic-ai-in-devops-podcast-square.png" alt="Agentic AI in DevOps" style="max-width: 300px;" /></a>

Three episodes in May - on what AI can actually do in DevOps, the Code with Claude conference takeaways, and how daily AI workflows have shifted in practice.

- **[Episode #8 - DevOps Jobs Agentic AI Can Actually Do](https://podcasts.apple.com/us/podcast/8-devops-jobs-agentic-ai-can-actually-do/id1890702822?i=1000767725541)**
  After the foundational episodes, the hosts get specific: which DevOps responsibilities does agentic AI handle well, and where does it still struggle? Managing infrastructure as code turns out to be harder for agents than application code because of state management. Documentation, runbooks, and postmortems are where agents deliver genuine value today. Also: a frank look at the gap between what companies claim about AI adoption and what engineers actually experience day to day.

- **[Episode #9 - Code with Claude: Routines, Agents, and the AWS Catch](https://podcasts.apple.com/us/podcast/9-code-with-claude-routines-agents-and-the-aws-catch/id1890702822?i=1000767999706)**
  A breakdown of what Anthropic announced at the Code with Claude developer conference - multi-agent orchestration, the SpaceX compute partnership, and the Claude on AWS integration. One compliance consideration worth noting if you're running on AWS: data still leaves AWS for Anthropic on the new integration path.

- **[Episode #10 - What Changed in Our Daily AI Workflow](https://podcasts.apple.com/us/podcast/10-what-changed-in-our-daily-ai-workflow/id1890702822?i=1000770465633)**
  The hosts compare their actual day-to-day workflows: what they run, what they've stopped doing, and how habits have shifted. Covers integrating linting and testing into agent skills, audit hooks, dead code sweeps, and timing agent operations. Ends with a debate on whether AI is humanity's final invention - make of that what you will.

Want to see what B.O.R.I.S can do? [Join the Slack playground](https://getboris.ai) and give it a spin.

<a href="https://getboris.ai/"><img src="/images/boris-ai-devops-teammate.png" alt="B.O.R.I.S - AI DevOps Teammate" style="max-width: 300px;" /></a>

## Top picks from the team

This month we went through the internal Slack conversations and picked the articles and tools our team members highlighted. Here's what caught their attention.

1. **[Variables in Terraform module source paths](https://developer.hashicorp.com/terraform/language/block/module)**
   You can now use variables in module `source` and `version` attributes. Terraform 1.15 introduces `const = true` on variable blocks. It tells Terraform the value can be resolved at init time instead of plan time, which means you can finally pass it into `source` and `version`.

2. **[New Terraform resource: aws_bedrockagentcore_harness](https://github.com/hashicorp/terraform-provider-aws/pull/47725)** and **[IAM Policy Autopilot](https://github.com/awslabs/iam-policy-autopilot)**
   Two AWS tooling additions worth knowing about. The new `aws_bedrockagentcore_harness` resource brings Bedrock Agent Core harness management into Terraform. And IAM Policy Autopilot is an open-source tool from AWS Labs that generates baseline IAM policies by scanning your source code for AWS SDK calls - useful if you're tired of manually figuring out which permissions your Lambda actually needs.

3. **[Acquired: IKEA](https://www.acquired.fm/episodes/ikea)**
   If you need a good listen over the weekend and want to learn more about how IKEA built one of the most quietly dominant global businesses ever, this episode is it. Not infrastructure-related - just genuinely good.

4. **[AWS Organizations: increased SCP quotas](https://aws.amazon.com/about-aws/whats-new/2026/05/aws-organizations-increased-scp-quotas/)**
   AWS doubled the SCP quotas in Organizations - maximum SCPs per node went from 5 to 10, and maximum SCP size from 5,120 to 10,240 characters. If you've ever hit the SCP limit while trying to write comprehensive controls across multiple accounts, this is the update you've been waiting for.
---

Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do.
