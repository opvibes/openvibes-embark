import { useI18n } from "../../i18n";

export default function ProblemFraming() {
  const { t } = useI18n();

  return (
    <section id="problem" className="bg-[#0d2438] border-y border-accent-soft scroll-mt-24">
      <div className="px-6 py-28 max-w-3xl mx-auto text-center">
        <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#f2f8fc] mb-6 tracking-tight leading-tight">
          {t.problem.title}
        </h2>
        <p className="text-[#8fb3cc] text-[18px] leading-relaxed">{t.problem.body}</p>
      </div>
    </section>
  );
}
