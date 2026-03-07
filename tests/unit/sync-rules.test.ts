import { describe, expect, it } from "vitest";
import { shouldSkipVaultPath } from "@/lib/content/sync-rules";

describe("shouldSkipVaultPath", () => {
  it("skips configured Obsidian/system folders", () => {
    expect(shouldSkipVaultPath(".obsidian/plugins/config.md", "/vault", "/site")).toBe(true);
    expect(shouldSkipVaultPath("Templates/daily.md", "/vault", "/site")).toBe(true);
    expect(shouldSkipVaultPath("tests/fixtures/note.md", "/vault", "/site")).toBe(true);
    expect(shouldSkipVaultPath("projects/tests/fixtures/note.md", "/vault", "/site")).toBe(true);
  });

  it("does not block a regular landing folder in vault content", () => {
    expect(shouldSkipVaultPath("landing/overview.md", "/Users/takudo/Documents/TakudoNotes", "/Users/takudo/Documents/landing-site")).toBe(false);
  });

  it("skips paths that point into the site repo root to prevent recursion", () => {
    expect(
      shouldSkipVaultPath(
        "landing/notes/page.md",
        "/Users/takudo/Documents",
        "/Users/takudo/Documents/landing",
      ),
    ).toBe(true);
  });
});
