import { useI18n } from "../../i18n";

export default function Principles() {
  const { t } = useI18n();

  return (
    <section id="principles" className="px-6 py-28 max-w-4xl mx-auto scroll-mt-24">
      <div className="text-center mb-14">
        <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#f2f8fc] mb-4 tracking-tight leading-tight">
          {t.principles.title}
        </h2>
        <p className="text-[#8fb3cc] text-[16px] max-w-xl mx-auto">{t.principles.body}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-px bg-accent-soft overflow-hidden border border-accent-soft">
        {t.principles.items.map((item, i) => (
          <div key={item} className="bg-[#0a1b2e] p-6 flex gap-4">
            <span className="text-accent font-mono text-sm shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-[#dbeaf5] text-[14.5px] leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
