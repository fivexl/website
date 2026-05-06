---
title: 'FivexL Newsletter, April 2026'
author_id: FivexL
date: 2026-05-06
description: 'FivexL Newsletter for April 2026 - Latest updates, blog posts, and insights from our cloud engineering team.'
author: FivexL
author_link: https://fivexl.io/
category: Newsletter
panel_image: colored-bg-white-x.png
tags: ['Newsletter', 'AWS', 'Cloud Engineering']
---

Greetings!

Here's what April looked like at FivexL: a live session on the compliance gap nobody talks about until the auditor is in the room, two open-source releases, and a roundup of what the team flagged in Slack - including AWS sunsetting a long list of services and the community fallout from LocalStack going paid-only.

<!--more-->

## Events

If you care about passing a HIPAA or SOC 2 audit without spending a week digging through logs, [Vladimir Samoylov](https://fivexl.io/specialist/vladimir-samoylov/) ran a live session on just-in-time access in April that's worth an hour of your time. The recording is up.

- [Watch the recording on YouTube](https://www.youtube.com/live/JcKQYtp8i6M?si=jpmph5z1mWqtaBzt)

## Updates

### Open-source project updates

FivexL keeps the tooling we build for client work open source so you can use it in your own environments. Two releases shipped in April.

- **[terraform-aws-sso-elevator v4.2.0](https://github.com/fivexl/terraform-aws-sso-elevator/releases/tag/v4.2.0)**
  The Terraform module for just-in-time access to AWS via IAM Identity Center and Slack. This release fixes an overlap issue between `attribute_sync_managed_groups` and `group_config` that could cause unintended behavior when both settings were in use simultaneously. Also includes a routine dependency bump for urllib3. Existing setups that don't use both settings together require no changes.

- **[terraform-aws-shared-parameters v0.2.0](https://github.com/fivexl/terraform-aws-shared-parameters/releases/tag/v0.2.0)**
  Terraform module for sharing SSM parameters across AWS accounts. This release adds `ignore_value_changes` support to the `shared_parameter` resource - useful when you want Terraform to manage a parameter's existence and metadata but let the value be set by an application or CI/CD pipeline without Terraform treating it as drift. This release also marks the first external contributor to the module.

### Blog post updates

- **[Can You Prove Who Accessed Your Data?](https://fivexl.io/blog/just-in-time-access-aws/)**
  Can you? Three questions to test right now: who had elevated access to your production environment in the last 30 days, how long did each session last, and what was the stated reason? If you can't answer without digging through logs, this post is for you. Vladimir Samoylov covers five things worth taking back to your team - including why SSO alone isn't enough and how to get a clean audit trail without slowing anyone down.

- **[FivexL Newsletter, March 2026](https://fivexl.io/blog/fivexl-newsletter-march-2026/)**
  Missed last month? The March edition covers our webinar with Clearway Health's SVP of Technology on audit-ready architecture, the ECS alerting module overhaul, three new DevSecOps Talks episodes, and the launch of Agentic AI in DevOps - our podcast on agentic AI in practice.

### Podcast: DevSecOps Talks

Our co-founder [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/) hosts the DevSecOps Talks podcast together with Paulina Dubas and Mattias Hemmingsson. Paulina is an independent Lead DevOps Engineer/Architect who spent the last decade building and shaping cloud platforms. Mattias is a former CISO at a car rental company, a certified pentester, and a cloud engineering enthusiast. Together they use the show to sanity-check new trends, share what actually works in the field, and translate "DevSecOps" from buzzword back into day-to-day practice.

In April, four new episodes dropped - on AI SRE, supply chain security, and what it actually takes to keep a platform simple.

<a href="https://podcasts.apple.com/us/podcast/the-devsecops-talks-podcast/id1503645730"><img src="/images/pod_cover.png" alt="DevSecOps Talks Podcast" style="max-width: 300px;" /></a>

- **[Episode #96 - Keeping Platforms Simple and Fast with Joachim Hill-Grannec](https://podcasts.apple.com/us/podcast/the-devsecops-talks-podcast/id1503645730)**
  Joachim Hill-Grannec on how platforms get bloated and what it takes to keep them fast - trunk-based development, small batches, and treating cycle time as the metric that actually matters. The episode makes the case that security and quality should be delivery enablers, not gatekeepers.

- **[Episode #97 - Shift Left, Get Hacked: Supply Chain Attacks Hit Devs](https://podcasts.apple.com/us/podcast/the-devsecops-talks-podcast/id1503645730)**
  A breakdown of the March 2026 supply chain incidents - compromised publishing credentials, post-install hooks used as attack vectors, and how both automated tooling and human review caught malicious releases before they spread. Practical hardening strategies for developer environments.

- **[Episode #98 - Beyond AI SRE](https://podcasts.apple.com/us/podcast/the-devsecops-talks-podcast/id1503645730)**
  Andrey on what comes after the AI SRE hype: the DevOps talent shortage, the cost pressure building around AI operations, why repeatable operational tasks are where agents actually deliver, and why keeping customer data inside their own AWS accounts is non-negotiable.

- **[Episode #99 - AI SRE and the End of 3 AM On-Call](https://podcasts.apple.com/us/podcast/the-devsecops-talks-podcast/id1503645730)**
  Mattias, Paulina, and Birol Yildiz on whether AI can handle the worst parts of incident response before you even join the call - AI-written status updates, faster root cause analysis, and a realistic look at the path from read-only assistance to autonomous remediation. Their suggestion on where to start: post-mortems and documentation.

## Agentic AI in DevOps Podcast

Some of FivexL members are part of [Sirob Technologies](https://www.linkedin.com/company/sirob-technologies/), building [B.O.R.I.S](https://getboris.ai/) - an AI DevOps teammate that plugs into your existing tools (AWS, GitHub, monitoring, logs) and helps with incident response, troubleshooting, and daily ops. Building an agent in production teaches you things you can't learn from reading about agents. That's why [Fernando Goncalves](https://fivexl.io/specialist/fernando-goncalves/), [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/), and [Vladimir Samoylov](https://fivexl.io/specialist/vladimir-samoylov/) started the podcast - to share what's actually happening when you run AI agents against real systems, not just talk about the theory.

Four episodes in April - on harness engineering, agent guardrails, AI cost pressure, and when memory makes agents worse.

<a href="https://podcasts.apple.com/us/podcast/agentic-ai-in-devops/id1890702822"><img src="/images/Agentic-ai-in-devops-podcast-square.png" alt="Agentic AI in DevOps" style="max-width: 300px;" /></a>

- **[Episode #4 - Harness Engineering: What Claude Code Accidentally Taught Everyone](https://podcasts.apple.com/us/podcast/4-harness-engineering-what-claude-code-accidentally/id1890702822?i=1000761194823)**
  A packaging error exposed Claude Code's full source code to the public - and instead of controversy, it became a lesson. The episode introduces "harness engineering" as an emerging discipline: the model is the horsepower, but the harness is what determines whether the agent goes where you need it to.

- **[Episode #5 - Stop Your Agent Before It Breaks Prod](https://podcasts.apple.com/us/podcast/5-stop-your-agent-before-it-breaks-prod/id1890702822?i=1000761972487)**
  A walkthrough of the agentic loop and how to put guardrails in it before something goes wrong. The hosts make the case that three lines of bash in a single hook can prevent infrastructure damage - and discuss what Anthropic's recent releases mean for teams running agents against real systems.

- **[Episode #6 - The Big AI Squeeze](https://podcasts.apple.com/us/podcast/6-the-big-ai-squeeze/id1890702822?i=1000763067988)**
  On the cost pressure building around AI tooling - rising subscription limits, local inference hardware, and the practical question of whether any of it is rational at current prices. Worth listening if you're trying to figure out how to run meaningful AI workflows without the bill running away from you.

- **[Episode #7 - When Agent Memory Helps and When It Hurts](https://podcasts.apple.com/us/podcast/7-when-agent-memory-helps-and-when-it-hurts/id1890702822?i=1000764515139)**
  The agent memory lifecycle - capture, management, retrieval - and where it breaks down. Semantic memory makes an already non-deterministic LLM even less predictable, and poisoned memory files are a real risk. The episode maps out when memory is worth the tradeoff and when it's not.

Want to see what B.O.R.I.S can do? [Join the Slack playground](https://getboris.ai) and give it a spin.

<a href="https://getboris.ai/"><img src="/images/boris-ai-devops-teammate.png" alt="B.O.R.I.S - AI DevOps Teammate" style="max-width: 300px;" /></a>

## Top 4 articles from the team

What our team flagged in internal Slack this month - and what you can do with it.

1. **[AWS Service Availability Updates](https://aws-news.com/article/2026-03-31-aws-service-availability-updates)**
   AWS is moving a significant number of services to maintenance or sunset: App Runner, Audit Manager, CloudTrail Lake, Glue Ray Jobs, Amazon Comprehend Topic Modeling and Prompt Safety Classification, Rekognition Streaming Events, SNS Message Data Protection, Amazon RDS Custom for Oracle, WorkMail, WorkSpaces Thin Client, and the Service Management Connector are all either blocked to new customers or entering end-of-support. Andrey's take: "They had a period of shooting in all directions but now it appears they are much more focused." If you're using any of these, now is the time to check your roadmap.

2. **[AWS S3 Files: S3 Buckets Accessible as File Systems](https://aws.amazon.com/blogs/aws/launching-s3-files-making-s3-buckets-accessible-as-file-systems/)**
   AWS launched S3 Files, which lets you mount S3 buckets as POSIX-compatible file systems. Useful for workloads that expect a file system interface but want S3's durability and pricing underneath. Good fit for ML pipelines and data-heavy workloads that currently use EFS just for the interface.

3. **[AWS Interconnect for Multicloud - Now Generally Available](https://aws.amazon.com/about-aws/whats-new/2026/04/aws-announces-ga-AWS-interconnect-multicloud/)**
   AWS Interconnect for multicloud is GA. Direct, private connectivity between AWS and other cloud providers without going through the public internet. If you're running anything split across clouds - data in GCP, compute in AWS, or the other way around - this removes the public internet from that path.

4. **LocalStack goes paid-only**
   LocalStack moved to paid-only in February 2026. If you use it for local AWS development and testing, the community has been evaluating alternatives: [ministack](https://github.com/ministackorg/ministack) is the closest drop-in replacement and keeps gaining traction, [floci](https://github.com/floci-io/floci) is another option, and [moto](https://github.com/getmoto/moto) remains solid for mocking specific AWS services in tests. Worth evaluating before your next sprint.

---

**Vlad's joke:** Try this - ask someone to summarize the last conversation they had with an AI. Watch them struggle. Then ask the AI the same question. It will confidently get it wrong. Vlad discovered this when he asked Claude what it knew about him - got a very assured answer that was about half fiction. It is now a party trick.

---

Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do.
