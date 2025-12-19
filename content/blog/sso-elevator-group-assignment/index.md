---
title: 'Bridging the Gap: Automating Group Assignments in AWS IAM Identity Center with SSO Elevator'
author_id: 'Andrey Devyatkin'
summary: 'Google Workspace SCIM provisioning to AWS IAM Identity Center does not sync groups - a frustrating limitation. SSO Elevator now offers a Terraform-native solution that automatically assigns users to groups based on their attributes, eliminating the need for external tools like ssosync.'
date: 2025-12-18
author: Andrey Devyatkin
panel_image: Andrey.png
tags: ['AWS', 'SSO Elevator', 'Google Workspace', 'Terraform', 'Identity Center', 'open source']
---

In our work with startups, we frequently see teams go through a familiar journey when setting up AWS IAM Identity Center (formerly AWS SSO) with Google Workspace.

### Stage 1: The Terraform Approach

It typically starts with Terraform. You create users in Identity Center that match your Google Workspace users, set up groups, and assign users to those groups - all in code:

```hcl
resource "aws_identitystore_user" "alice" {
  identity_store_id = local.identity_store_id
  user_name         = "alice@company.com"
  display_name      = "Alice Smith"
  
  emails {
    value   = "alice@company.com"
    primary = true
  }
}

resource "aws_identitystore_group_membership" "alice_developers" {
  identity_store_id = local.identity_store_id
  group_id          = aws_identitystore_group.developers.group_id
  member_id         = aws_identitystore_user.alice.user_id
}
```

This works, but you quickly realize you're duplicating user management. Every new hire means updating Terraform, running a plan, and applying. Every departure means the same. For a fast-growing startup, this becomes tedious.

### Stage 2: Discovering SCIM

Then someone discovers SCIM provisioning. "We can connect Google Workspace directly to Identity Center and users will sync automatically!" This sounds great. You enable [SCIM provisioning from Google Workspace](https://docs.aws.amazon.com/singlesignon/latest/userguide/gs-gwp.html), and suddenly new users appear in Identity Center automatically. No more Terraform changes for user onboarding. Life is good.

Until you discover the catch.

### The Problem: Groups Don't Sync

When you enable SCIM provisioning from Google Workspace to AWS IAM Identity Center, users are automatically provisioned - but groups are not. That's a bummer. Google Workspace Groups simply don't sync to Identity Center via SCIM.

You're back to a hybrid approach: users come from SCIM, but you still manage group memberships via Terraform. Now you're using data sources to look up the SCIM-provisioned users and assign them to groups:

```hcl
data "aws_identitystore_user" "alice" {
  identity_store_id = local.identity_store_id

  alternate_identifier {
    unique_attribute {
      attribute_path  = "UserName"
      attribute_value = "alice@company.com"
    }
  }
}

resource "aws_identitystore_group_membership" "alice_developers" {
  identity_store_id = local.identity_store_id
  group_id          = aws_identitystore_group.developers.group_id
  member_id         = data.aws_identitystore_user.alice.user_id
}
```

You still need to maintain the list of who goes into what group. The automation promise of SCIM feels half-fulfilled.

```
┌─────────────────────────────────────────────────────────────┐
│                   Google Workspace                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Users     │  │   Groups    │  │ Attributes  │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          │  SCIM Sync     │  ✗ NOT SYNCED  │  SCIM Sync
          ▼                │                ▼
┌─────────────────────────────────────────────────────────────┐
│               AWS IAM Identity Center                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Users ✓   │  │ Groups (!)  │  │ Attributes ✓│         │
│  │  (synced)   │  │  (manual)   │  │  (synced)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### Stage 3: Looking for Solutions

Till this day, your primary alternative has been [ssosync from AWS Labs](https://github.com/awslabs/ssosync). It's a functional tool that synchronizes Google Workspace groups to Identity Center. However, it comes with its own set of challenges:

- **Another tool to maintain**: You need to keep ssosync updated, monitor its execution, and handle its failures
- **Not a Terraform deployment**: ssosync requires its own deployment pipeline - typically a Lambda or scheduled container - completely outside your Terraform workflow
- **Additional operational overhead**: More moving parts mean more things that can break, especially during AWS service disruptions

### The Solution: Attribute-Based Group Assignment in SSO Elevator

If you're already using [FivexL's SSO Elevator](https://github.com/fivexl/terraform-aws-sso-elevator) for temporary elevated access to your AWS accounts, you now have an alternative that fits naturally into your existing Terraform workflow.

We've just released a new feature that automatically assigns users to groups in Identity Center based on their attributes synced from Google Workspace. Here's the key insight: while Google Workspace doesn't sync groups via SCIM, it does sync user attributes. SSO Elevator can now use those attributes to determine group membership.

The feature also continuously monitors group memberships and removes users who were added manually or whose attributes have changed. This ensures your group assignments stay consistent with your source of truth - the user attributes from Google Workspace.

For the full technical details, see [pull request #132](https://github.com/fivexl/terraform-aws-sso-elevator/pull/132).

### How It Works

The implementation leverages SSO Elevator's existing Lambda infrastructure. When users are synced from Google Workspace, their attributes (like department, title, or custom fields) come along. SSO Elevator can now be configured to match those attributes against rules you define.

Here's an example configuration:

```hcl
module "sso_elevator" {
  source  = "fivexl/sso-elevator/aws"
  version = "4.1.0"  # The feature was released in this version

  # ... your existing SSO Elevator configuration ...

  # New: Attribute-based group assignments
  group_assignments = [
    {
      group_name = "Developers"
      attribute  = "department"
      value      = "Engineering"
    },
    {
      group_name = "Platform-Team"
      attribute  = "department"
      value      = "Platform"
    },
    {
      group_name = "Finance-Team"
      attribute  = "department"
      value      = "Finance"
    }
  ]
}
```

In this configuration:
- Users with `department` set to "Engineering" are automatically assigned to the "Developers" group
- Users with `department` set to "Platform" go to the "Platform-Team" group
- Users with `department` set to "Finance" go to the "Finance-Team" group

The Lambda function periodically reconciles group memberships:
1. **Adds users** who match the attribute criteria but aren't in the group
2. **Removes users** who no longer match the criteria or were added manually
3. **Logs all changes** for audit purposes

This approach gives you declarative group management within Terraform - no separate tool, no additional deployment pipeline, no operational overhead beyond what you already have with SSO Elevator.

### Additional Improvements in This Release

While implementing the group assignment feature, we also shipped several other improvements:

**ARM64 Lambda Support**: You can now build SSO Elevator's Lambda functions for the ARM64 architecture. This is not just about cost optimization - it's a practical necessity. Most of us build on Apple Silicon nowadays, and you can't build locally on ARM64 and then deploy as x86_64. With this update, your local builds match your deployment target. ARM-based Lambdas also typically offer [better price-performance](https://aws.amazon.com/blogs/aws/aws-lambda-functions-powered-by-aws-graviton2-processor-run-your-functions-on-arm-and-get-up-to-34-better-price-performance/) compared to x86_64, so it's a win-win.

**Non-Root Docker Images**: If you're deploying SSO Elevator's Lambdas as Docker images (as we recommend for production deployments), the images now run as non-root users. This aligns with container security best practices and may be required for compliance in some environments.

These are incremental improvements, but they reflect our commitment to continuously enhancing the module based on real-world usage and security best practices.

### Important Considerations

Before adopting this feature, keep these points in mind:

**Email Matching**: SSO Elevator assumes that user email addresses in Google Workspace match the user identifiers in Identity Center. This is typically the case when using SCIM provisioning, but verify your setup to ensure proper user matching.

**Existing Group Assignments**: If you have existing manual group assignments, SSO Elevator will reconcile them according to your rules. Users who don't match the attribute criteria will be removed from managed groups. Plan your rollout accordingly.

**Attribute Availability**: Not all Google Workspace attributes may be synced to Identity Center via SCIM. Check which attributes are available in your Identity Center user profiles before writing your rules.

**No Overlap with group_config**: Groups in `attribute_sync_managed_groups` must NOT also appear in `group_config`. The attribute syncer adds users permanently based on attributes, while `group_config` is for JIT (just-in-time) access with scheduled revocation. If the same group appears in both, the revoker will see attribute-synced users as "inconsistent assignments" and warn about them. Terraform will fail with a validation error if overlap is detected, so you'll catch this early.

**This Bridges the Gap**: One day, AWS may add native group provisioning support for Google Workspace SCIM. Until then, this feature provides a practical Terraform-native solution for teams already using SSO Elevator.

### Conclusion

The inability to sync Google Workspace groups to AWS IAM Identity Center via SCIM has been a persistent pain point for many organizations. Ssosync works, but it's not a Terraform-native solution - it requires its own deployment tooling and introduces operational complexity. It's also good to have alternatives: AWS Labs solutions haven't always been well maintained, and some of them tend to drift off into becoming forgotten and unmaintained over time.

For SSO Elevator users, the new attribute-based group assignment feature offers a cleaner alternative. Your group management stays in Terraform, uses the same deployment pipeline as the rest of your infrastructure, and leverages the Lambda infrastructure you've already deployed.

We believe this is a practical solution to a common problem. As with all our open-source work, we welcome feedback, bug reports, and contributions on our [GitHub repository](https://github.com/fivexl/terraform-aws-sso-elevator).

Want to know when new releases drop? Subscribe to our [mailing list](/#email-subscription).

