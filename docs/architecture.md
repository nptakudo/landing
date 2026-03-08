# Architecture

## Runtime model

This site is a static-exported Next.js App Router application. There is no runtime database, no CMS, and no server-side content fetch in the deployed site. All note parsing, relation building, search data generation, and graph generation happen before or during build.

`next.config.ts` sets:

- `output: "export"`
- `images.unoptimized: true`

That keeps the deployment host-agnostic while still fitting Vercel previews and production.

## Authoring and mirror model

The authoring source of truth is an Obsidian vault outside the app runtime. The app does not read the live vault directly in production.

Current mirror flow:

1. `scripts/sync-vault.mts` reads `OBSIDIAN_VAULT_PATH`.
2. Publishable notes are mirrored into `content/notes`.
3. Referenced assets are mirrored into `public/obsidian-assets`, preserving vault-relative paths.
4. `scripts/build-search-index.mts` writes `public/search-index.json`.
5. `scripts/build-graph.mts` writes `public/graph.json`.
6. `scripts/build-feeds.mts` writes `public/rss.xml`, `public/sitemap.xml`, and `public/robots.txt`.
7. `next build` exports the static site.

If `content/notes` is empty at runtime, `src/lib/site/content.ts` falls back to `content/example` so the UI remains usable before a real vault is connected.

## App structure

Primary routes:

- `/` - landing page
- `/docs` - docs index
- `/docs/[...slug]` - static note pages
- `/tags` - tag index
- `/tags/[tag]` - tag archive pages
- `/graph` - interactive graph page

Primary code boundaries:

- `src/lib/obsidian` - frontmatter parsing, wikilink parsing, path helpers, markdown rendering
- `src/lib/content` - note loading, link resolution, backlinks, related notes, search docs, navigation tree, graph data
- `src/lib/site` - cached route-facing selectors over the content layer
- `scripts` - mirror and artifact generation entry points
- `src/app` and `src/components` - presentation and route assembly

## Data flow

```text
Obsidian vault
  -> scripts/sync-vault.mts
  -> content/notes + public/obsidian-assets
  -> loadPublishedNotes()
  -> derived note graph, backlinks, tags, navigation tree
  -> search-index.json + graph.json + rss.xml + sitemap.xml + robots.txt
  -> Next.js static routes
  -> exported site
```

## Current rendering behavior

Current note rendering is intentionally split:

- Markdown HTML comes from `renderMarkdownToHtml()`
- Obsidian wikilinks, embeds, and callout markers are normalized before final HTML generation

This keeps one canonical validation and linking model while still producing article HTML that contains resolved note links and embed paths.

## Search and graph artifacts

- Search is backed by `public/search-index.json`
- Graph is backed by `public/graph.json`
- Both artifacts are deterministic outputs of the same published-note dataset used by routes
- Feed and crawl artifacts are backed by `public/rss.xml`, `public/sitemap.xml`, and `public/robots.txt`

## Design workflow

UI iteration happens directly in the local app. The current design loop is route-first: adjust the shell and note components in `src/app` and `src/components`, then verify the experience in localhost during development.

## Current gaps

The current implementation does not yet include:

- richer typed note components for callouts and attachments beyond the current normalized HTML approach
- canonical site config parity between environment variables and `site.config.ts`
- deeper graph interactions such as pan, zoom, and focus mode
