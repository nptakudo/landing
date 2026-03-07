# Documentation

## What this project is
Takudo Notes Site is a static personal documentation website that publishes selected notes from a local Obsidian vault. It behaves like a docs site + digital garden + personal wiki with backlinks, tags, graph view, and full-text search.

## Local setup
Requirements:
- Node.js 22+
- Corepack
- pnpm 9+

Setup:
```bash
corepack enable
corepack prepare pnpm@9.12.3 --activate
pnpm install
cp .env.example .env.local
```

## One-command dev start
```bash
pnpm dev
```

## Validate quality
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## Publish workflow
### Option 1: Vault inside site repo
- Keep your Obsidian vault under this repository.
- Mark publishable notes with `publish: true`.
- Run `pnpm content:sync` and commit site changes.

### Option 2: Separate vault repo (default)
- Keep the vault in a separate repository/path.
- Set `OBSIDIAN_VAULT_PATH`.
- Run `pnpm content:sync` to mirror publishable notes into `content/notes`.

Filtering rules:
- Included: `publish: true`
- Excluded: `private: true`, `draft: true`
- Excluded paths: `.obsidian`, `.git`, `Templates`, `zArchive`, `Excalidraw`, test fixture directories
- Recursion protection: paths resolving into the site repo root are auto-skipped (so a nested repo does not self-publish)

## Search and feed generation
- Build search index: `pnpm search:build` -> `public/search-index.json`
- Build RSS: `pnpm rss:build` -> `public/rss.xml`
- Full build runs both automatically.

## Local demo checklist
1. `pnpm content:sync`
2. `pnpm dev`
3. Open `/docs` and a note page.
4. Verify backlinks, related notes, tags, and TOC.
5. Open search dialog, query terms from title/body/tags.
6. Open `/graph`.
7. Toggle dark mode.

## Local static deploy preview
```bash
pnpm build
npx serve@latest out -l tcp://127.0.0.1:4173
open -a \"Google Chrome\" http://127.0.0.1:4173
```

## Repo structure
- `app/`: Next App Router routes (`/docs`, `/tags`, `/graph`, sitemap, robots)
- `components/`: layout, primitives, content widgets
- `lib/content`: note loading, parsing, graph/backlink derivation
- `lib/obsidian`: wikilink/tag parsing
- `lib/search`: shared search index types
- `scripts/`: sync/watch/search/rss generators
- `content/example`: safe fallback demo notes
- `content/notes`: synced notes (gitignored)
- `public/obsidian-assets`: synced assets (gitignored)
- `docs/`: source-of-truth docs

## Troubleshooting
- `pnpm` missing: run Corepack setup commands above.
- Build fails on unresolved links: fix wikilinks in published notes or set `CONTENT_STRICT_LINKS=false` locally.
- No notes after sync: check `publish: true` and exclusion filters.
- Search dialog empty: run `pnpm search:build` or full `pnpm build`.
