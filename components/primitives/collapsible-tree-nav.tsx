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

export function CollapsibleTreeNav({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {nodes.map((node) => (
        <TreeItem key={node.id} node={node} />
      ))}
    </ul>
  );
}

function TreeItem({ node }: { node: TreeNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isActive = node.href ? pathname === node.href : false;

  if (!node.children || node.children.length === 0) {
    return (
      <li>
        {node.href ? (
          <Link
            href={node.href}
            className={cn(
              "block rounded-lg px-2.5 py-1.5 text-[0.83rem] text-[var(--muted)]",
              "hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
              isActive && "border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text)]",
            )}
          >
            {node.label}
          </Link>
        ) : (
          <span className="block rounded-lg px-2.5 py-1.5 text-[0.83rem] text-[var(--muted)]">
            {node.label}
          </span>
        )}
      </li>
    );
  }

  return (
    <li>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger className="group flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[0.82rem] font-medium text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]">
          <span>{node.label}</span>
          <span className="text-[0.65rem] text-[var(--muted)] transition-transform group-data-[panel-open]:rotate-90">
            ▸
          </span>
        </Collapsible.Trigger>
        <Collapsible.Panel className="mt-1 overflow-hidden pl-2.5">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -4 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            <ul className="space-y-1.5 border-l border-[var(--border)] pl-3">
              {node.children.map((child) => (
                <TreeItem key={child.id} node={child} />
              ))}
            </ul>
          </motion.div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </li>
  );
}
