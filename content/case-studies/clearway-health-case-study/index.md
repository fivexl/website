---
title: 'Clearway Health Case Study'
author_id: 'Guilherme Ferreira'
 
summary: 'FivexL helped a Norwegian startup migrate from Google Cloud to AWS ECS, enabling them to scale their business and pass audits.'
date: 2024-11-11 
author:  Guilherme Ferreira
panel_image: artem_gradient.png
authors_heading: 'Senior consultant leading the project'
alt_image: artem_quad.png
case_study: true
layout: 'case_study'
tags: ['case study', 'aws']
testimonial: ' short testimonial testimonial testimonial'
testimonial_author: 'Rusty Atkinson'
testimonial_author_position: 'Vice President, Head of Technology at Clearway Health'
testimonial_cta_url: 'https://sales.fivexl.io/schedule-a-call'
testimonial_author_portrait: Rusty.jpg
testimonial_long: |
  Testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial testimonial
about_company:
  logo: 'Clearway.jpg'
  heading: 'About Clearway Health'
  text: |
   [Clearway Health](https://www.clearwayhealth.com/) is an American startup from the healthcare sector, originating from Boston Medical Center. Clearway Health develops SaaS to address the complex medication needs of various patient populations. It ensures patients receive their medications on time and provides personalized support to patients, families, providers, and care managers. They collaborate with hospitals and health systems to create and manage specialty pharmacy programs.
double_panel:
  layout: 'case-studies'
  heading: "CASE STUDIES"
  subheading: "SaaS, AI, health care, and financial startups trust FivexL to build their infrastructure in AWS, empowering their businesses to grow faster. Learn how."
  icon_links:
    - { url: "https://github.com/fivexl", icon: "github" }
    - { url: "https://www.linkedin.com/company/5xl", icon: "linkedin" }
  button_cta: { url: "https://sales.fivexl.io/schedule-a-call", text: "Book a consultation" }
  media_panel: { url: "https://youtu.be/uruLy1goNW0" }
---
{{< case_study/challenge  image="gui_challenge.png" image_css="object-position: 18%" >}}
{{< pink_heading text="Challenge"  sizes="bigger">}}
Clearway Health aimed to leverage the full power of AWS from the very beginning to ensure their SaaS was built on a robust, scalable, and secure infrastructure. Recognizing the importance of a solid foundation, they opted to use AWS RightStart by FivexL to build their infrastructure from scratch the right way.<br/> 
<br/>    
While creating the first AWS accounts and deploying the first application is relatively straightforward, scaling AWS infrastructure to handle more customer traffic, adapt to market changes, and meet compliance requirements is much more challenging. The complexity multiplies when the infrastructure lacks a solid, well-planned foundation.<br/> 
<br/>     
Clearway Health understood that to support their growth ambitions and ensure the success of their SaaS offerings, they needed an expertly crafted AWS environment that could seamlessly scale, adapt to their evolving needs, meet compliance requirements, and provide robust security for their data from day zero. They turned to FivexL, known for helping startups build infrastructure on AWS.


{{</ case_study/challenge >}}
 
{{< case_study/solution heading="Solution" >}}
{{< case_study/column >}}
FivexL created a dedicated service called AWS RightStart for requests like these. The team has packed years of experience working with startups into this service, anticipating and addressing the challenges they face at the growth stage to set them up for success.  
  
AWS RightStart leverages the concept of an AWS Landing Zone, which includes a set of best practices and configurations to provide a robust, scalable, and secure multi-account AWS environment.  
  
Clearway Health received an infrastructure capable of supporting thousands of future users. Each foundational element is methodically constructed to ensure security and elasticity, providing a solid base that will be sufficient for years to come.
### Key Components Clearway Health received 
**Account Baseline Factory**  
This baseline setup is a key part of AWS RightStart, which allows the startup to maintain a secure and compliant environment without the overhead of configuring each account individually. All accounts come pre-configured with essential contacts (billing, security, operations) and have unused regions disabled for added protection. Additionally, other preconfigured features simplify the usage of accounts, such as OIDC for CI access, Terraform state management, and more. Security tooling is configured organization-wide, including AWS Config, Security Hub, CloudTrail, and GuardDuty, to ensure comprehensive auditing, security posture management, API call logging, and intrusion detection.<br/>   

**AWS Organization Management Account**  
FivexL implements Organizational Units (OUs) to group accounts with similar or related functions to apply common policies, share common resources, or provision and manage common resources.  

**Logs Archive Account**
All logs are replicated and stored in an immutable log storage setup, ensuring they cannot be altered or deleted, and no one has access by default.This is important for startups to ensure compliance and maintain a reliable audit trail.
{{</ case_study/column >}}
{{< case_study/column >}}
**Security Tooling Account**  
This account features a centralized setup for CloudTrail, Security Hub, Config, and GuardDuty, ensuring organization-wide security monitoring and alerting. This centralized security management helps Clearway Health quickly detect and respond to potential threats across their entire AWS environment.    

**SSO Account**  
AWS IAM Identity Center (SSO) is configured with an IDP provider, predefined permission sets, and Slack integration for temporary access, ensuring secure and efficient identity management. This setup simplifies access management ensuring that developers of the startup have the right level of access.

**Network Management Account**  
Shared VPC configurations are managed with public, private, and database subnets, enhancing security and segregation of workloads. 

**Encryption  Account**  
Multi-regional AWS KMS keys are created and set up in this dedicated account for centralized management. This ensures that the keys are managed by a dedicated team and are not accidentally deleted or modified. Restrictive key policies are implemented to prevent unauthorized modifications. 

**Backup Account**  
Clearway Health received pre-created backup accounts in production, development, and staging environments. This setup will help protect the startup's data against loss and ensure business continuity when it becomes necessary.


**Workload Accounts**  
These accounts are ready to accept workloads with ECS clusters and supporting resources pre-configured for different components (e.g., frontend, backend) based on the software architecture. It allows the startup to deploy their applications quickly and efficiently, focusing on growth and innovation.  
  
**Explore AWS RightStart by FivexL on [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-d4lown4cemykw)**
{{</ case_study/column >}}
{{</ case_study/solution >}} 

{{< case_study/section >}}
{{< md >}}![diagram](clearway_diagram.png){{</ md >}}
{{</ case_study/section >}}

{{< case_study/benefits
    cta_text="Start Your Success Story"
    cta_url="https://sales.fivexl.io/schedule-a-call"
    image="cristal_benefits.png"
    >}}
{{< pink_heading text="Benefits" >}}
By implementing these components, FivexL’s RightStart for AWS provides a comprehensive AWS Landing Zone that is secure, scalable, and compliant. It might sound like a lot of work, but not getting it right from the beginning will cause even more work down the line and hinder or completely stop the product's scalability. Redoing it later can become very complicated and costly.<br/>  
<br/>  

<h3> Key Benefits of AWS RightStart by FivexL </h3> 

- Rapid Deployment: Infrastructure set up in just a few weeks, saving months of effort.  <br/> 
- Scalability: Supports thousands of users, ensuring smooth company growth.  <br/> 
- Data Protection: Security from day one, protecting sensitive data.  <br/> 
- Cost Efficiency: Effective management to avoid unexpected expenses.  <br/> 
- Compliance: Meets regulatory requirements, ensuring clients' trust and reliability. <br/> 
<br/>  
This setup typically takes a solo in-house specialist over a year to complete, but with FivexL expertise and automation, it was delivered to Clearway Health in just a couple of weeks. The startup saves time, avoids mistakes, reduces costs, and ensures no costly rework later in the process.<br/> 
<br/>   
Clearway Health benefits from a robust, scalable, and secure foundation designed for future development and rapid scaling. This strong AWS base ensures security from day one and is built to support their needs for several years, all within a matter of weeks.

{{</ case_study/benefits >}}
