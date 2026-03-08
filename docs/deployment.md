# Deployment

## Hosting model

The primary deployment target is Vercel. The app is statically exported, so the build output remains portable, but Vercel is the operational default because it fits the App Router workflow and branch-preview model best.

## Branch environments

- `main` -> production deployment
- `codex/**` -> preview deployment

The current feature branch for this milestone is `codex/obsidian-docs-site-v2`.

## CI workflow

`.github/workflows/ci.yml` is the validation workflow.

It runs on:

- pull requests
- pushes to `main`
- pushes to `codex/**`

It performs:

- `bun install --frozen-lockfile`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

CI sets `OBSIDIAN_VAULT_PATH` to `content/example` so the build remains deterministic in a clean checkout.

## Vercel deploy workflow

`.github/workflows/deploy-vercel.yml` is the deployment workflow.

It runs on:

- pushes to `main`
- pushes to `codex/**`
- `workflow_dispatch`
- `repository_dispatch` with type `vault-sync`

Behavior:

- non-main refs run `vercel pull --environment=preview`, `vercel build`, and `vercel deploy --prebuilt`
- `main` runs `vercel pull --environment=production`, `vercel build --prod`, and `vercel deploy --prebuilt --prod`

The workflow writes the deployment URL to the GitHub Actions summary.

## Separate vault mirror model

This repo assumes the website repo and the authoring vault can be separate.

Two supported modes:

1. Repo-local example or mirrored content only
2. Separate private vault repo checked out during deploy

When `VAULT_REPO` is configured:

- the deploy workflow checks out the vault repo into `.vault-source`
- `OBSIDIAN_VAULT_PATH` is pointed at that checkout
- `bun run content:sync` mirrors notes and assets, then refreshes the generated public artifacts before the Vercel build

When `VAULT_REPO` is not configured:

- workflows use `content/example` as the safe default content source

## Required secrets and variables

GitHub secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VAULT_REPO_TOKEN` if the separate vault repo is private

Repo variables:

- `VAULT_REPO`
- `VAULT_REF`
- optionally `SITE_URL` for deploy metadata consistency

Local environment:

- `OBSIDIAN_VAULT_PATH`
- `SITE_URL`

The deployed app currently reads the canonical URL from `site.config.ts`, not from `SITE_URL`.

## Preview workflow

For this milestone:

1. push `codex/obsidian-docs-site-v2`
2. let `ci.yml` validate the branch
3. let `deploy-vercel.yml` create a preview deployment
4. record the preview URL in `plans.md`

## Tradeoffs

- Vercel gives the cleanest preview ergonomics, but the repo remains build-portable because output is static
- the example-content fallback keeps automation stable, but it means preview builds do not reflect private vault content unless the separate-vault workflow is configured
- static export avoids runtime complexity, but anything dynamic must be generated ahead of time
- mirrored vault content and generated search/feed files are ignored from git so local authoring does not accidentally commit private or derived output
