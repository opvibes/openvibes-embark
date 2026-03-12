interface CommandDef {
  label: string;
  desc: string;
  output: string[];
}

const COMMANDS: CommandDef[] = [
  {
    label: "new-package",
    desc: "Create a new package interactively",
    output: [
      "📦 Package Creator - embark",
      "  → Launches the interactive package wizard",
      "  → Asks: name, title, description, subdomain, deploy target",
      "  → Generates: package.json, tsconfig.json, src/index.ts, .embark.jsonc",
      "  ✓ Package added to git — commit to trigger automations",
    ],
  },
  {
    label: "new-dockerfile",
    desc: "Generate Dockerfiles with AI or default template",
    output: [
      "🐳 Dockerfile Generator",
      "  → Scans packages/ for missing Dockerfiles",
      "  → Choose: AI generation (Claude, Gemini, Copilot, Codex) or defaults",
      "  ✓ Dockerfile created for my-app",
      "  → AI read your package.json and tailored the image",
    ],
  },
  {
    label: "sync-workflows",
    desc: "Sync existing workflows with the latest template",
    output: [
      "🔄 Syncing workflows with template...",
      "  → Comparing .github/workflows/ against template",
      "  → Preserving # EMBARK:CUSTOM blocks",
      "✨ All workflows are in sync with the template",
    ],
  },
  {
    label: "setup",
    desc: "Setup repo for personal use",
    output: [
      "🔧 Setting up repository...",
      "  ✓ Configured releases (Release Please)",
      "  ✓ Protected release files from upstream sync",
      "  ✓ Configured upstream remote → opvibes/embark",
      "  ✓ Enabled merge protection (merge.ours.driver)",
      "  📦 Installing dependencies...",
      "✅ Setup complete! Repository ready for use.",
    ],
  },
  {
    label: "sync-upstream",
    desc: "Pull upstream improvements into your fork",
    output: [
      "🔄 Sync from upstream",
      "  upstream → https://github.com/opvibes/embark.git",
      "📡 Fetching upstream...",
      "  → Merging upstream/main...",
      "  → Removing demo artifacts (packages/embark, apps.jsonc entries)",
      "  → Normalizing package.json scripts",
      "✅ Synced: chore(upstream): sync changes from embark@a6e39b1",
    ],
  },
];

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

let utilsSimRunning = false;

export function initUtilsCli(): void {
  const section = document.getElementById("utils-cli");
  if (!section) return;

  const terminal = document.getElementById("utils-terminal");
  const terminalHeader = terminal?.parentElement?.querySelector(".terminal-header");

  if (terminalHeader) {
    const refreshBtn = document.createElement("button");
    refreshBtn.className = "terminal-refresh-btn";
    refreshBtn.innerHTML = "🔄";
    refreshBtn.title = "Reset simulation";
    refreshBtn.onclick = async () => {
      if (terminal && !utilsSimRunning) {
        utilsSimRunning = true;
        terminal.innerHTML = "";
        try {
          await runUtilsSimulation(terminal);
        } finally {
          utilsSimRunning = false;
        }
      }
    };
    terminalHeader.appendChild(refreshBtn);
  }

  let started = false;
  const observer = new IntersectionObserver(
    async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !started && !utilsSimRunning) {
          started = true;
          utilsSimRunning = true;
          try {
            await runUtilsSimulation(terminal!);
          } finally {
            utilsSimRunning = false;
          }
        }
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(section);
}

async function runUtilsSimulation(terminal: HTMLElement): Promise<void> {
  if (!terminal) return;

  const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const addLine = (text: string, cls = "") => {
    const div = document.createElement("div");
    div.className = `terminal-line output ${cls}`;
    div.innerHTML = `<span>${escapeHtml(text)}</span>`;
    terminal.appendChild(div);
    div.classList.add("visible");
    setTimeout(() => { terminal.scrollTop = terminal.scrollHeight; }, 0);
  };

  // Show command
  const cmdLine = document.createElement("div");
  cmdLine.className = "terminal-line output";
  cmdLine.innerHTML = `<span class="prompt">$</span> <span class="cmd">bun run utils</span>`;
  terminal.appendChild(cmdLine);
  cmdLine.classList.add("visible");
  await delay(600);

  // Banner
  addLine("  ╔══════════════════════════════════════════╗", "info");
  addLine("  ║           embark  utils                  ║", "info");
  addLine("  ╚══════════════════════════════════════════╝", "info");
  await delay(400);

  // Show menu question
  addLine("  What would you like to do?", "processing");
  await delay(300);

  const maxLabelLen = Math.max(...COMMANDS.map((c) => c.label.length));

  const showMenu = (): Promise<number> => {
    return new Promise((resolve) => {
      const optionEls: HTMLElement[] = [];

      COMMANDS.forEach((cmd, i) => {
        const pad = " ".repeat(maxLabelLen - cmd.label.length + 3);
        const div = document.createElement("div");
        div.className = `terminal-line output option ${i === 0 ? "focused" : ""}`;
        div.innerHTML = `<span><span style="color:var(--color-cyan);font-weight:bold">${cmd.label}</span>${pad}<span style="opacity:0.5">${escapeHtml(cmd.desc)}</span></span>`;
        terminal.appendChild(div);
        div.classList.add("visible");
        optionEls.push(div);
      });

      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        const btnsWrapper = document.createElement("div");
        btnsWrapper.className = "terminal-line output info mobile-options";
        btnsWrapper.style.cssText = "display:flex;flex-direction:column;gap:0.4rem;margin-top:0.5rem";
        COMMANDS.forEach((cmd, i) => {
          const btn = document.createElement("button");
          btn.className = "terminal-mobile-btn";
          btn.innerHTML = `${cmd.label}`;
          btn.style.cssText = "padding:0.6rem;background:rgba(34,211,238,0.1);border:1px solid rgba(34,211,238,0.3);color:var(--text-secondary);border-radius:6px;cursor:pointer;font-size:0.85rem;font-family:var(--font-mono);text-align:left";
          btn.onclick = () => {
            optionEls.forEach((el) => el.classList.remove("focused"));
            optionEls[i]?.classList.add("selected");
            btnsWrapper.remove();
            setTimeout(() => resolve(i), 300);
          };
          btnsWrapper.appendChild(btn);
        });
        terminal.appendChild(btnsWrapper);
        btnsWrapper.classList.add("visible");
      } else {
        const hint = document.createElement("div");
        hint.className = "terminal-line output info";
        hint.innerHTML = `<span>↑/↓ navigate  │  Enter select</span>`;
        terminal.appendChild(hint);
        hint.classList.add("visible");

        let cur = 0;
        const handleKey = (e: KeyboardEvent) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            const next = e.key === "ArrowUp" ? Math.max(0, cur - 1) : Math.min(COMMANDS.length - 1, cur + 1);
            optionEls[cur]?.classList.remove("focused");
            optionEls[next]?.classList.add("focused");
            cur = next;
            optionEls[next]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } else if (e.key === "Enter") {
            e.preventDefault();
            document.removeEventListener("keydown", handleKey);
            optionEls.forEach((el) => el.classList.remove("focused"));
            optionEls[cur]?.classList.add("selected");
            setTimeout(() => resolve(cur), 300);
          }
        };
        document.addEventListener("keydown", handleKey);
      }

      setTimeout(() => { terminal.scrollTop = terminal.scrollHeight; }, 0);
    });
  };

  const selectedIndex = await showMenu();
  const selected = COMMANDS[selectedIndex];
  if (!selected) return;

  await delay(400);
  addLine(`▶ Running: ${selected.label}`, "success");
  await delay(500);
  addLine("", "info");

  for (const line of selected.output) {
    addLine(line, line.startsWith("✅") || line.startsWith("  ✓") ? "success" : "info");
    await delay(280);
  }

  await delay(400);
  utilsSimRunning = false;
}
