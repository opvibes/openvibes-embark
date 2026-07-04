type Lang = "en" | "pt";

const T: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    "nav.dashboard": "Dashboard",
    "nav.cli": "CLI",
    "nav.release": "Team Mode",
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
    "preview.tab.demo": "Demo",
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

    // Release — Team Mode + unified CLI
    "release.tag": "New in v1.7",
    "release.title.1": "One machine.",
    "release.title.2": "Or a whole team.",
    "release.sub": "agentistics is the single-machine app. agentistics central aggregates metrics from every machine on your team into one live view — without ever storing your chats.",

    "release.tab.central": "agentistics central",
    "release.tab.cli": "agentop start",
    "release.tab.harness": "Multi-harness",
    "release.tab.sessions": "Session titles",
    "release.tab.ports": "Ports & install",

    "release.central.title": "agentistics central — the team aggregator",
    "release.central.desc": "Every machine that connects to a central sends only computed metrics — tokens, cost, sessions, agent stats. Chat is never stored centrally: opening a transcript pulls it on demand over a reverse WebSocket straight from that member's machine.",
    "release.central.point1.title": "Mint, rotate, revoke, rename",
    "release.central.point1.desc": "Full token lifecycle from Team Manager. Rotating preserves a member's history under its new credential; revoking cascades and resets that machine back to solo.",
    "release.central.point2.title": "Live presence + latency",
    "release.central.point2.desc": "Presence is WebSocket-authoritative — a member flips offline within seconds of disconnecting, not minutes. Latency shown is real WS ping/pong round-trip time.",
    "release.central.point3.title": "Auto-reconciliation",
    "release.central.point3.desc": "If the central's data resets or a token rotates, members detect the change automatically and re-sync their full history — no manual resets, no double-counted stats.",
    "release.central.point4.title": "Real-time via SSE",
    "release.central.point4.desc": "Every metrics push from a member notifies connected dashboards instantly through server-sent events. Tokens are stored only as a sha256 hash — never logged, never reversible.",

    "release.cli.title": "agentop start — one launcher for everything",
    "release.cli.desc": "A single re-runnable control panel: arrow keys and Enter, a live status line for every service (configured vs. actually running), and one place to start agentistics, spin up agentistics central, connect or disconnect from a team, or stop whatever's running.",
    "release.cli.point1.title": "English and pt-BR",
    "release.cli.point1.desc": "Toggle the whole launcher's language in place, no restart needed.",
    "release.cli.point2.title": "Everything else, one command away",
    "release.cli.point2.desc": "setup · restart · central · member · autostart · check-update — plus running the machine itself inside Docker when you'd rather not install anything on the host.",

    "release.harness.title": "One dashboard, four coding agents",
    "release.harness.desc": "Claude Code, Codex CLI, Gemini CLI and GitHub Copilot CLI all report into the same dashboard. A harness selector appears the moment you have data from more than one; /compare puts them side by side.",
    "release.harness.point1.title": "Per-harness pages",
    "release.harness.point1.desc": "/h/:harness gives every agent its own Overview plus a \"Data & sources\" tab that's upfront about what that harness's data can and can't tell you.",
    "release.harness.point2.title": "Honest N/A, not fake zeros",
    "release.harness.point2.desc": "A metric a harness can't produce shows as N/A instead of a misleading 0 — compare view respects each agent's real capabilities.",

    "release.sessions.title": "Real session titles",
    "release.sessions.desc": "Session lists now show the title Claude itself generated for the conversation instead of a truncated first prompt, with a clean fallback when no title exists yet.",
    "release.sessions.point1.title": "Everywhere sessions show up",
    "release.sessions.point1.desc": "Highlights, recent sessions, the drilldown modal and the PDF export all use the same real title.",
    "release.sessions.point2.title": "Transcript spacing fixed",
    "release.sessions.point2.desc": "Chat bubbles no longer double their line breaks — markdown newlines render exactly once, on the central and locally.",

    "release.ports.title": "New ports, one install command",
    "release.ports.desc": "The web dashboard and the api + MCP server now run on dedicated ports, and agentistics central ships as its own service.",
    "release.ports.web": "web dashboard",
    "release.ports.api": "api + MCP",
    "release.ports.central": "agentistics central",
    "release.ports.install.label": "Install",

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
    "how.step2.desc": "Starts the api + MCP on port 47291 and the web dashboard on port 47292. Your ~/.claude/ is read directly — no config needed.",
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
    "footer.link.release": "Team Mode",
    "footer.link.features": "Features",
    "footer.link.arch": "Architecture",
    "footer.made": "Made with vibes by",
    "footer.rights": "© 2025 agentistics. MIT License.",
  },
  pt: {
    // Nav
    "nav.dashboard": "Dashboard",
    "nav.cli": "CLI",
    "nav.release": "Modo Time",
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
    "preview.tab.demo": "Demo",
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

    // Release — Team Mode + CLI unificada
    "release.tag": "Novo na v1.7",
    "release.title.1": "Uma máquina.",
    "release.title.2": "Ou o time inteiro.",
    "release.sub": "O agentistics é o app de uma máquina. O agentistics central agrega métricas de todas as máquinas do time numa visão só ao vivo — sem nunca guardar suas conversas.",

    "release.tab.central": "agentistics central",
    "release.tab.cli": "agentop start",
    "release.tab.harness": "Multi-harness",
    "release.tab.sessions": "Títulos de sessão",
    "release.tab.ports": "Portas & instalação",

    "release.central.title": "agentistics central — o agregador do time",
    "release.central.desc": "Toda máquina conectada a um central envia só métricas calculadas — tokens, custo, sessões, stats de agentes. O chat nunca é guardado no central: abrir uma transcrição busca ela sob demanda via WebSocket reverso direto da máquina daquele membro.",
    "release.central.point1.title": "Mint, rotate, revoke, rename",
    "release.central.point1.desc": "Ciclo de vida completo do token pelo Team Manager. Rotacionar preserva o histórico do membro na nova credencial; revogar faz cascata e devolve a máquina pro modo solo.",
    "release.central.point2.title": "Presença e latência ao vivo",
    "release.central.point2.desc": "A presença é comandada pelo WebSocket — um membro vira offline em segundos após desconectar, não minutos. A latência mostrada é o round-trip real do ping/pong do WS.",
    "release.central.point3.title": "Auto-reconciliação",
    "release.central.point3.desc": "Se os dados do central resetam ou um token é rotacionado, os membros detectam a mudança sozinhos e ressincronizam o histórico completo — sem reset manual, sem contar estatística em dobro.",
    "release.central.point4.title": "Tempo real via SSE",
    "release.central.point4.desc": "Todo envio de métricas de um membro notifica os dashboards conectados na hora via server-sent events. Tokens são guardados só como hash sha256 — nunca logados, nunca reversíveis.",

    "release.cli.title": "agentop start — um launcher pra tudo",
    "release.cli.desc": "Um painel de controle re-executável: setas e Enter, status ao vivo de cada serviço (configurado vs. rodando de verdade), e um lugar só pra iniciar o agentistics, subir o agentistics central, conectar ou desconectar de um time, ou parar o que estiver rodando.",
    "release.cli.point1.title": "Inglês e pt-BR",
    "release.cli.point1.desc": "Alterna o idioma do launcher inteiro no lugar, sem reiniciar.",
    "release.cli.point2.title": "Tudo o resto, a um comando de distância",
    "release.cli.point2.desc": "setup · restart · central · member · autostart · check-update — e ainda rodar a máquina inteira dentro do Docker quando você não quiser instalar nada no host.",

    "release.harness.title": "Um dashboard, quatro agentes de código",
    "release.harness.desc": "Claude Code, Codex CLI, Gemini CLI e GitHub Copilot CLI reportam todos pro mesmo dashboard. Um seletor de harness aparece assim que você tem dados de mais de um; /compare coloca eles lado a lado.",
    "release.harness.point1.title": "Páginas por harness",
    "release.harness.point1.desc": "/h/:harness dá a cada agente sua própria Overview mais uma aba \"Data & sources\" que é transparente sobre o que os dados daquele harness conseguem — e não conseguem — te contar.",
    "release.harness.point2.title": "N/A honesto, não zero fake",
    "release.harness.point2.desc": "Uma métrica que um harness não consegue produzir aparece como N/A em vez de um 0 enganoso — o compare respeita a capacidade real de cada agente.",

    "release.sessions.title": "Títulos de sessão de verdade",
    "release.sessions.desc": "As listas de sessão agora mostram o título que o próprio Claude gerou pra conversa, em vez de um primeiro prompt truncado, com um fallback limpo quando ainda não existe título.",
    "release.sessions.point1.title": "Em todo lugar que sessão aparece",
    "release.sessions.point1.desc": "Highlights, sessões recentes, o modal de drilldown e a exportação em PDF usam todos o mesmo título real.",
    "release.sessions.point2.title": "Espaçamento do transcript corrigido",
    "release.sessions.point2.desc": "As bolhas do chat não duplicam mais as quebras de linha — as quebras do markdown renderizam uma única vez, no central e localmente.",

    "release.ports.title": "Portas novas, um comando de instalação",
    "release.ports.desc": "O dashboard web e o servidor api + MCP agora rodam em portas dedicadas, e o agentistics central sai como serviço próprio.",
    "release.ports.web": "dashboard web",
    "release.ports.api": "api + MCP",
    "release.ports.central": "agentistics central",
    "release.ports.install.label": "Instalar",

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
    "how.step2.desc": "Inicia a api + MCP na porta 47291 e o dashboard web na porta 47292. Seu ~/.claude/ é lido diretamente — sem configuração.",
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
    "footer.link.release": "Modo Time",
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
