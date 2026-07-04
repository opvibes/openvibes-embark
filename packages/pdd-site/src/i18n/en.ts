const en = {
  nav: {
    docs: "Docs",
    install: "Install",
    github: "GitHub",
    why: "Why",
    compare: "Compare",
    principles: "Principles",
    pipeline: "Pipeline",
    tiers: "Tiers",
    toggleMenu: "Toggle menu",
  },
  hero: {
    eyebrow: "Parity-Driven Development",
    headline: "Prove your migration didn't break anything.",
    cta: "See the pipeline",
  },
  problem: {
    title: "\"Does the new system still behave like the old one?\"",
    body: "That question usually gets answered with a gut feeling. PDD turns it into objective, tracked evidence: every behavior of the reference system becomes a finding you can investigate, fix, prove, and gate through QA before it ever reaches main.",
  },
  pipeline: {
    bootstrap: {
      tag: "00 · one-time setup",
      description:
        "A structured interview captures the operational context every other command relies on: reference system, QA environments, confidence thresholds. Every answer is absorbed into BOOTSTRAP.md.",
      why: "Runs once per project. Nothing else works without it: every other /audit-* command reads this file before doing anything.",
    },
    new: {
      tag: "01 · open a finding",
      description:
        "You describe a suspicious behavior. PDD opens finding #007, computes an initial confidence tier, and adds a coverage-map entry.",
      why: "It forces an observable fact, not a vague complaint: 'shows 3 items, should show 5' is accepted, 'it's broken' is rejected.",
    },
    investigate: {
      tag: "02 · root cause",
      description: "Read-only investigation of the reference system. Nothing is changed, only understood.",
      why: "Separating 'understand' from 'fix' stops a rushed patch from papering over the real cause.",
    },
    resolve: {
      tag: "03 · fix it",
      description: "Fix plus a mandatory characterization test. Creates branch audit/007. Does not commit on its own.",
      why: "The test pins the reference behavior permanently: it fails if anyone ever regresses this fix later.",
    },
    compare: {
      tag: "04 · objective proof",
      description: "Golden-master harness: runs the same operation on both systems and produces an objective data-to-data diff.",
      why: "This is tier-2 evidence: a machine-checked diff, not a screenshot someone eyeballed and approved.",
    },
    "qa-local": {
      tag: "05 · human gate #1",
      description: "QA on localhost, before the PR. This approval is a blocking precondition for /audit-pr.",
      why: "A human, not the AI, decides whether the fix actually looks right before any PR gets opened.",
    },
    pr: {
      tag: "06 · evidence dossier",
      description: "Assembles the PR as an evidence dossier. Only pushes and opens the PR after an explicit human 'yes' in the same session.",
      why: "The inviolable rule: the AI never authors commits, and push only happens after an explicit human 'yes'.",
    },
    "qa-env": {
      tag: "07 · human gate #2",
      description: "QA on the already-deployed environment, after the PR. Records qa-<env> per environment.",
      why: "Localhost QA and a real staging deploy can disagree: this catches whatever only shows up once it's live.",
    },
    merge: {
      tag: "08 · 100% human",
      description: "The AI never authors commits. Merge is done only by a human, and that's when coverage truly becomes verified.",
      why: "Coverage only becomes 'verified' once target-env QA is approved AND the PR is merged: never from local resolution alone.",
    },
  },
  legacyVsNew: {
    title: "Same behavior. Nothing else the same.",
    body: "PDD doesn't care that the code, the language, or the screen changed completely: only that the checkout total still comes out to 129.90.",
    legacyLabel: "Legacy · Java",
    newLabel: "New · TypeScript",
  },
  principles: {
    title: "Eight principles, one method.",
    body: "PDD isn't a vibe: every command exists to enforce one of these.",
    items: [
      "Forced discipline / gates",
      "State externalized in files: .audit/ is the source of truth, not the model's context",
      "Small composable commands",
      "Objective evidence over opinion",
      "A human at the gate of every irreversible action",
      "Fast observable feedback",
      "Idempotent state-aware commands",
      "Progressive disclosure: the cycle teaches itself",
    ],
  },
  tiers: {
    title: "Evidence has a grade.",
    body: "Every finding carries a confidence tier describing the quality of its proof, and PDD refuses to close a finding below the tier your project requires.",
    rows: [
      { tier: "tier-0", evidence: "textual description only", label: "low" },
      { tier: "tier-1", evidence: "paired screenshots (reference vs new)", label: "medium" },
      { tier: "tier-2", evidence: "automated data-to-data diff", label: "high" },
      { tier: "tier-3", evidence: "tier-2 plus a passing characterization test", label: "max" },
    ],
  },
  coverageClose: {
    title: "Parity coverage, tracked to the last percent.",
    cta: "Install PDD",
    claudeLabel: "Claude Code",
    otherAgentsLabel: "Codex · Cursor · Copilot · Gemini",
    copy: "Copy",
    copied: "Copied",
  },
  footer: {
    tagline: "A framework for reliable legacy refactor, rewrite, and port, with tracked behavioral parity.",
    rights: "All rights reserved.",
    siteLabel: "Site",
    connectLabel: "Connect",
    starGithub: "Star us on GitHub",
  },
  bootstrapSim: {
    interviewLabel: "bootstrap interview",
    fileLabel: ".audit/BOOTSTRAP.md",
    questions: [
      {
        title: "What is the type of the reference system?",
        sub: "Section 2 · Reference system",
        options: ["Legacy PHP application", "External service (API)", "Another running system"],
      },
      {
        title: "Minimum confidence tier to close a finding?",
        sub: "Section 12 · Confidence thresholds",
        options: [
          "tier-0: textual description only",
          "tier-1: paired screenshots",
          "tier-2: automated data-to-data diff",
          "tier-3: diff + characterization test",
        ],
      },
      {
        title: "Which environments does a change flow through, in order?",
        sub: "Section 11 · QA environments & preview",
        options: ["local → prod", "local → staging → prod", "local → dev → staging → prod"],
      },
    ],
  },
  docs: {
    menuButton: "Menu",
    closeMenuAria: "Close menu",
    closeButton: "Close",
    codeBlock: {
      copy: "Copy",
      copied: "Copied",
    },
    sidebar: {
      searchPlaceholder: "Search docs…",
      noResults: (query: string) => `No results for "${query}"`,
    },
    nav: {
      groups: {
        getStarted: "Get started",
        concepts: "Concepts",
        skills: "Skills",
        reference: "Reference",
      },
      items: {
        installation: "Installation",
        updating: "Updating",
        principles: "Principles",
        confidenceTiers: "Confidence tiers",
        skillsOverview: "Overview",
        cli: "PDD CLI",
        coverageMap: "Coverage map",
        auditDir: ".audit/ structure",
      },
    },
    installation: {
      title: "Installation",
      introPrefix: "PDD ships as a single-plugin marketplace. Install it per-project: its whole job is to track the parity of",
      introEmphasis1: "one",
      introMiddle: "migration against",
      introEmphasis2: "one",
      introSuffix: "reference system, and it stores that state in the project's .audit/ directory.",
      otherAgentsIntro: "For Codex, Cursor, Copilot, or Gemini CLI, use the universal installer:",
      afterInstallPrefix: "Once installed, run",
      afterInstallSuffix:
        "(or target one agent with pdd adapt <codex|cursor|copilot|gemini>) to wire the skills into that agent.",
      methodNotePrefix:
        "The PDD method itself needs nothing: the commands are markdown. Only the optional pdd live dashboard needs a runtime, and it now runs on",
      runtimeNote: "Node ≥ 18 or Bun",
      methodNoteSuffix: ". It is no longer Bun-only.",
      quickstartPrefix: "New to PDD?",
      quickstartLinkLabel: "QUICKSTART.md",
      quickstartSuffix:
        "walks through the whole cycle in 5 minutes, with a real worked example: the framework validated on itself, migrating a backend from Bun to Node.js end to end.",
    },
    skills: {
      title: "Skills",
      intro:
        "Every /audit-* command is a Claude Code skill: a markdown file with an outline the agent follows step by step, reading and writing only inside .audit/. What each one does, how often it runs, what it reads, how it's structured, and what it leaves behind:",
      readFullSkill: "Read the full skill →",
      labels: {
        skillMd: "SKILL.md",
        reads: "Reads",
        structure: "Structure",
        generates: "Generates",
        related: "Related",
      },
      items: {
        bootstrap: {
          tag: "00 · one-time setup",
          frequency: "Once per project: run again only with the explicit \"redo\" argument",
          summary: "Structured interview that captures the operational context every other command depends on.",
          does: "Runs once per project, before anything else works. Interviews you about the reference system, the QA environments a change flows through, and the minimum confidence tier a finding must reach: then absorbs every answer into .audit/BOOTSTRAP.md, the file every other /audit-* command reads before doing anything.",
          reads: ["none on first run: an existing .audit/BOOTSTRAP.md only if you pass \"redo\""],
          structure: [
            "Reference system: what the legacy/reference system is (own codebase, external API, another running system) and how to reach it read-only",
            "QA environments & preview: which environments a change flows through (e.g. local → staging → prod) and how previews are reached (per-branch URL vs local checkout)",
            "Confidence thresholds: the minimum confidence tier (tier-0…tier-3) a finding must reach before /audit-resolve will close it",
          ],
          generates: [
            ".audit/BOOTSTRAP.md: mission, reference adapter, QA environments, CONFIDENCE_MIN",
            ".audit/coverage.md: seeded parity coverage map",
            ".audit/board.md: empty task board",
          ],
        },
        new: {
          tag: "01 · open a finding",
          frequency: "Once per finding: one call opens exactly one finding",
          summary: "Captures a new finding through a structured two-way interview: rejects vague complaints, accepts observable facts.",
          does: "You describe a suspicious behavior difference. A structured interview forces an observable fact: \"shows 3 items, should show 5\" is accepted, \"it's broken\" is rejected. Computes an initial confidence tier and decides whether to isolate the fix in a dedicated git worktree.",
          reads: [".audit/BOOTSTRAP.md: reference system + CONFIDENCE_MIN", ".audit/coverage.md: existing rows, to avoid duplicating a tracked behavior"],
          structure: [
            "Identification: area, severity, who found it",
            "Symptom: the observable difference, in the dev's own words",
            "Reproduction: steps to reproduce on the reference system",
            "Two-way reproduction decision (A/B/C): how the same steps map onto the new system",
            "Hypothesis: an initial guess at root cause, not required to be correct",
            "Confidence tier computation: only tier-0/tier-1 are reachable at creation time",
            "Worktree decision: isolate the fix under .claude/worktrees, or work in the main tree",
          ],
          generates: [
            ".audit/findings/NNN-<slug>/README.md: finding frontmatter + interview transcript",
            ".audit/coverage.md: new row for the affected behavior",
            ".audit/board.md: new open-finding entry",
          ],
        },
        investigate: {
          tag: "02 · root cause",
          frequency: "Once per finding: one investigation.md per finding",
          summary: "Read-only root-cause investigation: never modifies code.",
          does: "Picks one of four investigation approaches, gathers evidence, and writes a synthesis of observed facts plus ranked root-cause hypotheses. Separating \"understand\" from \"fix\" stops a rushed patch from papering over the real cause.",
          reads: [".audit/findings/NNN-<slug>/README.md: the finding to investigate", ".audit/BOOTSTRAP.md: how to reach the reference system read-only"],
          structure: [
            "Approach A: static code analysis of the reference implementation",
            "Approach B: dynamic inspection (DB/API calls against the running reference system)",
            "Approach C: visual reproduction, driving the reference UI and observing",
            "Approach D: combined, mixing the above",
            "Synthesis: observed facts + ranked hypotheses + recommendation + risks",
          ],
          generates: [
            ".audit/findings/NNN-<slug>/investigation.md: root cause + evidence",
            ".audit/board.md: status moved to \"investigated (ready to resolve)\"",
          ],
        },
        resolve: {
          tag: "03 · fix it",
          frequency: "Once per finding: one resolution.md per finding",
          summary: "Implements the fix, pins it with a mandatory characterization test, and writes a machine-readable evidence block.",
          does: "Confirms the plan with the dev, then requires a characterization (golden-master) test BEFORE the implementation: it pins the reference behavior permanently, so it fails if anyone regresses the fix later. Runs CHECK_CMD, TEST_CMD, and the characterization test in that order, never skipping one. A confidence gate blocks the resolution if the evidence tier is below CONFIDENCE_MIN. Creates branch audit/NNN-<slug> and moves the finding to .audit/resolved/, but never commits or pushes.",
          reads: [".audit/findings/NNN-<slug>/investigation.md: root cause to fix", ".audit/BOOTSTRAP.md: CHECK_CMD, TEST_CMD, CONFIDENCE_MIN"],
          structure: [
            "Worktree vs branch mode: isolate in a dedicated worktree, or work on a branch in the main tree",
            "Confirm the fix plan with the dev before touching code",
            "Mandatory characterization test, written first: pins the reference behavior",
            "Implementation",
            "Automated validation: CHECK_CMD → TEST_CMD → characterization test, in order, never skipped",
            "Confidence gate: blocks below CONFIDENCE_MIN",
            "Evidence block: a YAML block with confidence, parity_diff, characterization_test, screenshots, checks, pr_url",
          ],
          generates: [
            ".audit/resolved/NNN-<slug>/resolution.md, fix summary + evidence: YAML block",
            "branch audit/NNN-<slug>: uncommitted, the commit itself stays human",
            ".audit/coverage.md: row set to \"resolved\" (not yet \"verified\")",
          ],
        },
        compare: {
          tag: "04 · objective proof",
          frequency: "Any number of times per finding: re-run whenever fresh proof is needed",
          summary: "Golden-master comparison harness: runs the SAME read-only operation on both systems and diffs the output.",
          does: "Runs the identical read-only operation against the reference and the new system (CLI, DB query, API call, or browser), diffs the two outputs, and writes the result as tier-2 evidence. An empty diff means parity is objectively confirmed, not eyeballed.",
          reads: [".audit/BOOTSTRAP.md: which access mode (CLI/DB/API/browser) reaches each system"],
          structure: [
            "Execution mode A: CLI",
            "Execution mode B: DB query via MCP",
            "Execution mode C: API call",
            "Execution mode D: browser via MCP",
            "Every mode asks for explicit per-side confirmation before running, even though it's read-only",
            "Produces a textual diff and reports the summary",
          ],
          generates: [".audit/findings/NNN-<slug>/refs/parity-<date>.diff: tier-2 evidence"],
        },
        qa: {
          tag: "05 / 07 · human gates",
          frequency: "Once per finding per environment: local first, then once per deploy target",
          summary: "Environment-aware QA bridge between the fix (git) and validation (Notion or a file checklist): local runs before the PR, per-environment runs after.",
          does: "local QA runs BEFORE the PR and is a blocking precondition for /audit-pr. Every other environment (dev/staging/prod) runs AFTER the PR is open, against that environment's deployment. Creates plain-language test cards from the finding's acceptance criteria, then reports approved/rejected status back. Coverage is only promoted to \"verified\" when the target environment's QA is approved AND the PR is merged: the only place that promotion happens.",
          reads: [".audit/resolved/NNN-<slug>/resolution.md: acceptance criteria + PR state", ".audit/BOOTSTRAP.md: configured QA environments"],
          structure: [
            "CREATE mode (first run): build a finding page + N test cards from the acceptance criteria, in plain, non-technical language",
            "STATUS/FEEDBACK mode (later runs), read card statuses: all awaiting / all approved / mixed / rejected",
            "Rejected cards: the fix stays on the SAME branch as an incremental pre-merge fix, never a new post-merge cycle",
            "Coverage promotion, only when qa-<QA_TARGET_ENV>: approved AND the PR state is MERGED",
          ],
          generates: [
            ".audit/findings/NNN-<slug>/qa/checklist.md (file mode): or Notion pages in \"PDD - Findings\" / \"PDD - QA Tests\"",
            "resolution.md: QA URLs/paths recorded for bi-directional traceability",
            ".audit/coverage.md: row promoted to \"verified\" (the only transition that does this)",
          ],
        },
        pr: {
          tag: "06 · evidence dossier",
          frequency: "Once per finding: after local QA approves, before staging QA",
          summary: "Assembles the PR as a self-contained evidence dossier: pushes and opens it only after an explicit human \"yes\".",
          does: "Checks six blocking preconditions: resolution exists, evidence block present, branch exists, dev has committed, confidence ≥ CONFIDENCE_MIN, local QA approved. Only then does it assemble anything. Builds the PR body from README + investigation + resolution: confidence tier, check/test results, characterization test, parity diff, paired screenshots, QA checklist. Then stops at a push gate and waits for an explicit \"yes\".",
          reads: [".audit/resolved/NNN-<slug>/resolution.md, investigation.md, README.md: the full finding history"],
          structure: [
            "Locate the finding and its worktree",
            "Six blocking preconditions, checked in order: stop at the first failure",
            "Gather evidence artifacts (checks, characterization test, parity diff, screenshots)",
            "Assemble the PR body from template-pr-body.md",
            "Present the dossier and STOP at the push gate",
            "git push + gh pr create: only after an explicit human \"yes\"",
            "Record the PR URL back into resolution.md and hand off to /audit-qa",
          ],
          generates: [
            ".audit/resolved/NNN-<slug>/refs/pr-body.md: the assembled dossier",
            "resolution.md, pr_url recorded in the evidence: block",
            "an open GitHub PR: only after explicit human confirmation",
          ],
        },
        status: {
          tag: "read-only dashboard",
          frequency: "On demand, any time: read-only, changes no state",
          summary: "Read-only dashboard of the whole PDD state: coverage, confidence distribution, in-progress work, suggested next actions.",
          does: "Reads BOOTSTRAP.md, coverage.md, board.md, and every finding's frontmatter, then renders parity coverage, a confidence-tier breakdown, findings grouped by area and severity, and a conditional \"suggested next actions\" list. Changes nothing: the always-on terminal equivalent is pdd board --watch.",
          reads: [".audit/BOOTSTRAP.md", ".audit/coverage.md", ".audit/board.md", "every finding's frontmatter"],
          structure: [
            "Parity coverage: verified / total rows from coverage.md",
            "Confidence distribution: tier-0..tier-3 counts across open and resolved findings",
            "By project area / by severity",
            "In progress: from board.md, plus each finding's worktree path",
            "Suggested next actions: conditional on what's open, investigated, below the confidence gate, or has an open PR",
          ],
          generates: ["nothing: purely read-only, reports to chat"],
        },
      },
    },
    cli: {
      title: "PDD CLI",
      intro:
        "Alongside the /audit-* skills that run inside your agent, PDD ships a standalone pdd binary: a zero-dependency dashboard over the same .audit/ directory. It reads state, never writes it: the skills are the only thing that ever changes .audit/.",
      gifCaption:
        "Real recording of `pdd`, generated with VHS from the project's own demo tape: the same terminal you get after running /audit-bootstrap.",
      howItWorksTitle: "How it works",
      howItWorksP1:
        "pdd resolves a project's .audit/ directory by walking up from the current working directory: so it works from any subfolder, not just the project root. It reads BOOTSTRAP.md, coverage.md, board.md, and every finding under .audit/findings/ and .audit/resolved/, then renders them across tabs: Overview, Flow (pipeline per finding), Worktrees, Findings, Active, and Coverage.",
      howItWorksP2:
        "No project setup required beyond having run /audit-bootstrap once: if there's no .audit/ directory yet, pdd just tells you to run it first.",
      commandsTitle: "Commands",
      commands: [
        { cmd: "pdd", description: "Interactive, navigable dashboard (default: same as pdd tui)" },
        { cmd: "pdd tui [path]", description: "Interactive dashboard: ↑/↓ navigate, →/enter expand, Tab switch tabs, q quit" },
        { cmd: "pdd board [path]", description: "Print a static snapshot of the dashboard once" },
        { cmd: "pdd board --watch [path]", description: "Static snapshot, auto-refreshing whenever .audit/ changes" },
        { cmd: "pdd prune [path]", description: "Remove stale/orphaned activity records from .audit/" },
        { cmd: "pdd init [harness...]", description: "Install PDD commands into detected agents (Codex/Cursor/Copilot/Gemini), or the ones given" },
        { cmd: "pdd adapt <harness>", description: "Generate command files for one specific agent from the canonical skills" },
        { cmd: "pdd check", description: "Check whether a newer PDD version is available" },
        { cmd: "pdd update", description: "Update PDD (git clone install) or print how to update the Claude plugin" },
        { cmd: "pdd version", description: "Print the installed version" },
      ],
      tryItTitle: "Try it",
    },
    confidenceTiers: {
      title: "Confidence tiers",
      intro:
        "Every finding carries a confidence tier describing the quality of its evidence. /audit-resolve refuses to close a finding below the configured minimum (default tier-1, tier-2 recommended).",
      rows: [
        { tier: "tier-0", evidence: "textual description only", label: "low" },
        { tier: "tier-1", evidence: "paired screenshots (reference vs new)", label: "medium" },
        { tier: "tier-2", evidence: "automated data-to-data diff (/audit-compare)", label: "high" },
        { tier: "tier-3", evidence: "tier-2 plus a passing characterization test", label: "max" },
      ],
    },
    coverageMap: {
      title: "The coverage map",
      descriptionLead:
        "is a machine-readable table: the single view of how much of the legacy behavior is already verified, and at what confidence.",
      statusLabel: "Status is one of",
      parityFormula: "Parity coverage % = verified / total.",
    },
    auditDirStructure: {
      title: "Generated .audit/ structure",
      intro: "PDD keeps all state in the project under .audit/: it survives across sessions and devs.",
    },
    principles: {
      title: "Principles",
      items: [
        "Forced discipline / gates",
        "State externalized in files (.audit/ is the source of truth, not the model's context)",
        "Small composable commands",
        "Objective evidence over opinion",
        "A human at the gate of every irreversible action",
        "Fast observable feedback",
        "Idempotent state-aware commands",
        "Progressive disclosure (the cycle teaches itself)",
      ],
      note:
        "Inviolable rule: the AI never authors commits. push / gh pr create happen only after an explicit human \"yes\" in the same session. Merge is 100% human and only after QA approves.",
    },
    updating: {
      title: "Updating",
    },
  },
};

export default en;
