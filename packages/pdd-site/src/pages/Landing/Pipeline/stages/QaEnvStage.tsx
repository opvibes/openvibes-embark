import StageSection from "../StageSection";
import Terminal from "../Terminal";
import { useI18n } from "../../../../i18n";

export default function QaEnvStage() {
  const { t } = useI18n();
  return (
    <StageSection
      stageId="qa-env"
      tag={t.pipeline["qa-env"].tag}
      title="/audit-qa staging"
      description={t.pipeline["qa-env"].description}
      why={t.pipeline["qa-env"].why}
    >
      <Terminal command="/audit-qa 007 staging" prompt=">">
        <div className="text-emerald-400 reveal reveal-d1">✓ qa-staging: approved</div>
        <div className="text-zinc-500 reveal reveal-d2">
          → coverage: checkout:total → <span className="text-emerald-400">tier-3</span>
        </div>
      </Terminal>
    </StageSection>
  );
}
