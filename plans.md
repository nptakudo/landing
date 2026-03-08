# Personal Obsidian Docs Site Milestone Log

## Current status

- Active branch: `codex/obsidian-docs-site-v2`
- Architecture baseline: Next.js App Router with static export
- Content model: separate vault mirror into `content/notes` plus `public/obsidian-assets`
- Generated artifacts: search index, graph JSON, RSS, sitemap, and robots
- Preview URL: `https://landing-v2-c1se4xz5q-nptakudos-projects.vercel.app` (publicly reachable)

## Verification checklist

- [x] `bun run lint`
- [x] `bun run typecheck`
- [x] `bun test`
- [x] `bun run build`
- [x] snapshot coverage for deterministic content artifacts
- [x] `documentation.md` created and aligned with current behavior
- [x] local preview deployment recorded in this file

## Implementation notes

- 2026-03-08: switched the deploy workflow to skip cleanly when Vercel secrets are absent so codex branches do not fail red for missing infrastructure.
- 2026-03-08: `fs.access()` behaved inconsistently across environments, so the sync integration test now uses `fs.stat()` for deterministic existence checks.
- 2026-03-08: content ordering is now stable across notes, navigation, search, graph edges, and feeds, with snapshot coverage guarding serialized artifact output.
- 2026-03-08: preview deployment protection was removed from the linked Vercel project by patching `ssoProtection` to `null`, so the branch preview URL is publicly reachable without authentication.
- 2026-03-08: RSS snapshot drift in CI was caused by fixture files falling back to filesystem mtimes; the fixture vault now pins explicit `updated` dates so artifact snapshots stay stable across environments.
- 2026-03-08: the exported-site `start` flow initially misrouted flat pages like `/docs`; route resolution now prefers `*.html` exports before nested `index.html` fallbacks, with unit coverage for the static server resolver.
- 2026-03-08: Vitest external snapshot files kept regenerating an obsolete key for the deterministic artifact suite on CI, so that coverage now uses an inline serialized JSON snapshot instead of a separate `.snap` file.
- 2026-03-08: the GitHub-linked Vercel branch preview returned `404 NOT_FOUND` because the project had drifted into a broken Next.js runtime configuration. The repo now commits `vercel.json` with a static-export build (`bun run export:site`) and `out/` output so GitHub-linked previews and local CLI deploys use the same deployment contract.

## Milestone 1 - Mirror pipeline and published-note model

Status: implemented in the current worktree

Files changed:

- `scripts/sync-vault.mts`
- `scripts/watch-vault.mts`
- `scripts/build-search-index.mts`
- `scripts/build-graph.mts`
- `src/lib/content/notes.ts`
- `src/lib/content/search.ts`
- `src/lib/content/graph.ts`
- `src/lib/content/tree.ts`
- `src/lib/content/related.ts`
- `src/lib/content/types.ts`
- `src/lib/obsidian/frontmatter.ts`
- `src/lib/obsidian/wiki-links.ts`
- `src/lib/obsidian/markdown.ts`
- `tests/unit/content-pipeline.test.ts`
- `tests/integration/sync-vault.test.ts`

What works:

- published-note filtering is enforced through frontmatter and path exclusions
- vault notes and referenced assets can be mirrored into repo-local build directories
- backlinks, related notes, navigation tree data, search entries, and graph data are derived from the same published-note set
- unresolved or ambiguous note links and embeds fail content loading instead of silently shipping broken references
- resolved wikilinks and embeds are rewritten into article HTML during render

Verification:

- `bun run test` passed on 2026-03-08
- `bun run typecheck` passed on 2026-03-08
- `bun run build` passed on 2026-03-08

Preview URL:

- `https://landing-v2-c1se4xz5q-nptakudos-projects.vercel.app` (local CLI preview deploy)

Tradeoffs:

- callouts are normalized into styled blockquotes rather than a richer typed component set

## Milestone 2 - Reader shell and static routes

Status: complete on 2026-03-08

Files changed:

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/docs/page.tsx`
- `src/app/docs/[...slug]/page.tsx`
- `src/app/tags/[tag]/page.tsx`
- `src/app/graph/page.tsx`
- `src/app/not-found.tsx`
- `src/components/layout/docs-shell.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/navigation/sidebar-tree.tsx`
- `src/components/note/outline-nav.tsx`
- `src/components/search/search-dialog.tsx`
- `src/components/primitives/theme-provider.tsx`
- `src/components/primitives/theme-toggle.tsx`
- `src/app/globals.css`
- `site.config.ts`

What works:

- the site has a branded landing page and a three-column docs shell
- docs index, note pages, tag pages, and graph summary pages are statically generated
- theme switching, navigation tree rendering, backlinks, attachments, pager links, breadcrumbs, and mobile drawer rails are wired into the UI
- search is designed to lazy-load a static JSON index when the dialog opens
- the note outline rail tracks the active section, and the graph route now renders an interactive force layout

Verification:

- `bun run build` passed on 2026-03-08
- spot-check note routing with `generateStaticParams()` in the docs and tag routes
- static route data comes from `src/lib/site/content.ts`

Preview URL:

- `https://landing-v2-c1se4xz5q-nptakudos-projects.vercel.app` (local CLI preview deploy)

Tradeoffs:

- the graph is static-layout client rendering rather than a fully explorable zoomable canvas
- the current note renderer uses normalized HTML rather than a heavier MDX component runtime

## Milestone 3 - Documentation, env scaffold, and deployment automation

Status: complete on 2026-03-08

Files changed:

- `README.md`
- `.env.example`
- `docs/architecture.md`
- `docs/content-model.md`
- `docs/obsidian-compat.md`
- `docs/design-system.md`
- `docs/search.md`
- `docs/deployment.md`
- `docs/exec-plans/active/personal-docs-site.md`
- `plans.md`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy-vercel.yml`

What works:

- the repository now has source-of-truth docs for architecture, content, Obsidian behavior, design, search, and deployment
- local environment expectations are documented in a repo-safe `.env.example`
- CI is defined around Bun install, lint, typecheck, test, and build
- Vercel deploy automation is defined for preview deployments on `codex/**` and production on `main`
- the separate-vault mirror workflow is documented and supported in the deploy workflow
- feature-branch builds also emit RSS, sitemap, and robots files as part of `prebuild`

Verification:

- `bun run lint` passed on 2026-03-08
- `bun run typecheck` passed on 2026-03-08
- `bun run test` passed on 2026-03-08
- `bun run build` passed on 2026-03-08
- workflow files reviewed for branch targeting and repo-local example-content fallback

Preview URL:

- `https://landing-v2-c1se4xz5q-nptakudos-projects.vercel.app` (local CLI preview deploy)

Tradeoffs:

- deployment is documented and automated, but GitHub-hosted branch deploys still need Vercel secrets configured if the workflow is expected to perform CLI deploys instead of cleanly skipping
- the deploy workflow now skips cleanly when Vercel secrets are absent, so branch health stays readable while infra is unfinished
- `SITE_URL` is documented for deploy parity even though the app currently reads the canonical URL from `site.config.ts`
- milestone notes are accurate to the current worktree, including known implementation gaps outside this docs-only change

## Milestone 4 - Determinism, snapshots, and operator docs

Status: complete on 2026-03-08

Files changed:

- `documentation.md`
- `package.json`
- `scripts/export-site.mts`
- `scripts/build-feeds.mts`
- `src/lib/content/feeds.ts`
- `src/lib/content/order.ts`
- `src/lib/content/graph.ts`
- `src/lib/content/index.ts`
- `src/lib/content/notes.ts`
- `src/lib/content/search.ts`
- `src/lib/content/tree.ts`
- `src/lib/site/content.ts`
- `tests/unit/deterministic-artifacts.test.ts`
- `tests/unit/__snapshots__/deterministic-artifacts.test.ts.snap`
- `docs/content-model.md`
- `docs/deployment.md`
- `README.md`
- `plans.md`

What works:

- search, graph, navigation, backlinks, attachments, and feed outputs are serialized in stable order across environments
- snapshot coverage now guards ordering-sensitive note metadata and generated artifacts
- the repo has a one-command prepared dev start and a dedicated static export CLI
- operator-facing docs cover local setup, export usage, repo structure, design file format, and deployment troubleshooting

Verification:

- `bun run lint`
- `bun run typecheck`
- `bun test`
- `bun run build`
- `bun run export:site -- --output-dir /tmp/landing-site-export`
- local preview deployment recorded below

Preview URL:

- `https://landing-v2-c1se4xz5q-nptakudos-projects.vercel.app`

Tradeoffs:

- preview visibility is now public on the linked Vercel project; keep `ssoProtection` disabled if unauthenticated branch previews are still desired

## Milestone 5 - GitHub preview repair and committed Vercel contract

Status: complete on 2026-03-08

Files changed:

- `vercel.json`
- `docs/deployment.md`
- `plans.md`

What works:

- GitHub-linked Vercel previews no longer depend on mutable dashboard-only framework settings
- the project deploys as a plain static export using `bun run export:site`
- the branch preview alias can target a healthy static deployment rather than a failed Next.js runtime deployment

Verification:

- `bun run lint`
- `bun run typecheck`
- `bun test`
- `bun run build`
- local CLI deploy against the linked `landing` Vercel project
- branch preview URL checked after alias repair

Preview URL:

- `https://landing-git-codex-obsidian-docs-site-v2-nptakudos-projects.vercel.app`

Tradeoffs:

- the GitHub-linked Vercel project still has mutable dashboard settings, but the committed `vercel.json` now defines the correct deploy shape and should override future drift
