const pt = {
  nav: {
    docs: "Docs",
    install: "Instalar",
    github: "GitHub",
    why: "Por que",
    compare: "Comparar",
    principles: "Princípios",
    pipeline: "Pipeline",
    tiers: "Níveis",
    toggleMenu: "Alternar menu",
  },
  hero: {
    eyebrow: "Parity-Driven Development",
    headline: "Prove que sua migração não quebrou nada.",
    cta: "Ver o pipeline",
  },
  problem: {
    title: "\"O sistema novo ainda se comporta como o antigo?\"",
    body: "Essa pergunta costuma ser respondida no feeling. O PDD transforma isso em evidência objetiva e rastreada: cada comportamento do sistema de referência vira uma finding que você pode investigar, corrigir, provar e aprovar em QA antes de chegar na main.",
  },
  pipeline: {
    bootstrap: {
      tag: "00 · configuração única",
      description:
        "Uma entrevista estruturada captura o contexto operacional que todo outro comando depende: sistema de referência, ambientes de QA, limiares de confiança. Toda resposta é absorvida no BOOTSTRAP.md.",
      why: "Roda uma vez por projeto. Nada mais funciona sem isso: todo outro comando /audit-* lê esse arquivo antes de fazer qualquer coisa.",
    },
    new: {
      tag: "01 · abrir uma finding",
      description:
        "Você descreve um comportamento suspeito. O PDD abre a finding #007, calcula uma confidence tier inicial e adiciona uma entrada no coverage map.",
      why: "Isso força um fato observável, não uma reclamação vaga: 'mostra 3 itens, deveria mostrar 5' é aceito, 'está quebrado' é rejeitado.",
    },
    investigate: {
      tag: "02 · causa raiz",
      description: "Investigação somente-leitura do sistema de referência. Nada é alterado, só entendido.",
      why: "Separar 'entender' de 'corrigir' evita que um patch apressado esconda a causa real.",
    },
    resolve: {
      tag: "03 · corrigir",
      description: "Fix mais um teste de caracterização obrigatório. Cria a branch audit/007. Não commita sozinho.",
      why: "O teste fixa o comportamento de referência permanentemente: ele falha se alguém regredir essa correção depois.",
    },
    compare: {
      tag: "04 · prova objetiva",
      description: "Golden-master harness: roda a mesma operação nos dois sistemas e produz um diff objetivo dado-a-dado.",
      why: "Essa é evidência tier-2: um diff verificado por máquina, não um print que alguém olhou e aprovou.",
    },
    "qa-local": {
      tag: "05 · gate humano #1",
      description: "QA no localhost, antes do PR. Essa aprovação é uma pré-condição bloqueante pro /audit-pr.",
      why: "Um humano, não a IA, decide se a correção realmente está certa antes de qualquer PR ser aberto.",
    },
    pr: {
      tag: "06 · dossiê de evidências",
      description: "Monta o PR como um dossiê de evidências. Só faz push e abre o PR depois de um 'sim' humano explícito na mesma sessão.",
      why: "A regra inviolável: a IA nunca autora commits, e o push só acontece depois de um 'sim' humano explícito.",
    },
    "qa-env": {
      tag: "07 · gate humano #2",
      description: "QA no ambiente já deployado, depois do PR. Registra qa-<env> por ambiente.",
      why: "QA no localhost e um deploy real de staging podem discordar: isso pega o que só aparece quando está no ar.",
    },
    merge: {
      tag: "08 · 100% humano",
      description: "A IA nunca autora commits. O merge é feito só por um humano, e é aí que a coverage vira 'verified' de verdade.",
      why: "Coverage só vira 'verified' quando o QA do ambiente-alvo é aprovado E o PR é mergeado: nunca só pela resolução local.",
    },
  },
  legacyVsNew: {
    title: "Mesmo comportamento. Nada mais igual.",
    body: "Pro PDD não importa que o código, a linguagem ou a tela tenham mudado completamente: só que o total do checkout continue dando 129.90.",
    legacyLabel: "Legado · Java",
    newLabel: "Novo · TypeScript",
  },
  principles: {
    title: "Oito princípios, um único método.",
    body: "O PDD não é um feeling: todo comando existe pra reforçar um destes.",
    items: [
      "Disciplina forçada / gates",
      "Estado externalizado em arquivos: o .audit/ é a fonte da verdade, não o contexto do modelo",
      "Comandos pequenos e composáveis",
      "Evidência objetiva acima de opinião",
      "Um humano no gate de toda ação irreversível",
      "Feedback rápido e observável",
      "Comandos idempotentes e cientes do estado",
      "Revelação progressiva: o próprio ciclo ensina",
    ],
  },
  tiers: {
    title: "Evidência tem uma nota.",
    body: "Toda finding carrega uma confidence tier descrevendo a qualidade da sua prova, e o PDD se recusa a fechar uma finding abaixo da tier exigida pelo seu projeto.",
    rows: [
      { tier: "tier-0", evidence: "só descrição textual", label: "baixa" },
      { tier: "tier-1", evidence: "screenshots pareados (referência vs novo)", label: "média" },
      { tier: "tier-2", evidence: "diff automático de dados", label: "alta" },
      { tier: "tier-3", evidence: "tier-2 mais um teste de caracterização passando", label: "máxima" },
    ],
  },
  coverageClose: {
    title: "Cobertura de paridade, rastreada até o último percentual.",
    cta: "Instalar o PDD",
    claudeLabel: "Claude Code",
    otherAgentsLabel: "Codex · Cursor · Copilot · Gemini",
    copy: "Copiar",
    copied: "Copiado",
  },
  footer: {
    tagline: "Um framework pra refactor, rewrite e port confiável de sistemas legados, com paridade comportamental rastreada.",
    rights: "Todos os direitos reservados.",
    siteLabel: "Site",
    connectLabel: "Conecte-se",
    starGithub: "Dê uma estrela no GitHub",
  },
  bootstrapSim: {
    interviewLabel: "entrevista do bootstrap",
    fileLabel: ".audit/BOOTSTRAP.md",
    questions: [
      {
        title: "Qual é o tipo do sistema de referência?",
        sub: "Seção 2 · Sistema de referência",
        options: ["Aplicação PHP legada", "Serviço externo (API)", "Outro sistema em execução"],
      },
      {
        title: "Confidence tier mínima pra fechar uma finding?",
        sub: "Seção 12 · Limiares de confiança",
        options: [
          "tier-0: só descrição textual",
          "tier-1: screenshots pareados",
          "tier-2: diff automático de dados",
          "tier-3: diff + teste de caracterização",
        ],
      },
      {
        title: "Por quais ambientes uma mudança passa, em ordem?",
        sub: "Seção 11 · Ambientes de QA & preview",
        options: ["local → prod", "local → staging → prod", "local → dev → staging → prod"],
      },
    ],
  },
  docs: {
    menuButton: "Menu",
    closeMenuAria: "Fechar menu",
    closeButton: "Fechar",
    codeBlock: {
      copy: "Copiar",
      copied: "Copiado",
    },
    sidebar: {
      searchPlaceholder: "Buscar na doc…",
      noResults: (query: string) => `Nenhum resultado para "${query}"`,
    },
    nav: {
      groups: {
        getStarted: "Primeiros passos",
        concepts: "Conceitos",
        skills: "Skills",
        reference: "Referência",
      },
      items: {
        installation: "Instalação",
        updating: "Atualizando",
        principles: "Princípios",
        confidenceTiers: "Confidence tiers",
        skillsOverview: "Visão geral",
        cli: "PDD CLI",
        coverageMap: "Coverage map",
        auditDir: "Estrutura do .audit/",
      },
    },
    installation: {
      title: "Instalação",
      introPrefix: "O PDD é distribuído como um marketplace de plugin único. Instale por projeto: o trabalho dele é rastrear a paridade de",
      introEmphasis1: "uma",
      introMiddle: "migração contra",
      introEmphasis2: "um",
      introSuffix: "sistema de referência, e esse estado fica salvo no diretório .audit/ do projeto.",
      otherAgentsIntro: "Pra Codex, Cursor, Copilot ou Gemini CLI, use o instalador universal:",
      afterInstallPrefix: "Depois de instalado, rode",
      afterInstallSuffix:
        "(ou direcione pra um agente com pdd adapt <codex|cursor|copilot|gemini>) pra ligar as skills naquele agente.",
      methodNotePrefix:
        "O método PDD em si não precisa de nada: os comandos são markdown. Só o dashboard opcional pdd precisa de um runtime, e agora ele roda em",
      runtimeNote: "Node ≥ 18 ou Bun",
      methodNoteSuffix: ". Não é mais exclusivo do Bun.",
      quickstartPrefix: "Novo no PDD?",
      quickstartLinkLabel: "QUICKSTART.md",
      quickstartSuffix:
        "percorre o ciclo inteiro em 5 minutos, com um exemplo real de verdade: o próprio framework validado nele mesmo, migrando um backend de Bun pra Node.js de ponta a ponta.",
    },
    skills: {
      title: "Skills",
      intro:
        "Cada comando /audit-* é uma skill do Claude Code: um arquivo markdown com um roteiro que o agente segue passo a passo, lendo e escrevendo só dentro de .audit/. O que cada uma faz, com que frequência roda, o que lê, como é estruturada e o que ela deixa como resultado:",
      readFullSkill: "Ler a skill completa →",
      labels: {
        skillMd: "SKILL.md",
        reads: "Lê",
        structure: "Estrutura",
        generates: "Gera",
        related: "Relacionadas",
      },
      items: {
        bootstrap: {
          tag: "00 · configuração única",
          frequency: "Uma vez por projeto: só roda de novo com o argumento explícito \"redo\"",
          summary: "Entrevista estruturada que captura o contexto operacional do qual todo outro comando depende.",
          does: "Roda uma vez por projeto, antes de qualquer outra coisa funcionar. Entrevista você sobre o sistema de referência, os ambientes de QA por onde uma mudança passa, e a confidence tier mínima que uma finding precisa alcançar: depois absorve toda resposta no .audit/BOOTSTRAP.md, o arquivo que todo outro comando /audit-* lê antes de fazer qualquer coisa.",
          reads: ["nada na primeira execução: um .audit/BOOTSTRAP.md existente só se você passar \"redo\""],
          structure: [
            "Sistema de referência: o que é o sistema legado/referência (codebase próprio, API externa, outro sistema rodando) e como acessá-lo só-leitura",
            "Ambientes de QA & preview: por quais ambientes uma mudança passa (ex.: local → staging → prod) e como os previews são acessados (URL por branch vs checkout local)",
            "Limiares de confiança: a confidence tier mínima (tier-0…tier-3) que uma finding precisa alcançar antes do /audit-resolve fechar ela",
          ],
          generates: [
            ".audit/BOOTSTRAP.md: missão, adapter de referência, ambientes de QA, CONFIDENCE_MIN",
            ".audit/coverage.md: coverage map de paridade já semeado",
            ".audit/board.md: board de tarefas vazio",
          ],
        },
        new: {
          tag: "01 · abrir uma finding",
          frequency: "Uma vez por finding: cada chamada abre exatamente uma finding",
          summary: "Captura uma nova finding através de uma entrevista estruturada de mão dupla: rejeita reclamações vagas, aceita fatos observáveis.",
          does: "Você descreve uma diferença de comportamento suspeita. Uma entrevista estruturada força um fato observável: \"mostra 3 itens, deveria mostrar 5\" é aceito, \"está quebrado\" é rejeitado. Calcula uma confidence tier inicial e decide se isola a correção num git worktree dedicado.",
          reads: [".audit/BOOTSTRAP.md: sistema de referência + CONFIDENCE_MIN", ".audit/coverage.md: linhas existentes, pra evitar duplicar um comportamento já rastreado"],
          structure: [
            "Identificação: área, severidade, quem encontrou",
            "Sintoma: a diferença observável, nas palavras do próprio dev",
            "Reprodução: passos pra reproduzir no sistema de referência",
            "Decisão de reprodução de mão dupla (A/B/C): como os mesmos passos mapeiam pro sistema novo",
            "Hipótese: um chute inicial da causa raiz, sem precisar estar certo",
            "Cálculo da confidence tier: só tier-0/tier-1 são alcançáveis na criação",
            "Decisão de worktree: isolar a correção em .claude/worktrees, ou trabalhar na árvore principal",
          ],
          generates: [
            ".audit/findings/NNN-<slug>/README.md: frontmatter da finding + transcrição da entrevista",
            ".audit/coverage.md: nova linha pro comportamento afetado",
            ".audit/board.md: nova entrada de finding aberta",
          ],
        },
        investigate: {
          tag: "02 · causa raiz",
          frequency: "Uma vez por finding: um investigation.md por finding",
          summary: "Investigação somente-leitura da causa raiz: nunca modifica código.",
          does: "Escolhe uma de quatro abordagens de investigação, coleta evidências e escreve uma síntese dos fatos observados mais hipóteses de causa raiz ranqueadas. Separar \"entender\" de \"corrigir\" evita que um patch apressado esconda a causa real.",
          reads: [".audit/findings/NNN-<slug>/README.md: a finding a investigar", ".audit/BOOTSTRAP.md: como acessar o sistema de referência só-leitura"],
          structure: [
            "Abordagem A: análise estática do código de referência",
            "Abordagem B: inspeção dinâmica (chamadas de DB/API contra o sistema de referência rodando)",
            "Abordagem C: reprodução visual, navegando a UI de referência e observando",
            "Abordagem D: combinada, misturando as anteriores",
            "Síntese: fatos observados + hipóteses ranqueadas + recomendação + riscos",
          ],
          generates: [
            ".audit/findings/NNN-<slug>/investigation.md: causa raiz + evidências",
            ".audit/board.md: status movido pra \"investigated (ready to resolve)\"",
          ],
        },
        resolve: {
          tag: "03 · corrigir",
          frequency: "Uma vez por finding: um resolution.md por finding",
          summary: "Implementa a correção, fixa ela com um teste de caracterização obrigatório, e escreve um bloco de evidência legível por máquina.",
          does: "Confirma o plano com o dev, depois exige um teste de caracterização (golden-master) ANTES da implementação: ele fixa o comportamento de referência permanentemente, então falha se alguém regredir a correção depois. Roda CHECK_CMD, TEST_CMD e o teste de caracterização nessa ordem, sem pular nenhum. Um gate de confiança bloqueia a resolução se a tier de evidência estiver abaixo do CONFIDENCE_MIN. Cria a branch audit/NNN-<slug> e move a finding pra .audit/resolved/, mas nunca commita ou dá push.",
          reads: [".audit/findings/NNN-<slug>/investigation.md: causa raiz a corrigir", ".audit/BOOTSTRAP.md: CHECK_CMD, TEST_CMD, CONFIDENCE_MIN"],
          structure: [
            "Modo worktree vs branch: isolar num worktree dedicado, ou trabalhar numa branch na árvore principal",
            "Confirmar o plano de correção com o dev antes de mexer no código",
            "Teste de caracterização obrigatório, escrito primeiro: fixa o comportamento de referência",
            "Implementação",
            "Validação automatizada: CHECK_CMD → TEST_CMD → teste de caracterização, nessa ordem, sem pular",
            "Gate de confiança: bloqueia abaixo do CONFIDENCE_MIN",
            "Bloco de evidência: um bloco YAML com confidence, parity_diff, characterization_test, screenshots, checks, pr_url",
          ],
          generates: [
            ".audit/resolved/NNN-<slug>/resolution.md, resumo da correção + bloco evidence: YAML",
            "branch audit/NNN-<slug>: sem commit, o commit em si continua humano",
            ".audit/coverage.md: linha marcada como \"resolved\" (ainda não \"verified\")",
          ],
        },
        compare: {
          tag: "04 · prova objetiva",
          frequency: "Quantas vezes forem necessárias por finding: roda de novo sempre que precisar de prova fresca",
          summary: "Golden-master harness de comparação: roda a MESMA operação só-leitura nos dois sistemas e faz o diff da saída.",
          does: "Roda a mesma operação só-leitura, idêntica, contra o sistema de referência e o novo (CLI, query de DB, chamada de API ou browser), faz o diff das duas saídas, e grava o resultado como evidência tier-2. Um diff vazio significa paridade confirmada objetivamente, não avaliada no olho.",
          reads: [".audit/BOOTSTRAP.md: qual modo de acesso (CLI/DB/API/browser) alcança cada sistema"],
          structure: [
            "Modo de execução A: CLI",
            "Modo de execução B: query de DB via MCP",
            "Modo de execução C: chamada de API",
            "Modo de execução D: browser via MCP",
            "Todo modo pede confirmação explícita de cada lado antes de rodar, mesmo sendo só-leitura",
            "Produz um diff textual e reporta o resumo",
          ],
          generates: [".audit/findings/NNN-<slug>/refs/parity-<date>.diff: evidência tier-2"],
        },
        qa: {
          tag: "05 / 07 · gates humanos",
          frequency: "Uma vez por finding por ambiente: local primeiro, depois uma vez por ambiente de deploy",
          summary: "Ponte de QA sensível ao ambiente entre a correção (git) e a validação (Notion ou um checklist em arquivo): a execução local roda antes do PR, a por-ambiente depois.",
          does: "o QA local roda ANTES do PR e é uma pré-condição bloqueante pro /audit-pr. Todo outro ambiente (dev/staging/prod) roda DEPOIS do PR aberto, contra o deploy daquele ambiente. Cria cartões de teste em linguagem simples a partir dos critérios de aceite da finding, depois reporta o status aprovado/rejeitado de volta. A coverage só é promovida a \"verified\" quando o QA do ambiente-alvo é aprovado E o PR é mergeado: o único lugar onde essa promoção acontece.",
          reads: [".audit/resolved/NNN-<slug>/resolution.md: critérios de aceite + estado do PR", ".audit/BOOTSTRAP.md: ambientes de QA configurados"],
          structure: [
            "Modo CREATE (primeira execução): monta uma página de finding + N cartões de teste a partir dos critérios de aceite, em linguagem simples e não-técnica",
            "Modo STATUS/FEEDBACK (execuções seguintes), lê o status dos cartões: tudo aguardando / tudo aprovado / misto / rejeitado",
            "Cartões rejeitados: a correção continua na MESMA branch como um ajuste incremental pré-merge, nunca um novo ciclo pós-merge",
            "Promoção de coverage, só quando qa-<QA_TARGET_ENV>: approved E o estado do PR é MERGED",
          ],
          generates: [
            ".audit/findings/NNN-<slug>/qa/checklist.md (modo arquivo): ou páginas no Notion em \"PDD - Findings\" / \"PDD - QA Tests\"",
            "resolution.md: URLs/paths de QA registrados pra rastreabilidade nos dois sentidos",
            ".audit/coverage.md: linha promovida a \"verified\" (a única transição que faz isso)",
          ],
        },
        pr: {
          tag: "06 · dossiê de evidências",
          frequency: "Uma vez por finding: depois do QA local aprovar, antes do QA de staging",
          summary: "Monta o PR como um dossiê de evidências autocontido: só faz push e abre o PR depois de um \"sim\" humano explícito.",
          does: "Checa seis pré-condições bloqueantes: resolution existe, bloco de evidência presente, branch existe, dev commitou, confidence ≥ CONFIDENCE_MIN, QA local aprovado. Só depois disso monta qualquer coisa. Monta o corpo do PR a partir de README + investigation + resolution: confidence tier, resultados de check/test, teste de caracterização, parity diff, screenshots pareados, checklist de QA. Depois para num gate de push e espera um \"sim\" explícito.",
          reads: [".audit/resolved/NNN-<slug>/resolution.md, investigation.md, README.md: o histórico completo da finding"],
          structure: [
            "Localiza a finding e seu worktree",
            "Seis pré-condições bloqueantes, checadas em ordem: para na primeira falha",
            "Coleta os artefatos de evidência (checks, teste de caracterização, parity diff, screenshots)",
            "Monta o corpo do PR a partir de template-pr-body.md",
            "Apresenta o dossiê e PARA no gate de push",
            "git push + gh pr create: só depois de um \"sim\" humano explícito",
            "Grava a URL do PR de volta no resolution.md e passa a bola pro /audit-qa",
          ],
          generates: [
            ".audit/resolved/NNN-<slug>/refs/pr-body.md: o dossiê montado",
            "resolution.md, pr_url gravado no bloco evidence:",
            "um PR aberto no GitHub: só depois da confirmação humana explícita",
          ],
        },
        status: {
          tag: "dashboard só-leitura",
          frequency: "Sob demanda, a qualquer momento: só-leitura, não muda nenhum estado",
          summary: "Dashboard só-leitura de todo o estado do PDD: coverage, distribuição de confidence, trabalho em andamento, próximas ações sugeridas.",
          does: "Lê BOOTSTRAP.md, coverage.md, board.md e o frontmatter de cada finding, depois renderiza a coverage de paridade, uma quebra por confidence tier, findings agrupadas por área e severidade, e uma lista condicional de \"próximas ações sugeridas\". Não muda nada: o equivalente sempre-ligado no terminal é o pdd board --watch.",
          reads: [".audit/BOOTSTRAP.md", ".audit/coverage.md", ".audit/board.md", "o frontmatter de cada finding"],
          structure: [
            "Coverage de paridade: linhas verified / total do coverage.md",
            "Distribuição de confidence: contagem de tier-0..tier-3 entre findings abertas e resolvidas",
            "Por área do projeto / por severidade",
            "Em andamento: do board.md, mais o caminho do worktree de cada finding",
            "Próximas ações sugeridas: condicional ao que está aberto, investigado, abaixo do gate de confidence, ou com um PR aberto",
          ],
          generates: ["nada: puramente só-leitura, reporta no chat"],
        },
      },
    },
    cli: {
      title: "PDD CLI",
      intro:
        "Além das skills /audit-* que rodam dentro do seu agente, o PDD traz um binário pdd independente: um dashboard sem dependências sobre o mesmo diretório .audit/. Ele lê o estado, nunca escreve nele: as skills são a única coisa que muda .audit/.",
      gifCaption:
        "Gravação real do `pdd`, gerada com VHS a partir da própria demo tape do projeto: o mesmo terminal que você tem depois de rodar /audit-bootstrap.",
      howItWorksTitle: "Como funciona",
      howItWorksP1:
        "o pdd resolve o diretório .audit/ de um projeto subindo a partir do diretório de trabalho atual: então funciona a partir de qualquer subpasta, não só da raiz do projeto. Ele lê BOOTSTRAP.md, coverage.md, board.md, e toda finding em .audit/findings/ e .audit/resolved/, depois renderiza tudo em abas: Overview, Flow (pipeline por finding), Worktrees, Findings, Active e Coverage.",
      howItWorksP2:
        "Nenhuma configuração de projeto é necessária além de ter rodado /audit-bootstrap uma vez: se ainda não existe um diretório .audit/, o pdd só avisa pra rodar isso primeiro.",
      commandsTitle: "Comandos",
      commands: [
        { cmd: "pdd", description: "Dashboard interativo e navegável (padrão: igual a pdd tui)" },
        { cmd: "pdd tui [path]", description: "Dashboard interativo: ↑/↓ navega, →/enter expande, Tab troca de aba, q sai" },
        { cmd: "pdd board [path]", description: "Imprime um snapshot estático do dashboard uma vez" },
        { cmd: "pdd board --watch [path]", description: "Snapshot estático, atualizando sozinho sempre que .audit/ muda" },
        { cmd: "pdd prune [path]", description: "Remove registros de atividade obsoletos/órfãos de .audit/" },
        { cmd: "pdd init [harness...]", description: "Instala os comandos do PDD nos agentes detectados (Codex/Cursor/Copilot/Gemini), ou nos indicados" },
        { cmd: "pdd adapt <harness>", description: "Gera os arquivos de comando pra um agente específico a partir das skills canônicas" },
        { cmd: "pdd check", description: "Verifica se há uma versão mais nova do PDD disponível" },
        { cmd: "pdd update", description: "Atualiza o PDD (instalação via git clone) ou mostra como atualizar o plugin do Claude" },
        { cmd: "pdd version", description: "Imprime a versão instalada" },
      ],
      tryItTitle: "Testar",
    },
    confidenceTiers: {
      title: "Confidence tiers",
      intro:
        "Toda finding carrega uma confidence tier descrevendo a qualidade da sua evidência. O /audit-resolve se recusa a fechar uma finding abaixo do mínimo configurado (padrão tier-1, tier-2 recomendado).",
      rows: [
        { tier: "tier-0", evidence: "só descrição textual", label: "baixa" },
        { tier: "tier-1", evidence: "screenshots pareados (referência vs novo)", label: "média" },
        { tier: "tier-2", evidence: "diff automático de dados (/audit-compare)", label: "alta" },
        { tier: "tier-3", evidence: "tier-2 mais um teste de caracterização passando", label: "máxima" },
      ],
    },
    coverageMap: {
      title: "O coverage map",
      descriptionLead:
        "é uma tabela legível por máquina: a visão única de quanto do comportamento legado já está verificado, e com qual confiança.",
      statusLabel: "O status é um de",
      parityFormula: "Coverage de paridade % = verified / total.",
    },
    auditDirStructure: {
      title: "Estrutura gerada do .audit/",
      intro: "O PDD guarda todo o estado no projeto, dentro de .audit/: ele sobrevive entre sessões e devs.",
    },
    principles: {
      title: "Princípios",
      items: [
        "Disciplina forçada / gates",
        "Estado externalizado em arquivos (o .audit/ é a fonte da verdade, não o contexto do modelo)",
        "Comandos pequenos e composáveis",
        "Evidência objetiva acima de opinião",
        "Um humano no gate de toda ação irreversível",
        "Feedback rápido e observável",
        "Comandos idempotentes e cientes do estado",
        "Revelação progressiva (o próprio ciclo ensina)",
      ],
      note:
        "Regra inviolável: a IA nunca autora commits. push / gh pr create só acontecem depois de um \"sim\" humano explícito na mesma sessão. O merge é 100% humano e só depois do QA aprovar.",
    },
    updating: {
      title: "Atualizando",
    },
  },
};

export default pt;
