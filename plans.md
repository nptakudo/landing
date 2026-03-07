# Personal Obsidian Docs Site Plan

## Architecture Overview
- Framework: Next.js App Router with static export (`output: 'export'`).
- Content source: Obsidian vault mirrored into repo-local `content/notes`.
- Rendering: Markdown transformed through normalization and wikilink resolution.
- Knowledge features: backlinks, tags, related notes, TOC, search index, graph overview.
- Deployment: Vercel primary, static-export portable to Netlify/Cloudflare/GitHub Pages.

## Milestones
- [x] Milestone 1 - Planning and repository bootstrap
- [x] Milestone 2 - App scaffold and design system foundation
- [x] Milestone 3 - Vault sync and normalization pipeline
- [x] Milestone 4 - Core site experience
- [x] Milestone 5 - Search and knowledge features
- [x] Milestone 6 - SEO, feeds, deployment workflows
- [x] Milestone 7 - Hardening and handoff

## Milestone Status Log
### Milestone 1
Status: Completed

Files created/updated:
- `plans.md`
- `documentation.md`
- `docs/architecture.md`
- `docs/content-model.md`
- `docs/obsidian-compat.md`
- `docs/design-system.md`
- `docs/search.md`
- `docs/deployment.md`
- `docs/exec-plans/active/personal-docs-site.md`

What works now:
- Source-of-truth documentation and execution plan tracking are present.

How to verify:
- Open docs files and verify policies are defined.

Tradeoffs:
- Detailed implementation deferred to later milestones.

### Milestone 2
Status: Completed

Files created/updated:
- Next app/tooling scaffold (`app/`, `package.json`, lint/test/typecheck/build config)
- Base UI + Motion shell and reusable primitives

What works now:
- App boots with dark mode, top nav, sidebar shell, docs/tag/graph routes.
- Lint/typecheck/test/build pipeline runs.

How to verify:
- `pnpm dev`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

Tradeoffs:
- Used fallback route placeholders before real content loading was ready.

### Milestone 3
Status: Completed

Files created/updated:
- `scripts/sync-vault.mts`
- `scripts/watch-vault.mts`
- `lib/content/*`
- `lib/obsidian/wikilinks.ts`
- `content/example/*`
- docs/tag/graph pages wired to normalized note graph
- parser + loader tests

What works now:
- Syncs `publish: true` notes and referenced embeds.
- Derives backlinks, TOC, related notes, reading time, tags.
- Enforces unresolved-link build failures (strict mode).

How to verify:
- `pnpm content:sync`
- `pnpm test`
- `pnpm build`

Tradeoffs:
- Excludes raw `.excalidraw.md` pages in v1.

### Milestone 4
Status: Completed

Files created/updated:
- `app/layout.tsx`
- `components/layout/*`
- `lib/content/navigation.ts`
- `app/docs/[...slug]/page.tsx`

What works now:
- Sidebar navigation generated from note folders.
- Search trigger and top navigation integrated with note data.
- Note page includes breadcrumbs, TOC, backlinks, related notes, pager.

How to verify:
- `pnpm dev`
- Open `/docs` and browse notes with sidebar navigation.

Tradeoffs:
- Mobile drawer nav remains minimal (desktop-first sidebar behavior).

### Milestone 5
Status: Completed

Files created/updated:
- `components/primitives/command-dialog.tsx`
- `scripts/build-search-index.ts`
- `lib/search/types.ts`

What works now:
- Full-text search index includes title, aliases, tags, headings, body.
- Command dialog loads generated index and queries with MiniSearch.

How to verify:
- `pnpm search:build`
- `pnpm dev`
- Search via dialog and validate body/tag/title matches.

Tradeoffs:
- Search index is loaded on demand when opening the dialog.

### Milestone 6
Status: Completed

Files created/updated:
- `app/sitemap.ts`
- `app/robots.ts`
- `scripts/build-rss.ts`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy-vercel.yml`
- `docs/deployment.md`

What works now:
- Sitemap and robots are statically generated.
- RSS is generated during build.
- CI and Vercel deploy workflows are defined.

How to verify:
- `pnpm build`
- Inspect routes `/sitemap.xml`, `/robots.txt` and `public/rss.xml`.

Tradeoffs:
- Vercel deploy workflow expects configured repository secrets.

### Milestone 7
Status: Completed

Files created/updated:
- `README.md`
- `documentation.md`
- `.env.example`
- `.gitignore` hardening for synced private content
- `docs/exec-plans/active/personal-docs-site.md`

What works now:
- Setup and publishing docs are complete and aligned with implementation.
- Synced private notes/assets are gitignored by default.

How to verify:
- Review docs and run full command checklist.

Tradeoffs:
- Additional E2E UI coverage can be expanded in future iterations.

## Bug Notes
- Fixed static export failure for catch-all docs route by generating parameters from real note slugs.
- Fixed vault sync recursion by excluding `landing/` path from sync source.
- Fixed script module format issues by using `tsx`-friendly `.ts` script entries and async main wrappers.

## Verification Checklist
- [x] `pnpm content:sync`
- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] `pnpm test`
- [x] `pnpm build`

## Decisions and Defaults
- Next.js selected over Astro due to React-first interactive UI and Base UI/Motion integration.
- Publishing is strict opt-in (`publish: true`) with hard blocks for `draft/private`.
- Separate-vault mirroring is the default workflow.
- Vercel is the primary hosting target.

## Risk Register
- Private note leakage if publish filtering is wrong.
- Wikilink ambiguity across similarly named notes.
- Static export limitations for runtime features.
- Attachment path collisions from duplicated filenames.

## Demo Script
1. `pnpm content:sync`
2. `pnpm dev`
3. Browse `/docs`, open notes, validate backlinks/related/TOC.
4. Run search dialog and query title/body/tag terms.
5. Open `/graph`.
6. `pnpm build` and verify sitemap/robots/RSS artifacts.
