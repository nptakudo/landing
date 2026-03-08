---
tags:
  - docs
  - design
  - parity
---

# Zed Visual Parity Execution Plan

State: Done

## Goal
Implement a pixel-close Zed-inspired redesign for landing and docs shell routes while preserving content/data behavior.

## Scope
- Included: `/`, `/docs`, `/docs/[...slug]`, shared shell/navigation/search primitives.
- Included: dual-theme support, reduced-motion behavior, Playwright MCP parity captures.
- Excluded: full bespoke redesign of `/tags/[tag]` and `/graph` (shared tokens/shell only).

## Progress checklist
- [x] Phase 0: Capture target/local references with Playwright MCP at `1440x900`, `1200x900`, `390x844`
- [x] Phase 1: Replace global token + typography foundation
- [x] Phase 2: Add route-aware shell variants and upgraded nav/sidebar/search APIs
- [x] Phase 3: Redesign landing route with note-driven content preserved
- [x] Phase 4: Redesign docs index + note page with inline metadata panels
- [x] Phase 5: Update docs/test artifacts and run validation commands

## Playwright MCP parity checklist
Reference screenshots:
- `docs/exec-plans/artifacts/zed-parity/zed-home-1440.png`
- `docs/exec-plans/artifacts/zed-parity/zed-home-1200.png`
- `docs/exec-plans/artifacts/zed-parity/zed-home-390.png`
- `docs/exec-plans/artifacts/zed-parity/zed-docs-1440.png`
- `docs/exec-plans/artifacts/zed-parity/zed-docs-1200.png`
- `docs/exec-plans/artifacts/zed-parity/zed-docs-390.png`

Local post-redesign screenshots:
- `docs/exec-plans/artifacts/zed-parity/local-home-after-1440.png`
- `docs/exec-plans/artifacts/zed-parity/local-home-after-1200.png`
- `docs/exec-plans/artifacts/zed-parity/local-home-after-390.png`
- `docs/exec-plans/artifacts/zed-parity/local-docs-after-1440.png`
- `docs/exec-plans/artifacts/zed-parity/local-docs-after-1200.png`
- `docs/exec-plans/artifacts/zed-parity/local-docs-after-390.png`
- `docs/exec-plans/artifacts/zed-parity/local-note-after-1440.png`
- `docs/exec-plans/artifacts/zed-parity/local-note-after-1200.png`
- `docs/exec-plans/artifacts/zed-parity/local-note-after-390.png`

Target metrics captured via `browser_evaluate`:
- Zed home: header height `57px`, H1 `48px` desktop, H1 `41.75px` mobile
- Zed docs: header height `54px`, left nav width `280px`, content width `690px`, H1 `34px`

Local baseline metrics (before redesign):
- Local home: header height `67px`, left nav width `288px`, content width `824px`, H1 `48px`
- Local docs: header height `67px`, left nav width `288px`, content width `824px`, H1 `48px`
- Local note: main width `824px`, article width `508px` (`1200` viewport)

Local post-redesign metrics (after redesign):
- Local home: header height `63px`, content width `1020px`, H1 `49.6px` (`1200` viewport)
- Local docs: header height `61px`, left nav width `272px`, content width `856px`, H1 `48px` (`1200` viewport)
- Local note: header height `61px`, left nav width `272px`, main width `856px`, article width `856px`, H1 `48px` (`1200` viewport)
- Mobile docs shell: menu button present, sidebar hidden by default (`390x844`)

## Validation
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e`
