import { useI18n } from "../../../i18n";
import CodeBlock from "../CodeBlock";

export default function CoverageMap() {
  const { t } = useI18n();

  return (
    <section id="coverage-map" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">{t.docs.coverageMap.title}</h2>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mb-4">
        <code>.audit/coverage.md</code> {t.docs.coverageMap.descriptionLead} {t.docs.coverageMap.statusLabel}{" "}
        <code>not-started</code> · <code>finding-open</code> · <code>resolved</code> ·{" "}
        <code>verified</code>. {t.docs.coverageMap.parityFormula}
      </p>
      <CodeBlock>
        {`| Behavior / Area          | Reference case | Status        | Tier   | Finding |\n|--------------------------|----------------|---------------|--------|---------|\n| checkout: total          | order #123     | verified      | tier-3 | 007     |\n| login: lock after 3 fails| test user      | finding-open  | tier-1 | 012     |\n| export CSV               | n/a            | not-started   | n/a    | n/a     |`}
      </CodeBlock>
    </section>
  );
}
