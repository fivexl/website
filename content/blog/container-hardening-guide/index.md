---
title: 'FivexL Container Hardening Guide'
author_id: 'Vladimir-Samoylov'
summary: 'Do you want the security of your binary app to excel by adding a couple of defense layers? Read our guide on container hardening for binary compilable apps.'
date: 2023-03-30
author: Vladimir Samoylov
panel_image: container.png
tags: [ 'aws', 'open source', 'container', 'guide', 'security', 'docker']
---
Nowadays, containers are everywhere, and we at FivexL work with containers with almost all of our customers. Thus, this guide is an attempt to capture the best practices to re-use them between the projects and make them available to the broader public. If you use this guide to become more secure - we all win. The safer the internet, the better it is for all of us using it. 

Let's think like an intruder. In most cases, the attack viability is down to simple math: it takes place if the efforts and expenditures are lower than a potential profit. Here's why you want to become a complex and highly costly target to attack, so opportunistic attackers would rather abandon attempts to attack you and move to an easier target.

If, however, you are the target of an APT (Advanced Persistent Threat, think state-level hacking group sophistication and resources) who is motivated to break in and have resources to keep trying, then hardening of your container images will make their life harder, and increase chances of attack detection.

Please note that the code samples may be outdated. For the most recent examples, refer to the links at the end of this blog, links at the top of code samples, or directly to our [repository](https://github.com/fivexl/secure-container-image).

### Stage 0. App Packaging for Enhanced Security in Containerized Environments

With compilable languages, the application is compressed into a single, statically linked binary. This can be placed into a scratch container image, which is an image devoid of shell, CLI tools, or libraries. When an intruder accesses such a container, the only thing that is present is an application binary. An attacker would lack the tools to download additional hacking software, extract secrets from memory, or move laterally. There will be no tools to hide their activity and [live off the land](https://www.crowdstrike.com/cybersecurity-101/living-off-the-land-attacks-lotl/). It would require a sophisticated and determined attacker to break out of such a container.

Well, there are also interpretable languages that necessitate a runtime, such as Python and JavaScript. In these environments, an attacker could run arbitrary code using an interpreter available in the container to download files, exfiltrate data, and attack other services.

Recently, some tools have emerged attempting to package JavaScript apps into single binaries, suggesting that, theoretically, we could achieve a similar isolation level as with compilable apps. However, not all packages are compatible with these tools, and most of these tools are not yet mature. For more information about packaging Node.js apps, refer to [this article](https://dev.to/midnqp/bundling-nodejs-into-single-executable-binary-l3g ).

**Tools for transitioning from Scripts to Standalone Executables:**

- For JavaScript: Utilize tools such as [pkg](https://github.com/vercel/pkg) or [nexe](https://github.com/nexe/nexe) to create self-contained executables from your JavaScript code.

- For Python: Employ tools like [PyInstaller](https://github.com/pyinstaller/pyinstaller) or [Nuitka](https://github.com/Nuitka/Nuitka), [py2exe](https://pypi.org/project/py2exe/). These tools can transform Python scripts into executable binaries, eliminating the requirement for a Python interpreter within your Docker image. Another approach is to use CPython to compile the code into a static executable binary.

**Opting for Minimalist Base Images:** 

The shift to standalone executables opens the door to utilizing 'scratch' container images. These minimal base images are essentially empty, lacking a shell, CLI tools, or libraries. More info about creating images from 'scratch' can be found [here](https://docs.docker.com/build/building/base-images/#create-a-simple-parent-image-using-scratch).

### Stage 1. Pre-Build Level

At this stage, you will discover potential vulnerabilities that can be tackled in further stages.

1.  **Run Linter for a DockerFile**, for example, Hadolint, to ensure you create small, secure, efficient, and maintainable Docker images. If you fail to meet best practices, the tool will provide relevant alerts and recommendations.

    **Github CI example**
    ```yaml
    # https://github.com/fivexl/secure-container-image/blob/main/.github/workflows/hadolint.yml
    name: Hadolint
    on:
    push:
        branches: [ "main" ]
    pull_request:
        branches: [ "main" ]

    jobs:
    lint_dockerfiles:
        runs-on: ubuntu-latest
        steps:
        - name: Checkout code
            uses: actions/checkout@v4

        - uses: hadolint/hadolint-action@v3.1.0
            with:
            dockerfile: ./examples/go_app_example/Dockerfile.goapp
    ```

2. **Run a CVE Check to detect vulnerabilities in packages**. Tools like Snyk, AWS ECR, or Trivy can be used to scan your container images for known vulnerabilities in installed packages if you have to install some. These tools cross-reference your image against various CVE databases and provide a report, helping you to remediate any potential security issues.

    **Github CI example**
    ```yaml
    # https://github.com/fivexl/secure-container-image/blob/main/.github/workflows/ci.yml#L114
    # Run Snyk to check Docker image for vulnerabilities
    snyk:
        runs-on: ubuntu-latest
        needs: build
        strategy:
        matrix:
            config:
            - {image: "secure-container-image-base", dockerfile: "Dockerfile.base"}
            - {image: "secure-container-image-base-python3-distroless-debian-11", dockerfile: "Dockerfile.base-python3-distroless-debian-11"}
            - {image: "secure-container-image-base-nodejs20-distroless-debian-11", dockerfile: "Dockerfile.base-nodejs20-distroless-debian-11"}
        steps:
        - uses: actions/checkout@v2

        - name: Run Snyk to check Docker image for vulnerabilities
            continue-on-error: true
            uses: snyk/actions/docker@master
            env:
            SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
            with:
            image: ghcr.io/fivexl/${{ matrix.config.image }}:${{ github.sha }}
            args: --severity-threshold=high --file=${{ matrix.config.dockerfile }}
    ```

### Stage 2. Build Level

This set of recommendations is simple to complete and can be performed within a workday. It mostly focuses on adjusting the Docker Image. Here are some initiatives, categorized from simple to complex. 

1.  **Use verified images**. Before downloading some random docker image, ensure its creator is real and reliable: check the official site, etc. This way, you can eliminate the risk of downloading an image with malicious code. Additionally, some image distributors, like Distroless, offer the opportunity to verify the image's integrity using tools such as cosign. If there is a link to GitHub that contains sources of the image then inspect the source. Another possible precaution might be to fork/copy the source repo and build the image yourself. This way you make sure that you get what you see and nother else is injected along the way. However, in this case, you would need to have automation to pull the latest source code changes to your copy/fork. 

2.  **Use copy, instead of add a docker image**.
    ```dockerfile
    # https://github.com/fivexl/secure-container-image/blob/main/Dockerfile.base#L43
    # Copy necessary files from loader image to runtime image
    COPY --from=loader /loader/group /etc/group 
    COPY --from=loader /loader/passwd /etc/passwd 
    COPY --from=loader /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
    COPY --from=loader /etc/os-release /etc/os-release
    COPY --from=loader /loader/lprobe /usr/bin/lprobe
    ```
   
3.  **Fix or pin all build dependencies** to avoid fetching the latest version by mistake. 

    Additionally, it is advisable to use a specific version of the image instead of the 'latest' tag. By doing so, you can minimize the risk of inadvertently downloading a new version that may contain unacknowledged CVEs or bugs.

    ```dockerfile
    # https://github.com/fivexl/secure-container-image/blob/main/examples/go_app_example/Dockerfile.goapp#L13
    ARG BASE_IMAGE_TAG=46fd9edb1422ec7610e3ba3ac0b7d40d46e48f4e
    FROM ghcr.io/fivexl/fivexl/secure-container-image-base:${BASE_IMAGE_TAG} AS runtime
    ```

4.  **Get rid of any valuable files on disk inside the container** with .dockerignore. When building an app, you often store credentials and other important data necessary for a container build. You need to clean up .git and .n files, as well as credentials, to prevent an intruder from accessing valuable data easily. Run .dockerignore and skip the files.  Beware of recursive copy. Example of .dockerignore content:
    ```dockerfile
    # Ignore Git directory
    .git/
    # Ignore all markdown files
    *.md
    # Ignore all .n files
    *.n
    # Ignore credentials
    credentials.json
    # Ignore temporary files
    *.tmp
    ```


5.  **Use [lprobe](https://fivexl.io/blog/lprobe/) instead of wget/curl for Health Checks**. wget and curl commands open a window of opportunity for an intruder to download and run some malicious software. [lprobe](https://fivexl.io/blog/lprobe/) is FivexL's alternative to securely run health checks without compromising your security by creating your own health check CMD. 
    ```dockerfile
    # https://github.com/fivexl/secure-container-image/blob/main/Dockerfile.base#L34
    # Loader image:
    # lProbe check tool: https://github.com/fivexl/lprobe
    COPY --from=ghcr.io/fivexl/lprobe:0.0.7 /lprobe lprobe
    
    # Runtime image based "base" image:
    # Set lprobe as health check
    HEALTHCHECK --interval=1m --timeout=3s \
    CMD ["lprobe", "-mode=http", "-endpoint=/", "-port=80"]
    ```

6.  **Run containers as a non-root user**. Example of setting up a user, and copying it from the loader image:
    ```dockerfile
    # https://github.com/fivexl/secure-container-image/blob/main/Dockerfile.base
    # add a user here because addgroup and adduser are not available in scratch
    ENV APP_USER_NAME=app
    ENV APP_USER_ID=2323
    ENV APP_USER_HOME=/app

    ## Create app user/group/home
    RUN addgroup --gid ${APP_USER_ID} ${APP_USER_NAME} \
        && adduser --home ${APP_USER_HOME} --disabled-password --uid ${APP_USER_ID} --ingroup ${APP_USER_NAME} ${APP_USER_NAME} \
        && cp /etc/group /loader/group && cp /etc/passwd /loader/passwd 

    ## Remove unnecessary accounts, excluding current app user and root
    RUN sed -i -r "/^($APP_USER_NAME|root|nobody)/!d" /loader/group \
    && sed -i -r "/^($APP_USER_NAME|root|nobody)/!d" /loader/passwd 

    USER app
    RUN mkdir -m 0700 /tmp/tmp

    # Copy the user from the loader image
    FROM scratch

    # Copy files
    COPY --from=loader /loader/group /etc/group 
    COPY --from=loader /loader/passwd /etc/passwd 
    
    # Set the user
    USER app
    ```
    Additionally, some distributions, like Distroless, offer the option to run containers as a non-root user by default. You can achieve this by using the "nonroot" tag in the image.
    ```dockerfile
    FROM gcr.io/distroless/static:nonroot
    ```


7.  **Add fake files to trick an intruder and get an alert**. When building, add an ls or wget utility that will run differently from the expected command, for example, exit 1, which means the container falls once the utility is run. Besides, add canary.tools or other honeypot tools that create tokens. When they are used, you will receive a notification, which is useful for spotting an attack without an intrusion detection system.  

8. **Consider Using Multi-Stage Builds**: Multi-stage builds are an effective way to enhance container security by discarding build history. In the first stage, you can use any verified image with specific dependencies to build your binary application. For the second stage, opt for a base image that is either a scratch image devoid of additional files or a minimal distroless image. This strategy ensures that your final Docker image is free of unnecessary data and potential secrets. To execute this, copy only the compiled application and essential runtime files from the first stage into the second stage, effectively leaving out any sensitive information, such as temporary credentials, used in the first stage. At the end of the blog post, you can find an example of a multi-stage build for a Python application.

9. **Try using scratch images as much as possible**. Scratch images are essentially empty and contain no operating system or shell. This minimizes the avenues an attacker has to run commands, launch utilities like curl or wget, or use package managers. The lack of an operating system also leaves the attacker uncertain about the system's specifics, further enhancing your container's security.

### Stage 3. Run-Time Level

1.  **Use read-only systems** where possible to reduce the attacker landscape. Provide access for editing to limit the intruder's chances of altering your files or downloading additional tools. 

2.  **Use a run-time scanner and intrusion detection system** like AWS GuardDuty to monitor system calls and network traffic so you could be alerted about suspicious activity sooner.

3.  **Drop all Linux capabilities** at the orchestration level.

4.  **Set up CPU / Memory limits** to discover when the workload suddenly increases and prevent DOS/OOM on Node/Java. This also saves your budget.

5.  **Set up a reliable process** for accessing your secrets from a container. If you deliver credentials as environment variables, they could be read unless you run a root. Consider allowing an app to read them directly by letting it know where they are stored. However, it may complicate local testing. You could also make a fallback: if there are environment variables, read them; if not, source them from a secrets management system like AWS Secrets Manager or HashiCorp Vault. 

### Stage 4. Long-Term Security Defense Layering

The following initiatives should be carried out regularly to ensure your container is secured in the long term.

1.  **Rebuild images regularly**, even if there are no changes to the app, to ensure the latest updates and CVE fixes for tools and app libraries.

2.  **Sign images and do not allow unsigned ones**. It complicates downloading some extras from the Docker hub and running them. Ensure you are enforcing verified images.

3.  **Replicate images to another region** so you have a backup in case of an outage. Instead of quickly building an app in another region, it's best to reuse the existing one with different flags.

4.  **Container registry immutable tags**.

5.  **Drop canary tokens to containers** to spot intrusion early.


### FivexL's base images:
We have developed a set of base images tailored for Go, Python, and Node 20, designed to enhance security and efficiency. These images have been meticulously crafted to meet high standards of security and performance. We invite you to take advantage of these resources for your projects. You can easily access and use these images by visiting our GitHub repository at https://github.com/fivexl/secure-container-image. We believe these images will provide a solid foundation for your applications and contribute significantly to your container security strategy.

### Examples:
Note: The code examples shown below might be outdated. For the latest version, please refer to the following files:
- [Dockerfile.base](https://github.com/fivexl/secure-container-image/blob/main/Dockerfile.base)
- [Dockerfile.goapp](https://github.com/fivexl/secure-container-image/blob/main/examples/go_app_example/Dockerfile.goapp)


Additionally, you can find more examples of Python and Node.js apps in the [examples](https://github.com/fivexl/secure-container-image/tree/main/examples) directory of our repository.

#### Base Image Creation Example:
```dockerfile
# https://github.com/fivexl/secure-container-image/blob/main/Dockerfile.base
ARG ALPINE_VERSION=3.18

### LOADER IMAGE ###
FROM public.ecr.aws/docker/library/alpine:${ALPINE_VERSION} as loader
WORKDIR /loader

# Get lastest updates for pre-installed packages
# to deal with potential CVEs
# hadolint ignore=DL3017
RUN apk upgrade --no-cache

# Install required base software
RUN apk --no-cache add build-base=~0.5 dumb-init=~1 git=~2 wget=~1 tzdata=~2023c ca-certificates=~20230506 && update-ca-certificates && rm -rf /var/cache/apk/* /tmp/*

# add a user here because addgroup and adduser are not available in scratch
ENV APP_USER_NAME=app
ENV APP_USER_ID=2323
ENV APP_USER_HOME=/app

## Create app user/group/home
RUN addgroup --gid ${APP_USER_ID} ${APP_USER_NAME} \
    && adduser --home ${APP_USER_HOME} --disabled-password --uid ${APP_USER_ID} --ingroup ${APP_USER_NAME} ${APP_USER_NAME} \
    && cp /etc/group /loader/group && cp /etc/passwd /loader/passwd 

## Remove unnecessary accounts, excluding current app user and root
RUN sed -i -r "/^($APP_USER_NAME|root|nobody)/!d" /loader/group \
  && sed -i -r "/^($APP_USER_NAME|root|nobody)/!d" /loader/passwd 

# TLS/SSL
## https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html
RUN wget --quiet https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem -O /etc/ssl/certs/aws-rds.crt \
   && cat /etc/ssl/certs/aws-rds.crt >> /etc/ssl/certs/ca-certificates.crt

# Health Check Tool
## lProbe check tool: https://github.com/fivexl/lprobe
COPY --from=ghcr.io/fivexl/lprobe:0.0.7 /lprobe lprobe

USER app
RUN mkdir -m 0700 /tmp/tmp
### RUN IMAGE ###
FROM scratch

# Copy files
COPY --from=loader /loader/group /etc/group 
COPY --from=loader /loader/passwd /etc/passwd 
COPY --from=loader /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=loader /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=loader /etc/os-release /etc/os-release
COPY --from=loader /loader/lprobe /usr/bin/lprobe
COPY --from=loader --chown=app:app --chmod=0700 /tmp/tmp /app/tmp

# Set ENV
ENV PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ENV TMPDIR="/app/tmp/"
ENV SSL_CERT_FILE="/etc/ssl/certs/ca-certificates.crt"

USER app
WORKDIR /app
```

#### Go App Creation Example Using Base Image:

```dockerfile
# https://github.com/fivexl/secure-container-image/blob/main/examples/go_app_example/Dockerfile.goapp
ARG ALPINE_VERSION=3.18
ARG BASE_IMAGE_VERSION=latest

# build stage
FROM golang:1.20.5-alpine${ALPINE_VERSION} AS builder
WORKDIR /app
COPY ./gosrc/main.go /app
RUN go mod init github.com/fivexl/secure-container-image/gosrc && go build -o app

# Actual runtime image
# For testing purposes we are using the 'latest' tag, but for production, we recommend using a specific version. For example:
#    ARG BASE_IMAGE_TAG=46fd9edb1422ec7610e3ba3ac0b7d40d46e48f4e
#    FROM ghcr.io/fivexl/fivexl/secure-container-image-base:${BASE_IMAGE_TAG} AS runtime
FROM ghcr.io/fivexl/secure-container-image-base:${BASE_IMAGE_VERSION}
COPY --from=builder /app/app /app/app
EXPOSE 8080
ENTRYPOINT ["/app/app"]
HEALTHCHECK --interval=1m --timeout=3s \
  CMD ["lprobe", "-mode=http", "-endpoint=/", "-port=8080"]
```

## Summing Up

The provided set of instructions allows you to layer up your defense strategy for compilable binary apps. As a result, it will be much harder for an intruder to wander around your app, which often makes them abandon an attack. Besides, the provided measures facilitate attack detection, which helps you proactively address it.
