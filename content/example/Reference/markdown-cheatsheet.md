---
publish: true
title: Markdown Cheatsheet
description: A comprehensive reference for Markdown syntax — from basics to advanced features like tables, footnotes, and task lists.
tags:
  - markdown
  - reference
created: 2026-03-05
updated: 2026-03-08
---

# Markdown Cheatsheet

A quick reference for everything Markdown. Bookmark this page and refer back whenever you need a syntax refresher.

## Text Formatting

| Syntax | Result |
|---|---|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `~~strikethrough~~` | ~~strikethrough~~ |
| `` `inline code` `` | `inline code` |

## Headings

```md
# H1 — Page title
## H2 — Major section
### H3 — Subsection
#### H4 — Detail heading
```

## Links & Images

```md
[Link text](https://example.com)
![Alt text](image.png)
[[notes-start-here]]
```

## Code Blocks

Use triple backticks with the language name for syntax highlighting:

```python
def hello(name: str) -> str:
    return f"Hello, {name}!"
```

```typescript
const greet = (name: string): string => `Hello, ${name}!`;
```

## Blockquotes & Callouts

```md
> Standard blockquote

> [!NOTE]
> This is a callout in Obsidian
```

## Tables

```md
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

## Task Lists

```md
- [x] Completed task
- [ ] Pending task
- [ ] Another task
```

## Footnotes

```md
Here is a sentence with a footnote.[^1]

[^1]: This is the footnote content.
```

## Math (LaTeX)

Inline math: `$E = mc^2$`

Display math:

```md
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

See also [[Guides/publishing-workflow]] for how these notes get published.
