import type { Metadata } from "next";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import { DocsShell } from "@/components/layout/docs-shell";
import { getGraphData, getNavigationRoot } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Graph",
  description: "Explore note relationships through the published Obsidian knowledge graph.",
  alternates: {
    canonical: "/graph",
  },
};

export default async function GraphPage() {
  const [graph, navigation] = await Promise.all([
    getGraphData(),
    getNavigationRoot(),
  ]);

  return (
    <DocsShell navigation={navigation}>
      <main className="space-y-6">
        <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Graph view
          </p>
          <h1 className="mt-3 font-serif text-5xl tracking-tight text-[var(--foreground)]">
            Relationship graph
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
            The graph view is backed by the same note and link graph that powers
            backlinks and related notes, then rendered client-side as an
            interactive force layout.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Nodes
            </p>
            <p className="mt-2 font-serif text-4xl tracking-tight text-[var(--foreground)]">
              {graph.nodes.length}
            </p>
          </article>
          <article className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Edges
            </p>
            <p className="mt-2 font-serif text-4xl tracking-tight text-[var(--foreground)]">
              {graph.edges.length}
            </p>
          </article>
        </section>

        <GraphCanvas nodes={graph.nodes} edges={graph.edges} />
      </main>
    </DocsShell>
  );
}
