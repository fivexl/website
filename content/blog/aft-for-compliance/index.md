---
title: 'How AFT Can Help You Achieve Compliance'
author_id: 'Anton Eremin'
summary: 'Introduction to AWS Control Tower and AWS Account Factory for Terraform (AFT) and how it can help you achieve compliance'
date: 2024-06-23
author: 'Anton Eremin'
panel_image: AWS partner.png
tags: [ 'team', 'AWS']
---

# Introduction 
When you have 10+ AWS accounts, it becomes a problem. You must ensure all are compliant, follow best practices, and have no security gaps. Often, as an organization, you must comply with security standards like SOC 2, PCI DSS, HIPAA, and others. This is not easy, especially at the scale of a large organization. At the same time, it’s a best practice—and AWS recommends using a multi-account strategy—to address issues such as:

- Grouping workloads based on business purpose and ownership
- Applying distinct security controls by environment
- Restricting access to sensitive data
- Limiting the scope of impact from adverse events
- Distributing AWS Service Quotas and API request rate limits

A multi-account strategy sounds like a good idea. However, questions remain:
* How do you manage **all** of these accounts?
* How do you make sure **all** meet security standards?
* How do you ensure **all** follow best practices?

This is where AWS Control Tower and AWS Account Factory for Terraform (AFT) come into play. In this article, I’ll explain what AWS Control Tower and AWS Account Factory for Terraform (AFT) are and how they can help you achieve compliance in your AWS environment. I’ll also share how we at FivexL use AFT to automate the account creation process and apply the required security and compliance settings.

## Introduction to AWS Control Tower
**AWS Control Tower** is a Landing Zone solution that sets up and governs a secure, multi-account AWS environment based on AWS best practices. It automates the setup of a new environment and offers tools to expand and manage that environment over time. Some key features of AWS Control Tower include:

- **Controls:** AWS Control Tower provides pre-configured guardrails (SCPs) that you can use to enforce policies and best practices. For example, you can prohibit the creation of public S3 buckets or enforce MFA for all IAM users. [Learn more about AWS Control Tower Controls](https://docs.aws.amazon.com/controltower/latest/userguide/guardrails.html)
- **Account Factory:** AWS Control Tower offers a simpler way to create and manage accounts. It lets you create new accounts with a few clicks while applying necessary security and compliance settings. [More info on AWS Control Tower Account Factory](https://docs.aws.amazon.com/controltower/latest/userguide/account-factory.html)
- **Default Configuration of Security Services:** AWS Control Tower automatically configures AWS security services like AWS Config and AWS CloudTrail in your environment. It also provides sets of pre-configured Config rules and CloudTrail trails you can use to monitor and secure your environment.

That’s just a quick introduction. There’s much more to AWS Control Tower, and we definitely recommend checking it out. See [the official AWS documentation](https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html) for more details.

So, **AWS Control Tower** is a great starting point: it automates new environment setup and offers built-in security and compliance. However, it may not cover all your needs. Often, you need to apply centralized customizations, such as security configurations like S3 bucket encryption or compliance settings like an IAM password policy. That’s where AWS Control Tower Account Factory for Terraform (AFT) comes into play. It lets you **create new accounts and apply any Terraform or Python customizations to them.** This is exactly what many organizations need: a place to manage accounts centrally and implement all necessary security settings and customizations. Let’s look into it.

## What Is AWS AFT and Why Should You Use It?

**AWS Account Factory for Terraform (AFT)** is essentially a CI/CD pipeline focused on **creating and managing AWS accounts**, rather than deploying applications. It allows you to create new AWS accounts and apply **any** Terraform or Python customizations you need. AFT was developed by the AWS Control Tower team in collaboration with HashiCorp. It’s designed to work on top of AWS Control Tower, automating the provisioning and customization of new accounts.

### How the AFT Pipeline Works

- **Define Your Account Configuration**  
  You create a Terraform configuration (called an `account_request`) describing the new account’s details—such as its name, email, organizational unit, tags, and any additional settings or custom parameters.
  ```hcl
  module "development-workloads-1" {
    source = "./modules/aft-account-request"
    control_tower_parameters = {
      AccountEmail              = "aws+development-workloads-1@something.com" # This email will be used for the account creation
      AccountName               = "development-workloads-1" # This name will be used for the account creation
      ManagedOrganizationalUnit = "development(<ou_id>)"
      SSOUserEmail              = "john.doe@something.com" # This user will be provided with the SSO access to the account
      SSOUserFirstName          = "John" # Placeholder
      SSOUserLastName           = "Doe"  # Placeholder
    }

    account_tags = {
      "ABC:Owner" = "aws+development-workloads-1@something.com"
    }

    change_management_parameters = {
      change_requested_by = "Anton Eremin"
      change_reason       = "Import development-workloads-1 account to the AFT."
    }

    account_customizations_name = "baseline" # This exact account customization will be applied to the account

    custom_fields = { # These is the set of default custom variables that will be automatically provided to the account by ssm parameter store, so later you will be able to use them in the customizations.
      logs_retention_in_days = "1095" # Int should be STR, because it's only valid type for ssm parameter.
      primary_region   = "us-east-1"
      secondary_region = "eu-central-1"
      additional_regions = [""]
    }
  }
  ```

- **Commit to a Git Repository**  
  Once your `account_request` is ready, you commit it to a Git repository (for example, `aft-account-request` in AWS CodeCommit or GitHub). You don’t need to apply it manually.

- **AWS CodePipeline & DynamoDB**  
  AFT’s AWS CodePipeline automatically detects new commits and updates a DynamoDB table with the account information.

- **Account Creation via AWS Control Tower**  
  AFT then instructs **AWS Control Tower’s Account Factory** to provision the new account with the specified settings, enrolling it in AWS Control Tower.

- **Customization with Step Functions**  
  After AWS Control Tower completes the basic setup, AFT triggers **AWS Step Functions** (the **Account Provisioning Framework**) to run additional Terraform or Python customizations you specify.

From the moment you commit your Terraform file to the final, fully customized account, everything is orchestrated automatically.

### How You Can Customize Accounts with AFT

AFT supports multiple customization layers:

1. **Provisioning Customizations**  
   Applied to every account when it’s created. You can use this to set up fundamental resources, like a VPC.

2. **Global Customizations**  
   Applied across all your organization’s accounts, perfect for security or compliance baselines (e.g., a strict IAM password policy).

3. **Account Customizations**  
   Applied to specific accounts. For instance, you might enable S3 bucket encryption by default only in production. You specify which customizations apply when creating the account request.

Additionally, you can run `pre-api-helpers.sh` and `post-api-helpers.sh` scripts before and after your Terraform customizations, letting you insert any custom logic such as dynamic Terraform configuration generation, Python scripts to remove default VPCs, or other automated tasks.

### High-Level AFT Pipeline Diagram
{{< image src="high-level-aft-diagram.png" alt="High-level AFT pipeline diagram" width="100%" align="left" style="border-radius: 5px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}

## How AFT Simplifies Achieving Compliance

At FivexL, we use AFT together with our **open-source [Terraform Account Baseline](https://github.com/fivexl/terraform-aws-account-baseline)** modules to provide our customers with secure, compliant AWS environments. AFT manages the account creation process and applies our Terraform account baseline modules to each account. Below are some of the resources we deploy in every account:

### **Account Level**
- **AWS IAM Account Password Policy:** Enforces a strong password policy for IAM users.
- **AWS S3 Account Public Access Block:** Prevents public exposure of S3 buckets.
- **AWS IAM OpenID Connect Provider:** Configures an OpenID Connect provider for AWS IAM, enabling identity federation.

### **Regional Level** (deployed into all regions)
- **EBS Encryption by Default**: Ensures data at rest is always encrypted.
- **Block Public EBS Snapshot Sharing**: Prevents data leaks by publicly shared EBS snapshots.
- **Terraform State Resources**:
  - **Terraform State Bucket**: Place to store Terraform state files.
  - **Terraform DynamoDB State Lock Table**: Manages state file locking to avoid conflicts.
- **Access Logs Bucket**: Stores access logs for auditing and security.
- **cmk_access_logs_bucket**: Some logs, such as NLB access logs, cannot be encrypted using the default AWS-managed KMS key. Since we enforce encryption by default, we need an alternative location for these logs. This bucket serves as a dedicated repository for such access logs, ensuring they are stored securely.

Not a part of the Terraform Account Baseline, but other useful resources that we deploy in every account are:
- **Access Logs Replication** replication configuration to replicate all access logs to the logs archive account
- **IAM Access Analyzer** to analyze resource policies and identify unintended access to resources

At the same time, we should not forget that AFT Automatically enrolls the account into the AWS Control tower, which means that all of the AWS Control Tower guardrails and security services will be applied to the account as well. It means that new accounts will also get next services and features enabled:
- **AWS CloudTrail**: AWS Control Tower configures AWS CloudTrail to enable centralized logging and auditing. With CloudTrail, the management account can review administrative actions and lifecycle events for member accounts.
- **AWS Config**: AWS Control Tower enables AWS Config to provide a detailed view of the configuration of AWS resources in the member accounts. AWS Config continuously monitors and records resource configurations, allowing you to assess compliance against desired configurations.
- **Control Tower Guardrails**: AWS Control Tower applies a set of guardrails to member accounts to enforce policies and best practices. Guardrails are a set of predefined, high-level rules that provide ongoing governance for security, operations, and compliance.


## Conclusion
AWS Control Tower provides a solid multi-account foundation, and AFT extends it by letting you **treat account creation as code**. With consistency, repeatability, and enforceable compliance across all AWS accounts, it’s particularly helpful if you operate in a regulated industry or need strict security controls.

At FivexL, we believe that a code-driven approach to account provisioning is the best way to scale and secure your AWS environment. Through our productized service [RightStart for AWS](https://sales.fivexl.io/aws_right_start), we use AFT to automate account creation and apply the necessary security and compliance settings. Combining AFT with our open-source modules has simplified environment management for our customers, helping them comply with SOC 2, PCI DSS, HIPAA, and other standards.

If your organization wants to embrace a multi-account strategy but struggles with standardizing and securing everything at scale, AFT is definitely worth exploring.

I hope this article has helped you understand how AFT can assist with compliance in your AWS environment. If you have any questions or need help, feel free to reach out. We’re always happy to help design, build, and manage a secure multi-account AWS setup.

### About FivexL
* [Schedule a call with FivexL](https://sales.fivexl.io/schedule-a-call)  
* [Right Start for AWS by FivexL](https://sales.fivexl.io/aws_right_start)
* **FivexL Open Source Projects:**
  * [Terraform AWS SSO Elevator](https://github.com/fivexl/terraform-aws-sso-elevator)  
  * [Terraform-AWS-Cloudtrail-To-Slack](https://github.com/fivexl/terraform-aws-cloudtrail-to-slack)  
  * [Terraform-AWS-Account-Baseline](https://github.com/fivexl/terraform-aws-account-baseline)  
  * [Terraform-AWS-Slack-Alerts](https://github.com/fivexl/terraform-aws-slack-alerts)  
  * [lprobe](https://github.com/fivexl/lprobe)

### Useful Links
* [AWS Control Tower Documentation](https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html)  
* [AWS Account Factory for Terraform (AFT) Documentation](https://learn.hashicorp.com/tutorials/terraform/aws-control-tower-aft)  
* [FivexL Terraform Account Baseline](https://github.com/fivexl/terraform-aws-account-baseline)

### About the Author
* [My LinkedIn](https://www.linkedin.com/in/anton-eremin-75aab725a/)  
* [My Telegram](https://t.me/mobessona/)
