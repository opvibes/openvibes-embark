import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useI18n } from "../../i18n";
import DocsSidebar from "./DocsSidebar";
import DocMarkdown from "./DocMarkdown";
import { getDocsNavGroups } from "./docsNav";
import { docBySlug, firstDocSlug } from "./loadDocs";

export default function Docs() {
  const { t } = useI18n();
  const { slug } = useParams<{ slug: string }>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const docsNavGroups = getDocsNavGroups(t);

  const activeSlug = slug ?? firstDocSlug;
  const doc = docBySlug.get(activeSlug);

  // New doc page = scroll back to the top.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeSlug]);

  // Unknown/empty slug falls back to the first get-started page.
  if (!doc) return <Navigate to={`/docs/${firstDocSlug}`} replace />;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 lg:pt-28 pb-20">
      <button
        onClick={() => setDrawerOpen(true)}
        className="lg:hidden flex items-center gap-2 font-mono text-[13px] text-[#8fb3cc] border border-accent-soft px-3 py-2 mb-6"
      >
        <span>☰</span> {t.docs.menuButton}
      </button>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-72 max-w-[85vw] bg-[var(--surface-0)] border-r border-accent-soft h-full overflow-y-auto p-6">
            <button
              onClick={() => setDrawerOpen(false)}
              className="font-mono text-[13px] text-[#8fb3cc] mb-6"
              aria-label={t.docs.closeMenuAria}
            >
              ✕ {t.docs.closeButton}
            </button>
            <DocsSidebar
              groups={docsNavGroups}
              activeSlug={activeSlug}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex gap-12">
        <div className="hidden lg:block sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
          <DocsSidebar groups={docsNavGroups} activeSlug={activeSlug} />
        </div>
        <article className="flex-1 min-w-0">
          <DocMarkdown body={doc.body} docPath={doc.path} />
        </article>
      </div>
    </div>
  );
}
