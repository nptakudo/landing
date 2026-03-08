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

    const serialized = JSON.stringify(
      {
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
      },
      null,
      2,
    );

    expect(serialized).toMatchInlineSnapshot(`
      "{
        "notes": [
          {
            "slug": "Guides/second-note",
            "title": "Second Note",
            "tags": [
              "deeper",
              "docs"
            ],
            "aliases": [
              "Follow Up"
            ],
            "headings": [
              {
                "depth": 2,
                "id": "details",
                "text": "Details"
              }
            ],
            "links": [
              {
                "slug": "Guides/start-here",
                "href": "/docs/Guides/start-here"
              }
            ],
            "backlinks": [
              {
                "slug": "Guides/start-here",
                "href": "/docs/Guides/start-here"
              },
              {
                "slug": "Guides/start-here",
                "href": "/docs/Guides/start-here"
              }
            ],
            "relatedSlugs": [
              "Guides/start-here"
            ],
            "attachments": []
          },
          {
            "slug": "Guides/start-here",
            "title": "Start Here",
            "tags": [
              "docs",
              "intro",
              "launch"
            ],
            "aliases": [
              "Welcome"
            ],
            "headings": [
              {
                "depth": 2,
                "id": "overview",
                "text": "Overview"
              }
            ],
            "links": [
              {
                "slug": "Guides/second-note",
                "href": "/docs/Guides/second-note"
              },
              {
                "slug": "Guides/second-note",
                "href": "/docs/Guides/second-note#details"
              }
            ],
            "backlinks": [
              {
                "slug": "Guides/second-note",
                "href": "/docs/Guides/second-note"
              }
            ],
            "relatedSlugs": [
              "Guides/second-note"
            ],
            "attachments": [
              {
                "publicPath": "/obsidian-assets/assets/hero.svg",
                "type": "image"
              }
            ]
          }
        ],
        "searchIndex": [
          {
            "slug": "Guides/second-note",
            "title": "Second Note",
            "aliases": [
              "Follow Up"
            ],
            "tags": [
              "deeper",
              "docs"
            ],
            "headings": [
              "Details"
            ],
            "excerpt": "This note points back to [[Guides/start-here]]. ## Details More detail lives here.",
            "body": "This note points back to [[Guides/start-here]].\\n\\n## Details\\n\\nMore detail lives here."
          },
          {
            "slug": "Guides/start-here",
            "title": "Start Here",
            "aliases": [
              "Welcome"
            ],
            "tags": [
              "docs",
              "intro",
              "launch"
            ],
            "headings": [
              "Overview"
            ],
            "excerpt": "Welcome to the vault. Read [[second-note|the follow-up note]] after this one. ![[assets/hero.svg]] ## Overview This note links to [[second-note#Details]] and uses inline tags like…",
            "body": "Welcome to the vault. Read [[second-note|the follow-up note]] after this one.\\n\\n![[assets/hero.svg]]\\n\\n## Overview\\n\\nThis note links to [[second-note#Details]] and uses inline tags like #launch."
          }
        ],
        "graph": {
          "nodes": [
            {
              "id": "Guides/second-note",
              "slug": "Guides/second-note",
              "title": "Second Note",
              "group": "Guides"
            },
            {
              "id": "Guides/start-here",
              "slug": "Guides/start-here",
              "title": "Start Here",
              "group": "Guides"
            }
          ],
          "edges": [
            {
              "source": "Guides/second-note",
              "target": "Guides/start-here",
              "kind": "link",
              "weight": 1
            },
            {
              "source": "Guides/second-note",
              "target": "Guides/start-here",
              "kind": "related",
              "weight": 0.5
            },
            {
              "source": "Guides/start-here",
              "target": "Guides/second-note",
              "kind": "link",
              "weight": 1
            }
          ]
        },
        "navigation": {
          "id": "root",
          "name": "Docs",
          "path": "",
          "kind": "folder",
          "children": [
            {
              "id": "folder:Guides",
              "name": "Guides",
              "path": "Guides",
              "kind": "folder",
              "children": [
                {
                  "id": "Guides/second-note",
                  "name": "Second Note",
                  "path": "Guides/second-note",
                  "slug": "Guides/second-note",
                  "noteTitle": "Second Note",
                  "kind": "note",
                  "children": []
                },
                {
                  "id": "Guides/start-here",
                  "name": "Start Here",
                  "path": "Guides/start-here",
                  "slug": "Guides/start-here",
                  "noteTitle": "Start Here",
                  "kind": "note",
                  "children": []
                }
              ]
            }
          ]
        },
        "rss": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<rss version=\\"2.0\\">\\n<channel>\\n  <title>Takudo Notes</title>\\n  <link>https://landing.vercel.app</link>\\n  <description>A personal documentation site generated from Obsidian notes, optimized for browsing, reading, and connected thinking.</description>\\n  <language>en</language>\\n  <item>\\n    <title>Second Note</title>\\n    <link>https://landing.vercel.app/docs/Guides/second-note</link>\\n    <guid>https://landing.vercel.app/docs/Guides/second-note</guid>\\n    <pubDate>Wed, 04 Mar 2026 00:00:00 GMT</pubDate>\\n    <description>This note points back to [[Guides/start-here]]. ## Details More detail lives here.</description>\\n  </item>\\n  <item>\\n    <title>Start Here</title>\\n    <link>https://landing.vercel.app/docs/Guides/start-here</link>\\n    <guid>https://landing.vercel.app/docs/Guides/start-here</guid>\\n    <pubDate>Mon, 02 Mar 2026 00:00:00 GMT</pubDate>\\n    <description>Welcome to the vault. Read [[second-note|the follow-up note]] after this one. ![[assets/hero.svg]] ## Overview This note links to [[second-note#Details]] and uses inline tags like…</description>\\n  </item>\\n</channel>\\n</rss>\\n",
        "sitemap": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<urlset xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\">\\n  <url><loc>https://landing.vercel.app/</loc></url>\\n  <url><loc>https://landing.vercel.app/docs</loc></url>\\n  <url><loc>https://landing.vercel.app/graph</loc></url>\\n  <url><loc>https://landing.vercel.app/tags</loc></url>\\n  <url><loc>https://landing.vercel.app/docs/Guides/second-note</loc></url>\\n  <url><loc>https://landing.vercel.app/docs/Guides/start-here</loc></url>\\n  <url><loc>https://landing.vercel.app/tags/deeper</loc></url>\\n  <url><loc>https://landing.vercel.app/tags/docs</loc></url>\\n  <url><loc>https://landing.vercel.app/tags/intro</loc></url>\\n  <url><loc>https://landing.vercel.app/tags/launch</loc></url>\\n</urlset>\\n",
        "robots": "User-agent: *\\nAllow: /\\n\\nSitemap: https://landing.vercel.app/sitemap.xml\\n"
      }"
    `);
  });
});
