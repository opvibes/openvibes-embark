import StageSection from "../StageSection";
import Terminal from "../Terminal";
import { useI18n } from "../../../../i18n";

export default function QaLocalStage() {
  const { t } = useI18n();
  return (
    <StageSection
      stageId="qa-local"
      tag={t.pipeline["qa-local"].tag}
      title="/audit-qa local"
      description={t.pipeline["qa-local"].description}
      why={t.pipeline["qa-local"].why}
    >
      <Terminal command="/audit-qa 007 local" prompt=">">
        <div className="text-zinc-300 reveal reveal-d1">☑ checkout renders the correct total</div>
        <div className="text-zinc-300 reveal reveal-d2">☑ no visual regression</div>
        <div className="text-emerald-400 reveal reveal-d3">✓ qa-local: approved</div>
      </Terminal>
    </StageSection>
  );
}
