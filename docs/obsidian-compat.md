# Obsidian Compatibility

## Supported today

The current pipeline understands these Obsidian-oriented constructs:

- YAML frontmatter
- Markdown plus GFM
- wikilinks such as `[[Note]]`
- aliased wikilinks such as `[[Note|Label]]`
- path-qualified wikilinks such as `[[Guides/Note]]`
- heading links such as `[[Note#Heading]]`
- embeds such as `![[image.png]]` and `![[file.pdf]]`
- frontmatter aliases
- inline hashtags outside fenced code blocks

## Note link resolution

For non-embed wikilinks, resolution order is:

1. exact slug match from the link target
2. current-directory relative path match
3. unique basename match
4. unique alias match

If no unique target exists, content loading fails with a structured error.

## Attachment resolution

For embed links, resolution order is:

1. exact vault-relative asset path
2. current-directory relative asset path
3. unique asset basename match

Resolved attachments are typed as:

- `image`
- `pdf`
- `file`

Mirrored public asset URLs live under `/obsidian-assets/...`.

## Exclusions

These paths are intentionally excluded from page generation:

- `.git`
- `.obsidian`
- `Templates/`
- `*.excalidraw.md`

Private and draft content is also excluded even if it is markdown.

## Failure policy

The current system is strict for published content:

- unresolved note links fail the load
- ambiguous note links fail the load
- unresolved embeds fail the load
- ambiguous embeds fail the load

This protects preview and production builds from silently shipping broken internal references.

## Current rendering limitations

The parser is ahead of the renderer in a few areas:

- inline wikilinks are parsed and validated, but the rendered article HTML still shows the original markdown text rather than converted anchor tags
- callout syntax is not yet transformed into dedicated UI components
- raw Excalidraw notes are excluded as pages rather than rendered specially

Those gaps are known and should be treated as follow-up implementation work, not undocumented behavior.

## Heading and TOC behavior

Headings are extracted with GitHub-style slugs and are used for:

- the right-rail outline
- heading anchors in rendered HTML
- search indexing

The outline rail renders the heading list and highlights the currently visible section on note pages.
