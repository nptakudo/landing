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
Current status:
- `pnpm content:sync` placeholder (implemented in Milestone 3)
- `pnpm content:watch` placeholder (implemented in Milestone 3)
- `pnpm search:build` placeholder (implemented in Milestone 5)

## Demo guide
Current milestone demo:
1. Run `pnpm dev`.
2. Open `/`, `/docs`, `/docs/welcome`, `/tags/all`, `/graph`.
3. Toggle dark mode from top-right switch.
4. Use the Search dialog in the top nav.

## Repository structure
- `app/`: Next.js App Router routes
- `components/layout`: app shell components
- `components/primitives`: reusable UI primitives
- `components/providers`: app-wide providers
- `lib/`: shared utilities and domain logic
- `docs/`: source-of-truth architecture and behavior docs
- `tests/`: unit and e2e tests
- `scripts/`: sync/search build scripts

## Troubleshooting
- `pnpm` not found: run `corepack enable` then `corepack prepare pnpm@9.12.3 --activate`.
- Build export complains about dynamic route params: ensure dynamic routes have `generateStaticParams` and at least one generated path when required.
- ESLint scans generated artifacts: confirm `coverage/**` and `.next/**` are in `globalIgnores`.
