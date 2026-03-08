import type { PublishedNote } from "./types";

function compareText(left: string, right: string) {
  return left.localeCompare(right, "en", { sensitivity: "base", numeric: true });
}

export function compareNotesForNavigation(left: PublishedNote, right: PublishedNote) {
  const folderComparison = compareText(
    left.folderSegments.join("/"),
    right.folderSegments.join("/"),
  );
  if (folderComparison !== 0) {
    return folderComparison;
  }

  const leftOrder = left.frontmatter.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.frontmatter.order ?? Number.MAX_SAFE_INTEGER;
  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  const titleComparison = compareText(left.title, right.title);
  if (titleComparison !== 0) {
    return titleComparison;
  }

  return compareText(left.slug, right.slug);
}

export function compareNotesBySlug(left: PublishedNote, right: PublishedNote) {
  return compareText(left.slug, right.slug);
}

export function compareStrings(left: string, right: string) {
  return compareText(left, right);
}
