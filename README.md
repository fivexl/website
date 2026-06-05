# website
[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/wb85.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

Hugo static site for [fivexl.io](https://fivexl.io/), deployed to Cloudflare Workers Static Assets.

## Local development

```bash
hugo server --buildDrafts
```

## Build

```bash
hugo --minify
```

The generated site is written to `public/`.

## Deployment

Cloudflare builds this repository from Git and deploys it with Wrangler using [wrangler.toml](wrangler.toml).

Recommended Cloudflare build settings:

- Build command: `hugo --minify`
- Build output directory: `public`
- Hugo version: latest available in the Cloudflare build image; this repo has been verified locally with Hugo `0.162.1`.

Redirects and `410 Gone` responses are repo-owned in [src/worker.js](src/worker.js). The Worker also preserves the current `www.fivexl.io` to `fivexl.io` permanent redirect.
