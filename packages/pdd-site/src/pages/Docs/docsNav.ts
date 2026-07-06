import type { Translations } from "../../i18n";

export interface DocsNavItem {
  id: string;
  label: string;
  children?: DocsNavItem[];
}

export interface DocsNavGroup {
  label: string;
  items: DocsNavItem[];
}

export function getDocsNavGroups(t: Translations): DocsNavGroup[] {
  return [
    {
      label: t.docs.nav.groups.getStarted,
      items: [
        { id: "installation", label: t.docs.nav.items.installation },
        { id: "updating", label: t.docs.nav.items.updating },
      ],
    },
    {
      label: t.docs.nav.groups.concepts,
      items: [
        { id: "principles", label: t.docs.nav.items.principles },
        { id: "confidence-tiers", label: t.docs.nav.items.confidenceTiers },
      ],
    },
    {
      label: t.docs.nav.groups.skills,
      items: [
        {
          id: "skills",
          label: t.docs.nav.items.skillsOverview,
          children: [
            { id: "skill-bootstrap", label: "audit-bootstrap" },
            { id: "skill-new", label: "audit-new" },
            { id: "skill-investigate", label: "audit-investigate" },
            { id: "skill-resolve", label: "audit-resolve" },
            { id: "skill-compare", label: "audit-compare" },
            { id: "skill-qa", label: "audit-qa" },
            { id: "skill-pr", label: "audit-pr" },
            { id: "skill-status", label: "audit-status" },
          ],
        },
      ],
    },
    {
      label: t.docs.nav.groups.reference,
      items: [
        { id: "cli", label: t.docs.nav.items.cli },
        { id: "coverage-map", label: t.docs.nav.items.coverageMap },
        { id: "audit-dir", label: t.docs.nav.items.auditDir },
      ],
    },
  ];
}
