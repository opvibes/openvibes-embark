import { useI18n } from "../../../i18n";
import CodeBlock from "../CodeBlock";

export default function Installation() {
  const { t } = useI18n();

  return (
    <section id="installation" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">{t.docs.installation.title}</h2>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mb-4">
        {t.docs.installation.introPrefix} <em>{t.docs.installation.introEmphasis1}</em> {t.docs.installation.introMiddle}{" "}
        <em>{t.docs.installation.introEmphasis2}</em> {t.docs.installation.introSuffix}
      </p>
      <CodeBlock>
        {`/plugin marketplace add blpsoares/parity-driven-development\nclaude plugin install pdd@parity-driven-development --scope project`}
      </CodeBlock>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mt-4 mb-2">{t.docs.installation.otherAgentsIntro}</p>
      <CodeBlock>
        {`curl -fsSL https://pdd.openvibes.tech/cli | bash -s -- <codex|cursor|copilot|gemini|all>`}
      </CodeBlock>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mt-4 mb-2">
        {t.docs.installation.afterInstallPrefix} <code>pdd init</code> {t.docs.installation.afterInstallSuffix}
      </p>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mt-4">
        {t.docs.installation.methodNotePrefix}{" "}
        <strong className="text-[#dbeaf5]">{t.docs.installation.runtimeNote}</strong> {t.docs.installation.methodNoteSuffix}
      </p>
      <div className="mt-5 border-l-2 border-accent pl-4">
        <p className="text-[#dbeaf5] text-[14px]">
          {t.docs.installation.quickstartPrefix}{" "}
          <a
            href="https://github.com/blpsoares/parity-driven-development/blob/main/QUICKSTART.md"
            className="text-accent"
          >
            {t.docs.installation.quickstartLinkLabel}
          </a>{" "}
          {t.docs.installation.quickstartSuffix}
        </p>
      </div>
    </section>
  );
}
