import path from "node:path";

export function normalizeSlashes(input: string): string {
  return input.replace(/\\/g, "/");
}

export function relativeSlug(relativePath: string): string {
  const normalized = normalizeSlashes(relativePath);
  return normalized.replace(/\.(md|mdx)$/i, "");
}

export function folderSegmentsFromSlug(slug: string): string[] {
  const parts = slug.split("/");
  parts.pop();
  return parts.filter(Boolean);
}

export function ensureAbsolute(root: string, relativePath: string): string {
  return path.resolve(root, relativePath);
}
