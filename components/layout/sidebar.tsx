import { CollapsibleTreeNav } from "@/components/primitives/collapsible-tree-nav";
import type { NavNode } from "@/lib/content/navigation";

export function Sidebar({ nodes }: { nodes: NavNode[] }) {
  const noteCount = countLeafNodes(nodes);

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-[5.5rem] max-h-[calc(100vh-6.5rem)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)]">
        <div className="mb-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
            Explorer
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">{noteCount} published notes</p>
        </div>
        <div className="max-h-[calc(100vh-13rem)] overflow-y-auto pr-1">
          <CollapsibleTreeNav nodes={nodes} />
        </div>
      </div>
    </aside>
  );
}

function countLeafNodes(nodes: NavNode[]): number {
  return nodes.reduce((sum, node) => {
    if (!node.children || node.children.length === 0) {
      return sum + 1;
    }

    return sum + countLeafNodes(node.children);
  }, 0);
}
