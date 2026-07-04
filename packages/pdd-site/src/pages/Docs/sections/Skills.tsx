import { useI18n } from "../../../i18n";

const REPO = "https://github.com/blpsoares/parity-driven-development/blob/main";

interface SkillMeta {
  id: string;
  key: "bootstrap" | "new" | "investigate" | "resolve" | "compare" | "qa" | "pr" | "status";
  command: string;
  skillPath: string;
  header: string;
  bodyPreview: string;
  related: Array<{ id: string; label: string }>;
}

const SKILLS: SkillMeta[] = [
  {
    id: "skill-bootstrap",
    key: "bootstrap",
    command: "/audit-bootstrap",
    skillPath: "skills/audit-bootstrap/SKILL.md",
    header: `---
name: "audit-bootstrap"
description: "Structured interview that fills .audit/BOOTSTRAP.md: the operational context read by EVERY new Claude session before any PDD audit work. Runs once during project setup. Also seeds .audit/coverage.md, the parity coverage map."
argument-hint: "(optional) 'redo' to overwrite an existing bootstrap"
user-invocable: true
disable-model-invocation: true
---`,
    bodyPreview: `## User Input

\`\`\`text
$ARGUMENTS
\`\`\`

## Interaction language
…`,
    related: [
      { id: "skill-new", label: "audit-new" },
      { id: "skill-status", label: "audit-status" },
    ],
  },
  {
    id: "skill-new",
    key: "new",
    command: "/audit-new <description>",
    skillPath: "skills/audit-new/SKILL.md",
    header: `---
name: "audit-new"
description: "Capture a new finding (a divergence, bug, or incorrect behavior vs the reference system) through a structured two-way interview between the dev and Claude. Produces .audit/findings/NNN-<slug>/README.md with forced discipline: vague answers are rejected. Computes an initial confidence tier, updates .audit/coverage.md, and optionally isolates the work in a git worktree."
argument-hint: "(optional) short description of the problem; if empty, starts the interview from scratch"
user-invocable: true
disable-model-invocation: true
---`,
    bodyPreview: `## User Input

\`\`\`text
$ARGUMENTS
\`\`\`

## Language
…`,
    related: [
      { id: "skill-bootstrap", label: "audit-bootstrap" },
      { id: "skill-investigate", label: "audit-investigate" },
    ],
  },
  {
    id: "skill-investigate",
    key: "investigate",
    command: "/audit-investigate NNN",
    skillPath: "skills/audit-investigate/SKILL.md",
    header: `---
name: "audit-investigate"
description: "Investigates an existing finding: decides the approach (static/dynamic/visual/combined) in conversation with the dev, executes it, and documents findings in investigation.md. Does NOT modify code, it only understands and diagnoses."
argument-hint: "finding ID (e.g. 007 or 007-checkout-wrong-total)"
user-invocable: true
disable-model-invocation: true
---`,
    bodyPreview: `## User Input

\`\`\`text
$ARGUMENTS
\`\`\`

## Context
…`,
    related: [
      { id: "skill-new", label: "audit-new" },
      { id: "skill-resolve", label: "audit-resolve" },
    ],
  },
  {
    id: "skill-resolve",
    key: "resolve",
    command: "/audit-resolve NNN",
    skillPath: "skills/audit-resolve/SKILL.md",
    header: `---
name: "audit-resolve"
description: "Implements the fix for an already-investigated finding, pins the reference behavior with a characterization test, validates parity against the reference system, writes resolution.md with a machine-readable evidence block, and moves the folder to .audit/resolved/. NEVER commits or pushes, only suggests the command to the dev."
argument-hint: "Finding ID (e.g. 007 or 007-checkout-wrong-total)"
user-invocable: true
disable-model-invocation: true
---`,
    bodyPreview: `## User Input

\`\`\`text
$ARGUMENTS
\`\`\`

## Language
…`,
    related: [
      { id: "skill-investigate", label: "audit-investigate" },
      { id: "skill-compare", label: "audit-compare" },
      { id: "skill-pr", label: "audit-pr" },
    ],
  },
  {
    id: "skill-compare",
    key: "compare",
    command: "/audit-compare NNN",
    skillPath: "skills/audit-compare/SKILL.md",
    header: `---
name: "audit-compare"
description: "Golden-master comparison harness. Runs the SAME read-only operation on both the reference (legacy) and new systems using the access configured in BOOTSTRAP (CLI, DB query via MCP, API call, or browser navigation via MCP), diffs the outputs, and writes refs/parity-<date>.diff as Tier-2 evidence. An empty diff means parity is objectively confirmed."
argument-hint: "finding id (+ optional reference case, e.g. 007 order#123)"
user-invocable: true
disable-model-invocation: true
---`,
    bodyPreview: `## User Input

\`\`\`text
$ARGUMENTS
\`\`\`

## Context
…`,
    related: [
      { id: "skill-resolve", label: "audit-resolve" },
      { id: "skill-pr", label: "audit-pr" },
    ],
  },
  {
    id: "skill-qa",
    key: "qa",
    command: "/audit-qa NNN <env>",
    skillPath: "skills/audit-qa/SKILL.md",
    header: `---
name: "audit-qa"
description: "Environment-aware QA bridge between the fix (git) and validation (Notion or a file checklist). QA runs in phases: LOCAL (on localhost, BEFORE the PR, blocks /audit-pr) and per deployment ENVIRONMENT (dev/staging/prod, AFTER the PR/deploy). Tracks per-environment status; promotes coverage to \`verified\` only when the target-environment QA is approved AND the PR is merged."
argument-hint: "finding ID + environment (e.g. 007 local | 007 staging | 007 prod)"
user-invocable: true
disable-model-invocation: true
---`,
    bodyPreview: `## User Input

\`\`\`text
$ARGUMENTS
\`\`\`

## Context
…`,
    related: [
      { id: "skill-resolve", label: "audit-resolve" },
      { id: "skill-pr", label: "audit-pr" },
      { id: "skill-status", label: "audit-status" },
    ],
  },
  {
    id: "skill-pr",
    key: "pr",
    command: "/audit-pr NNN",
    skillPath: "skills/audit-pr/SKILL.md",
    header: `---
name: "audit-pr"
description: "Assembles the pull request for a resolved finding as an EVIDENCE DOSSIER (symptom→cause→fix, confidence tier, check/test results, characterization test, parity diff, paired screenshots, QA checklist) and opens it, but ONLY pushes and runs gh pr create after an explicit human yes. Never authors commits, never pushes autonomously."
argument-hint: "finding ID (e.g. 007 or 007-checkout-wrong-total)"
user-invocable: true
disable-model-invocation: true
---`,
    bodyPreview: `## User Input

\`\`\`text
$ARGUMENTS
\`\`\`

## Context
…`,
    related: [
      { id: "skill-resolve", label: "audit-resolve" },
      { id: "skill-compare", label: "audit-compare" },
      { id: "skill-qa", label: "audit-qa" },
    ],
  },
  {
    id: "skill-status",
    key: "status",
    command: "/audit-status [detailed | area:<name> | severity:<level>]",
    skillPath: "skills/audit-status/SKILL.md",
    header: `---
name: "audit-status"
description: "Read-only dashboard of the PDD state in the project. Shows open, in-investigation, and resolved findings grouped by area and severity, plus parity coverage, confidence distribution, in-progress tasks, and suggested next actions. Useful at the start of a session to know where to pick up."
argument-hint: "(optional) 'detailed' to list every finding; 'area:<name>' to filter by area; 'severity:<level>' to filter by severity"
user-invocable: true
disable-model-invocation: true
---`,
    bodyPreview: `## User Input

\`\`\`text
$ARGUMENTS
\`\`\`
…`,
    related: [
      { id: "skill-bootstrap", label: "audit-bootstrap" },
      { id: "skill-new", label: "audit-new" },
    ],
  },
];

export default function Skills() {
  const { t } = useI18n();
  const items = t.docs.skills.items;

  return (
    <section id="skills" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">{t.docs.skills.title}</h2>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mb-6">{t.docs.skills.intro}</p>
      <div className="space-y-10">
        {SKILLS.map((skill) => {
          const content = items[skill.key];
          return (
            <article key={skill.id} id={skill.id} className="scroll-mt-24 border border-accent-soft p-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                <h3 className="font-mono text-accent text-[15px]">{skill.command}</h3>
                <span className="font-mono text-[10px] uppercase tracking-wide text-[#8fb3cc] border border-accent-soft px-1.5 py-0.5">
                  {content.tag}
                </span>
              </div>

              <div className="inline-block font-mono text-[10.5px] uppercase tracking-wide text-amber-300 border border-amber-400/30 bg-amber-400/5 px-2 py-1 mb-3">
                ⟳ {content.frequency}
              </div>

              <p className="text-[#dbeaf5] text-[14px] mb-3">{content.summary}</p>
              <p className="text-[#8fb3cc] text-[14px] leading-relaxed mb-4">{content.does}</p>

              <div className="text-[11px] uppercase tracking-wide text-[#8fb3cc] mb-1.5">{t.docs.skills.labels.skillMd}</div>
              <pre className="bg-[#0d2438] border border-accent-soft p-4 font-mono text-[11.5px] text-[#8fb3cc] leading-relaxed overflow-x-auto overflow-y-hidden mb-1 whitespace-pre-wrap">
                {skill.header}
                {"\n\n"}
                {skill.bodyPreview}
              </pre>
              <a
                href={`${REPO}/${skill.skillPath}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block font-mono text-[12px] text-accent hover:underline mb-4"
              >
                {t.docs.skills.readFullSkill}
              </a>

              <div className="text-[11px] uppercase tracking-wide text-[#8fb3cc] mb-1.5">{t.docs.skills.labels.reads}</div>
              <ul className="space-y-1 mb-4">
                {content.reads.map((item) => (
                  <li key={item} className="font-mono text-[12.5px] text-[#8fb3cc]">
                    {item}
                  </li>
                ))}
              </ul>

              <div className="text-[11px] uppercase tracking-wide text-[#8fb3cc] mb-1.5">{t.docs.skills.labels.structure}</div>
              <ol className="space-y-1 mb-4 list-decimal list-inside">
                {content.structure.map((step) => (
                  <li key={step} className="text-[#8fb3cc] text-[13px] leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>

              <div className="text-[11px] uppercase tracking-wide text-[#8fb3cc] mb-1.5">{t.docs.skills.labels.generates}</div>
              <ul className="space-y-1 mb-4">
                {content.generates.map((item) => (
                  <li key={item} className="font-mono text-[12.5px] text-[#dbeaf5]">
                    {item}
                  </li>
                ))}
              </ul>

              {skill.related.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-accent-soft">
                  <span className="text-[11px] uppercase tracking-wide text-[#8fb3cc]">{t.docs.skills.labels.related}</span>
                  {skill.related.map((r) => (
                    <a
                      key={r.id}
                      href={`#${r.id}`}
                      className="font-mono text-[12px] text-accent border border-accent-soft px-1.5 py-0.5 hover:border-accent transition-colors"
                    >
                      {r.label}
                    </a>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
