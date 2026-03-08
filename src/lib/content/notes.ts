import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import {
  extractExcerpt,
  extractHeadings,
  extractReadingTimeMinutes,
  extractTags,
  renderMarkdownToHtml,
  renderObsidianMarkdownToHtml,
  stripLeadingTitleHeading,
} from "../obsidian/markdown";
import { isPublished, parseFrontmatter } from "../obsidian/frontmatter";
import { ensureAbsolute, folderSegmentsFromSlug, relativeSlug } from "../obsidian/paths";
import { basenameWithoutExt, normalizeWikiPath, parseWikiLinks } from "../obsidian/wiki-links";
import { compareNotesBySlug, compareStrings } from "./order";
import { computeRelatedSlugs } from "./related";
import type {
  AttachmentRef,
  ContentWarning,
  NoteParseResult,
  ParsedWikiLink,
  PublishedNote,
  ResolvedWikiLink,
  SyncResult,
} from "./types";

const NOTE_GLOB = "**/*.{md,mdx}";
const NOTE_IGNORE = ["**/.git/**", "**/.obsidian/**", "**/Templates/**", "**/*.excalidraw.md"];
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif"]);

type NoteLookup = {
  bySlug: Map<string, NoteParseResult>;
  byBasename: Map<string, NoteParseResult[]>;
  byAlias: Map<string, NoteParseResult[]>;
};

type AssetLookup = {
  byRelativePath: Map<string, string>;
  byBasename: Map<string, string[]>;
};

function normalizeTag(tag: string): string {
  return tag.trim().replace(/^#/, "").toLowerCase();
}

function normalizeDate(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

function collectLookup(notes: NoteParseResult[]): NoteLookup {
  const bySlug = new Map<string, NoteParseResult>();
  const byBasename = new Map<string, NoteParseResult[]>();
  const byAlias = new Map<string, NoteParseResult[]>();

  for (const note of notes.slice().sort((left, right) => compareStrings(left.slug, right.slug))) {
    bySlug.set(note.slug, note);

    const basename = basenameWithoutExt(note.slug);
    byBasename.set(basename, [...(byBasename.get(basename) ?? []), note]);

    for (const alias of note.aliases) {
      const key = normalizeTag(alias);
      byAlias.set(key, [...(byAlias.get(key) ?? []), note]);
    }
  }

  return { bySlug, byBasename, byAlias };
}

async function parseNote(absolutePath: string, rootDir: string): Promise<NoteParseResult | null> {
  const relativePath = path.relative(rootDir, absolutePath).replace(/\\/g, "/");
  const source = await fs.readFile(absolutePath, "utf8");
  const { content, data } = parseFrontmatter(source);

  if (!isPublished(data)) {
    return null;
  }

  const slug = relativeSlug(relativePath);
  const tags = [...new Set([...(Array.isArray(data.tags) ? data.tags : []), ...extractTags(content)])]
    .map(normalizeTag)
    .sort(compareStrings);
  const aliases = (Array.isArray(data.aliases) ? data.aliases : []).slice().sort(compareStrings);
  const rawHeadings = extractHeadings(content);
  const title = data.title?.trim() || rawHeadings[0]?.text || basenameWithoutExt(relativePath);
  const bodyContent = stripLeadingTitleHeading(content, title);
  const headings = extractHeadings(bodyContent);
  const html = await renderMarkdownToHtml(bodyContent);
  const stat = await fs.stat(absolutePath);

  return {
    absolutePath,
    relativePath,
    slug,
    title,
    content: bodyContent,
    frontmatter: data,
    aliases,
    tags,
    headings,
    createdAt: normalizeDate(data.created ?? data.created_date) ?? stat.birthtime.toISOString(),
    updatedAt: normalizeDate(data.updated ?? data.updated_date) ?? stat.mtime.toISOString(),
    sourcePublishedAt: normalizeDate(data.published),
    excerpt: extractExcerpt(bodyContent),
    html,
    links: parseWikiLinks(bodyContent),
    readingTimeMinutes: extractReadingTimeMinutes(bodyContent),
  };
}

function linkHref(slug: string, heading?: string): string {
  return heading ? `/docs/${slug}#${normalizeTag(heading).replace(/\s+/g, "-")}` : `/docs/${slug}`;
}

function resolveNoteLink(
  link: ParsedWikiLink,
  currentNote: NoteParseResult,
  lookup: NoteLookup,
): ResolvedWikiLink | null {
  if (link.isEmbed) {
    return null;
  }

  const normalizedPath = normalizeWikiPath(link.path).replace(/\.(md|mdx)$/i, "");
  const currentDir = path.posix.dirname(currentNote.slug);
  const relativeCandidate = normalizeWikiPath(path.posix.join(currentDir, normalizedPath));
  const exactMatch = lookup.bySlug.get(normalizedPath) ?? lookup.bySlug.get(relativeCandidate);

  if (exactMatch) {
    return {
      raw: link.raw,
      target: link.target,
      alias: link.alias,
      heading: link.heading,
      href: linkHref(exactMatch.slug, link.heading),
      slug: exactMatch.slug,
      title: exactMatch.title,
    };
  }

  const basenameMatches = lookup.byBasename.get(basenameWithoutExt(normalizedPath)) ?? [];
  if (basenameMatches.length === 1) {
    const match = basenameMatches[0];
    return {
      raw: link.raw,
      target: link.target,
      alias: link.alias,
      heading: link.heading,
      href: linkHref(match.slug, link.heading),
      slug: match.slug,
      title: match.title,
    };
  }

  const aliasMatches = lookup.byAlias.get(normalizeTag(normalizedPath)) ?? [];
  if (aliasMatches.length === 1) {
    const match = aliasMatches[0];
    return {
      raw: link.raw,
      target: link.target,
      alias: link.alias,
      heading: link.heading,
      href: linkHref(match.slug, link.heading),
      slug: match.slug,
      title: match.title,
    };
  }

  return null;
}

async function collectAssetLookup(rootDir: string): Promise<AssetLookup> {
  const files = await fg("**/*", {
    cwd: rootDir,
    absolute: false,
    dot: false,
    onlyFiles: true,
    ignore: ["**/.git/**", "**/.obsidian/**", NOTE_GLOB],
  });
  files.sort(compareStrings);

  const byRelativePath = new Map<string, string>();
  const byBasename = new Map<string, string[]>();

  for (const relativePath of files) {
    byRelativePath.set(relativePath, ensureAbsolute(rootDir, relativePath));
    const basename = path.basename(relativePath);
    byBasename.set(basename, [...(byBasename.get(basename) ?? []), ensureAbsolute(rootDir, relativePath)]);
  }

  return { byRelativePath, byBasename };
}

function attachmentType(assetPath: string): AttachmentRef["type"] {
  const extension = path.extname(assetPath).toLowerCase();
  if (IMAGE_EXTENSIONS.has(extension)) {
    return "image";
  }
  if (extension === ".pdf") {
    return "pdf";
  }
  return "file";
}

function resolveAttachment(
  link: ParsedWikiLink,
  currentNote: NoteParseResult,
  assets: AssetLookup,
  rootDir: string,
): AttachmentRef | null {
  if (!link.isEmbed) {
    return null;
  }

  const normalized = normalizeWikiPath(link.path);
  const currentDir = path.posix.dirname(currentNote.relativePath);
  const relativeCandidate = normalizeWikiPath(path.posix.join(currentDir, normalized));
  const absolutePath =
    assets.byRelativePath.get(normalized) ??
    assets.byRelativePath.get(relativeCandidate) ??
    (() => {
      const basenameMatches = assets.byBasename.get(path.basename(normalized)) ?? [];
      return basenameMatches.length === 1 ? basenameMatches[0] : null;
    })();

  if (!absolutePath) {
    return null;
  }

  return {
    raw: link.raw,
    target: link.target,
    alias: link.alias,
    type: attachmentType(absolutePath),
    assetPath: absolutePath,
    publicPath: `/obsidian-assets/${normalizeWikiPath(path.relative(rootDir, absolutePath).replace(/\\/g, "/"))}`,
  };
}

function buildBacklinks(notes: PublishedNote[]): Map<string, ResolvedWikiLink[]> {
  const backlinks = new Map<string, ResolvedWikiLink[]>();

  for (const note of notes) {
    for (const link of note.links) {
      const entry: ResolvedWikiLink = {
        ...link,
        href: `/docs/${note.slug}`,
        slug: note.slug,
        title: note.title,
      };
      backlinks.set(link.slug, [...(backlinks.get(link.slug) ?? []), entry]);
    }
  }

  for (const [slug, entries] of backlinks.entries()) {
    backlinks.set(slug, entries.slice().sort((left, right) => compareStrings(left.slug, right.slug)));
  }

  return backlinks;
}

export async function loadPublishedNotes(rootDir: string): Promise<PublishedNote[]> {
  const absoluteFiles = await fg(NOTE_GLOB, {
    cwd: rootDir,
    absolute: true,
    dot: false,
    onlyFiles: true,
    ignore: NOTE_IGNORE,
  });
  absoluteFiles.sort(compareStrings);

  const parsed = (await Promise.all(absoluteFiles.map((absolutePath) => parseNote(absolutePath, rootDir)))).filter(
    Boolean,
  ) as NoteParseResult[];
  const lookup = collectLookup(parsed);
  const assets = await collectAssetLookup(rootDir);
  const warnings: ContentWarning[] = [];

  const notes = parsed.slice().sort((left, right) => compareStrings(left.slug, right.slug)).map((note) => {
    const links = note.links
      .filter((link) => !link.isEmbed)
      .map((link) => {
        const resolved = resolveNoteLink(link, note, lookup);
        if (!resolved) {
          warnings.push({
            notePath: note.relativePath,
            message: `Unresolved or ambiguous note link: ${link.raw}`,
          });
        }
        return resolved;
      })
      .filter(Boolean) as ResolvedWikiLink[];

    const attachments = note.links
      .filter((link) => link.isEmbed)
      .map((link) => {
        const resolved = resolveAttachment(link, note, assets, rootDir);
        if (!resolved) {
          warnings.push({
            notePath: note.relativePath,
            message: `Unresolved or ambiguous attachment embed: ${link.raw}`,
          });
        }
        return resolved;
      })
      .filter(Boolean) as AttachmentRef[];

    return {
      id: note.slug,
      absolutePath: note.absolutePath,
      relativePath: note.relativePath,
      slug: note.slug,
      title: note.title,
      description: note.frontmatter.description,
      content: note.content,
      html: note.html,
      excerpt: note.excerpt,
      frontmatter: note.frontmatter,
      aliases: note.aliases,
      tags: note.tags,
      headings: note.headings,
      readingTimeMinutes: note.readingTimeMinutes,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      sourcePublishedAt: note.sourcePublishedAt,
      links,
      backlinks: [],
      attachments: attachments.slice().sort((left, right) => compareStrings(left.publicPath, right.publicPath)),
      relatedSlugs: [],
      folderSegments: folderSegmentsFromSlug(note.slug),
    } satisfies PublishedNote;
  });

  if (warnings.length > 0) {
    const message = warnings.map((warning) => `${warning.notePath}: ${warning.message}`).join("\n");
    throw new Error(`Published content validation failed:\n${message}`);
  }

  const backlinks = buildBacklinks(notes);
  const related = computeRelatedSlugs(notes);

  return Promise.all(
    notes.slice().sort(compareNotesBySlug).map(async (note) => ({
      ...note,
      html: await renderObsidianMarkdownToHtml(note.content, {
        links: note.links,
        attachments: note.attachments,
      }),
      backlinks: backlinks.get(note.slug) ?? [],
      relatedSlugs: [...(related.get(note.slug) ?? [])].sort(compareStrings),
    })),
  );
}

export async function syncPublishedNotes(options: {
  vaultRoot: string;
  contentRoot: string;
  assetRoot: string;
}): Promise<SyncResult> {
  const { vaultRoot, contentRoot, assetRoot } = options;
  const notes = await loadPublishedNotes(vaultRoot);

  await fs.rm(contentRoot, { recursive: true, force: true });
  await fs.rm(assetRoot, { recursive: true, force: true });
  await fs.mkdir(contentRoot, { recursive: true });
  await fs.mkdir(assetRoot, { recursive: true });

  const mirroredNotes: string[] = [];
  const mirroredAssets = new Set<string>();

  for (const note of notes) {
    const targetPath = ensureAbsolute(contentRoot, note.relativePath);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(note.absolutePath, targetPath);
    mirroredNotes.push(targetPath);

    for (const attachment of note.attachments) {
      const relativeToVault = path.relative(vaultRoot, attachment.assetPath).replace(/\\/g, "/");
      const targetAssetPath = ensureAbsolute(assetRoot, relativeToVault);
      await fs.mkdir(path.dirname(targetAssetPath), { recursive: true });
      await fs.copyFile(attachment.assetPath, targetAssetPath);
      mirroredAssets.add(targetAssetPath);
    }
  }

  return {
    notes,
    mirroredNotes,
    mirroredAssets: [...mirroredAssets].sort(),
    warnings: [],
  };
}
