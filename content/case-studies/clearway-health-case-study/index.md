---
title: 'Clearway Health Case Study'
author_id:
- 'Guilherme Ferreira'
- 'Anton Eremin'
 
summary: 'FivexL helped an American specialty pharmacy services company, Clearway Health, build a strong, scalable, and secure foundation with AWS RightStart for future development and rapid scaling.'
date: 2024-12-09 
author:  Guilherme Ferreira Anton Eremin
panel_image: cristal4.png
authors_heading: 'Consultant Team Leading the Project'
alt_image: artem_quad.png
case_study: true
layout: 'case_study'
tags: ['case study', 'aws']
testimonial: 'Fivexl has been a great partner. They demonstrate unrivaled expertise in the AWS ecosystem and deliver results quickly.'
testimonial_author: 'Rusty Atkinson,'
testimonial_author_position: 'VP, Technology at Clearway Health'
testimonial_cta_url: 'https://sales.fivexl.io/schedule-a-call'
testimonial_author_portrait: Rusty.jpg
testimonial_long: |
  "Fivexl's domain expertise as Cloud Engineering Specialists has helped Clearway Health deliver on our aggressive SaaS vision with confidence that the decisions we are making today will serve us well for years to come. FivexL's RightStart for AWS allowed us to get many important, foundational elements decided and solved in record time, which has allowed the Clearway Health Technology Team to spend more time and attention on specialty pharmacy-specific decisions".
about_company:
  logo: 'Clearway.jpg'
  heading: 'About Clearway Health'
  text: |
   Clearway Health’s specialty pharmacy services create sustainable assets and build lasting legacies for hospitals and health systems, providing a service that every patient deserves. Their team began at Boston Medical Center Health System, improving access to care and managing the complex medication needs of vulnerable patient populations. Equipped with this unique experience to solve challenges, Clearway Health partners with other hospitals and health systems to provide transformative specialty pharmacy services that put patients first. Their strategic partnerships build and strengthen the infrastructure for specialty pharmacy programs through improving operational workflows, implementing clinical programs, hiring and embedding skilled pharmacists and patient liaisons into the clinical team, providing proprietary software technology, unlocking drug access and leading accreditation processes. Clearway Health delivers a clinically driven service that eliminates barriers to medication access, improves the health of patients and communities, grows revenue at healthy margins for health systems and reduces costs for patients. To learn more, visit www.clearwayhealth.com.
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
Clearway Health aimed to leverage the full power of AWS to ensure their SaaS solution was built on a robust, scalable and secure infrastructure. They opted to partner with an expert in the space to accelerate their success and chose to use AWS RightStart by FivexL to build their infrastructure.<br/>  
<br/>    
While creating the first AWS accounts and deploying the first application is relatively straightforward, scaling AWS infrastructure to handle increased traffic, adapt to rapidly evolving market changes, and meet highly complex compliance requirements in the healthcare and specialty pharmacy setting is much more challenging.<br/>  
<br/>    
"We understood that in order to deliver the results we promise to our clients and to transform specialty pharmacy through our SaaS solution, we needed an expertly crafted AWS environment. It had to seamlessly scale, adapt to our evolving needs, meet compliance requirements, and provide robust security for our data from day zero", said Rusty Atkinson, VP, Technology at Clearway Health.
Recognizing this need, they turned to FivexL, known for helping their clients build infrastructure on AWS.



{{</ case_study/challenge >}}
 
{{< case_study/solution heading="Solution" >}}
{{< case_study/column >}}
FivexL created a dedicated service called RightStart for AWS for requests like these. The team has packed years of experience into this service, anticipating and addressing the challenges they face at each stage of growth to set them up for success.
  
FivexL's RightStart for AWS leverages the concept of an AWS Landing Zone, which includes a set of best practices and configurations to provide a robust, scalable and secure multi-account AWS environment.  
  
Clearway Health received an infrastructure capable of supporting thousands of future users. Each foundational element is methodically constructed to ensure security and elasticity, providing a solid base that will be sufficient for years to come.
### Key Components Clearway Health received 
**Account Baseline Factory**  
This baseline setup is a key part of FivexL's RightStart for AWS, which allows Clearway Health to maintain a secure and compliant environment without the overhead of configuring each account individually. All accounts come pre-configured with essential contacts (billing, security, operations) and have unused regions disabled for added protection. Additionally, other preconfigured features simplify the usage of accounts, such as OIDC for CI access, Terraform state management and more. Security tooling is configured organization-wide, including AWS Config, Security Hub, CloudTrail and GuardDuty to ensure comprehensive auditing, security posture management, API call logging and intrusion detection.<br/>   

**AWS Organization Management Account**  
FivexL implements Organizational Units (OUs) so Clearway Health can group accounts with similar or related functions to apply common policies, share common resources or provision and manage common resources.  

**Logs Archive Account**
All access and security logs are replicated and stored in an immutable log storage setup, ensuring they cannot be altered or deleted, and no one has access to this account by default. This is important for companies like Clearway Health to ensure compliance and maintain a reliable audit trail.
{{</ case_study/column >}}
{{< case_study/column >}}
**Security Tooling Account**  
This account features a centralized setup for CloudTrail, Security Hub, Config and GuardDuty, ensuring organization-wide security monitoring and alerting. This centralized security management helps Clearway Health quickly detect and respond to potential threats across their entire AWS environment.    

**SSO Account**  
AWS IAM Identity Center (SSO) is configured with an IDP provider, predefined permission sets and Slack integration for temporary access, ensuring secure and efficient identity management. This setup simplifies access management ensuring that developers of the startup have the right level of access.

**Network Management Account**  
Shared VPC configurations are managed with public, private and database subnets, enhancing security and segregation of workloads. 

**Encryption  Account**  
Multi-regional AWS KMS keys are created and set up in this dedicated account for centralized management. This ensures that the keys are managed by a dedicated team and are not accidentally deleted or modified. Restrictive key policies are implemented to prevent unauthorized modifications. 

**Backup Account**  
Clearway Health received pre-created backup accounts in production, development and staging environments. This setup will help protect their data against loss and ensure business continuity when it becomes necessary.

**Workload Accounts**  
These accounts are ready to accept workloads with ECS clusters and supporting resources pre-configured for different components (e.g., frontend, backend) based on the software architecture. It allows Clearway Health to deploy their applications quickly and efficiently, focusing on growth and innovation.  
  
**Explore FivexL's RightStart for AWS on [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-d4lown4cemykw)**
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
By implementing these components, FivexL’s RightStart for AWS provides a comprehensive AWS Landing Zone that is secure, scalable and compliant. It might sound like a lot of work, but not getting it right from the beginning will cause even more work down the line and hinder or completely stop the product's scalability. Redoing it later can become very complicated and costly.<br/>  
<br/>  

<h3> Key Benefits of FivexL's RightStart for AWS </h3> 

- Rapid Deployment: Infrastructure set up in just a few weeks, saving months of effort.  <br/> 
- Scalability: Supports thousands of users, ensuring smooth company growth.  <br/> 
- Data Protection: Security from day one, protecting sensitive data.  <br/> 
- Cost Efficiency: Effective management to avoid unexpected expenses.  <br/> 
- Compliance: Meets regulatory requirements, ensuring clients' trust and reliability. <br/> 
<br/>  
This setup typically takes a solo in-house specialist over a year to complete, but with FivexL expertise and automation, it was delivered to Clearway Health in just a couple of weeks. The partnership with FivexL equipped Clearway Health tosave time, avoid mistakes, reduce costs and ensure no costly rework later in the process.<br/>
<br/> 
Clearway Health delivers specialty pharmacy services that are powered by technology. Their SaaS solution is  proprietary, robust, scalable and secure, - ensuring their ability to deliver ongoing development and rapid scalability in a secure way for their hospital and health system clients and the patients they serve. 


{{</ case_study/benefits >}}
