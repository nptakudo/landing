import { beforeEach, describe, expect, it } from "vitest";
import {
  getAllNotes,
  getAllTags,
  getNoteBySlug,
  invalidateContentCache,
} from "@/lib/content/load-content";

describe("content loader", () => {
  beforeEach(() => {
    invalidateContentCache();
  });

  it("loads published notes and builds graph metadata", async () => {
    const notes = await getAllNotes();
    expect(notes.length).toBeGreaterThan(0);

    const first = notes[0];
    const reloaded = await getNoteBySlug(first.slug.split("/"));
    expect(reloaded?.slug).toBe(first.slug);
    expect(reloaded?.toc).toBeInstanceOf(Array);

    const tags = await getAllTags();
    expect(tags.length).toBeGreaterThan(0);
  });
});
