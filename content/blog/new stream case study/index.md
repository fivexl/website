---
title: 'New Stream Case Study'
author_id:
  - 'Artem Zhelezov'
  - 'Maria Zubchenko'
summary: 'FivexL built a scalable and secure infrastructure defined in code for a Mobile Computer Vision & AI solutions software company.'
date: 2023-03-16
author:  Artem Zhelezov Maria Zubchenko 
panel_image: new_stream.png
alt_image: quote_new_stream.png
case_study: true
tags: ['case study', 'aws']
---
## “FivexL built a scalable and secure infrastructure defined in code for a Mobile Computer Vision & AI solutions software company.”  
**Two lead consultants for the project**  
**[Artem Zhelezov](https://fivexl.io/author/artem-zhelezov/) & [Maria Zubchenko](https://fivexl.io/author/maria-zubchenko/)**  
  
{{< image src="new_stream_cloud.png" alt="How to save" width="70%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  

  
**Challenge**  
The startup started development with a focus on golf. "There were 18 cameras on the golf course, which were connected to the server, where everything was processed via fiber optics," recalls the CTO of New Stream, Andrey Kolpakov. New Stream built a hybrid infrastructure, meaning it was partially built on the hardware-based servers in the fields, and the other part was on virtual servers at Digital Ocean.  
"The endpoint at that time was unknown, but we wanted to set up the infrastructure so that it could be quickly deployed, supported, monitored, and scaled up," says Andrey Kolpakov. While FivexL was working on the project, the startup pivoted in several ways: remote personal training replaced golf during the pandemic, and the team added a new sport a year later - basketball with match analytics. New products and their changing needs required a dynamic approach to infrastructure.   
  
**Solution**  
FivexL built a scalable, secure, and elastic infrastructure to keep the Newstream SDK running fast. On FivexL's side, there were two cloud engineering consultants involved - Artem Zhelezov and Maria Zubchenko.
Here is what CTO of New Stream, Andrey Kolpakov, says about the beginning stages of working with FivexL: "The first task was to evaluate the existing infrastructure. Then FivexL suggested a few options, we eventually decided to go with AWS, and we started creating the new infrastructure."  
The work was planned in several iterations.  
The first solution was a hybrid cloud: AWS + on-demand servers. The hybrid cloud itself went through several iterations - the initial version was built around HashiCorp Consul and Nomad. But as ECS Anywhere came into the picture, the infrastructure fully migrated to AWS ECS, which reduced the number of the self-hosted services and thus reduced the operators' workloads.  
In the meantime, CI/CD was set up with GitLab runners operating on Amazon to automate application delivery. All the services that were running on Amazon were defined as code using Terraform. The infrastructure became immutable, with the only remaining issues being fault tolerance and scalability, as servers in the private datacenter were at risk of physical impact - power outages, video card issues, etc.  
To address the lack of resilience, the team began migrating to GPU Instances at AWS.  
Another important consideration for any startup building a product based on resource-intensive Computer Vision and AI is cost optimization. The FivexL team and New Stream worked hard to reduce cloud costs. A custom auto-scaling based on a processing queue was implemented to eliminate underutilization of expensive cloud GPU Instances. This engaged servers only for processing tasks, which helped avoid overpaying for idle resources. Further cost analysis showed that computing resources for video transcoding were a significant expense. Transcoding operations and video storage were offloaded to the Vimeo service to lower overall costs significantly. Finally, replacement of the self-hosted Redis cluster with AWS SQS allowed for better resiliency and additional cost savings. As a result, the cloud cost went down by 40%.  
The team also improved overall infrastructure security by separating AWS accounts, introducing IDS, migrating to temporary keys via AWS SSO, and providing role-based access for developers.  

**Benefits**  
FivexL's flexibility and ability to come up with unique solutions and build scalable infrastructure help businesses make pivots in search of their niche.  
The CTO of New Stream says, "As our needs and product changed and as we moved from golf to basketball and then to workouts, FivexL remained flexible and fully involved in the project, practically becoming the member of our own team. Now the entire infrastructure for the project is set up, we have migrated to the cloud, implemented autoscaling, and distributed everything that was needed among services. As a result, the system is operating stable."  
New Stream gained a secure, scalable infrastructure defined in code, and it's ready for further product development.  
"It's important to note not only the technical skills of cloud engineering consultants Maria and Artem but also their soft skills. It was a pleasure to work with them. They proved to be responsible professionals who could explain or describe anything, as well as document anything that needed more information. This is a big advantage of working with FivexL!" Andrey Kolpakov said.




