# Content Model

## Source of truth

Obsidian remains the authoring source of truth. The published site consumes mirrored files from `content/notes` or, when that mirror is empty, the checked-in `content/example` dataset.

## Supported frontmatter

The current `NoteFrontmatter` type supports:

- `publish?: boolean`
- `draft?: boolean`
- `private?: boolean`
- `title?: string`
- `description?: string`
- `aliases?: string | string[]`
- `tags?: string | string[]`
- `created?: string`
- `created_date?: string`
- `updated?: string`
- `updated_date?: string`
- `published?: string`
- `author?: string | string[]`
- `source?: string`
- `order?: number`

`parseFrontmatter()` normalizes comma-delimited and array forms for `aliases` and `tags`.

## Visibility rules

A note is publishable only when all of these conditions hold:

- `publish: true`
- `draft` is not `true`
- `private` is not `true`
- the path is not under `.git`, `.obsidian`, or `Templates/`
- the filename is not `*.excalidraw.md`

These rules apply to routing, search, backlinks, graph data, and mirrored output.

## Canonical identity

- `relativePath` is the vault-relative path to the note file
- `slug` is the vault-relative path without extension
- `id` currently matches `slug`
- folder structure is preserved in URLs and navigation

Canonical note URLs are `/docs/<slug>`.

## Field derivation

Title fallback order:

1. frontmatter `title`
2. first markdown heading
3. filename without extension

Date fallback order:

- `createdAt`: `created`, then `created_date`, then filesystem birth time
- `updatedAt`: `updated`, then `updated_date`, then filesystem modified time
- `sourcePublishedAt`: `published`

## Tags and aliases

- Tags merge frontmatter tags and inline hashtags outside fenced code blocks
- Tags are normalized to lowercase without a leading `#`
- Aliases come from frontmatter only in the current implementation
- Tag archive routes are `/tags/<tag>`

The current code lowercases tags but does not yet preserve a separate display label.

## Derived note record

`PublishedNote` is the route-facing content contract. Each record includes:

- source paths and slug
- title, description, excerpt, and rendered HTML
- normalized frontmatter
- aliases and tags
- heading-derived table of contents
- reading time
- created and updated dates
- resolved outbound note links
- backlinks
- resolved attachment embeds
- related note slugs
- folder segments for navigation and grouping

## Generated artifacts

The content model also produces two build artifacts:

- `SearchIndexEntry[]` -> `public/search-index.json`
- `{ nodes, edges }` graph payload -> `public/graph.json`

Both are derived from the same published-note set as the page routes.

## Ordering

- Navigation defaults to folder path order
- Docs index defaults to reverse chronological `updatedAt`, then `createdAt`, then title
- Pager links are based on canonical slug order

The `order` field exists in frontmatter typing but is not yet consumed by route ordering logic.
