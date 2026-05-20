---
title: 'Scaling AI Code Review Without Scaling Your AWS Bill'
author_id: 'Alexey Eremin'
summary: 'How we rolled out AI code review across all repositories using CloudWatch alarms and an automatic Lambda circuit breaker to keep Bedrock costs under control.'
date: 2026-05-20
author: Alexey Eremin
panel_image: Lesha.png
tags: ['AWS', 'Bedrock', 'AI', 'Cost Optimization', 'CI/CD']
---
More teams are putting AI inside their development pipelines, and the bill that comes with it is not always predictable. If your team is in that position - adding AI code review to CI and wondering what happens to the AWS bill when you roll it out broadly - this is for you.

AI-assisted development has increased the volume of code reaching review, and to keep up with that volume we at FivexL added automated AI code review directly into our CI pipelines - every pull request gets reviewed by a model before a human looks at it, using CloudWatch alarms and a Lambda circuit breaker to keep Bedrock costs under control. We built this on top of the reusable workflow from FivexL: [ai-code-review-caller.yml](https://github.com/fivexl/shared-workflows/blob/5de8ae88c4ae070bf3bc59704851b3c85f12e86e/.github/workflows/ai-code-review-caller.yml#L4).

The first rollout was in the main infrastructure repository. It worked well there, so the next step was to roll it out across all repositories in the organization.

But we were worried about the bill. If AI review runs on every pull request in every repository, a misconfiguration or a busy day can lead to a large Bedrock bill. We wanted guardrails before scaling it.

## Why AWS Budgets are not enough

The usual recommendation for controlling cloud spend is AWS Budgets: set a threshold for Bedrock usage, send an alert to email or Slack, and have someone react.

AWS Budgets are useful, but we ran into two problems that made them the wrong tool for this.

**Problem 1: notifications don't stop anything.** An alert only tells you something is wrong, and assumes someone notices in time.

**Problem 2: AWS Budgets are slow.** The data updates a few times a day, so a mistake can run for several hours before the alert fires. By then, the spend has already happened.

We moved the guardrail to CloudWatch instead. CloudWatch is faster than Budgets, and it can trigger an action, not just a notification.

## How the control loop works

The setup has three parts:

- A way to measure what this workload spends
- Alarms that react fast
- An action that stops the spending automatically

### Scoped IAM role

CI uses a dedicated GitHub OIDC role for AI review. IAM permissions allow that role to invoke Bedrock only through an application inference profile. The inference profile matters because it exposes Bedrock token metrics in CloudWatch scoped to this workload, instead of mixing them with every other Bedrock call in the account.

### Estimated spend in CloudWatch

With the metrics scoped, CloudWatch alarms read `InputTokenCount` and `OutputTokenCount` from the `AWS/Bedrock` namespace. Metric math combines those counts with model prices from the AWS Price List, and the result is an estimated spend value for the AI review workload.

### One trap to watch for

The pricing unit in the metric math expression has to match the unit AWS Price List returns for the model and region. For Bedrock text models, prices are returned per thousand tokens, so raw token counts need to be normalised before multiplying. Skip that step and the estimate is off by a factor of a thousand.

## Two alarm tiers: warn and block

With the spend tracked, the next decision is when to react.

We use two tiers of alarm. Warning alarms only notify Slack so the team can investigate. Blocking alarms notify Slack and invoke a Lambda function that takes action automatically.

Thresholds come from a monthly spend limit. Shorter windows use smaller percentages so a spike is caught before it consumes the whole month:

- **Warning:** 3% of the monthly limit in one day, or 15% in seven days
- **Blocking:** 9% in one day, or 45% in seven days

These are spike detectors, not exact daily budget allocations. The warning tier gives the team time to investigate. The blocking tier exists for the cases when no one is watching, or when things move too fast for a human to step in.

## The automatic block

The Lambda function has one job: attach an explicit deny policy to the AI review IAM role. The policy blocks the Bedrock actions that can spend money:

- `bedrock:Converse`
- `bedrock:ConverseStream`
- `bedrock:Invoke*`
- `bedrock:StartAsyncInvoke`

Because the deny is attached to the same role CI uses, AI review jobs fail closed until the policy is removed. No more Bedrock calls, no more spend.

The policy is removed manually, after investigation. That manual step is deliberate. It forces a human decision before spending resumes, so the system does not just trip and reset into the same problem.

## Caveats

That covers the mechanics. Before copying the pattern, a couple of things to keep in mind.

**This is estimated spend, not billing data.** It is close enough to act on as a circuit breaker, but it is not what AWS will charge. Leave a buffer below the real budget.

**CloudWatch is not a hard limit.** It is faster than AWS Budgets, but treat it as a fast brake, not a ceiling.

## Beyond CI

This setup was enough to roll out AI code review across the organisation without depending on someone noticing a budget email in time.

And the same pattern works outside CI. Any application that calls Bedrock can use a workload-specific role, CloudWatch token metrics, early alerts, and an automatic block when spend crosses the threshold. CI pipeline, AI agent, or production feature: the brake is built the same way.

**Want this built into your Bedrock setup from the start?** <br />
This is the kind of guardrail we put in place when we help teams run AI on AWS safely.<br />If you are scaling AI tooling and want cost controls that do not depend on someone noticing an email in time, talk to us about our [Secure AI with Amazon Bedrock](https://fivexl.io/ai-to-production/) service.
