import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncPublishedNotes } from "../src/lib/content/notes";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vaultRoot = path.resolve(process.env.OBSIDIAN_VAULT_PATH ?? path.join(repoRoot, "content", "example"));
const contentRoot = path.join(repoRoot, "content", "notes");
const assetRoot = path.join(repoRoot, "public", "obsidian-assets");

const result = await syncPublishedNotes({
  vaultRoot,
  contentRoot,
  assetRoot,
});

console.log(
  JSON.stringify(
    {
      mirroredNotes: result.mirroredNotes.length,
      mirroredAssets: result.mirroredAssets.length,
      contentRoot,
      assetRoot,
    },
    null,
    2,
  ),
);
