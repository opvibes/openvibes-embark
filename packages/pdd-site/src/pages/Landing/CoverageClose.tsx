import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";

const CLAUDE_COMMAND = `/plugin marketplace add blpsoares/parity-driven-development
claude plugin install pdd@parity-driven-development --scope project`;

const OTHER_AGENTS_COMMAND = `curl -fsSL https://pdd.openvibes.tech/cli | bash -s -- <codex|cursor|copilot|gemini|all>`;

function InstallBlock({ label, command }: { label: string; command: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable in this context, the button simply won't confirm
    }
  }

  return (
    <div className="text-left mb-5">
      <div className="font-mono text-[10px] uppercase tracking-wide text-[#6fa5c7] mb-1.5">{label}</div>
      <div className="relative">
        <pre className="bg-[#0d2438] border border-accent-soft p-4 pr-16 font-mono text-[13px] text-[#dbeaf5] overflow-x-auto">
          {command}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2.5 right-2.5 font-mono text-[10px] uppercase tracking-wide text-[#8fb3cc] border border-accent-soft px-2 py-1 bg-[#0a1b2e]/80 hover:text-accent hover:border-accent transition-colors"
        >
          {copied ? t.coverageClose.copied : t.coverageClose.copy}
        </button>
      </div>
    </div>
  );
}

export default function CoverageClose() {
  const { t } = useI18n();

  return (
    <section id="install" className="relative bg-[#0a1b2e] border-t border-accent-soft overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-accent-soft blur-[120px] opacity-40 pointer-events-none" />
      <div className="relative px-6 py-32 max-w-2xl mx-auto text-center">
        <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#f2f8fc] mb-10 tracking-tight leading-tight">
          {t.coverageClose.title}
        </h2>

        <InstallBlock label={t.coverageClose.claudeLabel} command={CLAUDE_COMMAND} />
        <InstallBlock label={t.coverageClose.otherAgentsLabel} command={OTHER_AGENTS_COMMAND} />

        <div className="flex items-center justify-center gap-5 mt-3">
          <a
            href="https://github.com/blpsoares/parity-driven-development"
            className="inline-block bg-accent text-[#06131f] font-mono font-semibold text-sm px-7 py-3.5 shadow-[0_0_40px_-6px_#5eb8ff] hover:shadow-[0_0_56px_-6px_#5eb8ff] transition-shadow"
          >
            {t.coverageClose.cta}
          </a>
          <Link to="/docs#installation" className="font-mono text-[13px] text-[#8fb3cc] hover:text-accent transition-colors">
            {t.nav.docs} →
          </Link>
        </div>
      </div>
    </section>
  );
}
