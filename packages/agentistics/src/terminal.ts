// Animated terminal components — agentop tui / watch / server
// Each step stores the COMPLETE html to render (no accumulation bug)

// ── Type helpers ─────────────────────────────────────────────────────────────

type TermClass = "amber" | "green" | "blue" | "cyan" | "dim" | "muted" | "bold" | "";

interface TermSpan { text: string; cls: TermClass; }

function span(text: string, cls: TermClass = ""): TermSpan { return { text, cls }; }

function renderSpans(spans: TermSpan[]): string {
  return spans.map(s =>
    s.cls ? `<span class="term-${s.cls}">${esc(s.text)}</span>` : esc(s.text)
  ).join("");
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function L(spans: TermSpan[]): string {
  return `<span class="term-line">${renderSpans(spans)}</span>\n`;
}
function Lc(cls: TermClass, text: string): string {
  return `<span class="term-line term-${cls}">${esc(text)}</span>\n`;
}
function El(): string { return `<span class="term-line"> </span>\n`; }

// ── Neural wave (node rows) ───────────────────────────────────────────────────

const NODE_N = 10;

function nodeRow(active: number): string {
  const nodes: string[] = [];
  for (let i = 0; i < NODE_N; i++) {
    if (i === active) {
      nodes.push(`<span style="color:#F59E0B;font-weight:700">◉</span>`);
    } else if (i === (active - 1 + NODE_N) % NODE_N) {
      nodes.push(`<span style="color:#6366f1">◌</span>`);
    } else {
      nodes.push(`<span style="color:rgba(255,255,255,0.18)">○</span>`);
    }
  }
  return nodes.join(" ");
}

const LABELS = [
  "awaiting input…", "awaiting input…",
  "encoding context…", "encoding context…",
  "computing attention…",
  "generating tokens…", "generating tokens…",
  "decoding output…",
  "response ready ✦", "response ready ✦",
];

function fmtN(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return String(Math.floor(n));
}
void fmtN; // suppress unused warning

// ── Full panel (rendered continuously after setup phase) ─────────────────────

function renderPanel(frame: number, _compact: boolean): string {
  // Always use the same width — panel is always full-width in the TUI card
  const sep   = "─".repeat(62);
  const wf    = frame % NODE_N;
  const label = LABELS[frame % LABELS.length]!;
  const now   = new Date();
  const clock = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;

  let h = "";
  h += L([span("Claude Stats", "amber"), span(" · Watch Mode  ", "dim"), span(clock, "dim"), span("  interval: 5s", "dim")]);
  h += Lc("dim", sep);
  h += El();

  // Neural wave — 3 rows
  h += `<span class="term-line">  ${nodeRow(wf)}</span>\n`;
  h += `<span class="term-line">  ${nodeRow((wf + 3) % NODE_N)}</span>\n`;
  h += `<span class="term-line">  ${nodeRow((wf + 6) % NODE_N)}</span>\n`;
  h += Lc("dim", "  " + label);
  h += Lc("dim", "  [Ctrl+O ocultar]");
  h += El();
  h += Lc("dim", sep);

  // Info block
  h += L([span("  Home:     ", "dim"), span("~/", "")]);
  h += L([span("  Claude:   ", "dim"), span("~/.claude", "blue")]);
  h += L([span("  Projetos: ", "dim"), span("agentistics", "amber"), span(", ", "dim"), span("embark", "amber")]);
  h += L([span("  Modo:     ", "dim"), span("ambos", "")]);
  h += L([span("  Interval: ", "dim"), span("5s", ""), span("   OTLP: ", "dim"), span("(disabled)", "muted")]);
  h += El();
  h += Lc("dim", sep);

  // UNIFICADO
  h += Lc("amber", "  UNIFICADO");
  h += El();
  h += Lc("dim", "   Msgs    Sessões   Tok-In    Tok-Out     Custo    Streak  Commits  +Linhas  -Linhas");
  h += L([
    span("   "),
    span("5.1k   ", ""), span("37        ", ""),
    span("33.0k   ", "blue"), span("3.1M      ", "blue"),
    span("$40.59   ", "green"), span("2d    ", "amber"),
    span("60      "), span("+27.8k  ", "green"), span("-15.1k", "muted"),
  ]);
  h += El();
  h += Lc("dim", sep);

  // POR PROJETO
  h += Lc("amber", "  POR PROJETO");
  h += El();
  h += Lc("dim", "  Projeto          Msgs    Sessões   Tok-In    Tok-Out    Custo    Streak");
  h += L([
    span("  "), span("agentistics     ", "amber"),
    span("1.4k    ", ""), span("5         ", ""),
    span("8.3k    ", "blue"), span("789.7k    ", "blue"),
    span("$12.46   ", "green"), span("106d", "amber"),
  ]);
  h += L([
    span("  "), span("embark          ", "amber"),
    span("3.7k    ", ""), span("32        ", ""),
    span("24.7k   ", "blue"), span("2.3M      ", "blue"),
    span("$28.13   ", "green"), span("0d", "amber"),
  ]);
  h += El();
  h += Lc("dim", sep);
  h += El();
  h += Lc("dim", "  Ctrl+C sair  |  Ctrl+O ocultar animação");
  return h;
}

// ── Phase steps (EACH step = complete content, no accumulation bug) ──────────

interface PhaseStep { html: string; delay: number; }

// ── Shared UI helpers for the setup sequence ─────────────────────────────────

const tuiTitle = L([span("Claude Stats", "amber"), span(" · Watch CLI", "dim")]) + El();
const tuiFound = Lc("amber", "41 projetos encontrados.") + El();

function cfgLine(answered: boolean, q: string, a: string): string {
  if (answered) {
    return L([span("✔ ", "blue"), span(q, ""), span(a, "cyan")]);
  }
  return L([span("? ", "amber"), span(q, ""), ...(a ? [span(a, "cyan")] : [])]);
}

function searchBox(query: string): string {
  const pad = " ".repeat(Math.max(0, 28 - query.length));
  return (
    L([span("  ┌──────────────────────────────────┐", "dim")]) +
    L([span("  │  ", "dim"), span("❯  ", "amber"), span(query, ""), span("_", "dim"), span(pad + "│", "dim")]) +
    L([span("  └──────────────────────────────────┘", "dim")])
  );
}

interface Project { name: string; path: string; }

const PROJECTS: Project[] = [
  { name: "agentistics",    path: "~/agentistics" },
  { name: "atlas-triggers", path: "~/atlas-triggers" },
  { name: "duckflux",       path: "~/duckflux" },
  { name: "embark",         path: "~/embark" },
];

function projRow(p: Project, cursor: boolean, selected: boolean): string {
  const namePad = p.name.padEnd(16);
  if (cursor) {
    return L([
      span("  ❯ ", "amber"),
      selected ? span("●  ", "amber") : span("○  ", "dim"),
      selected ? span(namePad, "amber") : span(namePad, ""),
      span(p.path, "dim"),
    ]);
  }
  return L([
    span("    ", ""),
    selected ? span("●  ", "amber") : span("○  ", "dim"),
    selected ? span(namePad, "amber") : span(namePad, "dim"),
    span(p.path, "dim"),
  ]);
}

function statusLine(selected: string[]): string {
  if (selected.length === 0) {
    return Lc("muted", "  nenhum selecionado = todos os projetos");
  }
  return L([
    span("  "),
    span(`${selected.length} selecionado${selected.length > 1 ? "s" : ""}  `, "amber"),
    span(selected.join(", "), "dim"),
  ]);
}

const selFooter =
  El() +
  L([
    span("  ↑↓ navegar  · ", "dim"),
    span(" Espaço ", "dim"),
    span("selecionar  · ", "dim"),
    span("Enter ", "dim"),
    span("confirmar  · ", "dim"),
    span("Backspace ", "dim"),
    span("apagar", "dim"),
  ]);

function buildPhaseSteps(): PhaseStep[] {
  const steps: PhaseStep[] = [];

  // ── Helpers to build the selector section ────────────────────────────────

  const selLabel = Lc("amber", "  Selecione os projetos:") + El();

  function selectorBlock(query: string, filtered: Project[], selected: string[], cursorIdx: number): string {
    const rows = filtered.map((p, i) =>
      projRow(p, i === cursorIdx, selected.includes(p.name))
    ).join("");
    return selLabel + searchBox(query) + El() + rows + statusLine(selected) + selFooter;
  }

  // ── Config lines ──────────────────────────────────────────────────────────

  const C1 = cfgLine.bind(null, true,  "Intervalo de refresh (segundos): ", "5");
  const C2 = cfgLine.bind(null, true,  "OTLP endpoint (vazio = desativado): ", "");
  const C3 = cfgLine.bind(null, true,  "Mostrar animação neural no painel? ", "Yes");

  const cfgAll = C1() + C2() + C3() + El();

  // ── Step 0: title only ────────────────────────────────────────────────────
  steps.push({ html: tuiTitle, delay: 0 });

  // ── Step 1: "N projetos encontrados." ─────────────────────────────────────
  steps.push({ html: tuiTitle + tuiFound, delay: 300 });

  // ── Step 2: first question appears (no answer yet) ────────────────────────
  steps.push({
    html: tuiTitle + tuiFound + cfgLine(false, "Intervalo de refresh (segundos): ", ""),
    delay: 700,
  });

  // ── Step 3: typing "5" ────────────────────────────────────────────────────
  steps.push({
    html: tuiTitle + tuiFound + cfgLine(false, "Intervalo de refresh (segundos): ", "5"),
    delay: 1200,
  });

  // ── Step 4: first ✔ + second question ────────────────────────────────────
  steps.push({
    html: tuiTitle + tuiFound + C1() + cfgLine(false, "OTLP endpoint (vazio = desativado): ", ""),
    delay: 1600,
  });

  // ── Step 5: second ✔ (empty) + third question ────────────────────────────
  steps.push({
    html: tuiTitle + tuiFound + C1() + C2() + cfgLine(false, "Mostrar animação neural no painel? ", "Yes"),
    delay: 2000,
  });

  // ── Step 6: all three ✔ ──────────────────────────────────────────────────
  steps.push({ html: tuiTitle + tuiFound + cfgAll, delay: 2400 });

  // ── Step 7: selector appears — empty search, all 4 projects ─────────────
  steps.push({
    html: tuiTitle + tuiFound + cfgAll + selectorBlock("", PROJECTS, [], 0),
    delay: 2900,
  });

  // ── Step 8: type "a" → agentistics + atlas-triggers visible ─────────────
  const filtered_a = PROJECTS.filter(p => p.name.includes("a"));
  steps.push({
    html: tuiTitle + tuiFound + cfgAll + selectorBlock("a", filtered_a, [], 0),
    delay: 3400,
  });

  // ── Step 9: type "ag" → only agentistics ─────────────────────────────────
  const filtered_ag = PROJECTS.filter(p => p.name.startsWith("ag"));
  steps.push({
    html: tuiTitle + tuiFound + cfgAll + selectorBlock("ag", filtered_ag, [], 0),
    delay: 3750,
  });

  // ── Step 10: space → select agentistics ──────────────────────────────────
  steps.push({
    html: tuiTitle + tuiFound + cfgAll + selectorBlock("ag", filtered_ag, ["agentistics"], 0),
    delay: 4100,
  });

  // ── Step 11: backspace × 2 → clear search, show all ─────────────────────
  const filtered_a2 = PROJECTS.filter(p => p.name.includes("a"));
  steps.push({
    html: tuiTitle + tuiFound + cfgAll + selectorBlock("a", filtered_a2, ["agentistics"], 0),
    delay: 4550,
  });
  steps.push({
    html: tuiTitle + tuiFound + cfgAll + selectorBlock("", PROJECTS, ["agentistics"], 0),
    delay: 4800,
  });

  // ── Step 13: type "emb" character by character ────────────────────────────
  const filtered_e  = PROJECTS.filter(p => p.name.includes("e"));
  const filtered_em = PROJECTS.filter(p => p.name.startsWith("em"));
  const filtered_emb = [{ name: "embark", path: "~/embark" }];

  steps.push({
    html: tuiTitle + tuiFound + cfgAll + selectorBlock("e", filtered_e, ["agentistics"], 0),
    delay: 5200,
  });
  steps.push({
    html: tuiTitle + tuiFound + cfgAll + selectorBlock("em", filtered_em, ["agentistics"], 0),
    delay: 5500,
  });
  steps.push({
    html: tuiTitle + tuiFound + cfgAll + selectorBlock("emb", filtered_emb, ["agentistics"], 0),
    delay: 5750,
  });

  // ── Step 16: space → select embark ───────────────────────────────────────
  steps.push({
    html: tuiTitle + tuiFound + cfgAll + selectorBlock("emb", filtered_emb, ["agentistics", "embark"], 0),
    delay: 6100,
  });

  // ── Step 17: view mode selector — cursor on Separado ─────────────────────
  const vmSep =
    El() +
    L([span("? ", "amber"), span("Como visualizar?", "")]) +
    El() +
    L([span("  ❯ ", "cyan"), span("Separado  ", "cyan"), span("— uma linha por projeto", "dim")]) +
    L([span("    ", "dim"), span("Unificado ", "dim"), span("— total dos selecionados", "dim")]) +
    L([span("    ", "dim"), span("Ambos     ", "dim"), span("— total no topo + linha/projeto", "dim")]) +
    El() +
    Lc("dim", "  ↑↓ navegar  ·  ↵ selecionar");

  steps.push({ html: tuiTitle + tuiFound + cfgAll + vmSep, delay: 6700 });

  // ── Step 18: cursor on Unificado ─────────────────────────────────────────
  const vmUni =
    El() +
    L([span("? ", "amber"), span("Como visualizar?", "")]) +
    El() +
    L([span("    ", "dim"), span("Separado  ", "dim"), span("— uma linha por projeto", "dim")]) +
    L([span("  ❯ ", "cyan"), span("Unificado ", "cyan"), span("— total dos selecionados", "dim")]) +
    L([span("    ", "dim"), span("Ambos     ", "dim"), span("— total no topo + linha/projeto", "dim")]) +
    El() +
    Lc("dim", "  ↑↓ navegar  ·  ↵ selecionar");

  steps.push({ html: tuiTitle + tuiFound + cfgAll + vmUni, delay: 7100 });

  // ── Step 19: cursor on Ambos ──────────────────────────────────────────────
  const vmAmbos =
    El() +
    L([span("? ", "amber"), span("Como visualizar?", "")]) +
    El() +
    L([span("    ", "dim"), span("Separado  ", "dim"), span("— uma linha por projeto", "dim")]) +
    L([span("    ", "dim"), span("Unificado ", "dim"), span("— total dos selecionados", "dim")]) +
    L([span("  ❯ ", "cyan"), span("Ambos     ", "cyan"), span("— total no topo + linha/projeto", "dim")]) +
    El() +
    Lc("dim", "  ↑↓ navegar  ·  ↵ selecionar");

  steps.push({ html: tuiTitle + tuiFound + cfgAll + vmAmbos, delay: 7500 });

  return steps;
}

// ── Hero terminal — no-op (hero-term-body removed from HTML) ─────────────────

export function initHeroTerm(): void {
  // hero-term-body no longer exists; early-return is intentional
  const raw = document.getElementById("hero-term-body");
  if (!raw) return;
  const el: HTMLElement = raw;
  let pf = 0;
  el.innerHTML = renderPanel(pf++, true);
  setInterval(() => { el.innerHTML = renderPanel(pf++, true); }, 150);
}

// ── TUI card (full-width, in #terminals section) ──────────────────────────────

export function initTuiTermCard(): void {
  const raw = document.getElementById("tui-term-body");
  if (!raw) return;
  const el: HTMLElement = raw;

  const steps = buildPhaseSteps();
  let idx = 0;
  let pf = 0;
  let running = false;

  function advance() {
    if (idx >= steps.length) { startPanel(); return; }
    const s = steps[idx]!;
    el.innerHTML = s.html + `<span class="term-cursor"></span>`;
    idx++;
    const nxt = steps[idx];
    setTimeout(advance, nxt ? nxt.delay - s.delay : 700);
  }

  function startPanel() {
    if (running) return;
    running = true;
    el.innerHTML = renderPanel(pf++, false);
    setInterval(() => { el.innerHTML = renderPanel(pf++, false); }, 150);
  }

  advance();
}

// ── agentop watch ─────────────────────────────────────────────────────────────
// Shows 2 snapshots then stops with a static explanatory line

export function initWatchTerm(): void {
  const raw = document.getElementById("watch-term-body");
  if (!raw) return;
  const el: HTMLElement = raw;

  type Line = { spans: TermSpan[]; delay: number };

  // Box width = 46 chars inner = 48 total
  const BOX_TOP = "╔" + "═".repeat(46) + "╗";
  const BOX_BOT = "╚" + "═".repeat(46) + "╝";
  function boxRow(label: string, rest: string): TermSpan[] {
    const inner = `  ${label}${rest}`;
    const pad = " ".repeat(Math.max(0, 46 - inner.length));
    return [span("║", "dim"), span(inner, ""), span(pad + "║", "dim")];
  }
  void boxRow;

  const lines: Line[] = [
    { delay: 0,    spans: [span(BOX_TOP, "dim")] },
    { delay: 60,   spans: [span("║  ", "dim"), span("Claude Stats", "amber"), span(" — Watcher / Daemon", "dim"), span("             ║", "dim")] },
    { delay: 120,  spans: [span(BOX_BOT, "dim")] },
    { delay: 200,  spans: [span("", "")] },
    { delay: 280,  spans: [span("  Home:       ", "dim"), span("~/", "")] },
    { delay: 360,  spans: [span("  Claude dir: ", "dim"), span("~/.claude", "blue")] },
    { delay: 440,  spans: [span("  Interval:   ", "dim"), span("30s", "")] },
    { delay: 520,  spans: [span("  OTLP:       ", "dim"), span("(disabled)", "muted")] },
    { delay: 620,  spans: [span("", "")] },
    {
      delay: 900,
      spans: [
        span("[snap] ", "dim"),
        span("Msgs=", "dim"), span("43495", "amber"),
        span(" Sess=", "dim"), span("354", ""),
        span(" Cost=", "dim"), span("$1948.24", "green"),
        span(" Streak=", "dim"), span("0d", "amber"),
      ],
    },
    { delay: 1060, spans: [span("[watch] ", "dim"), span("~/.claude/usage-data/session-meta", "blue")] },
    { delay: 1220, spans: [span("[watch] ", "dim"), span("~/.claude/projects", "blue")] },
    { delay: 1380, spans: [span("[watch] ", "dim"), span("Running — ", "dim"), span("CTRL+C", "amber"), span(" to stop", "dim")] },
    { delay: 1600, spans: [span("", "")] },
    {
      delay: 3800,
      spans: [
        span("[snap] ", "dim"),
        span("Msgs=", "dim"), span("43507", "amber"),
        span(" Sess=", "dim"), span("354", ""),
        span(" Cost=", "dim"), span("$1948.87", "green"),
        span(" Streak=", "dim"), span("0d", "amber"),
      ],
    },
  ];

  let html = "";
  let i = 0;

  function next() {
    if (i >= lines.length) {
      html += El();
      html += L([
        span("  → ", "amber"),
        span("in production: new snapshot every 30s, or instantly on file change", "muted"),
      ]);
      el.innerHTML = html;
      return;
    }
    const cur = lines[i]!;
    html += L(cur.spans);
    el.innerHTML = html;
    i++;
    const nxt = lines[i];
    setTimeout(next, nxt ? nxt.delay - cur.delay : 0);
  }

  setTimeout(next, 300);
}

// ── agentop server ────────────────────────────────────────────────────────────

export function initServerTerm(): void {
  const raw = document.getElementById("server-term-body");
  if (!raw) return;
  const el: HTMLElement = raw;

  const BOX_TOP = "╔" + "═".repeat(46) + "╗";
  const BOX_BOT = "╚" + "═".repeat(46) + "╝";
  const sep = "─".repeat(44);

  type Line = { spans: TermSpan[]; delay: number };

  const lines: Line[] = [
    { delay: 0,    spans: [span(BOX_TOP, "dim")] },
    { delay: 60,   spans: [span("║  ", "dim"), span("Claude Stats", "amber"), span(" — Server", "dim"), span("                        ║", "dim")] },
    { delay: 120,  spans: [span(BOX_BOT, "dim")] },
    { delay: 200,  spans: [span("", "")] },
    { delay: 270,  spans: [span("  Home:       ", "dim"), span("~/", "")] },
    { delay: 340,  spans: [span("  Claude dir: ", "dim"), span("~/.claude", "blue")] },
    { delay: 410,  spans: [span("  Interval:   ", "dim"), span("30s", "")] },
    { delay: 480,  spans: [span("  OTLP:       ", "dim"), span("(disabled)", "muted")] },
    { delay: 580,  spans: [span("", "")] },
    { delay: 760,  spans: [span("[watch] ", "dim"), span("~/.claude/usage-data/session-meta", "blue")] },
    { delay: 920,  spans: [span("[watch] ", "dim"), span("~/.claude/projects", "blue")] },
    { delay: 1060, spans: [span("", "")] },
    { delay: 1140, spans: [span(sep, "dim")] },
    { delay: 1200, spans: [span("  ", ""), span("agentistics", "amber")] },
    { delay: 1260, spans: [span(sep, "dim")] },
    { delay: 1340, spans: [span("  api  ", "dim"), span("●", "green"), span("  ", ""), span("http://localhost:3001", "cyan")] },
    { delay: 1420, spans: [span("   ui  ", "dim"), span("●", "green"), span("  ", ""), span("http://localhost:3001 embedded", "cyan")] },
    { delay: 1500, spans: [span(sep, "dim")] },
    { delay: 1600, spans: [span("", "")] },
    {
      delay: 1820,
      spans: [
        span("[snap] ", "dim"),
        span("Msgs=", "dim"), span("43495", "amber"),
        span(" Sess=", "dim"), span("354", ""),
        span(" Cost=", "dim"), span("$1948.24", "green"),
        span(" Streak=", "dim"), span("0d", "amber"),
      ],
    },
    { delay: 1980, spans: [span("[otel] ", "dim"), span("No OTLP endpoint — export disabled", "muted")] },
    { delay: 2140, spans: [span("[watch] ", "dim"), span("~/.claude/usage-data/session-meta", "blue")] },
    { delay: 2300, spans: [span("[watch] ", "dim"), span("~/.claude/projects", "blue")] },
    { delay: 2460, spans: [span("[watch] ", "dim"), span("open ", "dim"), span("http://localhost:3001", "cyan"), span(" in browser", "dim")] },
  ];

  let html = "";
  let i = 0;

  function next() {
    if (i >= lines.length) {
      el.innerHTML = html + `<span class="term-cursor"></span>`;
      return;
    }
    const cur = lines[i]!;
    html += L(cur.spans);
    el.innerHTML = html;
    i++;
    const nxt = lines[i];
    setTimeout(next, nxt ? nxt.delay - cur.delay : 0);
  }

  setTimeout(next, 400);
}

export function initTerminalTabs(): void {
  const tabs   = document.querySelectorAll<HTMLButtonElement>(".term-tab");
  const panes  = document.querySelectorAll<HTMLElement>(".term-pane");
  const argEl  = document.getElementById("term-active-arg");
  const args   = [" tui", " watch", " server"];

  if (!tabs.length || !panes.length) return;

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      panes[i]?.classList.add("active");
      if (argEl) argEl.textContent = args[i] ?? "";
    });
  });
}
