export type SiteConfig = {
  title: string;
  description: string;
  author: string;
  intro: string;
  location: string;
  url: string;
  featuredFolders: string[];
  featuredTags: string[];
  socials: { label: string; href: string }[];
};

export const siteConfig: SiteConfig = {
  title: "Takudo Notes",
  description:
    "A personal documentation site generated from Obsidian notes, optimized for browsing, reading, and connected thinking.",
  author: "Takudo",
  intro:
    "Systems notes, engineering references, and working thoughts published from a local Obsidian vault.",
  location: "Singapore",
  url: "https://landing.vercel.app",
  featuredFolders: ["Learning", "AzureLearn", "Clippings"],
  featuredTags: ["database", "systems", "azure", "notes"],
  socials: [
    { label: "GitHub", href: "https://github.com/nptakudo" },
    { label: "Vault Workflow", href: "/docs" },
  ],
};
