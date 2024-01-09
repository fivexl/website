---
title: 'Kuvio Retainer Agreement Case Study'
author_id:
  - 'Andrey Devyatkin'
  - 'Alexey Eremin' 
summary: 'Cost-efficient solution for Swedish startup: a retainer agreement with a consultant available part-time to cover base infrastructure support needs and provide ongoing technical guidance.'
date: 2023-12-16
author:  Andrey Devyatkin Alexey Eremin
panel_image: Artem_gradient.png
authors_heading: 'Two lead consultants for the project'
alt_image: artem_small.png
case_study: true
layout: 'case_study'
tags: ['case study', 'aws']
testimonial: 'It is great for us that FivexL can align with our working style without needing to be in the same location'  
testimonial_author: 'Henrik Segersven'
testimonial_author_position: 'CTO at Kuvio'
testimonial_author_portrait: Henrik.png
testimonial_cta_url: 'https://sales.fivexl.io/schedule-a-call'
testimonial_long: |
  “The predictability is key for us. Knowing the costs for the upcoming month simplifies our budgeting process significantly. The retainer setup just works well for us. It aligns with our workflow, and we actually find that we work more effectively under this model. It's straightforward and efficient.”
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
{{< case_study/challenge  image="challenge_ns.png" image_css="object-position: center 10%">}}
{{< pink_heading text="Challenge"  sizes="bigger">}}
In the dynamic world of startups, the journey often begins with the hustle of building an MVP, discovering the right market fit, and preparing the system for scaling—a stage where the hands-on involvement of an infrastructure engineer is crucial.  
However, their needs evolve as startups transition into a phase focused on boosting sales and securing investments. The necessity for a full-time infra engineer becomes a balancing act—vital for maintaining advanced tech and expertise, yet potentially excessive in cost. This is a common pivot point for many startups.
Kuvio experienced these stages. After an intense period of collaboration in which FivexL developed a high-performance, secure, and production-ready infrastructure within six months, Kuvio reached a point where the same level of intensive engagement was no longer necessary.  
Opting to maintain its agility as a small, dynamic team, Kuvio steered away from hiring a full-time DevOps engineer—a decision driven by both cost efficiency and effective resource management. They needed a flexible solution that would meet their new requirements.
{{</ case_study/challenge >}}
  
{{< case_study/solution heading="Solution" >}}
{{< case_study/column >}}
FivexL, with its deep insights into the startup needs, offers a cost-efficient solution for Kuvio: a retainer agreement with a consultant available part-time to cover base infrastructure support needs and provide ongoing technical guidance.  
This model is especially beneficial for startups during their scaling phase. As they encounter rapid 'Hockey stick' growth and venture into new markets, they can effortlessly transition from retainer to full-time engagement to address scaling needs. This ensures problem-free growth and a deep and consistent understanding of the infrastructure's design and the strategic reasoning behind it.  
  
Under the guidance of [Andrey Devyatkin](https://fivexl.io/author/andrey-devyatkin/), co-founder and principal consultant at FivexL, with the expertise of certified AWS architects [Ivan Razzhivin](https://fivexl.io/author/ivan-razzhivin/) and [Alexey Eremin](https://fivexl.io/author/alexey-eremin/) FivexL actively extended its support to Kuvio under the retainer agreement, taking proactive steps beyond the initial scope of support. This time was used to implement critical updates and innovations to the infrastructure, ensuring Kuvio remained technologically advanced and well-equipped to achieve its business objectives.  
  
**Serverless Solutions and ETL Processes**
Kuvio encountered limits with their existing relational database setup. To resolve this, they shifted to using S3 object storage as a database, with Athena implemented on top for SQL querying capabilities. This change effectively allowed the system to function like a traditional database while offering enhanced scalability and cost efficiency of the data storage layer. FivexL assisted Kuvio’s developers in making these infrastructure changes.  
  
**Cost optimization in a serverless environment**
Through the initiative and expertise of [Alexey Eremin](https://fivexl.io/author/alexey-eremin/), a certified AWS architect from FivexL, Kuvio experienced a remarkable breakthrough in cost optimization: a 96% reduction in S3 bucket costs, leading to a significant decrease in overall cloud expenses.  
Despite the benefits of serverless computing, a common challenge is that costs often exceed expectations. Recognizing this issue, Alexey Eremin devised a unique approach to analyze and optimize Athena's queries, allowing developers to identify and optimize queries that would generate excessive S3 API calls and thus drive costs.  
  
{{</ case_study/column >}}
{{< case_study/column >}}
Kuvio experienced a remarkable breakthrough in cost optimization: a 96% reduction in S3 API request costs, leading to a significant decrease in overall cloud expenses. With Kuvio handling substantial volumes of data, Alexey delved into the company's specific business requirements. He conducted experiments with diverse partitioning techniques to identify the most cost-effective model.  
  
Alexey explored the capabilities of Apache Iceberg, a tool that enables Athena to utilize SQL to gather data from S3. He leveraged Iceberg's functionality to merge files and conducted experiments to determine the optimal file merging level. One particularly effective experiment led to the remarkable 96% cost reduction in the S3 bucket, significantly impacting Kuvio's overall cloud expenses. Alexey Eremin detailed his approach in an article.  
  
**Enhancing Scalability with Migration to AWS Batch**  
[Ivan Razzhivin](https://fivexl.io/author/ivan-razzhivin/), a certified AWS architect from FivexL, aided Kuvio in migrating to AWS Batch. This move allowed for greater scalability and the ability to implement solutions beyond Lambda's capabilities due to its service limits. AWS Batch offered the necessary flexibility for more complex processing needs.  
  
**Continuous Integration and Delivery (CI/CD) improvement**
To streamline application development and deployment, Ivan Razzhivin optimized Kuvio's CI/CD pipeline, focusing on its reusability. 
He created reusable templates for application building and deployment, reducing the need for continuous maintenance. This redesign allowed for centralized updates that could be rolled out across all pipelines, simplifying the process for Kuvio's developers, who could then use these templates as an easily adaptable internal tool. This streamlined process reduced development time and improved overall productivity.  
  
**Security Enhancements**
To strengthen security measures further, [Ivan Razzhivin](https://fivexl.io/author/ivan-razzhivin/) implemented code and image scanning automation to detect and remediate vulnerabilities in Kuvio's applications and systems. This proactive approach ensured that Kuvio's infrastructure remained protected from potential security breaches.
  
{{</ case_study/column >}}
{{</ case_study/solution >}}

{{< case_study/benefits
    cta_text="Start Your Success Story"
    cta_url="https://sales.fivexl.io/schedule-a-call"
    image="benefits_ns.png"
    >}}
{{< pink_heading text="Benefits" >}}
Kuvio's collaboration with FivexL under the retainer agreement has brought about significant benefits, including increased flexibility, cost savings, and enhanced infrastructure capabilities. This cost-effective arrangement provides Kuvio with access to FivexL's expertise on an as-needed basis, aligning perfectly with their evolving needs.  
The technical solutions implemented by FivexL have addressed Kuvio's immediate challenges and set a foundation for sustainable growth. The shift to serverless solutions and the migration to AWS Batch has allowed Kuvio to scale their operations effortlessly. The innovative approaches to cost optimization in serverless environments reduced cloud costs and showed the potential for further slashes. The enhancements in Kuvio’s CI/CD pipeline and security have strengthened their overall infrastructure and allowed the Kuvio team to focus on their core business activities.  
"It's great for us that FivexL can align with our working style without needing to be in the same location. Our team is spread across different locations, from Stockholm to Eastern Europe and Taipei. FivexL's team, based in Canarias islands and other locations, fits into our dispersed culture," remarks Henrik Segersven, emphasizing the value of FivexL's ability to adapt to Kuvio's remote team.  
The ability to scale support resources on an as-needed basis aligns with the dynamic nature of startups, while the cost savings achieved through optimization efforts further enhance the overall value proposition.  
The retainer agreement has enabled Kuvio to allocate resources more effectively, ensuring they have the expertise when needed without the burden of maintaining a full-time infrastructure engineer. This flexibility has empowered Kuvio to focus on their core business objectives and drive innovation while FivexL seamlessly handles infrastructure management.

{{</ case_study/benefits >}}
