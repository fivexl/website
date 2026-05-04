---
title: 'Can You Prove Who Accessed Your Data?'
author_id: 'Vladimir-Samoylov'
date: 2026-05-04
description: "Most startups in regulated industries discover the same gap during their first HIPAA or SOC 2 audit: logs exist, but proof does not. This post explains how just-in-time access closes that gap - and how to implement it with FivexL's open-source SSO Elevator module."
author: Vladimir Samoylov
author_link: https://fivexl.io/specialist/vladimir-samoylov/
panel_image: Vova_page.png
category: Security
tags: ['AWS', 'Security', 'Compliance', 'HIPAA', 'SOC2', 'SSO Elevator']
---

You have logs. You do not have proof.

That is the gap most startups in regulated industries like healthcare or fintech discover during their first HIPAA or SOC 2 audit. The IAM policies are there. The roles are configured. Permissions are restricted. But when an auditor asks "who had access to this system on March 12th, and what did they do?" the answer involves digging through months of logs trying to reconstruct a timeline that was never recorded in the first place.

A failed audit does not just cost time. It costs the partnership or enterprise contract that required it.

This is the problem just-in-time access solves - and it is simpler than it sounds.

<!--more-->

## What is just-in-time access?

The default model for most teams is standing access: engineers are assigned permissions to AWS accounts, and those permissions exist permanently. They log in when they need to do something, and the access is always there waiting.

Just-in-time access flips this. By default, no one has elevated permissions to any system. When an engineer needs access - to investigate a production issue, to run a deployment, to check a log - they submit a request through Slack: which account, which permission set, for how long, and why. Someone approves it in the same channel, the access is provisioned in seconds, and when the time is up it is revoked automatically. The whole thing takes less time than filing a ticket - and unlike a ticket, it produces a complete audit record as a byproduct.

The result is two things at once: a smaller attack surface, because credentials that do not exist cannot be stolen - and a precise audit trail, because every elevated session has a documented reason, a start time, and an end time.

For a startup heading into its first HIPAA audit or SOC 2 review, that audit trail is the difference between answering the auditor's question in seconds and spending a week reconstructing what happened.

[Vladimir Samoylov](https://fivexl.io/specialist/vladimir-samoylov/), Principal Cloud Engineering Consultant and certified AWS Solutions Architect at FivexL, walked through how this works in practice in a recent webinar - [Can You Prove Who Accessed Your Data?](https://www.youtube.com/live/JcKQYtp8i6M?si=jpmph5z1mWqtaBzt) - using FivexL's open-source SSO Elevator module for AWS. Here are the five things worth taking back to your team.

---

## 1. Permanent access is a risk even when nothing goes wrong

Think about what happens when a laptop gets stolen. The thief opens Slack, submits an access request that looks exactly like every other request that engineer makes, and gets approved. Now they are inside production with the same reach as the person whose laptop they took.

Most teams think about access control as a question of who is allowed in. The more useful question is whether access exists when nobody needs it.

Permanent permissions - where an engineer has standing access to production accounts at all times - mean that any compromised credential gives an attacker the same reach. Stolen laptop, leaked token, phished session. It does not matter how it happens. If the access exists 24 hours a day, it can be abused at any time.

Just-in-time access changes the model entirely. Access does not exist until someone requests it. When the session ends, it is revoked automatically. There is nothing to steal when nobody is logged in.

For a startup heading into its first HIPAA audit, this is the difference between demonstrating controlled access and hoping an attacker did not get there first.

---

## 2. "We already use SSO" is not the answer

A common response when we raise just-in-time access: credentials are already temporary through SSO, so what is the problem?

AWS IAM Identity Center sessions typically last eight hours. Eight hours is enough time for an attacker with automated tooling to chain IAM roles, create persistent backdoors, and establish access that outlasts the original session by days or weeks.

Time-bounded is not the same as controlled. The risk is not that credentials last forever - it is that they exist before anyone needs them, and eight hours is a large window.

Just-in-time access makes the window match the actual need. One hour to investigate a production issue. Thirty minutes for a deployment. When the time is up, access is gone and cannot be extended without a new request.

---

## 3. The audit trail is the compliance value

This is the part most teams do not think about until they are sitting across from an auditor.

When every elevated access session starts with a request - a stated reason, a specific account, a defined time window - you get a precise record as a byproduct. When something goes wrong, or when an auditor asks, you do not search through months of logs. You go directly to the relevant window.

The difference in practice: "someone may have accessed our production database in March" versus "access was granted at 14:03 on March 12th, here is the request, here is the approval, and here is everything recorded during that one hour."

That second answer is what HIPAA and SOC 2 auditors are looking for.

---

## 4. You do not have to do it all at once

One reason teams resist removing standing access is the disruption. If every engineer suddenly needs to request access before doing anything in production, the first week is painful.

The practical approach is to start at the edges. Remove standing access from the systems people rarely touch first - backup accounts, log storage, audit environments. These are also the systems most relevant to compliance, and the ones where engineers will notice the change least.

Once the team is comfortable with the flow, move closer to production. By the time you reach the systems people use daily, the process is already familiar and the friction is manageable.

The goal is not a single day where all standing access disappears. It is a gradual shift where just-in-time becomes the default, one account at a time.

---

## 5. It works even if you are a small team

Just-in-time access sounds like it requires an approval workflow - one person requests, another approves. For a startup with two or three engineers, that can feel impractical.

SSO Elevator supports automatic self-approval for exactly this reason. An engineer can request and approve their own elevated access without a second person in the loop. Most tools in this space do not allow this - the argument being that self-approval defeats the purpose of having an approval step at all.

But that argument misses what the approval step is actually for. The compliance value is not the second pair of eyes. It is the trace. Every self-approved session is logged: who requested it, what they asked for, when it started, when it ended. If something goes wrong, or if an auditor asks, you have the record.

This also means a startup with a solo infrastructure engineer, or a team using this for their own AWS organization, can get the compliance benefit from day one.

---

## How to implement it

FivexL's SSO Elevator is an open-source Terraform module that implements just-in-time access for AWS using IAM Identity Center and Slack. Engineers submit access requests through a Slack shortcut, approvals happen in the same channel, and the module handles provisioning and automatic revocation via AWS Lambda and Amazon EventBridge. All access grants and revocations are logged to S3 for audit purposes.

**Prerequisites:** AWS Organizations with IAM Identity Center already configured, and a Slack workspace.

**Deployment steps:**

1. Store your Slack signing secret and bot token in AWS SSM Parameter Store
2. Deploy the Terraform module - it creates two Lambda functions (access-requester and access-revoker), an API Gateway, an S3 bucket for audit logs, and the required EventBridge rules
3. Create a Slack app using the manifest provided in the README, pointing the request URL to the API Gateway output
4. Configure the approval rules - who can approve access to which accounts and permission sets

The module is available on GitHub: [SSO Elevator](https://github.com/fivexl/terraform-aws-sso-elevator)

If you want to see it in action before deploying, the full walkthrough is in the recording:
[Watch the webinar](https://www.youtube.com/live/JcKQYtp8i6M?si=jpmph5z1mWqtaBzt)

---

<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #18AEF0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

## The question to ask your team this week

Can you answer these three questions right now, without digging through logs?

- Who had elevated access to your production environment in the last 30 days?
- How long did each session last?
- What was the stated reason for each request?

If the answer is no, you are not alone - and the fix is not as heavy as it sounds. The open-source module is a starting point. Start with the systems nobody touches, get the team used to the flow, and work inward. By the time the auditor asks, you will have months of clean records rather than a week of log archaeology.

</div>

---

*If you are building on AWS in a regulated industry and want help getting to audit-ready without slowing your team down - [let's talk](https://fivexl.io/contact/).*

*For practical guides on AWS security and compliance, subscribe to the [FivexL newsletter](https://fivexl.io/#email-subscription).*
