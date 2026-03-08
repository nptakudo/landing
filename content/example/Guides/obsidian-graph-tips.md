---
publish: true
title: Obsidian Graph Tips
description: Practical tips for getting the most out of the Obsidian graph view — filtering, styling, and navigating your knowledge network.
tags:
  - obsidian
  - graph
  - tips
created: 2026-03-06
updated: 2026-03-08
---

# Obsidian Graph Tips

The graph view is one of Obsidian's most visually compelling features. Here are some practical tips to get the most out of it.

## Filtering Nodes

Use the search bar in graph view to focus on specific clusters:

```
tag:#engineering OR tag:#design
```

You can also filter by path to show only notes from a specific folder:

```
path:Guides/
```

## Color Groups

Set up color groups in **Settings → Graph → Color groups** to visually distinguish note types:

| Group | Filter | Color |
|---|---|---|
| Guides | `path:Guides/` | Blue |
| Engineering | `tag:#engineering` | Green |
| Templates | `path:Templates/` | Orange |

## Local vs Global Graph

- **Local graph** (`Ctrl+Shift+G`) shows the immediate neighborhood of the current note
- **Global graph** shows all notes and their connections
- Use the **depth** slider on local graph to expand the radius

## Force Settings

Tweak these in the graph settings panel:

- **Center force**: 0.3 — keeps the graph centered without too much compression
- **Repel force**: 8.0 — gives nodes room to breathe
- **Link force**: 0.7 — pulls connected notes closer together
- **Link distance**: 120 — sweet spot for readability

## Performance

For vaults with 500+ notes, consider:

1. Enabling **GPU acceleration** in Settings → Advanced
2. Reducing animation quality to "Low"
3. Using local graph instead of global for day-to-day navigation

See also [[notes-start-here]] for getting started with this vault.
