# Personal Obsidian Docs Site Plan

## Project Architecture Recommendation
- Build a static-exported Next.js App Router site that reads only repo-local mirrored content at build time. This keeps the app portable across Vercel, Cloudflare Pages, Netlify, and GitHub Pages while staying local-first and database-free.
- Treat `/Users/takudo/Documents/TakudoNotes` as the authoring source of truth, but mirror published notes into `content/notes` and referenced assets into `public/obsidian-assets` before build.
- Keep all parsing, normalization, graph-building, and search-index generation in `lib/content` and `lib/obsidian`; route components consume typed `PublishedNote` data only.
- Use strict opt-in publishing: only notes with `publish: true` are eligible. `draft: true` or `private: true` always exclude. Existing `published:` frontmatter remains a source/article date field, not a visibility flag.
- Default exclusions: hidden/system paths (`.obsidian`, `.git`), `Templates/`, and raw `.excalidraw.md` notes from page generation. Embedded images and PDFs render directly; embedded Excalidraw notes degrade to attachment cards/download links in v1.
- Canonical slug strategy: vault-relative path wins. Bare wikilinks resolve by unique filename or alias match across published notes; ambiguous matches fail the production build with diagnostics.
- Date normalization: `createdAt` from `created` or `created_date`, then file birthtime fallback. `updatedAt` from `updated` or `updated_date`, then file mtime fallback.
- Tag normalization: merge frontmatter tags and inline `#tags`, normalize to kebab-case for URLs, preserve human-readable labels for UI.

## Framework Choice With Justification
- Choose Next.js App Router over Astro.
- Why: the site needs a substantial amount of interactive React UI built with Base UI and Motion: command search, nested explorer, mobile drawer, theme system, animated TOC, and graph view. Next keeps routing, metadata, route handlers, and React UI in one model.
- Astro’s content collections are strong, but this project already needs a custom Obsidian normalization layer for wikilinks, backlinks, aliases, and attachment resolution. That reduces Astro’s main advantage while adding React-island complexity for the interactive UI.
- Use `output: 'export'` so the site remains host-portable. That means no runtime server, no ISR, no cookies/server actions, and no default Next image optimization; search, RSS, sitemap, backlinks, and graph data must all be generated at build time.
- Reference basis: [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports), [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/).

## Folder Structure
```text
app/
  page.tsx
  docs/page.tsx
  docs/[...slug]/page.tsx
  tags/[tag]/page.tsx
  graph/page.tsx
  rss.xml/route.ts
  sitemap.ts
components/
  layout/
  content/
  search/
  graph/
  primitives/
lib/
  content/
  obsidian/
  search/
  site/
content/
  notes/                 # mirrored publishable vault notes
  example/               # safe committed demo notes
public/
  obsidian-assets/       # mirrored vault-relative assets
scripts/
  sync-vault.mts
  watch-vault.mts
  build-search-index.mts
docs/
  architecture.md
  content-model.md
  obsidian-compat.md
  design-system.md
  search.md
  deployment.md
  exec-plans/active/personal-docs-site.md
tests/
  fixtures/vault/
  unit/
  e2e/
plans.md
README.md
```

## Milestone Plan
1. Planning and repo bootstrap
- Create `plans.md` with this plan, risk register, demo script, and architecture overview.
- Create `docs/exec-plans/active/personal-docs-site.md` to satisfy repo workflow tracking.
- Author the missing source-of-truth docs: `architecture.md`, `content-model.md`, `obsidian-compat.md`, `design-system.md`, `search.md`, `deployment.md`.
- Lock design direction: editorial minimalism, warm-neutral light theme, graphite dark theme, `Newsreader` for display, `Manrope` for UI/body, restrained motion only.

2. App and design-system foundation
- Scaffold current stable Next.js App Router + React + TypeScript + Tailwind + Base UI + Motion.
- Add ESLint, Prettier, Vitest, Playwright, strict TypeScript, and production scripts.
- Build the reusable shell: top nav, nested sidebar, mobile drawer, theme provider, typography tokens, spacing/elevation/border tokens, reduced-motion support.
- Build reusable primitives: `SidebarTree`, `CommandDialog`, `Breadcrumbs`, `TOC`, `Callout`, `Tabs`, `Pager`, `ThemeSwitch`.

3. Vault sync and normalization pipeline
- Implement `scripts/sync-vault.mts` to copy only publishable notes from `OBSIDIAN_VAULT_PATH` into `content/notes`.
- Preserve vault-relative asset paths under `public/obsidian-assets` to avoid filename collisions.
- Add `pnpm content:watch` using `watch-vault.mts` so Obsidian edits refresh local preview continuously.
- Normalize `.md` and `.mdx` content into typed `PublishedNote` records with title fallback order: frontmatter `title`, first H1, then filename.
- Parse and resolve Obsidian syntax: `[[Note]]`, `[[Note|Alias]]`, `[[path/Note]]`, `[[Note#Heading]]`, `![[image.png]]`, `![[file.pdf]]`, callouts, aliases, folders, and inline tags.
- Generate backlinks, recent notes, related notes, section tree, reading time, TOC, and structured warnings.
- Production build rule: unresolved internal links in published notes fail CI.

4. Core site experience
- Homepage: profile-led landing, recent notes, featured tags, quick search entry, and “published from Obsidian” framing.
- Docs explorer: nested sidebar from mirrored folder tree, docs index, breadcrumbs, and prev/next within section.
- Note page template: article header, metadata, TOC, rendered markdown, callouts, attachments, backlinks, related notes, pager, and tag chips.
- Tag pages and `/docs` index generated statically from normalized content.

5. Search and knowledge features
- Use a build-generated MiniSearch JSON index for title, aliases, headings, tags, and body excerpts; load lazily when search opens.
- Use Base UI dialog primitives for the command palette and Motion for entry/exit/layout polish.
- Compute related notes from weighted shared tags plus inbound/outbound link overlap.
- Ship `/graph` as a lazy client-only SVG relationship view backed by a precomputed graph JSON; limit initial exploration to published notes and 1–2 hops to keep bundles small.

6. SEO, feeds, and deployment
- Generate static metadata per note, Open Graph fields, sitemap, robots, and RSS.
- Primary CI/CD path: GitHub Actions runs `lint`, `typecheck`, `test`, and `build` on every push; pushes to `main` deploy to Vercel.
- Document hosting tradeoffs in `docs/deployment.md`: Vercel is the primary and easiest target; Cloudflare Pages and Netlify work with static export; GitHub Pages is the most constrained and loses preview ergonomics.
- Document two publishing workflows:
  - vault inside site repo
  - separate vault repo mirrored into site repo
- Document the advanced auto-sync option for separate repos: vault repo push triggers site repo via `repository_dispatch`, site repo checks out both repos, runs the same sync script, builds, and deploys.

7. Hardening and handoff
- Add safe example content under `content/example` and fixture vault content under `tests/fixtures/vault`.
- Update `README.md` with local dev, sync, preview, and deploy instructions.
- After each implementation milestone, append to `plans.md`: files created/updated, what works now, how to verify it, and tradeoffs.
- Final acceptance gate: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Important Public Interfaces, Types, and Config
- `.env.example`
- `OBSIDIAN_VAULT_PATH=`
- `SITE_URL=`
- `VERCEL_TOKEN=`
- `VERCEL_ORG_ID=`
- `VERCEL_PROJECT_ID=`
- optional cross-repo sync variables for the advanced workflow
- `site.config.ts`
- site metadata, author/profile info, feature flags (`graph`, `rss`), content directory config
- Core types
- `NoteFrontmatter`
- `PublishedNote`
- `ResolvedWikiLink`
- `SearchIndexEntry`
- `ContentGraphNode`

## Test Cases and Scenarios
- Unit tests for slug generation, publish filtering, title/date normalization, wikilink parsing, alias resolution, tag extraction, callout transform, attachment resolution, backlink graph, and related-note scoring.
- Integration tests that build fixture vault content into normalized notes and assert generated routes, search index, tag pages, and backlink sections.
- E2E tests for homepage load, sidebar navigation on desktop/mobile, command search, note rendering, TOC behavior, backlinks/tags, dark mode persistence, reduced-motion behavior, and static exported route availability.

## Risk Register
- Private note leakage: mitigated by `publish: true` opt-in, explicit `draft/private` blocks, excluded system paths, and CI validation against mirrored output only.
- Broken wikilinks and assets: mitigated by build-time resolution, structured diagnostics, and production build failure for unresolved published-note links.
- Excalidraw and non-Markdown edge cases: mitigated by excluding raw `.excalidraw.md` pages in v1 and rendering embedded Excalidraw/PDF references as attachment cards.
- Static export limitations: mitigated by making all search/feed/graph data build-generated and avoiding runtime-only Next features.
- Cross-repo sync complexity: mitigated by making local mirror workflow the baseline and treating repo-to-repo automation as an additional documented workflow.

## Demo Script
1. Run `pnpm content:sync` against `/Users/takudo/Documents/TakudoNotes`; verify only `publish: true` notes appear in `content/notes`.
2. Start `pnpm dev`; review homepage, sidebar explorer, note template, tags, backlinks, and graph view.
3. Use `Cmd+K` to find a note by title, alias, and body text.
4. Open a note with wikilinks, callouts, and embedded assets; verify canonical links, TOC, related notes, and attachments.
5. Toggle dark mode and reduced-motion behavior.
6. Push to `main`; GitHub Actions validates and deploys the site to Vercel.

## Assumptions and Defaults
- Primary implementation path is Next.js App Router with static export, even though Vercel is the primary host.
- Publishing uses `publish: true`; `published:` remains a source/article date field.
- Search is client-side from a build-generated JSON index; no external search service and no database.
- Example content is committed for onboarding and tests, but live content comes from the mirrored Obsidian vault.
