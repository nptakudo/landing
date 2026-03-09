# Search

## Search model

Search is static and file-based. There is no hosted search service and no database-backed index.

Build flow:

1. `loadPublishedNotes()` loads the mirrored notes
2. `buildSearchIndex()` converts them into `SearchIndexEntry[]`
3. `scripts/build-search-index.mts` writes `public/search-index.json`
4. the client search dialog fetches that JSON lazily when opened

## Indexed fields

Current indexed fields are:

- `title`
- `description`
- `aliases`
- `tags`
- `headings`
- `excerpt`
- `body`

The current implementation does not yet index breadcrumbs separately.

## Runtime behavior

`src/components/search/search-dialog.tsx`:

- opens with `Cmd+K` or `Ctrl+K`
- fetches `/search-index.json` on first open
- builds an in-memory MiniSearch index client-side
- boosts `title`, `aliases`, `tags`, and `headings`
- enables prefix search and light fuzzy matching

When the query is empty, the dialog shows the first few indexed notes as default results.

## Privacy and publish filtering

Only publishable notes are loaded into the search index. Draft, private, filtered-path, and excluded-note content must never appear in `public/search-index.json`.

## Current UX scope

The current search experience supports:

- open from the header
- text query over note metadata and body
- direct navigation to note routes

Not yet implemented:

- keyboard result roving and selection
- section-level jump targets
- highlighted match snippets
- faceting or tag-only filtering

## Operational notes

- `bun run search:index` rebuilds the JSON artifact directly
- `bun run content:sync` refreshes it alongside the other generated artifacts used by localhost
- `bun run build` also rebuilds it through the `prebuild` hook
- CI and deploy workflows should set `OBSIDIAN_VAULT_PATH` to a repo-local example vault unless a separate vault checkout is attached
