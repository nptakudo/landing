# Deployment

## Primary target
- Vercel (primary).

## Portable targets
- Netlify, Cloudflare Pages, GitHub Pages via static export.

## Build pipeline
- GitHub Actions runs:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`

## Content workflows
1. Vault inside site repo.
2. Separate vault repo mirrored into `content/notes` via sync script.

## Privacy controls
- Publish only notes with `publish: true`.
- Exclude `draft: true`, `private: true`, and excluded folders.
