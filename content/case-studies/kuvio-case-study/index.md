---
title: 'Case Study: AWS Foundation for Kuvio'
author_id: 'Andrey Devyatkin'
summary: 'FivexL built a high-performing, production-ready, and secure infrastructure defined in code for a Swedish startup.'
date: 2023-12-14
author: Andrey Devyatkin
panel_image: ovrture1.png
authors_heading: 'Principal consultant leading the project'
alt_image: vova_sm_bnw.png
case_study: true
layout: 'case_study'
tags: ['case study', 'AWS']
testimonial: 'With the new scalable infrastructure in place, we have been able to develop a range of new features for our product.'
testimonial_author: 'Henrik Segersven'
testimonial_author_position: 'CTO at Kuvio'
testimonial_author_portrait: Henrik.png
testimonial_cta_url: 'https://sales.fivexl.io/schedule-a-call'
testimonial_long: |
  “With the new scalable infrastructure in place, we've been able to develop a range of new features for our product. It's not just about having a scalable system; it's about providing a reliable service that our clients can trust. Achieving 100% uptime reinforces that trust and enhances our ability to effectively sell our service.”
about_company:
  logo: 'kuvio_logo.png'
  heading: 'About Kuvio'
  text: |
    Kuvio is a dynamic startup from Stockholm, Sweden, offering a SaaS platform for Marketing Data Activation tailored to the retail e-commerce industry.  
    The platform provides actionable data insights, audience segmentation, and profit optimization services, enabling e-commerce businesses to make informed decisions and improve outcomes.  
    Kuvio's platform is designed for easy deployment without the need for developer assistance from the client's side, ensuring it's accessible and efficient for all users.
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
{{< case_study/challenge  image="challenge_kuvio.png" >}}
{{< pink_heading text="Challenge"  sizes="bigger">}} 
Kuvio built its MVP and successfully validated its market-product fit. They were looking for a partner who could take their MPV AWS infrastructure and take it to production-grade level, ensuring availability, high performance, elastic scaling, and self-healing.<br/>
<br/>  
Henrik Segersven, the CTO of Kuvio, reflects on the outset of our partnership: "Our partner Dev Stark, with whom we still work, recommended FivexL to us; it was a perfect recommendation. Prior experiences taught us the importance of working with trustworthy and competent partners."<br/>
<br/>  
Initially, Kuvio's system was based on AWS Lightsail, and there were serious concerns about its scalability. The scaling process involved the manual provision of additional LightSail instances; there were issues with database performance and networking decisions that would be very costly to rework later on. At this crucial time, as Kuvio anticipated onboarding a major corporate client, there were worries that their system might not withstand the increased workload. The capacity to handle significant traffic was uncertain.<br/>
<br/>  
Henrik Segersven, CTO of Kuvio, states: "Our commitment to ensuring 100% availability is non-negotiable, especially given the critical role our service plays in large corporations' marketing campaigns. Any downtime leads to irreplaceable data loss, which is simply unacceptable in our field. Before partnering with FivexL, achieving consistent uptime was a challenge. However, since our collaboration, we've proudly maintained an unbroken uptime record of over 400 days." 
{{</ case_study/challenge >}}

{{< case_study/solution heading="Solution" >}}
{{< case_study/column >}}
Andrey Devyatkin, co-founder and principal consultant at FivexL, led this project. The primary task was to enable the startup to grow and increase the number of customers, which required an elastic and scalable infrastructure.<br/>  
Henrik Segersven, CTO of Kuvio, reflects, "Before FivexL, our product faced scalability and stability issues. Their solutions not only eradicated these problems but also enabled us to sell our service and expand our client base significantly".<br/>  
FivexL adheres to the AWS Well-Architected Framework, focusing on its six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. That is why FivexL proactively included cost optimization and security objectives, even though they were not explicitly requested, ensuring a comprehensive infrastructure setup.<br/>  
<br/>  
**Scalability**<br/>  
The migration from Lightsail to AWS ECS (Amazon Elastic Container Service) marked a pivotal change for Kuvio. FivexL utilized AWS ECS on Fargate, a powerful combination of Amazon's container orchestration service and a serverless compute engine, which simplified the management and deployment of containerized applications. This shift to Fargate brought several critical advantages for the startup: it significantly reduced the need for maintenance, as AWS handled security and upkeep, and there was no requirement for patching virtual machines. This streamlined operations and enhanced overall efficiency.  
Through their partnership with FivexL, Kuvio developed a scalable, robust infrastructure, now fully defined as code using Terraform. Their API efficiently auto-scales to meet demand with predictable bandwidth and self-healing capabilities, enabling the business to plan client onboarding and extend its client base without concerns about system reliability. The database setup underwent a significant update: it was reconfigured using Terraform, right-scaled for the load, and moved from the default VPC to a new, more secure network without internet access.  
The API's infrastructure, being entirely defined in code, provides flexibility for replication or restoration from scratch, which is essential for expanding into new regions or for swift disaster recovery and business continuity. This setup also facilitates collaborative work through pull requests and maintains a history of changes for auditing purposes.<br/>  
<br/>  

 
{{</ case_study/column >}}
{{< case_study/column >}}
**Developer productivity**<br/>  
Developers saw a boost in productivity following FivexL's implementation of automated Continuous Integration and Continuous Deployment (CI/CD) pipelines for container building, testing, and deployment. Andrey Devyatkin implemented alerting on production issues, enabling developers to address and resolve any arising challenges quickly. Developers received easy access to all metrics/logs they needed, along with the availability of a separate environment for experiments and testing. So the Kuvio team can focus on developing new business capabilities.  

**Security**  
Kuvio received AWS infrastructure with all essential security controls implemented. Andrey Devyatkin set up an AWS Organization, separating production and development into different accounts. FivexL also implemented AWS CloudTrail and CloudTrail to Slack, alerting for suspicious activity alerts, along with AWS GuardDuty for intrusion detection. Service Control policies were configured to guard against common security threats.  
In addition, FivexL integrated AWS Config and AWS Security Hub to enhance Kuvio's security posture management. AWS Config provided Kuvio with a way to assess, audit, and evaluate the configurations of their resources, ensuring compliance and governance. AWS Security Hub offered a unified view of its security alerts and security posture, making it easier for the startup to manage its security strategy and respond promptly to potential threats.<br/>   
<br/>  
**Cost optimization**  
The FivexL team understands that startups often operate with limited resources. Their consultants consistently focus on building cost-effective solutions as well as optimizing cloud spending for existing resources. For Kuvio, FivexL utilized savings plans for Fargate and reserved instances for RDS, along with the automated removal of unused resources, to achieve cost efficiency.
Additionally, Andrey Devyatkin configured budget and cost anomaly detection alerts and proactively monitored the infrastructure costs, making adjustments where possible to ensure continued efficiency.  
FivexL also educated Kuvio's developers about more cost-optimal solutions, equipping them with the knowledge to maintain cost-effectiveness in their ongoing operations.

{{</ case_study/column >}}
{{</ case_study/solution >}}

{{< case_study/benefits
    cta_text="Start Your Success Story"
    cta_url="https://sales.fivexl.io/schedule-a-call"
    image="kuvio_benefits.png"
    >}}
{{< pink_heading text="Benefits" >}}
With a high-performing, production-ready, and secure infrastructure built by FivexL, Kuvio has confidently expanded its operations.<br/>  
<br/>  
The concerns that once shadowed their growth potential—scalability, infrastructure stability, and the ability to handle increased workloads—have been effectively resolved by FivexL. Load tests have revealed that the system is capable of handling increased traffic, providing Kuvio with the assurance needed to support their continued growth and success. This transformation has enabled Kuvio to shift its focus from navigating technical challenges to embracing opportunities for growth and innovation. Freed from the complexities of infrastructure management, the team can now fully engage in what they excel at - driving their business forward.<br/>  
<br/>   
Today, Kuvio's achievements include great success in Sweden and recognition as a Finalist for Best Software Innovation in the 2022 European Search Awards.
Henrik Segersven concludes, "Our product was somewhat unstable before we collaborated with FivexL. FivexL resolved these issues, providing a significant upgrade that has been beneficial for us. This improvement allowed us to sell more effectively, as we were previously limited by scalability issues. Clearly, this improvement is also reflected in our revenue growth."<br/>  
<br/>  
The collaboration between Kuvio and FivexL did not end there; it continued in a new format - a retainer agreement.

{{</ case_study/benefits >}}
