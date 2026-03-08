import type { PublishedNote } from "./types";

export function scoreRelatedNotes(note: PublishedNote, candidate: PublishedNote): number {
  const tagOverlap = note.tags.filter((tag) => candidate.tags.includes(tag)).length;
  const linkOverlap = note.links.filter((link) =>
    candidate.links.some((candidateLink) => candidateLink.slug === link.slug),
  ).length;
  const backlinkOverlap = note.backlinks.filter((link) =>
    candidate.backlinks.some((candidateLink) => candidateLink.slug === link.slug),
  ).length;

  return tagOverlap * 3 + linkOverlap * 2 + backlinkOverlap;
}

export function computeRelatedSlugs(
  notes: PublishedNote[],
  maxRelated = 4,
): Map<string, string[]> {
  const results = new Map<string, string[]>();

  for (const note of notes) {
    const ranked = notes
      .filter((candidate) => candidate.slug !== note.slug)
      .map((candidate) => ({
        slug: candidate.slug,
        score: scoreRelatedNotes(note, candidate),
      }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score || left.slug.localeCompare(right.slug))
      .slice(0, maxRelated)
      .map((entry) => entry.slug);

    results.set(note.slug, ranked);
  }

  return results;
}
