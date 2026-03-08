"use client";

import Link from "next/link";
import { Collapsible } from "@base-ui/react/collapsible";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type TreeNode = {
  id: string;
  label: string;
  href?: string;
  children?: TreeNode[];
};

export function CollapsibleTreeNav({
  nodes,
  density = "comfortable",
  onNavigate,
}: {
  nodes: TreeNode[];
  density?: "comfortable" | "compact";
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-1 text-sm">
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          density={density}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  );
}

function TreeItem({
  node,
  density,
  onNavigate,
}: {
  node: TreeNode;
  density: "comfortable" | "compact";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isActive = node.href ? pathname === node.href : false;
  const rowPadding = density === "compact" ? "px-2 py-1" : "px-2.5 py-1.5";

  if (!node.children || node.children.length === 0) {
    return (
      <li>
        {node.href ? (
          <Link
            href={node.href}
            onClick={onNavigate}
            className={cn(
              "block rounded-md text-[0.86rem]",
              rowPadding,
              "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-strong)]",
              isActive &&
                "bg-[color-mix(in_oklab,var(--brand-soft),transparent_20%)] text-[var(--text-strong)]",
            )}
          >
            {node.label}
          </Link>
        ) : (
          <span className={cn("block rounded-md text-[0.86rem] text-[var(--muted)]", rowPadding)}>
            {node.label}
          </span>
        )}
      </li>
    );
  }

  return (
    <li>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger
          className={cn(
            "group flex w-full items-center justify-between rounded-md text-left text-[0.82rem] font-medium",
            rowPadding,
            "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-strong)]",
          )}
        >
          <span>{node.label}</span>
          <span className="text-[0.62rem] text-[var(--muted)] transition-transform group-data-[panel-open]:rotate-90">
            ▸
          </span>
        </Collapsible.Trigger>
        <Collapsible.Panel className="overflow-hidden pl-2">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -3 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
          >
            <ul className="space-y-1 border-l border-[var(--border)] pl-2.5">
              {node.children.map((child) => (
                <TreeItem
                  key={child.id}
                  node={child}
                  density={density}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </motion.div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </li>
  );
}
