import { readdir, readFile, writeFile, mkdir, access } from "node:fs/promises";
import { execSync } from "node:child_process";
import { join } from "node:path";
import { readEmbarkConfig, shouldGenerateWorkflow } from "./embark-config";
import type { AppDeployment } from "./embark-config";

const ROOT = join(import.meta.dirname, "..");
const PACKAGES_DIR = join(ROOT, "packages");
const TEMPLATES_DIR = join(ROOT, "templates");
const WORKFLOWS_DIR = join(ROOT, ".github", "workflows");
const PLACEHOLDER = "__PACKAGE_NAME__";
const PLACEHOLDER_LOWERCASE = "__PACKAGE_NAME_LOWERCASE__";
const PLACEHOLDER_SUBDOMAIN = "__SUBDOMAIN__";
const PLACEHOLDER_ROOT_DOMAIN = "__ROOT_DOMAIN__";
const PLACEHOLDER_DOMAIN_SETUP = "__DOMAIN_SETUP__";
const PLACEHOLDER_SUBMODULES_WITH = "__SUBMODULES_WITH__";

export async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function getPackageNames(): Promise<string[]> {
  const entries = await readdir(PACKAGES_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

export async function buildWorkflowContent(
  packageName: string,
  appDeployment: AppDeployment,
  cloudflareUse: boolean,
  subdomain?: string,
  rootDomain?: boolean,
  useSubmodule?: boolean,
): Promise<string> {
  const templateFile =
    appDeployment === "netlify"
      ? "workflow.netlify.template.yml"
      : appDeployment === "gcp"
        ? "workflow.gcp.template.yml"
        : appDeployment === "cloudflare-pages"
          ? "workflow.cloudflare-pages.template.yml"
          : "workflow.template.yml";

  const baseTemplate = await readFile(join(TEMPLATES_DIR, templateFile), "utf-8");

  let content = baseTemplate;

  // Cloudflare steps only apply to netlify and gcp deployments (cloudflare-pages already includes DNS setup)
  if (cloudflareUse && (appDeployment === "netlify" || appDeployment === "gcp")) {
    const cfStepsFile =
      appDeployment === "netlify"
        ? "cloudflare.netlify.steps.yml"
        : "cloudflare.gcp.steps.yml";
    const cfSteps = await readFile(join(TEMPLATES_DIR, cfStepsFile), "utf-8");
    content = content.trimEnd() + "\n" + cfSteps;
  }

  const subdomainValue = subdomain ?? packageName.toLowerCase();

  const submodulesWithValue = useSubmodule === true
    ? "\n        with:\n          submodules: recursive"
    : "";

  return content
    .replaceAll(PLACEHOLDER, packageName)
    .replaceAll(PLACEHOLDER_LOWERCASE, packageName.toLowerCase())
    .replaceAll(PLACEHOLDER_SUBDOMAIN, subdomainValue)
    .replaceAll(PLACEHOLDER_ROOT_DOMAIN, rootDomain === true ? "true" : "false")
    .replaceAll(PLACEHOLDER_DOMAIN_SETUP, cloudflareUse === true ? "true" : "false")
    .replaceAll(PLACEHOLDER_SUBMODULES_WITH, submodulesWithValue);
}

export async function processPackageWorkflow(
  packageName: string,
  appDeployment: AppDeployment,
  cloudflareUse: boolean,
  workflowsDir: string,
  subdomain?: string,
  rootDomain?: boolean,
  useSubmodule?: boolean,
): Promise<boolean> {
  const workflowPath = join(workflowsDir, `${packageName}.yml`);

  // if the workflow already exists, don't overwrite (it may have been manually edited)
  if (await exists(workflowPath)) {
    return false;
  }

  const content = await buildWorkflowContent(packageName, appDeployment, cloudflareUse, subdomain, rootDomain, useSubmodule);
  await writeFile(workflowPath, content, "utf-8");
  console.log(`[generate-workflows] created: .github/workflows/${packageName}.yml`);
  return true;
}

export interface PackageWorkflowData {
  name: string;
  appDeployment: AppDeployment;
  cloudflareUse: boolean;
  subdomain?: string;
  rootDomain?: boolean;
  useSubmodule?: boolean;
}

export async function processPackagesWorkflows(
  packages: PackageWorkflowData[],
  workflowsDir: string,
): Promise<boolean> {
  let hasChanges = false;

  for (const pkg of packages) {
    const changed = await processPackageWorkflow(
      pkg.name,
      pkg.appDeployment,
      pkg.cloudflareUse,
      workflowsDir,
      pkg.subdomain,
      pkg.rootDomain,
      pkg.useSubmodule,
    );
    if (changed) {
      hasChanges = true;
    }
  }

  return hasChanges;
}

async function generateWorkflows() {
  const allPackages = await getPackageNames();

  const packages: PackageWorkflowData[] = [];
  for (const pkg of allPackages) {
    const pkgDir = join(PACKAGES_DIR, pkg);
    if (!(await shouldGenerateWorkflow(pkgDir))) {
      console.log(`[generate-workflows] ${pkg}: workflowGen=false, skipping workflow`);
      continue;
    }
    const config = await readEmbarkConfig(pkgDir);
    packages.push({
      name: pkg,
      appDeployment: config?.deploy?.appDeployment ?? "gcp",
      cloudflareUse: config?.deploy?.cloudflareUse ?? false,
      subdomain: config?.subdomain,
      rootDomain: config?.rootDomain,
      useSubmodule: config?.useSubmodule,
    });
  }

  await mkdir(WORKFLOWS_DIR, { recursive: true });

  const hasChanges = await processPackagesWorkflows(packages, WORKFLOWS_DIR);

  if (hasChanges) {
    execSync("git add .github/workflows/", { cwd: ROOT, stdio: "inherit" });
  } else {
    console.log("[generate-workflows] all workflows already exist, none created");
  }
}

if (import.meta.main) {
  generateWorkflows().catch((error) => {
    console.error("[generate-workflows] error:", error);
    process.exit(1);
  });
}
