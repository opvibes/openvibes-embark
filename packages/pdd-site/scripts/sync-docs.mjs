// sync-docs.mjs — mirror the canonical PDD docs markdown into this package.
//
// WHY THIS EXISTS (content strategy, step 2 of the docs-wiring task):
// The canonical docs are single-sourced as markdown in the parity-driven-development
// repo (remote: blpsoares/parity-driven-development) under `docs/**/*.md`.
// The PREFERRED delivery mechanism was a git submodule at `content/pdd`, but the
// host monorepo's git working tree is unavailable in this environment
// (`git submodule` fails with "cannot be used without a working tree"), so a
// submodule cannot be added or fetched here. We therefore FALL BACK to committing
// a copy of the docs under `src/content/docs/` and keeping it fresh with this
// script.
//
// The committed copy is what the Vite build consumes (via import.meta.glob), so
// Cloudflare Pages builds work with zero extra fetch steps. This script only needs
// to run when the upstream docs change; it is wired as `prebuild` so a local
// `bun run build` re-syncs automatically WHEN the source repo is reachable, and
// no-ops gracefully (leaving the committed copy intact) when it is not — which is
// exactly the case on CI/Cloudflare, where only this package is checked out.
//
// Source resolution order:
//   1. $PDD_DOCS_SRC  — path to either the repo root or its `docs/` dir
//   2. a few conventional sibling locations next to this monorepo
// If none resolve, the script prints a notice and exits 0 (build continues on the
// already-committed copy).

import { existsSync, mkdirSync, readdirSync, rmSync, copyFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, "..");
const DEST = join(PKG_ROOT, "src", "content", "docs");

// Only these top-level entries are public docs. `superpowers/` (internal plans &
// specs) and anything without doc frontmatter are intentionally excluded.
const INCLUDE_DIRS = ["concepts", "guides", "install", "reference"];
const INCLUDE_FILES = ["README.md"];

function resolveDocsRoot() {
  const candidates = [];
  const env = process.env.PDD_DOCS_SRC;
  if (env) {
    candidates.push(env.endsWith("docs") ? env : join(env, "docs"));
    candidates.push(env);
  }
  candidates.push(
    resolve(PKG_ROOT, "../../../../parity-driven-development/docs"),
    resolve(PKG_ROOT, "../../../parity-driven-development/docs"),
    "/home/mithrandir/parity-driven-development/docs",
  );
  return candidates.find((c) => existsSync(join(c, "README.md")) || existsSync(join(c, "concepts")));
}

function copyMdTree(srcDir, destDir) {
  mkdirSync(destDir, { recursive: true });
  for (const entry of readdirSync(srcDir)) {
    const src = join(srcDir, entry);
    const dest = join(destDir, entry);
    if (statSync(src).isDirectory()) copyMdTree(src, dest);
    else if (entry.endsWith(".md")) copyFileSync(src, dest);
  }
}

const docsRoot = resolveDocsRoot();
if (!docsRoot) {
  console.log(
    "[sync-docs] upstream PDD docs not found (set PDD_DOCS_SRC to override) — " +
      "keeping the committed copy in src/content/docs. Build continues.",
  );
  process.exit(0);
}

rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });

for (const file of INCLUDE_FILES) {
  const src = join(docsRoot, file);
  if (existsSync(src)) copyFileSync(src, join(DEST, file));
}
for (const dir of INCLUDE_DIRS) {
  const src = join(docsRoot, dir);
  if (existsSync(src)) copyMdTree(src, join(DEST, dir));
}

console.log(`[sync-docs] synced PDD docs from ${docsRoot} -> src/content/docs`);
