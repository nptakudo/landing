import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";

const vaultPath = process.env.OBSIDIAN_VAULT_PATH ?? "/Users/takudo/Documents/TakudoNotes";
const notesOutputDir = path.join(process.cwd(), "content", "notes");
const assetsOutputDir = path.join(process.cwd(), "public", "obsidian-assets");

const excludedPrefixes = [
  ".obsidian/",
  ".git/",
  "Templates/",
  "zArchive/",
  "Excalidraw/",
  "landing/",
];

await runSync();

async function runSync() {
  await fs.mkdir(notesOutputDir, { recursive: true });
  await fs.mkdir(assetsOutputDir, { recursive: true });

  await cleanDirectory(notesOutputDir);
  await cleanDirectory(assetsOutputDir);

  const noteFiles = await fg(["**/*.md", "**/*.mdx"], {
    cwd: vaultPath,
    onlyFiles: true,
    dot: false,
  });

  const assetCandidates = await fg(["**/*.*"], {
    cwd: vaultPath,
    onlyFiles: true,
    dot: false,
    ignore: ["**/*.md", "**/*.mdx"],
  });

  const basenameAssetIndex = new Map<string, string[]>();
  for (const candidate of assetCandidates) {
    const key = path.basename(candidate).toLowerCase();
    const existing = basenameAssetIndex.get(key) ?? [];
    existing.push(candidate);
    basenameAssetIndex.set(key, existing);
  }

  const publishedNotes: string[] = [];
  const referencedAssets = new Set<string>();

  for (const relativePath of noteFiles) {
    if (shouldSkip(relativePath)) {
      continue;
    }

    const absolutePath = path.join(vaultPath, relativePath);
    const rawText = await fs.readFile(absolutePath, "utf8");
    const parsed = matter(rawText);

    if (!isPublished(parsed.data as Record<string, unknown>)) {
      continue;
    }

    if (relativePath.endsWith(".excalidraw.md")) {
      continue;
    }

    const outputPath = path.join(notesOutputDir, relativePath);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, rawText, "utf8");
    publishedNotes.push(relativePath);

    for (const link of parseEmbeddedLinks(parsed.content)) {
      const resolvedAsset = resolveAssetPath(link, relativePath, assetCandidates, basenameAssetIndex);
      if (resolvedAsset) {
        referencedAssets.add(resolvedAsset);
      }
    }
  }

  for (const relativeAssetPath of Array.from(referencedAssets).sort()) {
    const source = path.join(vaultPath, relativeAssetPath);
    const destination = path.join(assetsOutputDir, relativeAssetPath);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(source, destination);
  }

  console.log(
    `Synced ${publishedNotes.length} published notes and ${referencedAssets.size} assets from ${vaultPath}`,
  );
}

function parseEmbeddedLinks(markdown: string): string[] {
  const targets: string[] = [];
  const regex = /!\[\[([^\]]+)\]\]/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(markdown)) !== null) {
    const [target] = match[1].split("|");
    const [fileTarget] = target.split("#");
    targets.push(fileTarget.trim());
  }

  return targets;
}

function shouldSkip(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, "/");
  return excludedPrefixes.some((prefix) => normalized.startsWith(prefix));
}

function isPublished(frontmatter: Record<string, unknown>): boolean {
  if (frontmatter.private === true || frontmatter.draft === true) {
    return false;
  }

  return frontmatter.publish === true;
}

function resolveAssetPath(
  rawTarget: string,
  noteRelativePath: string,
  allAssets: string[],
  basenameAssetIndex: Map<string, string[]>,
): string | null {
  const target = rawTarget.trim().replace(/^\//, "");

  const noteDir = path.dirname(noteRelativePath);
  const sameDir = path.normalize(path.join(noteDir, target));
  if (allAssets.includes(sameDir)) {
    return sameDir;
  }

  const assetDirCandidate = path.join("asset", path.basename(target));
  if (allAssets.includes(assetDirCandidate)) {
    return assetDirCandidate;
  }

  const byName = basenameAssetIndex.get(path.basename(target).toLowerCase()) ?? [];
  if (byName.length > 0) {
    return byName[0];
  }

  return null;
}

async function cleanDirectory(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(dir, entry.name);
      if (entry.name === ".gitkeep") {
        return;
      }

      if (entry.isDirectory()) {
        await fs.rm(target, { recursive: true, force: true });
      } else {
        await fs.unlink(target);
      }
    }),
  );
}
