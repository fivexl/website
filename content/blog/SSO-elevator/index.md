---
title:  'Introducing the Open-Source Terraform AWS SSO Elevator Module with Slack Integration'
author_id: 
 - 'Andrey_Devyatkin'
 - 'Alexey Eremin'
 - 'Anton Eremin' 
summary: 'Open-source Terraform AWS SSO Elevator tool allows requesting and granting temporary elevated access for AWS SSO through a Slack request/approval workflow.'
date: 2023-06-02
author: 
 - 'Andrey_Devyatkin'
 - 'Alexey Eremin'
 - 'Anton Eremin' 
panel_image: Alexey.png
tags: [ 'AWS', 'SSO Elevator', 'open sourse','Slack']
---
In our work with startups, we have noticed a common challenge that many teams face when managing AWS IAM Identity Center - the inability to temporarily assign permission sets to users. Startups want to move fast but at the same time it is hard to strike a balance between the speed and security. To address this problem, we have created the open-source [Terraform AWS SSO Elevator module](https://github.com/fivexl/terraform-aws-sso-elevator). This tool ensures a more efficient and secure approach to access management by providing a way of temporary elevating users access while avoiding permanent too-permisive access. We are excited to share this module with the broader AWS community, especially after seeing its successful implementation with our startup customers.

### The Problem
WCurrently, there is no simple integration between AWS IAM Identity Center and Slack to provide the temporary assignment of permission sets to users.
As a result, teams using AWS IAM Identity Center are forced to either create highly restricted permission sets or rely on AWS IAM role chaining. Both approaches have significant drawbacks and result in an overly complex security model. The desired solution is one where AWS operators are granted access only when necessary and for the exact duration needed, with a default state of no access or read-only access.

### The Solution
The terraform-aws-sso-elevator module addresses this issue by allowing the implementation of temporary elevated access to AWS accounts while avoiding permanently assigned permission sets, thereby achieving the principle of least privilege access.  
For more information on temporary elevated access visit [Managing temporary elevated access to your AWS environment](https://aws.amazon.com/blogs/security/managing-temporary-elevated-access-to-your-aws-environment/).  
The key difference between the terraform-aws-sso-elevator module and the option described in the blog post above is that the module enables requesting access elevation via a Slack form. We hope that this implementation may inspire AWS to incorporate native support for temporary access elevation in AWS IAM Identity Center or to add Slack as is another option.

### How It Works 
{{< image src="sso-elevator.png" alt="How to save" width="70%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
The module deploys two AWS Lambda functions: access-requester and access-revoker. The access-requester handles requests from Slack, creating user-level permission set assignments and an Amazon EventBridge trigger that activates the access-revoker Lambda when it is time to revoke access. The access-revoker revokes user access when triggered by EventBridge and also runs daily to revoke any user-level permission set assignments without an associated EventBridge trigger. Group-level permission sets are not affected.  
For auditing purposes, information about all access grants and revocations is stored in S3. See [documentation here](https://github.com/fivexl/terraform-aws-sso-elevator/tree/main/athena_query) to find out how to configure AWS Athena to query audit logs.  
Additionally, the access-revoker continuously reconciles the revocation schedule with all user-level permission set assignments and issues warnings if it detects assignments without a revocation schedule (presumably created by someone manually). By default, the access-revoker will automatically revoke all unknown user-level permission set assignments daily. However, you can configure it to operate more or less frequently.

### Important Considerations 
SSO elevator assumes that your Slack user email will match SSO user id otherwise it won't be able to match Slack user sending request to an AWS SSO user.  
When onboarding your organization, be aware that the access-revoker will revoke all user-level Permission Set assignments in the AWS accounts you specified in the module configuration. If you specify Accounts: '*' in any of rules, it will remove user-level assignments from all accounts. Therefore, if you want to maintain some permanent SSO assignments (e.g., read-only in production and admin in development or test accounts), you should use group-level assignments. It is advisable to ensure your AWS admin has the necessary access level to your AWS SSO management account through group-level assignments so that you can experiment with the module's configuration.

### Deployment and Usage 
The deployment process is divided into two main parts: deploying the Terraform module, which sets up the necessary infrastructure and resources for the Lambdas to function, and creating a Slack App, which will be the interface through which users can interact with the Lambdas. Detailed instructions on how to perform both of these steps, along with the Slack App manifest, can be found in the project's [GitHub repository](https://github.com/fivexl/terraform-aws-sso-elevator).

### Conclusion
We believe that the Terraform AWS SSO Elevator module provides a practical solution to a common problem faced by many AWS users. It simplifies the process of managing temporary elevated access, enhances security, and provides a user-friendly interface through Slack.  
We hope that others will find it useful and welcome contributions from the community to help improve and expand the tool's functionality.  
As an open-source project, we are committed to transparency and collaboration. We encourage users to submit bug reports and feature requests on our [GitHub page](https://github.com/fivexl/terraform-aws-sso-elevator), and we welcome contributions from developers who want to help improve the tool. By working together, we can continue to make Terraform AWS SSO Elevator a valuable tool for the AWS community. 