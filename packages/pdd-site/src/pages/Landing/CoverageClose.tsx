import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import InstallList from "./install/InstallList";

export default function CoverageClose() {
  const { t } = useI18n();

  return (
    <section id="install" className="relative bg-[var(--surface-0)] border-t border-accent-soft overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-accent-soft blur-[120px] opacity-40 pointer-events-none" />
      <div className="relative px-6 py-32 max-w-4xl mx-auto text-center">
        <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#f2f8fc] mb-4 tracking-tight leading-tight">
          {t.coverageClose.title}
        </h2>
        <p className="font-mono text-[13px] text-[#8fb3cc] mb-10">{t.coverageClose.pickAgent}</p>

        <InstallList />

        <div className="flex items-center justify-center gap-5 mt-10">
          <a
            href="https://github.com/blpsoares/parity-driven-development"
            className="inline-block bg-accent text-[#06131f] font-mono font-semibold text-sm px-7 py-3.5 rounded-lg shadow-[0_0_40px_-6px_#5eb8ff] hover:shadow-[0_0_56px_-6px_#5eb8ff] transition-shadow"
          >
            {t.coverageClose.cta}
          </a>
          <Link to="/docs#installation" className="font-mono text-[13px] text-[#8fb3cc] hover:text-accent transition-colors">
            {t.nav.docs} →
          </Link>
        </div>
      </div>
    </section>
  );
}
