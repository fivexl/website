---
title: 'What to Consider When Migrating from AWS App Runner to Amazon ECS'
author_id: FivexL
date: 2026-07-09
description: "AWS is deprecating App Runner. Here's what to weigh before picking a path — why we lean toward ECS on Fargate over Express Mode, plus the security and networking gaps AWS's migration guide leaves out."
author: FivexL
author_link: https://fivexl.io/
category: AWS
panel_image: from-app-runner-to-ecs.jpg
tags: ['AWS', 'ECS', 'App Runner', 'Migration', 'Fargate', 'DevOps']
---

On March 31, AWS announced it is deprecating AWS App Runner. New customers were cut off on April 30, and while AWS has not yet published a final sunset date, the direction is clear: teams running on App Runner need a migration plan.

AWS's official migration guide <sup>[1]</sup> points at Amazon Elastic Container Service (Amazon ECS) Express Mode. Express Mode is a reasonable starting point for prototyping, but for production workloads we recommend going straight to ECS on AWS Fargate. That way your lower environments and production use the same runtime, and you inherit the security controls App Runner abstracted away.

<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #18AEF0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

Below: what changes when App Runner disappears, why we skip Express Mode for production, and the security and networking details AWS's migration guide leaves out.

</div>

<!--more-->

## What's in this post

1. [What AWS actually announced](#what-aws-actually-announced)
2. [App Runner vs ECS at a glance](#app-runner-vs-ecs-at-a-glance)
3. [What AWS's migration guide leaves out](#what-awss-migration-guide-leaves-out)
4. [The upside: ECS unlocks Compute Savings Plans](#the-upside-ecs-unlocks-compute-savings-plans)
5. [Our recommendation](#our-recommendation)
6. [Skip the headache with the FivexL ECS Blueprint](#skip-the-headache-with-the-fivexl-ecs-blueprint)

---

## What AWS actually announced

App Runner was AWS's fully managed container service — link a repo or push an image, and AWS handled the build, deploy, and hosting. The trade-off was always the same: fast setup in exchange for limited control over networking, observability, and CI/CD. With App Runner going away, teams have to make choices they never had to make before.

The migration paths on the table:

- **ECS Express Mode**: created as the default replacement, fast to set up, closer to the App Runner experience.
- **ECS on EC2**: you'll have to set up EC2 instances and maintain them (headache).
- **ECS on Fargate (standard)**: more configuration up front, full control, easier to run under HIPAA or SOC 2 expectations.
- **Other platforms**: AWS Lambda for event-driven workloads (up to 15 minutes), or third-party PaaS options.

For anyone running a production workload that will still be around in a year, we think ECS on Fargate is the option that saves you a second migration later.

## App Runner vs ECS at a glance

| Feature | App Runner | ECS on Fargate |
| :---- | :---- | :---- |
| **VPC / networking** | Fully managed, no VPC required; optional VPC Connectors for egress and VPC Ingress Connections for private endpoints | Runs in your own VPC (recommended for security and compliance) |
| **CI/CD pipeline** | Built-in, link a GitHub repo and AWS auto-builds and deploys | Bring your own using GitHub Actions, AWS CodePipeline, or similar |
| **Container image build** | Handled automatically from source (optional) | You build and push images to Amazon ECR |
| **Load balancer** | Managed Network Load Balancer plus a hidden L7 request router | Application Load Balancer (Express Mode) or ALB/NLB (standard ECS) |
| **Custom domain and TLS** | One-click domain and auto-provisioned certificate | Manual AWS Certificate Manager setup and ALB listener configuration |
| **Observability and tracing** | AWS X-Ray integrated out of the box | Sidecar required (X-Ray daemon or OpenTelemetry collector) |
| **Auto scaling** | Built-in, concurrency-based | Application Auto Scaling with target tracking or step scaling |
| **Pricing model** | Idle instances charged for memory only, no vCPU; can pause to zero cost but lose state | Pay per vCPU and memory-second; eligible for Compute Savings Plans (up to 52% on Fargate); can set desired count to 0, but this requires external automation and is not built in. |
| **Configuration complexity** | Minimal, a handful of settings | Task definitions, services, target groups, security groups, IAM roles |
| **Security posture** | Abstracted, limited control | Full control over IAM, security groups, NACLs, private subnets |
| **Multi-environment parity** | Harder to replicate (prod vs dev) | Easy with infrastructure as code, same Terraform for every environment |
| **Launch types** | Serverless only | Fargate (serverless), EC2, External (ECS Anywhere) |

## What AWS's migration guide leaves out

Reading AWS's migration guide, we noticed several things that matter in production but do not get called out.

### Express Mode ignores AWS's own security baseline

By default, ECS Express Mode creates the new cluster inside the default VPC. That goes against the AWS Startup Security Baseline <sup>[2]</sup>, which recommends avoiding the default VPC for production workloads. If you use Express Mode, explicitly configure the cluster to use a VPC you control. If you can build a custom VPC anyway, most of Express Mode's convenience advantage disappears.

### You now own the CI/CD pipeline

App Runner offered a "code-based" service that linked a GitHub repo and provided a hidden CI/CD pipeline. That is gone. You are now responsible for building your own images and deploying them.

AWS's migration guide includes a GitHub Actions example, but it assumes:

- You use GitHub as your git host.
- You are willing to pay for GitHub Actions minutes at scale.
- You can create the IAM role, permissions, and OIDC trust configuration to push to ECR and update task definitions.

There is a helper in the Actions marketplace <sup>[3]</sup> and a companion GitHub repo <sup>[4]</sup>, but the setup is still on you. Teams on GitLab, Bitbucket, or self-hosted git will need to build the equivalent themselves.

### The load balancer story is more complicated

App Runner gave you a ready URL and a one-click way to attach a domain and certificate. With ECS you get an Application Load Balancer (ALB), which you configure through the EC2 console rather than the ECS console. That is a common source of confusion for teams new to ECS.

There is also a networking difference worth understanding. App Runner used a public-facing Network Load Balancer (NLB) at Layer 4 paired with an internal Layer 7 request router <sup>[9]</sup>. ECS Express Mode only supports ALB <sup>[5]</sup>, which operates at Layer 7. If you need NLB behavior (TCP-level routing, static IP addresses, ultra-low latency), you have to move to standard ECS.

With both ALB and NLB, you can attach multiple SSL certificates to a single listener (a default certificate plus additional ones via SNI), and with ALB specifically you can define listener rules that route traffic based on host header, URL path, query string, or HTTP method — something App Runner never offered.

That means you can run multiple domains or microservices behind a single ALB, each with its own certificate and routing logic — giving you far more flexibility over how traffic reaches your containers.

### Observability requires a real plan now

Credit where it's due: while researching this post, we came across another writeup <sup>[13]</sup> that called out the same gap. App Runner shipped with AWS X-Ray integration out of the box; with ECS, tracing requires a sidecar container running the X-Ray daemon or an OpenTelemetry collector.

Worth knowing: the X-Ray SDKs and daemon entered maintenance mode on February 25, 2026 and reach end-of-support on February 25, 2027 <sup>[6]</sup>. AWS recommends transitioning to OpenTelemetry <sup>[7]</sup> and replacing the X-Ray daemon with either the CloudWatch Agent or the OpenTelemetry Collector with the X-Ray Exporter. If you are setting this up fresh, go straight to the AWS Distro for OpenTelemetry rather than deploying the X-Ray daemon and migrating twice.

## The upside: ECS unlocks Compute Savings Plans

Once you are on ECS with Fargate, you qualify for AWS Compute Savings Plans <sup>[8]</sup>, which offer meaningful discounts on your compute bill in exchange for a one- or three-year commitment. App Runner had no equivalent program.

## Our recommendation

If you are already on App Runner in production, get the VPC right first — private subnets, VPC endpoints, flow logs — before you touch compute. From there, move to standard ECS on Fargate rather than Express Mode, so dev, staging, and production all run the same way. Build the CI/CD pipeline once, in code, wire up observability with OpenTelemetry from day one, and only look at Compute Savings Plans once the workload has settled.

Express Mode is fine if you are exploring ECS for the first time, but every team we have worked with that started there ended up rebuilding on standard ECS within a few months. Two migrations is one more than most startups can afford.

## Skip the headache with the FivexL ECS Blueprint

If you would rather not build all of this from scratch, our [ECS Blueprint](https://fivexl.io/ecs-blueprint/) is a production-ready application platform for teams that need to run containers reliably on ECS and Fargate, ship features quickly, scale automatically, and stay aligned with HIPAA or SOC 2.

It gives you:

- Private networking and least-privilege IAM as defaults.
- Centralized logging and observability.
- Automated CI/CD that works across environments.
- A repeatable Terraform setup so every environment looks the same.

Built specifically for regulated SaaS startups, the Blueprint replaces the fragile quick fixes (single environment, ad-hoc deploys) that fail under real usage — broken releases, spike-driven outages, stalled security reviews — with a proven, repeatable setup that stays up under load as you grow.

Read more at [ECS Blueprint](https://fivexl.io/ecs-blueprint/), or see how we have implemented it for other teams in our [case studies](https://fivexl.io/case-studies/).

---

### Sources

1. [AWS App Runner availability change and migration guide](https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html)
2. [AWS Startup Security Baseline — acct-09: Avoid using the default VPC](https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-startup-security-baseline/acct-09.html)
3. [Amazon ECS Deploy Express Service — GitHub Actions marketplace](https://github.com/marketplace/actions/amazon-ecs-deploy-express-service-action-for-github-actions)
4. [amazon-ecs-deploy-express-service — GitHub](https://github.com/aws-actions/amazon-ecs-deploy-express-service)
5. [ECS Express Mode overview — load balancer support](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html)
6. [Announcing AWS X-Ray SDKs and daemon end of support and OpenTelemetry migration](https://aws.amazon.com/blogs/mt/announcing-aws-x-ray-sdks-daemon-end-of-support-and-opentelemetry-migration/)
7. [Migrating from X-Ray SDKs to OpenTelemetry](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html)
8. [AWS Compute Savings Plans pricing](https://aws.amazon.com/savingsplans/compute-pricing/)
9. [Serverless Web Hosting on AWS App Runner — reference architecture](https://docs.aws.amazon.com/architecture-diagrams/latest/serverless-web-hosting-aws-app-runner/serverless-web-hosting-aws-app-runner.html)
10. [Amazon ECS Managed Instances](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ManagedInstances.html)
11. [AWS Fargate documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
12. [ECS External Launch Type (ECS Anywhere)](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch-type-external.html)
13. [A practical guide to moving from App Runner to ECS Express Mode (dev.to)](https://dev.to/ustun/a-practical-guide-to-moving-from-aws-app-runner-to-ecs-express-mode-1fe3)
