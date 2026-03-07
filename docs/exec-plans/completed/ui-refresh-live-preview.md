# UI Refresh + Live Preview Execution Plan

State: Done

## Problem
Current UI is functionally correct but visually flat, low-contrast in key surfaces, and not aligned with the premium docs/digital-garden direction. The user also requested visible live-browser validation and immediate preview/deployability.

## Scope
- Redesign core shell and page templates for a premium, typography-led reading experience.
- Improve navigation, hierarchy, and note readability across home/docs/note/tag/graph routes.
- Add motion polish while preserving reduced-motion behavior.
- Add visual regression-style Playwright checks for key routes.
- Sync published notes from local Obsidian vault and redeploy from branch.

## Non-goals
- Content model/schema changes.
- Replacing the search engine or content parsing architecture.
- Introducing database/backend services.

## Affected docs
- `plans.md`
- `documentation.md`
- `docs/design-system.md`
- `docs/exec-plans/active/ui-refresh-live-preview.md`

## Acceptance criteria
- Primary routes (`/`, `/docs`, `/docs/[slug]`, `/tags/[tag]`, `/graph`) have improved visual hierarchy, spacing, and readability.
- Search, backlinks, tags, TOC, and pager remain functional.
- UI supports dark mode and reduced-motion.
- Playwright can capture key route screenshots without errors.
- Local preview runs and opens in visible Chrome.
- Branch is pushed and Vercel preview reflects latest UI.

## Implementation plan
1. Baseline and planning
- Capture before screenshots using Playwright.
- Document baseline findings and redesign targets.

2. Shell + design token refresh
- Refine global tokens and typographic scale.
- Upgrade top nav/sidebar visuals and interaction affordances.

3. Page template redesign
- Refresh home/docs/note/tag/graph layouts with stronger information hierarchy.
- Improve cards/lists/chips/prose treatment and sidebar/right-rail presentation.

4. Validation + deploy
- Add Playwright visual smoke test for route loading and screenshot generation.
- Run lint/typecheck/test/build.
- Sync vault content, push branch, and create fresh Vercel preview deploy.
- Update docs and final milestone notes.

## Verification plan
- `pnpm content:sync`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e`
- Manual local preview at `http://127.0.0.1:3000`
- Vercel preview URL load check

## Decisions and tradeoffs
- Keep Next.js App Router architecture intact to avoid risky structural changes.
- Prioritize readability and structure over decorative complexity.
- Use lightweight screenshot-based Playwright verification rather than brittle pixel snapshots.

## Risks
- Over-styling can harm readability; mitigate with restrained palette and spacing rhythm.
- CSS changes can regress dark mode; mitigate via route checks in both themes.
- Local vault may have no `publish: true` notes; fallback content remains intact.

## Progress checklist
- [x] Baseline screenshots captured
- [x] Milestone A: update plan/docs and lock redesign direction
- [x] Milestone B: implement shell/design token refresh
- [x] Milestone C: implement page template refresh
- [x] Milestone D: validate, sync, deploy, and document outcomes

## Implementation notes
- Playwright browser install was required (`npx playwright install chromium`) before screenshot capture.
- Added keyboard search shortcut (`Cmd/Ctrl + K`) and route smoke coverage in `tests/e2e/ui-smoke.spec.ts`.
- Fixed sync filtering to prevent recursion by absolute path resolution rather than blanket `landing/` exclusion.

## Final outcome summary
- UI refresh shipped across all primary routes with improved hierarchy, spacing, and readability.
- Local live preview is available on dev server and static-export server.
- Validation passed for lint, typecheck, unit tests, build, and Playwright e2e smoke.
- Branch preview deploy: `https://landing-m71a8n8pg-nptakudos-projects.vercel.app`.
