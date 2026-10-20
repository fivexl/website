---
title: 'Request Temporary AWS Access from the CLI: SSO Elevator 5.0'
author_id: 'FivexL'
date: 2026-10-20
description: 'SSO Elevator 5.0 adds an organization-wide CLI for requesting temporary AWS access through IAM Identity Center, verifies callers with a signed STS proof, and keeps Slack secrets out of Terraform state.'
author: FivexL
category: AWS
panel_image: fivexl-05.png
tags: ['AWS', 'Just-in-Time Access', 'Terraform', 'Security', 'Identity Center', 'open source']
related: ['/blog/sso-elevator-3-1-0-resilience', '/blog/just-in-time-access-aws', '/blog/sso-elevator-group-assignment']
---

[SSO Elevator](https://github.com/fivexl/terraform-aws-sso-elevator) is FivexL's open-source Terraform module for just-in-time AWS access through IAM Identity Center. People request a permission set in an account, or membership in an IAM Identity Center group, from Slack. Approvers approve in Slack. The module grants the access and removes it when the requested time ends. Every grant, revocation and declined request is written to an S3 audit log.

Until recently, requesting access always went through a Slack form. Version 5.0, released on October 5, 2026, brings two changes worth highlighting: a command-line tool that works across your entire AWS Organization, and a cleaner way to handle Slack secrets so they stay out of Terraform state.

Here is what the new version brings.

### What's new in 5.0

Version 5.0.0 is a major release that requires planned upgrade steps. It brings two user-visible changes (an organization-wide CLI route and Slack secrets out of Terraform state), several security improvements that come with them, and the operational refinements collected from running SSO Elevator in production since version 3.1.0.

Key changes:

- The CLI access route is on by default and works for callers in every account in your AWS Organization, with no per-account setup on the module's side.
- The CLI proves the caller's identity to the Lambda with a signed STS proof, closing a 4.x gap where anyone with `lambda:InvokeFunction` could invoke the requester directly and claim another user's identity.
- One REST API serves both Slack (`POST /access-requester`) and the CLI (`POST /access-requester-cli`), replacing the HTTP API and Lambda Function URL from 4.x. The REST API supports a resource policy scoped to your AWS Organization and lets you attach AWS WAF; the HTTP API supported neither.
- Slack secrets live in two SSM SecureString parameters the module creates with a placeholder. You write the real values with the AWS CLI, so they never pass through Terraform state, plan output, or Lambda environment variables.
- Optional AWS WAF with a per-IP rate limit and AWS managed rule sets, off by default (`waf_enabled`). You can also attach a web ACL you manage with `waf_web_acl_arn`.
- IAM is tighter: Scheduler actions scoped to the schedule group, `iam:PassRole` limited to the scheduler role and only to Scheduler, SAML provider actions scoped to the Identity Center provider. Unused EventBridge permissions are gone.
- Lambda SnapStart on by default (`snap_start`). Cold starts no longer risk missing Slack's three-second deadline.
- Redesigned Slack messages: one card per request, updated in place through approval and revocation. CLI requests use the same card.
- The audit log records declined requests (auto-denied, discarded, expired) and approved requests that fail partway. Entries carry `version` 2, with new `decision_reason` and `error_message` fields.
- CLI request reasons are capped at 1,000 characters. 4.4.3 allowed about 2,000.
- Lambdas run on Python 3.14. Terraform `~> 1.11` and AWS provider `>= 6.28` required.

The full list, including bug fixes and dependency updates, is in the [SSO Elevator changelog](https://github.com/fivexl/terraform-aws-sso-elevator/blob/main/CHANGELOG.md).

### Requesting AWS access from the command line

In 5.0, you can request access with one command instead of opening a Slack form:

```bash
elevator --account 123456789012 --permission-set ReadOnly --duration 120 \
  --reason "debugging prod issue"
```

Each flag has a specific purpose:

- `--account` is the twelve-digit AWS account ID you need access to.
- `--permission-set` is the name of the permission set to assume in that account, exactly as it appears in IAM Identity Center.
- `--duration` is how long you need the access, as a whole number of minutes. Any value is accepted up to the maximum this deployment allows.
- `--reason` is a short description of why you need the access. This is written to the audit log and shown to the approver, so it should be something a reader will understand later. Up to 1,000 characters.

This matters most for teams that want to request access from a script, a CI job, or an AI coding agent, where opening Slack and clicking a button is not an option. CLI requests go through the same approvers, the same self-approval rules, and the same audit log as a Slack request. Nothing is relaxed because the request came from a terminal.

For people already in a terminal, the CLI is also more flexible than the Slack form in one small way. The Slack form offers duration as a dropdown of 30-minute increments. The CLI accepts any whole number of minutes up to the same deployment maximum, so you can request 90 or 45 or 15 minutes without being pushed to the next half-hour.

Slack is still the primary interface for people, and nothing about the Slack flow changes.

### How Slack and CLI requests reach the Lambda in 5.0

Slack and the CLI now share a single REST API, with the same identity story on both sides. The CLI route carries a resource policy that admits any caller inside your AWS Organization; the Slack route is open and the Lambda verifies Slack's signature itself. Once past API Gateway, the Lambda runs the same approval, grant, and audit logic for both sources.

```text
    Slack webhook                         elevator CLI
 (POST /access-requester)          (POST /access-requester-cli)
           │                                    │
           ▼                                    ▼
 ┌─────────────────────────────────────────────────────────┐
 │                 One REST API (requester)                │
 │                                                         │
 │  /access-requester       no auth, Lambda checks sig     │
 │  /access-requester-cli   resource policy:               │
 │                          aws:PrincipalOrgID = ours      │
 └───────────────────────────┬─────────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Requester Lambda   │
                  │   (SnapStart alias)  │
                  │                      │
                  │   Slack path:        │
                  │     verify signature │
                  │                      │
                  │   CLI path:          │
                  │     verify STS proof │
                  │     check org, role, │
                  │     Identity Store   │
                  └──────────┬───────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
    Approval         IAM Identity Center     S3 audit log
    workflow           grant / revoke        (one row per
 (Slack buttons                              grant, revoke,
 or auto-approve)                            declined, incomplete)
```

The next three sections explain the pieces that are new in 5.0: the organization-scoped resource policy, the STS identity proof, and the SSM write-only secret flow.

### Granting CLI access across an AWS Organization

The CLI route's resource policy admits any caller inside your AWS Organization and nothing else. The relevant condition:

```hcl
Condition = {
  StringEquals = {
    "aws:PrincipalOrgID" = data.aws_organizations_organization.current[0].id
  }
}
```

Any account in the organization is admitted automatically. A caller from outside is rejected by API Gateway before the Lambda runs.

A caller outside the deployment account still needs `execute-api:Invoke` on the API in their own permission set. That is standard AWS behavior for cross-account `AWS_IAM` calls, and it is a one-time setup each team does for itself. The AWS managed `ReadOnlyAccess` policy does not include it.

### How the Lambda verifies the caller's identity

Every CLI request includes a presigned `sts:GetCallerIdentity` request, generated by the CLI from your own AWS credentials. The Lambda checks that the proof is at most 60 seconds old and bound to the exact request body and REST API id, then sends the presigned request to STS itself and takes the caller's identity from STS's answer.

With that identity in hand, it checks three things:

1. The caller's AWS account is in this organization.
2. The assumed role's name starts with `AWSReservedSSO_`, the prefix IAM reserves for IAM Identity Center in every account.
3. The role-session name matches a `UserName` in the Identity Store.

If any of those checks fails, the request is rejected with a generic `403`. The full wire contract is in [src/cli_proof.py](https://github.com/fivexl/terraform-aws-sso-elevator/blob/main/src/cli_proof.py), and the trust model is documented in the [CLI trust model section of docs/cli.md](https://github.com/fivexl/terraform-aws-sso-elevator/blob/main/docs/cli.md#trust-model).

The CLI user does nothing differently. The proof is generated automatically on each call.

### Keeping Slack secrets out of Terraform state

SSO Elevator needs your Slack bot token and signing secret to run. 5.0 uses [Terraform write-only arguments](https://developer.hashicorp.com/terraform/language/manage-sensitive-data/write-only), a feature added in Terraform 1.11. The module creates two SSM SecureString parameters with a `REPLACE_ME` placeholder. You write the real values with the AWS CLI, outside Terraform:

```bash
printf '%s' "$SLACK_BOT_TOKEN" | aws ssm put-parameter --overwrite --type SecureString \
  --name /sso-elevator/slack-bot-token --value file:///dev/stdin
```

Same shape for the signing secret. From then on, Terraform never reads or writes the real value, and the secret never appears in state, plan output, or Lambda environment variables. `terraform plan` reports "No changes" after you set them.

The default parameter names are `/sso-elevator/slack-bot-token` and `/sso-elevator/slack-signing-secret`; change them with `slack_bot_token_ssm_parameter_name` and `slack_signing_secret_ssm_parameter_name` if those are already taken. For a customer managed KMS key, add `--key-id <key-arn>` to the `put-parameter` commands.

### Known limitations

A few things to be aware of before upgrading.

- **CLI access turns on for the whole organization by default.** Any user with an IAM Identity Center session in any account in your organization can submit a CLI request after the apply. If you were running 4.x with the CLI off, or limited to the deployment account, review your approval rules, especially any auto-approval statements, before you upgrade. If you only want Slack, set `enable_access_requester_cli = false`.
- **A CLI identity proof can be replayed for about 90 seconds.** The Lambda accepts a proof up to 60 seconds after it was signed, and up to 30 seconds ahead for clock skew. Within that window, someone holding the exact request body could resubmit it, repeating the identical request (same account, permission set, duration and reason). Closing this fully would need a nonce store, which is a stateful resource added for an attack that still requires access to the body inside a TLS session.
- **SnapStart is not available in every region.** Lambda does not offer SnapStart for Python 3.14 in every region or every package type. The apply fails where it is not offered. Check the [Lambda SnapStart documentation](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html) for your region and your package type (container image by default, or zip), and set `snap_start = false` there.
- **No prebuilt CLI binary for Windows.** Prebuilt `elevator` binaries ship for macOS and Linux only (amd64 and arm64 for each). On Windows, you build from source: install Go, clone the repository, and run `go build` in `cmd/elevator`. Full instructions are in the [elevator CLI README](https://github.com/fivexl/terraform-aws-sso-elevator/blob/main/cmd/elevator/README.md).

### Upgrading from SSO Elevator 4.x

The 5.0 apply destroys the old HTTP API and creates a new REST API, so both the Slack request URL and the CLI endpoint change. Slack and the CLI are down between the apply and the follow-up steps that re-point them, so pick a quiet window. There is no rollback once the full apply has run.

The full procedure is in the [SSO Elevator 5.0 upgrade guide](https://github.com/fivexl/terraform-aws-sso-elevator/blob/main/UPGRADE-5.0.md). It covers:

- raising Terraform to `~> 1.11` and the AWS provider to `>= 6.28`, and running `terraform init -upgrade`;
- draining any pending Slack access requests before the apply (approve or discard them). After the upgrade, the buttons on a pre-upgrade request stop working and reply "This request was made before an Elevator upgrade - please request again";
- moving your Slack secrets into SSM without re-reading them from state;
- running the full apply, then re-pointing Slack and running `elevator configure` for every CLI user;
- updating any cross-account `execute-api:Invoke` policies that still name the old (now-deleted) HTTP API ARN. Point them at the new `requester_api_execution_arn_cli` output;
- deleting the 4.x Lambda versions that still hold the forgeable code and the secrets in their environment;
- rotating the Slack bot token and signing secret after the apply, and purging the 4.x state versions that recorded them;
- running the `ALTER TABLE` in [docs/audit.md](https://github.com/fivexl/terraform-aws-sso-elevator/blob/main/docs/audit.md) if you query the audit bucket from Athena, so your table knows about the new fields and operation types;
- updating any uptime checks that expect `401` on an unsigned POST to the Slack URL. It is now `400` from API Gateway.

If you are on 3.x or older, upgrade to 4.4.3 first and verify it works before coming back to 5.0.

### Getting Started

SSO Elevator is open source and available on [GitHub at fivexl/terraform-aws-sso-elevator](https://github.com/fivexl/terraform-aws-sso-elevator).

Install the CLI on macOS with Homebrew:

```bash
brew tap fivexl/homebrew-tap
brew install elevator
```

On Linux, use the install script. It lives at the root of the repository (`install.sh`), downloads the right binary for your OS and architecture from GitHub Releases, verifies its checksum, and installs it to `~/.local/bin`:

```bash
curl -fsSL https://raw.githubusercontent.com/fivexl/terraform-aws-sso-elevator/main/install.sh | sh
```

On Windows, build from source (install Go, clone the repository, and run `go build` in `cmd/elevator`). There is no prebuilt Windows binary.

Then point the CLI at the module's endpoint:

```bash
elevator configure --endpoint <requester_api_endpoint_url_cli output>
```

If you deploy 5.0 and something breaks, or something works and you want more of it, [open an issue on GitHub](https://github.com/fivexl/terraform-aws-sso-elevator/issues).

*Want to know when new releases come out? Subscribe to our [monthly newsletter](#email-subscription).*
