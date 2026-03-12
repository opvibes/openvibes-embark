let isSimulationRunning = false;

export function initInteractive() {
  const section = document.getElementById("try-it");
  if (!section) return;

  const terminal = document.getElementById("interactive-terminal");
  const terminalHeader = terminal?.parentElement?.querySelector(".terminal-header");

  // Remove old refresh button if exists
  const oldRefreshBtn = terminalHeader?.querySelector(".terminal-refresh-btn");
  if (oldRefreshBtn) {
    oldRefreshBtn.remove();
  }

  if (terminalHeader) {
    const refreshBtn = document.createElement("button");
    refreshBtn.className = "terminal-refresh-btn";
    refreshBtn.innerHTML = "🔄";
    refreshBtn.title = "Reset simulation";
    refreshBtn.onclick = async () => {
      if (terminal && !isSimulationRunning) {
        isSimulationRunning = true;
        terminal.innerHTML = "";
        try {
          await startSimulation();
        } finally {
          isSimulationRunning = false;
        }
      }
    };
    terminalHeader.appendChild(refreshBtn);
  }

  let started = false;

  const observer = new IntersectionObserver(
    async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !started && !isSimulationRunning) {
          started = true;
          isSimulationRunning = true;
          try {
            await startSimulation();
          } finally {
            isSimulationRunning = false;
          }
        }
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(section);
}

interface TerminalLine {
  type: "output" | "question" | "option" | "selected" | "info";
  content: string;
  class?: string;
}

async function startSimulation() {
  const terminal = document.getElementById("interactive-terminal");
  if (!terminal) return;

  let selectedDeploy = "";

  const addLine = (line: TerminalLine) => {
    const div = document.createElement("div");
    div.className = `terminal-line output ${line.class || ""}`;
    div.innerHTML = `<span>${escapeHtml(line.content)}</span>`;
    terminal.appendChild(div);
    div.classList.add("visible");

    // Auto-scroll to bottom after render
    setTimeout(() => {
      terminal.scrollTop = terminal.scrollHeight;
    }, 0);
  };

  const addError = (msg: string) => {
    const div = document.createElement("div");
    div.className = "terminal-line output terminal-error";
    div.innerHTML = `<span>${escapeHtml(msg)}</span>`;
    terminal.appendChild(div);
    div.classList.add("visible");
    setTimeout(() => { terminal.scrollTop = terminal.scrollHeight; }, 0);
  };

  // Generic required text input — loops until non-empty
  const askTextInput = (prompt: string, validate?: (v: string) => string | null): Promise<string> => {
    return new Promise((resolve) => {
      const mount = () => {
        const wrapper = document.createElement("div");
        wrapper.className = "terminal-line output info";

        const label = document.createElement("span");
        label.textContent = prompt;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "terminal-text-input";
        input.placeholder = "type and press Enter";
        input.autocomplete = "off";
        input.spellcheck = false;

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        terminal.appendChild(wrapper);
        wrapper.classList.add("visible");

        setTimeout(() => {
          input.focus();
          input.scrollIntoView({ block: "nearest" });
          terminal.scrollTop = terminal.scrollHeight;
        }, 50);

        input.addEventListener("keydown", (e: KeyboardEvent) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          const value = input.value.trim();
          if (!value) {
            addError("  ❌ This field is required");
            input.value = "";
            input.focus();
            return;
          }
          if (validate) {
            const err = validate(value);
            if (err) {
              addError(`  ❌ ${err}`);
              input.value = "";
              input.focus();
              return;
            }
          }
          wrapper.remove();
          addLine({ type: "output", content: `${prompt}${value}`, class: "info" });
          resolve(value);
        });
      };
      mount();
    });
  };

  // dangerIndices: indices whose option should render red (destructive action)
  const showMenu = async (question: string, options: string[], dangerIndices: number[] = []): Promise<number> => {
    return new Promise((resolve) => {
      addLine({ type: "question", content: question, class: "processing" });

      const optionLines = options.map((opt, i) => ({
        index: i,
        element: null as HTMLElement | null,
      }));

      options.forEach((opt, i) => {
        const div = document.createElement("div");
        const isDanger = dangerIndices.includes(i);
        div.className = `terminal-line output option ${i === 0 ? "focused" : ""} ${isDanger ? "danger" : ""}`;
        div.innerHTML = `<span>${i + 1}. ${escapeHtml(opt)}</span>`;
        terminal.appendChild(div);
        div.classList.add("visible");
        optionLines[i]!.element = div;
      });

      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "terminal-line output info mobile-options";
        buttonsContainer.style.display = "flex";
        buttonsContainer.style.flexDirection = "column";
        buttonsContainer.style.gap = "0.5rem";
        buttonsContainer.style.marginTop = "0.5rem";

        options.forEach((opt, i) => {
          const btn = document.createElement("button");
          const isDanger = dangerIndices.includes(i);
          btn.className = "terminal-mobile-btn";
          btn.innerHTML = `${i + 1}. ${escapeHtml(opt)}`;
          btn.style.padding = "0.75rem";
          btn.style.background = isDanger ? "rgba(248, 113, 113, 0.1)" : "rgba(34, 211, 238, 0.1)";
          btn.style.border = `1px solid ${isDanger ? "rgba(248, 113, 113, 0.3)" : "rgba(34, 211, 238, 0.3)"}`;
          btn.style.color = isDanger ? "#f87171" : "var(--text-secondary)";
          btn.style.borderRadius = "6px";
          btn.style.cursor = "pointer";
          btn.style.fontSize = "0.9rem";
          btn.style.fontFamily = "var(--font-mono)";
          btn.style.transition = "all 0.2s ease";

          btn.onmouseover = () => {
            btn.style.background = isDanger ? "rgba(248, 113, 113, 0.2)" : "rgba(34, 211, 238, 0.2)";
            btn.style.borderColor = isDanger ? "rgba(248, 113, 113, 0.5)" : "rgba(34, 211, 238, 0.5)";
          };
          btn.onmouseout = () => {
            btn.style.background = isDanger ? "rgba(248, 113, 113, 0.1)" : "rgba(34, 211, 238, 0.1)";
            btn.style.borderColor = isDanger ? "rgba(248, 113, 113, 0.3)" : "rgba(34, 211, 238, 0.3)";
          };

          btn.onclick = () => {
            optionLines.forEach((line) => line.element?.classList.remove("focused"));
            optionLines[i]?.element?.classList.add("selected");
            buttonsContainer.remove();
            setTimeout(() => resolve(i), 300);
          };

          buttonsContainer.appendChild(btn);
        });

        terminal.appendChild(buttonsContainer);
        buttonsContainer.classList.add("visible");
      } else {
        const instructionsDiv = document.createElement("div");
        instructionsDiv.className = "terminal-line output info";
        instructionsDiv.innerHTML = `<span>↑/↓ navigate  │  Enter select</span>`;
        terminal.appendChild(instructionsDiv);
        instructionsDiv.classList.add("visible");

        let currentIndex = 0;

        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            const newIndex =
              event.key === "ArrowUp"
                ? Math.max(0, currentIndex - 1)
                : Math.min(options.length - 1, currentIndex + 1);

            optionLines[currentIndex]?.element?.classList.remove("focused");
            optionLines[newIndex]?.element?.classList.add("focused");
            currentIndex = newIndex;
            optionLines[newIndex]?.element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } else if (event.key === "Enter") {
            event.preventDefault();
            document.removeEventListener("keydown", handleKeyDown);
            optionLines.forEach((line) => line.element?.classList.remove("focused"));
            optionLines[currentIndex]?.element?.classList.add("selected");
            setTimeout(() => resolve(currentIndex), 300);
          }
        };

        document.addEventListener("keydown", handleKeyDown);
      }

      setTimeout(() => { terminal.scrollTop = terminal.scrollHeight; }, 0);
    });
  };

  // Helper: show required GitHub secrets for a target
  const showSecretsReminder = (deploy: string, cloudflareUse: boolean, workflowGen: boolean) => {
    if (!workflowGen) return;

    addLine({ type: "info", content: "─────────────────────────────────────────", class: "info" });
    addLine({ type: "info", content: "⚠  GitHub Secrets required for this workflow:", class: "info" });

    if (deploy === "gcp") {
      addLine({ type: "info", content: "  • GCP_PROJECT_ID   — Google Cloud project ID", class: "info" });
      addLine({ type: "info", content: "  • GCP_SA_KEY       — Service account JSON", class: "info" });
      addLine({ type: "info", content: "  • GCP_REGION       — Cloud Run region (e.g. us-central1)", class: "info" });
      addLine({ type: "info", content: "  • DOMAIN           — Base domain (e.g. embark.dev)", class: "info" });
    } else if (deploy === "netlify") {
      addLine({ type: "info", content: "  • NETLIFY_TOKEN    — Netlify personal access token", class: "info" });
      addLine({ type: "info", content: "  • DOMAIN           — Base domain (e.g. embark.dev)", class: "info" });
    } else if (deploy === "cloudflare-pages") {
      addLine({ type: "info", content: "  • CF_TOKEN_PAGES   — Cloudflare API token (Pages edit)", class: "info" });
      addLine({ type: "info", content: "  • CF_ACCOUNT_ID    — Cloudflare Account ID", class: "info" });
      if (cloudflareUse) {
        addLine({ type: "info", content: "  • CF_ZONE_ID       — Cloudflare Zone ID", class: "info" });
        addLine({ type: "info", content: "  • DOMAIN           — Base domain (e.g. embark.dev)", class: "info" });
      }
    }

    // Cloudflare DNS secrets (only for gcp/netlify)
    if (cloudflareUse && (deploy === "gcp" || deploy === "netlify")) {
      addLine({ type: "info", content: "  + Cloudflare (cloudflareUse: true):", class: "info" });
      addLine({ type: "info", content: "  • CF_TOKEN         — Cloudflare API token (DNS edit)", class: "info" });
      addLine({ type: "info", content: "  • CF_ZONE_ID       — Cloudflare Zone ID", class: "info" });
      addLine({ type: "info", content: "  • DOMAIN           — Base domain (match CF zone)", class: "info" });
    }

    addLine({ type: "info", content: "  → GitHub → Settings → Secrets and variables → Actions", class: "info" });
    addLine({ type: "info", content: "─────────────────────────────────────────", class: "info" });
  };

  // ── Simulation: bun run new-package ──────────────────────
  await new Promise((r) => setTimeout(r, 500));

  addLine({ type: "output", content: "📦 Package Creator - embark", class: "rocket" });
  await new Promise((r) => setTimeout(r, 700));

  // Step 1: Name — validate camelCase or kebab-case, no spaces
  const validateName = (v: string): string | null => {
    if (!/^[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$/.test(v))
      return "Invalid name. Use camelCase or kebab-case only (e.g. my-app or myApp)";
    return null;
  };
  const rawName = await askTextInput("📝 Name (camelCase or kebab-case): ", validateName);
  const camelName = rawName.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
  await new Promise((r) => setTimeout(r, 300));

  // Step 2: Title — required free text
  const title = await askTextInput("🏷️  Title (human-readable, e.g. 'My Awesome App'): ");
  await new Promise((r) => setTimeout(r, 300));

  // Step 3: Description — required free text
  const description = await askTextInput("📄 Description: ");
  await new Promise((r) => setTimeout(r, 400));

  void title; void description; // used for display, silences unused var

  // Step 4: Root domain vs subdomain
  let useRootDomain = false;
  let finalSubdomain = camelName.toLowerCase();

  const rootDomainIndex = await showMenu("🌍 Deploy to root domain (domain.com) instead of a subdomain?", ["No, use a subdomain (recommended)", "Yes, deploy to root domain"]);
  await new Promise((r) => setTimeout(r, 400));

  if (rootDomainIndex === 1) {
    addLine({ type: "output", content: `  ⚠  WARNING: Only ONE package can own the root domain.`, class: "warning" });
    addLine({ type: "output", content: `  → All other packages must use a subdomain.`, class: "warning" });
    await new Promise((r) => setTimeout(r, 300));
    const confirmRoot = await showMenu(`Deploy "${camelName}" to the root domain (yourdomain.com)?`, [
      "No, use a subdomain instead  (recommended)",
      `Yes, use root domain for "${camelName}"`,
    ], [1]);
    await new Promise((r) => setTimeout(r, 300));
    if (confirmRoot === 1) {
      useRootDomain = true;
      addLine({ type: "output", content: `  ✓ Root domain confirmed.`, class: "success" });
    } else {
      addLine({ type: "output", content: `  ℹ Using subdomain deployment instead.`, class: "info" });
    }
  }

  if (!useRootDomain) {
    const defaultSubdomain = camelName.toLowerCase();
    const validateSubdomainFn = (v: string): string | null => {
      if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/.test(v))
        return "Invalid subdomain. Use lowercase letters, numbers, hyphens, and dots only.";
      return null;
    };
    const subdomain = await askTextInput(`🌐 Subdomain [default: ${defaultSubdomain}]: `, (v) => {
      if (!v) return null;
      return validateSubdomainFn(v);
    });
    finalSubdomain = subdomain || defaultSubdomain;
    if (!subdomain) addLine({ type: "output", content: `  → using default: ${finalSubdomain}`, class: "info" });
    await new Promise((r) => setTimeout(r, 300));
  }

  // Step 5: Deploy target
  const deployIndex = await showMenu("🚀 Deploy target:", [
    "GCP - Google Cloud Run (generates workflow + Dockerfile)",
    "Netlify (generates workflow)",
    "Cloudflare Pages (generates workflow with DNS setup)",
    "Other (custom deploy — you must create the workflow manually)",
  ]);
  await new Promise((r) => setTimeout(r, 600));

  const targets = ["gcp", "netlify", "cloudflare-pages", "other"] as const;
  selectedDeploy = targets[deployIndex] ?? "gcp";

  // Step 6: workflowGen — Yes is default (index 0)
  const workflowGenIndex = await showMenu(
    selectedDeploy === "other"
      ? "🔄 Auto-generate a generic CI/CD workflow?"
      : "🔄 Auto-generate GitHub Actions workflow?",
    ["Yes", "No"]
  );
  await new Promise((r) => setTimeout(r, 600));
  const workflowGen = workflowGenIndex === 0;

  // Step 7: useSubmodule
  const submoduleIndex = await showMenu("🔗 Does this package use Git submodules?", ["No", "Yes"]);
  await new Promise((r) => setTimeout(r, 400));
  const useSubmodule = submoduleIndex === 1;
  if (useSubmodule) {
    addLine({ type: "output", content: `  ✓ Workflow will include submodules: recursive in checkout step.`, class: "success" });
    await new Promise((r) => setTimeout(r, 300));
  }

  void useSubmodule; // used for workflow generation, silences unused var

  // Step 8: cloudflareUse (gcp/netlify only, cloudflare-pages has its own domain question)
  let cloudflareUse = false;
  if (selectedDeploy === "cloudflare-pages") {
    const cfPagesIndex = await showMenu("🌐 Publish under a custom domain (e.g. app.yourdomain.com)?", ["Yes", "No"]);
    await new Promise((r) => setTimeout(r, 600));
    cloudflareUse = cfPagesIndex === 0;
  } else if (selectedDeploy !== "other") {
    const cfIndex = await showMenu("☁️  Use Cloudflare for custom domain/DNS setup?", ["Yes", "No"]);
    await new Promise((r) => setTimeout(r, 600));
    cloudflareUse = cfIndex === 0;
  }

  // Package creation
  addLine({ type: "output", content: `\n🚀 Creating package: ${camelName}`, class: "rocket" });
  await new Promise((r) => setTimeout(r, 400));
  addLine({ type: "output", content: `  ✓ Created directory: packages/${camelName}`, class: "success" });
  await new Promise((r) => setTimeout(r, 300));
  addLine({ type: "output", content: `  ✓ Created: tsconfig.json`, class: "success" });
  await new Promise((r) => setTimeout(r, 300));
  addLine({ type: "output", content: `  ✓ Created: package.json`, class: "success" });
  await new Promise((r) => setTimeout(r, 300));
  addLine({ type: "output", content: `  ✓ Created: src/index.ts`, class: "success" });
  await new Promise((r) => setTimeout(r, 300));

  if (selectedDeploy === "netlify") {
    addLine({ type: "output", content: `  ✓ Created: netlify.toml`, class: "success" });
    await new Promise((r) => setTimeout(r, 300));
  }

  addLine({ type: "output", content: `  ✓ Created: .embark.jsonc`, class: "success" });
  await new Promise((r) => setTimeout(r, 600));

  if (useRootDomain) {
    addLine({ type: "output", content: `  → yourdomain.com (root domain)`, class: "info" });
  } else if (selectedDeploy === "cloudflare-pages" && !cloudflareUse) {
    addLine({ type: "output", content: `  → ${camelName.toLowerCase()}.pages.dev`, class: "info" });
  } else {
    addLine({ type: "output", content: `  → ${finalSubdomain}.yourdomain.com`, class: "info" });
  }
  await new Promise((r) => setTimeout(r, 300));

  addLine({ type: "output", content: `✅ Package created successfully!`, class: "success" });
  await new Promise((r) => setTimeout(r, 500));

  addLine({ type: "output", content: `\nNext steps:`, class: "info" });
  addLine({ type: "output", content: `  1. Edit packages/${camelName}/src/index.ts`, class: "info" });
  addLine({ type: "output", content: `  2. Run: bun install`, class: "info" });
  if (workflowGen) {
    if (selectedDeploy === "other") {
      addLine({ type: "output", content: `  3. Commit your changes (generic workflow will be generated — add your deploy steps)`, class: "info" });
    } else {
      addLine({ type: "output", content: `  3. Commit your changes (workflow will be generated automatically)`, class: "info" });
    }
  } else {
    addLine({ type: "output", content: `  3. Commit your changes (no workflow will be auto-generated)`, class: "info" });
  }
  await new Promise((r) => setTimeout(r, 800));

  // Secrets reminder
  showSecretsReminder(selectedDeploy, cloudflareUse, workflowGen);

  // Mark simulation as complete
  isSimulationRunning = false;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char] ?? char);
}
