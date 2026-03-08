---
publish: true
title: Git Workflow for Docs
description: A streamlined Git branching strategy optimized for documentation projects and digital gardens.
tags:
  - git
  - workflow
  - dev
created: 2026-03-04
updated: 2026-03-08
---

# Git Workflow for Docs

Documentation projects have different needs than application code. Here's a Git workflow optimized for docs and digital gardens.

## Branch Strategy

```
master          ← production (deployed)
├── content/*   ← new notes and content updates
├── feature/*   ← UI/layout changes
└── fix/*       ← bug fixes
```

## Daily Flow

1. **Pull latest** from master before starting work
2. **Create a branch** for your changes:
   ```bash
   git checkout -b content/add-graph-tips
   ```
3. **Write and commit** with conventional commit messages:
   ```bash
   git commit -m "docs: add obsidian graph tips guide"
   ```
4. **Push and create PR** for review:
   ```bash
   git push -u origin content/add-graph-tips
   gh pr create --base master
   ```

## Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) spec:

| Prefix | Use |
|---|---|
| `docs:` | Content changes (new notes, edits) |
| `feat:` | UI features, new components |
| `fix:` | Bug fixes |
| `style:` | CSS/design changes |
| `chore:` | Tooling, config, dependencies |

## Handling Conflicts

Content conflicts are common when multiple people edit the same note:

```bash
git fetch origin
git rebase origin/master
# Resolve conflicts in your editor
git add .
git rebase --continue
```

See also [[Guides/publishing-workflow]] and [[notes-start-here]] for the full publishing pipeline.
