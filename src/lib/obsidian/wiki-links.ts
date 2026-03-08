import path from "node:path";
import type { ParsedWikiLink } from "../content/types";

const WIKI_LINK_PATTERN = /(!)?\[\[([^\]]+)\]\]/g;

function splitAliasAndHeading(target: string): {
  pathPart: string;
  alias?: string;
  heading?: string;
} {
  const [targetPart, aliasPart] = target.split("|");
  const [pathPart, headingPart] = targetPart.split("#");

  return {
    pathPart: pathPart.trim(),
    alias: aliasPart?.trim() || undefined,
    heading: headingPart?.trim() || undefined,
  };
}

export function parseWikiLinks(source: string): ParsedWikiLink[] {
  return [...source.matchAll(WIKI_LINK_PATTERN)].map((match) => {
    const raw = match[0];
    const isEmbed = Boolean(match[1]);
    const target = match[2].trim();
    const { pathPart, alias, heading } = splitAliasAndHeading(target);

    return {
      raw,
      target,
      path: pathPart,
      alias,
      heading,
      isEmbed,
    };
  });
}

export function basenameWithoutExt(target: string): string {
  return path.basename(target, path.extname(target));
}

export function normalizeWikiPath(input: string): string {
  return input.replace(/\\/g, "/").replace(/^\.?\//, "").replace(/^\//, "");
}
