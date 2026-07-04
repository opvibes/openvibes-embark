import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { PIPELINE_STAGES } from "../pages/Landing/Pipeline/stages";
import LangToggle from "./LangToggle";

export default function Nav() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4">
      <div className="max-w-4xl mx-auto rounded-3xl sm:rounded-full border border-zinc-800 bg-[#0a1b2e]/70 backdrop-blur-xl shadow-lg shadow-black/30 overflow-visible">
        <div className="flex items-center justify-between gap-4 px-5 py-2.5">
          <Link to="/" className="text-accent font-bold font-mono text-sm shrink-0">
            ▲ pdd
          </Link>
          <div className="hidden md:flex items-center gap-5 text-[12.5px] font-medium text-zinc-300">
            <a href="/#problem" className="hover:text-accent transition-colors">
              {t.nav.why}
            </a>
            <a href="/#compare" className="hover:text-accent transition-colors">
              {t.nav.compare}
            </a>
            <a href="/#principles" className="hover:text-accent transition-colors">
              {t.nav.principles}
            </a>
            <div className="relative group">
              <a href="/#pipeline" className="hover:text-accent transition-colors">
                {t.nav.pipeline}
              </a>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 hidden group-hover:block group-focus-within:block">
                <div className="w-64 rounded-2xl border border-zinc-800 bg-[#0a1b2e]/95 backdrop-blur-xl shadow-xl shadow-black/40 p-2">
                  {PIPELINE_STAGES.map((stage) => (
                    <a
                      key={stage.id}
                      href={`/#stage-${stage.id}`}
                      className="block rounded-lg px-3 py-1.5 hover:bg-white/5 transition-colors"
                    >
                      <div className="font-mono text-[12px] text-zinc-200">{stage.command}</div>
                      <div className="text-[11px] text-zinc-500">{stage.tag}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <a href="/#tiers" className="hover:text-accent transition-colors">
              {t.nav.tiers}
            </a>
            <a href="/#install" className="hover:text-accent transition-colors">
              {t.nav.install}
            </a>
            <Link to="/docs" className="hover:text-accent transition-colors">
              {t.nav.docs}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/blpsoares/parity-driven-development"
              className="hidden md:inline-block text-[13px] font-medium text-zinc-300 hover:text-accent transition-colors"
            >
              {t.nav.github}
            </a>
            <div className="w-px h-5 bg-zinc-800 hidden md:block" />
            <div className="rounded-full bg-zinc-900 px-2.5 py-1">
              <LangToggle />
            </div>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={t.nav.toggleMenu}
              aria-expanded={menuOpen}
              className="md:hidden flex flex-col gap-1 p-1.5 -mr-1"
            >
              <span className={`block w-4 h-px bg-zinc-300 transition-transform ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`block w-4 h-px bg-zinc-300 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-4 h-px bg-zinc-300 transition-transform ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col gap-1 px-5 pb-4 pt-1 border-t border-white/10 text-[14px] font-medium text-zinc-300 max-h-[70vh] overflow-y-auto">
            <a href="/#problem" onClick={() => setMenuOpen(false)} className="py-2 hover:text-accent transition-colors">
              {t.nav.why}
            </a>
            <a href="/#compare" onClick={() => setMenuOpen(false)} className="py-2 hover:text-accent transition-colors">
              {t.nav.compare}
            </a>
            <a href="/#principles" onClick={() => setMenuOpen(false)} className="py-2 hover:text-accent transition-colors">
              {t.nav.principles}
            </a>
            <a href="/#pipeline" onClick={() => setMenuOpen(false)} className="py-2 hover:text-accent transition-colors">
              {t.nav.pipeline}
            </a>
            <div className="pl-3 flex flex-col gap-0.5 border-l border-white/10 ml-1 mb-1">
              {PIPELINE_STAGES.map((stage) => (
                <a
                  key={stage.id}
                  href={`/#stage-${stage.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="py-1 text-[12px] font-mono text-zinc-400 hover:text-accent transition-colors"
                >
                  {stage.command}
                </a>
              ))}
            </div>
            <a href="/#tiers" onClick={() => setMenuOpen(false)} className="py-2 hover:text-accent transition-colors">
              {t.nav.tiers}
            </a>
            <a href="/#install" onClick={() => setMenuOpen(false)} className="py-2 hover:text-accent transition-colors">
              {t.nav.install}
            </a>
            <Link to="/docs" onClick={() => setMenuOpen(false)} className="py-2 hover:text-accent transition-colors">
              {t.nav.docs}
            </Link>
            <a
              href="https://github.com/blpsoares/parity-driven-development"
              onClick={() => setMenuOpen(false)}
              className="py-2 hover:text-accent transition-colors"
            >
              {t.nav.github}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
