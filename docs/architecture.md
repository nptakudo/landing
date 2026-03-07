# Architecture

## Framework choice
The site uses Next.js App Router with static export enabled (`output: 'export'`).

Rationale:
- React ecosystem support for Base UI and Motion.
- Static export keeps deployment portable.
- App Router metadata APIs simplify SEO and sitemap generation.

## Runtime model
- Build-time only data processing from local files.
- No database, no CMS, no backend API for content.
- Generated artifacts:
  - normalized note graph
  - search index JSON
  - static routes for docs and tags

## Domain boundaries
- `lib/obsidian`: Obsidian syntax parsing and normalization utilities.
- `lib/content`: content loading, filtering, graph/backlink derivation.
- `lib/search`: search index construction and query utilities.
- `components/*`: rendering and UI behavior only.
- `app/*`: route composition and metadata wiring.

## Key invariants
- Only `publish: true` notes can be published.
- `draft: true` and `private: true` are always excluded.
- Wikilinks resolve through one canonical slug system.
- Broken links in published content fail build with structured diagnostics.
