import { readFile, writeFile, readdir, access } from "node:fs/promises";
import { execSync } from "node:child_process";
import { join } from "node:path";
import { readEmbarkConfig, hasCompleteEmbarkConfig } from "./embark-config";

const ROOT = join(import.meta.dirname, "..");
const PACKAGES_DIR = join(ROOT, "packages");

export interface AppEntry {
  name: string;
  rootDomain: boolean;
  subdomain: string;
}

export async function buildAppsEntries(
  packagesDir = PACKAGES_DIR,
): Promise<AppEntry[]> {
  let entries: Awaited<ReturnType<typeof readdir>>;
  try {
    entries = await readdir(packagesDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const apps: AppEntry[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pkgDir = join(packagesDir, entry.name);
    if (!(await hasCompleteEmbarkConfig(pkgDir))) continue;

    const config = await readEmbarkConfig(pkgDir);
    if (!config?.name) continue;

    apps.push({
      name: config.name,
      rootDomain: config.rootDomain ?? false,
      subdomain: config.subdomain ?? "",
    });
  }

  return apps.sort((a, b) => a.name.localeCompare(b.name));
}

export async function updateAppsJsonc(
  packagesDir = PACKAGES_DIR,
  root = ROOT,
): Promise<boolean> {
  const appsPath = join(root, "apps.jsonc");
  const apps = await buildAppsEntries(packagesDir);
  const newContent = JSON.stringify(apps, null, 2) + "\n";

  let existingContent = "";
  try {
    await access(appsPath);
    existingContent = await readFile(appsPath, "utf-8");
  } catch {
    // File doesn't exist yet
  }

  if (existingContent === newContent) {
    console.log("[update-apps-jsonc] apps.jsonc is already up to date");
    return false;
  }

  await writeFile(appsPath, newContent);

  try {
    execSync("git add apps.jsonc", { cwd: root, stdio: "ignore" });
  } catch {
    // May fail in test environments without git
  }

  console.log(`[update-apps-jsonc] apps.jsonc updated with ${apps.length} package(s)`);
  return true;
}

if (import.meta.main) {
  updateAppsJsonc().catch((error) => {
    console.error("[update-apps-jsonc] error:", error);
    process.exit(1);
  });
}
