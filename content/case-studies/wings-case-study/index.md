---
title: 'Wings Case Study'
author_id:
  - 'Ivan Razzhivin'
  - 'Vladimir-Samoylov'
summary: 'FivexL built a scalable and secure infrastructure in AWS from the ground up in just 3 months for a smart expense management service.'
date: 2023-08-17 
author:  Ivan Razzhivin Vladimir-Samoylov 
panel_image: Artboard.png
authors_heading: 'Project Success: Managed by Vladimir Samoylov, Architected by Ivan Razzhivin'
alt_image: wings_bnw.png
case_study: true
layout: 'case_study'
tags: ['case study', 'aws']
testimonial: "By developing infrastructure FivexL allows us to focus on our core business: Product development hypothesis testing and roadmap generation."  
testimonial_author: "Steve"
testimonial_author_position: "Founder at Wings"
testimonial_author_portrait: steve.png
testimonial_long: |
  "I'm genuinely amazed by the transformative impact FivexL has had on our team's workflow. In three months, with expertly configured AWS Organization, access control, and streamlined launches of multiple applications via AWS ECS, we've established a solid foundation for our future growth. This implementation has empowered our development team to focus on innovation and rapid iteration."
about_company:
  logo: 'apple.png'
  heading: 'About Wings'
  text: |
    Wings is a fintech startup that addresses the challenges of online payments. They have developed a smart expense anagement service for corporate clients, enabling the issuance of virtual bank cards. The acquaintance between Wings and FivexL began with a problem the startup faced. They lost access to their AWS account and sought help on various platforms and in AWS specialist communities. Confused by responses like 'nothing can be done' and faced with costly, risky proposals, the team was worried they had lost access to their data. FivexL senior consultant Vladimir, after reading about the startup's issues, quickly understood the problem and, on a volunteer basis, helped Wings regain access in just 20 minutes. This marked the beginning of a successful collaboration.
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
{{< case_study/challenge  image="challenge_q.png" image_css="object-position: 18%" >}}
{{< pink_heading text="Challenge"  sizes="bigger">}}
Wings embarked on a journey to launch their MVP (Minimum Viable Product) to validate their unique business proposition. The initial infrastructure in AWS was built in-house by the Wings team. However, as the idea proved its viability, the need for a more robust and scalable infrastructure became evident.<br/>  
<br/> 
The first iteration of the application was built by the Wings team using a monolithic approach with the help of Elastic Beanstalk. While this allowed the team to launch the MVP quickly, it posed challenges for product modifications and scalability. Economically, this approach was not sustainable. It led to the creation of separate instances for each new client, consuming significant Amazon resources and resulting in high infrastructure costs.<br/> 
<br/>  
Recognizing the limitations of the monolithic architecture, Wings decided to engage experts to transition towards a microservice multi-tenant architecture. This architecture allows companies to save money on infrastructure costs by using the same hardware resources for several instances of the same application for multiple tenants.<br/>
<br/>  
 The founder of Wings recalls, "We were impressed by how quickly and freely the FivexL specialist assisted us. It became clear that they were experts in their field and could be trusted to build a scalable and secure infrastructure that would meet not only our current needs but also future challenges."  
{{</ case_study/challenge >}}
 
{{< case_study/solution heading="Solution" >}}
{{< case_study/column >}}
Even when a startup is at the very beginning of its journey, FivexL treats it as a future breakthrough. FivexL establishes a solid base for the upcoming thousands of users and the challenges associated with growth, layering one foundation upon another: AWS Organization, Amazon ECS, Terraform, Availability, Monitoring, and Security.  
Work on the Wings project proceeded through these stages.
<br/>  

**Set Up AWS Organization**<br/>  
To prevent future issues with lost access to AWS and to centrally manage and govern the AWS environment during growth and scaling, FivexL established an AWS organization. This foundational step is crucial for ensuring the safety and stable evolution of the product. AWS Organization was configured according to best practices, and security measures like [AWS CloudTrail](https://fivexl.io/blog/what-is-aws-cloudtrail/) and GuardDuty were set up.
To foster efficiency and transparency, FivexL set up daily sync/demo/backlog review calls and Kanban board for tasks tracking.<br/>

**First App - Establishing a Microservices Platform**<br/>   
At this stage FivexL empowered Wings developers to build and deploy applications with enhanced security features in a fast, standardized, compliant, and cost-efficient manner using Amazon Elastic Container Service (Amazon ECS).
FivexL consultants sep up a microservices platform for Wings that simplifies deployment, management, and scaling of containerized applications.  They also created a Dockerfile and launched the first application within the ECS cluster.<br/>  

**Infrastructure as Code**<br/>  
FivexL adopts a DevOps-centric approach to infrastructure, treating it the same way developers handle code. 

{{</ case_study/column >}}
{{< case_study/column >}}
Utilizing Terraform’s open-source IaC tool and community-driven modules, FivexL created Wings’ infrastructure for both speed and reliability.  This standardization not only minimizes manual tasks and human error but also speeds up infrastructure development process. The adoption of high-quality community standards also ensures that the infrastructure is easily understandable, making for a smoother transition for any future engineers on the project. <br/> 

**Availability and Monitoring**  
FivexL sped up client traffic to microservices by enabling AWS Global Accelerator. A concerted effort was made to enhance the productivity of developers through tools like X-Ray and various alerting mechanisms, customized log streaming, ECS features and metrics.  
Having key metrics, log data, analytics, and user interactions at hand, the team gains the ability to speed up the debugging process and minimize the average time needed for issue resolution.<br/>

**Security**  
To protect the system from the most frequent types of cyberattacks, FivexL configured WAF allow-list and OWASP top 10 rules for WAF. Beyond these, FivexL implemented a range of [security features](https://fivexl.io/blog/security-basics-in-aws/) (AWS Config, IAM Access analyzers, automated encryption, and Security Hub) and hardened containers. After that, FivexL equipped the Wings team with basic security training.<br/>   
{{</ case_study/column >}}
{{</ case_study/solution >}} 

{{< case_study/section >}}
{{< md >}}![diagram](Foundation.png){{</ md >}}
{{</ case_study/section >}}

{{< case_study/benefits
    cta_text="Start Your Success Story"
    cta_url="https://sales.fivexl.io/schedule-a-call"
    image="quote_wings.png"
    >}}
{{< pink_heading text="Benefits" >}}
The FivexL collective experience enabled setting up of a solid infrastructure foundation from scratch in just 2-3 months, compared to the typical year required by a single in-house specialist. Assuming that the specialist has a deep understanding of AWS and has experience building AWS Organisations that would scale over time. Otherwise, such setup might take even longer.<br/>  
<br/>  
Through collaboration with FivexL, Wings benefited from a novel approach to infrastructure. This granted Wings the flexibility to manage all resources via code, enhancing the system's security, predictability, and rapid scalability. The team can now easily gather metrics, view statistics, and make updates or changes with greater convenience.<br/>
<br/>
FivexL adheres to advanced industry standards and provides recorded demos explaining decision-making logic and system operation principles. This ensures a seamless transition when another professional joins the Wings team for continued system development.<br/>
<br/>
Steve, from Wings, reflected on the experience: "With FivexL, we saw predictable results and finished the project earlier than expected."<br/> 
<br/>



{{</ case_study/benefits >}}

