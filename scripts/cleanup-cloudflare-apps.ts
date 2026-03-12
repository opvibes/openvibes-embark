import { readFile, writeFile, readdir, access } from "node:fs/promises";
import { execSync } from "node:child_process";
import { join } from "node:path";
import type { AppEntry } from "./update-apps-jsonc";
import { readEmbarkConfig, hasCompleteEmbarkConfig } from "./embark-config";

const ROOT = join(import.meta.dirname, "..");
const PACKAGES_DIR = join(ROOT, "packages");

export interface OrphanEntry extends AppEntry {
  reason: string;
}

/**
 * Collects all active subdomains from .embark.jsonc files in packages/.
 */
export async function getActiveSubdomains(packagesDir = PACKAGES_DIR): Promise<Set<string>> {
  let entries: import("node:fs").Dirent[];
  try {
    entries = await readdir(packagesDir, { withFileTypes: true });
  } catch {
    return new Set();
  }

  const subdomains = new Set<string>();
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pkgDir = join(packagesDir, String(entry.name));
    if (!(await hasCompleteEmbarkConfig(pkgDir))) continue;
    const config = await readEmbarkConfig(pkgDir);
    if (config?.subdomain) subdomains.add(config.subdomain);
  }
  return subdomains;
}

/**
 * Reads apps.jsonc and returns entries whose folderName no longer exists
 * and whose subdomain is not reused by any active package.
 */
export async function findOrphanedApps(
  packagesDir = PACKAGES_DIR,
  root = ROOT,
): Promise<OrphanEntry[]> {
  const appsPath = join(root, "apps.jsonc");

  let allEntries: AppEntry[] = [];
  try {
    await access(appsPath);
    const content = await readFile(appsPath, "utf-8");
    allEntries = JSON.parse(content) as AppEntry[];
  } catch {
    return [];
  }

  const activeSubdomains = await getActiveSubdomains(packagesDir);

  const orphans: OrphanEntry[] = [];
  for (const entry of allEntries) {
    // Check if the folder still exists
    const folderPath = join(packagesDir, entry.folderName);
    let folderExists = false;
    try {
      await access(folderPath);
      folderExists = true;
    } catch {
      folderExists = false;
    }

    if (folderExists) continue;

    // Folder is gone — check if subdomain is reused
    if (entry.subdomain && activeSubdomains.has(entry.subdomain)) {
      console.log(
        `[cleanup-cloudflare-apps] Skipping ${entry.folderName}: subdomain "${entry.subdomain}" is reused by another package`,
      );
      continue;
    }

    orphans.push({ ...entry, reason: "folder deleted and subdomain not reused" });
  }

  return orphans;
}

/**
 * Removes entries with the given folderNames from apps.jsonc and stages the change.
 */
export async function removeAppsEntries(
  folderNames: string[],
  root = ROOT,
): Promise<boolean> {
  if (folderNames.length === 0) return false;

  const appsPath = join(root, "apps.jsonc");

  let allEntries: AppEntry[] = [];
  try {
    const content = await readFile(appsPath, "utf-8");
    allEntries = JSON.parse(content) as AppEntry[];
  } catch {
    return false;
  }

  const toRemove = new Set(folderNames);
  const remaining = allEntries.filter((e) => !toRemove.has(e.folderName));

  if (remaining.length === allEntries.length) return false;

  const newContent = JSON.stringify(remaining, null, 2) + "\n";
  await writeFile(appsPath, newContent);

  try {
    execSync("git add apps.jsonc", { cwd: root, stdio: "ignore" });
  } catch {
    // May fail in test environments without git
  }

  console.log(
    `[cleanup-cloudflare-apps] Removed ${allEntries.length - remaining.length} orphaned entry/entries from apps.jsonc`,
  );
  return true;
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const mode = args[0] ?? "find-orphans";

  if (mode === "find-orphans") {
    const orphans = await findOrphanedApps();
    if (orphans.length === 0) {
      console.log("[cleanup-cloudflare-apps] No orphaned apps found");
      process.stdout.write("[]\n");
    } else {
      console.log(`[cleanup-cloudflare-apps] Found ${orphans.length} orphaned app(s)`);
      process.stdout.write(JSON.stringify(orphans, null, 2) + "\n");
    }
  } else if (mode === "remove-entries") {
    const dataArg = args.find((a) => a.startsWith("--data="));
    if (!dataArg) {
      console.error("[cleanup-cloudflare-apps] --data=<json> is required for remove-entries");
      process.exit(1);
    }
    const data = JSON.parse(dataArg.replace("--data=", "")) as OrphanEntry[];
    const folderNames = data.map((e) => e.folderName);
    await removeAppsEntries(folderNames);
  } else {
    console.error(`[cleanup-cloudflare-apps] Unknown mode: ${mode}`);
    process.exit(1);
  }
}
