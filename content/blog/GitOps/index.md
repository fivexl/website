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
