import { useI18n } from "../../../i18n";
import CodeBlock from "../CodeBlock";

export default function CliUsage() {
  const { t } = useI18n();
  const commands = t.docs.cli.commands;

  return (
    <section id="cli" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">{t.docs.cli.title}</h2>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mb-6">{t.docs.cli.intro}</p>

      <div className="mb-8">
        <img
          src="/media/pdd-terminal.gif"
          alt="pdd TUI dashboard walking through Overview, Flow, Worktrees, Findings, Active and Coverage tabs"
          className="w-full max-w-2xl border border-accent-soft"
        />
        <p className="text-[#4a7690] text-[12px] mt-2 font-mono">{t.docs.cli.gifCaption}</p>
      </div>

      <h3 className="font-display text-lg font-semibold text-[#f2f8fc] mb-3">{t.docs.cli.howItWorksTitle}</h3>
      <p className="text-[#8fb3cc] text-[14px] leading-relaxed mb-3">{t.docs.cli.howItWorksP1}</p>
      <p className="text-[#8fb3cc] text-[14px] leading-relaxed mb-6">{t.docs.cli.howItWorksP2}</p>

      <h3 className="font-display text-lg font-semibold text-[#f2f8fc] mb-3">{t.docs.cli.commandsTitle}</h3>
      <div className="space-y-2 mb-6">
        {commands.map((c) => (
          <div key={c.cmd} className="flex flex-col sm:flex-row sm:items-baseline gap-x-4 gap-y-0.5 border-b border-accent-soft/50 pb-2">
            <code className="font-mono text-[13px] text-accent shrink-0 sm:w-[240px]">{c.cmd}</code>
            <span className="text-[#8fb3cc] text-[13px]">{c.description}</span>
          </div>
        ))}
      </div>

      <h3 className="font-display text-lg font-semibold text-[#f2f8fc] mb-3">{t.docs.cli.tryItTitle}</h3>
      <CodeBlock>{`bash ~/.claude/plugins/cache/parity-driven-development/pdd/*/scripts/install-cli.sh
pdd            # opens the dashboard once .audit/ exists`}</CodeBlock>
    </section>
  );
}
