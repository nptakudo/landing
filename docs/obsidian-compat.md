# Obsidian Compatibility

## Supported syntax (v1)
- Standard Markdown.
- YAML frontmatter.
- Wikilinks: `[[Note]]`, `[[Note|Alias]]`, `[[path/Note]]`, `[[Note#Heading]]`.
- Embeds: `![[image.png]]`, `![[file.pdf]]`.
- Tags from frontmatter and inline markdown hashtags.
- Aliases from frontmatter.
- Obsidian callouts (`> [!note]`).

## Resolution behavior
- Link resolution searches published notes only.
- Path links are resolved first, then exact title/alias, then unique filename.
- Ambiguous or missing targets emit structured diagnostics; unresolved links in published notes fail build.

## Exclusions
- `.obsidian`, `.git`, hidden paths.
- `Templates/`.
- Raw `.excalidraw.md` note pages are excluded in v1.
