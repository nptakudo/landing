import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { syncPublishedNotes } from "../../src/lib/content";

const fixtureRoot = path.resolve(import.meta.dirname, "../fixtures/vault");
const tempRoots: string[] = [];

describe("syncPublishedNotes", () => {
  afterEach(async () => {
    await Promise.all(tempRoots.map((root) => fs.rm(root, { recursive: true, force: true })));
    tempRoots.length = 0;
  });

  it("mirrors only published notes and referenced assets", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "landing-sync-"));
    const contentRoot = path.join(tempRoot, "content", "notes");
    const assetRoot = path.join(tempRoot, "public", "obsidian-assets");
    tempRoots.push(tempRoot);

    const result = await syncPublishedNotes({
      vaultRoot: fixtureRoot,
      contentRoot,
      assetRoot,
    });

    expect(result.mirroredNotes).toHaveLength(2);
    expect(result.mirroredAssets).toHaveLength(1);
    await expect(fs.stat(path.join(contentRoot, "Guides", "start-here.md"))).resolves.toMatchObject({});
    await expect(fs.stat(path.join(assetRoot, "assets", "hero.svg"))).resolves.toMatchObject({});
    await expect(fs.stat(path.join(contentRoot, "Private", "secret.md"))).rejects.toThrow();
  });
});
