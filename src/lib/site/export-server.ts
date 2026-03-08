import fs from "node:fs/promises";
import path from "node:path";

export const EXPORT_CONTENT_TYPES = new Map<string, string>([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
]);

async function exists(candidate: string) {
  try {
    await fs.access(candidate);
    return true;
  } catch {
    return false;
  }
}

export async function resolveExportFilePath(outDir: string, requestPath: string) {
  const pathname = decodeURIComponent(requestPath);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const directCandidate = path.join(outDir, relativePath);

  try {
    const stats = await fs.stat(directCandidate);
    if (stats.isFile()) {
      return directCandidate;
    }
    if (stats.isDirectory()) {
      const indexCandidate = path.join(directCandidate, "index.html");
      if (await exists(indexCandidate)) {
        return indexCandidate;
      }
    }
  } catch {
    // Fall through to static-export route resolution.
  }

  if (!path.extname(relativePath)) {
    const htmlCandidate = path.join(outDir, `${relativePath}.html`);
    if (await exists(htmlCandidate)) {
      return htmlCandidate;
    }

    const nestedIndexCandidate = path.join(outDir, relativePath, "index.html");
    if (await exists(nestedIndexCandidate)) {
      return nestedIndexCandidate;
    }
  }

  return path.join(outDir, "404.html");
}

export function contentTypeFor(filePath: string) {
  return EXPORT_CONTENT_TYPES.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
}
