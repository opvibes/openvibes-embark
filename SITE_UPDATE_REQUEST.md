# Embark Site Update Request: Cloudflare Workers Deploy Target

## Context

A new deploy target **Cloudflare Workers** was added to the Embark framework. The site at `/packages/embark-site` needs to be updated to reflect this new option across all relevant sections.

## What Changed in the Framework

- New `appDeployment: "cloudflare-workers"` option
- Workers deploy via `wrangler deploy` (no Docker needed)
- Dedicated secret: `CF_WORKER_TOKEN` (separate from CF Pages token)
- Custom domain support via Cloudflare DNS (optional, controlled by `cloudflareUse`)
- Orphan cleanup support for Workers scripts
- Dockerfile generation is automatically skipped for Workers packages

## Site Files to Update

### 1. `src/i18n.ts` — Translation keys (EN + PT)

Add new translation keys for Cloudflare Workers:

**Secrets section** — Add a new block similar to `secrets.cf.*`:
- `secrets.workers.title` — "Cloudflare Workers" / "Cloudflare Workers"
- `secrets.workers.when` — "Required when `appDeployment: \"cloudflare-workers\"`"
- `secrets.workers.token` — `CF_WORKER_TOKEN` description
- `secrets.workers.account` — `CF_ACCOUNT_ID` description
- `secrets.workers.zone` — `CF_ZONE_ID` description (only if custom domain)
- `secrets.workers.domain` — `DOMAIN` description (only if custom domain)

**Features section** — Add or update:
- New feature card for Workers (e.g. "Workers Ready" — "Choose Workers for serverless backends — no Docker, no containers. Just deploy your code at the edge.")

**Hero/header** — Update to mention Workers alongside existing targets:
- Current: "Cloud Run · Netlify"
- New: "Cloud Run · Netlify · Workers"

**Stats section** — Update the deploy targets count:
- Current: 4 features → 5 features (or update the stat that counts deploy targets)

### 2. `src/interactive.ts` — Package creation simulator

**Deploy target menu** (~line 250+):
- Add option: "Cloudflare Workers (generates workflow for serverless backend)"
- Current options: GCP (1), Netlify (2), Cloudflare Pages (3), Other (4)
- New options: GCP (1), Netlify (2), Cloudflare Pages (3), Cloudflare Workers (4), Other (5)

**Custom domain question** — Workers should behave like Cloudflare Pages:
- Ask "Publish under a custom domain (e.g. api.yourdomain.com)?" with a note about `name.workers.dev`

**Secrets display at end** — Add Workers-specific secrets:
- `CF_WORKER_TOKEN` — Cloudflare API token (Workers Scripts edit)
- `CF_ACCOUNT_ID` — Cloudflare Account ID
- `CF_ZONE_ID` — Zone ID (if custom domain)
- `DOMAIN` — Base domain (if custom domain)

**Dockerfile step** — Skip Dockerfile generation for Workers (same as Cloudflare Pages)

### 3. `src/commitFlow.ts` — Workflow flow visualization

- Add a Workers deployment path example (e.g. "Workers + Claude" pair alongside existing "GCP + Claude" and "Netlify + Codex")

### 4. `src/controlCards.ts` — Control/deployment options

- Add Workers card/badge alongside existing deploy target options

### 5. `index.html` — Secrets reference table

- Add Cloudflare Workers section to the secrets reference if it's hardcoded in HTML
- Update any hardcoded deploy target lists

### 6. `src/features.ts` — Feature cards

- If the "Auto Cloudflare Cleanup" feature card mentions only Pages, update to also mention Workers cleanup

## Design Notes

- Workers icon: use a lightning bolt or edge/globe icon to differentiate from Pages
- Color: consider using Cloudflare orange (#F6821F) to keep visual consistency with Pages
- The Workers option should feel like a first-class citizen, not an afterthought
- Emphasize the "serverless backend" angle — this is what differentiates Workers from Pages (which is for frontends)

## Key Differentiators to Highlight

| Feature | Cloudflare Pages | Cloudflare Workers |
|---------|------------------|--------------------|
| Use case | Static sites, SPAs | APIs, serverless backends |
| Docker | Not needed | Not needed |
| Runtime | Static hosting | V8 isolates (edge) |
| URL default | `project.pages.dev` | `name.workers.dev` |
| Secret | `CF_TOKEN_PAGES` | `CF_WORKER_TOKEN` |
