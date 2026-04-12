---
title: 'Secure AWS Foundation for Fintech Startup, Neverless'
author_id:
  - 'Anton Eremin'
  - 'Vladimir Samoylov'
summary: 'FivexL delivered a secure, production-ready AWS foundation for a London fintech company expanding beyond Google Cloud.'
date: 2026-02-13
author: Anton Eremin Vladimir Samoylov
panel_image: neverless_consultants.png
authors_heading: 'Two lead consultants for the project'
alt_image: neverless_consultants.png
case_study: true
layout: 'case_study'
tags: ['case study', 'aws', 'fintech', 'RightStart', 'Compliance', 'Security']
testimonial: "FivexL were very clear on scope and delivered exactly what we needed: an AWS foundation we could build on with confidence while keeping our Google Cloud environment running."
testimonial_author: "Neverless Team"
testimonial_author_position: ""
testimonial_long: |
  "The process was easy to follow, and the setup was structured so we can keep extending AWS without constantly rethinking the basics. When we had questions, the team supported us with clear explanations and demos, which made the handover smooth and helped us feel comfortable operating the setup day to day."
about_company:
  logo: 'neverless_logo.png'
  heading: 'About Neverless'
  text: |
    <a href="https://neverless.com/" target="_blank">Neverless</a> is a London-based fintech company building the world's first fee-free cryptocurrency trading platform — so everyday people can buy and sell crypto (and even gold) without the usual trading costs cutting into returns. Beyond simple trading, Neverless offers automated, hedge-fund-style Strategies™: a "set-and-run" option designed to grow your holdings using techniques typically reserved for professional trading firms. Founded in 2022 by former Revolut executives, it operates under EU regulation and is backed by investors including Lakestar, Connect Ventures, and Nordstar.
double_panel:
  layout: 'case-studies'
  heading: "CASE STUDIES"
  subheading: "SaaS, AI, health care, and financial startups trust FivexL to build their infrastructure in AWS, empowering their businesses to grow faster. Learn how."
  icon_links:
    - { url: "https://github.com/fivexl", icon: "github" }
    - { url: "https://www.linkedin.com/company/5xl", icon: "linkedin" }
  button_cta: { url: "/contact", text: "Book a consultation" }
  media_panel: { url: "https://youtu.be/uruLy1goNW0" }
---
{{< case_study/challenge image="neverless_challenge.png" image_css="object-position: center" >}}
{{< pink_heading text="Challenge" sizes="bigger">}}
When Neverless decided to expand beyond Google Cloud, this wasn't an experiment. The goal was to run AWS in production and steadily move a major part of the platform there — without slowing releases or opening security gaps.<br/>
<br/>
They needed an AWS footprint to get closer to the ecosystem they depend on. In crypto, many exchanges and core industry services have historically lived in AWS, and that gravity field matters: latency, connectivity patterns, and even day-to-day operational expectations shift when most counterparties are "AWS-first."<br/>
<br/>
The catch: Neverless had a strong Google Cloud setup, but not deep AWS expertise in-house — and no time for a slow learning curve. Building the basics the right way (accounts, networking, identity, security guardrails, and a deployment-ready baseline) would take time they didn't have. Building them the wrong way would lock in costly debt at the foundation layer.<br/>
<br/>
They came to FivexL with a clear task: set up the AWS foundation quickly and safely, so the team could extend the AWS side immediately — while keeping Google Cloud running and leaving room for a future shift of ~70% of the platform to AWS.
{{</ case_study/challenge >}}

{{< case_study/solution heading="Solution" >}}
{{< case_study/column >}}
Neverless needed AWS running in production without slowing delivery. FivexL focused on the AWS foundation (accounts, governance, identity, security, and cost controls). Workload migration was handled by the Neverless team, with guidance where needed.<br/>
<br/>
FivexL delivered <a href="/rightstart">RightStart for AWS</a> — a productized service which provides the organization and security foundation so the team could build and migrate workloads on top at their own pace.<br/>
<br/>
<strong>RightStart for AWS</strong> gave Neverless a secure, scalable AWS foundation that could be rolled out quickly, without creating rework later. RightStart is a ready-to-deploy AWS foundation built on AWS Control Tower. It sets up a secure, multi-account AWS Organization using proven best practices and Terraform templates, improving alignment with regulatory requirements and preparing the environment for compliance certification such as SOC 2 or a security audit.<br/>
<br/>
<strong>Dedicated Accounts with Multi-Account Strategy</strong><br/>
Neverless adopted a Multi-Account AWS Strategy. This approach separates environments and workloads into different AWS accounts, which improves security and makes operations easier to manage. As a result, Neverless received a clear, well-organized structure with accounts grouped by organizational units — including dedicated accounts for workloads, tools, shared networking, observability, and encryption services.
{{</ case_study/column >}}
{{< case_study/column >}}
<strong>Centralized Organization Management with Control Tower</strong><br/>
FivexL enabled AWS Control Tower in Neverless's primary region and selected a secondary region for governance. This put AWS-managed guardrails and baseline audit logging in place from the start. With Control Tower and AFT (Account Factory for Terraform), Neverless gained centralized control over all AWS accounts in the organization.<br/>
<br/>
<strong>Enhanced Security with Centralized Security Tools</strong><br/>
Neverless received a dedicated Security Tooling Account to manage essential tools like CloudTrail, Security Hub, Config, and GuardDuty across the organization. FivexL included its open-source tool <a href="https://github.com/fivexl/terraform-aws-sso-elevator">SSO Elevator for AWS</a> in the RightStart package, offering temporary elevated access through AWS IAM Identity Center and Slack.<br/>
<br/>
<strong>Effective Cost Management</strong><br/>
RightStart includes features like cost anomaly detection, which alerts the team if spending trends exceed predefined thresholds via email and AWS Chatbot. Using shared configurations, such as network and encryption, reduces the overall resources, leading to significant cost savings.
{{</ case_study/column >}}
{{</ case_study/solution >}}

{{< case_study/solution heading="Implementation Process" >}}
{{< case_study/column >}}
The work was delivered in clear stages, and each major stage ended with a customer demo to show what was already working, confirm outcomes, and align on next steps.<br/>
<br/>
<strong>Stage 0: Project kickoff</strong><br/>
Aligned on essentials: where the AWS setup will live, who owns what, and what inputs needed from the customer.<br/>
<br/>
<strong>Stage 1: Secure access</strong><br/>
Set up safe, controlled access to the new AWS environment. You need a secure "front door" before anything else.<br/>
<br/>
<strong>Stage 2: Remove scaling blockers</strong><br/>
Removed typical AWS account limits and support blockers that can stop a new setup from scaling.<br/>
<br/>
<strong>Stage 3: Set the cloud foundation</strong><br/>
Created a governed AWS foundation that acts like the "operating system" for the company's cloud.
{{</ case_study/column >}}
{{< case_study/column >}}
<strong>Stage 4: Make access simple and auditable</strong><br/>
Connected AWS access to the company's existing identity system, keeping access simple to manage and easy to audit.<br/>
<br/>
<strong>Stage 5: Automate the setup</strong><br/>
Put the foundation under automation for consistent, repeatable deployments. This removes manual work and prevents mistakes.<br/>
<br/>
<strong>Stage 6: Apply security/logging/cost defaults</strong><br/>
Applied the standard baseline across the AWS setup: security, logging, and cost visibility from day one.<br/>
<br/>
<strong>Stage 7: Prepare environments + handover</strong><br/>
Prepared core environments (dev, staging, production) and connected operational workflows. Handed over walkthroughs and documentation so teams can start building immediately.
{{</ case_study/column >}}
{{</ case_study/solution >}}

{{< case_study/section >}}
{{< md >}}![Architectural diagram](neverless_diagram.png){{</ md >}}
{{</ case_study/section >}}

{{< case_study/benefits
    cta_text="Start Your Success Story"
    cta_url="/contact"
    image="neverless_benefits.png"
    >}}
{{< pink_heading text="Benefits" >}}
<strong>Enabled AWS production use while keeping Google Cloud running</strong> — reducing migration risk and avoiding downtime during expansion.<br/>
<br/>
<strong>Immediate outcomes (first month)</strong><br/>
Neverless got what they came for: RightStart delivered as an AWS organization and security foundation, without slowing down their product work. One of the strongest signals of real adoption was how quickly they used disciplined access patterns — they were among the few customers who started using SSO Elevator for production access right after deployment.<br/>
<br/>
<strong>Longer-term outcomes (2–6 months)</strong><br/>
Neverless can expand the AWS side while keeping GCP running, and continue workload migration on their own on top of a foundation they won't need to rebuild later. That baseline reduces the risk of having to redo core platform pieces like networking, and it simplifies audit work because the structure and controls exist from day one.<br/>
<br/>
They also secured additional AWS credits, giving them a longer runway to build on AWS with significantly less infrastructure cost pressure.
{{</ case_study/benefits >}}
