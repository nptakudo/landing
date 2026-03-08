import GithubSlugger from "github-slugger";
import readingTime from "reading-time";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Heading, Root, Text } from "mdast";
import type { AttachmentRef, ResolvedWikiLink, TocEntry } from "@/lib/content/types";

const TAG_PATTERN = /(^|\s)#([A-Za-z0-9/_-]+)/g;

export async function renderMarkdownToHtml(source: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(source);

  return String(file);
}

function formatCalloutLabel(kind: string, title?: string) {
  const normalizedKind = kind.charAt(0).toUpperCase() + kind.slice(1).toLowerCase();
  return title ? `${normalizedKind}: ${title}` : normalizedKind;
}

function normalizeCallouts(source: string): string {
  return source.replace(
    /^>\s*\[!([A-Za-z-]+)\][+-]?\s*(.*)$/gm,
    (_match, kind: string, title: string) => `> **${formatCalloutLabel(kind, title.trim() || undefined)}**`,
  );
}

type ObsidianRenderOptions = {
  links: ResolvedWikiLink[];
  attachments: AttachmentRef[];
};

function replaceWikiSyntax(source: string, options: ObsidianRenderOptions): string {
  let output = source;

  for (const link of options.links) {
    const label = link.alias ?? link.title;
    output = output.replaceAll(link.raw, `[${label}](${link.href})`);
  }

  for (const attachment of options.attachments) {
    const label = attachment.alias ?? attachment.target;
    const replacement =
      attachment.type === "image"
        ? `![${label}](${attachment.publicPath})`
        : `[${label}](${attachment.publicPath})`;
    output = output.replaceAll(attachment.raw, replacement);
  }

  return output;
}

export async function renderObsidianMarkdownToHtml(
  source: string,
  options: ObsidianRenderOptions,
): Promise<string> {
  const normalized = normalizeCallouts(replaceWikiSyntax(source, options));
  return renderMarkdownToHtml(normalized);
}

export function extractExcerpt(source: string, maxLength = 180): string {
  const collapsed = source.replace(/\s+/g, " ").trim();

  if (collapsed.length <= maxLength) {
    return collapsed;
  }

  return `${collapsed.slice(0, maxLength - 1).trimEnd()}…`;
}

function normalizeHeadingText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function stripLeadingTitleHeading(source: string, title: string): string {
  const trimmed = source.trimStart();
  const lines = trimmed.split("\n");
  const firstLine = lines[0] ?? "";

  if (!firstLine.startsWith("# ")) {
    return source;
  }

  const heading = firstLine.replace(/^#\s+/, "");
  if (normalizeHeadingText(heading) !== normalizeHeadingText(title)) {
    return source;
  }

  return lines.slice(1).join("\n").trimStart();
}

export function extractReadingTimeMinutes(source: string): number {
  return Math.max(1, Math.ceil(readingTime(source).minutes));
}

export function extractTags(source: string): string[] {
  const tags = new Set<string>();
  const lines = source.split("\n");
  let inFence = false;

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    for (const match of line.matchAll(TAG_PATTERN)) {
      tags.add(match[2].toLowerCase());
    }
  }

  return [...tags];
}

function headingText(heading: Heading): string {
  return heading.children
    .map((child) => ("value" in child ? (child as Text).value : ""))
    .join("")
    .trim();
}

export function extractHeadings(source: string): TocEntry[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(source) as Root;
  const slugger = new GithubSlugger();
  const headings: TocEntry[] = [];

  visit(tree, "heading", (node) => {
    const heading = node as Heading;
    const text = headingText(heading);

    if (!text) {
      return;
    }

    headings.push({
      depth: heading.depth,
      id: slugger.slug(text),
      text,
    });
  });

  return headings;
}
