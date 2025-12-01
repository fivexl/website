---
title: 'FivexL Newsletter, November 2025'
author_id: FivexL
date: 2025-12-01
description: 'FivexL Newsletter for November 2025 - Latest updates, blog posts, and insights from our cloud engineering team.'
author: FivexL
author_link: https://fivexl.io/
category: Newsletter
panel_image: fivexl-newsletter-white-logo.png
tags: ['Newsletter', 'AWS', 'Cloud Engineering']
---

Once a month we send a focused update for FivexL customers that covers what actually changed: open-source module updates, new DevSecOps Talks podcast and YouTube episodes, our latest blog posts and case studies, plus a small slice of industry news worth your attention. Every link here was hand-picked by our team and includes their short notes on why it matters.

## FivexL Updates

### Open-source project updates

We had two releases of terraform-aws-sso-elevator in November. Both are about keeping a core security workflow aligned with how AWS and Terraform actually behave today, not last year.

#### terraform-aws-sso-elevator 4.0.0 – AWS Provider v6 support

AWS Provider v6 is where the ecosystem is heading, so we didn’t want SSO Elevator to be the piece that holds you back from upgrading. 

This release adds official support for hashicorp/aws v6 and refreshes dependencies (including our S3 baseline module) to match the new behaviour. From our side, this is about keeping the “elevated access” path boring and predictable while the provider moves forward. 

From your side, treat it like any major provider upgrade: review the plan carefully, test in a non-prod account, then roll it out gradually. 

[See release](https://github.com/fivexl/terraform-aws-sso-elevator/releases/tag/4.0.0)

#### terraform-aws-sso-elevator 4.0.1 – Auto-cleanup for one-time schedules

After watching a few real-world setups, we noticed one-time schedules had a habit of sticking around long after they’d done their job. That creates noise in the control plane and makes it harder to see what’s actually live.

In 4.0.1, SSO Elevator now automatically deletes one-time schedules after they run. It’s a small change, but it keeps the state clean, reduces confusion, and lowers the risk of anything being triggered twice by accident. This release also includes a contribution from the community, which we’re always happy to ship. 

[Take a look](https://github.com/fivexl/terraform-aws-sso-elevator/releases/tag/4.0.1)

### New blog post

<a href="https://fivexl.io/blog/mvp-on-aws-part-1/">
<img src="AWS-Partner.png" alt="MVP on AWS" />
</a>

#### How to Build an MVP on AWS (Part 1): Account Setup, Security & Cost Control

We wrote this article because we kept seeing the same pattern with early-stage teams: great product ideas running on a "temporary" AWS setup that somehow ends up in production—one account, shared keys, no logs, surprise bills, and a future audit headache baked in.

This post is our default answer to "how do we start on AWS without shooting ourselves in the foot?" It's the playbook we use with customers: how we structure accounts from day one, what we consider "minimal viable security," and which cost controls we always turn on before anyone ships a single feature.

If you're spinning up something new—or quietly worried about the foundations of what you already have—this is the baseline we'd want your team to start from. 

[Read the full blog post](https://fivexl.io/blog/mvp-on-aws-part-1/)

### Podcast: DevSecOps Talks
#### New episode: #86 – MCP plugins: your next security blind spot?

<div style="max-width: 150px; width: 150px;">
<a href="https://devsecops.fm/episodes/086-mcp-plugins-your-next-security-blind-spot-/?utm_source=chatgpt.com">
<img src="pod_cover.png" alt="DevSecOps Talks Podcast" style="width: 150px !important; height: 150px !important; max-width: 150px !important; object-fit: cover; display: block;" />
</a>
</div>

Our co-founder Andrey Devyatkin hosts the DevSecOps Talks podcast together with Paulina Dubas and Mattias Hemmingsson. Paulina is an independent Lead DevOps Engineer/Architect who spent the last decade building and shaping cloud platforms. Mattias is a former CISO at a car rental company, a certified pentester, and a cloud engineering enthusiast. Together they use the show to sanity-check new trends, share what actually works in the field, and translate "DevSecOps" from buzzword back into day-to-day practice.

In this episode, the crew dives into Model Context Protocol (MCP) plugins and treats them like what they really are: a new security surface. They walk through how MCP stacks are put together, where over-privileged plugins and prompt injection can hurt you, and what you should be logging and limiting so your AI helpers don't quietly become a backdoor into production. 

[Listen the full episode](https://devsecops.fm/episodes/086-mcp-plugins-your-next-security-blind-spot-/?utm_source=chatgpt.com)

### Top 10 articles from the team

From everything our team shared internally this month, these are the top 10 links we think are most likely to change how you build, secure, and pay for AWS.

1. [VPC encryption controls – enforce in-transit encryption inside your VPCs](https://aws.amazon.com/blogs/aws/introducing-vpc-encryption-controls-enforce-encryption-in-transit-within-and-across-vpcs-in-a-region/)

2. [IAM Outbound Identity Federation – short-lived identities for SaaS APIs](https://aws.amazon.com/ru/blogs/aws/simplify-access-to-external-services-using-aws-iam-outbound-identity-federation/)

3. [S3 Block Public Access at the organization level](https://aws.amazon.com/about-aws/whats-new/2025/11/amazon-s3-block-public-access-organization-level-enforcement/)

4. [Secrets Manager – managed external secrets for SaaS](https://aws.amazon.com/about-aws/whats-new/2025/11/aws-secrets-manager-managed-external-secrets/)

5. CloudTrail data events – aggregation & anomaly detection  
   [Aggregation](https://aws.amazon.com/about-aws/whats-new/2025/11/cloudtrail-data-event-aggregation-security-monitoring/) | [Insights](https://aws.amazon.com/about-aws/whats-new/2025/11/cloudtrail-insights-data-events-detect-anomalies-access/)

6. [AWS Backup for Amazon EKS](https://aws.amazon.com/blogs/aws/secure-eks-clusters-with-the-new-support-for-amazon-eks-in-aws-backup/)

7. [Application Load Balancer – JWT verification](https://aws.amazon.com/about-aws/whats-new/2025/11/application-load-balancer-jwt-verification)

8. Enforce tagging with AWS Organizations Tag Policies + Terraform support  
   [AWS blog](https://aws.amazon.com/blogs/mt/enforce-consistent-tagging-across-iac-deployments-with-aws-organizations-tag-policies/) | [Terraform guide](https://github.com/hashicorp/terraform-provider-aws/blob/main/website/docs/guides/tag-policy-compliance.html.markdown)

9. [Querying Terraform state with AWS Athena](https://awsteele.com/blog/2025/10/26/querying-terraform-state-with-aws-athena.html)

10. [Terraform cost estimation using Infracost](https://spacelift.io/blog/terraform-cost-estimation-using-infracost)