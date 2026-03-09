"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { NavigationTreeNode } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

function TreeNode({
  node,
  activeHref,
  defaultExpanded = true,
}: {
  node: NavigationTreeNode;
  activeHref?: string;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (node.kind === "note" && node.slug) {
    const href = `/docs/${node.slug}`;
    const isActive = activeHref === href;

    return (
      <Link
        href={href}
        className={cn(
          "block relative rounded-lg px-3 py-1.5 text-sm transition-all duration-[--motion-fast] -ml-px",
          isActive
            ? "border-l-2 border-[var(--accent)] bg-[var(--accent-surface)] text-[var(--foreground)] font-medium pl-[calc(12px-1px)]"
            : "border-l-2 border-transparent text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] pl-3"
        )}
      >
        {node.noteTitle ?? node.name}
      </Link>
    );
  }

  return (
    <div className="space-y-1 mt-1">
      {node.path ? (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex w-full items-center gap-1.5 rounded-lg px-1.5 py-1.5 text-left transition-colors duration-[--motion-fast] hover:bg-[var(--surface-elevated)]"
        >
          <div className="text-[var(--muted)] transition-transform duration-[--motion-fast]">
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)] pt-0.5">
            {node.name.replace(/-/g, " ")}
          </span>
        </button>
      ) : null}

      {(!node.path || expanded) ? (
        <div className={cn(node.path ? "ml-[11px] border-l border-[var(--border-strong)] flex flex-col gap-px" : "flex flex-col gap-px")}>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} activeHref={activeHref} defaultExpanded={defaultExpanded} />
          ))}
        </div>
      ) : null}
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
    <nav aria-label="File explorer" className="flex flex-col gap-4">
      {tree.children.map((node) => (
        <TreeNode key={node.id} node={node} activeHref={activeHref} />
      ))}
    </nav>
  );
}
