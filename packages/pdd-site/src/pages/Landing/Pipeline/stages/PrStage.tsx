import StageSection from "../StageSection";
import Terminal from "../Terminal";
import { useI18n } from "../../../../i18n";

export default function PrStage() {
  const { t } = useI18n();
  return (
    <StageSection
      stageId="pr"
      tag={t.pipeline.pr.tag}
      title="/audit-pr"
      description={t.pipeline.pr.description}
      why={t.pipeline.pr.why}
    >
      <Terminal command="/audit-pr 007" prompt=">">
        <div className="text-zinc-500 reveal reveal-d1">→ dossier ready: symptom → cause → fix → diff → qa</div>
        <div className="text-orange-400 reveal reveal-d2">? confirm push + gh pr create? (y/n)</div>
        <div className="text-emerald-400 reveal reveal-d3">✓ human: y</div>
      </Terminal>
    </StageSection>
  );
}
