---
title: "Industrial Matrix: From Monolith to Multi-Account ECS on AWS"
author_id: 'Fernando Goncalves'
summary: 'FivexL migrated a Canadian predictive maintenance platform from a single-account monolith to a containerized, multi-account ECS architecture - replacing manual SSH deployments with an automated pipeline and delivering three isolated environments in three months.'
date: 2026-06-08
author: Fernando Goncalves
panel_image: Fernando-industrial-matrix.png
authors_heading: 'Consultant Leading the Project'
alt_image: Fernando-industrial-matrix.png
case_study: true
layout: 'case_study'
tags: ['case study', 'aws', 'ECS', 'migration', 'RightStart', 'multi-account', 'IoT']
testimonial: 'FivexL laid the foundation of our structure. Now we can play with it as with the Lego blocks and decide what to do. The accounts with different purpose, development, staging, and production, also create the idea that you could have more environments if you want.'
testimonial_author: 'Ariel Ferreira,'
testimonial_author_position: 'Technical Director at Industrial Matrix'
testimonial_author_portrait: Ariel.png
testimonial_cta_url: '/contact'
testimonial_long: |
  "FivexL laid the foundation of our structure. Now we can play with it as with the Lego blocks and decide what to do. The accounts with different purpose, development, staging, and production, also create the idea that you could have more environments if you want. I’d definitely recommend FivexL because they are trustworthy and very helpful, and they’re very knowledgeable as well."
about_company:
  logo: 'industrial-matrix-logo.png'
  heading: 'About Industrial Matrix'
  text: |
    Industrial Matrix is a Canadian reliability technology company operating at the forefront of predictive and prescriptive maintenance for asset-intensive industries. Founded in 2016 with Motor Search, a motor cross-reference tool still relied on across the field, the company has grown into a complete closed-loop reliability ecosystem engineered to protect any plant, of any type, at any scale. At the core of the company's ecosystem sits MatrixHub™, an AI-powered platform that ingests data from a large fleet of industrial IoT devices and returns it to reliability teams as prioritized, actionable intelligence. Hardware, software, AI, and human expertise in one platform — moving customers from early fault detection to verified corrective action, and ultimately toward machines that heal themselves.
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
{{< case_study/challenge heading="Challenge" blockquote="We have demands for ingress data, for retrieval of data, for processing. There's a lot of different services that before were running together. It was more expensive to scale. Every time I had to scale, I had to scale everything. So if I have more sensors sending data, or more users, or less users - it doesn't matter, because I had to scale everything together to fit the bill." blockquote_author="Ariel Ferreira, Technical Director at Industrial Matrix" >}}
Industrial Matrix had built a strong product: a predictive maintenance platform running a growing fleet of industrial IoT devices in production. The early infrastructure choices were the right call at the time, lean, fast, and sufficient to prove the model. But success moved the goalposts. More customers, more devices, and larger commercial commitments raised the bar on what the platform underneath had to do, and the foundation that carried the company this far was not built for where it was going. It capped how far the platform could scale and slowed daily development.

The next stage set two firm requirements:

<ul>
<li><strong>Resilience that matched the stakes.</strong> With hundreds of thousands of devices and a growing customer base now depending on the platform, concentration risk that was acceptable early on no longer was. The architecture needed to spread that risk, not pool it.</li>
<li><strong>Delivery that could keep pace.</strong> A manual deployment process works for a small team shipping occasionally. At Industrial Matrix's new velocity, the team needed infrastructure as code and CI/CD so releases were fast, repeatable, and independent of who ran them.</li>
</ul>
{{</ case_study/challenge >}}

{{< case_study/solution heading="Solution" >}}
{{< case_study/column >}}
In a first engagement, FivexL laid the foundation. Using [RightStart for AWS](/rightstart), FivexL's productized landing zone, Industrial Matrix received a secure, multi-account AWS environment built entirely with infrastructure as code. RightStart delivers what typically takes an in-house team more than a year to assemble: a full AWS organization structure with separate accounts for workloads, security, logs, and networking; centralized identity and SSO; encrypted secrets management; automated security tooling including GuardDuty, Security Hub, and CloudTrail; and CI/CD-ready OIDC access, all configured and production-ready in a month.

The accounts were created. The foundation was solid. The application itself, however, had not yet been moved onto it.

The second engagement completed that work: migrating the production platform onto the new foundation, replacing manual deployments with an automated pipeline, and equipping the team to own and operate the new architecture.

One sequencing decision shaped everything that followed: build a local development environment that mirrored the new architecture before the production cutover, so the team could master the new platform in safety before depending on it.

### Local Development Environment, Built First
Before touching production, FivexL built a local development environment that mirrored the new architecture, so developers could run and test their code on their own machines. When access to the old setup eventually disappeared, the team already had a tested replacement they had been using for weeks, running it against their own data seeders that they had built themselves.

Ariel saw the difference immediately: "One of the things we've done as well is the local development. So now it's faster for developers to test and try things than before."

### Containerize the Application As-Is
The application was containerized without a framework upgrade. Combining a runtime upgrade with the infrastructure migration would have introduced unnecessary risk. Isolating the two keeps the framework upgrade a clean, separate project on a foundation now able to support it.
{{</ case_study/column >}}
{{< case_study/column >}}
### Production Cutover
The migration to production ran within a single nine-hour window. FivexL prepared a detailed runbook with a rollback procedure for every step, rehearsed the cutover in development and staging first, and resolved code conflicts before going live.

Continuity for customers was absolute. The fleet of IoT devices in the field kept sending data without interruption, routed through a temporary bridge, so no customer ever had to touch their hardware and no monitored asset went dark during the transition.

### Automated Deployments and Cost Optimization
FivexL replaced manual SSH deployments with an automated four-stage pipeline that promotes code from development to staging to production, with no long-lived credentials anywhere in the system.

The team also right-sized the platform's compute and database resources and stood up ongoing cost reporting, giving the business clear visibility into what each environment costs to run. The engagement closed with full platform documentation covering the new infrastructure.

Throughout, the work ran on daily standups, pair programming, and async coordination.
{{</ case_study/column >}}
{{</ case_study/solution >}}

{{< case_study/benefits
    cta_text="Start Your Success Story"
    cta_url="/contact"
    blockquote="One of the things we've done as well is the local development. So now it's faster for the team to test and try things than before."
    blockquote_author="Ariel Ferreira, Technical Director at Industrial Matrix"
    >}}
<h3>Scale with confidence</h3>
<p>The infrastructure now scales automatically based on load. Industrial Matrix can onboard new customers knowing the platform will absorb the increase without manual intervention, no longer constrained by a setup that required scaling everything at once.</p>

<h3>Ship faster</h3>
<p>The team moved from manual deployments to an automated promotion pipeline. Shipping new versions of the software became routine rather than a bespoke operation, a capability the platform did not have before.</p>

<h3>Room to add environments without re-architecting</h3>
<p>The accounts are structured by purpose, development, staging, and production, with headroom for more. That includes the option of standing up isolated environments for specific clients without touching the rest of the platform.</p>

<h3>A platform the development team owns</h3>
<p>The team now deploys to every environment through the automated pipeline without infrastructure support. They have built their own data seeders for the local environment and begun shipping features on the new architecture.</p>

<h3>Three environments where there was one</h3>
<p>Development, staging, and production now live in separate AWS accounts, so the team can test changes without touching production.</p>

<h3>Security posture transformed</h3>
<p>The platform moved from a single AWS account with manual access to a multi-account environment with centralized security controls, encrypted service-to-service communication, and continuous threat monitoring.</p>

<p>Planning an AWS migration? See how <a href="/rightstart">RightStart for AWS</a> gives you the foundation Industrial Matrix built on - and how <a href="/ecs-blueprint">ECS Blueprint</a> gives you the container platform they migrated to.</p>

{{</ case_study/benefits >}}
