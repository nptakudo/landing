import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { resolveExportFilePath } from "../../src/lib/site/export-server";

const tempRoots: string[] = [];

async function createExportFixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "landing-export-"));
  tempRoots.push(root);

  await fs.mkdir(path.join(root, "docs", "Guides", "publishing-workflow"), { recursive: true });
  await fs.writeFile(path.join(root, "index.html"), "<h1>Home</h1>");
  await fs.writeFile(path.join(root, "docs.html"), "<h1>Docs</h1>");
  await fs.writeFile(path.join(root, "docs", "Guides", "publishing-workflow", "index.html"), "<h1>Guide</h1>");
  await fs.writeFile(path.join(root, "404.html"), "<h1>Missing</h1>");

  return root;
}

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((root) => fs.rm(root, { recursive: true, force: true })));
});

describe("resolveExportFilePath", () => {
  it("prefers flat .html routes before nested index fallbacks", async () => {
    const outDir = await createExportFixture();

    await expect(resolveExportFilePath(outDir, "/docs")).resolves.toBe(path.join(outDir, "docs.html"));
  });

  it("resolves nested document routes to index.html", async () => {
    const outDir = await createExportFixture();

    await expect(resolveExportFilePath(outDir, "/docs/Guides/publishing-workflow")).resolves.toBe(
      path.join(outDir, "docs", "Guides", "publishing-workflow", "index.html"),
    );
  });

  it("falls back to the static 404 document when a route does not exist", async () => {
    const outDir = await createExportFixture();

    await expect(resolveExportFilePath(outDir, "/missing")).resolves.toBe(path.join(outDir, "404.html"));
  });
});
