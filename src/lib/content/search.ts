import type { PublishedNote, SearchIndexEntry } from "./types";

export function buildSearchIndex(notes: PublishedNote[]): SearchIndexEntry[] {
  return notes.map((note) => ({
    slug: note.slug,
    title: note.title,
    description: note.description,
    aliases: note.aliases,
    tags: note.tags,
    headings: note.headings.map((heading) => heading.text),
    excerpt: note.excerpt,
    body: note.content,
  }));
}
