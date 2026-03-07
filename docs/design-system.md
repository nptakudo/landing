# Design System

## Visual direction
- Minimal, typography-led reading experience with stronger information hierarchy.
- Warm neutral light theme and deep graphite/blue dark theme.
- Rounded structural cards, subtle elevation, restrained borders, and soft atmospheric gradients.

## Stack
- Tailwind CSS for tokenized styling.
- Base UI primitives for accessible behavior.
- Motion for intentional transitions.

## Typography
- Display: Newsreader.
- UI/body: Manrope.
- Mono: JetBrains Mono.
- Note prose uses custom `.note-prose` styles tuned for long-form readability.

## Tokens
- Global semantic tokens live in `app/globals.css`.
- Core tokens: `--background`, `--surface`, `--surface-muted`, `--text`, `--muted`, `--border`, `--accent`.
- Reusable surface classes:
  - `.surface-card` for elevated cards
  - `.surface-muted` for subtle nested panels

## Motion
- Home hero entrance, sidebar tree expansion, and command dialog transitions.
- Hover micro-interactions on chips/buttons/cards.
- Reduced-motion support through `useReducedMotion` guards in animated client components.

## Accessibility baseline
- Keyboard navigation for all interactive navigation/search components.
- Visible focus rings.
- WCAG-compliant contrast targets.
- Command search supports keyboard shortcut (`Cmd/Ctrl + K`).
