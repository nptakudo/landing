import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildContentGraph,
  buildNavigationTree,
  buildRobotsTxt,
  buildRssXml,
  buildSearchIndex,
  buildSitemapXml,
  loadPublishedNotes,
} from "../../src/lib/content";

const fixtureRoot = path.resolve(import.meta.dirname, "../fixtures/vault");

describe("deterministic artifacts", () => {
  it("serializes notes and generated artifacts in stable order", async () => {
    const notes = await loadPublishedNotes(fixtureRoot);

    expect({
      notes: notes.map((note) => ({
        slug: note.slug,
        title: note.title,
        tags: note.tags,
        aliases: note.aliases,
        headings: note.headings,
        links: note.links.map((link) => ({
          slug: link.slug,
          href: link.href,
        })),
        backlinks: note.backlinks.map((link) => ({
          slug: link.slug,
          href: link.href,
        })),
        relatedSlugs: note.relatedSlugs,
        attachments: note.attachments.map((attachment) => ({
          publicPath: attachment.publicPath,
          type: attachment.type,
        })),
      })),
      searchIndex: buildSearchIndex(notes),
      graph: buildContentGraph(notes),
      navigation: buildNavigationTree(notes),
      rss: buildRssXml(notes),
      sitemap: buildSitemapXml(notes),
      robots: buildRobotsTxt(),
    }).toMatchSnapshot();
  });
});
