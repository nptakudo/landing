# WORKFLOW.md

This file defines how an agent should work in this repository.

This repository builds and maintains a personal documentation website that publishes content from a local Obsidian vault to a statically deployed website. The project is content-first, file-based, and optimized for reading, search, backlinks, navigation, and refined motion.

This workflow follows the agent-harness model:

- `AGENTS.md` is the routing map, not the full manual
- `docs/` is the system of record
- medium/large tasks require an execution plan checked into the repo
- behavior changes must update the corresponding source-of-truth docs
- validation must produce direct evidence for the changed behavior

## Source of truth

Before starting work, consult the relevant repo docs.

Core docs:

- `AGENTS.md`
- `docs/architecture.md`
- `docs/content-model.md`
- `docs/obsidian-compat.md`
- `docs/design-system.md`
- `docs/search.md`
- `docs/deployment.md`
- `docs/exec-plans/active/`
- `docs/exec-plans/completed/`

If the needed rule or decision is not documented in the repository, treat that as missing project knowledge and add or update the appropriate doc as part of the task.

## Default posture

- Start by identifying the task type and routing to the correct flow.
- Reproduce first whenever fixing a bug or changing behavior.
- Spend effort up front on plan quality and verification design.
- Prefer repository-local, inspectable solutions over opaque abstractions.
- Keep changes narrow and task-focused.
- Preserve the local-first Obsidian authoring workflow.
- Prefer static generation and file-based indexing over runtime services.
- Do not rely on external chats, undocumented assumptions, or human memory as a source of truth.
- When discovering meaningful out-of-scope improvements, record them in repo-local planning docs instead of silently expanding scope.

## Task routing

Route work into one of these categories:

### 1. Content pipeline work
Use this for:

- frontmatter schema changes
- wikilink resolution
- callouts
- tag extraction
- aliases
- backlinks
- attachment handling
- private/draft filtering
- slug generation
- content ingestion

Primary docs:

- `docs/content-model.md`
- `docs/obsidian-compat.md`
- `docs/search.md`

### 2. Site UI / UX work
Use this for:

- navigation
- layout
- note page templates
- TOC
- breadcrumbs
- tag pages
- recent notes
- theme handling
- search dialog
- responsive behavior
- animation and motion polish

Primary docs:

- `docs/architecture.md`
- `docs/design-system.md`

### 3. Deployment / workflow work
Use this for:

- GitHub Actions
- preview builds
- hosting config
- sync model between Obsidian and repo
- static export behavior
- CI validation
- asset handling in deploys

Primary docs:

- `docs/deployment.md`
- `docs/architecture.md`

### 4. Architecture / cross-cutting work
Use this for:

- folder boundaries
- type systems
- shared utilities
- testing strategy
- search indexing architecture
- major framework or build changes

Primary docs:

- `docs/architecture.md`
- `docs/search.md`
- relevant subsystem docs

## Execution plans

For medium or large tasks, create or update an execution plan in:

- `docs/exec-plans/active/<task-name>.md`

A task is medium or large if it changes behavior across multiple files, affects content semantics, touches deployment, changes architecture, or needs multi-step validation.

Execution plans must include:

- problem statement
- scope
- non-goals
- affected docs
- implementation plan
- verification plan
- decisions and tradeoffs
- progress checklist
- open questions
- final outcome summary

When the task is complete, move the plan to:

- `docs/exec-plans/completed/<task-name>.md`

Small tasks may use a lightweight plan in the PR/commit context, but if the work grows, promote it into a checked-in execution plan.

## Workflow states

This repo uses workflow states conceptually, even if there is no external tracker.

### Proposed
The task is identified but not yet being actively changed.

### In Progress
Implementation and verification are underway.

### Review Ready
Code, docs, and validation are complete and aligned.

### Rework
Feedback or failed validation requires another implementation pass.

### Done
All required validation passed, docs are updated, and the task is complete.

Use these states to guide behavior even if there is no issue tracker integration.

## Step 0: Understand the current task

Before editing:

1. Identify the exact user/task request.
2. Determine whether this is:
   - bug fix
   - feature
   - refactor
   - docs update
   - deploy/workflow change
   - architecture change
3. Open the relevant source-of-truth docs.
4. Check whether an existing execution plan already exists for the work.
5. If the task is medium/large, create or refresh the execution plan before implementation.

## Step 1: Reproduce or establish baseline

For any behavioral change:

- Confirm the current behavior before changing code.
- For bugs, reproduce the issue directly.
- For features, establish the current baseline and missing capability.
- For UI changes, inspect the current route/component state first.
- For content pipeline changes, use a minimal test fixture or example content to prove the current behavior.

Do not start by patching blindly.

## Step 2: Define acceptance criteria

Before implementation, write down the acceptance criteria in the execution plan or task notes.

Acceptance criteria should be concrete and observable.

Examples:

- wikilinks resolve to canonical note routes
- private notes are excluded from production output
- backlinks are shown for notes with inbound links
- note pages render Obsidian callouts correctly
- reduced-motion users do not get animated transitions
- build succeeds on a fresh clone with the documented workflow

If docs describe required behavior, mirror that behavior exactly in the acceptance criteria.

## Step 3: Choose the smallest correct implementation

Implementation rules:

- Keep content parsing in `lib/content` or `lib/obsidian`.
- Do not parse markdown directly in route/page components.
- Keep rendering concerns separate from parsing/normalization concerns.
- Prefer strong schemas and typed metadata models.
- Prefer pure utility functions for content transforms.
- Use Base UI primitives for accessible structure, not visual opinion.
- Use Motion selectively and always support reduced motion.
- Do not introduce a database, CMS, or backend service unless explicitly required.
- Do not expand scope to opportunistic cleanup unless it is necessary for correctness.

## Step 4: Keep repo knowledge current while working

As implementation evolves:

- update the execution plan checklist
- record important decisions and tradeoffs
- update source-of-truth docs when behavior changes
- add examples/fixtures when changing parsing behavior
- add tests when changing link resolution, search, slugs, metadata, or visibility filtering

Do not leave critical behavior only in code. Encode it into repo-local docs where future agents can find it.

## Step 5: Validate with direct evidence

Every change needs validation proportional to its scope.

### Minimum validation
Run:

```bash
pnpm lint
pnpm typecheck
pnpm build
