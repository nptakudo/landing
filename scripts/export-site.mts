import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(
  repoRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next",
);

function readFlag(flag: string) {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
}

async function runCommand(command: string, args: string[], env: NodeJS.ProcessEnv) {
  await new Promise<void>((resolve, reject) => {
    const subprocess = spawn(command, args, {
      cwd: repoRoot,
      env,
      stdio: "inherit",
    });

    subprocess.on("exit", (exitCode) => {
      if (exitCode === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed: ${command} ${args.join(" ")}`));
    });

    subprocess.on("error", reject);
  });
}

const vaultPath = readFlag("--vault-path");
const outputDir = readFlag("--output-dir");
const env = {
  ...process.env,
  ...(vaultPath ? { OBSIDIAN_VAULT_PATH: path.resolve(vaultPath) } : {}),
};

await runCommand("bun", ["run", "content:sync"], env);
await runCommand(nextBin, ["build"], env);

if (outputDir) {
  const sourceOutDir = path.join(repoRoot, "out");
  const targetOutDir = path.resolve(outputDir);

  await fs.rm(targetOutDir, { recursive: true, force: true });
  await fs.mkdir(path.dirname(targetOutDir), { recursive: true });
  await fs.cp(sourceOutDir, targetOutDir, { recursive: true });

  console.log(`Copied static export from ${sourceOutDir} to ${targetOutDir}`);
} else {
  console.log(`Static export ready in ${path.join(repoRoot, "out")}`);
}
