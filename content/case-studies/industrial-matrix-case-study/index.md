---
title: "From Monolith to Multi-Account ECS: How FivexL Migrated Industrial Matrix's Predictive Maintenance Platform"
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
testimonial: 'FivexL laid the foundation of our structure. Now we can play with it as with the Lego blocks and decide what to do... Now we have the capabilities of completing the services in a better way... we can scale what is in demand at the time.'
testimonial_author: 'Ariel Ferreira,'
testimonial_author_position: 'Technical Director at Industrial Matrix'
testimonial_author_portrait: Ariel.png
testimonial_cta_url: '/contact'
testimonial_long: |
  "FivexL laid the foundation of our structure. Now we can play with it as with the Lego blocks and decide what to do... Now we have the capabilities of completing the services in a better way... we can scale what is in demand at the time."
about_company:
  logo: 'industrial-matrix-logo.png'
  heading: 'About Industrial Matrix'
  text: |
    Industrial Matrix is a Canadian company in predictive maintenance and condition monitoring. Founded in 2016 with Motor Search - a motor cross-reference tool still used across the industry - it has grown into a full reliability platform for asset-intensive industries. Its closed-loop ecosystem combines UltraVibe™ sensors (4-in-1 condition monitoring across vibration, ultrasound, temperature, and lubrication), AI LubeMatrix™ for condition-based autonomous lubrication, and the MatrixHub™ software platform for diagnostics and reliability intelligence. Hardware, software, and human expertise in one platform.
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
{{< case_study/challenge image="Fernando-industrial-matrix.png" image_css="object-position: center 20%" >}}
{{< pink_heading text="Challenge" sizes="bigger">}}
As Industrial Matrix grew toward its goal of tripling revenue, the platform running hundreds of IoT devices in production couldn't scale with the business.

The predictive maintenance platform ran as a monolith on roughly three EC2 instances in a single AWS account. Ariel Ferreira, Technical Director at Industrial Matrix, described the problem:<br/>
<br/>
"We have demands for ingress data, for retrieval of data, for processing - there's a lot of different services that before were running together. It was more expensive to scale. Every time I had to scale, I had to scale everything. So if I have more sensors sending data, or more users, or less users - it doesn't matter, because I had to scale everything together to fit the bill."<br/>
<br/>
Underneath the scaling problem sat three structural risks the team carried every day:

<strong>A single point of failure.</strong> The entire platform - every service, every customer, every sensor stream - lived on roughly three EC2 instances in one AWS account. Any failure meant a total outage.<br/>
<br/>
<strong>Manual SSH deployments.</strong> No infrastructure as code, no CI/CD. Every deployment was a manual, error-prone process where reproducibility depended on whoever was at the keyboard.<br/>
<br/>
<strong>No environment separation.</strong> Production was the only environment. Development and testing happened in the same AWS account that served customers.<br/>
<br/>
FivexL had already delivered the multi-account AWS foundation in an earlier engagement, but the migration onto it hadn't been completed: "Everything was done, but it was just done and forgotten. All the accounts were created, but they didn't actually move to the new infrastructure. They just put it there like a test, but they didn't actually move the flows. So we ended up not even being able to try to migrate ourselves, because we didn't have the knowledge and the expertise."<br/>
<br/>
With the business preparing to scale, leadership committed to completing the work in three months - and brought FivexL back in to lead it end-to-end.
{{</ case_study/challenge >}}

{{< case_study/solution heading="Solution" >}}
{{< case_study/column >}}
The foundation was already in place from an earlier engagement: FivexL had built Industrial Matrix's multi-account AWS environment using RightStart for AWS - its productised landing zone, built with infrastructure as code, that gives a startup identity, networking, encryption, centralised logging, and security tooling in weeks rather than the months an in-house team would need to assemble it.

The three-month engagement focused on putting that foundation to work: moving the production platform onto it, building the development workflow that would replace SSH, and giving the team the skills to deploy and operate the new architecture.

One sequencing decision shaped everything else: build a local development environment that mirrored the new architecture before the production cutover, so the team could learn the new platform in safety before depending on it.

### Local Development Environment, Built First
Before touching production, FivexL built a local development environment that mirrored the new architecture, so the team could run and test their code on their own machines. When access to the old setup eventually disappeared, the developers already had a tested replacement they'd been using for weeks - and were running it with their own data seeders they'd built themselves.

Ariel saw the difference immediately: "One of the things we've done as well is the local development. So now it's faster for developers to test and try things than before."

### Containerise the Application As-Is
The application was containerised without a framework upgrade. Combining a runtime upgrade with the infrastructure migration under a three-month deadline was too risky. The framework upgrade becomes a clean, separate project on a foundation that can support it.
{{</ case_study/column >}}
{{< case_study/column >}}
### Production Cutover
The migration to production happened over a single nine-hour window. FivexL prepared a detailed runbook with a rollback procedure for every step, tested the cutover in development and staging first, and resolved code conflicts before going live.

The largest dataset - too big to move within the downtime window - stayed in place and was made accessible to the new platform without being copied. The hundreds of IoT devices in the field kept sending their data without interruption, routed through a temporary bridge so customers never had to touch their hardware.

### Automated Deployments and Cost Optimisation
FivexL replaced manual SSH deployments with an automated four-stage pipeline that promotes code from development to staging to production. No long-lived credentials anywhere in the system.

The team also right-sized the platform's compute and database resources, set up reserved capacity for predictable workloads, and stood up ongoing cost reporting so the business has visibility into what each environment costs to run. The engagement closed with full platform documentation covering the new infrastructure.

The engagement ran on daily standups, pair programming, and async coordination.
{{</ case_study/column >}}
{{</ case_study/solution >}}

{{< case_study/benefits
    cta_text="Start Your Success Story"
    cta_url="/contact"
    blockquote="I'd definitely recommend FivexL because they are trustworthy and very helpful, and they're very knowledgeable as well. I am considering using FivexL in the future."
    blockquote_author="Ariel Ferreira, Technical Director at Industrial Matrix"
    >}}
<h3>Scale only what needs scaling</h3>
<p>With the platform split across separate services, the parts that handle ingestion, retrieval, and processing can now scale independently. Adding sensors in the field or onboarding new customers no longer means scaling everything together.</p>

<h3>Ship faster</h3>
<p>The team went from manual deployments to an automated promotion pipeline. Shipping new versions of the software became routine rather than a bespoke operation - a capability the platform didn't have before.</p>

<h3>Room to add environments without re-architecting</h3>
<p>The accounts are structured by purpose - development, staging, production - with room for more. Including the option of standing up isolated environments for specific clients without touching the rest of the platform.</p>

<h3>A platform the development team owns</h3>
<p>The team now deploys to all environments through the automated pipeline without infrastructure support. They've built their own data seeders for the local environment and started shipping features on the new architecture.</p>

<h3>Three environments where there was one</h3>
<p>Dev, staging, and production now live in separate AWS accounts. The team can test changes without touching production.</p>

<h3>Security posture transformed</h3>
<p>The platform moved from a single AWS account with manual access to a multi-account environment with centralised security controls, encrypted service-to-service communication, and continuous threat monitoring.</p>

<p>Planning an AWS migration? See how <a href="/rightstart">RightStart for AWS</a> gives you the foundation Industrial Matrix built on - and how <a href="/ecs-blueprint">ECS Blueprint</a> gives you the container platform they migrated to.</p>

{{</ case_study/benefits >}}
