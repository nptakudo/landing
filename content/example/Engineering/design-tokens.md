---
publish: true
title: Design Tokens Architecture
description: How to structure design tokens for a scalable CSS system — from primitives to semantic layers.
tags:
  - design
  - tokens
  - css
created: 2026-03-03
updated: 2026-03-08
---

# Design Tokens Architecture

Design tokens are the atomic building blocks of a visual system. This note documents how to structure them for maximum maintainability.

## Token Layers

```
Primitives (raw values)
    ↓
Semantic (contextual meaning)
    ↓
Component (scoped overrides)
```

## Primitives

Raw color, spacing, and typography values:

```css
:root {
  --gray-50: #fafaf9;
  --gray-900: #171717;
  --blue-500: #2362EF;
  --space-1: 4px;
  --space-2: 8px;
  --font-sans: 'Manrope', system-ui, sans-serif;
  --font-serif: 'Newsreader', Georgia, serif;
}
```

## Semantic Tokens

Map primitives to their purpose:

```css
:root {
  --background: var(--gray-50);
  --foreground: var(--gray-900);
  --accent: var(--blue-500);
  --surface: rgba(255, 255, 255, 0.82);
}
```

## Dark Mode

Override semantic tokens, not primitives:

```css
[data-theme="dark"] {
  --background: #0b1016;
  --foreground: #f1ede3;
  --surface: rgba(13, 17, 23, 0.82);
}
```

## Motion Tokens

```css
:root {
  --motion-fast: 150ms;
  --motion-base: 220ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Best Practices

1. **Never hardcode values** — always reference tokens
2. **Keep primitives stable** — semantic layer absorbs theme changes
3. **Document every token** — future you will thank present you
4. **Use CSS custom properties** — they cascade and can be scoped

See also [[Reference/markdown-cheatsheet]] for documenting your token system.
