"use client";

import Link from "next/link";
import { Collapsible } from "@base-ui/react/collapsible";

export type TreeNode = {
  id: string;
  label: string;
  href?: string;
  children?: TreeNode[];
};

export function CollapsibleTreeNav({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul className="space-y-1 text-sm">
      {nodes.map((node) => (
        <TreeItem key={node.id} node={node} />
      ))}
    </ul>
  );
}

function TreeItem({ node }: { node: TreeNode }) {
  if (!node.children || node.children.length === 0) {
    return (
      <li>
        {node.href ? (
          <Link
            href={node.href}
            className="block rounded-md px-2 py-1 text-[var(--muted)] hover:bg-[var(--panel)] hover:text-[var(--text)]"
          >
            {node.label}
          </Link>
        ) : (
          <span className="block rounded-md px-2 py-1 text-[var(--muted)]">{node.label}</span>
        )}
      </li>
    );
  }

  return (
    <li>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger className="w-full rounded-md px-2 py-1 text-left text-[var(--muted)] hover:bg-[var(--panel)] hover:text-[var(--text)]">
          {node.label}
        </Collapsible.Trigger>
        <Collapsible.Panel className="mt-1 pl-3">
          <ul className="space-y-1 border-l border-[var(--border)] pl-2">
            {node.children.map((child) => (
              <TreeItem key={child.id} node={child} />
            ))}
          </ul>
        </Collapsible.Panel>
      </Collapsible.Root>
    </li>
  );
}
