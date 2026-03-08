import { compareNotesForNavigation, compareStrings } from "./order";
import type { NavigationTreeNode, PublishedNote } from "./types";

function sortTreeChildren(children: NavigationTreeNode[]) {
  children.sort((left, right) => {
    if (left.kind !== right.kind) {
      return left.kind === "folder" ? -1 : 1;
    }
    return compareStrings(left.name, right.name);
  });
}

function findOrCreateFolder(
  parent: NavigationTreeNode,
  name: string,
  path: string,
): NavigationTreeNode {
  const existing = parent.children.find((child) => child.kind === "folder" && child.path === path);
  if (existing) {
    return existing;
  }

  const folder: NavigationTreeNode = {
    id: `folder:${path}`,
    name,
    path,
    kind: "folder",
    children: [],
  };

  parent.children.push(folder);
  sortTreeChildren(parent.children);

  return folder;
}

export function buildNavigationTree(notes: PublishedNote[]): NavigationTreeNode {
  const root: NavigationTreeNode = {
    id: "root",
    name: "Docs",
    path: "",
    kind: "folder",
    children: [],
  };

  for (const note of notes.slice().sort(compareNotesForNavigation)) {
    let current = root;
    let currentPath = "";

    for (const segment of note.folderSegments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      current = findOrCreateFolder(current, segment, currentPath);
    }

    current.children.push({
      id: note.id,
      name: note.title,
      path: note.slug,
      slug: note.slug,
      noteTitle: note.title,
      kind: "note",
      children: [],
    });
    sortTreeChildren(current.children);
  }

  return root;
}
