import { useI18n } from "../../../i18n";

export default function Principles() {
  const { t } = useI18n();

  return (
    <section id="principles" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">{t.docs.principles.title}</h2>
      <ul className="space-y-2 text-[#8fb3cc] text-[15px] list-disc list-inside">
        {t.docs.principles.items.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <p className="text-accent font-mono text-[13px] mt-6 border-l-2 border-accent pl-3">{t.docs.principles.note}</p>
    </section>
  );
}
