import { useI18n } from "../i18n";

export default function LangToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      <button
        onClick={() => setLocale("en")}
        className={locale === "en" ? "text-accent" : "text-zinc-500"}
      >
        EN
      </button>
      <span className="text-zinc-700">/</span>
      <button
        onClick={() => setLocale("pt")}
        className={locale === "pt" ? "text-accent" : "text-zinc-500"}
      >
        PT
      </button>
    </div>
  );
}
