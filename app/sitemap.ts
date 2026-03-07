import type { MetadataRoute } from "next";
import { getAllNotes, getAllTags } from "@/lib/content/load-content";
import { siteConfig } from "@/lib/site/config";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notes = await getAllNotes();
  const tags = await getAllTags();
  const now = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/docs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/graph`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...notes.map((note) => ({
      url: `${siteConfig.url}/docs/${note.slug}`,
      lastModified: new Date(note.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...tags.map((tag) => ({
      url: `${siteConfig.url}/tags/${tag}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
