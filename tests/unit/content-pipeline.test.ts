import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildContentGraph,
  buildNavigationTree,
  buildSearchIndex,
  loadPublishedNotes,
} from "../../src/lib/content";

const fixtureRoot = path.resolve(import.meta.dirname, "../fixtures/vault");

describe("content pipeline", () => {
  it("loads only published notes that pass path filters", async () => {
    const notes = await loadPublishedNotes(fixtureRoot);

    expect(notes.map((note) => note.slug).sort()).toEqual([
      "Guides/second-note",
      "Guides/start-here",
    ]);
  });

  it("resolves wikilinks, attachments, backlinks, and related notes", async () => {
    const notes = await loadPublishedNotes(fixtureRoot);
    const startHere = notes.find((note) => note.slug === "Guides/start-here");
    const second = notes.find((note) => note.slug === "Guides/second-note");

    expect(startHere?.links[0]?.slug).toBe("Guides/second-note");
    expect(startHere?.attachments[0]?.type).toBe("image");
    expect(second?.backlinks[0]?.slug).toBe("Guides/start-here");
    expect(startHere?.relatedSlugs).toContain("Guides/second-note");
    expect(startHere?.html).toContain('href="/docs/Guides/second-note"');
    expect(startHere?.html).toContain('src="/obsidian-assets/assets/hero.svg"');
    expect(startHere?.headings.map((heading) => heading.text)).toEqual(["Overview"]);
  });

  it("builds search docs, graph data, and tree navigation", async () => {
    const notes = await loadPublishedNotes(fixtureRoot);
    const searchEntries = buildSearchIndex(notes);
    const graph = buildContentGraph(notes);
    const tree = buildNavigationTree(notes);

    expect(searchEntries).toHaveLength(2);
    expect(graph.nodes).toHaveLength(2);
    expect(graph.edges.some((edge) => edge.kind === "link")).toBe(true);
    expect(tree.children[0]?.kind).toBe("folder");
  });
});
