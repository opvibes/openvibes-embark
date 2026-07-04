import { useI18n } from "../../../i18n";

const TIER_COLORS: Record<string, string> = {
  "tier-0": "text-red-400",
  "tier-1": "text-yellow-400",
  "tier-2": "text-fuchsia-400",
  "tier-3": "text-emerald-400",
};

export default function ConfidenceTiers() {
  const { t } = useI18n();

  return (
    <section id="confidence-tiers" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">{t.docs.confidenceTiers.title}</h2>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mb-4">{t.docs.confidenceTiers.intro}</p>
      <div className="divide-y divide-accent-soft border-y border-accent-soft font-mono text-[13px]">
        {t.docs.confidenceTiers.rows.map((row) => {
          const color = TIER_COLORS[row.tier] ?? "text-[#8fb3cc]";
          return (
            <div key={row.tier} className="py-2.5 flex flex-col sm:flex-row gap-1.5 sm:gap-4">
              <span className={`sm:w-16 ${color}`}>{row.tier}</span>
              <span className="flex-1 text-[#8fb3cc]">{row.evidence}</span>
              <span className={color}>{row.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
