# Personal Obsidian Docs Site Execution Plan

## Goal

Document and operationalize the current Obsidian docs-site implementation so the repository has accurate source-of-truth docs, environment scaffolding, milestone logging, and Bun-based CI and Vercel deployment workflows.

## Constraints

- Use the clean worktree as the source of truth
- Do not edit app code outside the allowed docs and workflow paths
- Keep the docs aligned with the implementation that already exists in `src/`, `scripts/`, `content/`, and `tests/`
- Use Bun commands throughout repo-owned docs and automation

## Current implementation snapshot

- Next.js App Router with static export is already in place
- content sync, search-index generation, and graph generation scripts already exist
- the site uses a separate vault mirror model with repo-local example content fallback
- UI iteration now happens directly in the local Next.js app and localhost preview
- Vercel preview and production automation needs checked-in workflow definitions and documentation

## Milestones

### 1. Documentation baseline

Status: complete on 2026-03-08

Deliver:

- `README.md`
- `.env.example`
- source-of-truth docs under `docs/`
- `plans.md`

### 2. Validation and deployment workflow baseline

Status: complete on 2026-03-08

Deliver:

- `.github/workflows/ci.yml`
- `.github/workflows/deploy-vercel.yml`
- branch-aware preview and production behavior
- separate-vault workflow documentation

### 3. Remaining implementation gaps outside this docs-only scope

Status: narrowed on 2026-03-08

Follow-up areas:

- richer callout and attachment components
- deeper graph interactions such as zoom and focus mode
- reduced-motion refinement
- first real feature-branch preview deployment verification

## Verification plan

- run `bun run lint`
- run `bun run typecheck`
- run `bun run test`
- run `bun run build`
- confirm workflow YAML is present and branch-targeted for `codex/**` and `main`

## Risks

- preview deployment cannot be fully verified without Vercel secrets
- the app currently relies on repo-local example content in automation unless a real vault repo is attached
- some documented design-system invariants are ahead of the shipped UI details and remain open work
