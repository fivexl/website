---
title: 'Security Basics in AWS '
author_id: 'Maria Zubchenko'
summary: 'Security Manual for Startups: How To Secure Your AWS Account in Several Steps'
date: 2022-05-24
author: Maria Zubchenko
panel_image: Masha_article_5.png
tags: ['security', 'AWS']
---
Security Manual for Startups: How To Secure Your AWS Account in Several Steps
=============================================================================
At the beginning of their journey, startups focus on quick solution deployment, sometimes completely neglecting security. However, it may become a fatal mistake: enterprises have already established trust with their audience, while startups have no reputation. Therefore, users and partners may never want to deal with them again after a data leak. What’s more, security gaps may undermine your financial state due to cybercriminals accessing your billing data or your Amazon bills ramping up.  
<br/>
You can avoid all these problems by spending up to one working day on setting up your security properly with basic AWS monitoring and security tools. In this article, we will provide top recommendations to safeguard your business hassle-free.
## A Snapshot – Key Recommendations To Secure Your AWS Account ##
Here is a brief overview of key initiatives to take to secure your AWS account:
1. Set up AWS IAM Identity Center  access  
2. Create organization
3. Don’t use a root account
4. Set up an organization trail
5. Set up a service control policy 
6. Secure developers 
7. Use security tools
## A Comprehensive Guide To Securing an AWS Account for Startups ##
Let’s elaborate on the above-mentioned recommendations and find out what exactly you need to do to minimize financial and reputational security risks:
### 1. AWS Account Setup ###
We will avoid obvious steps you’ll encounter when creating an AWS account and highlight important points to keep in mind:
* **Password.** While we are the advocates of no-password policies with a focus on AWS IAM Identity Center , you can’t set up an account without one. When generating a password, avoid using sensitive data like your phone number, ID details, or any other personal information like your pet’s name. If such a password leaks, your data will too. Go for long combinations where used words make no sense. The ideal choice is to use a password manager that will free you up from sharing passwords via sensitive channels like email or messengers. For example, 1Password generates passwords that are 60+ symbols long.
* **MFA (Multi-factor authentication).** It’s a must for any service, including GitHub. You can use anything as the second authentication – a token, an SMS, a call to your private number, or biometrics. The best choice is a physical token, which is almost impossible to steal.
* **Don’t use a root account.** Although you can’t create an AWS account without root users, avoid using it later. If you generate root user credentials but lose them, consider signing your house over to a stranger. You hardly share them with anyone.
{{< image src="1.jpeg" alt="How to save" width="50%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}} 

### 2. IAM Console ###
Now you are in. Go to the IAM console. Amazon recommends creating IAM users with groups and policies.
<br/>
FivexL suggests a more secure option – **AWS IAM Identity Center** (previously known as AWS SSO - Single Sign-On). If you have IdP(for example, G Suite) or an active directory with users to provide access, AWS IAM Identity Center  solves the problem in a centralized way. It will send temporary credentials to access the account in one click. The users will proceed with the following steps:
1. Entering the AWS IAM Identity Center portal
2. Authorizing in Google
3. Getting permission to access all the necessary accounts
If you can’t set up AWS IAM Identity Center  at the moment, you can use static credentials. For instance, let’s create two users – admin 1 and admin 2. Add them to the admin group with already specified permissions and policies. Please, note that the default admin access policy is wide, and on the root level – it allows completing any action. Avoid using root access in the long term.  

The same applies to static credentials that increase your vulnerability in the long term. And the biggest threat is that you or your teammates may hardcode static keys or share them with a non-secure channel. Predominantly, the keys are hardcoded in GitHub repos, which may result in several problems:
* If you hardcode AWS keys of a public project, a restricted policy will be applied by AWS. Think of it like a quarantine that prohibits you from performing the majority of actions.
* If you hardcode the keys of a private project and then publish it, you basically give hackers a free ticket to steal your business.  

You can even become a victim of social engineering and phishing if you follow a doubtful link and enter your creds there. Here are some tips for you not to fall into a cybercriminal’s trap:
* **Don’t rush.** Hackers try to stress you out by adding words like urgent, quickly, etc., so you have little time for analysis and prudent decision-making.
* **Never click on a doubtful link.** Try to access the service in a console yourself. In the majority of cases, you won’t find anything.
* **If you receive an odd text or email from colleagues or friends, contact them on another channel** to ensure they were the ones to send you a message. Inform them that they may have fallen victim to cybercriminals.
* **Don’t use static keys.** It’s always best to opt for temporary credentials that expire within a specific timeframe, leaving little to no window of opportunity for a cybercriminal to steal your data and business. One useful tool is aws-vault, which generates dynamic credentials that expire within a certain period. You can learn more about its benefits and usage here (link).
### 3. AWS Organization Setup ###
Instead of using root accounts, set up an AWS organization with several accounts targeted for specific tasks. For example, you can begin with two accounts: development and production. Here are the main benefits your startup will experience:
* **Isolation and control.** Each workload is managed and monitored in a specific account that facilitates resource optimization. 
* **Security.** If hackers access one account, it’ll be hard for them to access a second one. You will have a competitive advantage – time to react and prevent unauthorized access with minimized losses. 
* **Security control.** You can specify compliance and other regulations for each account to facilitate management and quality assurance. 
* **Facilitated billing.** You can easily monitor how many resources each workload or team uses, which simplifies resources allocation and management.
### 4. Monitoring ###
Before you let your developers and the rest of the team in, set up monitoring tools. 
CloudTrail is a 24/7 security camera that records what is happening at your doorstep. In other words, it records every click and API call and collects the data in the Amazon S3 bucket.  

### 3. AWS Organization Setup ###
Instead of using root accounts, set up an AWS organization with several accounts targeted for specific tasks. For example, you can begin with two accounts: development and production. Here are the main benefits your startup will experience:
Isolation and control. Each workload is managed and monitored in a specific account that facilitates resource optimization. 
Security. If hackers access one account, it’ll be hard for them to access a second one. You will have a competitive advantage – time to react and prevent unauthorized access with minimized losses. 
Security control. You can specify compliance and other regulations for each account to facilitate management and quality assurance. 
Facilitated billing. You can easily monitor how many resources each workload or team uses, which simplifies resources allocation and management.
### 4. Monitoring ###
Before you let your developers and the rest of the team in, set up monitoring tools. 
* **CloudTrail** is a 24/7 security camera that records what is happening at your doorstep. In other words, it records every click and API call and collects the data in the Amazon S3 bucket.  
{{< image src="2-2.png" alt="S3 bucket" width="20%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  

Here are some best practices to get the most of CloudTrail:
* **Set Cloudtrail up as an organizational trail** (**LINK**). It will take around 15 minutes, and you will have all the trails in one account to carry out comprehensive audits quickly.
* **Prohibit subsidiary accounts from deactivating CloudTrail.** This is the first thing any cybercriminal tries to do.
* **Set up notifications.** By default, CloudTrail can send you email alerts. To improve productivity and get only meaningful notifications, activate the CloudTrail-to-Slack
* **Terraform module from FivexL.** It will show you who keeps trying to get access to sensitive resources, what misconfigurations may increase your Amazon bills, and more.  
You can use default rules or customize them to get the important alerts only. Find more about the CloudTrail-to-Slack module here (link).

{{< image src="3.png" alt="Cloud Trail" width="50%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  

* **Deploy Amazon Athena.** It empowers detailed security research, allowing you to create an SKL order to dive deeper into CloudTrail’s records. While it’s not mandatory at the beginning of your security journey, you will find it useful later to investigate any account-related anomalies or unauthorized access incidents.
One more useful monitoring tool is GuardDuty – an ML-based watchdog that barks if it notices anything abnormal—for instance, if someone grants themselves more privileges than allowed. On the one side, it analyses everything, including VPC Flow logs, DNS logs, and CloudTrail logs, and delivers too many findings. On the other side, you can react quickly and prevent serious security incidents.  

{{< image src="aws_guardduty.png" alt="How to save" width="50%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  

### 5. Access for Developers
In order to safeguard your developer’s work, you need to know what to beware of. The majority of AWS-related incidents fall into three categories:
1. S3 buckets or ElasticSearch clusters are publicly accessible.
2. Access keys are leaked (for instance, hardcoded to a public GitHub repository).
3. IAM Roles are compromised and hackers access the metadata service.  

Here are some initiatives that will help you protect your AWS business from major cyberthreats:
* **Classify data.** Logs aren’t as valuable as confidential data. By classifying data with tags, you can easily find it in your databases and set up alerts. 
* **Prohibit the creation of public S3 buckets.** Blocked public access allows you to prohibit users from opening public files or creating public buckets at all. It’s best to set it up on the account level.
* **Set up a policy for each bucket** to control what actions can be undertaken.
* **Don’t expose your databases to the web.** There are services that scan the internet to find specific data or types of objects, meaning cybercriminals won’t devote much effort to finding your secrets. It’s best to do snapshots and encrypt them so an attacker can’t expose a non-encrypted snapshot to the web.
To facilitate monitoring and timely reactions to security incidents, consider using the following tools:
* **Config to record a complete timeline** of what is happening with all your resources. You can still find out what happened even if the object was deleted. You need its ID from CloudTrail to find the instance and learn who changed it and how. While you can do all this in CloudTrail, Config boasts an improved UI, allowing you to conduct research faster and easier. It also triggers Lambdas for various events and allows you to set up compliance rules. Suppose you forbid any security group from opening port 22, but Config detected the incident occurred. You can call the lambda to shut down the security group. 
* **SecurityHub** to aggregate data across all services, including IAM access, GuardDuty, Config, CloudTrail, and more. You can find public buckets, not encrypted databases, or receive recommendations on how to improve your security. While you may not need it in the beginning, it’s highly useful for conducting regular security audits in the future.  

Please note that not all the services are free. Some, however, provide free tiers.
## How To Succeed in the Security Marathon?
Security is a life-long journey – you can hardly forget about it after 1, 3, 5, or even 10 years. The provided recommendations can help you build a solid basis for your house. However, you will have to build the walls and a roof and keep renovating your house. One important point to keep in mind is culture. No matter what initiatives you undertake, you won’t achieve your goal without fostering a culture of security. 
