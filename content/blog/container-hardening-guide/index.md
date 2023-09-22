---
title: 'FivexL Container Hardening Guide for Binary Compilable Apps'
author_id: 'Vladimir-Samoylov'
summary: 'Do you want the security of your binary app to excel by adding a couple of defense layers? Read our guide on container hardening for binary compilable apps.'
date: 2023-03-30
author: Vladimir Samoylov
panel_image: container.png
tags: [ 'aws', 'open source', 'container', 'guide']
---
In this guide, we will elaborate on some best practices to improve the depth of your security. This can become a basis for regular security audits of your compilable binary app. 

Please, note that to outplay an intruder, you need to think like an intruder. In most cases, the attack viability is down to simple math: it takes place if the efforts and expenditures are lower than a potential profit. Here's why you need to become a complex and highly costly target for massive purposeless attackers in order to abandon your defense lawyers.

If, however, APTs (Advanced Persistent Threats) target you specifically and are willing to spend a lot of time and resources on this; you need to set up as many defense lawyers as possible to increase your chances of attack detection. 

### Stage 1#. Pre-Build Level

At this stage, you will discover potential vulnerabilities that can be tackled in further stages.

1.  **Run Linter for a DockerFile**, for example, Hadolint, to ensure you create small, secure, efficient, and maintainable Docker images. If you fail to meet best practices, the tool will provide relevant recommendations. 

2.  **Run a CVE Check** to detect vulnerabilities.

### Stage 2#. Build Level

This set of recommendations is simple to complete and can be performed within a workday. It mostly focuses on adjusting the Docker Image. Here are some initiatives, categorized from simple to complex. 

1.  **Use copy, instead of add a docker image**.
{{< test keyword="copy_example">}}

   

2.  **Use verified images** to get your deps from trusted sources only. Before downloading some random docker image, ensure its creator is real and reliable: check the official site, etc. This way, you can eliminate the risk of downloading an image with malicious code. Additionally, some image distributors, like Distroless, offer the opportunity to verify the image's integrity using tools such as cosign.

3.  **Fix or pin all build dependencies** to avoid fetching the latest version by mistake.
{{< test keyword="hardcoding_deps">}}
{{< test keyword="hardcoding_image">}}

4.  **Get rid of any valuable files on disk inside the container** with .dockerignore. When building an app, you often store credentials and other important data necessary for a container build. You need to clean up .git and .n files, as well as credentials, to prevent an intruder from accessing valuable data easily. Run .dockerignore and skip the files.  Beware of recursive copy.

5.  **Use [lprobe](https://fivexl.io/blog/lprobe/) instead of wget/curl for Health Checks**. wget and curl commands open a window of opportunity for an intruder to download and run some malicious software. [lprobe](https://fivexl.io/blog/lprobe/) is FivexL's alternative to securely run health checks without compromising your security by creating your own health check CMD. 

6.  **Run containers as a non-root user**. Link Dockerfiles to look for the USER directive and fail the build if it's missing.

7.  **Add fake files to trick an intruder and get an alert**. When building, add an ls or wget utility that will run differently from the expected command, for example, exit 1, which means the container falls once the utility is run. Besides, add canary.tools or honeypot tools that create tokens. When they are used, you will receive a notification which is useful for spotting an attack without an intrusion detection system.  

8.  **Consider a Multi-Stage Build** to ensure your Docker history has no saved secrets. When building you can use any verified image with pinned dependencies. However, it should be removed at the next stages when the binary compilable app is ready. For this, the second-stage build should be either based on scratch images that contain nothing or distroless images with minimal data. To discard the first stage with all the information for building, like Amazon files with temporary credentials, copy (what?) from the first stage into the second one.

9.  **Try using scratch images as much as possible**. They should have no shell, which makes it more complicated for an attacker to run commands or launch standard utilities to upload additional ones like curl or wget or package managers to gain access to system info (is it Linux? What is the image?). 

### Stage 3#. Run-Time Level

1.  **Use read-only systems** where possible to reduce the attacker landscape. Provide access for editing to limit the intruder's chances of altering your files. 

2.  **Use a run-time scanner and intrusion detection system** like GuardDuty to monitor system calls. It's useful to notice suspicious actions in a container instantly.

3.  **Drop all Linux capabilities** at the orchestration level.

4.  **Set up CPU / Memory limits** to discover when the workload suddenly increases and prevent DOS on Node. This also saves your budget.

5.  **Set up a reliable process** for accessing your secrets from a container. If you hide credentials as environment variables, they could be read unless you run a root. Consider allowing an app to read them directly by letting it know where they are stored. However, it may complicate local testing. You could also make a fallback: if there are environment variables, read them; if not, source them from production. 

### Stage 4#. Long-Term Security Defense Layering

The following initiatives should be carried out regularly to ensure your container is secured in the long term.

1.  **Rebuild images regularly**, even if there are no changes to the app, to ensure the latest updates and CVE fixes for tools and app libraries.

2.  **Sign images and do not allow unsigned ones**. It complicates downloading some extras from the Docker hub and running them. Ensure you are enforcing verified images.

3.  **Replicate images to another region** so you have a backup in case of an outage. Instead of quickly building an app in another region, it's best to reuse the existing one with different flags.

4.  **Container registry immutable tags**.

5.  **Drop canary tokens to containers** to spot intrusion early.

## Summing Up

The provided set of instructions allows you to layer up your defense strategy for compilable binary apps. As a result, it will be much harder for an intruder to wander around your app, which often makes them abandon an attack. Besides, the provided measures facilitate attack detection, which helps you proactively address it.