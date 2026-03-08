import { load } from "js-yaml";
import type { NoteFrontmatter } from "../content/types";

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => `${entry}`.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

export function parseFrontmatter(source: string): {
  content: string;
  data: NoteFrontmatter;
} {
  if (!source.startsWith("---\n")) {
    return {
      content: source.trim(),
      data: {},
    };
  }

  const endIndex = source.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return {
      content: source.trim(),
      data: {},
    };
  }

  const frontmatterSource = source.slice(4, endIndex);
  const content = source.slice(endIndex + 5).trim();
  const data = (load(frontmatterSource) as NoteFrontmatter | undefined) ?? {};

  return {
    content,
    data: {
      ...data,
      aliases: toStringArray(data.aliases),
      tags: toStringArray(data.tags),
      author: Array.isArray(data.author) ? data.author.map(String) : data.author,
    },
  };
}

export function isPublished(frontmatter: NoteFrontmatter): boolean {
  if (frontmatter.private === true || frontmatter.draft === true) {
    return false;
  }

  return frontmatter.publish === true;
}
