"use client";

import { CollapsibleTreeNav } from "@/components/primitives/collapsible-tree-nav";
import type { NavNode } from "@/lib/content/navigation";
import { cn } from "@/lib/utils";

export type SidebarVariant = "default" | "docs";
export type SidebarDensity = "comfortable" | "compact";

export function Sidebar({
  nodes,
  variant = "docs",
  density = "compact",
  stickyOffset = 74,
  mobileOpen = false,
  onMobileOpenChange,
}: {
  nodes: NavNode[];
  variant?: SidebarVariant;
  density?: SidebarDensity;
  stickyOffset?: number;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}) {
  const noteCount = countLeafNodes(nodes);

  const panel = (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface)]",
        variant === "docs" ? "rounded-xl" : "rounded-2xl",
      )}
    >
      <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
          Explorer
        </p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{noteCount} published notes</p>
      </div>
      <div className="max-h-[calc(100vh-11rem)] overflow-y-auto px-2 py-2">
        <CollapsibleTreeNav
          nodes={nodes}
          density={density}
          onNavigate={onMobileOpenChange ? () => onMobileOpenChange(false) : undefined}
        />
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-[272px] shrink-0 lg:block">
        <div style={{ top: `${stickyOffset}px` }} className="sticky">
          {panel}
        </div>
      </aside>

      {onMobileOpenChange ? (
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden",
            mobileOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
          aria-hidden={!mobileOpen}
        >
          <button
            type="button"
            className={cn(
              "absolute inset-0 bg-black/36 backdrop-blur-[1px] transition-opacity",
              mobileOpen ? "opacity-100" : "opacity-0",
            )}
            onClick={() => onMobileOpenChange(false)}
            aria-label="Close docs navigation"
          />
          <div
            className={cn(
              "relative h-full w-[min(85vw,320px)] p-3 transition-transform",
              mobileOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] text-sm text-[var(--muted-strong)]"
                onClick={() => onMobileOpenChange(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {panel}
          </div>
        </div>
      ) : null}
    </>
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
