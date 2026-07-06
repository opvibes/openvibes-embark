import type { Translations } from "../../i18n";
import { docsByGroup, type DocGroup } from "./loadDocs";

export interface DocsNavItem {
  slug: string;
  label: string;
}

export interface DocsNavGroup {
  label: string;
  items: DocsNavItem[];
}

// Group headings are localized chrome; item labels come from each doc's
// (English) frontmatter title — doc bodies are single-sourced in English.
function groupLabel(t: Translations, group: DocGroup): string {
  switch (group) {
    case "get-started":
      return t.docs.nav.groups.getStarted;
    case "concepts":
      return t.docs.nav.groups.concepts;
    case "guides":
      return t.docs.nav.groups.guides;
    case "reference":
      return t.docs.nav.groups.reference;
  }
}

export function getDocsNavGroups(t: Translations): DocsNavGroup[] {
  return docsByGroup().map(({ group, pages }) => ({
    label: groupLabel(t, group),
    items: pages.map((p) => ({ slug: p.slug, label: p.title })),
  }));
}
