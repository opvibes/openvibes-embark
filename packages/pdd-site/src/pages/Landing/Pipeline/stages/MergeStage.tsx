import StageSection from "../StageSection";
import Terminal from "../Terminal";
import { useI18n } from "../../../../i18n";

export default function MergeStage() {
  const { t } = useI18n();
  return (
    <StageSection
      stageId="merge"
      tag={t.pipeline.merge.tag}
      title="merge"
      description={t.pipeline.merge.description}
      why={t.pipeline.merge.why}
    >
      <Terminal command="gh pr merge 007 --squash">
        <div className="reveal reveal-d1 pt-1">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-zinc-500 to-accent w-[68%]" />
          </div>
          <div className="mt-2 text-zinc-500">parity coverage: 62% → 68%</div>
        </div>
        <div className="text-emerald-400 reveal reveal-d2">✓ checkout: total → verified · tier-3 · #007</div>
      </Terminal>
    </StageSection>
  );
}
