import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { readEmbarkConfig, hasCompleteEmbarkConfig } from "./embark-config";
import type { AppDeployment, EmbarkConfig } from "../shared/types/deploy";

const ROOT = join(import.meta.dirname, "..");
const PACKAGES_DIR = join(ROOT, "packages");

// ── Types ────────────────────────────────────────────────────

export interface ActivePackage {
  folderName: string;
  subdomain: string;
  rootDomain: boolean;
  deploy: AppDeployment;
  cloudflareUse: boolean;
}

export interface CloudResource {
  name: string;
  type: "cloudflare-pages" | "cloudflare-workers" | "netlify" | "gcp";
}

export interface OrphanResource {
  resource: CloudResource;
  subdomain: string;
  fullDomain: string;
  hasCloudflare: boolean;
}

// ── Active packages ──────────────────────────────────────────

export async function getActivePackages(
  packagesDir = PACKAGES_DIR,
): Promise<Map<string, ActivePackage>> {
  const result = new Map<string, ActivePackage>();

  let entries: import("node:fs").Dirent[];
  try {
    entries = await readdir(packagesDir, { withFileTypes: true });
  } catch {
    return result;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pkgDir = join(packagesDir, String(entry.name));
    if (!(await hasCompleteEmbarkConfig(pkgDir))) continue;

    const config = await readEmbarkConfig(pkgDir);
    if (!config?.name) continue;

    const subdomain = config.subdomain ?? "";
    const deploy = config.deploy?.appDeployment ?? "gcp";
    const rootDomain = config.rootDomain ?? false;
    const cloudflareUse = config.deploy?.cloudflareUse ?? false;

    result.set(subdomain || entry.name, {
      folderName: String(entry.name),
      subdomain,
      rootDomain,
      deploy,
      cloudflareUse,
    });
  }

  return result;
}

// ── Naming patterns ──────────────────────────────────────────

export function cloudflareProjectName(
  subdomain: string,
  rootDomain: boolean,
  domainPrefix: string,
  hasDomainSetup: boolean,
  packageName?: string,
): string {
  if (!hasDomainSetup && packageName) return packageName;
  if (rootDomain) return domainPrefix;
  return `${domainPrefix}-${subdomain}`.replace(/\./g, "-");
}

export function netlifyProjectName(subdomain: string): string {
  return `${subdomain}-embark`;
}

export function gcpServiceName(packageName: string): string {
  return packageName.toLowerCase();
}

export function workerScriptName(
  subdomain: string,
  rootDomain: boolean,
  domainPrefix: string,
  hasDomainSetup: boolean,
  packageName?: string,
): string {
  if (!hasDomainSetup && packageName) return packageName;
  if (rootDomain) return domainPrefix;
  return `${domainPrefix}-${subdomain}`.replace(/\./g, "-");
}

// ── Cloud API: Cloudflare Pages ──────────────────────────────

export async function listCloudflarePageProjects(
  accountId: string,
  token: string,
): Promise<string[]> {
  const projects: string[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects?page=${page}&per_page=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = (await response.json()) as {
      success: boolean;
      result: { name: string }[];
      result_info?: { total_pages: number };
    };

    if (!data.success || !data.result?.length) break;

    for (const project of data.result) {
      projects.push(project.name);
    }

    const totalPages = data.result_info?.total_pages ?? 1;
    if (page >= totalPages) break;
    page++;
  }

  return projects;
}

export async function deleteCloudflarePageProject(
  accountId: string,
  token: string,
  projectName: string,
  fullDomain?: string,
): Promise<boolean> {
  // Remove custom domain first if provided
  if (fullDomain) {
    console.log(`  -> Removing custom domain: ${fullDomain}`);
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/domains/${fullDomain}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
  }

  console.log(`  -> Deleting Pages project: ${projectName}`);
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const data = (await response.json()) as { success: boolean; errors?: { message: string; code: number }[] };
  if (data.success) {
    console.log(`  ✓ Pages project deleted: ${projectName}`);
    return true;
  }

  const code = data.errors?.[0]?.code ?? 0;
  if (code === 8000007) {
    console.log(`  ✓ Pages project not found (already deleted): ${projectName}`);
    return true;
  }

  console.log(`  ✗ Failed to delete Pages project: ${data.errors?.[0]?.message ?? "Unknown"}`);
  return false;
}

// ── Cloud API: Netlify ───────────────────────────────────────

export async function listNetlifySites(token: string): Promise<string[]> {
  const sites: string[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `https://api.netlify.com/api/v1/sites?page=${page}&per_page=100`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = (await response.json()) as { name: string }[];

    if (!Array.isArray(data) || data.length === 0) break;

    for (const site of data) {
      if (site.name) sites.push(site.name);
    }

    if (data.length < 100) break;
    page++;
  }

  return sites;
}

export async function deleteNetlifySite(
  token: string,
  siteName: string,
): Promise<boolean> {
  // Look up site ID by name
  const lookupResp = await fetch(
    `https://api.netlify.com/api/v1/sites/${siteName}.netlify.app`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const lookupData = (await lookupResp.json()) as { id?: string };
  const siteId = lookupData.id;

  if (!siteId) {
    console.log(`  ✓ Netlify site not found (already deleted): ${siteName}`);
    return true;
  }

  console.log(`  -> Deleting Netlify site: ${siteName} (ID: ${siteId})`);
  const response = await fetch(
    `https://api.netlify.com/api/v1/sites/${siteId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  // Netlify returns 204 No Content on success
  if (response.status === 204 || response.ok) {
    console.log(`  ✓ Netlify site deleted: ${siteName}`);
    return true;
  }

  const errData = (await response.json()) as { message?: string };
  console.log(`  ✗ Failed to delete Netlify site: ${errData.message ?? "Unknown"}`);
  return false;
}

// ── Cloud API: GCP Cloud Run ─────────────────────────────────

export async function listCloudRunServices(
  projectId: string,
  region: string,
  saKey?: string,
): Promise<string[]> {
  if (!projectId || !saKey) return [];

  try {
    // Authenticate
    const { writeFileSync, unlinkSync } = await import("node:fs");
    const keyPath = "/tmp/gcp-key-cleanup.json";
    try {
      writeFileSync(keyPath, Buffer.from(saKey, "base64").toString());
    } catch {
      writeFileSync(keyPath, saKey);
    }

    execSync(`gcloud auth activate-service-account --key-file=${keyPath} --quiet 2>/dev/null`, { stdio: "ignore" });
    execSync(`gcloud config set project "${projectId}" --quiet 2>/dev/null`, { stdio: "ignore" });
    unlinkSync(keyPath);

    const output = execSync(
      `gcloud run services list --region="${region}" --format="json(metadata.name)" --quiet 2>/dev/null`,
    ).toString();

    const services = JSON.parse(output) as { metadata: { name: string } }[];
    return services.map((s) => s.metadata.name);
  } catch {
    console.log("  ⚠️  Could not list Cloud Run services");
    return [];
  }
}

export async function deleteCloudRunService(
  serviceName: string,
  region: string,
): Promise<boolean> {
  try {
    console.log(`  -> Deleting Cloud Run service: ${serviceName} (region: ${region})`);
    execSync(`gcloud run services delete "${serviceName}" --region="${region}" --quiet 2>/dev/null`, { stdio: "ignore" });
    console.log(`  ✓ Cloud Run service deleted: ${serviceName}`);
    return true;
  } catch {
    console.log(`  ⚠️  Cloud Run service not found or could not be deleted: ${serviceName}`);
    return false;
  }
}

// ── Cloud API: Cloudflare Workers ────────────────────────────

export async function listCloudflareWorkers(
  accountId: string,
  token: string,
): Promise<string[]> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const data = (await response.json()) as {
    success: boolean;
    result: { id: string }[];
  };

  if (!data.success || !data.result?.length) return [];

  return data.result.map((w) => w.id);
}

export async function deleteCloudflareWorker(
  accountId: string,
  token: string,
  scriptName: string,
): Promise<boolean> {
  console.log(`  -> Deleting Worker script: ${scriptName}`);
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const data = (await response.json()) as { success: boolean; errors?: { message: string; code: number }[] };
  if (data.success) {
    console.log(`  ✓ Worker script deleted: ${scriptName}`);
    return true;
  }

  const code = data.errors?.[0]?.code ?? 0;
  if (code === 10007) {
    console.log(`  ✓ Worker script not found (already deleted): ${scriptName}`);
    return true;
  }

  console.log(`  ✗ Failed to delete Worker script: ${data.errors?.[0]?.message ?? "Unknown"}`);
  return false;
}

// ── Cloud API: Cloudflare DNS ────────────────────────────────

export async function deleteDnsRecord(
  zoneId: string,
  token: string,
  fullDomain: string,
): Promise<boolean> {
  console.log(`  -> Deleting DNS record: ${fullDomain}`);

  const lookupResp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?name=${fullDomain}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const lookupData = (await lookupResp.json()) as {
    result: { id: string }[];
  };

  const recordId = lookupData.result?.[0]?.id;
  if (!recordId) {
    console.log(`  ✓ No DNS record found for ${fullDomain}`);
    return true;
  }

  const deleteResp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const deleteData = (await deleteResp.json()) as { success: boolean; errors?: { message: string }[] };
  if (deleteData.success) {
    console.log(`  ✓ DNS record deleted: ${fullDomain}`);
    return true;
  }

  console.log(`  ✗ Failed to delete DNS record: ${deleteData.errors?.[0]?.message ?? "Unknown"}`);
  return false;
}

// ── Orphan detection ─────────────────────────────────────────

export function findOrphanCloudflareProjects(
  allProjects: string[],
  activePackages: Map<string, ActivePackage>,
  domainPrefix: string,
): OrphanResource[] {
  const orphans: OrphanResource[] = [];

  // Build set of expected CF project names
  const expectedNames = new Set<string>();
  for (const [, pkg] of activePackages) {
    if (pkg.deploy === "cloudflare-pages") {
      const name = cloudflareProjectName(
        pkg.subdomain,
        pkg.rootDomain,
        domainPrefix,
        pkg.cloudflareUse,
        pkg.folderName,
      );
      expectedNames.add(name);
    }
  }

  // Filter projects matching our naming pattern
  for (const project of allProjects) {
    const matchesPrefix = project.startsWith(`${domainPrefix}-`) || project === domainPrefix;
    if (!matchesPrefix) continue;
    if (expectedNames.has(project)) continue;

    // Extract subdomain from project name
    let subdomain = "";
    if (project === domainPrefix) {
      // root domain project
    } else {
      subdomain = project.slice(domainPrefix.length + 1);
    }

    orphans.push({
      resource: { name: project, type: "cloudflare-pages" },
      subdomain,
      fullDomain: subdomain ? `${subdomain}.${domainPrefix}` : domainPrefix,
      hasCloudflare: true,
    });
  }

  return orphans;
}

export function findOrphanNetlifySites(
  allSites: string[],
  activePackages: Map<string, ActivePackage>,
): OrphanResource[] {
  const orphans: OrphanResource[] = [];

  const expectedNames = new Set<string>();
  for (const [, pkg] of activePackages) {
    if (pkg.deploy === "netlify") {
      expectedNames.add(netlifyProjectName(pkg.subdomain));
    }
  }

  const suffix = "-embark";
  for (const site of allSites) {
    if (!site.endsWith(suffix)) continue;
    if (expectedNames.has(site)) continue;

    const subdomain = site.slice(0, -suffix.length);

    orphans.push({
      resource: { name: site, type: "netlify" },
      subdomain,
      fullDomain: "",
      hasCloudflare: false,
    });
  }

  return orphans;
}

export function findOrphanCloudRunServices(
  allServices: string[],
  activePackages: Map<string, ActivePackage>,
): OrphanResource[] {
  const orphans: OrphanResource[] = [];

  const expectedNames = new Set<string>();
  for (const [, pkg] of activePackages) {
    if (pkg.deploy === "gcp") {
      expectedNames.add(gcpServiceName(pkg.folderName));
    }
  }

  // We can only identify GCP orphans if they match a known pattern
  // Since GCP service names are just lowercase package names, we check
  // all services but only flag ones that look like they could be ours
  for (const service of allServices) {
    if (expectedNames.has(service)) continue;
    // We include all services not in the active set —
    // the workflow should be scoped to a dedicated GCP project for this monorepo
    orphans.push({
      resource: { name: service, type: "gcp" },
      subdomain: service,
      fullDomain: "",
      hasCloudflare: false,
    });
  }

  return orphans;
}

export function findOrphanCloudflareWorkers(
  allWorkers: string[],
  activePackages: Map<string, ActivePackage>,
  domainPrefix: string,
): OrphanResource[] {
  const orphans: OrphanResource[] = [];

  const expectedNames = new Set<string>();
  for (const [, pkg] of activePackages) {
    if (pkg.deploy === "cloudflare-workers") {
      const name = workerScriptName(
        pkg.subdomain,
        pkg.rootDomain,
        domainPrefix,
        pkg.cloudflareUse,
        pkg.folderName,
      );
      expectedNames.add(name);
    }
  }

  for (const worker of allWorkers) {
    const matchesPrefix = worker.startsWith(`${domainPrefix}-`) || worker === domainPrefix;
    if (!matchesPrefix) continue;
    if (expectedNames.has(worker)) continue;

    let subdomain = "";
    if (worker !== domainPrefix) {
      subdomain = worker.slice(domainPrefix.length + 1);
    }

    orphans.push({
      resource: { name: worker, type: "cloudflare-workers" },
      subdomain,
      fullDomain: subdomain ? `${subdomain}.${domainPrefix}` : domainPrefix,
      hasCloudflare: true,
    });
  }

  return orphans;
}

// ── Main execution ───────────────────────────────────────────

interface CleanupConfig {
  cfToken?: string;
  cfWorkerToken?: string;
  cfAccountId?: string;
  cfZoneId?: string;
  domain?: string;
  netlifyToken?: string;
  gcpProjectId?: string;
  gcpRegion?: string;
  gcpSaKey?: string;
  packagesDir?: string;
}

export async function cleanupOrphanApps(config: CleanupConfig): Promise<number> {
  const packagesDir = config.packagesDir ?? PACKAGES_DIR;
  const domain = config.domain ?? "";
  const domainPrefix = domain.split(".")[0] ?? "";

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔍 Scanning active packages...");

  const activePackages = await getActivePackages(packagesDir);
  console.log(`   Found ${activePackages.size} active package(s)`);

  let totalOrphans = 0;

  // ── Cloudflare Pages ─────────────────────────────────────
  if (config.cfToken && config.cfAccountId && domainPrefix) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("☁️  Checking Cloudflare Pages...");

    const allProjects = await listCloudflarePageProjects(config.cfAccountId, config.cfToken);
    console.log(`   Found ${allProjects.length} total project(s)`);

    const orphans = findOrphanCloudflareProjects(allProjects, activePackages, domainPrefix);
    console.log(`   Found ${orphans.length} orphan(s)`);

    for (const orphan of orphans) {
      console.log(`\n   Cleaning: ${orphan.resource.name}`);
      const fullDomain = orphan.subdomain
        ? `${orphan.subdomain}.${domain}`
        : domain;

      await deleteCloudflarePageProject(
        config.cfAccountId,
        config.cfToken,
        orphan.resource.name,
        fullDomain,
      );

      // Clean DNS
      if (config.cfZoneId && config.cfToken) {
        await deleteDnsRecord(config.cfZoneId, config.cfToken, fullDomain);
      }
    }

    totalOrphans += orphans.length;
  }

  // ── Netlify ──────────────────────────────────────────────
  if (config.netlifyToken) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🌐 Checking Netlify...");

    const allSites = await listNetlifySites(config.netlifyToken);
    console.log(`   Found ${allSites.length} total site(s)`);

    const orphans = findOrphanNetlifySites(allSites, activePackages);
    console.log(`   Found ${orphans.length} orphan(s)`);

    for (const orphan of orphans) {
      console.log(`\n   Cleaning: ${orphan.resource.name}`);
      await deleteNetlifySite(config.netlifyToken, orphan.resource.name);

      // Clean DNS if Cloudflare is configured
      if (config.cfZoneId && config.cfToken && domain && orphan.subdomain) {
        const fullDomain = `${orphan.subdomain}.${domain}`;
        await deleteDnsRecord(config.cfZoneId, config.cfToken, fullDomain);
      }
    }

    totalOrphans += orphans.length;
  }

  // ── GCP Cloud Run ────────────────────────────────────────
  if (config.gcpProjectId && config.gcpSaKey) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 Checking GCP Cloud Run...");

    const region = config.gcpRegion ?? "us-central1";
    const allServices = await listCloudRunServices(config.gcpProjectId, region, config.gcpSaKey);
    console.log(`   Found ${allServices.length} total service(s)`);

    const orphans = findOrphanCloudRunServices(allServices, activePackages);
    console.log(`   Found ${orphans.length} orphan(s)`);

    for (const orphan of orphans) {
      console.log(`\n   Cleaning: ${orphan.resource.name}`);
      await deleteCloudRunService(orphan.resource.name, region);

      // Clean DNS if Cloudflare is configured
      if (config.cfZoneId && config.cfToken && domain && orphan.subdomain) {
        const fullDomain = `${orphan.subdomain}.${domain}`;
        await deleteDnsRecord(config.cfZoneId, config.cfToken, fullDomain);
      }
    }

    totalOrphans += orphans.length;
  }

  // ── Cloudflare Workers ──────────────────────────────────
  if (config.cfWorkerToken && config.cfAccountId && domainPrefix) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚡ Checking Cloudflare Workers...");

    const allWorkers = await listCloudflareWorkers(config.cfAccountId, config.cfWorkerToken);
    console.log(`   Found ${allWorkers.length} total worker(s)`);

    const orphans = findOrphanCloudflareWorkers(allWorkers, activePackages, domainPrefix);
    console.log(`   Found ${orphans.length} orphan(s)`);

    for (const orphan of orphans) {
      console.log(`\n   Cleaning: ${orphan.resource.name}`);
      await deleteCloudflareWorker(
        config.cfAccountId,
        config.cfWorkerToken,
        orphan.resource.name,
      );

      // Clean DNS
      if (config.cfZoneId && config.cfWorkerToken) {
        const fullDomain = orphan.subdomain
          ? `${orphan.subdomain}.${domain}`
          : domain;
        await deleteDnsRecord(config.cfZoneId, config.cfWorkerToken, fullDomain);
      }
    }

    totalOrphans += orphans.length;
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  if (totalOrphans === 0) {
    console.log("✅ No orphan resources found");
  } else {
    console.log(`✅ Cleaned ${totalOrphans} orphan resource(s)`);
  }

  return totalOrphans;
}

if (import.meta.main) {
  const config: CleanupConfig = {
    cfToken: process.env["CF_TOKEN"],
    cfWorkerToken: process.env["CF_WORKER_TOKEN"],
    cfAccountId: process.env["CF_ACCOUNT_ID"],
    cfZoneId: process.env["CF_ZONE_ID"],
    domain: process.env["DOMAIN"],
    netlifyToken: process.env["NETLIFY_TOKEN"],
    gcpProjectId: process.env["GCP_PROJECT_ID"],
    gcpRegion: process.env["GCP_REGION"],
    gcpSaKey: process.env["GCP_SA_KEY"],
  };

  cleanupOrphanApps(config).catch((error) => {
    console.error("[cleanup-orphan-apps] error:", error);
    process.exit(1);
  });
}
