import { useI18n } from "../i18n";

function TranslateIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
    </svg>
  );
}

export default function LangToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1.5" aria-label="Language">
      <span className="text-zinc-500">
        <TranslateIcon />
      </span>
      <div className="flex items-center rounded-full bg-zinc-800/70 p-0.5 text-[11px] font-mono font-semibold">
        <button
          onClick={() => setLocale("en")}
          aria-pressed={locale === "en"}
          className={`px-2 py-0.5 rounded-full transition-colors ${
            locale === "en" ? "bg-accent text-[#06131f]" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLocale("pt")}
          aria-pressed={locale === "pt"}
          className={`px-2 py-0.5 rounded-full transition-colors ${
            locale === "pt" ? "bg-accent text-[#06131f]" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          PT
        </button>
      </div>
    </div>
  );
}
