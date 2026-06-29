---
title: 'FivexL Newsletter, June 2026'
author_id: FivexL
date: 2026-06-29
description: 'FivexL Newsletter for June 2026 - Latest updates, blog posts, and insights from our cloud engineering team.'
author: FivexL
author_link: https://fivexl.io/
category: Newsletter
panel_image: fivexl-newsletter-white-logo.png
tags: ['Newsletter', 'AWS', 'Cloud Engineering']
---

Greetings!

Have you set up your AWS accounts under time pressure and told yourself you'd sort it out later? Did later never arrive?

You're not alone. Most teams are running a setup that made sense in the early days and is turning into a liability as the company grows.

In June we published a guide on exactly this — AWS multi-account strategy across four stages of company growth, from day one to landing established companies. It walks through what to set up at each stage so you're not unpicking decisions when it's already expensive to do so.

We also put together a roundup of our latest podcasts and articles covering AWS and AI in DevOps — all in one place below.

<!--more-->

## Events

On June 17, Andrey Devyatkin, Anton Eremin, and Yousef De Baz ran a live session on building a solid AWS foundation from day one. They walked through the most common mistakes teams make when setting up AWS, shared best practices on account structure, IAM, networking, and logging, and gave advice on how to think about your setup at each stage of growth. The recording is up.

[Watch: Starting on AWS the Right Way](https://www.youtube.com/watch?v=jAvxbpb-lcw)

## Updates

### Open-source project updates

FivexL keeps the tooling we build for client work open source so you can use it in your own environments. Four releases shipped in June across three modules.

- **[terraform-aws-sso-elevator v4.2.1](https://github.com/fivexl/terraform-aws-sso-elevator/releases/tag/4.2.1)** and **[v4.2.2](https://github.com/fivexl/terraform-aws-sso-elevator/releases/tag/4.2.2)**
  If you're granting permanent elevated access to AWS and hoping nothing goes wrong, this module is the alternative. It handles just-in-time access via IAM Identity Center and Slack — engineers request what they need, get it approved, and the access expires automatically. Smaller blast radius, cleaner audit trail. v4.2.1 fixes approver list handling when a Slack user no longer exists and bumps urllib3 to 2.7.0; v4.2.2 aligns defaults.

- **[terraform-aws-cloudtrail-to-slack v4.5.1](https://github.com/fivexl/terraform-aws-cloudtrail-to-slack/releases/tag/4.5.1)**
  Sends CloudTrail events to Slack so your team gets notified about AWS API activity in real time — without having to dig through the console or set up custom alerting from scratch. Useful for catching unexpected changes before they become incidents. This release upgrades the Lambda runtime from python3.10 to python3.14 and removes obsolete backport dependencies.

- **[terraform-aws-ecs-events-to-slack v1.0.4](https://github.com/fivexl/terraform-aws-ecs-events-to-slack/releases/tag/1.0.4)**
  Routes ECS container events — task starts, stops, failures — to Slack. Saves you from checking the ECS console every time something behaves unexpectedly. This release adds support for passing extra IAM policy statements to the module.

### Blog post updates

- **[AWS Multi-Account Strategy for Startups: A Four-Stage Guide](https://fivexl.io/blog/aws-multi-account-strategy-startups/)**
  What does your AWS setup need to look like at seed stage? At Series A? When your first healthcare customer asks for a HIPAA BAA? The answer changes at every stage — and the decisions you make early are the hardest ones to undo. The post walks through four company growth stages and the account structure that makes sense at each one.

- **[FivexL Newsletter, May 2026](https://fivexl.io/blog/fivexl-newsletter-may-2026/)**
  Missed last month? The May edition covers the team at AWS Summit Bangkok and Latitude59, two releases for terraform-aws-account-baseline, new team member Gilbert Young Jr., and episodes #100 and #101 of DevSecOps Talks.

### Podcast: DevSecOps Talks

Our co-founder Andrey Devyatkin hosts the DevSecOps Talks podcast together with Paulina Dubas and Mattias Hemmingsson. Paulina is an independent Lead DevOps Engineer/Architect who spent the last decade building and shaping cloud platforms. Mattias is a former CISO at a car rental company, a certified pentester, and a cloud engineering enthusiast.

<a href="https://podcasts.apple.com/us/podcast/the-devsecops-talks-podcast/id1503645730"><img src="/images/pod_cover.png" alt="DevSecOps Talks Podcast" style="max-width: 300px;" /></a>

- **[Episode #102 - The 90-Day Patch Window Is Dead with Ian Amit and Matias Madou](https://devsecops.fm/episodes/102-the-90-day-patch-window-is-dead/)**
  Ian Amit (CEO, Gomboc AI) and Matias Madou (CTO, Secure Code Warrior) make a blunt case: the responsible disclosure clock was designed for a slower attacker. It no longer fits. IOActive evaluated 27 leading AI models across nearly 20,000 code samples — 31.6% of generated code was fully exploitable. Matias has a sharp analogy for why "find and fix later" is the wrong frame: nobody designs a car by shipping a bad model and iterating to a good one. The episode is worth the full listen.

- **[Episode #103 - European Cloud Sovereignty with Mark Shine, Pawel Piwosz and Filipe Berti](https://devsecops.fm/episodes/103-european-cloud-sovereignty-with-mark-shine-pawel-piwosz-and-filipe-berti/)**
  Three vendors sit down and say the same uncomfortable thing: defaulting to AWS, Azure, or GCP is no longer automatic in Europe. Mark Shine from Ankra, and Pawel Piwosz and Filipe Berti from UpCloud, talk through what European cloud actually offers in 2026. One number that landed: a team moved infrastructure to European providers and cut OPEX by 60% — about $100,000 a year — without a rebuild, because they already had the skills to run it.

- **[Episode #104 - When AI Coding Gets 10x More Expensive](https://devsecops.fm/episodes/104-when-ai-coding-gets-10x-more-expensive/)**
  Copilot flipped to token-based billing on June 1, and it's not subtle. Paulina ran the numbers on her own usage and came up roughly 10x. Andrey's take is that this is a trend, not a surprise — Cursor went first, and the subsidies are drying up across the board. The episode gets into how to route your coding agent through Amazon Bedrock, why AWS Budgets alone won't protect you from a runaway agent ($5,000 bills are real), and when paying for the more expensive model is actually the cheaper choice.

## Agentic AI in DevOps

Some of FivexL members are part of [Sirob Technologies](https://www.linkedin.com/company/sirob-technologies/), building [B.O.R.I.S](https://getboris.ai) — an infrastructure context layer. AI agents lose your environment the moment a session ends. B.O.R.I.S keeps the context across AWS, GitHub, and Slack, so every answer starts from how your stack actually works.

Building an agent in production teaches you things you can't learn from reading about agents. That's why Fernando Goncalves, Andrey Devyatkin, and Vladimir Samoylov run live sessions to share what's actually happening when you run AI agents against real systems.

<a href="https://www.youtube.com/@SiRobTechnologies"><img src="/images/Agentic-ai-in-devops-podcast-square.png" alt="Agentic AI in DevOps" style="max-width: 300px;" /></a>

- **[Episode #11 - Why Every DevOps Engineer Needs a "Second Brain"](https://www.youtube.com/watch?v=SYxUBjAN_nM)**
  Keeping up with complex infrastructure is exhausting. In this episode, we explore the concept of a "Second Brain" for DevOps and how B.O.R.I.S can prevent AI hallucinations and security risks in your AWS and Kubernetes environments. Learn why simple RAG (Retrieval-Augmented Generation) isn't enough for infrastructure and how a structured context layer allows AI agents to actually understand your private systems.

- **[Episode #12 - Why AI Agents Keep Guessing (And How to Fix It with Semantic Layers)](https://www.youtube.com/watch?v=BtstvoylK9k)**
  Most AI agents don’t know what your systems mean, where things live, or which data is actually relevant. So they search, assume, burn tokens, and often give a confident but wrong answer. In this episode, hosts break down the difference between Semantic and Context layers and why they are the "missing map" for your DevOps automation. Watch it, if you want to stop your AI agents from guessing and start getting reliable results.

- **[Episode #13 - Is iTerm Still King? Testing the New Challenger](https://www.youtube.com/watch?v=GarpvwG9Pyk)**
  Viktor Vedmich joins to talk about terminal workflows for AI agents — specifically what happens when your terminal becomes the bottleneck. The session covers cmux, Obsidian vault setups, Claude Code on Bedrock, AWS Kiro, spec-driven workflows, and why open-weight model competition matters more than people think for DevOps teams.

Want to see what B.O.R.I.S can do? [Join](https://getboris.ai) the Slack playground or book a [demo](https://calendar.app.google/Va3mFCmemdpRHn7A8).

<a href="https://getboris.ai/"><img src="/images/boris-ai-devops-teammate.png" alt="B.O.R.I.S - infrastructure context layer" style="max-width: 300px;" /></a>

## Top picks from the team

What caught our attention in Slack this month.

1. **[AWS Lambda introduces MicroVMs](https://aws.amazon.com/blogs/aws/run-isolated-sandboxes-with-full-lifecycle-control-aws-lambda-introduces-microvms/)**
   VM-level isolation with serverless startup times, built on Firecracker. You can snapshot a pre-initialized environment and resume it near-instantly with full memory and disk state intact. Relevant if you're building anything that runs untrusted code — AI coding tools, interactive sandboxes, that kind of thing.

2. **[Introducing AWS Continuum: security at machine speed](https://aws.amazon.com/blogs/security/introducing-aws-continuum-security-at-machine-speed/)**
   AWS's answer to the vulnerability backlog problem: an AI-driven tool in gated preview that goes through discovery, prioritization, validation, and mitigation while reasoning over your actual environment and business context — not a flat list of CVEs for someone to triage manually. Still early, but the prioritization angle is the piece worth watching.

3. **[AWS WAF adds AI traffic monetization](https://aws.amazon.com/blogs/aws/aws-waf-adds-ai-traffic-monetization-capability-to-help-content-owners-charge-ai-bots-for-content-access/)**
   Content owners can now charge AI crawlers for access at the network edge — per-request pricing by content path, bot category, or verification tier, with payments collected in stablecoins. Whether this takes off is an open question, but the underlying problem it's solving is real: AI bots consume your content, return nothing, and you carry the infrastructure cost.

4. **[Pake - turn any webpage into a desktop app](https://github.com/tw93/pake)**
   Rust + Tauri wrapper that turns any URL into a native desktop app under 10MB. Much lighter than Electron. Pre-built packages for common tools, or one CLI command to wrap your own. Nothing to do with AWS. Just a useful tool that made the rounds in Slack.

---

Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do.
