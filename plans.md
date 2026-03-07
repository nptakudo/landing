# Personal Obsidian Docs Site Plan

## Architecture Overview
- Framework: Next.js App Router with static export (`output: 'export'`).
- Content source: Obsidian vault mirrored into repo-local `content/notes`.
- Rendering: Markdown/MDX transformed through a normalization pipeline.
- Knowledge features: backlinks, tags, related notes, TOC, search index, optional graph view.
- Deployment: Vercel primary, static-export portable to Netlify/Cloudflare/GitHub Pages.

## Milestones
- [x] Milestone 1 - Planning and repository bootstrap
- [ ] Milestone 2 - App scaffold and design system foundation
- [ ] Milestone 3 - Vault sync and normalization pipeline
- [ ] Milestone 4 - Core site experience
- [ ] Milestone 5 - Search and knowledge features
- [ ] Milestone 6 - SEO, feeds, deployment workflows
- [ ] Milestone 7 - Hardening and handoff

## Milestone Status Log
### Milestone 1
Status: Completed

Files created/updated:
- `plans.md`
- `documentation.md`
- `docs/architecture.md`
- `docs/content-model.md`
- `docs/obsidian-compat.md`
- `docs/design-system.md`
- `docs/search.md`
- `docs/deployment.md`
- `docs/exec-plans/active/personal-docs-site.md`

What works now:
- Source-of-truth documentation exists and is aligned to project constraints.
- Execution plan is now tracked inside repo under `docs/exec-plans/active`.

How to verify:
- Open each `docs/*.md` file and confirm architecture/content/deployment policies are defined.

Tradeoffs:
- Detailed implementation specifics deferred to subsequent milestones.

## Verification Checklist
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`

## Decisions and Defaults
- Next.js selected over Astro due to React-first interactive UI requirements and Base UI/Motion alignment.
- Publish policy is strict opt-in (`publish: true`) with hard blocks for `draft/private`.
- Separate-vault mirroring is the default workflow.
- Vercel is primary hosting target.

## Risk Register
- Private note leakage if publish filtering is wrong.
- Wikilink ambiguity across similarly named notes.
- Static export limitations for runtime features.
- Attachment path collisions from duplicated filenames.

## Demo Script
1. Run vault sync into `content/notes`.
2. Start local dev server.
3. Browse docs index and open notes.
4. Verify backlinks, tags, TOC, related notes.
5. Open search command dialog and query by title/tag/body.
6. Build and deploy from CI.
