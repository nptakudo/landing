---
publish: true
---

# Takudo Notes Site

Personal docs website that publishes selected Obsidian notes as a static, searchable knowledge base.

## Stack
- Next.js App Router (static export)
- React + TypeScript
- Tailwind CSS
- Base UI primitives
- Motion animations
- MiniSearch (client-side full-text search)

## Quick start
```bash
corepack enable
corepack prepare pnpm@9.12.3 --activate
pnpm install
cp .env.example .env.local
pnpm content:sync
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content workflow
1. Author notes in Obsidian vault (`OBSIDIAN_VAULT_PATH`).
2. Mark publishable notes with `publish: true` frontmatter.
3. Run `pnpm content:sync` to mirror publishable notes into `content/notes` and referenced assets into `public/obsidian-assets`.
4. Build/deploy site from repo state.

### Filters
- Included: `publish: true`
- Excluded: `draft: true`, `private: true`
- Path exclusions: `.obsidian`, `.git`, `Templates`, `zArchive`, `Excalidraw`, `landing`

## Commands
- `pnpm dev`: local dev server
- `pnpm lint`: ESLint
- `pnpm typecheck`: TypeScript type check
- `pnpm test`: Vitest unit tests
- `pnpm build`: build search index + RSS + static site export
- `pnpm content:sync`: sync publishable vault notes and assets
- `pnpm content:watch`: watch vault and sync on change
- `pnpm search:build`: generate `public/search-index.json`
- `pnpm rss:build`: generate `public/rss.xml`

## Features
- Homepage with recent notes and tag highlights
- Docs index and generated note pages
- Nested sidebar explorer from folder hierarchy
- Cmd-K style search dialog powered by MiniSearch
- Obsidian wikilink resolution + backlinks
- Tag pages
- Related notes
- TOC from headings
- Reading-time metadata
- Graph overview page
- Dark mode
- Sitemap + robots + RSS

## Deployment
### Primary: Vercel
- CI workflow: `.github/workflows/ci.yml`
- Deploy workflow: `.github/workflows/deploy-vercel.yml`
- Required GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

### Alternatives
- Netlify / Cloudflare Pages / GitHub Pages supported via static export output in `out/`.

## Repository map
- `app/`: routes and metadata
- `components/`: UI and layout components
- `lib/content`: content loader/normalization/graph logic
- `lib/obsidian`: Obsidian syntax parsing
- `lib/search`: search index generation
- `scripts/`: sync/build scripts
- `content/example`: committed demo notes
- `docs/`: source-of-truth docs
- `tests/`: unit fixtures and tests

## Notes
- Synced private vault content is intentionally gitignored (`content/notes/**`, `public/obsidian-assets/**`).
- When no synced content exists, app falls back to `content/example` for deterministic local runs.
