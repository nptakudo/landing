# Design System

## Visual direction
- Zed-inspired editorial interface: clean technical typography, restrained borders, and soft depth.
- Priority on reading rhythm and docs navigation clarity over decorative cards.
- Landing and docs share one token system with route-specific shell variants.

## Stack
- Tailwind CSS v4 tokenized via CSS custom properties in `app/globals.css`.
- Base UI primitives for accessible overlays and collapsibles.
- Motion for small, intentional transitions with reduced-motion support.

## Typography
- UI/body: IBM Plex Sans.
- Headings/display: IBM Plex Serif.
- Code/inline meta: IBM Plex Mono.
- Prose uses `.note-prose` tuned for docs-style long-form readability.

## Tokens
- Semantic tokens live in `app/globals.css` and are mirrored for light/dark themes.
- Core tokens:
  - `--background`, `--background-deep`
  - `--surface`, `--surface-elevated`, `--surface-muted`
  - `--text`, `--text-strong`, `--muted`, `--muted-strong`
  - `--brand`, `--brand-soft`
  - `--border`, `--border-strong`, `--ring`
- Utility surfaces:
  - `.surface-card` for elevated bordered containers
  - `.surface-muted` for nested informational panels

## Shell variants
- `landing` shell:
  - centered content rail
  - marketing-style hero + note-driven blocks
  - top nav with docs/graph links and stat chips
- `docs` shell:
  - persistent left explorer (desktop)
  - mobile drawer navigation hook
  - compact utility nav/search controls

## Motion
- Hero reveal and tree expansion use subtle, short-duration transitions.
- Search dialog opens with compact scale/fade transition.
- All animated components guard behavior with `useReducedMotion`.

## Accessibility baseline
- Keyboard-triggered search remains on `Cmd/Ctrl + K`.
- Focus-visible ring uses tokenized color for both themes.
- Docs navigation remains keyboard reachable on desktop and mobile drawer.
- Contrast targets remain WCAG-friendly for text, borders, and active states.
