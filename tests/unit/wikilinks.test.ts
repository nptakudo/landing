import { describe, expect, it } from "vitest";
import {
  extractInlineTags,
  normalizeAliases,
  normalizeTags,
  parseWikiLinks,
} from "@/lib/obsidian/wikilinks";

describe("wikilinks parser", () => {
  it("parses regular and embedded wikilinks", () => {
    const input = "See [[Roadmap|Plan]] and ![[asset/diagram.png]]";
    const links = parseWikiLinks(input);

    expect(links).toEqual([
      {
        raw: "[[Roadmap|Plan]]",
        embed: false,
        target: "Roadmap",
        anchor: undefined,
        alias: "Plan",
      },
      {
        raw: "![[asset/diagram.png]]",
        embed: true,
        target: "asset/diagram.png",
        anchor: undefined,
        alias: undefined,
      },
    ]);
  });

  it("normalizes aliases and tags", () => {
    expect(normalizeAliases([" Start ", "Ref"])).toEqual(["Ref", "Start"]);
    expect(normalizeTags(["Docs", "knowledge-base"], extractInlineTags("#Docs #daily"))).toEqual([
      "daily",
      "docs",
      "knowledge-base",
    ]);
  });
});
