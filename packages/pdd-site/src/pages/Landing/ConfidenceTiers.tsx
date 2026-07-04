import { useI18n } from "../../i18n";

const TIER_COLOR = ["text-red-400", "text-yellow-400", "text-fuchsia-400", "text-emerald-400"];
const TIER_BORDER = ["border-red-400/30", "border-yellow-400/30", "border-fuchsia-400/30", "border-emerald-400/30"];

export default function ConfidenceTiers() {
  const { t } = useI18n();

  return (
    <section id="tiers" className="bg-[#0d2438] border-y border-accent-soft scroll-mt-24">
      <div className="px-6 py-28 max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#f2f8fc] mb-4 tracking-tight leading-tight">
            {t.tiers.title}
          </h2>
          <p className="text-[#8fb3cc] text-[16px] max-w-xl mx-auto">{t.tiers.body}</p>
        </div>
        <div className="font-mono border-y border-accent-soft divide-y divide-accent-soft">
          {t.tiers.rows.map((row, i) => (
            <div key={row.tier} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-4">
              <span className={`sm:w-16 shrink-0 font-semibold ${TIER_COLOR[i]}`}>{row.tier}</span>
              <span className="flex-1 text-zinc-400 text-[14px]">{row.evidence}</span>
              <span className={`self-start sm:self-auto shrink-0 border rounded-full px-3 py-1 text-[11px] uppercase tracking-wide ${TIER_COLOR[i]} ${TIER_BORDER[i]}`}>
                {row.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
