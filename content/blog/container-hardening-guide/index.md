---
title: 'FivexL Container Hardening Guide'
author_id: 
  - 'Andrey Devyatkin'
  - 'Vladimir-Samoylov'
  - 'Anton Eremin'
summary: 'Comprehensive and continuously updated list of best practices for securing containerized workloads. From build to execution.'
date: 2024-02-15
author: Andrey Devyatkin Vladimir Samoylov Anton Eremin
panel_image: container.png
tags: [ 'aws', 'container', 'guide', 'security', 'docker', 'golang']
---
Nowadays, containers are everywhere, and we at FivexL work with containers with almost all of our customers. Thus, this guide is an attempt to capture the best practices to re-use them between the projects and make them available to the broader public. If you use this guide to become more secure - we all win. The safer the internet, the better it is for all of us using it. 

Let's think like an intruder. In most cases, the attack viability is down to simple math: it takes place if the efforts and expenditures are lower than a potential profit. Here's why you want to become a complex and highly costly target to attack, so opportunistic attackers would rather abandon attempts to attack you and move to an easier target.

If, however, you are the target of an APT (Advanced Persistent Threat, think state-level hacking group sophistication and resources) who is motivated to break in and have resources to keep trying, then hardening of your container images will make their life harder, and increase chances of attack detection.

Please note that the code samples may be outdated. For the most recent examples, refer to the links at the end of this blog, links at the top of code samples, or directly to our [repository](https://github.com/fivexl/secure-container-image).

### Stage 0. App Packaging for Enhanced Security in Containerized Environments

With compilable languages (such as Golang, Rust, C++, etc), the application is compressed into a single, statically linked binary. This can be placed into a scratch container image, which is an image without a shell, CLI tools, or libraries. When an intruder accesses such a container, the only thing that is present is an application binary. An attacker would lack the tools to download additional hacking software, extract secrets from memory, or move laterally. There will be no tools to hide their activity and [live off the land](https://www.crowdstrike.com/cybersecurity-101/living-off-the-land-attacks-lotl/). It would require a sophisticated and determined attacker to break out of such a container.

Well, there are also interpretable languages that necessitate a runtime, such as Python and JavaScript. In these environments, an attacker could run arbitrary code using an interpreter available in the container to download files, exfiltrate data, and attack other services. There are ways you can avoid it.

**Tools for transitioning from Scripts to Standalone Executables:**

- For JavaScript: Recently, some tools have emerged attempting to package JavaScript apps into single binaries, suggesting that, theoretically, we could achieve a similar isolation level as with compilable languages. However, not all packages are compatible with these tools, and most of these tools are not yet mature. For more information about packaging Node.js apps, refer to [this article](https://dev.to/midnqp/bundling-nodejs-into-single-executable-binary-l3g ). Tools to check are [pkg](https://github.com/vercel/pkg) or [nexe](https://github.com/nexe/nexe).

- For Python: Employ tools like [PyInstaller](https://github.com/pyinstaller/pyinstaller) or [Nuitka](https://github.com/Nuitka/Nuitka), [py2exe](https://pypi.org/project/py2exe/). These tools can transform Python scripts into executable binaries, eliminating the requirement for a Python interpreter within your Docker image. Another approach is to use CPython to compile the code into a static executable binary.

- For Java: Use [GraalVM](https://www.graalvm.org/latest/reference-manual/native-image/guides/build-static-executables/).

**Choose Minimal Base Images:** 

The shift to standalone executables opens the door to utilizing 'scratch' container images. These minimal base images are essentially empty, lacking a shell, CLI tools, or libraries. More info about creating images from 'scratch' can be found [here](https://docs.docker.com/build/building/base-images/#create-a-simple-parent-image-using-scratch). It's important to note that running containers with minimalistic images can lead to some drawbacks. While attackers won't have tools to explore the container, developers may lack debugging tools as well. This can become problematic if developers need to debug the production system. To get around this, you can create a debug version of the same container using a minimalistic base image like Alpine, Busybox, or Disroless. By temporarily deploying the debug image, developers can debug the system and then go back to the hardened version when they're done. However, it's generally more beneficial to invest in better logging and telemetry collection, so developers have all the information they need without having to exec into the running container.

### Stage 1. Pre-Build Level

During this stage, you will identify potential vulnerabilities that can be addressed in subsequent stages. There are several areas to examine, such as the source code itself, its dependencies (such as libraries), and the operating system packages. All of these components may contain vulnerabilities that need to be assessed.

1. **Vulnerabilities in the source code.** This guide does not cover AppSec, but a high-level recommendation is to use a language-specific static analysis tool and run it on every push to your version control system. For instance, GoSec can be used for Golang. If you are already on GitHub, we highly recommend using their Advanced Security package, which provides access to their CodeQL static code analysis tools. You may also combine multiple tools, such as GoSec and CodeQL, to complement each other. Although there is overlap between the two, they work together nicely.

2. **Vulnerabilities in the source code dependencies.** Make sure to configure tools like Renovate or Dependabot to keep your source code dependencies up-to-date and free of known vulnerabilities. Another tool that is being mentioned often is Snyk.

3. **Vulnerabilities in the operating system packages.** If you are using a scratch-based image, you don't have to worry about anything because there is no package manager available. However, if you are using any other image, there are scanners available. These scanners typically work on already-built container images, so we will address them later in the article.
 
4.  **Run Linter for a DockerFile**, for example, Hadolint, to ensure you create small, secure, efficient, and maintainable Docker images. If you fail to meet best practices, the tool will provide relevant alerts and recommendations.

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

### Stage 2. Build Level

This set of recommendations is simple to complete and can be performed within a workday. It mostly focuses on adjusting the Docker Image. Here are some initiatives, categorized from simple to complex. 

1. **Run a CVE Check to detect vulnerabilities in packages**. It is possible to scan your container images for known vulnerabilities in installed packages using tools such as AWS ECR, Snyk, or Trivy. These tools cross-check your image against various CVE databases and provide a report, which can help you identify and fix any potential security issues. However, it's important to note that these tools only look into package manager information. If you download a tool like jq via curl directly from Github, the scanners will not detect it. Therefore, if you need to add tools, it is advisable to do so via the package manager.

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
    
2.  **Use verified images**. Before downloading some random docker image, ensure its creator is real and reliable: check the official site, etc. This way, you can eliminate the risk of downloading an image with malicious code. Additionally, some image distributors, like Distroless, offer the opportunity to verify the image's integrity using tools such as cosign. If there is a link to GitHub that contains sources of the image then inspect the source. Another possible precaution might be to fork/copy the source repo and build the image yourself. This way, you make sure that you get what you see and nothing else is injected along the way. However, in this case, you would need to have automation to pull the latest source code changes to your copy/fork.

3. **Use Multi-Stage Builds**: [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/) are an effective way to enhance container security by discarding build history. In the first stage, you can use any verified image with specific dependencies to build your binary application. For the second stage, opt for a base image that is either a scratch image or a minimal distroless image. This strategy ensures that your final Docker image is free of unnecessary data and potential secrets. To execute this, copy only the compiled application and essential runtime files from the first stage into the second stage, effectively leaving out any sensitive information, such as temporary credentials, used in the first stage. At the end of the blog post, you can find an example of a multi-stage build for a Python application.

4.  **Use copy, instead of add a docker image**. ADD command is much more capable compared to COPY and you unintentionally could compromise your image. With great power comes great responsibility. Read more details [here](https://www.redswitches.com/blog/docker-add-vs-copy/).
    ```dockerfile
    # https://github.com/fivexl/secure-container-image/blob/main/Dockerfile.base#L43
    # Copy necessary files from loader image to runtime image
    COPY --from=loader /loader/group /etc/group 
    COPY --from=loader /loader/passwd /etc/passwd 
    COPY --from=loader /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
    COPY --from=loader /etc/os-release /etc/os-release
    COPY --from=loader /loader/lprobe /usr/bin/lprobe
    ```
   
4.  **Fix or pin all build dependencies** to avoid fetching the latest version by mistake. 

    Additionally, it is advisable to use a specific version of the image instead of the 'latest' tag. By doing so, you can minimize the risk of inadvertently downloading a new version that may contain unacknowledged CVEs, bugs, or breaking changes. 

    ```dockerfile
    # https://github.com/fivexl/secure-container-image/blob/main/examples/go_app_example/Dockerfile.goapp#L13
    ARG BASE_IMAGE_TAG=46fd9edb1422ec7610e3ba3ac0b7d40d46e48f4e
    FROM ghcr.io/fivexl/fivexl/secure-container-image-base:${BASE_IMAGE_TAG} AS runtime
    ```

5.  **Get rid of any valuable files on disk inside the container with .dockerignore and use secrets mount**. When you're creating an app, it's common to store important data like credentials that are necessary for testing or building the application. However, it's crucial to make sure that sensitive information like credentials, .env and .git files are cleaned up to prevent unauthorized access. It's recommended to use the .dockerignore file to skip these files. Be careful not to use the recursive copy option, as this can lead to unintended consequences. Additionally, if you need to pass secrets like access tokens or cloud keys to the build process, you can use the secret mount option for the docker build. Another option is to pass SSH agent mounts. Check out these links for more information: [secret mount option for docker build](https://docs.docker.com/build/building/secrets/) and [SSH agent mounts](https://docs.docker.com/build/building/secrets/#ssh-mounts). Example of .dockerignore content:
    ```dockerfile
    # Ignore Git directory
    .git/
    # Ignore all markdown files
    *.md
    # Ignore all .env files
    *.env
    *.env.*
    # Ignore credentials
    credentials.json
    # Ignore temporary files
    *.tmp
    ```

6.  **Use [lprobe](https://fivexl.io/blog/lprobe/) instead of wget/curl for Health Checks**. It's important to note that using the wget and curl commands can create an opportunity for intruders to download and execute additional hacking tools on your system. To avoid compromising your security, FivexL has developed an alternative called lprobe, which allows you to securely run health checks. This tool is limited to calling only localhost, making it a safer option for your system's security.
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

7.  **Run containers as a non-root user**. Running Docker containers as a non-root user is crucial for enhancing security. Containers executed with root privileges can provide attackers with access to the host system if they manage to exploit vulnerabilities within the container. This could lead to unauthorized access, data breaches, or even full control over the host system. By running containers with non-root users, you limit the permissions of processes within the container, thereby reducing the risk of host system compromise in case of an attack. This practice is part of the principle of least privilege, ensuring that processes operate with only the permissions they absolutely need, minimizing potential damage from breaches. Example of setting up a user, and copying it from the loader image:
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

8.  **Add fake files to trick an intruder and get an alert**. When building, add an ls or wget utility that will run differently from the expected command, for example, exit 1, which means the container falls once the utility is run. Besides, add canary.tools or other honeypot tools that create tokens. When they are used, you will receive a notification, which is useful for spotting an attack without an intrusion detection system.  

### Stage 3. Run-Time Level

At runtime, you can configure container orchestrators like AWS ECS or K8S to implement security measures to further harden your container setup.

1.  **Use read-only systems** where possible to limit the intruder's chances of altering your files or downloading additional tools. 

2.  **Use a run-time scanner and/or intrusion detection system** like AWS GuardDuty for AWS ECS or Falco to monitor system calls and network traffic so you can be alerted about suspicious activity sooner.

3.  **Drop all Linux capabilities** at the orchestration level if you do not need them.

4. **Set up CPU / Memory limits** to discover when resource consumption suddenly increases and prevent Denial of Service(DoS) or Out-of-memory (OOM) on memory-hungry languages such as Java. This also saves your budget.

5.  **Set up a reliable process for accessing your secrets from a container.** If you're deploying an application and you deliver your credentials as environment variables, it's important to know that if your container contains a shell, anyone could potentially run the `env` command and access all your environment variables, including your credentials. However, if you're using a scratch container, there is no shell, and reading environment variables becomes increasingly difficult if not impossible. Therefore, passing secrets to a scratch container might be a good enough level of security. 

If you're using an alpine or distroless image, you might want to consider instrumenting your application to read secrets directly from a secrets management system like AWS Secrets Manager or HashiCorp Vault. However, this approach may complicate local testing. You could also make a fallback plan: if there are environment variables available, use them; if not, source the secrets from a secrets management system. 

### Stage 4. Long-Term Security Defense Layering

The following initiatives should be carried out regularly to ensure your container is secured in the long term.

1.  **Rebuild images regularly.** It is advisable to rebuild and redeploy apps regularly, even if there are no changes to the source code, to ensure you have the latest security updates for system packages and app dependencies/libraries.

2.  **Sign images in CI and do not allow running unsigned ones**. Enforce the use of verified images to prevent attackers from running arbitrary images on your system. Read how to use AWS Signer [here](https://aws.amazon.com/blogs/security/best-practices-to-help-secure-your-container-image-build-pipeline-by-using-aws-signer/).

3.  **Replicate images to another region** so you have a backup in case of an outage. Instead of quickly building an app in another region, it's best to reuse the existing one with different flags.

4.  **Container registry immutable tags**. To prevent sneaky changes to already verified images. 


### FivexL's base images:
We have created some base images specifically optimized for Go, Python, and JavaScript/Node, which are aimed at improving both security and efficiency. These images have been designed with great care and attention to detail in order to meet high standards of security and performance. We would like to invite you to take advantage of these resources for your projects. You can easily access and use these images by visiting our GitHub repository at https://github.com/fivexl/secure-container-image. We believe that these images will give your applications a stable foundation and make a significant contribution to your container security strategy. Please note that the Python and JS images do not currently support static compilation, but we are considering adding them in the future. If you encounter any issues or have any suggestions for additional examples, please create an issue on the GitHub repository.

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

The set of instructions provided will help you add layers to your defense strategy for container images. This will make it much more difficult for intruders to navigate your systems, often causing them to give up on an attack. Additionally, these measures will aid in detecting attacks, allowing you to address them proactively.

## Other reading materials and considerations
- [Beware of npm/python credential-stealers post-install scripts](https://dev.to/qpwo/npm-install-actual-malware-1pmo)
