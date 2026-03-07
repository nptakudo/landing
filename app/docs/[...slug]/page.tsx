import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/primitives/breadcrumbs";
import { Pager } from "@/components/primitives/pager";
import { TableOfContents } from "@/components/primitives/toc";
import { getAllNotes, getNoteBySlug } from "@/lib/content/load-content";
import { siteConfig } from "@/lib/site/config";

export const dynamicParams = false;

export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((note) => ({
    slug: note.slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    return {
      title: `${siteConfig.title} · Note not found`,
    };
  }

  return {
    title: `${note.title} · ${siteConfig.title}`,
    description: note.summary,
    openGraph: {
      title: note.title,
      description: note.summary,
      url: `${siteConfig.url}/docs/${note.slug}`,
      type: "article",
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note) {
    notFound();
  }

  const notes = await getAllNotes();
  const index = notes.findIndex((item) => item.slug === note.slug);
  const prev = index > 0 ? notes[index - 1] : null;
  const next = index >= 0 && index < notes.length - 1 ? notes[index + 1] : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
      <article className="space-y-6">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/docs", label: "Docs" },
            { label: note.title },
          ]}
        />

        <header className="space-y-3">
          <h1 className="font-serif text-4xl tracking-tight">{note.title}</h1>
          <p className="text-sm text-[var(--muted)]">
            {note.readingTimeMinutes} min read · updated {new Date(note.updatedAt).toLocaleDateString()}
          </p>
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </header>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.renderedContent}</ReactMarkdown>
        </div>

        {note.backlinks.length > 0 ? (
          <section className="space-y-2">
            <h2 className="font-serif text-2xl">Backlinks</h2>
            <ul className="space-y-1">
              {note.backlinks.map((backlink) => {
                const target = notes.find((entry) => entry.slug === backlink);
                if (!target) {
                  return null;
                }

                return (
                  <li key={backlink}>
                    <Link href={`/docs/${target.slug}`} className="hover:underline">
                      {target.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {note.relatedSlugs.length > 0 ? (
          <section className="space-y-2">
            <h2 className="font-serif text-2xl">Related notes</h2>
            <ul className="space-y-1">
              {note.relatedSlugs.map((relatedSlug) => {
                const target = notes.find((entry) => entry.slug === relatedSlug);
                if (!target) {
                  return null;
                }

                return (
                  <li key={relatedSlug}>
                    <Link href={`/docs/${target.slug}`} className="hover:underline">
                      {target.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <Pager
          prev={prev ? { href: `/docs/${prev.slug}`, label: prev.title } : undefined}
          next={next ? { href: `/docs/${next.slug}`, label: next.title } : undefined}
        />
      </article>

      <div className="space-y-4">
        <TableOfContents headings={note.toc} />
      </div>
    </div>
  );
}
