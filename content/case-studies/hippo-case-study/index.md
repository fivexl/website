---
title: 'Hippo Case Study'
author_id:
- 'Andrey Devyatkin'
- 'Ivan Razzhivin' 
summary: 'FivexL helped U.S. healthcare startup Hippo prepare AWS infrastructure for SOC 2 certification. By using FivexL’s RightStart for AWS, Hippo gained a compliance-ready foundation with a well-structured multi-account setup that simplified audits and supported rapid growth.'
date: 2025-06-30 
author: AAndrey Devyatkin Ivan Razzhivin
panel_image: hippo1.png
authors_heading: 'Consultant Team Leading the Project'
alt_image: hippobnw.png
case_study: true
layout: 'case_study'
tags: ['case study', 'aws', 'SOC2', 'RightStart']
testimonial: 'The FivexL team had laid the foundation for SOC2, and we didn’t need to make major changes to get certified.'
testimonial_author: 'Mattias Hemmingsson,'
testimonial_author_position: 'Head of Security at Hippo'
testimonial_author_portrait: matte.png
testimonial_cta_url: 'https://sales.fivexl.io/schedule-a-call'
testimonial_long: |
  “For me, there are two most valuable parts of FivexL’s work. One is the multi-account AWS setup. This setup makes life from a compliance perspective really simple, because I can clearly show, ‘This is the account where we have the sensitive data,’ and you can see it’s really locked down.  The second is the SSO Elevator tool — it grants access only for a limited time and works together with account segmentation. So the access is specific and time-bound, not broad or permanent. That’s been really helpful for our compliance work.”
about_company:
  logo: 'hippologo.png'
  heading: 'About Hippo'
  text: |
    [Hippo](https://hellohippo.com/) is a U.S. technology company operating in the healthcare sector, an industry known for its strict regulatory requirements. Hippo developed a free, smart platform that helps users navigate the complex world of prescription pricing, identifying the lowest available price. It saves up to 97% on prescriptions. Hippo is accepted at over 70,000 pharmacies nationwide, including CVS, Walgreens, Rite Aid, Walmart, Target, Kroger, Publix, Costco, and more. By empowering users to make smarter choices, Hippo takes the pain out of the healthcare system, proving that while health is priceless, medication should be affordable.
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
{{< case_study/challenge  image="hippo_challenge.png" image_css="object-position: center 10%">}}
{{< pink_heading text="Challenge"  sizes="bigger">}}
In the early stages of company development, Hippo began collaborating with FivexL to establish HIPAA-compliant AWS infrastructure to support the development of a minimum viable product (MVP). The company operates in a highly regulated space, handling sensitive health data that must comply with strict US legal and technical requirements.<br/>
<br/>  
As Mattias Hemmingsson, Head of Security at Hippo, explained:  
 “We’re handling ePHI, which is medical personal information—like what drugs a person is taking, their name, and that kind of thing. So that’s very restricted in terms of how it can be handled. The US has a law called HIPAA, which defines those restrictions—what you can and can’t do. You have to follow these restrictions before you can transfer any PHI data. These rules apply not just internally, but also when working with customers and external partners.”<br/>
<br/>  
As the company pivoted and eventually gained traction, it began onboarding integration partnersand each of those partners required passing a security audit. The logical next step was to initiate SOC 2 certification to streamline future audits, attract more partners and support business growth. While the infrastructure had evolved well, preparing for SOC 2 revealed several compliance gaps. Addressing them required significant effort under a tight deadline.<br/>

{{</ case_study/challenge >}}  

{{< case_study/solution heading="Solution" >}}
{{< case_study/column >}}
### FivexL´s RightStart for AWS 
FivexL provided its productized service, RightStart for AWS—a Control Tower-based Landing Zone—to address these evolving compliance and scaling needs. FivexL’s RightStart is a compilation of best practices and accumulated experience from numerous projects implemented as Terraform templates. It could be deployed to new or existing AWS Organizations in a matter of weeks, allowing for quickly improved infrastructure alignment with regulatory requirements and getting it ready for compliance certification as SOC 2 or a security audit.  

RightStart for AWS equips clients with a compliance-ready infrastructure that, while secure, still facilitates rapid development and iteration. This setup includes AFT-based account vending automation, simplifying the provisioning of new accounts with a safe and compliant baseline while enabling the reuse of shared services, such as networking and log aggregation, thus reducing costs and offering granular control.  
This service was designed to streamline the infrastructure upgrade process, ensuring Hippo’s platform was well-prepared for regulatory compliance and production-level demands.  

With FivexL’s RightStart for AWS, Hippo gained several core benefits.  
 
**Dedicated Accounts with Multi-Account Strategy**  
Thanks to the collaboration with FivexL from the start, Hippo had already adopted a Multi-Account AWS Strategy ([watch the video "Why Use Multiple AWS Accounts?"](https://youtube.com/live/JBcwjP6HIZc)). This approach allowed them to separate different environments and workloads for better management and security. 
As a result, the startup received a well-organized structure with accounts arranged by organizational units,  including accounts for workloads, tools, shared networking, observability, and encryption services.  
Mattias Hemmingsson, Head of Security at Hippo, noted:
“This setup makes life really simple from a compliance perspective—because I can clearly show: ‘This is the account where we have the sensitive data, and you can see it’s really locked down.’ That’s a key factor. The segmentation of the network, how accounts are set up, and the structure—it’s super helpful for compliance.”
  
**Centralized Organization Management with Control Tower**  
AWS RightStart by FivexL enabled Hippo to go further by providing centralized control over all accounts within the organization. With Control Tower, changes are not deployed individually to each account.    
  
{{</ case_study/column >}}
{{< case_study/column >}}  
Any modifications are automatically delivered across all accounts, ensuring consistency and saving time. It also included automating security tooling and configurations provided by AWS, enhancing Hippo's infrastructure's overall security and compliance.  
  
**Enhanced Security with Centralized Security Tools**  
With FivexL’s RightStart for AWS, Hippo received a dedicated Security Tooling Account to manage essential tools like CloudTrail, Security Hub, Config, and GuardDuty across the organization. This centralized setup facilitated monitoring and rapid response to potential threats, providing the startup with strong protection for its AWS environment.  
  
FivexL included its open-source tool SSO Elevator for AWS ([watch the video](https://youtu.be/CrIfaNpuCeY?feature=shared)), in the RightStart package. This tool offers temporary elevated access through the AWS IAM Identity Center (the successor to AWS Single Sign-On) and Slack. This arrangement simplified IAM access planning and management while ensuring smooth audits.  
“SSO Elevator is another really valuable part—access is granted only for a limited time and combined with account segmentation. So the access is specific, not broad. That’s been really helpful for our compliance work,” said Mattias Hemmingsson, Head of Security at Hippo. 

**Effective Cost Management**  
RightStart for AWS, developed by FivexL, includes features like cost anomaly detection, which alerts the team if spending trends exceed predefined thresholds via email and AWS Chatbot. Using shared configurations, such as network and encryption, reduces the overall resources, leading to significant cost savings.  

**Implementation Process**  
While building infrastructure from scratch with FivexL’s RightStart for AWS is the fastest process, migrating existing infrastructure to RightStart requires some extra preparation. Hippo's existing infrastructure was already defined as code using Terraform, which made the transition to the new configuration simpler. The previous state was exported and compared with the setup used in FivexL's test organization. The FivexL team prepared code to migrate to the new resources while retaining critical resources, such as S3 buckets, which are better transferred rather than recreated.  
As a result, FivexL helped Hippo seamlessly migrate the existing organization to the new configuration. 
{{</ case_study/column >}}
{{</ case_study/solution >}}


{{< case_study/benefits
    cta_text=`Start Your Success Story`
    cta_url=`https://sales.fivexl.io/schedule-a-call`
    image=`goto_benefits.png`
    blockquote=`The FivexL team had laid the foundation for SOC 2, and we didn’t need to make major changes to get certified. It was mostly about showing what was already in place and making sure auditors and clients could easily access the information.`
    blockquote_author=`Mattias Hemmingsson, Head of Security at Hippo`
>}}
{{< pink_heading text="Benefits" >}}
Using FivexL’s RightStart solution, Hippo rapidly transformed its infrastructure to meet compliance demands. The transition, which could have taken a standalone cloud engineer up to a year, was completed in just a few weeks, giving Hippo a solid foundation to build on.<br/>
<br/>  
One of the key benefits of the setup was its flexibility. As the team prepared for SOC 2, FivexL stayed involved and helped make quick, well-targeted adjustments based on auditor feedback.<br/> 
<br/> 
Mattias Hemmingsson, Head of Security at Hippo, explained:<br/>
“When it came time to prove what we'd done during scanning and audits, a lot of the best practice setup was already there. We didn't expect everything to be perfect from the start. We focused on changing things quickly as needed. That makes it easier to go into the SOC 2 process with confidence. I had regular meetings with FivexL during that time, twice a week—like Tuesday and Thursday. If something was found on Tuesday, we could fix it by Thursday. That's a good time frame to work with for compliance.”<br/>
<br/>
He added:<br/>
“When you’re doing your first audit, you don’t always know how many changes will come up. With FivexL, even big adjustments—like changing the network flow—could be done quickly, often within days. That meant I could start the 4-week audit feeling confident: if we needed to fix something major, we could handle it during the audit itself.”<br/> 
<br/>
To make sure the whole team is on the same page, FivexL provided clear, detailed documentation, keeping everything transparent. This is especially helpful as the team expands, so new team members can quickly get up to speed and understand how the system works.<br/>
<br/> 
Investing in a well-organized infrastructure designed with growth potential ensures seamless scalability and avoids the complexities and high costs of future rework. This approach saved time and money and enabled Hippo to set the stage for continued growth and success.<br/>  
{{</ case_study/benefits >}}  


