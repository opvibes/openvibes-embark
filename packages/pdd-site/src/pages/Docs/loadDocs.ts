// loadDocs.ts — single source of truth for the /docs section.
//
// Loads every markdown file mirrored into src/content/docs (see scripts/sync-docs.mjs
// for how that copy is kept in sync with the canonical parity-driven-development repo),
// parses YAML frontmatter with gray-matter, and derives the ordered page list, the
// slug lookup, and the sidebar navigation — all at module-eval time, so the rest of
// the app just imports plain data.

import { Buffer } from "buffer";
import matter from "gray-matter";

// gray-matter calls Buffer.isBuffer() even for string input; Buffer is not a browser
// global, so provide it before any matter() call runs.
const g = globalThis as typeof globalThis & { Buffer?: typeof Buffer };
if (typeof g.Buffer === "undefined") g.Buffer = Buffer;

// Group display order (get-started → concepts → guides → reference).
export const GROUP_ORDER = ["get-started", "concepts", "guides", "reference"] as const;
export type DocGroup = (typeof GROUP_ORDER)[number];

const GITHUB_BLOB = "https://github.com/blpsoares/parity-driven-development/blob/main";

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  group: DocGroup;
  order: number;
  /** Path relative to the docs root, e.g. "concepts/what-is-pdd.md". */
  path: string;
  /** Markdown body with frontmatter stripped. */
  body: string;
}

// Eager raw import of every synced doc. Keys look like
// "../../content/docs/concepts/what-is-pdd.md".
const rawDocs = import.meta.glob("../../content/docs/**/*.md", {
  as: "raw",
  eager: true,
}) as Record<string, string>;

function toDocsRelPath(globKey: string): string {
  const marker = "content/docs/";
  const i = globKey.indexOf(marker);
  return i === -1 ? globKey : globKey.slice(i + marker.length);
}

function isDocGroup(value: unknown): value is DocGroup {
  return typeof value === "string" && (GROUP_ORDER as readonly string[]).includes(value);
}

function parseAll(): DocPage[] {
  const pages: DocPage[] = [];
  for (const [key, raw] of Object.entries(rawDocs)) {
    const path = toDocsRelPath(key);
    const { data, content } = matter(raw);
    const group = data.group;
    const slug = data.slug;
    // Skip anything without the doc frontmatter contract (e.g. internal notes).
    if (!isDocGroup(group) || typeof slug !== "string" || slug.length === 0) continue;
    pages.push({
      slug,
      title: typeof data.title === "string" ? data.title : slug,
      description: typeof data.description === "string" ? data.description : "",
      group,
      order: typeof data.order === "number" ? data.order : 999,
      path,
      body: content.trim(),
    });
  }
  pages.sort((a, b) => {
    const ga = GROUP_ORDER.indexOf(a.group);
    const gb = GROUP_ORDER.indexOf(b.group);
    if (ga !== gb) return ga - gb;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
  return pages;
}

export const docs: DocPage[] = parseAll();

export const docBySlug: Map<string, DocPage> = new Map(docs.map((d) => [d.slug, d]));

const pathToSlug: Map<string, string> = new Map(docs.map((d) => [d.path, d.slug]));

/** First page of the first group — the target of the bare /docs redirect. */
export const firstDocSlug: string = docs[0]?.slug ?? "";

/** Grouped, ordered pages for building the sidebar. */
export function docsByGroup(): { group: DocGroup; pages: DocPage[] }[] {
  return GROUP_ORDER.map((group) => ({
    group,
    pages: docs.filter((d) => d.group === group),
  })).filter((g) => g.pages.length > 0);
}

// --- Cross-link rewriting ---------------------------------------------------

function normalizeSegments(parts: string[]): string[] {
  const out: string[] = [];
  for (const part of parts) {
    if (part === "" || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return out;
}

/**
 * Rewrite a relative markdown link found inside `fromPath` (docs-root-relative)
 * to either an in-app /docs/:slug route (when it targets another synced doc) or
 * the canonical GitHub blob URL (for repo files outside the docs set, e.g.
 * ../QUICKSTART.md). External/anchor links are returned unchanged.
 */
export function resolveDocLink(fromPath: string, href: string): string {
  if (!href) return href;
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;

  const [rawPath] = href.split("#");
  if (rawPath === undefined || rawPath === "") return href;

  // Resolve against the repo, treating the docs set as living under "docs/".
  const fromDir = fromPath.includes("/") ? fromPath.slice(0, fromPath.lastIndexOf("/")) : "";
  const baseSegments = ["docs", ...(fromDir ? fromDir.split("/") : [])];
  const repoSegments = normalizeSegments([...baseSegments, ...rawPath.split("/")]);
  const repoRelPath = repoSegments.join("/");

  if (repoRelPath.startsWith("docs/") && repoRelPath.endsWith(".md")) {
    const docsRel = repoRelPath.slice("docs/".length);
    const slug = pathToSlug.get(docsRel);
    if (slug) return `/docs/${slug}`;
  }
  return `${GITHUB_BLOB}/${repoRelPath}`;
}
