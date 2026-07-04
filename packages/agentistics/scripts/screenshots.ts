/**
 * screenshots.ts — Captures real Playwright screenshots of the running
 * agentistics dashboard + agentistics central for the release marketing site.
 *
 * Prerequisites (all real, already-running services — nothing here starts them):
 *   - Solo agentistics dashboard at http://localhost:47292 (web) with real
 *     harness data (Claude Code, Codex CLI, Gemini CLI, Copilot CLI).
 *   - An agentistics central at http://localhost:48090 (override via
 *     TEAM_CENTRAL_URL) with at least one connected member so the Team
 *     Manager / member filter shots show real presence, not an empty state.
 *
 * The central's admin routes (/api/team/tokens, /api/team/members, ...) are
 * session-gated when a team password is set. Pass that password via the
 * TEAM_CENTRAL_PASSWORD env var so this script can log in itself — it is
 * never hardcoded here since it's specific to whichever central you point
 * this at.
 *
 * NOTE on routes: the plan this script was written from assumed URL routes
 * (`/settings`, `/settings/team`, `/h/:harness`) that no longer exist in the
 * current dashboard — Settings and the old per-harness page were folded into
 * a single in-page "Settings" modal (no deep-linkable path) with tabs
 * ("Team", "Data & sources", ...). This script drives that modal via clicks
 * instead of navigating to those paths.
 */

import { chromium, type Page, type BrowserContext } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = join(import.meta.dirname, "..", "public", "release", "screenshots");

const SOLO_URL = process.env.SOLO_DASHBOARD_URL ?? "http://localhost:47292";
const TEAM_URL = process.env.TEAM_CENTRAL_URL ?? "http://localhost:48090";
const TEAM_PASSWORD = process.env.TEAM_CENTRAL_PASSWORD;

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

/** Waits for the dashboard's initial parallel data load (stats/session/health/
 * project scans) to finish. On a host with a lot of real history this can
 * take 20-30s, so `networkidle` (which never fires — the app holds an open
 * SSE/WebSocket connection) is not usable here. */
async function waitForDashboardData(page: Page, timeoutMs = 60_000): Promise<void> {
  await page.waitForFunction(
    () => !document.body.innerText.includes("Loading your data"),
    undefined,
    { timeout: timeoutMs },
  );
}

async function shoot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: join(OUT_DIR, `${name}.png`) });
  console.log(`captured ${name}.png`);
}

/** Logs into a password-protected central by running `fetch` inside an actual
 * page (rather than context.request — which hits a Bun/Playwright network
 * stack incompatibility for API-only requests) so the browser applies the
 * Set-Cookie response header to the context's cookie jar itself. Any page
 * opened afterward in this context is then already authenticated. */
async function loginToCentral(context: BrowserContext): Promise<void> {
  if (!TEAM_PASSWORD) {
    console.warn(
      "TEAM_CENTRAL_PASSWORD not set — team-manager/team-settings/member-filters " +
        "will capture whatever the central shows unauthenticated (likely the login screen).",
    );
    return;
  }
  const page = await context.newPage();
  await page.goto(TEAM_URL, { waitUntil: "load" });
  const ok = await page.evaluate(async (password: string) => {
    const res = await fetch("/api/team/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return res.ok;
  }, TEAM_PASSWORD);
  await page.close();
  if (!ok) {
    throw new Error("central login failed");
  }
}

async function captureSoloShots(browser: import("playwright").Browser): Promise<void> {
  // compare.png — side-by-side harness comparison, real multi-harness data.
  {
    const page = await browser.newPage({ viewport: DESKTOP });
    await page.goto(`${SOLO_URL}/compare`, { waitUntil: "load" });
    await waitForDashboardData(page);
    // The Compare page does its own async fetch/render after the shell's
    // "Loading your data" overlay clears — wait for its content specifically.
    await page.waitForSelector("text=Compare harnesses", { timeout: 60_000 });
    await page.waitForTimeout(500);
    await shoot(page, "compare");
    await page.close();
  }

  // harness-codex.png — the old standalone `/h/codex` page was folded into the
  // Settings modal's "Data & sources" tab (per-harness selector). Open the
  // modal and select Codex CLI there instead.
  {
    const page = await browser.newPage({ viewport: DESKTOP });
    await page.goto(SOLO_URL, { waitUntil: "load" });
    await waitForDashboardData(page);
    await page.locator('button[title="Settings"]').click();
    await page.getByRole("button", { name: "Data & sources" }).click();
    await page.getByRole("button", { name: "Codex CLI" }).click();
    await page.waitForTimeout(500);
    await shoot(page, "harness-codex");
    await page.close();
  }

  // mobile-dashboard.png — home page at a mobile viewport. Like Compare, the
  // Home page renders its own metric cards asynchronously after the shell's
  // loading overlay clears, so wait for one of those specifically too.
  {
    const page = await browser.newPage({ viewport: MOBILE });
    await page.goto(SOLO_URL, { waitUntil: "load" });
    await waitForDashboardData(page);
    await page.waitForSelector("text=Highlights", { timeout: 60_000 });
    await page.waitForTimeout(500);
    await shoot(page, "mobile-dashboard");
    await page.close();
  }
}

async function captureTeamShots(browser: import("playwright").Browser): Promise<void> {
  // team-login.png — unauthenticated central shows its password gate.
  {
    const context = await browser.newContext({ viewport: DESKTOP });
    const page = await context.newPage();
    await page.goto(TEAM_URL, { waitUntil: "load" });
    await page.waitForSelector("text=Sign in");
    await shoot(page, "team-login");
    await context.close();
  }

  // Authenticated context for the rest of the central shots.
  const context = await browser.newContext({ viewport: DESKTOP });
  await loginToCentral(context);

  // team-settings.png — top of the Settings modal's "Team" tab (central config).
  {
    const page = await context.newPage();
    await page.goto(TEAM_URL, { waitUntil: "load" });
    await waitForDashboardData(page);
    await page.locator('button[title="Settings"]').click();
    await page.getByRole("button", { name: "Team", exact: true }).click();
    await page.waitForTimeout(500);
    await shoot(page, "team-settings");
    await page.close();
  }

  // team-manager.png — same tab, scrolled down to the "mint a new token" form
  // below the member table (the settings shot above already shows the top of
  // the tab — push interval + member table — in full, since the modal fits
  // both without scrolling at this viewport).
  {
    const page = await context.newPage();
    await page.goto(TEAM_URL, { waitUntil: "load" });
    await waitForDashboardData(page);
    await page.locator('button[title="Settings"]').click();
    await page.getByRole("button", { name: "Team", exact: true }).click();
    await page.waitForSelector("text=Members (central admin)");
    await page.getByRole("button", { name: "Mint token" }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await shoot(page, "team-manager");
    await page.close();
  }

  // member-filters.png — the dashboard's member multi-select filter dropdown,
  // open, showing the real connected member(s).
  {
    const page = await context.newPage();
    await page.goto(TEAM_URL, { waitUntil: "load" });
    await waitForDashboardData(page);
    await page.getByTitle("All members").click();
    await page.waitForTimeout(300);
    await shoot(page, "member-filters");
    await page.close();
  }

  await context.close();
}

async function run(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();

  await captureSoloShots(browser);
  await captureTeamShots(browser);

  await browser.close();
}

await run();
