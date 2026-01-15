---
title: 'FivexL Newsletter, December 2025'
author_id: FivexL
date: 2026-01-14
description: 'FivexL Newsletter for December 2025 - Latest updates, blog posts, and insights from our cloud engineering team.'
author: FivexL
author_link: https://fivexl.io/
category: Newsletter
panel_image: fivexl_newsletter-black-logo.png
tags: ['Newsletter', 'AWS', 'Cloud Engineering']
---

## Intro

December is always an intense month in the AWS consulting land. On one hand, you have re:Invent with its barrage of announcements, presentations, and a lot of action to stay up-to-date with. On the other hand, it is the end of the year — which often means project deadlines. And on top of that, you have the upcoming holiday season with its preparations, buying presents, concerts at school, and so on. A very, very busy month. This is why you are reading this newsletter only now. On the bright side, we got an opportunity to disconnect and recharge, and now we are ready to jump into 2026. From all of us at FivexL — Happy New Year 2026, and thank you for staying with us!

## Upcoming Events

Speaking of re:Invent — we will be hosting a re:Invent recap next month! [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/), [Guilherme Ferreira](https://fivexl.io/specialist/guilherme-ferreira/), and [Vladimir Samoylov](https://fivexl.io/specialist/vladimir-samoylov/) will be going through the re:Invent announcements. There were more than 500 announcements this year, so if they were to cover all of them in one hour, that would be about 8 announcements per minute! No, no, just joking. They will pick the announcements they think are the most useful — the ones you can put to work straight away and that will actually make a difference — and break them down in detail. Stay tuned for more details!

## FivexL Updates

### Open-source project updates
We had a new release of terraform-aws-sso-elevator in December. It’s about bridging the gap between Google Workspace SCIM (Google Workspace users -> AWS IAM Identity Center sync) and AWS IAM Identity Center group assignments — so SSO Elevator can automatically assign synced users to groups based on their attributes so you do not need to maintain user to group mapping in Terraform. Handy!

- **[terraform-aws-sso-elevator 4.1.0](https://github.com/fivexl/terraform-aws-sso-elevator/releases/tag/4.1.0)**  
  New feature automatically assigns users to groups in Identity Center based on their attributes synced from Google Workspace. Google Workspace doesn’t sync Google Groups via SCIM, but it does sync user attributes—so this release uses those attributes to derive and apply group membership automatically. The result: fewer manual group updates, less drift, and a cleaner Terraform-native access workflow.

### Blog post updates
- **[Bridging the Gap: Automating Group Assignments in AWS IAM Identity Center with SSO Elevator](https://fivexl.io/blog/sso-elevator-group-assignment/)**
Google Workspace SCIM provisioning doesn’t sync groups into AWS IAM Identity Center, which leaves most teams stuck with a clumsy mix of SCIM and Terraform. This post shows how the new SSO Elevator feature uses user attributes to drive group membership instead, so you get Terraform-native group management, automatic reconciliation, and fewer moving parts to operate.  

- **[MVP: PostgreSQL on AWS in 10 Minutes](https://fivexl.io/blog/mvp-on-aws-part-3/)**
A practical guide for MVP teams who picked PostgreSQL on AWS and don’t want to rebuild it six months later. The article compares Aurora vs “plain” RDS Postgres, then walks through the day-zero choices that save time later: SSL enforcement, slow query logging, idle transaction timeouts, KMS keys, parameter groups, and a minimal Terraform baseline you can reuse.

### Podcast: DevSecOps Talks
Our co-founder [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/) hosts the DevSecOps Talks podcast together with Paulina Dubas and Mattias Hemmingsson. Paulina is an independent Lead DevOps Engineer/Architect who spent the last decade building and shaping cloud platforms. Mattias is a former CISO at a car rental company, a certified pentester, and a cloud engineering enthusiast. Together they use the show to sanity-check new trends, share what actually works in the field, and translate "DevSecOps" from buzzword back into day-to-day practice.

In December, they released a two-part “EU Compliance 101” mini-series focused on what engineers and platform teams actually need to know about the upcoming regulations.

#### Episode #87 - EU Compliance 101: AI Act, DORA, NIS2 explained
This episode walks through how to navigate these frameworks, classify AI systems by risk, understand incident reporting timelines, and see where board-level accountability and logging requirements show up in practice.

[Listen the full episode](https://devsecops.fm/episodes/087-eu-compliance-101-ai-act-dora-nis2-explained/)

#### Episode #88 - EU Compliance 101: DSA, MiCA explained
Here, the team looks at how these rules overlap, which few basics raise your compliance baseline quickly (central logs, backups, risk assessments, human-in-the-loop checks), and how to keep incident communication simple enough that it will actually be used.

[Listen the full episode](https://devsecops.fm/episodes/088-eu-compliance-101-dsa-mica-explained/)

### Top 3 articles from the team

In 2025 there was no escape from AI, so it's no surprise it made its way into this section as well.

1. [2025 LLM Year in Review by Andrej Karpathy](https://karpathy.bearblog.dev/year-in-review-2025/)

2. [Stanford AI Club: Jeff Dean on Important AI Trends](https://www.youtube.com/watch?v=AnTw_t21ayE)

3. [Termboard – Knowledge Graphs Without Complexity](https://termboard.com/start/)


Made it till the end? Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do! Sharing is caring!