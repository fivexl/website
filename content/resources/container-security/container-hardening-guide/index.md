---
title: 'FivexL Container Hardening Guide'
description: 'How we build and run hardened container images on AWS, from the base image to the running task. Free 88-page guide with snippets for Amazon ECS and Kubernetes.'
type: 'resources'
# Shown first on /resources/
featured: true
label: 'Free guide'
subtitle: 'How we build and run hardened container images on AWS, from the base image to the running task, reviewed every quarter.'
cover: 'cover.png'
# Wide image for the hero (made from the cover)
panel_image: 'panel.png'

# The PDF in the private R2 bucket (see wrangler.toml), and the value saved in the
# Brevo RESOURCE field so you can see who downloaded it.
file: 'FivexL-Container-Hardening-Guide.pdf'
download_id: 'container-hardening-guide'
pages: 88

# Facts shown under the description, like the date and time on a webinar page
meta:
  - label: 'Practices'
    value: '27'
    note: 'Build and Run'
  - label: 'Pages'
    value: '88'
    note: 'ECS and Kubernetes examples'
  - label: 'Updated'
    value: 'November 2026'
    note: 'Reviewed every quarter'

audience:
  - 'Engineers who build container images'
  - 'Teams running containers on Amazon ECS'
  - 'Teams running Kubernetes on Amazon EKS'
  - 'Platform teams that own CI and base images'

# From the guide's table of contents
learn:
  - heading: 'Start from a minimal base image'
    text: 'No shell, no package manager and no download tools, and keep the :debug and -dev tags out of production.'
  - heading: 'Keep build secrets out of the image'
    text: 'Secret and SSH mounts, a .dockerignore, and OIDC instead of static keys in CI.'
  - heading: 'Scan every image before it merges or ships'
    text: 'Trivy in a job without credentials, and waivers that expire.'
  - heading: 'Attach an SBOM and provenance, and sign the image'
    text: 'cosign keyless or ECR managed signing, by digest, enforced at deploy time.'
  - heading: 'Run with a read-only root filesystem'
    text: 'One small noexec tmpfs at /tmp, no capabilities and no privilege escalation.'
  - heading: 'Give each workload its own identity'
    text: 'A task role or Pod Identity, and IMDSv2 with a hop limit of 1.'
  - heading: 'Control egress'
    text: 'Deny outbound traffic by default and allow only the destinations a service needs.'
  - heading: 'Detect what happens at runtime'
    text: 'GuardDuty Runtime Monitoring or Falco, with an alert on any shell.'
---
This guide is for engineers who build container images and run them on Amazon ECS or Kubernetes. It is opinionated: each practice says what we do, why, and how, with a snippet you can copy.

Most attacks are a matter of cost. If a break-in leaves an attacker in a container with no shell, no package manager, no download tools, no writable filesystem, no network route out and no useful credentials, every next step costs real work, and most of them move on to an easier target.
