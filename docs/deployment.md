# Deployment

## Primary deployment: Vercel
- CI workflow: `.github/workflows/ci.yml`
- Deploy workflow: `.github/workflows/deploy-vercel.yml`
- `vercel.json` pins framework detection (`nextjs`) to avoid static `NOT_FOUND` deployments from mis-detected project settings.
- Required secrets:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

## Build pipeline
- `pnpm content:sync`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

`pnpm build` executes:
1. `pnpm search:build`
2. `pnpm rss:build`
3. `next build --webpack` (static export)

## Hosting tradeoffs
### Vercel (recommended)
- Best Next.js integration.
- Simplest preview + production deployments.
- Works with static export output.
- Preview deployment URLs can be access-protected depending on team SSO policy; production alias can be promoted for public sharing.

### Cloudflare Pages
- Strong global edge delivery.
- Slightly more custom pipeline setup for Next static export and scripts.

### Netlify
- Straightforward static hosting for exported output.
- Good fallback if Vercel is not preferred.

### GitHub Pages
- Works with static export but least ergonomic for previews and environment handling.

## Sync model options
### 1) Vault in site repo
- Simplest setup.
- Higher accidental-exposure risk if private files are committed.

### 2) Separate vault + mirror into site repo (default)
- Better separation of private authoring and public site.
- Uses `pnpm content:sync` to mirror only published notes/assets.
- Sync excludes system/template/archive folders and test fixtures.
- Sync also guards against self-referential recursion by skipping paths that resolve to the site repo root.
