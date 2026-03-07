import type { PublishedNote } from "@/lib/content/types";

export type NavNode = {
  id: string;
  label: string;
  href?: string;
  children?: NavNode[];
};

type MutableNode = {
  id: string;
  label: string;
  href?: string;
  children: Map<string, MutableNode>;
};

export function buildNavigationTree(notes: PublishedNote[]): NavNode[] {
  const root = new Map<string, MutableNode>();

  for (const note of notes) {
    const segments = note.slug.split("/");
    let pointer = root;
    let currentPath = "";

    for (let i = 0; i < segments.length - 1; i += 1) {
      const segment = segments[i];
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      const key = `folder:${currentPath}`;

      if (!pointer.has(key)) {
        pointer.set(key, {
          id: key,
          label: prettifySegment(segment),
          children: new Map<string, MutableNode>(),
        });
      }

      pointer = pointer.get(key)!.children;
    }

    const noteKey = `note:${note.slug}`;
    pointer.set(noteKey, {
      id: noteKey,
      label: note.title,
      href: `/docs/${note.slug}`,
      children: new Map<string, MutableNode>(),
    });
  }

  return toNavNodes(root);
}

function toNavNodes(map: Map<string, MutableNode>): NavNode[] {
  return Array.from(map.values())
    .map((node) => ({
      id: node.id,
      label: node.label,
      href: node.href,
      children: node.children.size > 0 ? toNavNodes(node.children) : undefined,
    }))
    .sort((a, b) => {
      const aFolder = Boolean(a.children?.length);
      const bFolder = Boolean(b.children?.length);
      if (aFolder !== bFolder) {
        return aFolder ? -1 : 1;
      }

      return a.label.localeCompare(b.label);
    });
}

function prettifySegment(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
