---
title: 'SaveHealth Case Study'
draft: true
author_id: 'Ivan Razzhivin'
summary: 'FivexL built a production-grade AI platform on AWS for a U.S. healthcare startup, enabling secure MCP-based integration of proprietary data with external LLM ecosystems like OpenAI and Anthropic.'
date: 2026-03-20
author: Ivan Razzhivin
panel_image:
authors_heading: 'Lead consultant for the project'
alt_image:
case_study: true
layout: 'case_study'
tags: ['case study', 'aws', 'ai', 'mcp', 'bedrock']
testimonial:
testimonial_author:
testimonial_author_position:
testimonial_author_portrait:
testimonial_cta_url:
testimonial_long:
about_company:
  logo: 'savehealth_logo.png'
  heading: 'About SaveHealth'
  text: |
    <a href="https://savehealth.com" target="_blank">SaveHealth</a> is a U.S.-based healthcare startup. Their product helps patients and consumers find lower prescription drug prices by comparing costs across pharmacies and accessing discount coupons and cards. It is especially useful for people paying out of pocket, without insurance, or looking to compare discount prices with their insurance copay. SaveHealth solves the problem of high and inconsistent prescription drug prices across the U.S. market.
double_panel:
  layout: 'case-studies'
  heading: "CASE STUDIES"
  subheading: "SaaS, AI, health care, and financial startups trust FivexL to build their infrastructure in AWS, empowering their businesses to grow faster. Learn how."
  icon_links:
   - { url: "https://github.com/fivexl", icon: "github" }
   - { url: "https://www.linkedin.com/company/5xl", icon: "linkedin" }
  button_cta: { url: "/contact", text: "Book a consultation" }
  media_panel: { url: "https://youtu.be/uruLy1goNW0" }
---
{{< case_study/challenge >}}
{{< pink_heading text="Challenge" sizes="bigger">}}
SaveHealth had a clear strategic goal: expose proprietary internal data to leading external LLM ecosystems - primarily OpenAI and Anthropic - in a secure, production-grade way.<br/>
<br/>
This was not a "build a chatbot" engagement. The real challenge was to create an AI integration layer that could securely expose sensitive healthcare data through an MCP-compatible interface, work with fast-moving external AI providers and their evolving integration requirements, remain scalable and maintainable in production, and give the team a reusable platform for future AI initiatives - not just a one-off proof of concept.<br/>
<br/>
The business objective was to unlock a new traffic and product-distribution channel through LLM platforms. The technical challenge was doing this without compromising security, operational simplicity, or AWS architectural standards - all while remaining HIPAA-compliant.<br/>
<br/>
A major complexity was that the AI integration landscape was evolving during the project itself. Requirements from providers such as OpenAI were still maturing, which meant the solution had to be both production-ready and adaptable.<br/>
<br/>
SaveHealth already had a solid conventional AWS setup in place - a frontend layer, CloudFront for caching and request acceleration, backend APIs running on ECS, and managed AWS data-processing components such as Airflow and Glue jobs. The foundation was there. What was missing was an AI-native platform layer that could securely connect internal systems and proprietary data to external LLM providers in a structured, scalable, and standards-aligned way.
{{</ case_study/challenge >}}

{{< case_study/solution heading="Solution" >}}
{{< case_study/column >}}
FivexL designed a staged approach: validate first with a pragmatic PoC, then industrialize into a production-grade AI platform - adapting the architecture as the ecosystem matured in real time.<br/>
<br/>
<strong>Rapid PoC on ECS</strong><br/>
Rather than waiting for the AI ecosystem to stabilize, FivexL started with a pragmatic proof of concept on ECS to validate the MCP integration model quickly. This let SaveHealth test both the business and technical viability of exposing internal data to external LLM platforms immediately. The backend was implemented using Python and FastMCP, optimizing for speed of execution, protocol alignment, and developer productivity.<br/>
<br/>
<strong>Production-Grade CI/CD from Day One</strong><br/>
FivexL built a production-style CI/CD pipeline with GitHub Actions from the beginning, so the project would not become a fragile prototype. The pipeline covered build, delivery, and validation workflows. Docker image build and delivery into AWS ECR was automated with ECR Scanning for CVEs, ensuring a clean, repeatable artifact flow. End-to-end testing was added early to reduce regression risk across the integration lifecycle.<br/>
<br/>
<strong>Infrastructure as Code</strong><br/>
All infrastructure was defined using Terraform, so cloud resources, environments, and deployment paths could be reproduced consistently and safely - following AWS best practices around multi-account architecture, security guardrails, and platform standardization.
{{</ case_study/column >}}
{{< case_study/column >}}
<strong>Evolution to Managed AI Platform</strong><br/>
Once AWS released AgentCore on Bedrock, FivexL reassessed the architecture and intentionally evolved the solution from a self-managed to a managed MCP hosting model. AgentCore materially reduced operational burden, improved long-term maintainability, and better matched SaveHealth's strategic need: not just to run one server, but to establish a scalable AI platform capability.<br/>
<br/>
<strong>Modern Authentication with OAuth 2.1</strong><br/>
FivexL leveraged OAuth 2.1 support through AgentCore as part of the managed architecture, aligning the solution with the emerging standard for MCP server integrations and reducing security implementation friction.<br/>
<br/>
<strong>Secure Data Exposure</strong><br/>
The platform was designed to securely expose proprietary internal data while keeping sensitive systems and control planes inside AWS - addressing both SaveHealth's security posture and the practical realities of healthcare AI integration.<br/>
<br/>
**The final outcome was not just an integration path, but a scalable AI platform layer that lets development teams move faster, launch experiments more safely, and bring AI workloads to production without rebuilding infrastructure every time.**
{{</ case_study/column >}}
{{</ case_study/solution >}}

{{< case_study/benefits
    cta_text="Start Your Success Story"
    cta_url="/contact"
    >}}
{{< pink_heading text="Benefits" >}}
<strong>From concept to production-grade AI platform</strong> - SaveHealth went from "we need to connect our internal data to OpenAI and Anthropic securely" to having an AWS-native AI platform that supports production-grade MCP integrations, future AI workloads, and faster experimentation with lower operational overhead.<br/>
<br/>
<strong>Immediate outcomes (first 2-4 weeks)</strong><br/>
The MCP-based architecture was validated through a working PoC. SaveHealth gained a functioning backend integration layer for testing against external LLM providers. CI/CD, container delivery, testing, and Terraform-based infrastructure workflows were established early. The project moved from abstract AI strategy into executable platform capability quickly.<br/>
<br/>
<strong>Longer-term outcomes</strong><br/>
The architecture matured from a PoC runtime into a reusable AI platform foundation. Operational complexity was reduced through migration toward a managed AgentCore-based model. SaveHealth gained a cleaner and more cost-effective long-term operating model than an ECS-heavy approach. Internal teams can now launch future AI workloads faster using the same platform base.<br/>
<br/>
<strong>What the client got beyond expectations</strong><br/>
Not just an MCP server or an isolated AI integration - but a real AI platform foundation: a reusable AWS-native pattern for future AI workloads, a secure method for exposing internal data to external LLM ecosystems, a lower-maintenance operating model, and a production-ready environment where teams can move from experiment to deployment much faster. It converts AI work from bespoke engineering effort into platform capability.
{{</ case_study/benefits >}}
