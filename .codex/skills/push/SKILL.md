---
name: push
description:
  Push current branch changes to origin and create or update the corresponding
  pull request; use when asked to push, publish updates, or create a pull request.
---

# Push

## Prerequisites

- `gh` CLI is installed and available in `PATH`.
- `gh auth status` succeeds for GitHub operations in this repo.
- The repo has a working local validation command set.

## Goals

- Push current branch changes to `origin` safely.
- Create a PR if none exists for the branch, otherwise update the existing PR.
- Keep branch history clean when the remote has moved.

## Related Skills

- `pull`: use this when push is rejected or sync is not clean (non-fast-forward,
  merge conflict risk, or stale branch).

## Steps

1. Identify the current branch and confirm remote state.
2. Run local validation before pushing.
3. Push branch to `origin` with upstream tracking if needed, using the configured remote.
4. If push is not clean or is rejected:
   - If the failure is a non-fast-forward or sync problem, run the `pull`
     skill to sync with `origin/main`, resolve conflicts, and rerun validation.
   - Push again; use `--force-with-lease` only when history was intentionally rewritten.
   - If the failure is due to auth, permissions, branch protection, or workflow
     restrictions on the configured remote, stop and surface the exact error
     instead of rewriting remotes or changing protocols as a workaround.

5. Ensure a PR exists for the branch:
   - If no PR exists, create one.
   - If a PR exists and is open, update it.
   - If the branch is tied to a closed or merged PR, create a new branch and PR.
   - Write a proper PR title that clearly describes the actual change outcome.
   - On branch updates, reconsider whether the current PR title still matches
     the latest scope; update it if it no longer fits.

6. Write or update the PR body explicitly using `.github/pull_request_template.md` if it exists:
   - Fill every section with concrete content for this change.
   - Replace all placeholder comments (`<!-- ... -->`).
   - Keep bullets and checkboxes where the template expects them.
   - If the PR already exists, refresh the body so it reflects the total PR scope,
     not just the newest commits.
   - Do not reuse stale description text from earlier iterations.
   - If no template exists, write a structured body with summary, changes, validation, and risks.

7. Run repo-appropriate validation for the PR body and change set if such checks exist.
8. Reply with the PR URL from `gh pr view`.

## Commands

```sh
# Identify branch
branch=$(git branch --show-current)

# Minimal validation gate for a Node/React docs-site repo
pnpm lint
pnpm typecheck
pnpm build

# Optional tests if present
pnpm test || true

# Initial push: respect the current origin remote
git push -u origin HEAD

# If that failed because the remote moved, use the pull skill.
# After resolving sync issues and rerunning validation, retry:
git push -u origin HEAD

# Only if history was intentionally rewritten locally
git push --force-with-lease origin HEAD

# Ensure a PR exists
pr_state=$(gh pr view --json state -q .state 2>/dev/null || true)
if [ "$pr_state" = "MERGED" ] || [ "$pr_state" = "CLOSED" ]; then
  echo "Current branch is tied to a closed PR; create a new branch + PR." >&2
  exit 1
fi

# Write a clear, human-friendly title that summarizes the shipped change
pr_title="<clear PR title written for this change>"

if [ -z "$pr_state" ]; then
  gh pr create --title "$pr_title"
else
  gh pr edit --title "$pr_title"
fi

# Write/edit PR body to match .github/pull_request_template.md if present
# Example workflow:
# 1) open the template and draft body content for this PR
# 2) gh pr edit --body-file /tmp/pr_body.md
# 3) on branch updates, re-check that title/body still match the current diff

# Show PR URL for the reply
gh pr view --json url -q .url
