import { compareNotesBySlug } from "./order";
import type { PublishedNote, SearchIndexEntry } from "./types";

export function buildSearchIndex(notes: PublishedNote[]): SearchIndexEntry[] {
  return notes.slice().sort(compareNotesBySlug).map((note) => ({
    slug: note.slug,
    title: note.title,
    description: note.description,
    aliases: [...note.aliases].sort(),
    tags: [...note.tags].sort(),
    headings: note.headings.map((heading) => heading.text),
    excerpt: note.excerpt,
    body: note.content,
  }));
}
