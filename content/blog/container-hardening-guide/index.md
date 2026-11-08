---
title: 'FivexL Container Hardening Guide'
author_id: 
  - 'Andrey Devyatkin'
  - 'Vladimir-Samoylov'
  - 'Anton Eremin'
summary: 'How we build and run hardened container images on AWS, from the base image to the running task, reviewed every quarter.'
date: 2026-11-07
author: Andrey Devyatkin Vladimir Samoylov Anton Eremin
panel_image: container.png
tags: [ 'aws', 'container', 'guide', 'security', 'docker', 'fivexl-way']
---
*Last reviewed: November 2026*

This guide is for engineers who build container images and run them on Amazon ECS or Kubernetes. It is opinionated: each practice says what we do, why, and how, with a snippet you can copy.

Most attacks are a matter of cost. An opportunistic attacker sprays a fresh CVE across the internet and keeps whatever breaks easily. Suppose the break-in leaves them in a container with no shell, no package manager, no download tools, no writable filesystem, no network route out and no useful credentials. Then every next step costs real work, and most of them move on to an easier target. A determined attacker with resources will keep going. For them, the same controls slow each step down and make each step visible to your detection.

The guide reflects how we build our own images. The base images, example Dockerfiles and CI live in [github.com/fivexl/secure-container-image](https://github.com/fivexl/secure-container-image). That repository also ships an Agent Skill that applies the Build practices to an existing Dockerfile; see [Let an Agent Apply These Practices](#let-an-agent-apply-these-practices).

The guide has two parts. **Build** covers what goes into the image and how the pipeline produces it. **Run** covers how the orchestrator, the network and your detection treat the container once it starts. The checklist below is the short version and the table of contents. The [Changelog](#changelog) at the end records each quarterly review.

## Checklist

**Build**

- [Start from a minimal base image](#start-from-a-minimal-base-image): no shell, no package manager, no download tools; keep `:debug` and `-dev` tags out of production.
- [Remove the reasons a shell stays](#remove-the-reasons-a-shell-stays): rewrite entrypoint scripts in Go and probe health with lprobe.
- [Use multi-stage builds](#use-multi-stage-builds): the compiler and build tools never reach the runtime image.
- [Keep build secrets out of the image](#keep-build-secrets-out-of-the-image): secret and SSH mounts, a `.dockerignore`, and OIDC instead of static keys in CI.
- [Run as a non-root user](#run-as-a-non-root-user-and-treat-the-base-contract-as-an-api): a numeric uid, and the base image's uid, entrypoint and paths treated as an API.
- [Use COPY and lint Dockerfiles](#use-copy-for-local-files-and-lint-dockerfiles-in-ci): Hadolint on every pull request.
- [Control what goes into the build](#control-what-goes-into-the-build): verify base signatures, pin CI actions to a SHA, checksum downloads, skip install scripts, wait 7 days for new releases.
- [Scan every image before it merges or ships](#scan-every-image-before-it-merges-or-ships): Trivy in a job without credentials, and waivers that expire.
- [Attach an SBOM and provenance, and sign the image](#attach-an-sbom-and-provenance-and-sign-the-image): cosign keyless or ECR managed signing, by digest.
- [Tag bases by major version and apps by build](#tag-bases-by-major-version-and-apps-by-build): never deploy `latest`; immutable tags in the registry.
- [Rebuild on a schedule](#rebuild-on-a-schedule-and-measure-time-to-patch): `--pull --no-cache` weekly or daily, and measure time to patch.
- [Plant canary tokens](#plant-canary-tokens): a decoy AWS key that alerts through the provider.
- [Never build or push by hand](#never-build-or-push-by-hand): only the CI role can push, even during an incident.

**Run**

- [Run with a read-only root filesystem](#run-with-a-read-only-root-filesystem): one small `noexec` tmpfs at `/tmp`.
- [Drop privileges](#drop-privileges-and-let-the-orchestrator-enforce-them): non-root, no capabilities, no privilege escalation, seccomp `RuntimeDefault`, enforced by admission.
- [Set resource limits](#set-resource-limits): memory, CPU, processes and local disk.
- [Make health checks prove something](#make-health-checks-prove-something-without-curl): startup, readiness and liveness each answer a different question.
- [Read secrets at runtime from the store](#read-secrets-at-runtime-from-the-store): rotation without a redeploy; dynamic credentials where possible.
- [Give each workload its own identity](#give-each-workload-its-own-identity): task role or Pod Identity, and IMDSv2 with hop limit 1.
- [Control egress](#control-egress): deny outbound traffic by default.
- [Remember that containers do not contain](#remember-that-containers-do-not-contain): no Docker socket, no privileged mode, no host namespaces.
- [Detect what happens at runtime](#detect-what-happens-at-runtime): GuardDuty Runtime Monitoring or Falco; alert on any shell.
- [Enforce signatures at deploy time](#enforce-signatures-at-deploy-time-and-pull-only-from-your-registry): and pull only from your own registry.
- [Rescan what runs](#rescan-what-runs-and-check-which-digest-runs): and check that the running digest matches the build record.
- [Choose a minimal host OS or a managed platform](#choose-a-minimal-host-os-or-a-managed-platform): Bottlerocket or Fargate.
- [Replicate images to the disaster-recovery region](#replicate-images-to-the-disaster-recovery-region): and prove signature checks pass there.
- [Debug without exec](#debug-without-exec): telemetry first, then a `-dev` image behind break-glass access.

## Build

### Start From a Minimal Base Image

An attacker who gets code execution in your container uses what the image gives them. A shell runs their one-liners. A package manager installs their tools. `curl` or `wget` fetches the second stage. Remove these and every step after the break-in has to be written and delivered by hand. Opportunistic attackers who spray a fresh CVE across the internet move on to an easier target.

Ship a runtime image with no shell, no package manager and no download tools. Use [distroless](https://github.com/GoogleContainerTools/distroless) when the app needs libc, CA certificates or an interpreter. Use `scratch` only for a fully static binary, and add CA certificates and a non-root user yourself.

Keep the troubleshooting variants out of production. Distroless `:debug` tags add a busybox shell, and so do the `-dev` tags of the FivexL images. They exist to swap in during an investigation, behind elevated permissions, and to swap out again; [Debug Without Exec](#debug-without-exec) shows how.

For Python and Node.js, use a maintained interpreter base instead of assembling a runtime yourself. A runtime you compile and copy in yourself is one more thing you must patch, and scanners often cannot see it. The FivexL bases cover three cases:

| Image | Tag | With the RDS CA bundle | With a shell, for debugging | For |
|---|---|---|---|---|
| `ghcr.io/fivexl/secure-container-image-base` | `debian13` | `debian13-rds` | none | Static binaries: Go with `CGO_ENABLED=0`, Rust with musl |
| `ghcr.io/fivexl/secure-container-image-base-python3` | `python3.13-debian13` | `python3.13-debian13-rds` | `python3.13-debian13-dev` | Python 3.13 apps |
| `ghcr.io/fivexl/secure-container-image-base-nodejs` | `node26-debian13` | `node26-debian13-rds` | `node26-debian13-dev` | Node.js 26 apps |

Each is Google distroless Debian 13 plus [lprobe](https://github.com/fivexl/lprobe), runs as uid 65532, and is rebuilt daily without cache. The tags are moving major tags: they follow patch releases and change only with the Debian or runtime major version. The `-rds` tags add the [AWS RDS global certificate bundle](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html) to the trusted CAs, so use them only when the app connects to Amazon RDS over TLS. The `-dev` tags add a busybox shell for troubleshooting.

A shell-less image raises the cost of an attack but does not stop one. An exploited Node.js or Python process can still open sockets and write files, which is why the Run part [controls egress](#control-egress) and [makes the root filesystem read-only](#run-with-a-read-only-root-filesystem).

#### Build the FivexL Bases Yourself

We publish these images, but the route we prefer for you is to build them yourself from the repository's Dockerfiles (`Dockerfile.base`, `Dockerfile.base-python3`, `Dockerfile.base-nodejs`). Then the image in your registry was produced by your pipeline, and you trust it for that reason instead of because of our name.

Building it yourself moves the trust question to the inputs. It does not remove it. The Dockerfiles consume an upstream distroless image, Debian packages and the lprobe image. Verify each input by digest and signer identity before you build, and build from the digest you verified:

```bash
# Needs cosign v3: the FivexL images are signed with cosign v3 bundles.
upstream=gcr.io/distroless/static-debian13
digest=$(docker buildx imagetools inspect "$upstream:nonroot" --format '{{json .Manifest}}' | jq -r .digest)
cosign verify "$upstream@$digest" \
  --certificate-identity keyless@distroless.iam.gserviceaccount.com \
  --certificate-oidc-issuer https://accounts.google.com

cosign verify ghcr.io/fivexl/lprobe:0.2.3 \
  --certificate-identity https://github.com/fivexl/lprobe/.github/workflows/ci.yml@refs/tags/v0.2.3 \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

The command returns the digest of the multi-platform image index, which is what the publisher signs. The Dockerfiles take no build arguments for their inputs. In your fork, pin each `FROM` line and the lprobe `COPY --from` to the digest you verified, for example `FROM gcr.io/distroless/static-debian13:nonroot@sha256:<digest>`, and let a bot update the pins.

Record the digests with the build. A signature tells you who built an image. It says nothing about whether the contents are safe, so [scan what you build](#scan-every-image-before-it-merges-or-ships).

If you consume our published images instead, verify them the same way: [Control What Goes Into the Build](#control-what-goes-into-the-build) has the command, and the [repository README](https://github.com/fivexl/secure-container-image#verify-an-image) has the identity.

If you used `secure-container-image-base` before November 2026, it moved from Alpine on `scratch` to distroless Debian 13, and its user changed from uid 2323 to 65532. Read [Migrating from the Alpine-Based secure-container-image-base](https://github.com/fivexl/secure-container-image#migrating-from-the-alpine-based-secure-container-image-base) before you switch. It covers `TMPDIR`, the RDS CA bundle (now only in the `-rds` tags), volume ownership and a one-line rollback.

#### Let an Agent Apply These Practices

The repository ships an Agent Skill, [`skills/secure-container`](https://github.com/fivexl/secure-container-image/tree/main/skills/secure-container), that applies the Build practices in this guide to an existing Dockerfile. It inspects the app first (runtime, native dependencies, subprocesses, signal handling, writable paths, ports) and proposes only the changes that apply. It asks before it edits. It then runs the image with hardened flags until the health check passes, and it reports any check it could not run. Review its changes like any other pull request.

### Remove the Reasons a Shell Stays

Teams that agree with "no shell" keep one anyway, for two reasons: the entrypoint script and the health check. Fix both and the shell can go.

**Entrypoint scripts.** A typical entrypoint reads environment variables, renders a config file with `envsubst` or `sed`, and then `exec`s the real process. That needs a shell, and it trusts its input: an `UPSTREAM_HOST` that contains a quote and a newline injects YAML into the config.

Rewrite the script as a small Go program. It validates every variable, writes the config, and replaces itself with the real process through `syscall.Exec`, so the server runs as PID 1 and receives `SIGTERM` directly. You can unit-test it in the build stage, which you cannot easily do with Bash. Porting a script used to cost more than the script was worth; a coding agent now does most of the work.

```go
package main

import (
	"fmt"
	"os"
	"strconv"
	"syscall"
)

func main() {
	port := os.Getenv("LISTEN_PORT")
	if port == "" {
		port = "8080"
	}
	if n, err := strconv.Atoi(port); err != nil || n < 1 || n > 65535 {
		fmt.Fprintf(os.Stderr, "LISTEN_PORT=%q is not a port number\n", port)
		os.Exit(2)
	}
	cfg := fmt.Sprintf("listen: %s\n", port)
	if err := os.WriteFile(os.TempDir()+"/app.yaml", []byte(cfg), 0o600); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	// Replace this process, so the server is PID 1 and gets SIGTERM directly.
	args := append([]string{"/app/server", "-config", os.TempDir() + "/app.yaml"}, os.Args[1:]...)
	if err := syscall.Exec(args[0], args, os.Environ()); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
```

The [Envoy example](https://github.com/fivexl/secure-container-image/tree/main/examples/envoy_example) in our repository is a complete version with tests. A script that only `exec`s the process with fixed arguments needs no replacement at all: put the command in an exec-form `ENTRYPOINT`.

**Health checks.** On ECS, the health check runs inside the container. The `CMD-SHELL` form needs a shell, and `curl` is exactly the download tool you removed. Use the exec form (`CMD`) with lprobe, a small probe binary that only connects to localhost. The FivexL bases ship it at `/usr/bin/lprobe`. [Make Health Checks Prove Something, Without `curl`](#make-health-checks-prove-something-without-curl) has the task definition and the Kubernetes probes.

**Prefer compiled languages for small services.** A Go or Rust service builds to one static binary that runs on the static base, with no interpreter in the image. Coding agents have narrowed the prototyping speed gap that made teams pick Python and Node.js, while the interpreter stays in the image for the life of the service. Tools that bundle a script into a single executable (PyInstaller, Nuitka, pkg) still carry the interpreter inside. A compiled binary is not secure by itself: its dependencies still need updates and scanning.

### Use Multi-Stage Builds

A compiler, a package manager and a full OS in the runtime image are all attack surface and patch work, and none of them is needed to run the app. A single-stage build also leaves build-time files, caches and test fixtures in the layers.

Build in one stage with the full toolchain, then copy only the artifact into a runtime stage on the minimal base. The final image contains only the layers of its own stage. Earlier stages, their history and their caches do not reach it.

For a static Go binary, build with `CGO_ENABLED=0`, because the static base has no libc. For Python, the build stage must use the same interpreter and ABI as the runtime, or native wheels such as pandas fail to load. Our [Python example](https://github.com/fivexl/secure-container-image/tree/main/examples/python_examples) builds the virtualenv on `debian:13` with Debian's own `python3`, which is the interpreter the distroless runtime ships. For Node.js, install with `npm ci --omit=dev` in the build stage and copy `node_modules` across.

The complete example below combines the Build practices in this part: a multi-stage build, a build secret, a non-root user and an exec-form health check.

```dockerfile
# syntax=docker/dockerfile:1

# CI passes the digest it resolved and verified: BASE=<image>:debian13@sha256:<digest>
ARG BASE=ghcr.io/fivexl/secure-container-image-base:debian13

# Build stage: the Go toolchain, module cache and token stay here.
FROM golang:1.27-trixie AS build
WORKDIR /src
ENV CGO_ENABLED=0
COPY go.mod go.sum* ./
# The private-module token exists only while this step runs.
RUN --mount=type=secret,id=netrc,target=/root/.netrc,required=true \
    --mount=type=cache,target=/go/pkg/mod \
    GOPRIVATE='github.com/your-org/*' go mod download
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    go vet ./... && go test ./... \
    && go build -trimpath -ldflags="-s -w" -o /out/app .

# Runtime stage: one static binary on a shell-less, non-root base.
FROM ${BASE}
COPY --from=build /out/app /app/app
USER 65532:65532
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \
  CMD ["lprobe", "-mode=http", "-endpoint=/", "-port=8080"]
ENTRYPOINT ["/app/app"]
```

Build it locally with the token in a file:

```bash
docker buildx build --load --secret id=netrc,src="$HOME/.netrc" -t hello:local .
docker run --rm --read-only --cap-drop=ALL --security-opt=no-new-privileges -p 8080:8080 hello:local
```

Without `BASE`, the build uses the moving major tag. The [scanning workflow](#scan-every-image-before-it-merges-or-ships) builds this Dockerfile and passes the verified digest instead. Record the digest each build resolved to, and deploy the exact app digest you tested. [Tag Bases by Major Version and Apps by Build](#tag-bases-by-major-version-and-apps-by-build) covers that.

### Keep Build Secrets Out of the Image

Builds often need a credential: a token for private Go modules, an npm registry token, an SSH key for a private Git repository. The common shortcuts leak it.

- `--build-arg` values are recorded in the image history. Anyone who can pull the image reads them with `docker history --no-trunc`. They also appear in provenance attestations built with `mode=max`, which [Docker documents](https://docs.docker.com/build/metadata/attestations/slsa-provenance/) as exposing build argument values.
- `ENV` values are stored in the image config and shown by `docker inspect`.
- Copying a key into an early stage and deleting it later still leaves it in that stage's layer, in the build cache and on the builder.
Use BuildKit secret and SSH mounts instead. BuildKit is the [default builder since Docker Engine 23.0](https://docs.docker.com/engine/release-notes/23.0/) on Linux. A secret mount exposes the value to one `RUN` step, as a file under `/run/secrets/<id>` or as an environment variable. It is never written to a layer or [included in provenance](https://docs.docker.com/build/metadata/attestations/slsa-provenance/). Set `required=true` so a missing secret fails the build instead of producing a half-built image.

```dockerfile
# Token as a file at a path the tool expects:
RUN --mount=type=secret,id=netrc,target=/root/.netrc,required=true go mod download
# npm reads its token from .npmrc, so mount the whole file there:
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc,required=true npm ci --omit=dev
# Private Git over the caller's SSH agent (add the host key to known_hosts first):
RUN --mount=type=ssh,required=true git clone git@github.com:your-org/private-lib.git
```

Pass them on the command line with `--secret id=netrc,src=$HOME/.netrc`, `--secret id=npmrc,src=$HOME/.npmrc` and `--ssh default`. The `.npmrc` holds a line such as `//registry.npmjs.org/:_authToken=<token>`; an `NPM_TOKEN` variable alone does not authenticate npm. The mount targets `/root/.npmrc` because the build stage runs as root. Use the build user's home directory if your stage sets another `USER`. The [Docker build secrets guide](https://docs.docker.com/build/building/secrets/) lists every option. Hadolint rule [DL3064](https://github.com/hadolint/hadolint/wiki/DL3064) flags `ARG` and `ENV` names that look like credentials.

**Keep secrets out of the build context.** `COPY . .` copies whatever sits in the directory, including `.git` (with its history and any credentials in its config), `.env` files and cloud credential files. A `.dockerignore` file excludes them before they reach the builder:

```text
# Version control and editor state
.git
.github
.idea
.vscode
# Secrets and local credentials
.env
.env.*
.netrc
.npmrc
.aws
*.pem
*.key
credentials*.json
# Build output and build files
bin/
dist/
Dockerfile*
```

Prefer copying named paths (`COPY go.mod go.sum ./`, `COPY src/ ./src/`) over `COPY . .` where the layout allows it. Then a new file in the repository does not reach the image by accident.

**Use OIDC in the CI that builds and pushes.** A static AWS access key stored in a CI provider leaks when the provider does, and then you spend days proving it was not used. With OpenID Connect, the CI job exchanges a short-lived token for temporary credentials of an IAM role, so there is no stored key to steal. Only the job that pushes needs `id-token: write`. The `publish` job in the [scanning workflow](#scan-every-image-before-it-merges-or-ships) shows it.

The role's trust policy decides which workflows may assume it. Pin the `sub` claim to your repository and branch (or a GitHub environment), and give production its own role. A wildcard such as `repo:your-org/*` lets every repository in the organization push your images.

GitHub changed the default `sub` format. [Repositories created after 15 July 2026](https://docs.github.com/en/actions/reference/security/oidc), and repositories renamed or transferred after that date, use an immutable format that adds owner and repository IDs: `repo:your-org@123456/your-app@456789:ref:refs/heads/main`. Older repositories keep the name-only format until an admin opts in. GitHub Enterprise Server does not have the new format. A trust policy written for one format rejects the other, and the push fails with "Not authorized to perform sts:AssumeRoleWithWebIdentity". During a migration, accept both:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::111122223333:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": [
            "repo:your-org/your-app:ref:refs/heads/main",
            "repo:your-org@123456/your-app@456789:ref:refs/heads/main"
          ]
        }
      }
    }
  ]
}
```

Remove the name-only subject once the repository has moved to the new format. The [GitHub guide for AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws) covers the identity provider setup.

### Run As a Non-Root User, and Treat the Base Contract As an API

A process that runs as root in a container is root on the host if it breaks out through a kernel or runtime bug. As a non-root user, the same process also cannot write to system paths inside the container.

Set a numeric user in the image. The FivexL bases already run as `nonroot`, uid 65532. Repeat `USER 65532:65532` in your own runtime stage anyway, so the intent is visible in your Dockerfile and a later base change cannot silently switch it. Use the number, not a name. When a pod sets `runAsNonRoot: true` without `runAsUser`, the kubelet refuses to start an image whose user is a name, because it cannot prove the name is not root. Set ownership as you copy (`COPY --chown=65532:65532`) instead of a later `RUN chown`, which needs a shell and duplicates the files in a new layer. Listen on an unprivileged port such as 8080. Docker since 20.10 sets `net.ipv4.ip_unprivileged_port_start=0` in the container's network namespace ([moby#41030](https://github.com/moby/moby/pull/41030)), so a non-root process can bind port 80 there. Other runtimes and host networking keep the 1024 limit. Port 8080 works everywhere and needs no `NET_BIND_SERVICE` capability.

The image only sets the default. The orchestrator must enforce it with `runAsNonRoot` and `runAsUser` on Kubernetes, or `user` in the ECS container definition. [Drop Privileges and Let the Orchestrator Enforce Them](#drop-privileges-and-let-the-orchestrator-enforce-them) shows both.

A base image has a contract with every Dockerfile and task definition built on it: the uid, the entrypoint, the working directory and the paths of the tools it ships. For the FivexL bases that contract is:

- user `nonroot`, uid and gid 65532;
- `WORKDIR /app`, owned by 65532;
- `TMPDIR=/tmp`;
- lprobe at `/usr/bin/lprobe`;
- for Node.js, `ENTRYPOINT ["/usr/bin/dumb-init", "--", "/nodejs/bin/node"]`, so `CMD ["server.js"]` works and `SIGTERM` reaches the app.

Treat that contract as an API. Changing any part of it breaks downstream images: a new uid makes files on persistent volumes unreadable, and a new entrypoint changes how every app starts. Version such a change as a breaking release, document the migration, and keep a rollback. We did this ourselves when the base moved from uid 2323 to 65532: the README has a migration section, and the last Alpine build stays pullable as `legacy-alpine`.

### Use COPY for Local Files, and Lint Dockerfiles in CI

`ADD` does more than copy. It fetches remote HTTPS and Git URLs, and it extracts local tar archives automatically. An `ADD vendor.tar.gz /app/` that looks like a copy unpacks whatever the archive contains, including paths you did not expect. Use `COPY` for files from the build context and from other stages; it does only that. Keep `ADD` for the one case it is built for, a remote artifact verified with `ADD --checksum=sha256:...`, which [Control What Goes Into the Build](#control-what-goes-into-the-build) covers.

Many Dockerfile mistakes in this part are mechanical, so let a linter catch them. [Hadolint](https://github.com/hadolint/hadolint) flags, among others:

- DL3020: `ADD` used for local files;
- DL3002: the last `USER` is root;
- DL3007 and DL3006: `FROM` with `latest` or no tag;
- DL3025: `CMD` or `ENTRYPOINT` in shell form, which needs a shell at runtime;
- DL3064: credential-like names in `ARG` or `ENV`.

Run it on every pull request and fail the job on findings. Pin the Hadolint image by digest, as you would any tool that runs in CI. This step is from our own pipeline:

```yaml
- name: Hadolint
  run: |
    docker run --rm -i hadolint/hadolint:v2.15.1@sha256:32dac94127fd60b7b7e3fbfc65e1383b9b5e25c9bfd7b8536de7a539fe68a12d < Dockerfile
```

BuildKit has its own checks too. `docker buildx build --check .` evaluates the Dockerfile without building it, and it needs no extra tool.

When you must waive a rule, waive it on the line with a reason. For example, put `# hadolint ignore=DL3008` above an `apt-get install` that floats on purpose so a no-cache rebuild picks up fixes. A waiver with a reason tells the next reader it was a decision.

### Control What Goes Into the Build

Every input to your build can carry an attacker's code into your image: the base image, a CI action, a binary you download, a package and its install script. Pinning and vetting are two separate jobs. A pin decides when you take a change. Vetting decides whether the thing you pinned deserves trust in the first place. You need both.

**Trust a base image by its maintainer.** Download counts and stars tell you nothing about who can push a new version. Pick bases whose maintainer you can name, who rebuilds them on a schedule, and who signs them. Then verify that signature by digest, naming the exact identity that must have signed it. A signature proves who built the image, not that anyone reviewed it, so the identity check is the part that matters. For a FivexL base:

```bash
image=ghcr.io/fivexl/secure-container-image-base
digest=$(docker buildx imagetools inspect "$image:debian13" --format '{{json .Manifest}}' | jq -r .digest)
cosign verify "$image@$digest" \
  --certificate-identity https://github.com/fivexl/secure-container-image/.github/workflows/family.yml@refs/heads/main \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

Docker Content Trust no longer covers this. Docker [retired it](https://www.docker.com/blog/retiring-docker-content-trust/) together with its Notary v1 service, so `DOCKER_CONTENT_TRUST=1` is not a verification step any more. Use cosign or Notation against the publisher's stated identity. If you [build the FivexL bases yourself](#build-the-fivexl-bases-yourself), verify their upstream inputs the same way.

**Pin third-party CI actions to a full commit SHA.** A Git tag is a pointer that the action's owner, or anyone with their credentials, can move. In March 2025 attackers moved the version tags of `tj-actions/changed-files` to a commit that dumped runner secrets into workflow logs; more than 23,000 repositories used it ([GHSA-mrrh-fwg8-r2c3](https://github.com/advisories/GHSA-mrrh-fwg8-r2c3)). In March 2026 attackers force-pushed 76 of 77 tags of `aquasecurity/trivy-action` and all 7 tags of `setup-trivy` to an infostealer ([GHSA-69fq-xp46-6x23](https://github.com/aquasecurity/trivy/security/advisories/GHSA-69fq-xp46-6x23)). The scanner that guarded those pipelines was the way in. Pin your scanner like any other action:

```yaml
- uses: aquasecurity/setup-trivy@81e514348e19b6112ce2a7e3ecbafe19c1e1f567 # v0.3.1
```

The comment keeps the version readable, and Dependabot or Renovate updates both. GitHub can [enforce SHA pinning](https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/) for an organization through the allowed-actions policy, so turn that on.

**Download binaries with a pinned version and a checksum.** When you add a tool outside a package manager, `ADD --checksum` makes the build fail if the file changes. Image scanners find packages through package-manager metadata. A C binary you copy in has none, so the scanner reports nothing for it, however old it is. Trivy reads the build info that Go embeds in its binaries, so Go tools stay visible ([Trivy Go coverage](https://trivy.dev/docs/latest/coverage/language/golang/)). For everything else, the pinned version in your Dockerfile is the only record. Our Node.js base copies `dumb-init`'s package record into the image for exactly this reason.

`RUN --network=none` runs a step with no network access. Download dependencies in one step, then compile and test with the network off, so a compromised build tool or test cannot fetch a payload or send your source anywhere.

```dockerfile
# syntax=docker/dockerfile:1

# CI passes the digest it resolved and verified: BASE=<image>:debian13@sha256:<digest>
ARG BASE=ghcr.io/fivexl/secure-container-image-base:debian13

FROM golang:1.27-trixie AS build
WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download
COPY . .
# Modules are already downloaded, so the compile step needs no network.
RUN --network=none CGO_ENABLED=0 go build -trimpath -o /out/app .

# A binary from outside a package manager: pinned version, verified checksum.
FROM scratch AS jq-amd64
ADD --checksum=sha256:b1c22172dd303f3be49e935aa56aa48a8b7a46e0bc838b4997d3bb451495870f \
    --chmod=0555 https://github.com/jqlang/jq/releases/download/jq-1.8.2/jq-linux-amd64 /jq
FROM scratch AS jq-arm64
ADD --checksum=sha256:8b85c817833814ddca00a144c33705546355afccf0cf39b188f3cdb48b852309 \
    --chmod=0555 https://github.com/jqlang/jq/releases/download/jq-1.8.2/jq-linux-arm64 /jq
FROM jq-${TARGETARCH} AS jq

FROM ${BASE}
COPY --from=jq /jq /usr/bin/jq
COPY --from=build /out/app /app/app
ENTRYPOINT ["/app/app"]
```

**Turn off dependency install scripts.** A `postinstall` script runs the moment `npm install` finishes, with your build's network and secrets. npm 12 stopped running dependency install scripts by default ([GitHub changelog](https://github.blog/changelog/2026-06-09-upcoming-breaking-changes-for-npm-v12/)). The `node:26` images still ship npm 11, so pass the flag yourself:

```dockerfile
FROM node:26-trixie-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Dependency install scripts never run here. npm 12 skips them by default;
# Node.js 26 still ships npm 11, so say it explicitly.
RUN npm ci --omit=dev --ignore-scripts

FROM ghcr.io/fivexl/secure-container-image-base-nodejs:node26-debian13
COPY --from=deps --chown=65532:65532 /app/node_modules /app/node_modules
COPY --chown=65532:65532 server.js /app/
CMD ["server.js"]
```

A package with a native addon will break. Build that one in its own step, and you will know exactly which code runs at install time. The flag does not cover code that runs when the app starts: a Python `.pth` file executes at interpreter start, not at install.

**Wait about 7 days before you take a new release.** Malicious releases of popular packages are usually caught and pulled within hours or days. A cooldown means your update bot does not open a pull request for a version younger than that. Dependabot already waits 3 days by default; raise it with [`cooldown`](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference). Security updates skip the cooldown in both tools, which is what you want: a fix for a known CVE should not wait a week.

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    cooldown:
      default-days: 7
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
    cooldown:
      default-days: 7
```

In Renovate, the same setting is [`minimumReleaseAge`](https://docs.renovatebot.com/configuration-options/), for example `"minimumReleaseAge": "7 days"`. Its default `vulnerabilityAlerts` config sets `minimumReleaseAge` to `null`, so security pull requests do not wait.

**Give locked dependencies their own update bot.** A no-cache rebuild picks up a new base and new OS packages. It does not move anything you pinned yourself: `package-lock.json`, `uv.lock`, `go.sum` or `apt-get install foo=1.2.3`. Those change only when a pull request changes them, so they need Dependabot or Renovate, with the cooldown above.

**Pull through a registry you control.** Mirror base images and packages through your own registry or proxy, for example an [ECR pull-through cache](https://docs.aws.amazon.com/AmazonECR/latest/userguide/pull-through-cache.html) for images and a package proxy for npm or PyPI. It gives you one place to block a bad version, a record of what came in, and builds that work when the upstream registry is down. Check that it can actually block a package; many proxies only report.

**Keep static analysis and SCA short and blocking.** Run a static analyser (CodeQL or Semgrep) and a dependency scan of your lockfiles (`trivy fs`, or Dependabot alerts) on every pull request. Make them fail the check, so developers see findings in the pull request rather than in a separate dashboard. This guide does not go deeper into AppSec.

Choose your builder with the same care. Google [archived Kaniko](https://github.com/GoogleContainerTools/kaniko) in June 2025, so do not start new pipelines on it. BuildKit (`docker buildx`) is the default builder in Docker Engine and is what the rest of this guide uses.

### Scan Every Image Before It Merges or Ships

A vulnerable package that never reaches the registry needs no incident. Run Trivy in CI on every pull request and on the main branch, and fail the build on fixable `HIGH` and `CRITICAL` findings. A finding in the pull request gets fixed by the person who caused it. The same finding in a weekly report gets triaged by someone else, later.

**Run the scanner in a job that holds no credentials.** The [Trivy action compromise](#control-what-goes-into-the-build) stole whatever the pipeline could reach, including package-publishing tokens. Put the scan in its own job with only `contents: read`: no registry login, no cloud role, no `id-token: write`. Build in one job, scan the exact image in a second, and push and sign in a third that runs only after the scan passes. The workflow below does that. It builds from a verified base digest, scans the result without credentials, then pushes and signs that same digest with short-lived credentials from GitHub OIDC.

```yaml
name: App image

on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: "0 4 * * 1" # weekly rebuild without cache
  workflow_dispatch:

permissions: {}

env:
  BASE_IMAGE: ghcr.io/fivexl/secure-container-image-base:debian13
  BASE_IDENTITY: https://github.com/fivexl/secure-container-image/.github/workflows/family.yml@refs/heads/main
  OIDC_ISSUER: https://token.actions.githubusercontent.com

jobs:
  build:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
    outputs:
      digest: ${{ steps.digest.outputs.digest }}
      tag: ${{ steps.digest.outputs.tag }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: sigstore/cosign-installer@756fe2d284c7292c4e9b62c8a28f1e5629c59532 # v4.1.3
      - uses: docker/setup-buildx-action@f87e5991a6d7451dcb8d9637bfbc97413f497069 # v4.4.1

      # Resolve the moving tag once, verify that digest, and build from it.
      - name: Resolve and verify the base
        id: base
        run: |
          set -euo pipefail
          digest=$(docker buildx imagetools inspect "$BASE_IMAGE" --format '{{json .Manifest}}' | jq -er .digest)
          cosign verify "${BASE_IMAGE%:*}@$digest" \
            --certificate-identity "$BASE_IDENTITY" --certificate-oidc-issuer "$OIDC_ISSUER" > /dev/null
          echo "ref=$BASE_IMAGE@$digest" >> "$GITHUB_OUTPUT"
          echo "Base: \`$BASE_IMAGE@$digest\`" >> "$GITHUB_STEP_SUMMARY"

      - name: Build
        uses: docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7.4.0
        with:
          context: .
          platforms: linux/amd64
          build-args: BASE=${{ steps.base.outputs.ref }}
          secrets: netrc=${{ secrets.GO_NETRC }}
          pull: true
          no-cache: ${{ github.event_name == 'schedule' }}
          sbom: true
          provenance: mode=max
          outputs: type=oci,dest=${{ runner.temp }}/image,tar=false

      - name: Record digest and tag
        id: digest
        run: |
          set -euo pipefail
          digest=$(jq -er '.manifests[0].digest' "$RUNNER_TEMP/image/index.json")
          echo "digest=$digest" >> "$GITHUB_OUTPUT"
          echo "tag=$(date -u +%Y%m%d-%H%M)-${GITHUB_SHA::12}" >> "$GITHUB_OUTPUT"
          echo "Image: \`$digest\`" >> "$GITHUB_STEP_SUMMARY"

      - uses: actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9 # v7.0.2
        with:
          name: image
          path: ${{ runner.temp }}/image
          if-no-files-found: error
          retention-days: 7

  # No registry, cloud or signing credentials here: a compromised scanner
  # has nothing to steal.
  scan:
    needs: build
    runs-on: ubuntu-24.04
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: actions/download-artifact@9000827ccba6bdab643e8b6fd33ac0654aef8333 # v8.0.2
        with:
          name: image
          path: ${{ runner.temp }}/image
      - uses: aquasecurity/setup-trivy@81e514348e19b6112ce2a7e3ecbafe19c1e1f567 # v0.3.1
        with:
          version: v0.76.2
          cache: true
      - name: Scan
        run: |
          trivy image --input "$RUNNER_TEMP/image" --severity HIGH,CRITICAL --ignore-unfixed \
            --ignorefile .trivyignore.yaml --exit-code 1

  publish:
    needs: [build, scan]
    if: ${{ github.ref == 'refs/heads/main' && github.event_name != 'pull_request' }}
    runs-on: ubuntu-24.04
    permissions:
      contents: read
      id-token: write # AWS role and keyless signing; no static keys
    env:
      DIGEST: ${{ needs.build.outputs.digest }}
      TAG: ${{ needs.build.outputs.tag }}
    steps:
      - uses: actions/download-artifact@9000827ccba6bdab643e8b6fd33ac0654aef8333 # v8.0.2
        with:
          name: image
          path: ${{ runner.temp }}/image
      - name: Check the artifact is the image that was built
        run: |
          test "$(jq -er '.manifests[0].digest' "$RUNNER_TEMP/image/index.json")" = "$DIGEST"
      - uses: aws-actions/configure-aws-credentials@e1253824e5c10ff9df46874f81ed3ec929e19cfd # v6.3.0
        with:
          role-to-assume: ${{ vars.AWS_PUBLISH_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      - id: ecr
        uses: aws-actions/amazon-ecr-login@03f1aad4c6c7ffd436567f42f9384779290529bd # v2.1.7
      - uses: oras-project/setup-oras@5e2f2482b30b0cb3e14e67f89a80c88c659a7c63 # v2.0.3
      - uses: sigstore/cosign-installer@756fe2d284c7292c4e9b62c8a28f1e5629c59532 # v4.1.3
      - name: Push and sign the scanned digest
        env:
          REPO: ${{ steps.ecr.outputs.registry }}/${{ vars.ECR_REPOSITORY }}
        run: |
          set -euo pipefail
          oras cp --from-oci-layout "$RUNNER_TEMP/image@$DIGEST" "$REPO:$TAG"
          cosign sign --yes "$REPO@$DIGEST"
          echo "Pushed \`$REPO:$TAG\` = \`$DIGEST\`" >> "$GITHUB_STEP_SUMMARY"
```

The build writes an OCI layout instead of pushing, so the scan job reads the image from a workflow artifact and never needs a registry login. `oras cp` pushes that layout without rebuilding it, so the digest in the registry is the digest Trivy scanned. Restrict the AWS role's trust policy to this repository's main branch, and grant it push to this one ECR repository only. The workflow builds the complete example from [Use Multi-Stage Builds](#use-multi-stage-builds), so it needs a repository secret `GO_NETRC` that holds the `.netrc` line for your private modules. Without private modules, drop the `secrets` input and the secret mount. Add your smoke tests to the scan job.

For more platforms, add them to `platforms` together with `docker/setup-qemu-action` or native arm64 runners. The scan step then has to change. On a multi-platform OCI layout, Trivy scans only the first platform image and ignores `--platform`. Give each platform manifest its own layout, scan every one, and fail the job if any scan fails:

```bash
set -euo pipefail
layout="$RUNNER_TEMP/image"
index="$layout/blobs/sha256/$(jq -er '.manifests[0].digest | ltrimstr("sha256:")' "$layout/index.json")"
status=0
while IFS= read -r m; do
  dir="$RUNNER_TEMP/scan-$(jq -r '.platform.architecture' <<<"$m")"
  mkdir -p "$dir" && cp "$layout/oci-layout" "$dir/" && ln -sfn "$layout/blobs" "$dir/blobs"
  jq -n --argjson m "$m" '{schemaVersion: 2, manifests: [$m]}' > "$dir/index.json"
  trivy image --input "$dir" --severity HIGH,CRITICAL --ignore-unfixed \
    --ignorefile .trivyignore.yaml --exit-code 1 || status=1
done < <(jq -c '.manifests[] | select(.platform.os == "linux")' "$index")
exit "$status"
```

**Cut noise with reachability.** Trivy reports a CVE when a vulnerable package is present, not when your code calls the vulnerable function. Its own docs warn that Go standard-library findings can be false positives for that reason. When a finding blocks you, check whether it is reachable: `govulncheck` traces Go call graphs, and some commercial scanners do the same for other languages. Record a "not affected" verdict as a VEX statement that Trivy reads with [`--vex`](https://trivy.dev/docs/latest/supply-chain/vex/), so the next person sees the reason.

**Make every waiver expire.** A permanent ignore entry outlives the reason for it. Trivy's `.trivyignore.yaml` takes an `expired_at` date, after which the finding fails the build again. This is the format our base image repository uses:

```yaml
# Every entry expires, so a finding comes back if upstream has not fixed it by then.
vulnerabilities:
  - id: CVE-2026-85091
    expired_at: 2026-11-21
    statement: Waiting for distroless to ship zlib1g 1+deb13u1
```

Pass the file with `--ignorefile`; Trivy does not load the YAML form on its own yet. Keep expiry dates short, two to four weeks, so someone checks whether upstream shipped the fix.

Scanning before merge does not replace scanning later. New CVEs are published against images that already run; see [Rescan What Runs and Check Which Digest Runs](#rescan-what-runs-and-check-which-digest-runs).

### Attach an SBOM and Provenance, and Sign the Image

When the next Log4j lands, the question is "which of our images contain this?". An SBOM answers it from the registry, without pulling and unpacking every image. A provenance attestation records which source, build arguments and builder produced the image. A signature lets your deploy path refuse anything your pipeline did not build.

**Generate attestations with BuildKit.** `docker buildx build --sbom=true --provenance=mode=max` attaches an SPDX SBOM and SLSA provenance to the image index. In Bake, set `attest = ["type=sbom", "type=provenance,mode=max"]` on the target, as our [`docker-bake.hcl`](https://github.com/fivexl/secure-container-image/blob/main/docker-bake.hcl) does. In `docker/build-push-action` the inputs are `sbom: true` and `provenance: mode=max`, as in the workflow above. `mode=max` includes build arguments, so never pass a secret as one (see [Keep Build Secrets Out of the Image](#keep-build-secrets-out-of-the-image)).

**Sign by digest, in CI.** Two options fit most AWS teams:

- **cosign keyless.** The CI job signs with a short-lived certificate tied to its GitHub OIDC identity, and the signature goes to the Sigstore transparency log. There is no key to store or rotate. Verifiers name the exact workflow identity and issuer, as in the [`cosign verify` example](#control-what-goes-into-the-build). Our bases are signed this way, and each platform image also carries a cosign-signed SPDX SBOM attestation.
- **[ECR managed signing](https://docs.aws.amazon.com/AmazonECR/latest/userguide/managed-signing.html).** ECR signs each image on push with an AWS Signer signing profile you choose, using Notation-format signatures. It needs no client tooling at push time, but verifiers need the Notation CLI or an admission controller that understands Notation. ECR signs with the identity of whoever pushed the image, so the signature means "someone allowed to push to this repository". Lock down who can push, or the signature proves little.

Pick one format per environment and [enforce it at deploy time](#enforce-signatures-at-deploy-time-and-pull-only-from-your-registry). Sign the digest, never a tag, because a tag can point somewhere else tomorrow.

### Tag Bases by Major Version and Apps by Build

Tags decide what gets deployed, so treat them as part of your security controls.

**Base images: a moving major tag.** A base is only useful if apps pick up its patches. We publish `debian13`, `python3.13-debian13` and `node26-debian13` on `ghcr.io/fivexl/secure-container-image-base{,-python3,-nodejs}`, and each moves to the newest build that passed scanning and tests. Apps that build `FROM` one of them get this week's patches without a daily pull request. A major-version tag never jumps to Debian 14 or Python 3.14 behind your back. Do not follow `latest`. We still publish it for compatibility, but it will change major versions when we do.

**Resolve the base digest once per build.** A moving tag can change between the moment you verify it and the moment you build from it. Resolve the tag to a digest at the start of the build and verify that digest. Build from it by passing `BASE=<image>:debian13@sha256:<digest>` as a build argument, and write it to the build log. The [scanning workflow](#scan-every-image-before-it-merges-or-ships) does all four. If you prefer a digest pinned in the Dockerfile, that works too, provided a bot updates the pin every week. A pin nobody updates means you carry library versions nobody chose.

**App images: an immutable tag per build.** Tag each app image with the build date and the commit SHA, for example `20261107-1432-3f9c2e71ab04`. The date keeps tags unique when a scheduled rebuild of the same commit picks up a new base. The SHA ties the image to its source. Never deploy `latest` or any other moving tag: two tasks started an hour apart can run different code, and a rollback has nothing fixed to return to.

**Make tags immutable in the registry.** In ECR, [tag immutability](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html) makes a push to an existing tag fail with `ImageTagAlreadyExistsException`:

```bash
aws ecr put-image-tag-mutability --repository-name app \
  --image-tag-mutability IMMUTABLE
```

If you mirror bases into your own ECR repository and need the major tags to move, keep the rest immutable with exclusion filters (up to five per repository):

```bash
aws ecr put-image-tag-mutability --repository-name base \
  --image-tag-mutability IMMUTABLE_WITH_EXCLUSION \
  --image-tag-mutability-exclusion-filters filterType=WILDCARD,filter=debian13 filterType=WILDCARD,filter=debian13-rds
```

**Deploy the digest you tested.** The tag is for people. The deployment should reference the digest that passed the scan and the tests, `app@sha256:...` or the immutable tag plus a digest check. The workflow writes both to the job summary, so the record of what was built is the record of what you deploy.

### Rebuild on a Schedule, and Measure Time to Patch

An image is a snapshot. The day after you build it, its packages start to age, and a floating base patches nothing until you rebuild and redeploy the image on top of it.

Rebuild bases and the apps on top of them on a schedule, weekly at least and daily if you can, with `--pull --no-cache`. `--pull` fetches the newest base for the tag. `--no-cache` reruns the package-install steps, so `apt-get upgrade` and friends actually run. You need both: `--no-cache` alone reuses the base you pulled last week, CA bundle included. In the [scanning workflow](#scan-every-image-before-it-merges-or-ships), the `schedule` trigger and `no-cache: ${{ github.event_name == 'schedule' }}` with `pull: true` do this. Our base repository rebuilds every image daily without cache and moves a tag only after the new build passes Trivy and smoke tests on both platforms.

A rebuild that nobody deploys is wasted. Let the scheduled build go through your normal deploy path, with its tests and approvals, so a patched image reaches production without anyone deciding to patch. This is the same path you will use in an emergency. When a critical CVE lands, the emergency process should be the routine one with the schedule removed: rebuild the base, trigger the app builds, deploy.

Then measure it on an ordinary day. Note when the base build finished (our images record it in the `org.opencontainers.image.created` label) and when the app built on that base digest started serving production traffic. That gap is your time to patch, and it is usually longer than teams guess, because of a manual approval, a weekly deploy window or a flaky test. Count failed rebuilds too: a pipeline that breaks every third week patches slower than its happy path suggests.

### Plant Canary Tokens

Assume someone will get in. A canary token turns their first step into your alert.

The most useful kind is a decoy AWS access key from a service such as [Canarytokens](https://docs.canarytokens.org/guide/aws-keys-token.html). The key belongs to an account the provider controls and has no permissions. When anyone calls the AWS API with it, the provider's AWS logging sees the call and alerts you, usually within 2 to 30 minutes. The alert travels through the provider's infrastructure, so it works even when your container has no egress at all. A decoy URL or DNS name works the same way for attackers who probe internal endpoints.

Put the decoy where someone who loots the container will look, such as a credentials-style file under `/app/config/`. Keep it out of every place the AWS SDK reads credentials from: environment variables like `AWS_ACCESS_KEY_ID`, and `~/.aws/credentials` for the user the app runs as. A decoy there replaces the task or pod role, breaks your app and alerts on every request. Add a `secrets` entry with the file's path to `.trivyignore.yaml` so the scanner stops flagging the decoy. Note in your runbook which key went into which image, so an alert tells you where the attacker was.

**Advanced, optional: tripwire binaries.** Some teams replace `/bin/sh` or `/usr/bin/curl` with a small program that alerts when it runs. In a shell-less image this catches an exploit that expects a shell. Know three limits before you try it. A fake shell can confuse libraries that probe for `/bin/sh` and change their behaviour when they find one. The alert must leave the container, so it needs egress that your network policy may rightly deny. And an attacker who drives the app's own interpreter, through Python's `subprocess` or Node's `child_process` with a direct path or through plain API calls, never touches the tripwire.

### Never Build or Push by Hand

Every control above lives in the pipeline: the verified base digest, the scan, the attestations, the signature, the immutable tag. An image built on a laptop and pushed with a personal credential skips all of them, and nothing in the registry tells it apart from a real one.

So no person pushes to a production registry, ever. Give push rights only to the CI role, through OIDC, and remove `ecr:PutImage` and its upload actions from human roles. With [signature enforcement at deploy time](#enforce-signatures-at-deploy-time-and-pull-only-from-your-registry), a hand-pushed image fails to deploy anyway.

The rule matters most during an incident, when people under pressure skip the scan, push from a dirty working tree and lose track of what they deployed. If your pipeline is too slow for an emergency, fix that first. [Measure your time to patch](#rebuild-on-a-schedule-and-measure-time-to-patch). Keep a documented fast path through the same pipeline, such as a manual dispatch that skips the cooldown but not the scan or the signature.

## Run

### Run with a Read-Only Root Filesystem

An attacker who gets code execution in your app wants to write next: a second-stage binary, a web shell, a modified config file. A read-only root filesystem refuses every one of those writes. It also gives you a detection signal: your app logs to stdout and has no reason to write into its image, so a write attempt means something is wrong.

Most apps still need somewhere to write temporary files. Give them one small `tmpfs` at `/tmp`, mounted `noexec`, `nosuid` and `nodev`, and nothing else writable. `noexec` stops the kernel from executing a binary dropped there. It does not stop an interpreter that is already in the image from reading a script from `/tmp`, so `python3 /tmp/x.py` still runs on a Python base. That is one more reason to keep interpreters out of images that do not need them. Mount every volume the app only reads with `readOnly`, because the read-only root does not cover mounts.

Our bases set `TMPDIR=/tmp`, so most libraries already put temp files on that mount. Find every other path your app writes (caches, `.pyc` files, uploads, pid files) and point it at `/tmp` or give it its own volume.

**ECS** (container definition; the control lives in the task definition):

```json
"readonlyRootFilesystem": true,
"linuxParameters": {
  "tmpfs": [
    {
      "containerPath": "/tmp",
      "size": 64,
      "mountOptions": ["rw", "noexec", "nosuid", "nodev"]
    }
  ]
},
"mountPoints": [
  { "sourceVolume": "assets", "containerPath": "/app/assets", "readOnly": true }
]
```

**Kubernetes** (pod spec):

```yaml
containers:
  - name: app
    image: registry.example.com/app:2026-11-07-3f9c2e7
    securityContext:
      readOnlyRootFilesystem: true
    volumeMounts:
      - name: tmp
        mountPath: /tmp
      - name: config
        mountPath: /app/config
        readOnly: true
volumes:
  - name: tmp
    emptyDir:
      medium: Memory
      sizeLimit: 64Mi
  - name: config
    configMap:
      name: app-config
```

Platform notes:

- **ECS on Fargate** and ECS Managed Instances have supported `linuxParameters.tmpfs` since [January 2026](https://aws.amazon.com/about-aws/whats-new/2026/01/amazon-ecs-tmpfs-mounts-aws-fargate-managed-instances/). Before that, a Fargate task could only get a writable path from a bind-mount or EFS volume, neither of which takes mount options. A `tmpfs` uses the task's memory, so size the task for it.
- **Kubernetes** cannot mount an `emptyDir` with `noexec` today. Kubernetes 1.37 added a per-mount `bindMountOptions` field. It is alpha behind the `VolumeBindMountOptions` feature gate and needs CRI mount option support in the runtime ([Kubernetes docs](https://kubernetes.io/docs/concepts/storage/volumes/#bind-mount-options)), and EKS does not turn on alpha gates. Until it graduates, accept an executable `emptyDir` and rely on the other layers. Or use a generic ephemeral volume whose StorageClass sets `mountOptions: [noexec]`, if your CSI driver passes them through. That volume is disk, and slower to create.
- A memory-backed `emptyDir` counts against the container's memory limit. Set `sizeLimit` so a runaway write fails instead of getting the pod killed for memory.
- A `configMap` or `secret` volume is always mounted read-only. Set `readOnly: true` anyway, so the intent survives a later switch to another volume type.

For local testing, `docker run --read-only --tmpfs /tmp:rw,noexec,nosuid,nodev,size=64m` gives the same setup.

### Drop Privileges and Let the Orchestrator Enforce Them

The image already runs as uid 65532. The orchestrator should still enforce it, together with the rest of the privilege controls. Your deployment then fails closed when someone ships an image that runs as root, or adds a capability "just to test".

Set four things on every container:

- **Non-root, enforced.** Kubernetes: `runAsNonRoot: true` and `runAsUser: 65532`. With `runAsNonRoot`, the kubelet refuses to start a container that would run as uid 0. ECS: `"user": "65532:65532"`. ECS has no "refuse root" flag, so the `user` field is the enforcement. Check for it in review or with a policy on your task definitions.
- **Drop all capabilities.** A process running as uid 65532 with an empty bounding set cannot gain a capability, not even through a setuid binary. Our bases ship no setuid binaries.
- **No privilege escalation.** `allowPrivilegeEscalation: false` sets the kernel's `no_new_privs` flag, so `execve` can never raise privileges.
- **Seccomp `RuntimeDefault`.** The container runtime's default profile blocks syscalls an app does not need, such as `mount`, `kexec_load` and `bpf`. Kubernetes runs pods `Unconfined` unless you set this field, or unless the node's kubelet has `seccompDefault` turned on ([Kubernetes docs](https://kubernetes.io/docs/tutorials/security/seccomp/)).

Privileged mode, host namespaces and a mounted runtime socket each hand part of the node to the container; [Remember That Containers Do Not Contain](#remember-that-containers-do-not-contain) covers them.

**ECS** (container definition, Fargate):

```json
"user": "65532:65532",
"privileged": false,
"linuxParameters": {
  "capabilities": { "drop": ["ALL"] }
}
```

**Kubernetes** (pod spec):

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 65532
  runAsGroup: 65532
  fsGroup: 65532
  seccompProfile:
    type: RuntimeDefault
containers:
  - name: app
    image: registry.example.com/app:2026-11-07-3f9c2e7
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
```

On Kubernetes, enforce these settings with an admission policy instead of trusting each manifest. Label every application namespace with the Pod Security Admission `restricted` profile:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: app
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
```

The [`restricted` profile](https://kubernetes.io/docs/concepts/security/pod-security-standards/) rejects pods that do not set `runAsNonRoot: true`, `allowPrivilegeEscalation: false`, `capabilities.drop: ["ALL"]` and a `RuntimeDefault` or `Localhost` seccomp profile. It checks init containers and ephemeral debug containers too, and it limits volume types. It does not require `readOnlyRootFilesystem` or a specific uid. Add those through a `ValidatingAdmissionPolicy`, Kyverno or Gatekeeper.

Fargate limits on ECS ([ContainerDefinition API](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ContainerDefinition.html)):

- `dockerSecurityOptions` is not valid on Fargate, so you cannot set `no-new-privileges` there. Non-root plus `drop: ["ALL"]` plus a base without setuid binaries covers the same ground.
- `privileged` is not supported on Fargate. That is the right default.
- `linuxParameters.capabilities.add` accepts only `SYS_PTRACE` (platform version 1.4.0 or later). `drop` accepts `ALL`.
- You cannot set a custom seccomp or AppArmor profile on a Fargate task, because both go through `dockerSecurityOptions`.

On ECS with EC2 capacity, add `"dockerSecurityOptions": ["no-new-privileges"]`. The ECS docs say the agent must register with `ECS_SELINUX_CAPABLE=true` or `ECS_APPARMOR_CAPABLE=true` before containers on that instance can use security options. Check that on your AMI before you rely on it.

For local testing: `docker run --user 65532:65532 --cap-drop=ALL --security-opt=no-new-privileges`. Docker applies its default seccomp profile unless you turn it off.

### Set Resource Limits

A container without limits can starve its neighbours. A memory leak, a fork bomb or a decompression bomb then becomes an outage for every service on the node. Limits also cap what an attacker can do with your compute, such as cryptocurrency mining.

Set a memory limit, a CPU allocation and, where the platform allows it, a limit on processes and on local disk.

**ECS** (task definition, Fargate):

```json
"cpu": "512",
"memory": "1024",
"containerDefinitions": [
  {
    "name": "app",
    "cpu": 448,
    "memory": 896,
    "memoryReservation": 768,
    "ulimits": [{ "name": "nofile", "softLimit": 4096, "hardLimit": 4096 }]
  }
]
```

**Kubernetes** (container spec):

```yaml
resources:
  requests:
    cpu: 250m
    memory: 256Mi
    ephemeral-storage: 64Mi
  limits:
    memory: 256Mi
    ephemeral-storage: 128Mi
```

Platform notes:

- **ECS on Fargate** sizes the task's microVM from the task-level `cpu` and `memory`, so a runaway task hurts only itself. Container-level `memory` is a hard limit: the container is killed when it exceeds it. Leave headroom for sidecars, such as the GuardDuty runtime agent and log routers.
- **Process limits.** ECS has no PID-limit field. On Fargate the only ulimit you can change is `nofile` ([task definition parameters](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)). On Kubernetes the PID limit is a node setting: `podPidsLimit` in the kubelet configuration ([Kubernetes docs](https://kubernetes.io/docs/concepts/policy/pid-limiting/)). Set it in your node group's kubelet config. Locally, `docker run --pids-limit 128`.
- **Kubernetes CPU.** A CPU limit throttles your app even on an idle node, while a CPU request already guarantees its share under contention. Always set the request; add a limit only when you need a hard cap.
- **Local disk.** On Kubernetes, `ephemeral-storage` covers the writable layer, logs and disk-backed `emptyDir`. Exceeding it evicts the pod. A read-only root and a sized `/tmp` already bound most of it.

### Make Health Checks Prove Something, Without `curl`

The orchestrator uses health checks to decide two things: whether to send traffic to a container, and whether to restart it. A check that is wrong in either direction causes outages. Where the check runs also decides what you must ship in the image.

**Where the check runs.** Kubernetes `httpGet`, `tcpSocket` and `grpc` probes run from the kubelet, outside the container, so the image needs nothing for them. Kubernetes `exec` probes run inside the container. ECS container health checks always run inside the container ([ECS docs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/healthcheck.html)). That is how `curl` ends up in images whose app never makes an outbound call, and then it is there for an attacker too. Our bases ship [lprobe](https://github.com/fivexl/lprobe), a small static binary that can only probe `localhost`. Use it in exec form (`CMD`, not `CMD-SHELL`), because there is no shell.

**ECS ignores the image's `HEALTHCHECK`.** The ECS agent only runs a health check that the task definition declares. A `HEALTHCHECK` in the Dockerfile is useful for `docker run` and Compose, but on ECS you must repeat it in `healthCheck`.

**Three checks mean three things.**

- **Startup:** "has the app finished starting?" Until it passes, the other checks do not count. Use it for slow starts instead of a long initial delay on liveness.
- **Readiness:** "should this replica get traffic right now?" A failure takes the replica out of the load balancer and does not restart it. A check on a critical dependency belongs here.
- **Liveness:** "is this process broken in a way a restart fixes?" A deadlock or an exhausted thread pool. Never check a downstream dependency or a credential here, because a restart cannot fix either. When the database is down, every replica fails liveness and restarts in a loop, including replicas that could have served from cache.

**ECS** (container definition):

```json
"healthCheck": {
  "command": ["CMD", "lprobe", "-mode=http", "-endpoint=/healthz", "-port=8080"],
  "interval": 15,
  "timeout": 3,
  "retries": 3,
  "startPeriod": 30
}
```

**Kubernetes** (container spec):

```yaml
startupProbe:
  httpGet: { path: /healthz, port: 8080 }
  periodSeconds: 2
  failureThreshold: 30
livenessProbe:
  httpGet: { path: /healthz, port: 8080 }
  periodSeconds: 10
  failureThreshold: 3
readinessProbe:
  httpGet: { path: /ready, port: 8080 }
  periodSeconds: 5
  failureThreshold: 2
```

ECS has a single container health check, plus `startPeriod` as its startup grace. When the service sits behind a load balancer, the target group health check decides traffic, and an ECS service replaces a task that fails either check. Point the container check at a liveness-style endpoint (`/healthz`) and the target group at a readiness-style one (`/ready`). On Kubernetes, use an `exec` probe with lprobe only when the kubelet cannot reach the port, for example when the app listens on `127.0.0.1`. Each exec probe starts a process inside the container.

### Read Secrets at Runtime, From the Store

A secret that sits in the image, the task definition or a `.env` file lives as long as that artifact. Anyone who copies the image or reads the deployment config gets it. Rotation then means a rebuild or a redeploy, so it rarely happens.

**The target.** The app reads its secrets from AWS Secrets Manager or Vault at runtime, authenticated with its [task or pod identity](#give-each-workload-its-own-identity). Nothing else holds a copy, and the store's audit log (CloudTrail for Secrets Manager) shows which role read what. A stolen image is useless outside your account, because it cannot obtain the identity. Rotation needs no redeploy, provided the app handles it:

- **Re-read on an interval and on an authentication failure.** Cache the value for a few minutes. When the database or API rejects the credential, fetch the secret again and retry once before you report an error.
- **Renew connection pools.** Rotation does not drop open database connections. A pool that only authenticates at startup keeps working until it opens a new connection with the old password. Build new connections from the latest secret.
- **Allow overlap.** Prefer a rotation scheme where the old credential stays valid while replicas pick up the new one. Secrets Manager's [alternating-users strategy](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotation-strategy.html) keeps both users valid after a rotation. The single-user strategy leaves a short window where the database can deny the rotated credential, so it needs a retry.
- **Fail loudly when recovery is impossible.** If the credential is gone or revoked and a fresh read does not help, fail the readiness check and raise an alert. Keep liveness passing: a restarted container reads the same dead credential. An app that stays ready with dead credentials fails customer requests without saying why.
- **Test rotation against a running service.** Rotate the secret in staging while load runs, and watch for errors. Most rotation bugs only show up here.

**The starting point.** If your app cannot do this yet, let the platform inject the secret at start. That is still far better than baking it in.

**ECS** (task definition):

```json
"executionRoleArn": "arn:aws:iam::<account-id>:role/app-execution",
"taskRoleArn": "arn:aws:iam::<account-id>:role/app-task",
"containerDefinitions": [
  {
    "name": "app",
    "environment": [{ "name": "DB_SECRET_ID", "value": "app/db" }],
    "secrets": [
      {
        "name": "API_KEY",
        "valueFrom": "arn:aws:secretsmanager:<region>:<account-id>:secret:app/api-AbCdEf:api_key::"
      }
    ]
  }
]
```

`API_KEY` is platform injection: the ECS agent fetches it with the execution role when the task starts. `DB_SECRET_ID` is the target pattern: the app gets only the secret's name and reads the value itself with the task role.

**Kubernetes** (pod spec):

```yaml
containers:
  - name: app
    image: registry.example.com/app:2026-11-07-3f9c2e7
    env:
      - name: DB_SECRET_ID
        value: app/db
      - name: API_KEY_FILE
        value: /run/secrets/app/api_key
    volumeMounts:
      - name: app-secrets
        mountPath: /run/secrets/app
        readOnly: true
volumes:
  - name: app-secrets
    secret:
      secretName: app-api
```

Know the limits of injection:

- **ECS `secrets` are read once.** The container does not see a rotated value. You need a new task, for example a service deployment with "force new deployment" ([ECS docs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html)).
- **Environment variables leak.** Every child process inherits them, including any tool an attacker manages to start. Any process with the same uid can read `/proc/<pid>/environ` ([proc_pid_environ(5)](https://man7.org/linux/man-pages/man5/proc_pid_environ.5.html)). Crash reporters and debug endpoints dump them. On Kubernetes, prefer a file mount over `secretKeyRef` env vars.
- **Kubernetes Secret volumes update; env vars do not.** The kubelet refreshes a mounted Secret eventually, but not when it is mounted with `subPath`. The [Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/topics/secret-auto-rotation) mounts values straight from Secrets Manager or Vault. Its auto-rotation is alpha and off by default, and the app must watch the file for changes.

**Dynamic credentials beat rotated ones.** Where the service supports it, let the identity mint a short-lived credential instead of storing a password. With [RDS IAM database authentication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html) the app signs a token with its task or pod role. The token is valid for 15 minutes and is only used to authenticate, so an open session outlives it. Generate a fresh token for every new pool connection. Know the trade-offs before you adopt it. CloudTrail and CloudWatch do not log IAM authentication or token generation, so turn on connection logging in the database engine for an audit trail. The feature also needs 300 to 1000 MiB of extra memory on the DB instance.

### Give Each Workload Its Own Identity

The node's IAM role is shared by every container on the node. If your app's credentials come from there, a compromise of any pod or task on that node gets your app's permissions, and your app gets everyone else's. Give each service its own role and its own Kubernetes service account, scoped to what that service does.

**ECS** (task definition):

```json
"executionRoleArn": "arn:aws:iam::<account-id>:role/app-execution",
"taskRoleArn": "arn:aws:iam::<account-id>:role/app-task"
```

ECS has two roles, and mixing them up is common ([ECS docs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html)). The **execution role** is for the ECS agent: it pulls the image, writes logs and fetches `secrets` at start. The **task role** is what your code gets. Put `secretsmanager:GetSecretValue` on the task role once the app reads secrets itself, and remove it from the execution role. A least-privilege task role policy names the exact resources:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:<region>:<account-id>:secret:app/*"
    }
  ]
}
```

**Kubernetes** (pod spec and service account):

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app
  namespace: app
automountServiceAccountToken: false
---
apiVersion: v1
kind: Pod
metadata:
  name: app
  namespace: app
spec:
  serviceAccountName: app
  automountServiceAccountToken: false
  containers:
    - name: app
      image: registry.example.com/app:2026-11-07-3f9c2e7
```

On EKS, bind the IAM role to the service account with EKS Pod Identity. The association lives in the EKS API, not in the pod spec:

```bash
aws eks create-pod-identity-association \
  --cluster-name prod --namespace app --service-account app \
  --role-arn "arn:aws:iam::<account-id>:role/app-task"
```

IRSA (the `eks.amazonaws.com/role-arn` annotation on the service account) still works, and it is the option outside EKS. Give each application its own service account and its own role. The app above never calls the Kubernetes API, so it gets no RBAC role binding, and `automountServiceAccountToken: false` keeps the API token out of the container. Pod Identity and IRSA inject their own projected token, separate from the API token. Test that combination on your cluster version before you roll it out.

**Block the node role.** A pod that has its own role can still reach the node's instance profile through the instance metadata service (IMDS), unless you block it. The [EKS best practices guide](https://docs.aws.amazon.com/eks/latest/best-practices/identity-and-access-management.html) says to require IMDSv2 and set the hop limit to 1 in the node launch template. The extra network hop into a pod then makes the IMDSv2 token response unreachable:

```json
"MetadataOptions": {
  "HttpEndpoint": "enabled",
  "HttpTokens": "required",
  "HttpPutResponseHopLimit": 1
}
```

Some EKS tooling sets the hop limit to 2, so check what your nodes run. Pods with `hostNetwork: true` still reach IMDS, one more reason to forbid host networking. Do not turn IMDS off entirely: node components such as the termination handler need it. On ECS with EC2 capacity, set `ECS_AWSVPC_BLOCK_IMDS=true` in the agent config for `awsvpc` tasks, and use the documented iptables rule for `bridge` tasks. On Fargate, tasks have no container instance role to inherit, and EKS documents that [IMDS is not available](https://docs.aws.amazon.com/eks/latest/userguide/fargate.html) to Fargate pods.

Review roles with IAM last-accessed data and remove actions the service never uses. Your app's identity is the blast radius of a compromise, so keep it small.

### Control Egress

A shell-less image takes `curl`, `wget` and `sh` away from an attacker. It does not take away the socket API. An exploited Python or Node.js process can still open a connection to the attacker. Through it, the process can run a reverse shell written in its own language, download a second stage into memory, or send your data out. The one thing every one of those steps needs is an outbound connection, so deny outbound traffic by default and allow only the destinations the service needs.

On ECS, egress lives in the security group of the task, not in the task definition. With the `awsvpc` network mode, which Fargate always uses, each task gets its own network interface and its own security group. Give every service its own group. Remove the default "all traffic to 0.0.0.0/0" egress rule that AWS adds to a new group. Then add rules only for the destinations the service needs: the database port, the security group of your VPC endpoints on 443, and the S3 prefix list on 443 for image layers. Put ECR, Secrets Manager, CloudWatch Logs and the other AWS APIs the service calls behind interface VPC endpoints, so the task needs no route to the internet at all.

**ECS** (service definition, `create-service` input):

```json
{
  "cluster": "prod",
  "serviceName": "orders",
  "taskDefinition": "orders:42",
  "desiredCount": 2,
  "launchType": "FARGATE",
  "networkConfiguration": {
    "awsvpcConfiguration": {
      "subnets": ["subnet-0a1b2c3d4e5f60001", "subnet-0a1b2c3d4e5f60002"],
      "securityGroups": ["sg-0a1b2c3d4e5f60003"],
      "assignPublicIp": "DISABLED"
    }
  }
}
```

When a service must reach the internet, for example a payment provider's API, send it through an egress point that filters by name. [AWS Network Firewall domain list rule groups](https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups-domain-names.html) allow or deny by the TLS SNI or HTTP `Host` header. A client controls both, so add the `AWS_ROUTE_53_RESOLVED_DOMAIN` target type to an allow list: then the destination IP must also be one that DNS resolved for the allowed name. An HTTP proxy with an allow list does the same job. Log DNS queries and flow logs either way. A callback has to resolve a name, and the log is where you see it.

On Kubernetes, egress lives in a NetworkPolicy. Start every namespace with a default-deny egress policy, then allow DNS and the specific destinations per app.

**Kubernetes** (NetworkPolicy):

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-egress
  namespace: orders
spec:
  podSelector: {}
  policyTypes: ["Egress"]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: orders-egress
  namespace: orders
spec:
  podSelector:
    matchLabels:
      app: orders
  policyTypes: ["Egress"]
  egress:
    - to:                                   # cluster DNS
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
          podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - { protocol: UDP, port: 53 }
        - { protocol: TCP, port: 53 }
    - to:                                   # VPC endpoints and the database subnets
        - ipBlock:
            cidr: 10.20.0.0/16
      ports:
        - { protocol: TCP, port: 443 }
        - { protocol: TCP, port: 5432 }
    - to:                                   # EKS Pod Identity agent on the node
        - ipBlock:
            cidr: 169.254.170.23/32
        - ipBlock:
            cidr: fd00:ec2::23/128
      ports:
        - { protocol: TCP, port: 80 }
```

A pod that uses EKS Pod Identity fetches its credentials from the agent on its node, at `169.254.170.23` or `[fd00:ec2::23]` on port 80 ([EKS docs](https://docs.aws.amazon.com/eks/latest/userguide/pod-id-agent-setup.html)). A default-deny policy blocks that call unless you allow it. With IRSA, the SDK calls STS instead, which the rule for VPC endpoints on 443 already covers.

A NetworkPolicy is only an API object. The network plugin enforces it, and a plugin without policy support accepts the object and ignores it. On EKS, the [Amazon VPC CNI enforces network policies](https://docs.aws.amazon.com/eks/latest/userguide/cni-network-policy.html) once you turn the feature on. The same page lists the limits. Policies apply to EC2 Linux nodes only, not to Fargate pods or Windows nodes, and enforcement for bare pods without an owning controller "might not work reliably". The VPC CNI also offers a cluster-wide `ClusterNetworkPolicy` for platform teams, which namespace owners cannot override. For traffic to AWS services, [security groups for Pods](https://docs.aws.amazon.com/eks/latest/userguide/security-groups-for-pods.html) give a pod its own security group, the same model as an ECS task. Test enforcement once: run a pod in the namespace and check that a connection to an address outside the allow list times out.

### Remember That Containers Do Not Contain

Every container on a host shares that host's kernel. Namespaces and cgroups decide what a process can see and use. They do not put a security boundary between the process and the kernel, and a kernel or runtime bug goes straight through them.

[CVE-2019-5736](https://www.openwall.com/lists/oss-security/2019/02/11/2) in runc showed how short that path can be. A process running as root inside a container could overwrite the host's runc binary and gain root on the host. The advisory names two ways in: start a container from an attacker-controlled image, or `docker exec` into a container the attacker could already write to. The second one means "we only run our own images" was not enough. The advisory also says the default AppArmor and SELinux policies did not block the attack, and that user namespaces did. Running as a non-root user, as our images do with uid 65532, removed the precondition.

Do not hand the host to the container on purpose:

- **No Docker socket.** A container that can reach `/var/run/docker.sock` can start a privileged container with the host's root filesystem mounted. The same goes for the containerd socket and Bottlerocket's API socket.
- **No privileged mode.** `privileged: true` gives the container every capability and the host's devices. Fargate rejects it on ECS. On ECS with EC2, set `ECS_DISABLE_PRIVILEGED=true` in the agent configuration of every instance.
- **No host namespaces or host paths.** `hostNetwork`, `hostPID`, `hostIPC` and `hostPath` volumes each remove a piece of isolation. On ECS, keep `networkMode` at `awsvpc`, leave `pidMode` and `ipcMode` unset, and do not give a volume a `host.sourcePath`.

**ECS** (task definition):

```json
{
  "family": "orders",
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::111122223333:role/orders-execution",
  "taskRoleArn": "arn:aws:iam::111122223333:role/orders-task",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "111122223333.dkr.ecr.eu-west-1.amazonaws.com/orders:2026-11-07-3f9c2e7",
      "essential": true,
      "user": "65532:65532",
      "privileged": false,
      "readonlyRootFilesystem": true,
      "linuxParameters": {
        "capabilities": { "drop": ["ALL"] }
      },
      "mountPoints": []
    }
  ],
  "volumes": []
}
```

**Kubernetes** (pod spec):

```yaml
hostNetwork: false
hostPID: false
hostIPC: false
containers:
  - name: app
    image: registry.example.com/app:2026-11-07-3f9c2e7
    securityContext:
      privileged: false
      allowPrivilegeEscalation: false
volumes: []                                 # no hostPath, no runtime socket
```

On Kubernetes, the cluster should enforce this so a single manifest cannot opt out. The Pod Security Admission `restricted` label from [Drop Privileges and Let the Orchestrator Enforce Them](#drop-privileges-and-let-the-orchestrator-enforce-them) rejects privileged containers, host namespaces, `hostPath` volumes and root users. It rejects every added capability except `NET_BIND_SERVICE`. A pod in such a namespace with `hostPID: true` fails at admission with a `host namespaces (hostPID=true)` violation. Infrastructure agents that really need host access belong in their own namespace with a looser level, and that namespace gets the closest review.

### Detect What Happens at Runtime

Hardening raises the cost of an attack; detection tells you someone paid it. A shell-less, read-only image makes detection unusually precise. The image has no shell, so any shell process in it came from outside. It has no writable root filesystem, so a new executable on disk was put there. Both events are close to certain signs of compromise, and you can page someone on them without a tuning period.

On AWS, turn on [GuardDuty Runtime Monitoring](https://docs.aws.amazon.com/guardduty/latest/ug/how-runtime-monitoring-works-ecs-fargate.html) for ECS and EKS. Its default findings include `Execution:Runtime/ReverseShell`, `Execution:Runtime/NewBinaryExecuted` (a binary created or changed after the container started), `Execution:Runtime/SuspiciousShellCreated`, `PrivilegeEscalation:Runtime/DockerSocketAccessed` and `PrivilegeEscalation:Runtime/RuncContainerEscape` ([finding types](https://docs.aws.amazon.com/guardduty/latest/ug/findings-runtime-monitoring.html)). The agent model differs per platform, and each has limits:

- **ECS on Fargate.** GuardDuty attaches a sidecar to each new task at launch, so force a new deployment after you turn it on. The execution role pulls the agent image from a GuardDuty ECR repository, so private subnets need the ECR endpoints and the S3 prefix list. The sidecar takes task memory (128 MB in a 0.25 vCPU task). If it fails to start, the task runs unmonitored, so watch coverage per cluster. A `GuardDutyManaged:false` tag on a cluster turns management off, so restrict who can set that tag ([prerequisites](https://docs.aws.amazon.com/guardduty/latest/ug/prereq-runtime-monitoring-ecs-support.html)).
- **EKS.** The agent runs as the `aws-guardduty-agent` add-on on EC2 nodes and EKS Auto Mode. GuardDuty does not support EKS pods on Fargate or hybrid nodes ([EKS prerequisites](https://docs.aws.amazon.com/guardduty/latest/ug/prereq-runtime-monitoring-eks-support.html)).
- **ECS Managed Instances** are not supported at all.

**ECS and EKS** (Runtime Monitoring with automated agent management):

```bash
aws guardduty update-detector --detector-id <id> --features '[{
  "Name": "RUNTIME_MONITORING", "Status": "ENABLED",
  "AdditionalConfiguration": [
    {"Name": "ECS_FARGATE_AGENT_MANAGEMENT", "Status": "ENABLED"},
    {"Name": "EKS_ADDON_MANAGEMENT", "Status": "ENABLED"}
  ]
}]'
```

In an AWS Organizations setup, the GuardDuty administrator account turns it on for members with `update-organization-configuration` instead. Check coverage with `aws guardduty list-coverage --detector-id <id>`. A cluster that reports unhealthy coverage looks protected in the console and is not.

On EKS with EC2 nodes you can also run [Falco](https://falco.org/), a CNCF graduated project (February 2024). It runs as a DaemonSet, so it needs nodes you control and does not run on Fargate. Its [default rules](https://github.com/falcosecurity/rules/blob/main/rules/falco_rules.yaml) include `Terminal shell in container` and `Drop and execute new binary in container`. For your shell-less images you can be stricter than the defaults: any shell at all, interactive or not, and any write outside `/tmp`.

**Kubernetes** (Falco custom rules):

```yaml
- list: shellless_images
  items: [111122223333.dkr.ecr.eu-west-1.amazonaws.com/orders]

- rule: Shell spawned in shell-less container
  desc: The image ships no shell, so any shell process came from outside the image.
  condition: >
    spawned_process and container
    and container.image.repository in (shellless_images)
    and not container.image.tag endswith "-dev"
    and proc.name in (shell_binaries)
  output: >
    Shell in shell-less container (proc=%proc.cmdline parent=%proc.pname
    image=%container.image.repository:%container.image.tag container=%container.name)
  priority: CRITICAL
  tags: [container, shell, mitre_execution]

- rule: Write outside writable mounts in shell-less container
  desc: The app writes only to /tmp; any other write means someone is staging files.
  condition: >
    open_write and container
    and container.image.repository in (shellless_images)
    and not container.image.tag endswith "-dev"
    and not fd.name startswith /tmp/
    and not fd.name startswith /dev/
    and not fd.name startswith /proc/self/
  output: >
    Unexpected write (file=%fd.name proc=%proc.cmdline
    image=%container.image.repository:%container.image.tag container=%container.name)
  priority: ERROR
  tags: [container, filesystem, mitre_persistence]
```

The `-dev` variant of our images contains a busybox shell on purpose. A debug build of your app shares the production repository and differs only by tag, so give debug builds a tag that ends in `-dev`; the rules skip those tags. Keep `-dev` images out of production (see [Debug Without Exec](#debug-without-exec)). Send findings to the people who can act on them. A human should confirm before an automated response kills a container, because killing it also removes the evidence.

### Enforce Signatures at Deploy Time and Pull Only From Your Registry

Signing an image in CI protects nothing until something refuses to run an unsigned one. The check belongs at deploy time, on the digest that is about to run, and it must cover every container in the workload. An attacker who cannot change your app container will try an init container, a sidecar, or a debug container added to a running pod.

On Kubernetes, use an admission controller. [Kyverno](https://kyverno.io/docs/policy-types/image-validating-policy/) `ImageValidatingPolicy` (stable in Kyverno 1.19) verifies cosign keyless and Notation signatures. It extracts the images of containers, init containers and ephemeral containers into separate lists, so the policy must check all three. It must also match the `pods/ephemeralcontainers` subresource, because that is how `kubectl debug` adds a container. The [Sigstore policy-controller](https://github.com/sigstore/policy-controller) and Gatekeeper with [Ratify](https://ratify.dev/) are maintained alternatives. If you sign with ECR managed signing, which uses AWS Signer and the Notation format, the [EKS guide](https://docs.aws.amazon.com/eks/latest/userguide/image-verification.html) points to Gatekeeper with Ratify or Kyverno with the AWS Signer plugin.

**Kubernetes** (Kyverno ImageValidatingPolicy):

```yaml
apiVersion: policies.kyverno.io/v1
kind: ImageValidatingPolicy
metadata:
  name: require-signed-images
spec:
  validationActions: [Deny]
  matchConstraints:
    resourceRules:
      - apiGroups: [""]
        apiVersions: ["v1"]
        operations: ["CREATE", "UPDATE"]
        resources: ["pods", "pods/ephemeralcontainers"]
  matchImageReferences:
    - glob: "111122223333.dkr.ecr.eu-west-1.amazonaws.com/*"
  credentials:
    providers: [amazon]                     # private ECR, through Kyverno's IAM role
  attestors:
    - name: ci                              # your app release workflow
      cosign:
        keyless:
          identities:
            - issuer: https://token.actions.githubusercontent.com
              subjectRegExp: ^https://github\.com/example-org/orders/\.github/workflows/release\.yml@refs/heads/main$
    - name: mirror                          # your image-import workflow
      cosign:
        keyless:
          identities:
            - issuer: https://token.actions.githubusercontent.com
              subjectRegExp: ^https://github\.com/example-org/image-import/\.github/workflows/import\.yml@refs/heads/main$
  validations:
    - expression: >-
        images.containers.map(i, verifyImageSignatures(i, [attestors.ci, attestors.mirror])).all(n, n > 0) &&
        images.initContainers.map(i, verifyImageSignatures(i, [attestors.ci, attestors.mirror])).all(n, n > 0) &&
        images.ephemeralContainers.map(i, verifyImageSignatures(i, [attestors.ci, attestors.mirror])).all(n, n > 0)
      message: every container image must carry a signature from the release or the image-import workflow
```

`verifyImageSignatures` returns how many of the listed attestors verified, so `n > 0` accepts a signature from either workflow. Kyverno reads signatures from private ECR with its own identity. Give the Kyverno admission controller's service account an IAM role with ECR read access (`ecr:GetAuthorizationToken`, `ecr:BatchGetImage`, `ecr:GetDownloadUrlForLayer`), for example through IRSA ([Kyverno credentials](https://kyverno.io/docs/policy-types/image-validating-policy/#credentials)).

The signature policy matches only your registry, so pair it with a rule that rejects every other registry. Kubernetes' built-in ValidatingAdmissionPolicy does that without an extra controller:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: own-registry-only
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
      - apiGroups: [""]
        apiVersions: ["v1"]
        operations: ["CREATE", "UPDATE"]
        resources: ["pods", "pods/ephemeralcontainers"]
  variables:
    - name: images
      expression: >-
        object.spec.containers.map(c, c.image) +
        object.spec.?initContainers.orValue([]).map(c, c.image) +
        object.spec.?ephemeralContainers.orValue([]).map(c, c.image)
  validations:
    - expression: >-
        variables.images.all(i, i.startsWith('111122223333.dkr.ecr.eu-west-1.amazonaws.com/'))
      message: images must come from the organization's ECR registry
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: own-registry-only
spec:
  policyName: own-registry-only
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchExpressions:
        - key: kubernetes.io/metadata.name
          operator: NotIn
          values: ["kube-system"]
```

Third-party images, ours included, enter that registry through your image-import workflow. It verifies the upstream signature, such as the FivexL identity in [Control What Goes Into the Build](#control-what-goes-into-the-build), copies the image by digest and signs the copy with its own identity. The `mirror` attestor above trusts that identity, so a mirrored image such as a FivexL `-dev` debug image passes admission. Then the cluster never pulls from the internet.

An [ECR pull-through cache](https://docs.aws.amazon.com/AmazonECR/latest/userguide/pull-through-cache.html) can do the copy, but it does not add your signature, so the import workflow still signs what the cache holds. The first pull of an image through the cache needs internet access: with only VPC endpoints, AWS requires a NAT gateway for that pull ([ECR VPC endpoints](https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html)). Prewarm the cache from a network allowed to reach the internet, such as the import workflow's runner, so the cluster subnets never need a route out.

ECS has no built-in signature check at deploy time. The AWS route is a [deployment lifecycle hook](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-lifecycle-hooks.html): ECS calls a Lambda function at a stage such as `PRE_SCALE_UP`, before any new task starts. The function reads the image URIs of the new service revision and verifies their signatures. If it returns `FAILED`, ECS rolls the deployment back. AWS documents this in [Verify container image signatures for Amazon ECS](https://docs.aws.amazon.com/signer/latest/developerguide/ecs-verification.html) and publishes a [sample function](https://github.com/aws-samples/lambda-based-signature-verification) for AWS Signer signatures. For cosign signatures, run `cosign verify` with your CI identity in the same function. Make the function check the registry prefix too.

**ECS** (service definition):

```json
{
  "cluster": "prod",
  "serviceName": "orders",
  "taskDefinition": "orders:42",
  "deploymentConfiguration": {
    "strategy": "BLUE_GREEN",
    "bakeTimeInMinutes": 10,
    "lifecycleHooks": [
      {
        "hookTargetArn": "arn:aws:lambda:eu-west-1:111122223333:function:verify-image-signatures",
        "roleArn": "arn:aws:iam::111122223333:role/ecs-invoke-deploy-hooks",
        "lifecycleStages": ["PRE_SCALE_UP"]
      }
    ]
  }
}
```

The example uses a blue/green deployment. A hook covers service deployments only. Standalone tasks from `RunTask`, EventBridge schedules or Step Functions skip it, so verify their images in the pipeline that registers the task definition. [Egress control](#control-egress) closes the remaining gap: a task in a subnet with no route to the internet and only ECR endpoints cannot pull from Docker Hub.

### Rescan What Runs and Check Which Digest Runs

A clean scan in CI describes the image on the day you built it. New CVEs are published every day, and a service that has not been redeployed for a month carries every one of them. A fix is done when the fixed digest runs in production, not when it merges.

Turn on ECR enhanced scanning with Amazon Inspector in continuous mode. Inspector rescans an image whenever it adds a relevant CVE to its database, for as long as the image stays in its monitoring window. Since 15 October 2026, that window defaults to 7 days for new activations. It counts from push and from the last time an ECS task or EKS pod used the image ([Inspector ECR scanning](https://docs.aws.amazon.com/inspector/latest/user/scanning-ecr.html)). An image that keeps running stays in the window. One trap: Inspector does not track last-in-use for multi-architecture images. For those, set the re-scan mode to last pull date and pick a duration (up to 180 days) longer than any image stays deployed ([re-scan duration](https://docs.aws.amazon.com/inspector/latest/user/scanning_resources_configure_duration_setting_ecr.html)). To see critical findings in images that run right now:

```bash
aws inspector2 list-findings --filter-criteria '{
  "ecrImageInUseCount": [{"lowerInclusive": 1}],
  "findingStatus": [{"comparison": "EQUALS", "value": "ACTIVE"}],
  "severity": [{"comparison": "EQUALS", "value": "CRITICAL"}]
}' --query 'findings[].[title,resources[0].id]' --output table
```

The in-use data lags. For a new image or account it can take up to 36 hours to appear, and after that Inspector updates it once every 24 hours ([image mapping](https://docs.aws.amazon.com/inspector/latest/user/scanning-ecr.html#ecr-mapping-container-images)). Use it to prioritize, and take current coverage from live inventory, such as the digest checks below.

On a cluster without Inspector, [trivy-operator](https://github.com/aquasecurity/trivy-operator) scans the workloads in place.

Then check that what runs is what you built. A tag can move and a rollout can fail halfway. Someone can also deploy by hand during an incident. Read the digest from the running tasks and pods, and compare it with the digest your CI recorded and signed for that release.

**ECS**:

```bash
# describe-tasks takes at most 100 ARNs; -r skips the call when no task runs.
aws ecs list-tasks --cluster prod --service-name orders --query 'taskArns[]' --output text \
  | xargs -r -n 100 aws ecs describe-tasks --cluster prod \
      --query 'tasks[].containers[].[name,image,imageDigest]' --output table --tasks
```

**Kubernetes**:

```bash
kubectl get pods -n orders -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{range .status.containerStatuses[*]}{.image}{"\t"}{.imageID}{"\n"}{end}{end}'
```

Run this on a schedule for every service. A digest with no build record means an image that bypassed the pipeline. A digest that matches an older build means a rollout that never finished. Keep a short, named allow list for images you run on purpose without your own build record, such as a vendor agent, so that each exception has an owner.

### Choose a Minimal Host OS or a Managed Platform

A container escape lands on the host, and the host is the next layer to harden. Apply the same subtraction there that distroless applies to the image.

[Bottlerocket](https://github.com/bottlerocket-os/bottlerocket/blob/develop/SECURITY_FEATURES.md) is AWS's container-only OS for ECS and EKS nodes. It has no shell and no interpreters. The root filesystem is read-only and checked by dm-verity, and SELinux runs in enforcing mode and cannot be turned off. On most variants, kernel lockdown runs in `integrity` mode by default, which refuses unsigned kernel modules. Updates swap between two partition sets, so a node updates as a whole and can roll back. You still drive the updates (on Kubernetes, with the Bottlerocket update operator or node replacement) and keep the admin container off in production.

**ECS and Kubernetes** (Bottlerocket user data, TOML):

```toml
# Off by default; set it explicitly so nobody turns it on in a later template.
[settings.host-containers.admin]
enabled = false

[settings.kernel]
lockdown = "integrity"
```

[Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-tasks-containers.html) removes the host from your plate. Each task runs on its own dedicated instance, and AWS patches the OS and container runtime under it. When a platform revision is patched, AWS retires tasks on the old one and the ECS scheduler replaces service tasks for you ([task retirement](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-maintenance.html)). Standalone tasks are stopped and not replaced, so whatever starts them must handle that. The price is control: the [Fargate limits](#drop-privileges-and-let-the-orchestrator-enforce-them) on privileges and seccomp apply, and it cannot run node agents such as Falco. For internet-facing services that run your own stateless code, we pick Fargate: the controls it takes away are ones those services should not use anyway.

### Replicate Images to the Disaster-Recovery Region

When a region fails, infrastructure as code can recreate your services in another region within the hour. It cannot recreate the images. If they live only in the failed region's registry, the new services cannot start, and rebuilding them during the incident means building outside your normal pipeline under pressure.

Turn on [ECR replication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/replication.html) to the recovery region, and to a separate account if your recovery plan includes losing the primary one.

**ECS and Kubernetes** (`aws ecr put-replication-configuration` input):

```json
{
  "replicationConfiguration": {
    "rules": [
      {
        "destinations": [
          { "region": "eu-central-1", "registryId": "111122223333" }
        ],
        "repositoryFilters": [
          { "filter": "prod/", "filterType": "PREFIX_MATCH" }
        ]
      }
    ]
  }
}
```

Replication copies only images pushed after you configure it, so backfill existing ones. It does not copy repository policies, lifecycle policies or tag immutability; set those in a repository creation template. ECR [replicates referrers on push](https://aws.amazon.com/blogs/opensource/diving-into-oci-image-and-distribution-1-1-support-in-amazon-ecr/), so signatures and SBOMs stored as OCI referrers follow the image. Prove it during a recovery drill. Point the admission policy or the ECS hook in the recovery region at the replicated registry, deploy one service from it, and confirm that the signature check passes there. Task definitions and manifests must name the recovery region's registry, so template the registry host, not the whole image reference.

### Debug Without Exec

A shell-less image leaves `kubectl exec` and ECS Exec nothing to start. Plan how developers will debug before the first incident, or someone will ask for a shell in the production image.

Start with telemetry. Most exec sessions exist to read a log file or check an environment variable, so ship logs, metrics and traces.

When telemetry is not enough, swap in a debug build. Our Python and Node.js bases publish `-dev` variants, for example `python3.13-debian13-dev` and `node26-debian13-dev`. They are built from distroless `:debug-nonroot` and add a busybox shell at `/busybox/sh`. Rebuild the app on the matching `-dev` tag, tag that build with a `-dev` suffix, deploy it, debug, and deploy the normal image again. The `-dev` variants do not include the RDS CA bundle, so an app built on an `-rds` tag cannot verify the RDS certificate while it runs on `-dev`. For the debug build, copy the bundle from the matching `-rds` tag, for example `COPY --from=ghcr.io/fivexl/secure-container-image-base-python3:python3.13-debian13-rds /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/aws-rds.crt /etc/ssl/certs/`. For Node.js, also set `NODE_EXTRA_CA_CERTS=/etc/ssl/certs/aws-rds.crt`, as the `-rds` variant does. Each image carries the label `io.fivexl.image.variant` (`production`, `rds` or `dev`). An admission policy or the ECS deploy hook can use it to reject `dev` in production unless an elevated role approved the change.

On ECS, keep ECS Exec off in production. It does not fit a hardened task. It needs a writable root filesystem, so it fails with `readonlyRootFilesystem`. Its commands run as root, and session logging needs `script` and `cat` in the image ([ECS Exec](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-exec.html)). Deny it in IAM, along with direct SSM sessions that would skip the ECS Exec log.

**ECS** (IAM policy):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "NoExecIntoProduction",
      "Effect": "Deny",
      "Action": "ecs:ExecuteCommand",
      "Resource": "*",
      "Condition": {
        "StringEquals": { "aws:ResourceTag/environment": "production" }
      }
    },
    {
      "Sid": "NoSessionsAroundEcsExec",
      "Effect": "Deny",
      "Action": "ssm:StartSession",
      "Resource": "arn:aws:ecs:*:*:task/*"
    }
  ]
}
```

On Kubernetes, [ephemeral containers](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/) give you a break-glass route that leaves the app image alone. `kubectl debug` adds a debug container to a running pod, and `--target` shares the app container's process namespace. Use a debug image from your own registry that runs as non-root, so it passes the `restricted` Pod Security level and the [registry and signature policies](#enforce-signatures-at-deploy-time-and-pull-only-from-your-registry). A FivexL `-dev` image mirrored by your image-import workflow works: it runs as uid 65532, and the import workflow signed the copy.

**Kubernetes**:

```bash
kubectl debug -n orders -it orders --target=app --profile=restricted \
  --image=111122223333.dkr.ecr.eu-west-1.amazonaws.com/mirror/secure-container-image-base-python3:python3.13-debian13-dev \
  -- /busybox/sh
```

An ephemeral container cannot be removed once added; it stays until the pod is deleted. Delete the pod after the session, so a fresh one without the debug container replaces it. Access goes through the `pods/ephemeralcontainers` subresource, which the default `admin` and `edit` roles do not include. Grant it to a break-glass group only.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: break-glass-debug
  namespace: orders
rules:
  - apiGroups: [""]
    resources: ["pods/ephemeralcontainers"]
    verbs: ["patch", "update"]
  - apiGroups: [""]
    resources: ["pods", "pods/attach"]
    verbs: ["get", "list", "create"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: break-glass-debug
  namespace: orders
subjects:
  - kind: Group
    name: break-glass-oncall
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: break-glass-debug
  apiGroup: rbac.authorization.k8s.io
```

The Kubernetes audit log records each patch to that subresource, and your runtime detector alerts on the shell. Keep both. A debug session should be rare, and when it happens, it should be visible.

## Changelog

Each quarterly review adds an entry here, including reviews that change nothing.

**November 2026.** Full rewrite. What changed from the 2024 version: the FivexL bases moved from Alpine on `scratch` to distroless Debian 13, and the image user moved from uid 2323 to 65532. Snyk gave way to Trivy, SHA tags gave way to moving major tags plus cosign signatures, and images now carry SBOM and provenance attestations. If you used the old base, read [Migrating from the Alpine-Based secure-container-image-base](https://github.com/fivexl/secure-container-image#migrating-from-the-alpine-based-secure-container-image-base).

**15 February 2024.** First published.
