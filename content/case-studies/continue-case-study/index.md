---
title: 'Continue Case Study'
author_id:
- 'Anton Eremin'
- 'Alexey Eremin' 
summary: 'FivexL’s RightStart for AWS and production-ready ECS setup gave a U.S. AI startup the infrastructure needed for commercial launch and global scaling.'
date: 2025-05-14 
author: Alexey Eremin Anton Eremin
panel_image: goto.png
authors_heading: 'Consultant Team Leading the Project'
alt_image: bro_quad.png
case_study: true
layout: 'case_study'
tags: ['case study', 'aws', 'ECS']
testimonial: 'I think FivexL did a really good job of being deliberate, explicit, and highly consistent about the work.'
testimonial_author: 'Nate Sesti,'
testimonial_author_position: 'CTO at Continue'
testimonial_author_portrait: nate.png
testimonial_cta_url: 'https://sales.fivexl.io/schedule-a-call'
testimonial_long: |
  “I think the biggest key benefit we’ve gotten is the deployment setup we have. It’s easy — any time we push to GitHub and merge a new PR, it’s automatically going to the development branch. We have full control over whether we want to move to staging or not. That’s helped us group and test changes more effectively. And having that magic button to confirm promotion to prod — we’ve had no major outages, no serious bugs, and I think that’s because this pipeline lets us be as deliberate as we want.”
about_company:
  logo: 'contlogo.png'
  heading: 'About Continue'
  text: |
    [Continue](https://www.continue.dev/) is AI-startup founded in 2023 in San Francisco. Continue enables developers to create, share, and use custom AI code assistants. The product is designed to integrate directly into developers' existing environments, making AI-enhanced development more accessible and flexible. Continue has gained over 26,000 [GitHub stars](https://github.com/continuedev/continue) and built an active community of more than 12,000 developers on Discord. Backed by Y Combinator and Heavybit, the startup recently launched version 1.0 of its product and raised $5 million to accelerate its growth.
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
{{< case_study/challenge  image="goto_challenge1.png" image_css="object-position: center 10%">}}
{{< pink_heading text="Challenge"  sizes="bigger">}}
Continue is a fast-moving AI startup behind a popular open-source AI coding assistant. With a growing community and plans to scale globally, the team was preparing to launch a commercial offering alongside their tool — and that meant building a solid infrastructure foundation.<br/>
<br/>  
Their open-source extensions ran fully on users’ local machines, with no backend, no billing, and no authentication. That setup was enough for the open-source version, but not for a scalable SaaS product. To support the next phase, Continue needed to move to a production-ready cloud environment.<br/>
<br/>  
After briefly experimenting with Google Cloud, the Continue team decided to migrate to AWS: “We had a very minimal server setup in Google Cloud — something I’d set up manually to support the open source project. I used some Terraform and chose GCP because that’s what I was most familiar with. But from the point of view of security, trust, reliability, and cost — especially for the enterprises we wanted to work with — AWS was clearly the standard.” said Nate Sesti, CTO at Continue.<br/>
<br/>   
Continue turned to FivexL on the recommendation of Mike Long, CEO at Kosli, a long-time FivexL client, to help them set up the infrastructure needed to support this next stage of the company’s evolution.<br/>
<br/>    
Speed was critical — the team needed a setup that would work from day one. FivexL helped build a secure environment with separate dev, staging, and production setups to support fast development and reliable releases.<br/>
<br/>   
Another key requirement was building a centralized and secure way to manage and distribute configuration files for teams using the SaaS product. The startup needed a system that would prevent sensitive data like access keys from leaking.<br/>
<br/>   
Continue also has a longer-term goal: achieving SOC 2 Type II compliance. For that, they needed a strong infrastructure foundation that would support a future audit.<br/>
<br/>   
{{</ case_study/challenge >}}  

{{< case_study/solution heading="Solution" >}}
{{< case_study/column >}}
To support Continue´s transition to a scalable SaaS product, FivexL proposed a two-part project: implementing its productized service FivexL´s RightStart for AWS setup and configuring Elastic Container Service (ECS) for application workloads.
### FivexL´s RightStart for AWS 
It gave the team a secure, structured foundation to build on — aligned with AWS best practices and designed to support global growth. It also laid the groundwork for SOC 2 compliance.  

FivexL’s RightStart delivered the following key elements.  
**Pre-configured AWS infrastructure with growth in mind**  
A key part of this setup is FivexL’s Account Factory for Terraform, which automates the creation and configuration of new AWS accounts. It allows startups to scale easily — spinning up new environments or isolated setups for specific products without manual work. Each account is fully prepared with required contacts, region restrictions, OIDC integration for CI access, and built-in security tooling like AWS Config, Security Hub, CloudTrail, and GuardDuty.  

**Security from day one**  
FivexL configured centralized logging and threat detection across accounts using AWS CloudTrail, AWS Config, Security Hub, and GuardDuty. Logs are stored in an immutable archive, making it possible to trace and review all activity across environments. AWS Config continuously monitors resource states and helps the team catch misconfigurations early.  
  
**Data protection and backup strategy**  
FivexL set up dedicated backup and encryption accounts to safeguard sensitive data and ensure recoverability. Encryption across environments is managed using centralized AWS KMS keys, following AWS security best practices for sensitive data protection. Automated backups are configured for all environments, with cross-region recovery support where needed — providing a secure and resilient data protection layer.  
  
**Networking built for performance and isolation**  
Continue’s network setup includes shared VPCs with public, private, and database subnets. This structure supports secure communication between services while keeping network management simple.  
  
{{</ case_study/column >}}
{{< case_study/column >}}  
**Compliance made easy**  
To support the company’s SOC 2 Type II compliance goals, FivexL's RightStart implemented audit-friendly defaults from day one. Logging, monitoring, encryption, and access controls were built in, with Terraform-based configuration that can be reviewed and verified during audits.  

**Access management built for teams**  
To simplify secure access, FivexL configured AWS IAM Identity Center (formerly AWS SSO), with everything managed through Terraform code. This approach provides a consistent, version-controlled way to onboard new team members.  
  
FivexL built its open-source tool, FivexL’s Terraform AWS SSO Elevator ([watch the video](https://youtu.be/CrIfaNpuCeY?feature=shared)
), directly into the RightStart setup. The tool enables team members to temporarily elevate permissions using AWS IAM Identity Center and Slack, with fine-grained control and no need to modify long-term roles.  
“It's been really easy to handle permissions. We're not logging in with the root user every time — we just log in with SSO. I probably do that once or twice a day, and it saves me an incredible amount of time. That FivexL's AWS SSO Elevator allows us to be very granular about permissions is also a big deal, especially with compliance in mind.” — Nate Sesti, CTO at Continue.  
### Configuring Elastic Container Service (ECS) for application workloads
To support the launch of Continue’s paid product, FivexL set up Elastic Container Service (ECS) as the foundation for running and scaling application workloads. The goal was to ensure the new SaaS offering would run reliably from day one.
The setup included dedicated networking and workload accounts, with separate environments for development, staging, and production — all defined and managed through Terraform.  
  
FivexL set up CI/CD pipelines to automate infrastructure changes across environments, with Slack used for approvals and alerts. This ensures consistency and gives the startup team clear visibility and control.  
  
With the application running smoothly on ECS and smart integrations like Slack-based approvals and alerts, Continue now has a deployment setup that just works — and is ready to scale without extra effort. 
{{</ case_study/column >}}
{{</ case_study/solution >}}

{{< case_study/section >}}
{{< md >}}![diagram](diagram_continue.png){{</ md >}}
{{</ case_study/section >}}

{{< case_study/benefits
    cta_text="Start Your Success Story"
    cta_url="https://sales.fivexl.io/schedule-a-call"
    image="goto_benefits.png"
    blockquote=`I think FivexL did a really good job of being deliberate, explicit, and highly consistent about the work. From day one, I knew exactly what the goals were, what the scope was, and what to expect — everything was clearly listed and communicated multiple times. And all of it was delivered.<br/> 
<br/>   
    Every morning I’d check our Slack channel and see what was done, what’s next, and what I needed to do. It couldn’t have been easier to interact with FivexL. They were extremely responsive, especially during the critical period leading up to launch. That support made a real difference for us`
    blockquote_author="Nate Sesti, CTO at Continue"
    >}}
{{< pink_heading text="Benefits" >}}
By combining FivexL’s RightStart for AWS with a production-ready ECS setup, the Continue team was able to launch their paid product confidently — without slowing down development or compromising security.<br/>  
Anton, FivexL’s consultant on the project, said:
“The best moment for me was getting a message from the client — during the product launch, everything infrastructure-related went smoothly and perfectly.¨<br/> 
<br/> 
That smooth launch was just the start, the infrastructure built through this collaboration continues to deliver long-term value across several areas.
<br/>
<b>Built for global growth</b><br/> 
The infrastructure was designed to scale across regions, with AWS Global Accelerator ensuring fast, reliable performance worldwide — a strong foundation for global scaling.<br/> 
<br/>
<b>Ready to scale, fast</b> <br/> 
FivexL’s RightStart includes an account factory for Terraform, making it easy to launch new environments or isolated setups for enterprise clients — all fully automated.<br/>
<br/>
<b>Secure by design</b> <br/> 
FivexL’s RightStart for AWS comes with encryption, access controls, centralized logging, and alerting built in. It reduces risk from the start and supports audit readiness for SOC 2 and other compliances.<br/> 
<br/>
<b>Infrastructure they can own</b><br/> 
The Continue team now has a clear, modular setup they can manage and extend independently — using the same Terraform modules FivexL provided. They also received full documentation covering how everything works, making it easier to onboard new team members and evolve the system over time.<br/> 
<br/>
<b>Transparent delivery process</b><br/> 
FivexL delivered the full RightStart for AWS setup in about three weeks. ECS configuration and workload integration followed, with daily Slack updates and regular demos keeping the team in sync throughout the project.<br/> 
<br/> 
{{</ case_study/benefits >}}  


