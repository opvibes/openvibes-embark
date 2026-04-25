import { readFile } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { spawn } from "node:child_process";
import { join } from "node:path";
import * as readline from "node:readline";
import * as fs from "node:fs";
import * as tty from "node:tty";
import { hasEmbarkConfig, readEmbarkConfig, getMissingFields, isConfigComplete, findRootDomainPackage, getPackagesWithoutConfig, getPackagesWithIncompleteConfig, validateSubdomain, assessRootDomainEligibility } from "./embark-config";
import type { AppDeployment, DeployConfig, EmbarkConfig, PackageConfigStatus, RootDomainState } from "./embark-config";
import { processPackageDockerfile } from "./generate-dockerfiles";

const ROOT = join(import.meta.dirname, "..");
const PACKAGES_DIR = join(ROOT, "packages");
const PROMPT_PATH = join(ROOT, "prompts", "dockerfileGen.prompt.md");

// ── AI CLI types ────────────────────────────────────────────
interface AiCli {
  name: string;
  command: string;
}

interface AiCommand {
  bin: string;
  args: string[];
}

// ── ANSI colors ────────────────────────────────────────────
const COLOR = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  gray: "\x1b[90m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
} as const;

// ── ANSI cursor ────────────────────────────────────────────
const CURSOR = {
  hide: "\x1b[?25l",
  show: "\x1b[?25h",
  clearLine: "\x1b[2K\r",
  moveUp: "\x1b[1A",
} as const;

let TTY_IN: tty.ReadStream | null = null;
let TTY_OUT: fs.WriteStream | null = null;

function tryInitTty() {
  if (TTY_IN && TTY_OUT) return;
  try {
    const fd = fs.openSync("/dev/tty", "r+");
    const inStream = new tty.ReadStream(fd);
    const outStream = fs.createWriteStream(null as any, { fd });
    TTY_IN = inStream;
    TTY_OUT = outStream;
  } catch {
    // TTY not available (e.g., in CI or some hook environments)
  }
}

function write(text: string) {
  process.stdout.write(text);
}

async function readKey(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Prefer using the process stdin when it's a TTY
    if (typeof process.stdin.setRawMode === "function" && process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.once("data", (data) => {
        try {
          process.stdin.setRawMode(false);
        } catch {}
        process.stdin.pause();
        resolve(data.toString());
      });
    } else {
      reject(new Error("TTY not available"));
    }
  });
}

function renderMenu(
  title: string,
  options: string[],
  index: number,
  totalLines: number,
  optionColors?: string[],
) {
  for (let i = 0; i < totalLines; i++) {
    write(CURSOR.moveUp + CURSOR.clearLine);
  }
  write(`  ${title}\n`);
  write(`  ${COLOR.dim}↑/↓ navigate  │  Enter select  │  q cancel${COLOR.reset}\n`);
  write(`\n`);

  for (let i = 0; i < options.length; i++) {
    const activeColor = optionColors?.[i] ?? COLOR.cyan;
    if (i === index) {
      write(`  ${activeColor}${COLOR.bold}❯ ${options[i]}${COLOR.reset}\n`);
    } else {
      write(`  ${COLOR.gray}  ${options[i]}${COLOR.reset}\n`);
    }
  }
}

async function menuSelect(title: string, options: string[], optionColors?: string[]): Promise<number> {
  // If raw mode isn't available (e.g., non-TTY or some CI/hook environments),
  // fall back to a numbered prompt using readline.
  if (typeof process.stdin.setRawMode !== "function" || !process.stdin.isTTY) {
    write(`${title}\n`);
    for (let i = 0; i < options.length; i++) {
      write(`  ${i + 1}. ${options[i]}\n`);
    }
    write(`\n`);

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
      rl.question(`Choose [1-${options.length}] (default 1): `, (answer) => {
        rl.close();
        const n = parseInt(answer.trim(), 10);
        if (Number.isFinite(n) && n >= 1 && n <= options.length) {
          resolve(n - 1);
        } else {
          resolve(0);
        }
      });
    });
  }

  const totalLines = options.length + 3;

  write(CURSOR.hide);
  write(`  ${title}\n`);
  write(`  ${COLOR.dim}↑/↓ navigate  │  Enter select  │  q cancel${COLOR.reset}\n`);
  write(`\n`);

  let index = 0;

  for (let i = 0; i < options.length; i++) {
    const activeColor = optionColors?.[i] ?? COLOR.cyan;
    if (i === index) {
      write(`  ${activeColor}${COLOR.bold}❯ ${options[i]}${COLOR.reset}\n`);
    } else {
      write(`  ${COLOR.gray}  ${options[i]}${COLOR.reset}\n`);
    }
  }

  while (true) {
    let key: string;
    try {
      key = await readKey();
    } catch (err) {
      // If raw mode failed mid-loop, fall back to numeric prompt
      write(CURSOR.show);
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      return new Promise((resolve) => {
        rl.question(`Choose [1-${options.length}] (default 1): `, (answer) => {
          rl.close();
          const n = parseInt(answer.trim(), 10);
          if (Number.isFinite(n) && n >= 1 && n <= options.length) {
            resolve(n - 1);
          } else {
            resolve(0);
          }
        });
      });
    }

    if (key === "\x1b[A") {
      index = (index - 1 + options.length) % options.length;
    } else if (key === "\x1b[B") {
      index = (index + 1) % options.length;
    } else if (key === "\r" || key === "\n") {
      write(CURSOR.show);
      return index;
    } else if (key === "q" || key === "\x03") {
      write(CURSOR.show);
      return 0; // Default to first option on cancel
    } else {
      continue;
    }

    renderMenu(title, options, index, totalLines, optionColors);
  }
}

async function askYesNo(question: string): Promise<boolean> {
  const selected = await menuSelect(`${question}`, ["Yes", "No"]);
  return selected === 0;
}

async function askDockerfileMethod(): Promise<"ai" | "default" | null> {
  write(`\n${COLOR.bold}${COLOR.blue}? Dockerfile Generation Method${COLOR.reset}\n`);
  const selected = await menuSelect("How do you want to generate the Dockerfile?", [
    "Yes, choose which AI to use (Gemini, Claude, Copilot, Codex)",
    "No, generate default Dockerfile",
  ]);

  if (selected === 0) return "ai";
  if (selected === 1) return "default";
  return null;
}

async function askAiProvider(): Promise<string> {
  write(`\n${COLOR.bold}${COLOR.magenta}🤖 AI Provider Selection${COLOR.reset}\n`);
  const selected = await menuSelect("Which AI CLI do you want to use?", [
    "Gemini",
    "Claude",
    "Copilot",
    "Codex",
  ]);

  const providers = ["gemini", "claude", "copilot", "codex"];
  return providers[selected] ?? "claude";
}

// ── AI Dockerfile Generation ────────────────────────────────
async function listFiles(directory: string, prefix = ""): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;

    if (entry.isDirectory()) {
      const sub = await listFiles(join(directory, entry.name), relativePath);
      files.push(...sub);
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

async function loadPromptTemplate(): Promise<string> {
  return readFile(PROMPT_PATH, "utf-8");
}

async function buildPrompt(packageDir: string, packageName: string): Promise<string> {
  const template = await loadPromptTemplate();
  const pkgJsonPath = join(packageDir, "package.json");
  const pkgJson = await readFile(pkgJsonPath, "utf-8");
  const files = await listFiles(packageDir);

  return template
    .replace("{{PACKAGE_NAME}}", packageName)
    .replace("{{PACKAGE_JSON}}", pkgJson)
    .replace("{{FILE_STRUCTURE}}", files.join("\n"));
}

function buildCommand(provider: string, prompt: string): AiCommand {
  const commands: Record<string, AiCommand> = {
    gemini: { bin: "gemini", args: ["-p", prompt] },
    claude: { bin: "claude", args: ["--dangerously-skip-permissions", prompt] },
    copilot: { bin: "copilot", args: ["-p", prompt, "--allow-all"] },
    codex: { bin: "codex", args: ["exec", prompt] },
  };

  const cmd = commands[provider];
  if (!cmd) {
    throw new Error(`Command not defined for AI provider: ${provider}`);
  }
  return cmd;
}

function executeAiCli(provider: string, prompt: string, onData: (chunk: string) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const { bin, args } = buildCommand(provider, prompt);
    const proc = spawn(bin, args, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });

    let stdout = "";
    let stderr = "";
    let finished = false;

    const timer = setTimeout(() => {
      if (!finished) {
        proc.kill();
        reject(new Error(`${provider} exceeded the 2-minute timeout`));
      }
    }, 120_000);
    timer.unref();

    proc.stdout?.on("data", (data: Buffer) => {
      const text = data.toString();
      stdout += text;
      onData(text);
    });

    proc.stderr?.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      finished = true;
      clearTimeout(timer);

      if (stdout.trim().length > 0) {
        resolve(stdout.trim());
      } else if (code !== 0) {
        reject(new Error(`${provider} exited with code ${code}: ${stderr}`));
      } else {
        resolve(stdout.trim());
      }
    });

    proc.on("error", (err) => {
      finished = true;
      clearTimeout(timer);
      reject(err);
    });
  });
}

function cleanAiResponse(response: string): string {
  let cleaned = response;
  cleaned = cleaned.replace(/^```[\w]*\n?/gm, "").replace(/\n?```$/gm, "");

  const fromIndex = cleaned.indexOf("FROM");
  if (fromIndex > 0) {
    cleaned = cleaned.slice(fromIndex);
  }

  return cleaned.trim() + "\n";
}

async function generateDockerfileWithAi(packageDir: string, packageName: string, provider: string): Promise<boolean> {
  const dockerfilePath = join(packageDir, "Dockerfile");

  try {
    write(`  ${COLOR.dim}⏳ Generating Dockerfile with ${provider}...${COLOR.reset}\n`);

    const prompt = await buildPrompt(packageDir, packageName);
    let output = "";
    let bytesReceived = 0;

    const response = await executeAiCli(provider, prompt, (chunk) => {
      output += chunk;
      bytesReceived += chunk.length;
      // Update progress line with byte counter
      write(`${CURSOR.clearLine}  ${COLOR.dim}⏳ Receiving data... ${COLOR.gray}(${bytesReceived} bytes)${COLOR.reset}`);
    });

    write(`\n`); // Move to next line after progress update

    const dockerfile = cleanAiResponse(response);
    await writeFile(dockerfilePath, dockerfile, "utf-8");

    write(`  ${COLOR.green}✓${COLOR.reset} ${provider.toUpperCase()} generated Dockerfile successfully ${COLOR.gray}(${bytesReceived} bytes received)${COLOR.reset}\n`);
    return true;
  } catch (error) {
    write(`\n`); // Move to next line after progress update
    write(`  ${COLOR.dim}ℹ${COLOR.reset} Could not generate with ${provider}: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    write(`  ${COLOR.dim}→${COLOR.reset} Falling back to default Dockerfile\n`);
    const created = await processPackageDockerfile(packageName, packageDir);
    return created;
  }
}

function printRequiredSecrets(appDeployment: AppDeployment, cloudflareUse: boolean, workflowGen: boolean): void {
  if (!workflowGen) return;

  const sep = `  ${COLOR.dim}${"─".repeat(50)}${COLOR.reset}`;
  write(`\n${sep}\n`);
  write(`  ${COLOR.yellow}⚠${COLOR.reset}  ${COLOR.bold}GitHub Secrets required for this workflow:${COLOR.reset}\n`);

  if (appDeployment === "gcp") {
    write(`  ${COLOR.cyan}GCP_PROJECT_ID${COLOR.reset}   ${COLOR.dim}Google Cloud project ID${COLOR.reset}\n`);
    write(`  ${COLOR.cyan}GCP_SA_KEY${COLOR.reset}       ${COLOR.dim}Service account JSON with deploy permissions${COLOR.reset}\n`);
    write(`  ${COLOR.cyan}GCP_REGION${COLOR.reset}       ${COLOR.dim}Cloud Run region (e.g. us-central1)${COLOR.reset}\n`);
    write(`  ${COLOR.cyan}DOMAIN${COLOR.reset}           ${COLOR.dim}Base domain (e.g. embark.dev)${COLOR.reset}\n`);
  } else if (appDeployment === "netlify") {
    write(`  ${COLOR.cyan}NETLIFY_TOKEN${COLOR.reset}    ${COLOR.dim}Netlify personal access token${COLOR.reset}\n`);
    write(`  ${COLOR.cyan}DOMAIN${COLOR.reset}           ${COLOR.dim}Base domain (e.g. embark.dev)${COLOR.reset}\n`);
  } else if (appDeployment === "cloudflare-pages") {
    write(`  ${COLOR.cyan}CF_TOKEN_PAGES${COLOR.reset}   ${COLOR.dim}Cloudflare API token (Pages + DNS edit)${COLOR.reset}\n`);
    write(`  ${COLOR.cyan}CF_ACCOUNT_ID${COLOR.reset}    ${COLOR.dim}Cloudflare Account ID${COLOR.reset}\n`);
    write(`  ${COLOR.cyan}CF_ZONE_ID${COLOR.reset}       ${COLOR.dim}Zone ID of your domain${COLOR.reset}\n`);
    write(`  ${COLOR.cyan}DOMAIN${COLOR.reset}           ${COLOR.dim}Base domain (project name derived from it)${COLOR.reset}\n`);
  } else if (appDeployment === "cloudflare-workers") {
    write(`  ${COLOR.cyan}CF_WORKER_TOKEN${COLOR.reset}  ${COLOR.dim}Cloudflare API token (Workers Scripts edit)${COLOR.reset}\n`);
    write(`  ${COLOR.cyan}CF_ACCOUNT_ID${COLOR.reset}    ${COLOR.dim}Cloudflare Account ID${COLOR.reset}\n`);
    if (cloudflareUse) {
      write(`  ${COLOR.cyan}CF_ZONE_ID${COLOR.reset}       ${COLOR.dim}Zone ID of your domain${COLOR.reset}\n`);
      write(`  ${COLOR.cyan}DOMAIN${COLOR.reset}           ${COLOR.dim}Base domain (e.g. embark.dev)${COLOR.reset}\n`);
    }
  }

  // Cloudflare DNS secrets (only for gcp/netlify, cloudflare-pages has its own secrets above)
  if (cloudflareUse && (appDeployment === "gcp" || appDeployment === "netlify")) {
    write(`\n  ${COLOR.magenta}+ Cloudflare DNS (cloudflareUse: true):${COLOR.reset}\n`);
    write(`  ${COLOR.cyan}CF_TOKEN${COLOR.reset}         ${COLOR.dim}Cloudflare API token (DNS edit permissions)${COLOR.reset}\n`);
    write(`  ${COLOR.cyan}CF_ZONE_ID${COLOR.reset}       ${COLOR.dim}Zone ID of your domain in Cloudflare${COLOR.reset}\n`);
    write(`  ${COLOR.cyan}DOMAIN${COLOR.reset}           ${COLOR.dim}Base domain — must match your Cloudflare zone${COLOR.reset}\n`);
  }

  write(`\n  ${COLOR.dim}→ GitHub → Settings → Secrets and variables → Actions${COLOR.reset}\n`);
  write(`${sep}\n`);
}

function buildNetlifyToml(publishDir: string): string {
  return `[build]
  publish = "${publishDir}"
`;
}

async function askTextInput(prompt: string): Promise<string> {
  if (typeof process.stdin.setRawMode !== "function" || !process.stdin.isTTY) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function askRequiredField(fieldName: string, label: string, defaultValue?: string): Promise<string> {
  let value = "";
  const defaultHint = defaultValue ? ` [default: ${defaultValue}]` : "";

  while (!value) {
    value = await askTextInput(`  ${label}${defaultHint}: `);

    if (!value && defaultValue) {
      value = defaultValue;
    }

    if (!value) {
      write(`  ${COLOR.yellow}⚠${COLOR.reset} ${fieldName} is required\n`);
    }
  }

  return value;
}

async function askSubdomainField(defaultValue?: string): Promise<string> {
  let value = "";
  const defaultHint = defaultValue ? ` [default: ${defaultValue}]` : "";

  while (!value || !validateSubdomain(value)) {
    value = await askTextInput(`  🌐 Subdomain (e.g. 'my-app' → my-app.embark.dev)${defaultHint}: `);

    if (!value && defaultValue) {
      value = defaultValue;
    }

    if (value && !validateSubdomain(value)) {
      write(`  ${COLOR.yellow}⚠${COLOR.reset} Invalid subdomain. Use lowercase letters, numbers, and hyphens only.\n`);
      value = "";
    } else if (!value) {
      write(`  ${COLOR.yellow}⚠${COLOR.reset} Subdomain is required\n`);
    }
  }

  return value;
}

async function askAboutRootDomain(
  packageName: string,
  rootDomainState: RootDomainState,
): Promise<boolean> {
  write(`\n${COLOR.bold}${COLOR.blue}? Domain Setup${COLOR.reset}\n`);
  write(`  ${COLOR.dim}Where should "${packageName}" be deployed?${COLOR.reset}\n`);
  write(`  ${COLOR.dim}  • Subdomain → app.yourdomain.com  (default, safe)${COLOR.reset}\n`);
  write(`  ${COLOR.dim}  • Root domain → yourdomain.com    (only one package can use this)${COLOR.reset}\n`);

  const useRoot = await menuSelect("Choose deployment domain:", [
    "Subdomain  (e.g. app.yourdomain.com)",
    `Root domain  (yourdomain.com) — ${COLOR.yellow}only one package can own this${COLOR.reset}`,
  ]);
  if (useRoot !== 1) return false;

  // Show exclusivity warning
  write(`\n  ${COLOR.yellow}${COLOR.bold}⚠  WARNING${COLOR.reset}${COLOR.yellow}  Only ONE package can own the root domain.${COLOR.reset}\n`);
  write(`  ${COLOR.yellow}→  All other packages must use a subdomain (e.g. app.yourdomain.com).${COLOR.reset}\n`);

  if (rootDomainState.claimed && rootDomainState.claimedBy !== null && rootDomainState.claimedBy !== packageName) {
    const existing = rootDomainState.claimedBy;
    const existingDir = rootDomainState.claimedByDir;

    write(`\n  ${COLOR.yellow}${COLOR.bold}⚠  CONFLICT:${COLOR.reset}${COLOR.yellow}  "${existing}" already owns the root domain.${COLOR.reset}\n`);
    write(`  ${COLOR.yellow}→  Replacing it means "${existing}" will NO LONGER be at yourdomain.com.${COLOR.reset}\n`);
    write(`  ${COLOR.yellow}→  "${existing}"'s .embark.jsonc will be updated to remove root domain.${COLOR.reset}\n`);
    write(`  ${COLOR.yellow}→  You must redeploy "${existing}" with a subdomain to restore access.${COLOR.reset}\n`);

    write(`\n`);
    const confirmed = await menuSelect(`Replace "${existing}" with "${packageName}" as root domain owner?`, [
      `No, keep "${existing}" as root domain  (recommended)`,
      `Yes, replace "${existing}" with "${packageName}"`,
    ], [COLOR.cyan, COLOR.red]);
    if (confirmed !== 1) {
      write(`  ${COLOR.dim}ℹ${COLOR.reset} Keeping "${existing}" as root domain. Using subdomain instead.\n`);
      return false;
    }

    write(`\n  ${COLOR.red}${COLOR.bold}⚠  FINAL CONFIRMATION${COLOR.reset}\n`);
    write(`  ${COLOR.red}→  "${existing}" will permanently lose root domain access.${COLOR.reset}\n`);
    write(`  ${COLOR.red}→  This is irreversible unless you manually edit .embark.jsonc.${COLOR.reset}\n\n`);

    const finalConfirm = await menuSelect(`Confirm: replace "${existing}" → "${packageName}" as root domain?`, [
      "No, cancel",
      `Yes, replace "${existing}"`,
    ], [COLOR.cyan, COLOR.red]);
    if (finalConfirm !== 1) {
      write(`  ${COLOR.dim}ℹ${COLOR.reset} Replacement cancelled. Using subdomain instead.\n`);
      return false;
    }

    // Remove rootDomain from the previous package
    if (existingDir) {
      try {
        const prevConfig = await readEmbarkConfig(existingDir);
        if (prevConfig) {
          const updated = { ...prevConfig, rootDomain: false };
          const content = `// This file is auto-generated by Embark. Do not remove.\n// Edit these fields to update your package configuration.\n${JSON.stringify(updated, null, 2)}\n`;
          await writeFile(`${existingDir}/.embark.jsonc`, content);
          write(`  ${COLOR.green}✓${COLOR.reset} Removed root domain from "${existing}"\n`);
        }
      } catch {
        write(`  ${COLOR.yellow}⚠${COLOR.reset} Could not update "${existing}"'s config automatically. Please edit it manually.\n`);
      }
    }

    // Update state
    rootDomainState.claimedBy = packageName;
    rootDomainState.claimedByDir = null; // Will be set by caller after writing config
    return true;
  }

  // No existing root domain — confirm choice
  write(`\n`);
  const confirmed = await menuSelect(`Deploy "${packageName}" to the root domain (yourdomain.com)?`, [
    "No, use a subdomain instead  (recommended)",
    `Yes, use root domain for "${packageName}"`,
  ], [COLOR.cyan, COLOR.red]);
  if (confirmed !== 1) return false;

  rootDomainState.claimed = true;
  rootDomainState.claimedBy = packageName;
  return true;
}

async function collectMissingFields(
  packageName: string,
  packageDir: string,
  existingConfig: Partial<EmbarkConfig> | null,
  missingFields: (keyof EmbarkConfig)[],
  rootDomainState: RootDomainState,
): Promise<EmbarkConfig> {
  const config: Partial<EmbarkConfig> = { ...existingConfig };

  for (const field of missingFields) {
    switch (field) {
      case "deploy": {
        write(`\n${COLOR.bold}${COLOR.blue}? Deploy Target${COLOR.reset}\n`);
        const targetIndex = await menuSelect("Choose deploy target:", [
          "GCP - Google Cloud Run (generates workflow + Dockerfile)",
          "Netlify (generates workflow)",
          "Cloudflare Pages (generates workflow with DNS setup)",
          "Cloudflare Workers (generates workflow for serverless backend)",
          "Other (custom deploy — you must create the workflow manually)",
        ]);
        const appDeployments: AppDeployment[] = ["gcp", "netlify", "cloudflare-pages", "cloudflare-workers", "other"];
        const appDeployment = appDeployments[targetIndex] ?? "gcp";

        write(`\n${COLOR.bold}${COLOR.blue}? Workflow Generation${COLOR.reset}\n`);
        const workflowGen = await askYesNo(
          appDeployment === "other"
            ? "Auto-generate a generic CI/CD workflow (you add the deploy steps)?"
            : "Auto-generate GitHub Actions workflow?",
        );

        let cloudflareUse = false;
        if (appDeployment === "cloudflare-pages") {
          // Ask if the user wants to connect a custom domain
          write(`\n${COLOR.bold}${COLOR.blue}? Custom Domain${COLOR.reset}\n`);
          write(`  ${COLOR.dim}Your app will be live at project.pages.dev — connect a custom domain too?${COLOR.reset}\n`);
          cloudflareUse = await askYesNo("Publish under a custom domain (e.g. app.yourdomain.com)?");
        } else if (appDeployment === "cloudflare-workers") {
          write(`\n${COLOR.bold}${COLOR.blue}? Custom Domain${COLOR.reset}\n`);
          write(`  ${COLOR.dim}Your worker will be live at name.workers.dev — connect a custom domain too?${COLOR.reset}\n`);
          cloudflareUse = await askYesNo("Publish under a custom domain (e.g. api.yourdomain.com)?");
        } else if (appDeployment !== "other") {
          write(`\n${COLOR.bold}${COLOR.blue}? Cloudflare${COLOR.reset}\n`);
          cloudflareUse = await askYesNo("Use Cloudflare for custom domain/DNS setup?");
        }

        const deployConfig: DeployConfig = { appDeployment, workflowGen, cloudflareUse };
        config.deploy = deployConfig;
        break;
      }
      case "name": {
        config.name = await askRequiredField("Name", "📝 Package name", packageName);
        break;
      }
      case "title": {
        config.title = await askRequiredField("Title", "🏷️  Title (human-readable)");
        break;
      }
      case "subdomain": {
        // Ask about root domain FIRST — if root domain is selected, subdomain is not needed
        const useRootDomain = await askAboutRootDomain(packageName, rootDomainState);
        config.rootDomain = useRootDomain;
        if (!useRootDomain) {
          config.subdomain = await askSubdomainField(packageName.toLowerCase());
        }
        break;
      }
      case "description": {
        config.description = await askRequiredField("Description", "📄 Description");
        break;
      }
      case "useSubmodule": {
        write(`\n${COLOR.bold}${COLOR.blue}? Git Submodules${COLOR.reset}\n`);
        write(`  ${COLOR.dim}Does this package use Git submodules?${COLOR.reset}\n`);
        config.useSubmodule = await askYesNo("Does this package use a Git submodule?");
        break;
      }
    }
  }

  return config as EmbarkConfig;
}

async function ensureDeployConfig() {
  tryInitTty();
  const incomplete = await getPackagesWithIncompleteConfig(PACKAGES_DIR);

  if (incomplete.length === 0) {
    console.log("[ensure-deploy-config] all packages have complete .embark.jsonc");
    return;
  }

  // Initialize root domain state from existing packages
  const existingRootPkg = await findRootDomainPackage(PACKAGES_DIR);
  const rootDomainState: RootDomainState = {
    claimed: existingRootPkg !== null,
    claimedBy: existingRootPkg?.name ?? null,
    claimedByDir: existingRootPkg?.dir ?? null,
  };

  let hasChanges = false;

  for (const pkg of incomplete) {
    const packageDir = join(PACKAGES_DIR, pkg.name);

    // Show header with missing fields info
    if (pkg.hasConfig) {
      write(`\n${COLOR.bold}📋 Package "${pkg.name}" has incomplete configuration${COLOR.reset}\n`);
      write(`  ${COLOR.dim}Missing fields: ${pkg.missingFields.join(", ")}${COLOR.reset}\n`);
    } else {
      write(`\n${COLOR.bold}🚀 Package "${pkg.name}" needs a deploy configuration${COLOR.reset}\n`);
    }

    // Collect all missing fields interactively
    const completeConfig = await collectMissingFields(pkg.name, packageDir, pkg.config, pkg.missingFields, rootDomainState);
    // Update root domain dir now that we know the package dir
    if (rootDomainState.claimedBy === pkg.name) {
      rootDomainState.claimedByDir = packageDir;
    }

    // Write .embark.jsonc
    const configContent = `// This file is auto-generated by Embark. Do not remove.
// Edit these fields to update your package configuration.
${JSON.stringify(completeConfig, null, 2)}
`;
    await writeFile(join(packageDir, ".embark.jsonc"), configContent);
    write(`  ${COLOR.green}✓${COLOR.reset} ${pkg.hasConfig ? "Updated" : "Created"} .embark.jsonc for ${COLOR.cyan}${pkg.name}${COLOR.reset}\n`);

    const appDeployment = completeConfig.deploy.appDeployment;

    // Handle Netlify target
    if (appDeployment === "netlify") {
      write(`\n${COLOR.bold}${COLOR.yellow}↳ Netlify Configuration${COLOR.reset}\n`);

      const netlifyToml = buildNetlifyToml("dist");
      await writeFile(join(packageDir, "netlify.toml"), netlifyToml);
      write(`  ${COLOR.green}✓${COLOR.reset} Created netlify.toml\n`);

      if (completeConfig.deploy.workflowGen) {
        write(`  ${COLOR.dim}ℹ${COLOR.reset} GitHub Actions workflow will be generated for Netlify deploy\n`);
      } else {
        write(`  ${COLOR.dim}ℹ${COLOR.reset} No workflow will be generated. Deploy manually or via Netlify UI.\n`);
      }

      if (completeConfig.deploy.cloudflareUse) {
        write(`  ${COLOR.dim}ℹ${COLOR.reset} Cloudflare DNS steps will be included in the workflow\n`);
      }

      const wantsDocker = await askYesNo("\n  Generate a Dockerfile for this package? (optional)");
      if (wantsDocker) {
        const method = await askDockerfileMethod();
        if (method === "default") {
          const created = await processPackageDockerfile(pkg.name, packageDir);
          if (created) write(`  ${COLOR.green}✓${COLOR.reset} Default Dockerfile generated\n`);
        } else if (method === "ai") {
          const aiProvider = await askAiProvider();
          await generateDockerfileWithAi(packageDir, pkg.name, aiProvider);
        }
      }
    }

    // Handle "Other" target
    if (appDeployment === "other") {
      write(`\n${COLOR.bold}${COLOR.yellow}↳ Custom Deploy Configuration${COLOR.reset}\n`);
      if (completeConfig.deploy.workflowGen) {
        write(`  ${COLOR.dim}ℹ${COLOR.reset} A generic CI/CD workflow will be generated — add your deploy steps to .github/workflows/${pkg.name}.yml\n`);
      } else {
        write(`  ${COLOR.dim}ℹ${COLOR.reset} No workflow will be generated. Create it manually in .github/workflows/${pkg.name}.yml\n`);
      }

      const wantsDocker = await askYesNo("\n  Generate a Dockerfile for this package? (optional)");
      if (wantsDocker) {
        const method = await askDockerfileMethod();
        if (method === "default") {
          const created = await processPackageDockerfile(pkg.name, packageDir);
          if (created) write(`  ${COLOR.green}✓${COLOR.reset} Default Dockerfile generated\n`);
        } else if (method === "ai") {
          const aiProvider = await askAiProvider();
          await generateDockerfileWithAi(packageDir, pkg.name, aiProvider);
        }
      }
    }

    // Handle GCP target
    if (appDeployment === "gcp") {
      write(`\n${COLOR.bold}${COLOR.yellow}↳ Google Cloud Run Configuration${COLOR.reset}\n`);

      if (completeConfig.deploy.workflowGen) {
        write(`  ${COLOR.dim}ℹ${COLOR.reset} GitHub Actions workflow will be generated for GCP deploy\n`);
      } else {
        write(`  ${COLOR.dim}ℹ${COLOR.reset} No workflow will be auto-generated.\n`);
      }

      if (completeConfig.deploy.cloudflareUse) {
        write(`  ${COLOR.dim}ℹ${COLOR.reset} Cloudflare DNS steps will be included in the workflow\n`);
      }

      const wantsDocker = await askYesNo("\n  Generate a Dockerfile? (recommended for Cloud Run)");
      if (wantsDocker) {
        const method = await askDockerfileMethod();
        if (method === "default") {
          const created = await processPackageDockerfile(pkg.name, packageDir);
          if (created) write(`  ${COLOR.green}✓${COLOR.reset} Default Dockerfile generated\n`);
        } else if (method === "ai") {
          const aiProvider = await askAiProvider();
          await generateDockerfileWithAi(packageDir, pkg.name, aiProvider);
        }
      }
    }

    // Print required GitHub secrets reminder
    printRequiredSecrets(completeConfig.deploy.appDeployment, completeConfig.deploy.cloudflareUse, completeConfig.deploy.workflowGen);

    hasChanges = true;
  }

  if (hasChanges) {
    try {
      execSync("git add packages/*/.embark.jsonc", { cwd: ROOT, stdio: "ignore" });
      execSync("git add packages/*/netlify.toml", { cwd: ROOT, stdio: "ignore" });
      execSync("git add packages/*/Dockerfile", { cwd: ROOT, stdio: "ignore" });
    } catch {
      // Some globs may not match, that's ok
    }
  }
}

if (import.meta.main) {
  ensureDeployConfig().catch((error) => {
    console.error("[ensure-deploy-config] error:", error);
    process.exit(1);
  });
}
