type Lang = "en" | "pt";

const T: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    "nav.dashboard": "Dashboard",
    "nav.cli": "CLI",
    "nav.features": "Features",
    "nav.install": "Install",
    "nav.github": "GitHub ↗",

    // Hero
    "hero.badge": "local-first · zero cloud · open source",
    "hero.title.1": "Every token",
    "hero.title.2": "counts.",
    "hero.sub.1": "Local analytics dashboard for AI coding assistants.",
    "hero.sub.2": "Tokens, costs, agent metrics and activity heatmap —",
    "hero.sub.3": "parsed straight from",
    "hero.cta.primary": "Get started",
    "hero.cta.secondary": "See it in action →",
    "hero.stat.tokens": "tokens today",
    "hero.stat.cost": "total cost",
    "hero.stat.sessions": "sessions",
    "hero.stat.streak": "streak",

    // Preview section
    "preview.tag": "Dashboard",
    "preview.title.1": "Every metric.",
    "preview.title.2": "One interface.",
    "preview.sub": "Real screenshots from a live agentistics instance.",
    "preview.tab.overview": "Overview",
    "preview.tab.activity": "Activity",
    "preview.tab.models": "Models",
    "preview.tab.projects": "Projects",
    "preview.tab.agents": "Agents",
    "preview.tab.sessions": "Sessions",
    "preview.pdf.title": "PDF Export",
    "preview.pdf.sub": "One-click report — dark & light themes, shareable anywhere",
    "preview.cta.label": "Ready to see your own data?",
    "preview.cta.github": "Get started on GitHub",

    // Terminals section
    "terminals.tag": "CLI",
    "terminals.title.1": "Three commands.",
    "terminals.title.2": "Total observability.",
    "terminals.sub": "Three commands, three modes — a fullscreen TUI for live metrics, a background OTel daemon, and a server with embedded React dashboard.",

    // Features
    "features.tag": "Features",
    "features.title.1": "Everything you need to",
    "features.title.2": "understand your AI usage",
    "feat.1.title": "Token tracking — per model, per session, per type",
    "feat.1.desc": "Input, output, cache read and cache write tokens broken down separately for every session and every model. Understand exactly where your token budget goes and which cache strategies save you the most.",
    "feat.2.title": "Cost analysis in USD & BRL",
    "feat.2.desc": "Real costs in USD and BRL with live exchange rates. Blended cost-per-token across your entire model mix. Per-model breakdown with exact Anthropic pricing so you know which model is costing what.",
    "feat.3.title": "Agent metrics — deep per-invocation data",
    "feat.3.desc": "Every Agent tool call is tracked individually: duration, token usage, cost, and detailed tool stats including file reads, edits, bash executions, and searches. Compare success rates per agent type across your sessions.",
    "feat.4.title": "Activity heatmap & streak tracking",
    "feat.4.desc": "GitHub-style contribution heatmap of your AI coding activity across 52 weeks. Streak counter that tracks consecutive active days — without penalizing you for not having worked yet today. Intensity reflects token volume per day.",
    "feat.5.title": "Model breakdown by project",
    "feat.5.desc": "Token and cost distribution across every Claude model in your usage history. Filter by project to identify which workstreams lean most heavily on expensive models. Donut chart and per-model table with share percentages.",
    "feat.6.title": "100% local — zero cloud, zero telemetry",
    "feat.6.desc": "Reads directly from ~/.claude/ on your filesystem. No cloud sync, no account creation, no analytics, no telemetry. A single binary that parses JSONL files locally and serves everything from your machine.",
    "feat.7.title": "OpenTelemetry export",
    "feat.7.desc": "Export your AI usage metrics to any OTel-compatible backend. Token counters, cost gauge, session count, streak days, git line stats, and per-tool-type call counts. Works with Prometheus, Grafana, Datadog, and any OTLP endpoint.",
    "feat.8.title": "PDF export — dark & light themes",
    "feat.8.desc": "One-click export of your full analytics report as a PDF. Includes token usage, cost breakdown, session history, model distribution, and agent metrics. Choose between dark and light themes — perfect for sharing with your team.",

    // How
    "how.tag": "Install",
    "how.title.1": "Up and running",
    "how.title.2": "in 30 seconds",
    "how.sub": "Single binary, no config, no dependencies. Drop it anywhere in your $PATH and start exploring your AI usage immediately.",
    "how.step1.title": "Download the binary",
    "how.step1.desc": "One-line install for Linux/macOS. Or clone and build from source with Bun.",
    "how.step2.title": "Run agentop server",
    "how.step2.desc": "Starts the API on port 3001 and serves the full React dashboard. Your ~/.claude/ is read directly — no config needed.",
    "how.step3.title": "Watch metrics live",
    "how.step3.desc": "Use agentop tui for a fullscreen terminal dashboard or agentop watch to stream OTel metrics to your observability stack.",

    // Arch
    "arch.tag": "Architecture",
    "arch.title.1": "Data flow from",
    "arch.title.2": "file to insight",
    "arch.sub": "Every session is a JSONL file. Agentistics parses them locally, aggregates stats-cache, extracts agent metrics, and streams live updates via SSE — all without ever touching a remote server.",

    // CTA
    "cta.title": "Start tracking your AI usage today",
    "cta.sub": "Open source · Local first · Built with Bun + React + TypeScript",
    "cta.primary": "View on GitHub",
    "cta.secondary": "Read the docs",

    // Footer
    "footer.tagline.1": "Local analytics for AI coding assistants.",
    "footer.tagline.2": "Built for the vibe coding era.",
    "footer.col.project": "Project",
    "footer.col.resources": "Resources",
    "footer.link.releases": "Releases",
    "footer.link.issues": "Issues",
    "footer.link.changelog": "Changelog",
    "footer.link.install": "Install guide",
    "footer.link.cli": "CLI reference",
    "footer.link.features": "Features",
    "footer.link.arch": "Architecture",
    "footer.made": "Made with vibes by",
    "footer.rights": "© 2025 agentistics. MIT License.",
  },
  pt: {
    // Nav
    "nav.dashboard": "Dashboard",
    "nav.cli": "CLI",
    "nav.features": "Recursos",
    "nav.install": "Instalar",
    "nav.github": "GitHub ↗",

    // Hero
    "hero.badge": "local-first · zero cloud · código aberto",
    "hero.title.1": "Cada token",
    "hero.title.2": "importa.",
    "hero.sub.1": "Dashboard local de analytics para assistentes de IA.",
    "hero.sub.2": "Tokens, custos, métricas de agentes e heatmap de atividade —",
    "hero.sub.3": "direto do",
    "hero.cta.primary": "Começar",
    "hero.cta.secondary": "Ver em ação →",
    "hero.stat.tokens": "tokens hoje",
    "hero.stat.cost": "custo total",
    "hero.stat.sessions": "sessões",
    "hero.stat.streak": "sequência",

    // Preview section
    "preview.tag": "Dashboard",
    "preview.title.1": "Cada métrica.",
    "preview.title.2": "Uma interface.",
    "preview.sub": "Screenshots reais de uma instância ao vivo do agentistics.",
    "preview.tab.overview": "Visão geral",
    "preview.tab.activity": "Atividade",
    "preview.tab.models": "Modelos",
    "preview.tab.projects": "Projetos",
    "preview.tab.agents": "Agentes",
    "preview.tab.sessions": "Sessões",
    "preview.pdf.title": "Exportar PDF",
    "preview.pdf.sub": "Relatório em um clique — temas dark & light, fácil de compartilhar",
    "preview.cta.label": "Pronto para ver seus próprios dados?",
    "preview.cta.github": "Começar no GitHub",

    // Terminals section
    "terminals.tag": "CLI",
    "terminals.title.1": "Três comandos.",
    "terminals.title.2": "Observabilidade total.",
    "terminals.sub": "Três comandos, três modos — TUI fullscreen para métricas ao vivo, daemon OTel em background, e servidor com dashboard React embutido.",

    // Features
    "features.tag": "Recursos",
    "features.title.1": "Tudo que você precisa para",
    "features.title.2": "entender seu uso de IA",
    "feat.1.title": "Rastreamento de tokens — por modelo, sessão e tipo",
    "feat.1.desc": "Tokens de entrada, saída, cache read e cache write discriminados por sessão e por modelo. Entenda exatamente onde vai seu orçamento de tokens e quais estratégias de cache te poupam mais.",
    "feat.2.title": "Análise de custos em USD e BRL",
    "feat.2.desc": "Custos reais em USD e BRL com taxas de câmbio ao vivo. Custo-por-token ponderado por todo o mix de modelos. Breakdown por modelo com precificação exata da Anthropic.",
    "feat.3.title": "Métricas de agentes — dados detalhados por invocação",
    "feat.3.desc": "Cada chamada Agent é rastreada individualmente: duração, uso de tokens, custo e estatísticas de ferramentas incluindo leituras, edições, execuções bash e buscas. Compare taxas de sucesso por tipo de agente.",
    "feat.4.title": "Heatmap de atividade e sequência",
    "feat.4.desc": "Heatmap de contribuição no estilo GitHub da sua atividade com IA ao longo de 52 semanas. Contador de sequência que rastreia dias ativos consecutivos — sem penalizar por ainda não ter trabalhado hoje.",
    "feat.5.title": "Breakdown de modelos por projeto",
    "feat.5.desc": "Distribuição de tokens e custos por todos os modelos Claude no seu histórico. Filtre por projeto para identificar quais fluxos de trabalho usam mais os modelos mais caros. Gráfico donut e tabela por modelo.",
    "feat.6.title": "100% local — sem nuvem, sem telemetria",
    "feat.6.desc": "Lê diretamente do ~/.claude/ no seu sistema de arquivos. Sem sync na nuvem, sem criação de conta, sem analytics, sem telemetria. Um binário único que parseia arquivos JSONL localmente.",
    "feat.7.title": "Exportação OpenTelemetry",
    "feat.7.desc": "Exporte métricas de uso de IA para qualquer backend compatível com OTel. Contadores de tokens, gauge de custo, contagem de sessões, dias de sequência e stats do git. Funciona com Prometheus, Grafana, Datadog e qualquer endpoint OTLP.",
    "feat.8.title": "Exportação PDF — temas dark e light",
    "feat.8.desc": "Exportação com um clique do relatório completo como PDF. Inclui uso de tokens, breakdown de custos, histórico de sessões, distribuição de modelos e métricas de agentes. Escolha entre temas dark e light para compartilhar com o time.",

    // How
    "how.tag": "Instalar",
    "how.title.1": "Pronto em",
    "how.title.2": "30 segundos",
    "how.sub": "Binário único, sem configuração, sem dependências. Coloque em qualquer lugar do seu $PATH e explore seu uso de IA imediatamente.",
    "how.step1.title": "Baixe o binário",
    "how.step1.desc": "Instalação em uma linha para Linux/macOS. Ou clone e compile com Bun.",
    "how.step2.title": "Execute agentop server",
    "how.step2.desc": "Inicia a API na porta 3001 e serve o dashboard React completo. Seu ~/.claude/ é lido diretamente — sem configuração.",
    "how.step3.title": "Veja as métricas ao vivo",
    "how.step3.desc": "Use agentop tui para um dashboard em terminal ou agentop watch para exportar métricas OTel.",

    // Arch
    "arch.tag": "Arquitetura",
    "arch.title.1": "Fluxo de dados do",
    "arch.title.2": "arquivo ao insight",
    "arch.sub": "Cada sessão é um arquivo JSONL. O Agentistics analisa localmente, agrega o stats-cache, extrai métricas de agentes e transmite atualizações via SSE — tudo sem tocar em servidores remotos.",

    // CTA
    "cta.title": "Comece a rastrear seu uso de IA hoje",
    "cta.sub": "Código aberto · Local first · Feito com Bun + React + TypeScript",
    "cta.primary": "Ver no GitHub",
    "cta.secondary": "Ler a documentação",

    // Footer
    "footer.tagline.1": "Analytics local para assistentes de IA.",
    "footer.tagline.2": "Feito para a era do vibe coding.",
    "footer.col.project": "Projeto",
    "footer.col.resources": "Recursos",
    "footer.link.releases": "Releases",
    "footer.link.issues": "Issues",
    "footer.link.changelog": "Changelog",
    "footer.link.install": "Guia de instalação",
    "footer.link.cli": "Referência CLI",
    "footer.link.features": "Recursos",
    "footer.link.arch": "Arquitetura",
    "footer.made": "Feito com vibes por",
    "footer.rights": "© 2025 agentistics. Licença MIT.",
  },
};

let currentLang: Lang = "en";

function applyTranslations(lang: Lang): void {
  const dict = T[lang];
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n")!;
    const text = dict[key];
    if (text !== undefined) el.textContent = text;
  });
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  const btn = document.getElementById("lang-toggle");
  if (btn) btn.textContent = lang === "en" ? "PT" : "EN";
}

export function initI18n(): void {
  const saved = localStorage.getItem("agentistics-lang") as Lang | null;
  if (saved === "en" || saved === "pt") {
    currentLang = saved;
  } else {
    const browser = navigator.language.toLowerCase();
    currentLang = browser.startsWith("pt") ? "pt" : "en";
  }

  applyTranslations(currentLang);

  const btn = document.getElementById("lang-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "pt" : "en";
    localStorage.setItem("agentistics-lang", currentLang);
    applyTranslations(currentLang);
  });
}
