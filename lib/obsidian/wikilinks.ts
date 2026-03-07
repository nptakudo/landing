import slugify from "slugify";

export type ParsedWikiLink = {
  raw: string;
  target: string;
  anchor?: string;
  alias?: string;
  embed: boolean;
};

const wikilinkRegex = /(!)?\[\[([^\]]+)\]\]/g;

export function parseWikiLinks(input: string): ParsedWikiLink[] {
  const links: ParsedWikiLink[] = [];
  let match: RegExpExecArray | null;

  while ((match = wikilinkRegex.exec(input)) !== null) {
    const embed = Boolean(match[1]);
    const rawContent = match[2].trim();
    const [targetAndAnchor, aliasRaw] = rawContent.split("|");
    const [targetRaw, anchorRaw] = targetAndAnchor.split("#");

    links.push({
      raw: match[0],
      embed,
      target: targetRaw.trim(),
      anchor: anchorRaw?.trim() || undefined,
      alias: aliasRaw?.trim() || undefined,
    });
  }

  return links;
}

export function normalizeTag(tag: string): string {
  return slugify(tag.replace(/^#/, ""), {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function extractInlineTags(markdown: string): string[] {
  const tags = new Set<string>();
  const regex = /(^|\s)#([\p{L}\p{N}_\/-]+)/gu;

  for (const match of markdown.matchAll(regex)) {
    const normalized = normalizeTag(match[2]);
    if (normalized) {
      tags.add(normalized);
    }
  }

  return Array.from(tags).sort();
}

export function normalizeAliases(input?: string[] | string): string[] {
  if (!input) {
    return [];
  }

  const aliases = Array.isArray(input) ? input : [input];
  return aliases
    .map((alias) => alias.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

export function normalizeTags(frontmatterTags?: string[] | string, inlineTags: string[] = []): string[] {
  const fromFrontmatter = (Array.isArray(frontmatterTags)
    ? frontmatterTags
    : typeof frontmatterTags === "string"
      ? [frontmatterTags]
      : [])
    .map((tag) => normalizeTag(tag))
    .filter(Boolean);

  return Array.from(new Set([...fromFrontmatter, ...inlineTags])).sort();
}
