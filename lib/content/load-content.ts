import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import readingTime from "reading-time";
import { contentConfig } from "@/lib/content/config";
import {
  extractInlineTags,
  normalizeAliases,
  normalizeTags,
  parseWikiLinks,
} from "@/lib/obsidian/wikilinks";
import type { ContentGraph, PublishedNote, ResolvedWikiLink } from "@/lib/content/types";

type RawNote = {
  id: string;
  sourcePath: string;
  slug: string;
  title: string;
  content: string;
  description?: string;
  tags: string[];
  aliases: string[];
  folder: string;
  createdAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  toc: PublishedNote["toc"];
};

let contentCache: ContentGraph | null = null;

export async function getContentGraph(): Promise<ContentGraph> {
  if (contentCache) {
    return contentCache;
  }

  const notes = await loadPublishedNotes();
  const bySlug = new Map(notes.map((note) => [note.slug, note]));
  const tags = new Map<string, PublishedNote[]>();

  for (const note of notes) {
    for (const tag of note.tags) {
      const existing = tags.get(tag) ?? [];
      existing.push(note);
      tags.set(tag, existing);
    }
  }

  contentCache = { notes, bySlug, tags };
  return contentCache;
}

export async function getAllNotes(): Promise<PublishedNote[]> {
  const graph = await getContentGraph();
  return graph.notes;
}

export async function getNoteBySlug(slugPath: string[]): Promise<PublishedNote | null> {
  const slug = slugPath.join("/");
  const graph = await getContentGraph();
  return graph.bySlug.get(slug) ?? null;
}

export async function getAllTags(): Promise<string[]> {
  const graph = await getContentGraph();
  return Array.from(graph.tags.keys()).sort();
}

export async function getNotesByTag(tag: string): Promise<PublishedNote[]> {
  const graph = await getContentGraph();
  return graph.tags.get(tag) ?? [];
}

export function invalidateContentCache() {
  contentCache = null;
}

async function loadPublishedNotes(): Promise<PublishedNote[]> {
  const notesDir = await resolveNotesDir();
  const files = await fg(["**/*.md", "**/*.mdx"], {
    cwd: notesDir,
    onlyFiles: true,
    dot: false,
  });

  const rawNotes = await Promise.all(
    files.map(async (relativePath) => {
      const absolutePath = path.join(notesDir, relativePath);
      const fileText = await fs.readFile(absolutePath, "utf8");
      const parsed = matter(fileText);
      const content = parsed.content.trim();
      const frontmatter = parsed.data as Record<string, unknown>;
      const sourceStat = await fs.stat(absolutePath);
      const title = resolveTitle(frontmatter.title, content, relativePath);
      const slug = toSlug(relativePath);
      const aliases = normalizeAliases(frontmatter.aliases as string[] | string | undefined);
      const inlineTags = extractInlineTags(content);
      const tags = normalizeTags(frontmatter.tags as string[] | string | undefined, inlineTags);
      const toc = buildToc(content);

      return {
        id: slug,
        sourcePath: relativePath,
        slug,
        title,
        content,
        description:
          typeof frontmatter.description === "string" ? frontmatter.description : undefined,
        tags,
        aliases,
        folder: path.dirname(relativePath) === "." ? "" : path.dirname(relativePath),
        createdAt: resolveDate(frontmatter.created, frontmatter.created_date, sourceStat.birthtime),
        updatedAt: resolveDate(frontmatter.updated, frontmatter.updated_date, sourceStat.mtime),
        readingTimeMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
        toc,
      } satisfies RawNote;
    }),
  );

  rawNotes.sort((a, b) => a.slug.localeCompare(b.slug));
  return enrichWithLinks(rawNotes);
}

async function resolveNotesDir(): Promise<string> {
  const hasSynced = await exists(contentConfig.notesDir);
  if (hasSynced) {
    const files = await fg(["**/*.md", "**/*.mdx"], {
      cwd: contentConfig.notesDir,
      onlyFiles: true,
      dot: false,
    });

    if (files.length > 0) {
      return contentConfig.notesDir;
    }
  }

  return contentConfig.fallbackNotesDir;
}

function enrichWithLinks(rawNotes: RawNote[]): PublishedNote[] {
  const slugToNote = new Map<string, RawNote>();
  const filenameIndex = new Map<string, string[]>();
  const titleIndex = new Map<string, string>();
  const aliasIndex = new Map<string, string>();

  for (const note of rawNotes) {
    slugToNote.set(note.slug, note);

    const baseName = path.basename(note.sourcePath, path.extname(note.sourcePath)).toLowerCase();
    const existing = filenameIndex.get(baseName) ?? [];
    existing.push(note.slug);
    filenameIndex.set(baseName, existing);

    titleIndex.set(note.title.toLowerCase(), note.slug);

    for (const alias of note.aliases) {
      aliasIndex.set(alias.toLowerCase(), note.slug);
    }
  }

  const backlinkMap = new Map<string, Set<string>>();

  const notes = rawNotes.map((note) => {
    const outboundLinks = resolveLinks(note, {
      slugToNote,
      filenameIndex,
      titleIndex,
      aliasIndex,
    });

    for (const link of outboundLinks) {
      if (link.resolvedSlug) {
        const existing = backlinkMap.get(link.resolvedSlug) ?? new Set<string>();
        existing.add(note.slug);
        backlinkMap.set(link.resolvedSlug, existing);
      }
    }

    return {
      ...note,
      renderedContent: renderObsidianMarkdown(note.content, outboundLinks),
      summary: summarize(note.content),
      outboundLinks,
      backlinks: [] as string[],
      relatedSlugs: [] as string[],
    } satisfies PublishedNote;
  });

  for (const note of notes) {
    note.backlinks = Array.from(backlinkMap.get(note.slug) ?? []).sort();
    note.relatedSlugs = computeRelated(note, notes);
  }

  enforceBrokenLinkPolicy(notes);
  return notes;
}

function resolveLinks(
  note: RawNote,
  indexes: {
    slugToNote: Map<string, RawNote>;
    filenameIndex: Map<string, string[]>;
    titleIndex: Map<string, string>;
    aliasIndex: Map<string, string>;
  },
): ResolvedWikiLink[] {
  return parseWikiLinks(note.content).map((link) => {
    if (looksLikeAsset(link.target)) {
      const href = toAssetHref(link.target, note.sourcePath);
      return {
        raw: link.raw,
        target: link.target,
        anchor: link.anchor,
        alias: link.alias,
        resolvedSlug: undefined,
        resolvedHref: href,
        unresolved: false,
        embed: link.embed,
      } satisfies ResolvedWikiLink;
    }

    const resolvedSlug = resolveNoteSlug(link.target, indexes);
    return {
      raw: link.raw,
      target: link.target,
      anchor: link.anchor,
      alias: link.alias,
      resolvedSlug,
      resolvedHref: resolvedSlug
        ? `/docs/${resolvedSlug}${link.anchor ? `#${toAnchorId(link.anchor)}` : ""}`
        : undefined,
      unresolved: !resolvedSlug,
      embed: link.embed,
    } satisfies ResolvedWikiLink;
  });
}

function resolveNoteSlug(
  target: string,
  indexes: {
    slugToNote: Map<string, RawNote>;
    filenameIndex: Map<string, string[]>;
    titleIndex: Map<string, string>;
    aliasIndex: Map<string, string>;
  },
): string | undefined {
  const normalizedPath = toSlug(`${target}.md`);
  if (indexes.slugToNote.has(normalizedPath)) {
    return normalizedPath;
  }

  const direct = target.toLowerCase();
  if (indexes.titleIndex.has(direct)) {
    return indexes.titleIndex.get(direct);
  }

  if (indexes.aliasIndex.has(direct)) {
    return indexes.aliasIndex.get(direct);
  }

  const base = path.basename(target).toLowerCase();
  const candidates = indexes.filenameIndex.get(base) ?? [];
  if (candidates.length === 1) {
    return candidates[0];
  }

  return undefined;
}

function toAnchorId(value: string): string {
  const slugger = new GithubSlugger();
  return slugger.slug(value);
}

function renderObsidianMarkdown(content: string, links: ResolvedWikiLink[]): string {
  let output = content;

  for (const link of links) {
    if (!output.includes(link.raw)) {
      continue;
    }

    if (link.embed && link.resolvedHref && isImage(link.target)) {
      output = output.replace(link.raw, `![${link.alias ?? path.basename(link.target)}](${link.resolvedHref})`);
      continue;
    }

    if (link.embed && link.resolvedHref && isPdf(link.target)) {
      output = output.replace(link.raw, `[PDF: ${path.basename(link.target)}](${link.resolvedHref})`);
      continue;
    }

    if (link.resolvedHref) {
      output = output.replace(link.raw, `[${link.alias ?? link.target}](${link.resolvedHref})`);
      continue;
    }

    output = output.replace(link.raw, `**[Broken link: ${link.target}]**`);
  }

  return output.replace(/^> \[!(\w+)\](.*)$/gim, (_, type: string, title: string) => {
    return `> **${type.toUpperCase()}${title ? ` ${title.trim()}` : ""}**`;
  });
}

function summarize(content: string): string {
  const plain = content.replace(/[#>*_`\-\[\]!]/g, " ").replace(/\s+/g, " ").trim();
  return plain.slice(0, 180);
}

function computeRelated(note: PublishedNote, notes: PublishedNote[]): string[] {
  const scored = notes
    .filter((candidate) => candidate.slug !== note.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => note.tags.includes(tag)).length;
      const sharedLinks = candidate.outboundLinks.filter((link) =>
        note.outboundLinks.some((other) => other.resolvedSlug === link.resolvedSlug),
      ).length;

      return {
        slug: candidate.slug,
        score: sharedTags * 2 + sharedLinks,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

  return scored.slice(0, 5).map((entry) => entry.slug);
}

function enforceBrokenLinkPolicy(notes: PublishedNote[]) {
  const broken = notes.flatMap((note) =>
    note.outboundLinks
      .filter((link) => link.unresolved && !link.embed)
      .map((link) => `${note.slug}: ${link.target}`),
  );

  const strict = process.env.NODE_ENV === "production" || process.env.CONTENT_STRICT_LINKS === "true";
  if (strict && broken.length > 0) {
    throw new Error(`Unresolved wikilinks found:\n${broken.join("\n")}`);
  }
}

function buildToc(content: string): PublishedNote["toc"] {
  const slugger = new GithubSlugger();
  const headings: PublishedNote["toc"] = [];

  for (const line of content.split("\n")) {
    const match = /^(#{2,4})\s+(.+)$/.exec(line.trim());
    if (!match) {
      continue;
    }

    const depth = match[1].length;
    const text = match[2].trim();

    headings.push({
      id: slugger.slug(text),
      text,
      depth,
    });
  }

  return headings;
}

function toSlug(relativePath: string): string {
  const withoutExt = relativePath.replace(/\.(md|mdx)$/i, "");
  return withoutExt
    .split(path.sep)
    .join("/")
    .split("/")
    .map((segment) =>
      segment
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
    )
    .join("/");
}

function resolveTitle(frontmatterTitle: unknown, content: string, relativePath: string): string {
  if (typeof frontmatterTitle === "string" && frontmatterTitle.trim()) {
    return frontmatterTitle.trim();
  }

  const h1 = content.split("\n").find((line) => line.startsWith("# "));
  if (h1) {
    return h1.replace(/^#\s+/, "").trim();
  }

  return path.basename(relativePath, path.extname(relativePath));
}

function resolveDate(primary: unknown, secondary: unknown, fallback: Date): string {
  const first = typeof primary === "string" ? primary : undefined;
  const second = typeof secondary === "string" ? secondary : undefined;

  return first || second || fallback.toISOString();
}

function isImage(target: string): boolean {
  return /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(target);
}

function isPdf(target: string): boolean {
  return /\.pdf$/i.test(target);
}

function looksLikeAsset(target: string): boolean {
  return /\.(png|jpg|jpeg|gif|webp|svg|pdf)$/i.test(target);
}

function toAssetHref(assetTarget: string, noteSourcePath: string): string {
  if (assetTarget.startsWith("/")) {
    return `/obsidian-assets${assetTarget}`;
  }

  const noteFolder = path.dirname(noteSourcePath).replace(/\\/g, "/");
  if (noteFolder === ".") {
    return `/obsidian-assets/${assetTarget}`;
  }

  return `/obsidian-assets/${noteFolder}/${assetTarget}`;
}

async function exists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}
