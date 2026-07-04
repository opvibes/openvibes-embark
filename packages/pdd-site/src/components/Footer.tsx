import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

function GithubIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.22.7.83.58C20.56 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.11 20.45H3.55V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-black border-t border-white/[0.06] px-6 py-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div>
          <div className="text-accent font-bold font-mono text-sm mb-3">▲ pdd</div>
          <p className="text-zinc-500 text-[13px] max-w-xs leading-relaxed">{t.footer.tagline}</p>
          <p className="text-zinc-600 text-[12px] mt-4 font-mono">
            © {new Date().getFullYear()} Bryan Soares. {t.footer.rights}
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <div className="text-zinc-300 text-[12px] font-semibold uppercase tracking-wider mb-3">
              {t.footer.siteLabel}
            </div>
            <div className="flex flex-col gap-2 text-[13.5px] text-zinc-500">
              <a href="/#problem" className="hover:text-accent transition-colors">
                {t.nav.why}
              </a>
              <a href="/#pipeline" className="hover:text-accent transition-colors">
                {t.nav.pipeline}
              </a>
              <Link to="/docs" className="hover:text-accent transition-colors">
                {t.nav.docs}
              </Link>
            </div>
          </div>

          <div>
            <div className="text-zinc-300 text-[12px] font-semibold uppercase tracking-wider mb-3">
              {t.footer.connectLabel}
            </div>
            <a
              href="https://github.com/blpsoares/parity-driven-development"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-mono text-zinc-400 hover:text-accent transition-colors mb-3"
            >
              ★ {t.footer.starGithub}
            </a>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/blpsoares/parity-driven-development"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-accent transition-colors"
                aria-label="PDD on GitHub"
              >
                <GithubIcon />
              </a>
              <a
                href="https://linkedin.com/in/blpsoares"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </a>
              <a
                href="mailto:bryanluccas@hotmail.com"
                className="text-zinc-500 hover:text-accent transition-colors"
                aria-label="Email"
              >
                <MailIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
