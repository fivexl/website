---
title: 'How GitOps Helped a Startup Scale an On-Premise Solution to SaaS'
author_id: 'Ivan Razzhivin'
summary: 'FivexL successfully helped a startup scale its on-premise solution to SaaS with GitOps instead of the traditional Kubernetes approach.'
date: 2022-10-31
author: Ivan Razzhivin
panel_image: Gitops.png
tags: ['AWS', 'GitOps','Kubernetes']
---
FivexL successfully helped a startup scale its on-premise solution to SaaS with GitOps instead of the traditional Kubernetes approach. This allowed us to deliver cost-effective product testing with minimum human resources (since the majority of the workload was delegated to a cloud provider). In this article, we will review the case and show how to implement such a solution. 
### Input Data 
The Client’s needed:  
* To scale their on-premise product to SaaS and deploy it through helm chart  
* To create dynamic environments that can be run with one click (for clients and developers)  
* To have a scalable infrastructure that ensures stability and fits the client’s budget  
* Our approach is to think of infrastructure as code. We consider machinery as a working unit that can be deleted or re-created at any time. 
### Our Solution
Here are the four key stacks of the proposed solution:  
* **EKS** (Cluster)  
* **ArgoCD** (GitOps controller). Kube STL apply alternative that allows you to transfer the environment to a cluster in an automated, simple, and easy-to-check manner  
* **Crossplane** (Dynamic resources controller). Allows you to deploy services in a cloud provider through Kubernetes. You can deploy resources using a YAML file that describes any resource created with AWS API. Here is a Crossplane example as part of a helm chart - tech that allows you to create templates for YAML files and send variables to them that differ from environment to environment.  
{{< image src="g1.png" alt="AWS S3 bucket" width="50%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
*The YAML file describes a resource that will be created in AWS S3 Bucket. To estimate the cost of a specific namespace and client, use tags.*  
* **AWS Lambda** (Dynamic environment management via API). 
* **AWS Managed Services.** Offers numerous ready-to-use services, security tools, and affordability - for example, if you know the recipe “reserved instance + pod instance,” the cost is lower than in Digital Ocean.  
### Why Use GitOps and ArgoCD?  
GitOps facilitates the deployment of new apps and updates of existing ones. Its core idea is to rely on declarative manifests of environments with version control. Basically, the process begins in a Git repository with YAML files that describe the desired Kubernetes state. A GitOps operator monitors the state both in Git and Kubernetes, compares them, and edits the latter if necessary. That’s exactly what ArgoCD does.  
The controller can be triggered by a variety of events. If you set up webhooks in a repo, it will turn to ArgoCD every time a pool request completes. That’s how ArgoCD automatically carries out synchronization. It can also be triggered by a time-out or initiated manually. Here’s an example of an app manifest for ArgoCD to read:
{{< image src="2g.png" alt="AWS S3 bucket" width="50%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}} 



