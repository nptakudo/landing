import { cache } from "react";
import {
  buildContentGraph,
  buildNavigationTree,
  loadPublishedNotes,
  type NavigationTreeNode,
  type PublishedNote,
} from "@/lib/content";
import { exampleContentRoot, mirroredContentRoot } from "@/lib/site/source";

const readNotes = cache(async (): Promise<PublishedNote[]> => {
  const mirrored = await loadPublishedNotes(mirroredContentRoot);
  if (mirrored.length > 0) {
    return mirrored;
  }

  return loadPublishedNotes(exampleContentRoot);
});

export const getPublishedNotes = cache(async () => {
  const notes = await readNotes();
  return [...notes].sort((left, right) => {
    const leftDate = left.updatedAt ?? left.createdAt ?? "";
    const rightDate = right.updatedAt ?? right.createdAt ?? "";
    return rightDate.localeCompare(leftDate) || left.title.localeCompare(right.title);
  });
});

export const getFeaturedNotes = cache(async (count = 3) => {
  const notes = await getPublishedNotes();
  return notes.slice(0, count);
});

export const getNavigationRoot = cache(async (): Promise<NavigationTreeNode> => {
  const notes = await readNotes();
  return buildNavigationTree(notes);
});

export const getPublishedNoteBySlug = cache(async (slug: string) => {
  const notes = await readNotes();
  return notes.find((note) => note.slug === slug);
});

export const getTagArchive = cache(async () => {
  const notes = await readNotes();
  const byTag = new Map<string, PublishedNote[]>();

  for (const note of notes) {
    for (const tag of note.tags) {
      byTag.set(tag, [...(byTag.get(tag) ?? []), note]);
    }
  }

  return byTag;
});

export const getPagerForSlug = cache(async (slug: string) => {
  const notes = await getPublishedNotes();
  const ordered = [...notes].sort((left, right) => left.slug.localeCompare(right.slug));
  const index = ordered.findIndex((note) => note.slug === slug);

  if (index === -1) {
    return { previous: undefined, next: undefined };
  }

  return {
    previous: ordered[index - 1],
    next: ordered[index + 1],
  };
});

export const getGraphData = cache(async () => {
  const notes = await readNotes();
  return buildContentGraph(notes);
});
