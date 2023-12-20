---
title: 'FivexL Container Hardening Guide for Binary Compilable Apps'
author_id: 'Vladimir-Samoylov'
summary: 'Do you want the security of your binary app to excel by adding a couple of defense layers? Read our guide on container hardening for binary compilable apps.'
date: 2023-03-30
author: Vladimir Samoylov
panel_image: container.png
tags: [ 'aws', 'open source', 'container', 'guide']
---
In this guide, we will elaborate on some best practices to improve the depth of your security. This should serve as the foundation for regular security audits of your compiled binary application.


Please, note that to outplay an intruder, you need to think like an intruder. In most cases, the attack viability is down to simple math: it takes place if the efforts and expenditures are lower than a potential profit. Here's why you need to become a complex and highly costly target for massive purposeless attackers in order to abandon your defense lawyers.

If, however, APTs (Advanced Persistent Threats) target you specifically and are willing to spend a lot of time and resources on this, you need to set up as many defense layers as possible to increase your chances of attack detection. 

Please note that the code samples may be outdated. For the most recent examples, refer to the links at the end of this blog, links at the top of code samples, or directly to our [repository](https://github.com/fivexl/secure-container-image).

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
        uses: actions/checkout@v2

      - uses: hadolint/hadolint-action@v3.1.0
        with:
          dockerfile: Dockerfile.base-python3-distroless-debian-11
```

2. **Run a CVE Check to detect vulnerabilities**. Tools like Snyk, or Trivy can be used to scan your container images for known vulnerabilities. These tools cross-reference your image against various CVE databases and provide a report, helping you to remediate any potential security issues.

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

### Thoughts on Interpreters
In containerized environments, enhancing security is crucial, particularly when dealing with interpreters for languages like JavaScript or Python. The presence of these interpreters can be a vulnerability, as attackers who manage to penetrate a container might use them to execute arbitrary code. This could lead to a broader compromise of the system. To mitigate these risks, we reccomend to use next strategies:

#### Convert Scripts to Executables:

For **JavaScript**, use tools like [pkg](https://github.com/vercel/pkg) or [nexe](https://github.com/nexe/nexe) to create standalone executables. This approach reduces the attack surface by eliminating the need for Node.js runtime in the container.
For **Python**, tools like [PyInstaller](https://github.com/pyinstaller/pyinstaller) or [Nuitka](https://github.com/Nuitka/Nuitka) can compile scripts into binaries, removing the necessity for a Python interpreter.

#### Use Minimal Base Images:
Opt for 'scratch' images in your containers. These images contain only the essential binaries and libraries, significantly reducing potential vulnerabilities.

#### Benefits and Considerations:
This method effectively reduces the attack surface and simplifies deployment processes. However, it may not always be feasible, and even when using scratch images, it's crucial to continue adhering to best practices for container security. 

### Stage 2. Build Level

This set of recommendations is simple to complete and can be performed within a workday. It mostly focuses on adjusting the Docker Image. Here are some initiatives, categorized from simple to complex. 

1.  **Use verified images** to get your deps from trusted sources only. Before downloading some random docker image, ensure its creator is real and reliable: check the official site, etc. This way, you can eliminate the risk of downloading an image with malicious code. Additionally, some image distributors, like Distroless, offer the opportunity to verify the image's integrity using tools such as cosign.

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
    ```dockerfile
    # https://github.com/fivexl/secure-container-image/blob/main/examples/python_examples/Dockerfile.py-app-poetry#L7
    ARG POETRY_VERSION=1.6.1
    ARG LIBPYTHON3_VERSION=3.9.2-3
    ARG GCC_VERSION=4:10.2.1-1
    ARG PYTHON3_VERSION=3.9.2-3
    ARG PYTHON3_PIP_VERSION=20.3.4-4+deb11u1

    RUN apt-get update && \
      apt-get install --no-install-suggests --no-install-recommends --yes \
      python3=${PYTHON3_VERSION} \
      python3-pip=${PYTHON3_PIP_VERSION} \
      gcc=${GCC_VERSION} \
      libpython3-dev=${LIBPYTHON3_VERSION} && \
      apt-get clean && \
      rm -rf /var/lib/apt/lists/* && \
      pip install --no-cache-dir "poetry==${POETRY_VERSION}"
    ```

    Additionally, it is advisable to use a specific version of the image instead of the 'latest' tag. By doing so, you can minimize the risk of inadvertently downloading a new version that may contain unacknowledged CVEs or bugs.

    ```dockerfile
    # https://github.com/fivexl/secure-container-image/blob/main/examples/python_examples/Dockerfile.py-app-poetry#L37
    ARG PYTHON_RUNTIME_IMAGE_TAG=8de1677ee50c24eb7dfdbca400a4892cc9de4d75
    FROM ghcr.io/fivexl/secure-container-image-base-python3-distroless-debian-11:${PYTHON_RUNTIME_IMAGE_TAG} AS runtime
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
    # https://github.com/fivexl/secure-container-image/blob/main/Dockerfile.base-python3-distroless-debian-11#L39
    # Loader image:
    FROM debian:${DEBIAN_VERSION} as loader
    # Install lprobe
    COPY --from=ghcr.io/fivexl/lprobe:0.0.8 /lprobe lprobe
    
    # Runtime image:
    FROM ghcr.io/fivexl/secure-container-image-base-python3-distroless-debian-11:${PYTHON_RUNTIME_IMAGE_TAG} AS runtime

    # Copy lprobe from loader image
    COPY --from=loader /lprobe /usr/bin/lprobe
    # Set lprobe as health check
    HEALTHCHECK --interval=1m --timeout=3s \
    CMD ["lprobe", "-mode=http", "-endpoint=/", "-port=80"]
    ```

6.  **Run containers as a non-root user**. Link Dockerfiles to look for the USER directive and fail the build if it's missing. Example of setting up a user, and copying it from the loader image:
    ```dockerfile
    # https://github.com/fivexl/secure-container-image/blob/main/Dockerfile.base-python3-distroless-debian-11#L20
    # Set user information
    ENV APP_USER_NAME=app
    ENV APP_USER_ID=2323
    ENV APP_USER_HOME=/app

    # Create the user
    RUN groupadd -g ${APP_USER_ID} ${APP_USER_NAME} \
    && useradd -l -m -d ${APP_USER_HOME} -u ${APP_USER_ID} -g ${APP_USER_NAME} ${APP_USER_NAME} \
    
    # Prepare files for the runtime image
    && cp /etc/group /loader/group && cp /etc/passwd /loader/passwd 

    # Copy the user from the loader image
    FROM gcr.io/distroless/python3-debian11:${DISTROLESS_VERSION}
    COPY --from=loader /loader/group /etc/group 
    COPY --from=loader /loader/passwd /etc/passwd
    
    # Set the user
    USER app
    ```
    Additionally, some distributions, like Distroless, offer the option to run containers as a non-root user by default. You can achieve this by using the "nonroot" tag in the image.
    ```dockerfile
    FROM gcr.io/distroless/python3-debian11:nonroot
    ```


7.  **Add fake files to trick an intruder and get an alert**. When building, add an ls or wget utility that will run differently from the expected command, for example, exit 1, which means the container falls once the utility is run. Besides, add canary.tools or honeypot tools that create tokens. When they are used, you will receive a notification which is useful for spotting an attack without an intrusion detection system.  

8. **Consider Using Multi-Stage Builds**: Multi-stage builds are an effective way to enhance container security. In the first stage, you can use any verified image with specific dependencies to build your binary application. For the second stage, opt for a base image that is either a scratch image devoid of additional files or a minimal distroless image. This strategy ensures that your final Docker image is free of unnecessary data and potential secrets. To execute this, copy only the compiled application and essential runtime files from the first stage into the second stage, effectively leaving out any sensitive information, such as temporary credentials, used in the first stage. In the end of the blog post, you can find an example of a multi-stage build for a Python application.

9. **Try using scratch images as much as possible**. Scratch images are essentially empty and contain no operating system or shell. This minimizes the avenues an attacker has to run commands, launch utilities like curl or wget, or use package managers. The lack of an operating system also leaves the attacker uncertain about the system's specifics, further enhancing your container's security.

### Stage 3. Run-Time Level

1.  **Use read-only systems** where possible to reduce the attacker landscape. Provide access for editing to limit the intruder's chances of altering your files. 

2.  **Use a run-time scanner and intrusion detection system** like GuardDuty to monitor system calls. It's useful to notice suspicious actions in a container instantly.

3.  **Drop all Linux capabilities** at the orchestration level.

4.  **Set up CPU / Memory limits** to discover when the workload suddenly increases and prevent DOS on Node. This also saves your budget.

5.  **Set up a reliable process** for accessing your secrets from a container. If you hide credentials as environment variables, they could be read unless you run a root. Consider allowing an app to read them directly by letting it know where they are stored. However, it may complicate local testing. You could also make a fallback: if there are environment variables, read them; if not, source them from production. 

### Stage 4. Long-Term Security Defense Layering

The following initiatives should be carried out regularly to ensure your container is secured in the long term.

1.  **Rebuild images regularly**, even if there are no changes to the app, to ensure the latest updates and CVE fixes for tools and app libraries.

2.  **Sign images and do not allow unsigned ones**. It complicates downloading some extras from the Docker hub and running them. Ensure you are enforcing verified images.

3.  **Replicate images to another region** so you have a backup in case of an outage. Instead of quickly building an app in another region, it's best to reuse the existing one with different flags.

4.  **Container registry immutable tags**.

5.  **Drop canary tokens to containers** to spot intrusion early.


### FivexL's base images:
We has developed a set of base images tailored for Go, Python, and Node 20, designed to enhance security and efficiency. These images have been meticulously crafted to meet high standards of security and performance. We invite you to take advantage of these resources for your projects. You can easily access and use these images by visiting our GitHub repository at https://github.com/fivexl/secure-container-image. We believe these images will provide a solid foundation for your applications and contribute significantly to your container security strategy.

### Examples:
Note: The code examples shown below might be outdated. For the latest version, please refer to the following files:

- [Dockerfile.base-python3-distroless-debian-11](https://github.com/fivexl/secure-container-image/blob/main/Dockerfile.base-python3-distroless-debian-11)
- [Dockerfile.py-app-poetry](https://github.com/fivexl/secure-container-image/blob/main/examples/python_examples/Dockerfile.py-app-poetry)

Additionally, you can find more examples for Go and Node.js apps in the [examples](https://github.com/fivexl/secure-container-image/tree/main/examples) directory of our repository.

#### Base Image Creation Example:
```dockerfile
# Arguments
ARG DEBIAN_VERSION=12
ARG DISTROLESS_VERSION=nonroot

### LOADER IMAGE ###
FROM debian:${DEBIAN_VERSION} as loader
WORKDIR /loader

# Update and install required base software
# hadolint ignore=DL3008
RUN apt-get update && apt-get upgrade -y \
    && apt-get install --no-install-recommends -y build-essential dumb-init wget tzdata ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Get the latest updates for pre-installed packages
# to deal with potential CVEs
# hadolint ignore=DL3009
RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

# User setup
ENV APP_USER_NAME=app
ENV APP_USER_ID=2323
ENV APP_USER_HOME=/app

# Create app user/group/home
RUN groupadd -g ${APP_USER_ID} ${APP_USER_NAME} \
    && useradd -l -m -d ${APP_USER_HOME} -u ${APP_USER_ID} -g ${APP_USER_NAME} ${APP_USER_NAME} \
    && cp /etc/group /loader/group && cp /etc/passwd /loader/passwd 

# Remove unnecessary accounts, excluding current app user and root
RUN sed -i -r "/^($APP_USER_NAME|root|nobody)/!d" /loader/group \
    && sed -i -r "/^($APP_USER_NAME|root|nobody)/!d" /loader/passwd 

# TLS/SSL for AWS RDS
RUN wget --quiet https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem -O /etc/ssl/certs/aws-rds.crt \
    && cat /etc/ssl/certs/aws-rds.crt >> /etc/ssl/certs/ca-certificates.crt

# Health Check Tool
COPY --from=ghcr.io/fivexl/lprobe:0.0.8 /lprobe lprobe

USER app
RUN mkdir -m 0700 /tmp/tmp

### RUN IMAGE ###
FROM gcr.io/distroless/python3-debian11:${DISTROLESS_VERSION}

# Copy necessary files from loader
COPY --from=loader /loader/group /etc/group 
COPY --from=loader /loader/passwd /etc/passwd 
COPY --from=loader /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=loader /etc/os-release /etc/os-release
COPY --from=loader /loader/lprobe /usr/bin/lprobe
COPY --from=loader --chown=app:app --chmod=0700 /tmp/tmp /app/tmp

# Set ENV
ENV PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ENV TMPDIR="/app/tmp/"
ENV SSL_CERT_FILE="/etc/ssl/certs/ca-certificates.crt"

# Set user
USER app
WORKDIR /app
```

#### Python App Creation Example Using Base Image:

```dockerfile
ARG DEBIAN_VERSION=11

ARG PYTHON_RUNTIME_IMAGE_TAG=b67186b00dc766a298ceb9dd981ef02ae0530c29

FROM debian:${DEBIAN_VERSION} AS build

ARG POETRY_VERSION=1.6.1
ARG LIBPYTHON3_VERSION=3.9.2-3
ARG GCC_VERSION=4:10.2.1-1
ARG PYTHON3_VERSION=3.9.2-3
ARG PYTHON3_PIP_VERSION=20.3.4-4+deb11u1

RUN apt-get update && \
  apt-get install --no-install-suggests --no-install-recommends --yes \
  python3=${PYTHON3_VERSION} \
  python3-pip=${PYTHON3_PIP_VERSION} \
  gcc=${GCC_VERSION} \
  libpython3-dev=${LIBPYTHON3_VERSION} && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  pip install --no-cache-dir "poetry==${POETRY_VERSION}"

# Copy just the pyproject.toml and poetry.lock files to install dependencies
COPY ./py_src/pyproject.toml ./py_src/poetry.lock /

# Set up the virtualenv and install dependencies
RUN poetry config virtualenvs.create true && \
  poetry config virtualenvs.in-project true && \
  # Disable pip and setuptools installs in the virtualenv
  poetry config virtualenvs.options.no-pip true && \
  poetry config virtualenvs.options.no-setuptools true && \
  # Install dependencies
  poetry install


# Copy the rest of the project over and build the app
FROM ghcr.io/fivexl/secure-container-image-base-python3-distroless-debian-11:${PYTHON_RUNTIME_IMAGE_TAG} AS runtime


COPY --from=build /.venv /.venv
WORKDIR /app
COPY ./py_src ./app
EXPOSE 80

HEALTHCHECK --interval=1m --timeout=3s \
  CMD ["lprobe", "-mode=http", "-endpoint=/", "-port=80"]

ENTRYPOINT ["/.venv/bin/uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
```

## Summing Up

The provided set of instructions allows you to layer up your defense strategy for compilable binary apps. As a result, it will be much harder for an intruder to wander around your app, which often makes them abandon an attack. Besides, the provided measures facilitate attack detection, which helps you proactively address it.


### Thoughts on Interpreters
In containerized environments, enhancing security is crucial, particularly when dealing with interpreters for languages like JavaScript or Python. The presence of these interpreters can be a vulnerability, as attackers who manage to penetrate a container might use them to execute arbitrary code. This could lead to a broader compromise of the system. To mitigate these risks, we reccomend to use next strategies:

#### Convert Scripts to Executables:

For **JavaScript**, use tools like [pkg](https://github.com/vercel/pkg) or [nexe](https://github.com/nexe/nexe) to create standalone executables. This approach reduces the attack surface by eliminating the need for Node.js runtime in the container.
For **Python**, tools like [PyInstaller](https://github.com/pyinstaller/pyinstaller) or [Nuitka](https://github.com/Nuitka/Nuitka) can compile scripts into binaries, removing the necessity for a Python interpreter.

#### Use Minimal Base Images:
Opt for 'scratch' or minimal base images in your containers. These images contain only the essential binaries and libraries, significantly reducing potential vulnerabilities.

#### Benefits and Considerations:
This method effectively reduces the attack surface and simplifies deployment processes. However, it may not always be feasible, and even when using scratch images, it's crucial to continue adhering to best practices for container security. 