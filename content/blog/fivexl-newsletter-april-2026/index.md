---
title: 'FivexL Newsletter, April 2026'
author_id: FivexL
date: 2026-05-04
description: 'FivexL Newsletter for April 2026 - Latest updates, blog posts, and insights from our cloud engineering team.'
author: FivexL
author_link: https://fivexl.io/
category: Newsletter
panel_image: colored-bg-white-x.png
tags: ['Newsletter', 'AWS', 'Cloud Engineering']
---

Greetings!

Here's what April looked like at FivexL: [Vladimir Samoylov](https://fivexl.io/specialist/vladimir-samoylov/) ran a live session on one of the most common compliance gaps we see at HIPAA and SOC 2 audits - teams that have logs but cannot prove anything. The recording and a full write-up are both out now. AWS also quietly moved a long list of services toward maintenance or sunset, and LocalStack's move to paid-only has the community hunting for alternatives. We have a roundup of what the team is watching.

<!--more-->

## Events

In April, [Vladimir Samoylov](https://fivexl.io/specialist/vladimir-samoylov/), Principal Cloud Engineering Consultant and AWS Solutions Architect at FivexL, hosted a live webinar — **Can You Prove Who Accessed Your Data?** — walking through how just-in-time access works in practice for teams heading into their first HIPAA or SOC 2 audit.

The core argument: you can have IAM policies, configured roles, and restricted permissions, and still fail to answer "who had access on March 12th, and what did they do?" Just-in-time access solves this not by adding more controls, but by making access time-bound and documented as a byproduct.

- [Watch the full recording on YouTube](https://www.youtube.com/live/JcKQYtp8i6M?si=jpmph5z1mWqtaBzt)
- [Read the write-up with 5 key takeaways](https://fivexl.io/blog/just-in-time-access-aws/)

## Updates

### Open-source project updates

FivexL keeps the tooling we build for client work open source so you can use it in your own environments. Two releases shipped in April.

- **[terraform-aws-sso-elevator v4.2.0](https://github.com/fivexl/terraform-aws-sso-elevator/releases/tag/v4.2.0)**
  The Terraform module for just-in-time access to AWS via IAM Identity Center and Slack. This release fixes an overlap issue between `attribute_sync_managed_groups` and `group_config` that could cause unintended behavior when both settings were in use simultaneously. Also includes a routine dependency bump for urllib3. Existing setups that don't use both settings together require no changes.

- **[terraform-aws-shared-parameters v0.2.0](https://github.com/fivexl/terraform-aws-shared-parameters/releases/tag/v0.2.0)**
  Terraform module for sharing SSM parameters across AWS accounts. This release adds `ignore_value_changes` support to the `shared_parameter` resource — useful when you want Terraform to manage a parameter's existence and metadata but let the value be set by an application or CI/CD pipeline without Terraform treating it as drift. First external contributor contribution to the module.

### Blog post updates

- **[Can You Prove Who Accessed Your Data?](https://fivexl.io/blog/just-in-time-access-aws/)**
  [Vladimir Samoylov](https://fivexl.io/specialist/vladimir-samoylov/) walks through five practical things worth taking back to your team from his recent webinar on just-in-time access. Covers why SSO alone is not enough (8-hour sessions give attackers more than enough time), how self-approval still produces a clean audit trail, and how to roll this out gradually without disrupting your team. Includes deployment steps for FivexL's open-source [SSO Elevator](https://github.com/fivexl/terraform-aws-sso-elevator) Terraform module. Worth reading if you're heading into a HIPAA or SOC 2 audit and want to be able to answer the auditor's access questions in seconds, not weeks.

- **[FivexL Newsletter, March 2026](https://fivexl.io/blog/fivexl-newsletter-march-2026/)**
  Missed last month? The March edition covers our webinar with Clearway Health's SVP of Technology on audit-ready architecture, the ECS alerting module overhaul, three new DevSecOps Talks episodes, and the launch of Humans in the Loop - our video series on agentic AI in DevOps.

### Top 4 articles from the team

What our team flagged in internal Slack this month - and what you can do with it.

1. **[AWS Service Availability Updates](https://aws-news.com/article/2026-03-31-aws-service-availability-updates)**
   AWS is moving a significant number of services to maintenance or sunset: App Runner, Audit Manager, CloudTrail Lake, Glue Ray Jobs, Amazon Comprehend Topic Modeling and Prompt Safety Classification, Rekognition Streaming Events, SNS Message Data Protection, Amazon RDS Custom for Oracle, WorkMail, WorkSpaces Thin Client, and the Service Management Connector are all either blocked to new customers or entering end-of-support. Andrey's take: "They had a period of shooting in all directions but now it appears they are much more focused." If you're using any of these, now is the time to check your roadmap.

2. **[AWS S3 Files: S3 Buckets Accessible as File Systems](https://aws.amazon.com/blogs/aws/launching-s3-files-making-s3-buckets-accessible-as-file-systems/)**
   AWS launched S3 Files, which lets you mount S3 buckets as POSIX-compatible file systems. Useful for workloads that expect a file system interface but want S3's durability and pricing underneath.

3. **[AWS Interconnect for Multicloud — Now Generally Available](https://aws.amazon.com/about-aws/whats-new/2026/04/aws-announces-ga-AWS-interconnect-multicloud/)**
   AWS Interconnect for multicloud is GA. Direct, private connectivity between AWS and other cloud providers without going through the public internet.

4. **LocalStack goes paid-only**
   LocalStack moved to paid-only in February 2026. If you use it for local AWS development and testing, the community has been evaluating alternatives: [ministack](https://github.com/ministackorg/ministack) is the closest drop-in replacement and keeps gaining traction, [floci](https://github.com/floci-io/floci) is another option, and [moto](https://github.com/getmoto/moto) remains solid for mocking specific AWS services in tests. Worth evaluating before your next sprint.

---

**Vlad's note from Slack this month:** "If you want to make fun of someone during the AI era — ask them to repeat a conversation they just had with an AI. It actually works." Context: he asked Claude what it knew about him, got a confident answer that was half-wrong, and apparently it is now a party trick.

---

Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do.
