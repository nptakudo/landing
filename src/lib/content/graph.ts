import type { GraphEdge, GraphNode, PublishedNote } from "./types";

export function buildContentGraph(notes: PublishedNote[]): {
  nodes: GraphNode[];
  edges: GraphEdge[];
} {
  const nodes = notes.map((note) => ({
    id: note.slug,
    slug: note.slug,
    title: note.title,
    group: note.folderSegments[0] ?? "root",
  }));

  const edges: GraphEdge[] = [];
  const seen = new Set<string>();

  for (const note of notes) {
    for (const link of note.links) {
      const key = `${note.slug}->${link.slug}:link`;
      if (!seen.has(key)) {
        edges.push({
          source: note.slug,
          target: link.slug,
          kind: "link",
          weight: 1,
        });
        seen.add(key);
      }
    }

    for (const relatedSlug of note.relatedSlugs) {
      const [left, right] = [note.slug, relatedSlug].sort();
      const key = `${left}<->${right}:related`;
      if (!seen.has(key)) {
        edges.push({
          source: note.slug,
          target: relatedSlug,
          kind: "related",
          weight: 0.5,
        });
        seen.add(key);
      }
    }
  }

  return { nodes, edges };
}
