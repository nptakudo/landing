import path from "node:path";

const EXCLUDED_PREFIXES = [
  ".obsidian/",
  ".git/",
  "Templates/",
  "zArchive/",
  "Excalidraw/",
  "tests/",
];

export function shouldSkipVaultPath(
  relativePath: string,
  vaultRoot: string,
  siteRoot: string,
): boolean {
  const normalized = relativePath.replace(/\\/g, "/");

  if (EXCLUDED_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    return true;
  }
  if (/(^|\/)tests\//.test(normalized)) {
    return true;
  }

  const absolutePath = path.resolve(vaultRoot, normalized);
  const absoluteSiteRoot = path.resolve(siteRoot);

  if (absolutePath === absoluteSiteRoot) {
    return true;
  }

  return absolutePath.startsWith(`${absoluteSiteRoot}${path.sep}`);
}
