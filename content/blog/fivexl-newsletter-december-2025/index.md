---
title: 'FivexL Newsletter, December 2025'
author_id: FivexL
date: 2026-01-01
description: 'FivexL Newsletter for December 2025 - Latest updates, blog posts, and insights from our cloud engineering team.'
author: FivexL
author_link: https://fivexl.io/
category: Newsletter
panel_image: fivexl_newsletter-black-logo.png
tags: ['Newsletter', 'AWS', 'Cloud Engineering']
---

December 2025 was intense for us: closing projects, wrapping up the year, and taking a short break to reset. Now we’re entering 2026 and getting back to work with a clearer head and a better sense of what we want to focus on. In this newsletter, we’re sharing our latest blog posts and our thoughts on AWS re:Invent — the biggest AWS event of last year and an important signal for what’s coming next. 

From the whole FivexL team, Happy New Year 2026, and thank you for staying with us.

## FivexL Updates

### Open-source project updates
We had a new release of terraform-aws-sso-elevator in December. It’s about bridging the gap between Google Workspace SCIM (attributes sync) and AWS IAM Identity Center (group assignments) — so SSO Elevator can turn synced user attributes into automatic, Terraform-managed group membership in Identity Center.

- **[terraform-aws-sso-elevator 4.1.0](https://github.com/fivexl/terraform-aws-sso-elevator/releases/tag/4.1.0)**  
  New feature automatically assigns users to groups in Identity Center based on their attributes synced from Google Workspace. Google Workspace doesn’t sync Google Groups via SCIM, but it does sync user attributes—so this release uses those attributes to derive and apply group membership automatically. The result: fewer manual group updates, less drift, and a cleaner Terraform-native access workflow.

### Blog post updates
- **[Bridging the Gap: Automating Group Assignments in AWS IAM Identity Center with SSO Elevator](https://fivexl.io/blog/sso-elevator-group-assignment/)**
Google Workspace SCIM provisioning doesn’t sync groups into AWS IAM Identity Center, which leaves most teams stuck with a clumsy mix of SCIM and Terraform. This post shows how the new SSO Elevator feature uses user attributes to drive group membership instead, so you get Terraform-native group management, automatic reconciliation, and fewer moving parts to operate.  

- **[MVP: PostgreSQL on AWS in 10 Minutes](https://fivexl.io/blog/mvp-on-aws-part-3/)**
A practical guide for MVP teams who picked PostgreSQL on AWS and don’t want to rebuild it six months later. The article compares Aurora vs “plain” RDS Postgres, then walks through the day-zero choices that save time later: SSL enforcement, slow query logging, idle transaction timeouts, KMS keys, parameter groups, and a minimal Terraform baseline you can reuse.

### Podcast: DevSecOps Talks
Our co-founder Andrey Devyatkin hosts the DevSecOps Talks podcast together with Paulina Dubas and Mattias Hemmingsson. Paulina is an independent Lead DevOps Engineer/Architect who spent the last decade building and shaping cloud platforms. Mattias is a former CISO at a car rental company, a certified pentester, and a cloud engineering enthusiast. Together they use the show to sanity-check new trends, share what actually works in the field, and translate "DevSecOps" from buzzword back into day-to-day practice.

In December, they released a two-part “EU Compliance 101” mini-series focused on what engineers and platform teams actually need to know about the upcoming regulations.

#### Episode #87 - EU Compliance 101: AI Act, DORA, NIS2 explained
This episode walks through how to navigate these frameworks, classify AI systems by risk, understand incident reporting timelines, and see where board-level accountability and logging requirements show up in practice.

[Listen the full episode](https://devsecops.fm/episodes/087-eu-compliance-101-ai-act-dora-nis2-explained/)

#### Episode #88 - EU Compliance 101: DSA, MiCA explained
Here, the team looks at how these rules overlap, which few basics raise your compliance baseline quickly (central logs, backups, risk assessments, human-in-the-loop checks), and how to keep incident communication simple enough that it will actually be used.

[Listen the full episode](https://devsecops.fm/episodes/088-eu-compliance-101-dsa-mica-explained/)

### AWS re:Invent Recap

AWS re:Invent is always a bit of a whirlwind — a lot of announcements, a lot of shiny things. The vibe this year felt very “make the cloud easier to run day-to-day”: more automation, more security baked in, and AI showing up everywhere. Here’s our take on what actually mattered at the re:Invent.

<!-- Your thoughts here -->

Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do.

