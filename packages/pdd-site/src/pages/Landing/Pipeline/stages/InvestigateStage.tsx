import StageSection from "../StageSection";
import Terminal from "../Terminal";
import { useI18n } from "../../../../i18n";

export default function InvestigateStage() {
  const { t } = useI18n();
  return (
    <StageSection
      stageId="investigate"
      tag={t.pipeline.investigate.tag}
      title="/audit-investigate"
      description={t.pipeline.investigate.description}
      why={t.pipeline.investigate.why}
    >
      <Terminal command="/audit-investigate 007" prompt=">">
        <div className="text-zinc-500 reveal reveal-d1">→ reading legacy/checkout/totals.rb...</div>
        <div className="text-amber-400 reveal reveal-d2">→ cause: rounding applied twice</div>
        <div className="text-emerald-400 reveal reveal-d3">✓ investigation.md saved</div>
      </Terminal>
    </StageSection>
  );
}
