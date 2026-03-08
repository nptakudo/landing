import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { buildContentGraph, loadPublishedNotes } from "../src/lib/content";
import { exampleContentRoot, mirroredContentRoot } from "../src/lib/site/source";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(repoRoot, "public", "graph.json");

const mirroredNotes = await loadPublishedNotes(mirroredContentRoot);
const notes = mirroredNotes.length > 0 ? mirroredNotes : await loadPublishedNotes(exampleContentRoot);
const graph = buildContentGraph(notes);

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(graph, null, 2));

console.log(`Wrote graph with ${graph.nodes.length} nodes and ${graph.edges.length} edges to ${outputPath}`);
