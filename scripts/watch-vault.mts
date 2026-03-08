import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chokidar from "chokidar";
import { syncPublishedNotes } from "../src/lib/content/notes";

const vaultRoot = process.env.OBSIDIAN_VAULT_PATH ?? "/Users/takudo/Documents/TakudoNotes";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(repoRoot, "content", "notes");
const assetRoot = path.join(repoRoot, "public", "obsidian-assets");

let syncInFlight = false;
let pending = false;

async function runCommand(args: string[]) {
  await new Promise<void>((resolve, reject) => {
    const subprocess = spawn(args[0], args.slice(1), {
      cwd: repoRoot,
      stdio: "inherit",
    });

    subprocess.on("exit", (exitCode) => {
      if (exitCode === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed: ${args.join(" ")}`));
    });

    subprocess.on("error", reject);
  });
}

async function runSync() {
  if (syncInFlight) {
    pending = true;
    return;
  }

  syncInFlight = true;

  try {
    const result = await syncPublishedNotes({
      vaultRoot,
      contentRoot,
      assetRoot,
    });
    await runCommand(["bun", "run", "search:index"]);
    await runCommand(["bun", "run", "graph:build"]);
    await runCommand(["bun", "run", "feeds:build"]);

    console.log(
      `[sync] notes=${result.mirroredNotes.length} assets=${result.mirroredAssets.length} ${new Date().toISOString()}`,
    );
  } catch (error) {
    console.error("[sync] failed", error);
  } finally {
    syncInFlight = false;
    if (pending) {
      pending = false;
      await runSync();
    }
  }
}

await runSync();

const watcher = chokidar.watch(vaultRoot, {
  ignored: ["**/.git/**", "**/.obsidian/**", "**/Templates/**"],
  ignoreInitial: true,
});

watcher.on("all", async () => {
  await runSync();
});
