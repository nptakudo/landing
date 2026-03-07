# Search

## Approach
- Build-time generated MiniSearch index.
- Client-side querying in a command dialog.
- No external service, no runtime indexing.

## Indexed fields
- Title
- Aliases
- Headings
- Tags
- Content excerpt/body text

## Ranking
- Weighted boosts for title and aliases over body text.
- Deterministic serialization for reproducible builds.

## Artifacts
- `public/search-index.json` generated at build step.
