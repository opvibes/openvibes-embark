# GitHub Secrets

Documentation for environment variables (secrets) required for each deploy type in Embark.

> **Where to configure:** GitHub → Settings → Secrets and variables → Actions

---

## Google Cloud Run (GCP)

### Basic Deploy (without custom domain)

| Secret | Description | Example |
|--------|-------------|---------|
| `GCP_PROJECT_ID` | Google Cloud project ID | `my-project-123456` |
| `GCP_SA_KEY` | Service Account JSON with deploy permissions | `{"type": "service_account", ...}` |
| `GCP_REGION` | Cloud Run region | `us-central1` |

### Deploy with Custom Domain (Cloudflare DNS)

Add the secrets above **+** those from the [Cloudflare DNS Manager](#cloudflare-dns-manager) section.

---

## Netlify

### Basic Deploy (without custom domain)

| Secret | Description | Where to find |
|--------|-------------|----------------|
| `NETLIFY_TOKEN` | Personal Access Token | Netlify → User Settings → Applications → Personal access tokens |
| `DOMAIN` | Base domain | e.g. `embark.dev` |

#### NETLIFY_TOKEN Permissions
The token is created with full account access. There's no granular permissions.

### Deploy with Custom Domain (Cloudflare DNS)

Add the secrets above **+** those from the [Cloudflare DNS Manager](#cloudflare-dns-manager) section.

---

## Cloudflare Pages

Static site deployment directly to Cloudflare Pages with automatic DNS configuration.

| Secret | Description | Where to find |
|--------|-------------|----------------|
| `CF_TOKEN_PAGES` | API Token with Pages + DNS permissions | Cloudflare → My Profile → API Tokens |
| `CF_ACCOUNT_ID` | Cloudflare Account ID | Cloudflare Dashboard → Overview (right side) |
| `CF_ZONE_ID` | Domain Zone ID | Cloudflare → Your domain → Overview (right side) |
| `DOMAIN` | Base domain | e.g. `embark.dev` |

> **Note:** The project name is automatically derived from your domain. For example, if `DOMAIN=blpsoares.dev` and subdomain is `myapp`, the project will be `blpsoares-myapp`.

### CF_TOKEN_PAGES Permissions

When creating the token in **My Profile → API Tokens → Create Token → Create Custom Token**:

| Scope | Resource | Permission |
|-------|----------|------------|
| Account | Cloudflare Pages | **Edit** |
| Zone | DNS | **Edit** |

**Account Resources:** Include → Your account
**Zone Resources:** Include → Specific zone → Your domain (or All zones)

---

## Cloudflare DNS Manager

Used to configure custom subdomains for Netlify or GCP deploys.

| Secret | Description | Where to find |
|--------|-------------|----------------|
| `CF_TOKEN` | API Token with DNS permission | Cloudflare → My Profile → API Tokens |
| `CF_ZONE_ID` | Domain Zone ID | Cloudflare → Your domain → Overview (right side) |
| `DOMAIN` | Base domain | e.g. `embark.dev` |

### CF_TOKEN Permissions

When creating the token in **My Profile → API Tokens → Create Token → Create Custom Token**:

| Scope | Resource | Permission |
|-------|----------|------------|
| Zone | DNS | **Edit** |

**Zone Resources:** Include → Specific zone → Your domain (or All zones)

---

## Summary by Scenario

| Scenario | Required Secrets |
|----------|------------------|
| GCP basic | `GCP_PROJECT_ID`, `GCP_SA_KEY`, `GCP_REGION` |
| GCP + Cloudflare DNS | GCP basic + `CF_TOKEN`, `CF_ZONE_ID`, `DOMAIN` |
| Netlify basic | `NETLIFY_TOKEN`, `DOMAIN` |
| Netlify + Cloudflare DNS | Netlify basic + `CF_TOKEN`, `CF_ZONE_ID` |
| Cloudflare Pages | `CF_TOKEN_PAGES`, `CF_ACCOUNT_ID`, `CF_ZONE_ID`, `DOMAIN` |

---

## Tips

### Reusing Secrets

If you already have secrets configured:

| Already have | Can reuse in |
|--------------|--------------|
| `CF_ZONE_ID` | All Cloudflare scenarios |
| `DOMAIN` | All scenarios |
| `CF_TOKEN` | Only DNS (Netlify/GCP + Cloudflare) |

### Security

- **Never** commit secrets to repository files
- Use tokens with **minimal scope** permissions
- Rotate tokens periodically
- For GCP, create a dedicated Service Account for CI/CD
