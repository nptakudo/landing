export type NoteFrontmatter = {
  title?: string;
  publish?: boolean;
  draft?: boolean;
  private?: boolean;
  aliases?: string[] | string;
  tags?: string[] | string;
  created?: string;
  created_date?: string;
  updated?: string;
  updated_date?: string;
  published?: string;
  description?: string;
};

export type TocHeading = {
  id: string;
  text: string;
  depth: number;
};

export type ResolvedWikiLink = {
  raw: string;
  target: string;
  anchor?: string;
  alias?: string;
  resolvedSlug?: string;
  resolvedHref?: string;
  unresolved: boolean;
  embed: boolean;
};

export type PublishedNote = {
  id: string;
  sourcePath: string;
  slug: string;
  title: string;
  content: string;
  renderedContent: string;
  summary: string;
  description?: string;
  tags: string[];
  aliases: string[];
  folder: string;
  createdAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  toc: TocHeading[];
  outboundLinks: ResolvedWikiLink[];
  backlinks: string[];
  relatedSlugs: string[];
};

export type ContentGraph = {
  notes: PublishedNote[];
  bySlug: Map<string, PublishedNote>;
  tags: Map<string, PublishedNote[]>;
};
