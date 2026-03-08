# AGENTS.md

This file is a routing map for agents working in this repository. It is not the full project manual.

## Purpose

Build and maintain a personal docs website that publishes notes from a local Obsidian vault to a statically deployed site. The project is content-first, file-based, and optimized for reading, search, backlinks, and elegant motion.

## Source of truth

Repository-local docs are the system of record:

- `docs/architecture.md` — app structure, domain boundaries, rendering flow
- `docs/content-model.md` — note schema, metadata, slugs, backlinks, tags
- `docs/obsidian-compat.md` — wikilinks, callouts, aliases, embeds, attachments, draft/private rules
- `docs/design-system.md` — Base UI, Tailwind, Motion, accessibility, theming
- `docs/deployment.md` — sync model, CI/CD, preview, hosting
- `docs/search.md` — indexing and retrieval behavior
- `docs/exec-plans/` — active and completed implementation plans

If behavior changes, update the relevant source-of-truth doc in the same change.

## Core invariants

- Obsidian content is the source of truth. Do not add a CMS or database unless explicitly required.
- Content parsing must live in `lib/content` or `lib/obsidian`, not in route components.
- Private or draft notes must never appear in production output.
- Wikilinks must resolve through one canonical slug/linking system.
- Broken links must fail clearly or emit structured warnings.
- Animated UI must support reduced motion.
- Prefer static generation and file-based indexing.
- Prefer simple, inspectable, repo-local implementations over opaque abstractions.

## Workflow

For medium or large tasks, create or update an execution plan under `docs/exec-plans/active/`.

Before handoff, run:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
