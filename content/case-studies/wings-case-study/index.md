---
title: 'Wings Case Study'
author_id:
  - 'Ivan Razzhivin'
  - 'Vladimir-Samoylov'
summary: 'FivexL designed and implemented a cost-efficient, scalable, and secure Cloud-based SaaS.'
date: 2023-8-17
author:  Ivan Razzhivin Vladimir-Samoylov 
panel_image: Alex_Vanya.png
authors_heading: 'Two lead consultants for the project'
alt_image: alex_ivan_bnw.png
case_study: true
layout: 'case_study'
tags: ['case study', 'aws']
testimonial: "By developing infrastructure FivexL allows us to focus on our core business: Product development hypothesis testing and roadmap generation."  
testimonial_author: "Steve"
testimonial_author_position: "Founder at Wings"
testimonial_author_portrait: steve.png
testimonial_long: |
  This text will be changed. “Self-sufficiency, a deep understanding of our needs, a result-oriented approach, and the delivery of a working solution within a short timeframe – all these factors make FivexL a team of professionals.”
about_company:
  logo: 'apple.png'
  heading: 'About Wings'
  text: |
    Wings is a fintech startup that addresses the challenges of online payments. They have developed a smart Expense Management service for corporate clients, enabling the issuance of virtual bank cards. Wings embarked on a journey to launch their MVP (Minimum Viable Product) to validate their unique business proposition. The initial infrastructure in AWS was built in-house by the Wings team. However, as the idea proved its viability, the need for a more robust and scalable infrastructure became evident.
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
The first iteration of the infrastructure was built by the Wings team using a monolithic approach with the help of Elastic Beanstalk. While this allowed the team to launch the MVP quickly, it posed challenges for product modifications and scalability. Economically, this approach was not sustainable. It led to the creation of separate instances for each new client, consuming significant Amazon resources and resulting in high infrastructure costs.<br/> 
<br/>  
Recognizing the limitations of the monolithic architecture, Wings decided to seek experts to transition towards a microservice multi-tenant architecture. This architecture allows companies to save money on infrastructure costs by using the same hardware resources for several instances of the same application for multiple tenants.<br/>
<br/>  
Moreover, the startup faced difficulties accessing their Amazon account. Despite seeking solutions on various platforms and in AWS specialist communities, no one was willing to address this issue.<br/>  
<br/>An expert from FivexL responded to Wings' plea for help. The founder of Wings recalls, "We were impressed by how quickly and freely the FivexL specialist assisted us. It became clear that they were experts in their field and could be trusted to build a scalable and secure infrastructure that would meet not only our current needs but also future challenges."  
{{</ case_study/challenge >}}
 
{{< case_study/solution heading="Solution" >}}
{{< case_study/column >}}
This text will be changed. Qameta received Allure TestOps Cloud – an architected solution based on the on-prem Allure TestOps software – in time. To minimize in-house development, therefore, further maintenance, FivexL used as many ready-to-use components and managed services as possible. Artem Eroshenko said: “By developing infrastructure, FivexL allowed us to focus on our core business: product development, hypothesis testing, feedback collection from real users, and roadmap generation.”  
FivexL engaged in the project two of its AWS Solutions Architects. Firstly, Ivan Razzhivin built an MVP and Serverless API that allowed it to launch environments with a single click. To create and control specific client resources in a cloud provider from the EKS cluster, Crossplane (dynamic resources controller) and ArgoCD were used. As a result, Allure TestOps evolved from Kubernetes helm charts to a cloud-based SaaS offering.   
After Stage 1, Qameta released a Beta-version to test it on real users.
The prototype functioned well and was in demand, which led to Stage 2 – a full-fledged product launch. FivexL involved a second consultant – Alexey Eremin – who integrated monitoring features to prevent possible incidents with a massive flow of users.
{{</ case_study/column >}}
{{< case_study/column >}}
He incorporated an alerting stack in AWS Managed Grafana, Betteruptime, Prometheus, and Cloud Watch and created a new, improved API version to manage client environments.  
As with many small teams, Qameta aimed to control prices and optimize budget allocation. The startup Co-Founder recalls: “We valued flexibility, cost-controlled cloud services to meet the MVP testing budget and the self-sufficiency of vendors.”  
To adhere to the budget limits, FivexL implemented an elastic and robust configuration that allowed to leverage shared resources to maximize agility and minimize costs. As a result, the client’s costs decreased by 40%, which is cheaper compared to Digital Ocean compute offerings.  
FivexL transferred knowledge and best practices on the implemented AWS infrastructure to Qameta’s engineer.<br/> 
<br/>   
[Qameta launched](https://qameta.io/blog/allure-testops-cloud-is-generally-available-to-all-dev-teams/) a fully-fledged solution in July 2022. Many clients waited in line to use the Allure TestOps Cloud.   
It was a major success! The number of clients grew rapidly.
 {{</ case_study/column >}}
{{</ case_study/solution >}} 

{{< case_study/benefits
    cta_text="Start Your Success Story"
    cta_url="https://sales.fivexl.io/schedule-a-call"
    image="qameta_benefits.png"
    >}}
{{< pink_heading text="Benefits" >}}
This text will be changed. “FivexL heavily supported us in launching a Cloud Allure TestOps version. Self-sufficiency, a deep understanding of our needs, a result-oriented approach, and the delivery of a working solution within a short timeframe – all these factors make FivexL a team of professionals”, says Artem Eroshenko, co-founder and CPO at Qameta Software.<br/>
<br/>    
The product is easy to maintain, scale, and develop thanks to the infrastructure implemented as a code. This also allows Terraform specifications to be used as documentation and facilitates knowledge transfer across the team. Aligned teamwork allowed Qameta to launch a performant MVP that delivers on time.<br/>
<br/>  
“After a successful MVP launch, FivexL and us continued providing maintenance and optimizing cloud services” recalls the Qameta Co-founder Artem Eroshenko. 
{{</ case_study/benefits >}}

