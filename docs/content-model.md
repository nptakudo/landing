# Content Model

## Source
- Source markdown is mirrored into `content/notes` from the Obsidian vault.
- Authoring source of truth remains the local vault.

## Frontmatter
Supported fields:
- `title?: string`
- `publish?: boolean`
- `draft?: boolean`
- `private?: boolean`
- `aliases?: string[] | string`
- `tags?: string[] | string`
- `created?: string`
- `created_date?: string`
- `updated?: string`
- `updated_date?: string`
- `published?: string` (article/source date only)
- `description?: string`

## Derived model
`PublishedNote` includes:
- `id`
- `slug`
- `title`
- `summary`
- `content`
- `tags`
- `aliases`
- `folder`
- `outboundLinks`
- `backlinks`
- `toc`
- `readingTime`
- `createdAt`
- `updatedAt`

## Slug policy
- Slug is path-based from mirrored `content/notes` path.
- Filename normalization is stable and deterministic.
- Home routes never infer from title text.
