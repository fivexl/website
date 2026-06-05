# Cloudflare Migration Handoff

Repo: `/Users/andrey9kin/Documents/fivexl/website`
Branch: `main`
Pushed commit: `728a400 Migrate site to Cloudflare Workers`

## Goal

Migrate `fivexl.io` from Netlify to Cloudflare Workers Static Assets, with repo-owned redirects, Git-connected deploys, PR previews, latest Hugo, vendored fonts, and Netlify cleanup.

## Implemented

- Added `wrangler.toml`
  - Worker name: `fivexl-website`
  - Static assets: `./public`
  - Worker runs first via `run_worker_first = true`
- Added `src/worker.js`
  - Preserves all Netlify `301` redirects
  - Preserves `/author/*` to `/specialist/*`
  - Preserves three `410 Gone` paths
  - Preserves `www.fivexl.io` to `fivexl.io`
- Removed Netlify artifacts
  - Deleted `netlify.toml`
  - Deleted `.netlify/state.json`
  - Deleted unused Netlify form partial
  - Removed Netlify badge from `README.md`
- Rebuilt `/about/` as Hugo-native
  - `layouts/about/list.html`
  - `themes/example/layouts/partials/about_person_card.html`
  - `themes/example/assets/sass/about.scss`
- Replaced `/thankyou/` with a modern simple page.
- Upgraded Hugo compatibility
  - `_build` front matter changed to `build`
  - JSON output templates now use `jsonify`
  - deprecated Hugo APIs cleaned up
- Fixed bad image extension
  - `content/case-studies/firi-case-study/Vova_2.png` renamed to `Vova_2.webp`
- Vendored Montserrat fonts
  - `static/fonts/`
  - Removed build-time `resources.GetRemote` Google Fonts fetch
  - Static legacy HTML font links rewritten to `/fonts/montserrat.css`
- Added `package.json`
  - `dev`, `build`, `deploy` scripts
- Deleted user-requested folder before commit
  - `content/blog/boris-phi-pii-protection/`

## Verification Already Done

Local latest Hugo build passed cleanly:

```bash
hugo --minify --destination /private/tmp/fivexl-public-verify --baseURL https://fivexl.io
```

Verified with:

```text
hugo v0.162.1+extended+withdeploy darwin/arm64
```

Searches showed no source/output references to:

```text
Netlify
netlify
data-netlify
fonts.googleapis
resources.GetRemote
```

Wrangler was not run locally because the local machine had no `node`/`npm`.

## Current Cloudflare Issue

Cloudflare Workers Builds defaults to preinstalled Hugo `extended_0.147.7`, which fails to render this site (`hugo.Data` and other templates error out). The build command was also `hugo`, not `hugo --minify`.

Workers Builds **does** honor `HUGO_VERSION` as an environment variable (per https://developers.cloudflare.com/workers/ci-cd/builds/build-image/). No curl install hack needed.

## Cloudflare Build Settings To Use

In Cloudflare Dashboard -> Worker `fivexl-website` -> Settings -> Build:

```text
Production branch: main
Root directory: /
Build command: hugo --minify
Deploy command: npx wrangler deploy
Non-production branch deploy command: npx wrangler versions upload
```

In Settings -> Variables and Secrets (build env vars):

```text
HUGO_VERSION = 0.162.1
```

Then save and retry deployment.

## After Successful Build

Add custom domains to the Worker:

```text
fivexl.io
www.fivexl.io
```

Test:

```text
/about/
/thankyou/
/blog/overture-case-study/
/author/andrey-devyatkin/
/hello-world/
```

Expected:

- `/about/` -> `200`
- `/thankyou/` -> `200`
- `/blog/overture-case-study/` -> `301` to `/case-studies/ovrture-case-study/`
- `/author/andrey-devyatkin/` -> `301` to `/specialist/andrey-devyatkin/`
- `/hello-world/` -> `410`
- `www.fivexl.io` -> `301` to `https://fivexl.io`

## Cloudflare Docs

- Workers Builds: https://developers.cloudflare.com/workers/ci-cd/builds/
- Workers build config: https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- Workers static assets: https://developers.cloudflare.com/workers/static-assets/
