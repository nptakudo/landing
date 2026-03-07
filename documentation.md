# Documentation

## What this project is
A personal documentation website that publishes selected notes from a local Obsidian vault into a static website optimized for reading, navigation, backlinks, and search.

## Local setup
- Node.js 22+
- Corepack enabled
- `pnpm` 9+

Commands:
- `corepack enable`
- `corepack prepare pnpm@9.12.3 --activate`
- `pnpm install`

## One-command dev start
- `pnpm dev`

## Quality commands
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Unit tests: `pnpm test`
- Production build: `pnpm build`

## Content sync and export workflow
- Sync published notes from Obsidian vault: `pnpm content:sync`
- Watch vault and resync on changes: `pnpm content:watch`
- Build search index artifact: `pnpm search:build`

Sync behavior:
- Source vault default: `/Users/takudo/Documents/TakudoNotes`
- Override with env: `OBSIDIAN_VAULT_PATH=/path/to/vault pnpm content:sync`
- Includes only notes with `publish: true`
- Excludes notes with `private: true` or `draft: true`
- Excludes `.obsidian`, `.git`, `Templates`, `zArchive`, `Excalidraw`, and `landing` paths
- Copies only referenced embedded assets into `public/obsidian-assets`

## Demo guide
1. Run `pnpm content:sync`.
2. Run `pnpm dev`.
3. Open `/`, `/docs`, `/docs/welcome`, `/tags/docs`, `/graph`.
4. Open a note and verify TOC, backlinks, related notes, and tag links.
5. Toggle dark mode from top-right switch.
6. Build with `pnpm build` and confirm static routes are generated.

## Repository structure
- `app/`: Next.js App Router routes
- `components/layout`: app shell components
- `components/primitives`: reusable UI primitives
- `components/content`: page-specific components
- `components/providers`: app-wide providers
- `lib/content`: content loading, normalization, graph derivation
- `lib/obsidian`: Obsidian syntax parsing helpers
- `docs/`: source-of-truth architecture and behavior docs
- `tests/`: unit and e2e tests
- `scripts/`: sync/watch/search scripts

## Troubleshooting
- `pnpm` not found: run `corepack enable` then `corepack prepare pnpm@9.12.3 --activate`.
- Build export fails on dynamic route params: ensure dynamic routes implement `generateStaticParams`.
- Unresolved wikilinks fail build: fix links in published notes or set `CONTENT_STRICT_LINKS=false` locally.
- No docs generated after sync: confirm notes have `publish: true` and are not blocked by `private/draft` filters.
