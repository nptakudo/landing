import chokidar from "chokidar";
import path from "node:path";
import { execa } from "execa";

const vaultPath = process.env.OBSIDIAN_VAULT_PATH ?? "/Users/takudo/Documents/TakudoNotes";
const debounceMs = 800;
let timer: NodeJS.Timeout | undefined;

console.log(`Watching vault: ${vaultPath}`);

const watcher = chokidar.watch(["**/*.md", "**/*.mdx", "**/*.{png,jpg,jpeg,gif,webp,svg,pdf}"], {
  cwd: vaultPath,
  ignored: ["**/.obsidian/**", "**/.git/**"],
  ignoreInitial: true,
});

watcher.on("all", (_event, changedPath) => {
  console.log(`Change detected: ${changedPath}`);

  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(async () => {
    try {
      await execa("pnpm", ["content:sync"], {
        cwd: process.cwd(),
        stdio: "inherit",
        env: {
          ...process.env,
          OBSIDIAN_VAULT_PATH: path.resolve(vaultPath),
        },
      });
    } catch (error) {
      console.error("Failed to sync content:", error);
    }
  }, debounceMs);
});
