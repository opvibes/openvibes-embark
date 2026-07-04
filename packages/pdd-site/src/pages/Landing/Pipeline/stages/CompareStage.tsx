import StageSection from "../StageSection";
import Terminal from "../Terminal";
import { useI18n } from "../../../../i18n";

export default function CompareStage() {
  const { t } = useI18n();
  return (
    <StageSection
      stageId="compare"
      tag={t.pipeline.compare.tag}
      title="/audit-compare"
      description={t.pipeline.compare.description}
      why={t.pipeline.compare.why}
    >
      <Terminal command="/audit-compare 007" prompt=">">
        <div className="text-red-400 reveal reveal-d1">− legacy: total = 129.90</div>
        <div className="text-emerald-400 reveal reveal-d2">+ new: total = 129.90</div>
        <div className="text-zinc-500 reveal reveal-d3">
          → <span className="text-orange-400">tier-2</span> · automated diff ✓
        </div>
      </Terminal>
    </StageSection>
  );
}
