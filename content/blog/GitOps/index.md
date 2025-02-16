---
title: 'How GitOps Helped a Startup Scale an On-Premise Solution to SaaS'
author_id: 'Ivan Razzhivin'
summary: 'look at Spot Instance allocation strategies and see how you can use the Terraform module with no issues and save money at the same time.'
date: 2024-10-31
author: Ivan Razzhivin
panel_image: new_image.png
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
{{< image src="2g.png" alt="ArgoCD" width="50%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
Before GitOps, the environments were delivered to a cluster through CI/CD, there was no drift control, and all the specifications were stored in Git.  
### How Does the ArgoCD Solution Work?  
Here is the proposed architecture:  
{{< image src="g3.png" alt="Architecture" width="50%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
* The apps (clients) in Kubernetes communicate with external services like Redis, S3, DB, and others.
* To deliver new clients to the cluster, we place YAML files into the GitOps repository. The YAML files describe the manifest.
* A repository’s webhook triggers ArgoCD.
ArgoCD detects changes, compares the states, and creates a new environment. 
* Crossplane creates dynamic resources like the S3 bucket, roles, and policies for the client. 
* The app is transferred through the container registry - an AWS analog for GitHub. 
* CI/CD is implemented on GitHub Actions.  
Here is how environments are brought up in a click. It features a line of Lambdas:  
{{< image src="g4.png" alt="Lambda" width="50%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
* A user leaves a request via a landing to order an environment.
The first Lambda generates a client license key.
* The second Lambda creates a manifest and stores it in a Git repo. 
* The third Lambda carries out a health check: it tries to reach the environment’s endpoint and waits for it to rejuvenate. Once it’s done, a webhook is sent to a progressor. Then, the endpoint and default credentials are transferred. 
* The user receives an email with the data.  
### How We Implemented the Solution With Kubernetes and GitOps 
Let’s set up a demo infrastructure in Amazon with Terraform. We have VPC, EKS (Kubernetes as AWS knows it), a basic cluster on two nodes, and Ingress – nginx, policies. When we deploy ArgoCD, it will be done through a helm chart.  
### The Kubernetes Approach in Practice
Here’s a demo application that deploys an image and a service that manages traffic on a pod.  
```hcl
{{- if empty .Values.env.open.BLOBSTORAGE_S3_BUCKET -}}
{{- $s3_hash := .Release.Namespace | b64enc | lower | trimAll "=" }}
{{- $s3_name := print "production-" $s3_hash }}
apiVersion: s3.aws.crossplane.io/v1beta1
kind: Bucket
metadata:
  name: {{ $s3_name }}
spec:
  deletionPolicy: Orphan
  forProvider:
    locationConstraint: eu-central-1
    acl: private
    versioningConfiguration:
              status: Enabled
    serverSideEncryptionConfiguration:
      rules:
        - applyServerSideEncryptionByDefault:
            sseAlgorithm: AES256
    tagging:
              tagSet: 
                - key: kubernetes_namespace
                  value: {{ .Release.Namespace }}
  providerConfigRef:
    name: aws-provider
  providerRef:
    name: provider-aws
{{- end -}}
```   
We used **kubectl apply -f banana.yaml** to deploy an app: a pod transfers to Kuber, and a pod appears in a default namespace.  
### The GitOps (ArgoCD) Approach in Practice
To deploy an app into a cluster and port-forwarding it to the ArgoCD server, you must move the workload to a browser and fill in the following criteria:  
* Type in the **Application name** and **Project**  
* Set up **sync policies** (automated or manual depending on the webhooks)  
* Specify the **sync options**  
{{< image src="git6.png" alt="Practice" width="70%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
Adding a **repository URL**. Specifying **Branches** and **Path**.  
{{< image src="git7.png" alt="Practice" width="70%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
Setting up a **Cluster URL**: Choose a default one. Add a namespace. To foster corporate compliance and consistency, the **namespace** should be the same as the application name.  
{{< image src="git8.png" alt="Practice" width="70%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
ArgoCD realizes that we are transferring the helm in a repo and allows us to change the app’s value files. 
You can set up the controller by writing a YAML if you don’t like the UI editor.  
{{< image src="git9.png" alt="Practice" width="70%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
As a result, we create an app that reads the helm chart. ArgoCD spots the changes, and we manually initiate the sync.  
{{< image src="git10.png" alt="ArgoCD" width="70%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
### GitOps to Manage Apps Automatically
Configuring each app is time- and energy-consuming. To facilitate the creation of dynamic environments, let’s create an **App of Apps**. It will monitor the specific folder and deploy a new app when a new manifest appears. Here’s a step-by-step guide:
* **Deploy ArgoCD through a helm** chart. Specify value files for configuration and a path to monitor the repo.
```hcl
resource "helm_release" "argocd" {
  name = "argocd"

  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  namespace        = "argocd"
  version          = "4.9.7"
  create_namespace = true

  values = [
    file("argo-cd-config.yaml")
  ]
 ``` 
* Create an ArgoCD app. Set up its name, namespace, project, path, destination, if the directory should be recursively checked, where to deploy manifests from the app, and sync policies.
```hcl
server:
  additionalApplications:
   - name: apps
     namespace: argocd
     project: default
     source:
       repoURL: https://github.com/irazzhivin/argocd-apps.git
       targetRevision: HEAD
       path: apps/
       directory:
         recurse: true
     destination:
       server: https://kubernetes.default.svc
     syncPolicy:
       automated:
         prune: false
         selfHeal: false
```     
* Here’s what you will receive once it’s deployed:  
{{< image src="git13.jpg" alt="PracticeArgoCD" width="70%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
If you alter any parameter, commit the changes into a repo (for example, update the mobile app version). Since you don’t have webhooks set, change syncs are manual on the App of Apps level. After completing the synchronization, ArgoCD terminates an old pod and initiates a new one; the changes will be successfully delivered to a cluster.  
### Final Thoughts
The GitOps approach provides a range of benefits compared to the traditional Kubernetes approach:  
* **Extensive monitoring, recording, and visualization** of complex apps for developers to easily spot the discrepancies or errors. You can track even minor commits to find out the core of the problem.
* **Version management** for you to easily roll back poorly-implemented updates. A sure advantage over Git version control systems.
* **Simple implementation**, which is based on key DevOps skills the majority of developers possess. 
* **Increased productivity and security** compared to DevOps and CI/CD implementations.  
As a result, the GitOps approach allows for more flexibility, enhanced productivity and security, optimized workflows, hence, reduced time and costs. 






