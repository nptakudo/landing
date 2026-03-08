# Documentation

## Local setup

1. Install dependencies:

```bash
bun install
```

2. Copy the environment template and point `OBSIDIAN_VAULT_PATH` at your vault if you want real notes:

```bash
cp .env.example .env.local
```

3. Start the prepared dev loop:

```bash
bun run dev:prepared
```

That command mirrors published notes, rebuilds generated artifacts, and starts Next.js on localhost.

## Quality checks

```bash
bun run lint
bun run typecheck
bun test
bun run build
```

## Export CLI

Export the static site using the repo-local example content or your own vault.

Basic export:

```bash
bun run export:site
```

Export with a specific vault:

```bash
bun run export:site --vault-path /Users/takudo/Documents/TakudoNotes
```

Export and copy the generated `out/` directory elsewhere:

```bash
bun run export:site --vault-path /Users/takudo/Documents/TakudoNotes --output-dir /tmp/takudo-notes-export
```

## Repo structure

- `src/app/` - Next.js App Router routes and metadata
- `src/components/` - layout, note, graph, navigation, and UI primitives
- `src/lib/obsidian/` - frontmatter, wikilink, markdown, and path normalization
- `src/lib/content/` - published-note model, graph/search/feed builders, and ordering logic
- `src/lib/site/` - route-facing cached selectors and content source fallback
- `scripts/` - mirror, watch, export, and artifact build entry points
- `content/example/` - safe committed demo notes
- `tests/fixtures/vault/` - fixture vault for unit and integration coverage
- `docs/` - source-of-truth architecture and ops notes

## Design file format overview

The source format is Obsidian-flavored Markdown plus YAML frontmatter.

Key supported conventions:

- `publish: true` opt-in publishing
- `draft: true` and `private: true` exclusion
- wikilinks such as `[[Note]]`, `[[Note|Alias]]`, and heading links
- Obsidian embeds such as `![[image.png]]`
- inline tags and frontmatter tags
- folder paths as navigation sections
- Markdown extensions are limited to GFM; MDX component syntax is not currently supported

At build time, notes are normalized into typed `PublishedNote` records, then serialized into route content plus `search-index.json`, `graph.json`, `rss.xml`, `sitemap.xml`, and `robots.txt`.

## Troubleshooting

- Search dialog is empty:
  Run `bun run content:sync` to rebuild `public/search-index.json`.
- Graph view is stale:
  Run `bun run graph:build` or `bun run content:sync`.
- Real vault notes are not appearing:
  Check that `OBSIDIAN_VAULT_PATH` points at the vault and that notes include `publish: true`.
- A note disappears from output:
  Confirm it is not under `.obsidian/`, `.git/`, `Templates/`, or a raw `*.excalidraw.md` file.
- Deploy workflow skips:
  Configure `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` in GitHub secrets.
