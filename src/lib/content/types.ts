export type NoteFrontmatter = {
  publish?: boolean;
  draft?: boolean;
  private?: boolean;
  title?: string;
  description?: string;
  aliases?: string | string[];
  tags?: string | string[];
  created?: string;
  created_date?: string;
  updated?: string;
  updated_date?: string;
  published?: string;
  author?: string | string[];
  source?: string;
  order?: number;
};

export type TocEntry = {
  depth: number;
  id: string;
  text: string;
};

export type ResolvedWikiLink = {
  raw: string;
  target: string;
  alias?: string;
  heading?: string;
  href: string;
  slug: string;
  title: string;
};

export type AttachmentRef = {
  raw: string;
  target: string;
  alias?: string;
  type: "image" | "pdf" | "file";
  assetPath: string;
  publicPath: string;
};

export type ParsedWikiLink = {
  raw: string;
  target: string;
  path: string;
  alias?: string;
  heading?: string;
  isEmbed: boolean;
};

export type ContentWarning = {
  notePath: string;
  message: string;
};

export type PublishedNote = {
  id: string;
  absolutePath: string;
  relativePath: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  html: string;
  excerpt: string;
  frontmatter: NoteFrontmatter;
  aliases: string[];
  tags: string[];
  headings: TocEntry[];
  readingTimeMinutes: number;
  createdAt?: string;
  updatedAt?: string;
  sourcePublishedAt?: string;
  links: ResolvedWikiLink[];
  backlinks: ResolvedWikiLink[];
  attachments: AttachmentRef[];
  relatedSlugs: string[];
  folderSegments: string[];
};

export type SearchIndexEntry = {
  slug: string;
  title: string;
  description?: string;
  aliases: string[];
  tags: string[];
  headings: string[];
  excerpt: string;
  body: string;
};

export type GraphNode = {
  id: string;
  slug: string;
  title: string;
  group: string;
};

export type GraphEdge = {
  source: string;
  target: string;
  kind: "link" | "related";
  weight: number;
};

export type NavigationTreeNode = {
  id: string;
  name: string;
  path: string;
  slug?: string;
  noteTitle?: string;
  children: NavigationTreeNode[];
  kind: "folder" | "note";
};

export type NoteParseResult = {
  absolutePath: string;
  relativePath: string;
  slug: string;
  title: string;
  content: string;
  frontmatter: NoteFrontmatter;
  aliases: string[];
  tags: string[];
  headings: TocEntry[];
  createdAt?: string;
  updatedAt?: string;
  sourcePublishedAt?: string;
  excerpt: string;
  html: string;
  links: ParsedWikiLink[];
  readingTimeMinutes: number;
};

export type SyncResult = {
  notes: PublishedNote[];
  mirroredNotes: string[];
  mirroredAssets: string[];
  warnings: ContentWarning[];
};
