import { CollapsibleTreeNav } from "@/components/primitives/collapsible-tree-nav";
import type { NavNode } from "@/lib/content/navigation";

export function Sidebar({ nodes }: { nodes: NavNode[] }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] p-4 lg:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        Explorer
      </p>
      <CollapsibleTreeNav nodes={nodes} />
    </aside>
  );
}
