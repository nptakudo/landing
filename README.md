# Personal Obsidian Docs Site

Static-exported Next.js App Router site for publishing selected Obsidian notes from a mirrored vault directory.

## What is implemented

- Next.js App Router with `output: "export"` in `next.config.ts`
- repo-local mirror model: author in a vault, mirror published notes into `content/notes`, mirror referenced assets into `public/obsidian-assets`
- build-generated search and graph artifacts from `scripts/build-search-index.mts` and `scripts/build-graph.mts`
- build-generated RSS, sitemap, and robots artifacts from `scripts/build-feeds.mts`
- docs shell routes at `/`, `/docs`, `/docs/[...slug]`, `/tags/[tag]`, and `/graph`
- local-first implementation loop with Bun, static generation, and live localhost preview

## Local development

1. Install dependencies.

```bash
bun install
```

2. Copy the environment template and point `OBSIDIAN_VAULT_PATH` at your local vault.

```bash
cp .env.example .env.local
```

3. Start the prepared local dev loop.

```bash
bun run dev:prepared
```

This command mirrors content, rebuilds generated artifacts, and starts Next.js on localhost.

4. If you want to refresh content without starting the app:

```bash
bun run content:sync
```

5. Optional: keep the mirror updated while editing in Obsidian.

```bash
bun run content:watch
```

If `content/notes` is empty, the app falls back to `content/example` for local browsing. CI and preview deploys also use repo-local example content unless a separate vault checkout is configured.

## Publishing model

- Only notes with `publish: true` are eligible.
- `draft: true` and `private: true` always exclude a note.
- Hidden paths, `.obsidian`, `.git`, `Templates/`, and raw `*.excalidraw.md` files are excluded from route generation.
- Wikilinks and embeds are validated during content loading. Unresolved or ambiguous references fail the build.

## Commands

```bash
bun run content:sync
bun run content:mirror
bun run content:watch
bun run search:index
bun run graph:build
bun run feeds:build
bun run export:site
bun run lint
bun run typecheck
bun run test
bun run build
```

## Vercel previews and production

- The active feature-branch preview target is `codex/obsidian-docs-site-v2`.
- `codex/**` pushes run CI and create Vercel preview deployments.
- `main` pushes run CI and deploy production.
- `deploy-vercel.yml` can also sync a separate private vault repo before building when `VAULT_REPO` is configured.
- Local Vercel CLI preview is linked and verified for this worktree; the current preview URL is `https://landing-v2-c1se4xz5q-nptakudos-projects.vercel.app`.

## Environment

See `.env.example` for the expected variables. The app currently reads the canonical site URL from `site.config.ts`; `SITE_URL` is still kept for deployment and future config parity.

## Source-of-truth docs

- `docs/architecture.md`
- `docs/content-model.md`
- `docs/obsidian-compat.md`
- `docs/design-system.md`
- `docs/search.md`
- `docs/deployment.md`
- `docs/exec-plans/active/personal-docs-site.md`
- `plans.md`
