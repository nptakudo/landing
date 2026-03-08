# Personal Obsidian Docs Site Milestone Log

## Current status

- Active branch: `codex/obsidian-docs-site-v2`
- Architecture baseline: Next.js App Router with static export
- Content model: separate vault mirror into `content/notes` plus `public/obsidian-assets`
- Generated artifacts: search index, graph JSON, RSS, sitemap, and robots
- Preview URL: pending, Vercel secrets not configured in GitHub yet

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

- pending

Tradeoffs:

- callouts are normalized into styled blockquotes rather than a richer typed component set
- `order` exists in frontmatter typing but is not consumed by navigation or pager logic

## Milestone 2 - Reader shell and static routes

Status: foundation implemented, refinement still open

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

- pending

Tradeoffs:

- the graph is static-layout client rendering rather than a fully explorable zoomable canvas
- richer MDX components for callouts and attachment cards are still open work

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

- pending

Tradeoffs:

- deployment is documented and automated, but the first real preview URL depends on Vercel secrets being configured
- the deploy workflow now skips cleanly when Vercel secrets are absent, so branch health stays readable while infra is unfinished
- `SITE_URL` is documented for deploy parity even though the app currently reads the canonical URL from `site.config.ts`
- milestone notes are accurate to the current worktree, including known implementation gaps outside this docs-only change
