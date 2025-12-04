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

November was a busy month for us. We published two blog posts, our co-founder Andrey Devyatkin recorded a new podcast episode, and we pulled together a list of articles our teammates shared internally in Slack.

December is already moving fast, and Christmas is just around the corner. Before everyone disappears into code freezes, travel, and family time, we wanted to say thank you for subscribing to this newsletter. We’ll do our best to keep it practical and worth your time.

From the whole FivexL team, we wish you a calm end of the year, as few surprises in production as possible, and some proper rest when the holidays hit.

## FivexL Updates

### Open-source project updates

We had two releases of terraform-aws-sso-elevator in November. Both are about keeping a core security workflow aligned with how AWS and Terraform actually behave today, not last year.

- **[terraform-aws-sso-elevator 4.0.0](https://github.com/fivexl/terraform-aws-sso-elevator/releases/tag/4.0.0) – AWS Provider v6 support**  
  Adds official support for hashicorp/aws v6 and refreshes dependencies (including our S3 baseline module) to match the new behaviour. Treat it like any major provider upgrade: review the plan carefully, test in a non-prod account, then roll it out gradually.

- **[terraform-aws-sso-elevator 4.0.1](https://github.com/fivexl/terraform-aws-sso-elevator/releases/tag/4.0.1) – Auto-cleanup for one-time schedules**  
  One-time schedules are now automatically deleted after they run. Keeps the state clean, reduces confusion, and lowers the risk of anything being triggered twice by accident. This release also includes a contribution from the community.

### Blog post updates

- **[Building Resilience into SSO Elevator 3.1.0: Lessons from an AWS Outage](https://fivexl.io/blog/sso-elevator-3-1-0-resilience/)**  
  After the October 19 AWS us-east-1 disruption, we discovered a hidden dependency on the Organizations API that broke SSO Elevator in otherwise healthy Regions. Version 3.1.0 implements intelligent S3-based caching that keeps things running even when AWS services are degraded.

- **[How to Build an MVP on AWS (Part 1): Account Setup, Security & Cost Control](https://fivexl.io/blog/mvp-on-aws-part-1/)**  
  Our default answer to "how do we start on AWS without shooting ourselves in the foot?" Covers account structure, minimal viable security, and cost controls we always turn on before anyone ships a single feature.

### Podcast: DevSecOps Talks
#### New episode: #86 – MCP plugins: your next security blind spot?

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

Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do.