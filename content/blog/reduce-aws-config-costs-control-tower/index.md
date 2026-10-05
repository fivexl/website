---
title: 'How to Reduce AWS Config Costs in AWS Control Tower'
author_id: 'Yousef De Baz'
date: 2026-10-05
description: 'Control Tower records AWS Config continuously, so ephemeral resources inflate your bill. Cut Config costs with daily recording using our open-source Terraform module.'
author: Yousef De Baz
author_link: https://fivexl.io/specialist/yousef-de-baz/
category: AWS
panel_image: aws-config-control-tower.png
tags: ['AWS', 'Control Tower', 'AWS Config', 'Terraform', 'Cost Optimization', 'Landing Zone', 'open source']
---

If you run AWS Control Tower, you've probably noticed that AWS Config records everything in every managed account. The bill and the noise both grow with each new account.

### Why the AWS Config bill keeps growing

AWS Config records every supported resource type, and you pay based on the number of resources recorded. Control Tower sets Config into continuous recording mode, which means every ephemeral resource gets recorded.

If you have many ephemeral resources, like ENIs from restarting ECS tasks, Config records all of them.

<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #18AEF0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

**More ephemeral resources means more resources recorded, and a bigger AWS Config bill.**

</div>

There is no way to change this in Control Tower today. That's why we built a module for it.

### Customize AWS Config resource tracking in Control Tower

FivexL has released an open-source Terraform module that fixes this at the source: [terraform-aws-control-tower-config-recorder](https://github.com/fivexl/terraform-aws-control-tower-config-recorder), also available on the [Terraform Registry](https://registry.terraform.io/modules/fivexl/control-tower-config-recorder/aws/latest).

<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #18AEF0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

The module customizes AWS Config Recorder settings across child accounts managed by Control Tower. It overrides the default Config Recorder configuration to control which resource types are recorded, at what frequency, and in which accounts.

</div>

Under the hood, it deploys a Lambda function that assumes the standard `AWSControlTowerExecution` role into each target account and rewrites its Config Recorder settings. You control three things.

#### Recording frequency

Change the recording frequency to 24 hours. Config then records once a day and skips all those ephemeral resources, which lowers the bill. You can also keep a daily default and record a few types continuously. That matters if you use AWS Firewall Manager, which depends on continuous recording for the resource types its policies cover.

#### Resource types

Pick a recording strategy:
- `EXCLUSION` records everything except a list of resource types you define.
- `INCLUSION` tracks only what you actually care about, such as IAM roles, S3 buckets and KMS keys. Pick your security-critical set.

#### Accounts

Choose which accounts get the custom settings, either by listing the accounts to leave alone or by naming the ones to change.

### Changes that stick

The tricky part of customizing Config in Control Tower isn't changing the settings. It's keeping them changed. Control Tower owns the `AWSControlTowerBP-BASELINE-CONFIG` StackSet, and anything that redeploys it resets the Config Recorder to the Control Tower default.

The module handles this in two ways:

- It reacts to Control Tower lifecycle events. An EventBridge rule triggers the Lambda on every event that can redeploy the Config baseline, including `CreateManagedAccount`, `UpdateLandingZone`, `RegisterOrganizationalUnit` and the baseline events. Newly enrolled accounts get the same policy without anyone remembering to run a script.
- It reconciles on a schedule. A missed event is silent: the function never runs, so nothing fails and no alarm fires. A scheduled re-run (every 12 hours by default) sets an upper limit on how long drift can last.

### Built for production

A few design choices stand out from a production-readiness angle:

- Failures in one account don't halt the rest. The function collects per-account failures, finishes the remaining accounts, then reports the error.
- Problems surface through a CloudWatch alarm. The Lambda call made during `terraform apply` is fire-and-forget, so a failed run won't fail your apply. Instead, a CloudWatch alarm on the Lambda `Errors` metric fires, and you can wire it to an SNS topic.
- Account targeting is checked at plan time. The management account the module runs in is always skipped. In `EXCLUSION` mode, Terraform refuses to plan until you list the accounts to leave alone, which should include at least Log Archive and Audit. This protection logic is easy to get wrong when you do it by hand.
- Global IAM types are recorded once. IAM users, groups, roles and policies are the same in every region, so the module records them in one region, the Control Tower home region by default, instead of paying for duplicates.

### Keep in mind: you're trading granularity for cost

<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #18AEF0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

You are reducing granularity, and for some accounts that might not be desirable. For those, you can opt out via exclusion rules.

</div>

### Getting started

Setup instructions, usage examples and the full list of options are in the [README](https://github.com/fivexl/terraform-aws-control-tower-config-recorder).

If you're managing Config costs or compliance scope across a growing Control Tower organization, this is worth a look. The module is Apache-2.0 licensed and drops in as a registry module.

- GitHub: [fivexl/terraform-aws-control-tower-config-recorder](https://github.com/fivexl/terraform-aws-control-tower-config-recorder)
- Terraform Registry: [fivexl/control-tower-config-recorder/aws](https://registry.terraform.io/modules/fivexl/control-tower-config-recorder/aws/latest)

The module builds on the AWS sample [aws-control-tower-config-customization](https://github.com/aws-samples/aws-control-tower-config-customization) and the AWS blog post [Customize AWS Config resource tracking in AWS Control Tower environment](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/). Thanks to its original contributors.
