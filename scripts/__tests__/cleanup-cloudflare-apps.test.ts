import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { rmSync, existsSync } from "node:fs";
import {
  getActiveSubdomains,
  findOrphanedApps,
  removeAppsEntries,
} from "../cleanup-cloudflare-apps";
import type { AppEntry } from "../update-apps-jsonc";

const TEST_DIR = join(import.meta.dirname, "../..", ".test-cleanup-cf");
const PACKAGES_DIR = join(TEST_DIR, "packages");

const completeConfig = {
  deploy: { appDeployment: "cloudflare-pages", cloudflareUse: true, workflowGen: true },
  name: "myApp",
  title: "My App",
  subdomain: "my-app",
  description: "A great app",
  rootDomain: false,
};

async function setup() {
  if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true, force: true });
  await mkdir(PACKAGES_DIR, { recursive: true });
}

async function teardown() {
  if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true, force: true });
}

async function createPackage(dirName: string, config: Record<string, unknown>) {
  const pkgDir = join(PACKAGES_DIR, dirName);
  await mkdir(pkgDir, { recursive: true });
  await writeFile(join(pkgDir, ".embark.jsonc"), JSON.stringify(config, null, 2));
}

async function writeAppsJsonc(entries: AppEntry[]) {
  await writeFile(join(TEST_DIR, "apps.jsonc"), JSON.stringify(entries, null, 2) + "\n");
}

describe("getActiveSubdomains", () => {
  beforeEach(setup);
  afterEach(teardown);

  it("returns empty set when no packages exist", async () => {
    const result = await getActiveSubdomains(PACKAGES_DIR);
    expect(result.size).toBe(0);
  });

  it("returns subdomains from active packages", async () => {
    await createPackage("my-app", completeConfig);
    await createPackage("other-app", { ...completeConfig, name: "otherApp", subdomain: "other" });

    const result = await getActiveSubdomains(PACKAGES_DIR);
    expect(result.has("my-app")).toBe(true);
    expect(result.has("other")).toBe(true);
  });

  it("skips packages with incomplete config", async () => {
    const pkgDir = join(PACKAGES_DIR, "incomplete");
    await mkdir(pkgDir, { recursive: true });
    await writeFile(join(pkgDir, ".embark.jsonc"), JSON.stringify({ name: "incomplete" }));

    const result = await getActiveSubdomains(PACKAGES_DIR);
    expect(result.size).toBe(0);
  });

  it("handles non-existent packages directory", async () => {
    const result = await getActiveSubdomains(join(TEST_DIR, "nonexistent"));
    expect(result.size).toBe(0);
  });
});

describe("findOrphanedApps", () => {
  beforeEach(setup);
  afterEach(teardown);

  it("returns empty array when apps.jsonc does not exist", async () => {
    const result = await findOrphanedApps(PACKAGES_DIR, TEST_DIR);
    expect(result).toEqual([]);
  });

  it("returns empty array when all folders still exist", async () => {
    await createPackage("my-app", completeConfig);
    await writeAppsJsonc([
      { name: "myApp", folderName: "my-app", rootDomain: false, subdomain: "my-app" },
    ]);

    const result = await findOrphanedApps(PACKAGES_DIR, TEST_DIR);
    expect(result).toHaveLength(0);
  });

  it("returns orphan when folder is deleted and subdomain not reused", async () => {
    // apps.jsonc has an entry for deleted-app
    await writeAppsJsonc([
      { name: "deletedApp", folderName: "deleted-app", rootDomain: false, subdomain: "deleted" },
    ]);
    // packages/ is empty — folder doesn't exist

    const result = await findOrphanedApps(PACKAGES_DIR, TEST_DIR);
    expect(result).toHaveLength(1);
    expect(result[0]?.folderName).toBe("deleted-app");
    expect(result[0]?.subdomain).toBe("deleted");
  });

  it("skips orphan when subdomain is reused by another active package", async () => {
    // Active package uses the same subdomain
    await createPackage("new-app", { ...completeConfig, name: "newApp", subdomain: "my-app" });
    await writeAppsJsonc([
      // Entry for old folder with same subdomain
      { name: "myApp", folderName: "my-app-old", rootDomain: false, subdomain: "my-app" },
    ]);

    const result = await findOrphanedApps(PACKAGES_DIR, TEST_DIR);
    expect(result).toHaveLength(0);
  });

  it("handles entry with empty subdomain", async () => {
    await writeAppsJsonc([
      { name: "rootApp", folderName: "root-app", rootDomain: true, subdomain: "" },
    ]);

    const result = await findOrphanedApps(PACKAGES_DIR, TEST_DIR);
    expect(result).toHaveLength(1);
    expect(result[0]?.folderName).toBe("root-app");
  });
});

describe("removeAppsEntries", () => {
  beforeEach(setup);
  afterEach(teardown);

  it("returns false when folderNames is empty", async () => {
    const result = await removeAppsEntries([], TEST_DIR);
    expect(result).toBe(false);
  });

  it("removes specified entries from apps.jsonc", async () => {
    await writeAppsJsonc([
      { name: "myApp", folderName: "my-app", rootDomain: false, subdomain: "my-app" },
      { name: "otherApp", folderName: "other-app", rootDomain: false, subdomain: "other" },
    ]);

    const result = await removeAppsEntries(["my-app"], TEST_DIR);
    expect(result).toBe(true);

    const content = await readFile(join(TEST_DIR, "apps.jsonc"), "utf-8");
    const parsed = JSON.parse(content) as AppEntry[];
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.folderName).toBe("other-app");
  });

  it("returns false when folderName not found in apps.jsonc", async () => {
    await writeAppsJsonc([
      { name: "myApp", folderName: "my-app", rootDomain: false, subdomain: "my-app" },
    ]);

    const result = await removeAppsEntries(["nonexistent"], TEST_DIR);
    expect(result).toBe(false);
  });

  it("returns false when apps.jsonc does not exist", async () => {
    const result = await removeAppsEntries(["my-app"], TEST_DIR);
    expect(result).toBe(false);
  });

  it("can remove multiple entries at once", async () => {
    await writeAppsJsonc([
      { name: "appA", folderName: "app-a", rootDomain: false, subdomain: "a" },
      { name: "appB", folderName: "app-b", rootDomain: false, subdomain: "b" },
      { name: "appC", folderName: "app-c", rootDomain: false, subdomain: "c" },
    ]);

    await removeAppsEntries(["app-a", "app-b"], TEST_DIR);

    const content = await readFile(join(TEST_DIR, "apps.jsonc"), "utf-8");
    const parsed = JSON.parse(content) as AppEntry[];
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.folderName).toBe("app-c");
  });
});
