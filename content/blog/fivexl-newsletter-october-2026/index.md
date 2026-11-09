---
title: 'FivexL Newsletter, October 2026'
author_id: FivexL
date: 2026-11-04
description: 'FivexL Newsletter for October 2026 - Latest updates, blog posts, and insights from our cloud engineering team.'
author: FivexL
author_link: https://fivexl.io/
category: Newsletter
panel_image: fivexl_newsletter-black-logo.png
tags: ['Newsletter', 'AWS', 'Cloud Engineering']
---

Greetings!

October was full of new open-source releases and conversations with customers. More and more, we're talking about AI with tech leaders from different industries.

The biggest release is SSO Elevator 5.0. You can now request temporary AWS access from the command line in every account of your AWS Organization, and your Slack secrets stay out of Terraform state.

Next Wednesday, 11 November, we're running a live webinar on Amazon Bedrock AgentCore together with AWS. Details and registration are below.

In this edition you'll also find the team's top articles of the month, a new blog post, and October's episodes of our two podcasts, DevSecOps Talks and Agentic AI in DevOps.

<!--more-->

## Events

### Upcoming webinar: Amazon Bedrock AgentCore

Every product team now has "add an AI agent" somewhere on the roadmap. The hard part is trying it without pulling engineers off the product.

On Wednesday, 11 November, at 8am CET / 9am EET, [Vladimir Samoylov](https://fivexl.io/specialist/vladimir-samoylov/) (Partner and Principal Consultant, FivexL) and Jyri Seiger (Senior Solutions Architect for Startups, AWS) will show you how to run an AI agent proof-of-concept on AgentCore, fast enough to get a real answer before you commit engineering time. In 45 minutes, you'll learn:

- **What AgentCore actually gives you:** the main building blocks (runtime, gateway, memory and identity), what each one is for, and how they fit together.
- **How to run a PoC without touching your product:** a real customer story of an agent kept separate from production, with its own cost tracking and monitoring, so the team could decide whether it belonged in the product.
- **Security, data residency and connecting to your stack:** choosing the region your agent runs in, calling it from Lambda with IAM, and what gets harder when agents from outside AWS, like Cursor or OpenAI, need access.
- **Built-in features most teams rebuild themselves:** browser, code interpreter, web search, and Bedrock Guardrails, which protect a public chatbot with one click.

Join live if you can, because you can bring your own setup and get specific answers instead of general ones, and that's the part you can't get from a recording. If you can't make it, register anyway, and we'll send the recording to everyone who signs up.

[Register for the webinar](https://fivexl.io/webinars/aws-agentcore/)

### Thoughts from the Applied AI conference

Our co-founder [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/) attended the Applied AI Fall 2026 Conference in St. Paul, Minnesota. Andrey's main takeaway: we are back to basics. AI is a force multiplier, so if your processes aren't in place, there's little to multiply. And shipping fast only matters when there's business value behind what you ship.

## Updates

### Open-source project updates

We keep the tools we build for client work open source, so you can use them in your own environments too. Here's what we released in October, plus one fix from the first days of November.

- **SSO Elevator** gives engineers temporary elevated access to AWS through IAM Identity Center and Slack, so nobody needs standing admin rights.
  - [5.0.0](https://github.com/fivexl/terraform-aws-sso-elevator/releases/tag/5.0.0) is a major release. The `elevator` CLI now works for callers in every account of your AWS Organization and proves who they are with a signed STS proof. Slack secrets move to SSM SecureString parameters, so they never pass through Terraform state. One REST API now serves both Slack and the CLI, with optional AWS WAF (`waf_enabled`), and the audit log also records declined requests. It needs planned upgrade steps, so read the upgrade guide in the repository first. The blog post below walks through the changes.
  - [5.0.1](https://github.com/fivexl/terraform-aws-sso-elevator/releases/tag/5.0.1) adds an agent skill for requesting AWS access with the `elevator` CLI and checks that `secondary_fallback_email_domains` entries start with `@`.

- **Shared Parameters** creates SSM parameters and shares them across your AWS Organization with AWS Resource Access Manager.
  - [1.0.0](https://github.com/fivexl/terraform-aws-shared-parameters/releases/tag/1.0.0) gives RAM share principals stable keys, so changing the list no longer reshuffles them.
  - [2.0.0](https://github.com/fivexl/terraform-aws-shared-parameters/releases/tag/2.0.0) adds an optional `region` input and a new `org_info/discover` module that reads organization data without creating resources. It requires AWS provider 6.0, so stay on 1.0.0 if you still use provider 5.x.

- **[S3 Server Access Logs Lake 1.0.3](https://github.com/fivexl/terraform-aws-s3-server-access-logs-lake/releases/tag/1.0.3)** collects S3 server access logs from across your organization in a central log-archive account. This release lets you turn off three account-wide settings the module creates (`create_ebs_snapshot_block_public_access`, `create_ebs_encryption_by_default` and `create_ssm_block_public_sharing`), so they don't clash when the account also runs Account Baseline. Defaults stay `true`, so existing setups require no changes.

- **[S3 Small Object Compaction v0.4.0](https://github.com/fivexl/terraform-aws-s3-small-object-compaction/releases/tag/v0.4.0)** merges small S3 objects into larger files, which cuts storage costs and speeds up Athena queries. The new `file_format = "parquet"` mode merges Parquet files properly, and the default mode now refuses to merge Parquet, ORC and Avro files instead of producing files nobody can read. Lambdas move to Python 3.14.

- **[Tag Generator 3.1.0](https://github.com/fivexl/terraform-aws-tag-generator/releases/tag/3.1.0)** generates tags for AWS resources following AWS best practices. You can now add custom tags without a prefix by setting `custom_prefix` to an empty string.

- **[lprobe v0.2.2](https://github.com/fivexl/lprobe/releases/tag/v0.2.2)** runs local health check probes inside container images on ECS, Docker and Kubernetes. It replaces `wget` and `curl` in hardened images, so an attacker who breaks into a container can't use those tools to download more. This release, out on 3 November, updates the `go-jose` dependency to fix a security issue in that library. Existing setups require no changes, but it's worth upgrading.

### Blog post updates

- **[Request Temporary AWS Access from the CLI: SSO Elevator 5.0](https://fivexl.io/blog/request-temporary-aws-access-from-cli/)**  
  This post walks through what's new in SSO Elevator 5.0, including the organization-wide CLI, the signed STS proof, and Slack secrets that stay out of Terraform state. It's worth reading if you want to request AWS access from a script, a CI job or an AI coding agent, or if you're planning the upgrade from 4.x.

- **[FivexL Newsletter, September 2026](https://fivexl.io/blog/fivexl-newsletter-september-2026/)**  
  Missed last month? Catch up on FivexL earning the AWS AI Services Competency, the Terraform module that helps reduce AWS Config costs in Control Tower, the new SSO Elevator releases, and the summer's DevSecOps Talks and Agentic AI in DevOps episodes.

### Podcast: DevSecOps Talks

Our co-founder [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/) hosts the DevSecOps Talks podcast together with Paulina Dubas and Mattias Hemmingsson. Paulina is an independent Lead DevOps Engineer/Architect who spent the last decade building and shaping cloud platforms. Mattias is a former CISO at a car rental company, a certified pentester, and a cloud engineering enthusiast. Together they use the show to sanity-check new trends, share what actually works in the field, and translate "DevSecOps" from buzzword back into day-to-day practice.

<a href="https://podcasts.apple.com/us/podcast/the-devsecops-talks-podcast/id1503645730"><img src="/images/pod_cover.png" alt="DevSecOps Talks Podcast" style="max-width: 300px;" /></a>

In October, they released four new episodes, about DevOps careers, juniors learning in the age of AI, hacked fridges, and patching that never reaches production.

- **[Episode #112 - DevOps Careers: What Should You Learn Now?](https://devsecops.fm/episodes/112-devops-careers-what-should-you-learn-now-/)**  
  What's worth learning when agents handle more of the implementation? Andrey and Mattias talk about why knowing how systems fail stays valuable, what business understanding means beyond keeping containers running, and why rebuilding SaaS in-house can turn engineers into internal vendors.

- **[Episode #113 - Books, Juniors and Mattias's Dark Factories](https://devsecops.fm/episodes/113-books-juniors-and-mattias-s-dark-factories/)**  
  When AI handles implementation, a junior's first task might be approving code headed straight to production. Andrey, Paulina and Mattias debate how juniors should learn, why scope checks before planning keep changes small, and why the vocabulary you get from books helps you describe problems to AI.

- **[Episode #114 - Fridge Hacks and Security by Obscurity](https://devsecops.fm/episodes/114-fridge-hacks-and-security-by-obscurity/)**  
  A fridge controller exposed to the internet can put a supermarket's stock at risk. Andrey and Mattias discuss refrigeration attacks, passwords anyone can calculate, AI-assisted reverse engineering, and concerns about remote access to solar inverters.

- **[Episode #115 - Julien Bisconti on Node2Shell, PHP and Patch Panic](https://devsecops.fm/episodes/115-julien-bisconti-on-node2shell-php-and-patch-panic/)**  
  A merged security fix does nothing for a service still running the vulnerable build. Andrey, Mattias and returning co-host Julien Bisconti talk about why patching main and patching production are different milestones, why removing a shell doesn't stop interpreter-based attacks, and the server trust stores that browser updates don't reach.

## Agentic AI in DevOps

Some of FivexL members are part of [Sirob Technologies](https://www.linkedin.com/company/sirob-technologies/), building [B.O.R.I.S](https://getboris.ai) — an infrastructure context layer. AI agents lose your environment the moment a session ends. B.O.R.I.S keeps the context across AWS, GitHub, and Slack, so every answer starts from how your stack actually works.

Building an agent in production teaches you things you can't learn from reading about agents. That's why Fernando Goncalves, Andrey Devyatkin, and Vladimir Samoylov run live sessions to share what's actually happening when you run AI agents against real systems.

<a href="https://www.youtube.com/@SiRobTechnologies"><img src="/images/Agentic-ai-in-devops-podcast-square.png" alt="Agentic AI in DevOps" style="max-width: 300px;" /></a>

Four episodes came out in October.

- **[Episode #21 - 8 DevOps Jobs to Try With Decision Models](https://www.youtube.com/watch?v=VtPM9633BB4)**  
  An alert needs triage, a ticket needs a duplicate check, and a frontier LLM is answering both. Andrey, Vladimir and Fernando explore how decision models could make routine checks like these cheaper, as long as the thresholds and gates stay in code, and where classifiers fall short.

- **[Episode #22 - From Agent Traces to Better Evals with Nikita Kabardin](https://www.youtube.com/watch?v=fV5Mr7dYK4o)**  
  An agent can pass its evals and still disappoint customers. Andrey, Vladimir and Fernando talk with Langfuse engineer Nikita Kabardin about building a golden dataset from real traces, spotting an agent that improves its scores by changing the grading, and keeping private customer traces out of public workflows.

- **[Episode #23 - Git Hosting Has a Scale Problem. Do You?](https://www.youtube.com/watch?v=-ulac7LDGH0)**  
  Agents can open pull requests faster than teams can review them. Andrey, Vladimir and Fernando look at the storage changes at GitHub, GitLab and Cursor, which agent jobs can use file APIs instead of full clones, and why most teams hit other limits long before Git hosting.

- **[Episode #24 - Applying AI Agents to Infra Security with Mohit Bansal](https://www.youtube.com/watch?v=xNJ9_2a7txQ)**  
  A malicious package lands, and production scans only answer part of the question. Andrey and Vladimir talk with Mohit Bansal about how Webflow cut supply chain triage from hours to minutes, why developer laptops belong in every malicious-package investigation, and where MCP configs and agent transcripts leave credentials exposed.

Want to see what B.O.R.I.S can do? [Join the waiting list](https://www.getboris.ai/#waitlist) to try the free version, or [book a demo](https://www.getboris.ai/book-a-demo/).

<a href="https://getboris.ai/"><img src="/images/boris-ai-devops-teammate.png" alt="B.O.R.I.S - infrastructure context layer" style="max-width: 300px;" /></a>

## Top 5 articles from the team

Here's what caught our team's attention this month.

1. **[Create a spend limit in AWS Settings](https://docs.aws.amazon.com/accounts/latest/reference/create-spend-limit.html)**  
   AWS now lets you set the most you'll pay per month for a project. If a project reaches its limit, AWS pauses it and stops its resources, so costs stay within the limit. It's designed for experiments, learning and sandboxes. We think projects will make AWS simpler to use.

2. **[AWS Cost Explorer, Budgets, and Dashboards now support Amazon Bedrock product attributes](https://aws.amazon.com/about-aws/whats-new/2026/10/aws-bedrock-attributes-in-cost-explorer/)**  
   You can now break down Bedrock costs by model, model provider, inference type and feature, and set a budget that alerts on spend for a single model. Combine this with cost allocation tags to see which applications drive spend on each model. If your Bedrock bill keeps growing and you don't know why, start here.

3. **[Introducing enhanced custom event buses in Amazon EventBridge](https://aws.amazon.com/blogs/aws/introducing-enhanced-custom-event-buses-in-amazon-eventbridge-for-enterprise-scale-event-driven-applications/)**  
   You can now share one central event bus across all the accounts in your AWS Organization, with ordering guarantees and a new pricing model. Until now, routing events between teams in a multi-account setup meant chaining event buses with cross-account rules.

4. **[Announcing Amazon ECS Gateway, a managed ingress solution for your ECS services](https://aws.amazon.com/about-aws/whats-new/2026/10/announcing-amazon-ecs-gateway/)**  
   ECS Gateway creates and manages Application Load Balancers for your ECS services, with host-based routing and up to 25 services sharing one ALB. Keep an eye on cost, though: ALB pricing counts rule evaluations, so with many services on one ALB, sharing it can cost more than separate ALBs.

5. **[Amazon Bedrock AgentCore CLI version 1.0 is now available](https://aws.amazon.com/about-aws/whats-new/2026/10/amazon-bedrock-agentcore-cli-version-1-0-available/)**  
   The AgentCore CLI helps you create, deploy and operate AI agents from the terminal. Version 1.0 starts faster, has a consistent command structure, and lets you work with runtimes, memory, identity and gateways directly. Existing projects can move to it with `agentcore migrate`. If you want to see AgentCore in action, join our webinar on 11 November.

---

Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do.
