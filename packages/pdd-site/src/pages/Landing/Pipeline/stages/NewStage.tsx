import StageSection from "../StageSection";
import Terminal from "../Terminal";
import { useI18n } from "../../../../i18n";

export default function NewStage() {
  const { t } = useI18n();
  return (
    <StageSection
      stageId="new"
      tag={t.pipeline.new.tag}
      title="/audit-new"
      description={t.pipeline.new.description}
      why={t.pipeline.new.why}
    >
      <Terminal command='/audit-new "checkout total diverges from legacy"' prompt='>'>
        <div className="text-zinc-500 reveal reveal-d1">→ finding #007 created</div>
        <div className="text-zinc-500 reveal reveal-d2">
          → confidence: <span className="text-red-400">tier-0</span> (textual)
        </div>
        <div className="text-zinc-500 reveal reveal-d3">→ coverage: checkout:total → finding-open</div>
      </Terminal>
    </StageSection>
  );
}
