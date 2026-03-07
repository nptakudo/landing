import { CollapsibleTreeNav } from "@/components/primitives/collapsible-tree-nav";

const navTree = [
  {
    id: "docs",
    label: "Documentation",
    children: [
      { id: "docs-index", label: "Index", href: "/docs" },
      { id: "tags", label: "Tags", href: "/tags/all" },
      { id: "graph", label: "Graph", href: "/graph" },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] p-4 lg:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        Explorer
      </p>
      <CollapsibleTreeNav nodes={navTree} />
    </aside>
  );
}
