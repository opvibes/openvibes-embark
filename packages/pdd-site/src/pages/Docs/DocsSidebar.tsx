import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import type { DocsNavGroup, DocsNavItem } from "./docsNav";

interface DocsSidebarProps {
  groups: DocsNavGroup[];
  activeSlug?: string;
  onNavigate?: () => void;
}

function itemMatches(item: DocsNavItem, q: string): boolean {
  return item.label.toLowerCase().includes(q);
}

function filterItems(items: DocsNavItem[], q: string): DocsNavItem[] {
  if (!q) return items;
  return items.filter((item) => itemMatches(item, q));
}

export default function DocsSidebar({ groups, activeSlug, onNavigate }: DocsSidebarProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = groups
    .map((group) => ({ ...group, items: filterItems(group.items, q) }))
    .filter((group) => group.items.length > 0);

  return (
    <nav className="w-full lg:w-56 shrink-0 text-sm font-mono">
      <div className="relative mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.docs.sidebar.searchPlaceholder}
          className="w-full bg-[var(--surface-1)] border border-accent-soft text-[#dbeaf5] placeholder:text-[#4a7690] text-[13px] px-3 py-2 focus:outline-none focus:border-accent"
        />
      </div>
      <div className="space-y-6">
        {filtered.map((group) => (
          <div key={group.label}>
            <div className="text-[10.5px] uppercase tracking-[.15em] text-[#4a7690] mb-2">{group.label}</div>
            <div className="space-y-1.5 border-l border-accent-soft pl-3">
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  to={`/docs/${item.slug}`}
                  onClick={onNavigate}
                  className={`block transition-colors ${
                    item.slug === activeSlug ? "text-accent" : "text-[#8fb3cc] hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-[#4a7690] text-[13px]">{t.docs.sidebar.noResults(query)}</div>
        )}
      </div>
    </nav>
  );
}
