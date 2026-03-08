import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contentTypeFor, resolveExportFilePath } from "../src/lib/site/export-server";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(repoRoot, "out");
const port = Number(process.env.PORT ?? "3000");
const hostname = process.env.HOST ?? "0.0.0.0";

try {
  await fs.access(outDir);
} catch {
  console.error(`Static export directory not found at ${outDir}. Run bun run build first.`);
  process.exit(1);
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${hostname}:${port}`);
  const filePath = await resolveExportFilePath(outDir, requestUrl.pathname);

  try {
    const body = await fs.readFile(filePath);
    response.writeHead(filePath.endsWith("404.html") ? 404 : 200, {
      "Cache-Control": "no-store",
      "Content-Type": contentTypeFor(filePath),
    });
    response.end(body);
  } catch {
    response.writeHead(404, {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end("Not found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Serving static export from ${outDir} at http://${hostname}:${port}`);
});
