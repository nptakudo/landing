#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"

cd "$repo_root"

if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is required." >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "Error: pnpm is required." >&2
  exit 1
fi

echo "==> Installing dependencies"
pnpm install

if [ -d "content" ]; then
  echo "==> Found content directory"
else
  echo "==> No content directory found yet"
  echo "    Make sure your Obsidian vault or mirrored notes are available before building."
fi

echo "==> Running initial validation"
pnpm typecheck
pnpm build

echo "Setup complete."
echo "Next steps:"
echo "  pnpm dev"
