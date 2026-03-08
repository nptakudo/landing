# Design System

## Visual direction

The current implementation aims for an editorial docs shell rather than a generic SaaS dashboard:

- warm-neutral light theme
- graphite dark theme
- high-contrast serif display typography
- soft borders and layered surfaces
- restrained motion instead of constant animation

Typography is implemented with:

- `Newsreader` for display and large reading accents
- `Manrope` for UI and body copy

## Layout system

The primary desktop layout is a three-column shell:

- left rail for folder navigation
- center reading column for landing, index, or note content
- right rail for outline or contextual note navigation

`DocsShell` currently uses a `292px / flexible / 244px` desktop grid at `xl` sizes.

## Tokens

The shared visual tokens live in `src/app/globals.css`.

Current token families:

- `--background`
- `--foreground`
- `--muted`
- `--surface`
- `--surface-elevated`
- `--panel`
- `--border-soft`
- `--border-strong`
- `--shadow-soft`
- `--shadow-hero`

## Current component set

Shipped UI primitives and shells include:

- sticky site header
- sidebar tree
- docs shell
- mobile drawer navigation for files and outline
- theme toggle
- search dialog
- outline nav
- breadcrumbs
- landing-page cards
- docs index cards
- note attachment and backlink sections
- active outline tracking
- interactive graph canvas

Still shallow or intentionally minimal:

- custom callout blocks beyond normalized blockquote rendering
- richer attachment cards inside article flow

## Motion

The current implementation uses motion in a limited way:

- search dialog open animation
- card hover lift
- button hover lift

Any new motion must support reduced-motion preferences. That requirement is part of the design system, but the richer reduced-motion handling work is not complete yet because only a small part of the UI currently animates.

## Accessibility baseline

The current design contract is:

- semantic navigation landmarks
- keyboard-accessible header controls
- visible text contrast in both themes
- no layout dependency on color alone
- motion should never communicate essential state by itself

## Design workflow

This project now uses a code-first local design loop. Iterate on the shell, reading surfaces, and interactions directly in the Next.js app and verify the result in localhost during development.

- home page
- docs shell
- note page
- search dialog
- mobile shell

Implementation should rely on the live app, route screenshots, and component structure in `src/app` and `src/components` as the current source of truth.

## Current status note

The shipped visual system already matches the intended typography, surface treatment, and shell proportions. The remaining gap is depth rather than direction: richer content components, more advanced graph interactions, and reduced-motion refinements still need implementation work.
