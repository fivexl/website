---
title: 'FivexL’s Reaction to the AWS Security Baseline for Startups'
author_id: 'Andrey_Devyatkin'
summary: 'FivexL shares its outlook on AWS Security Guidelines for startups. Find out how to improve your AWS security efficiently.'
date: 2022-09-22
author: Andrey Devyatkin
panel_image: Reaction4.png
tags: ['AWS', 'security','CloudTrail']
---
In Spring 2022, AWS released [AWS Startup Security Baseline](https://docs.aws.amazon.com/pdfs/prescriptive-guidance/latest/aws-startup-security-baseline/aws-startup-security-baseline.pdf) – security guidelines for startups on how to use AWS capabilities without compromising corporate security. FivexL, which specializes in delivering well-architected AWS infra solutions for startups, has wide, hands-on experience in setting up secure AWS cloud infrastructure in regulated industries like healthcare or finance. We have decided to analyze the provided guidelines and compare them with our recommendations.  
Overall we find provided guidelines a solid piece of advice though there are certain things that we would do differently:
### Account Security 
* ACCT.02 Restrict the use of the root user. AWS advises using IAM users. FivexL insists on setting up an AWS organization and using several accounts for different purposes: for example, separate ones for development and production. Otherwise, you will need to spend a lot of time splitting the resources into several accounts in the future. Find more ideas [here](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/benefits-of-using-multiple-aws-accounts.html). Besides, when you are creating member AWS accounts via AWS Organisation, root users of members' accounts do not have a password set thus, there is nothing to steal. On top of that, you can deploy Service Control Policy (SCP) that prohibits root user login as well as prohibits members' accounts from leaving your organization. While it might sound complex, it actually takes only 10-15 min, and AWS has great documentation describing the process. 
What is more, it’s best to use AWS SSO (Single Sign-On, now known as [AWS IAM Identity Center](https://aws.amazon.com/about-aws/whats-new/2022/07/aws-single-sign-on-aws-sso-now-aws-iam-identity-center/)) instead of per-account IAM users. This allows you to centralize access management across your AWS accounts and eliminate a threat of long-term credentials (this is what IAM users got) compromise. With SSO, you and your teammates receive temporary credentials that are valid for a short period of time (we recommend no longer than 8-12 hours). This leaves a smaller window of opportunity for an attacker, making it harder to gain persistence in your system. 
Working with temporary credentials might feel confusing at first thus, we recommend reading our article about aws-vault– a CLI tool that greatly simplifies work with dynamic keys and allows you to work efficiently while keeping your credentials secure.
</br> 

* ACCT.06. Enforce a password policy. This is an outdated piece of advice (consider reading [this](https://www.sans.org/blog/time-for-password-expiration-to-die/)) that is often mentioned in security guidelines like AWS CIS Benchmark or PCI DSS but doesn’t always deliver the desired security level – for example, to enforce a password change every 90 days. This recommendation is irrelevant when using SSO since you do not have IAM users and, thus, passwords to manage. At the same time, you should definitely ensure very long (prioritize length over complexity) passwords and MFA for your identity provider (i.e., credentials that users will use to log in to the SSO portal, think Google Workgroups, Okta, AD). FivexL recommends prohibiting **subsidiary accounts from setting up IAM users on the AWS Organisation level using Service Control Policy (SCP)** (if you use an AWS organization and SSO).  This will prevent sharing passwords and keys, which are long-term credentials. In other words, you safeguard yourself from credential leakage or attacker gaining persistence. 
</br> 
 
* ACCT.07. Deliver CloudTrail logs to a protected S3 bucket. We believe this guideline should be expanded with AWS organization usage. Here’s a brief overview of how to facilitate CloudTrail setup and improve its efficiency: 
  1) **Enable CloudTrail on the organization level** - this will enable CloudTrail for every member account. An additional benefit is that member accounts won’t be able to disable CloudTrail on their own. And the only way to stop CloudTrail logging would be to leave the organization. But we do prevent it with SCP mentioned above; 
  2) Since the S3 bucket is also on the organization level, **replicate it to a security account**. This allows your security researchers (or those who are in charge of cybercrime investigations) to access CloudTrail logs without entering the organizational account; And have a copy of all CloudTrail logs in a safe place.
  3) Deploy the [CloudTrail-to-Slack](/blog/what-is-aws-cloudtrail/) lambda that will parse all the notifications to your Slack. 
It’s advisable to enable an integrity check when setting up CloudTrail to ensure nothing was changed. 
</br> 
  
* ACCT.08. Prevent public access to private S3 buckets. We advise **enforcing this across your AWS organization** with SCP. If you need to make something public, consider using CloudFront. Make a private bucket and give CloudFront access via origin access identity. 
</br> 
  
* ACCT.09. Delete unused VPCs, subnets, and security groups. A surprising piece of advice from Amazon that previously recommended otherwise – to keep a default VPC  while removing ingress/egress rules from a default security group. Please, be careful with this advice since some services may (we have no proof) still assume that you have a default VPC and thus might attempt to use it.
You might ask - what is wrong with the default VPC? It is its CIDR (IP address namespace). If you have several accounts and want to make VPC peering between default VPCs, you won’t be able to do it because the default ones have the same address namespace, so routing would not work. To enable routing, you need to create your own VPC with a unique address namespace.
Going forward, FivexL will follow this advice and try removing the default VPC. We will keep you posted! 
</br> 
 
* ACCT.10. Configure AWS Budgets to monitor your spending. Besides configuring AWS Budgets, **set up Cost Anomaly Detection**. You will receive alerts not only when you exceed the budget but also when some service usage spikes, which, more often than not, will suggest costly misconfiguration and allow you to catch it early. Make sure to use mailing lists/google groups instead of individual emails so more people get those and can act swiftly. 
</br> 
 
* ACCT.12. Monitor for and resolve high-risk issues by using Trusted Advisor. Trusted Advisor allows you to scan your AWS infrastructure for high-risk or high-impact security, performance, cost, and reliability issues. However, you get 360-degree monitoring only if you buy a support plan. The basic, free plan is very limited. Should you buy it or not? Think of it like an insurance for productions – after an incident occurs, you’ll wish you had it. You can buy a support plan and thus get access to all Trusted Advisor checks only for your production accounts while leaving other accounts on the basic plan.  
### Workloads Security
* WKLD.02. Restrict credential usage scope with resource-based policies permissions.  Instead of commanding “Action” : “s3:*”, which allows all s3 actions, specify which action is permitted (for example, getting an object). If you look for more advanced settings, consider providing attribute-based access to users, for instance, from certain departments (SSO allows setting session tags).  
</br> 
 
* WKLD.05. Detect and remediate exposed secrets. The advised CodeGuru may be too expensive. Store your secrets in Secrets Manager or SSM Parameter Store and have your code fetch them dynamically. See the limitations of those services to understand which is more suitable for your use case. 
</br> 
 
* WKLD.07. Log data events for S3 buckets with sensitive data. By default, CloudTrail doesn’t log data events. You may enable logging if your S3 bucket contains sensitive data worth guarding. However, those who operate with large data volumes will suffer from huge bills. You might consider using S3 access logs as an alternative is a far more affordable option that will cope with the majority of data (if not all). [Find more information here](https://docs.aws.amazon.com/AmazonS3/latest/userguide/logging-with-S3.html) and see what works for you.
</br> 
 
* WKLD.12. Use VPC endpoints to access supported services. This is solid advice. Users should definitely use Gateway VPC endpoints for DynamoDB and S3. Those are free and will keep your sensitive data from traversing a public internet and save money on data transfer via NAT. Though for other services, AWS offers interface endpoints and those you need to provision to subnets, they actually cost money. Not a lot, but if you do not send any sensitive data to the service (for example, ECS control plane) and data volume is low, then you will pay more than you save and not gain any security benefits.
</br> 
 
* WKLD.15. Define security controls in templates and deploy them by using CI/CD practices. While Amazon obviously recommends using AWS Cloud Development Kit (CDK) and/or CloudFormation, we suggest using Terraform. Please, note that it’s not a mandatory rule: use the tool you are best acquainted with. If you aren’t aware of how any works, Terraform might be a better choice at the moment of writing.  

Although Amazon’s and FivexL’s recommendations predominantly match, our guidelines allow will allow you to skip certain points that do not yield much in terms of practical security. At the same time, we augment some of the guidelines to provide a more secure, sophisticated setup that you will not need to change later on when your team grows, and your product matures.  
Stay safe and productive!

P.S. If you have any questions regarding the recommendations above or would like to help implement them, we would be happy to hear from you!

