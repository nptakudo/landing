import Link from "next/link";
import type { NavigationTreeNode } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

function TreeNode({
  node,
  activeHref,
}: {
  node: NavigationTreeNode;
  activeHref?: string;
}) {
  if (node.kind === "note" && node.slug) {
    const href = `/docs/${node.slug}`;
    return (
      <Link
        href={href}
        className={cn(
          "block rounded-2xl px-3 py-2 text-sm transition",
          activeHref === href
            ? "bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-[var(--shadow-soft)]"
            : "text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]",
        )}
      >
        {node.noteTitle ?? node.name}
      </Link>
    );
  }

  return (
    <div className="space-y-2">
      {node.path ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          {node.name}
        </p>
      ) : null}
      <div className="space-y-1">
        {node.children.map((child) => (
          <TreeNode key={child.id} node={child} activeHref={activeHref} />
        ))}
      </div>
    </div>
  );
}

export function SidebarTree({
  tree,
  activeHref,
}: {
  tree: NavigationTreeNode;
  activeHref?: string;
}) {
  return (
    <nav aria-label="File explorer" className="space-y-6">
      {tree.children.map((node) => (
        <TreeNode key={node.id} node={node} activeHref={activeHref} />
      ))}
    </nav>
  );
}
