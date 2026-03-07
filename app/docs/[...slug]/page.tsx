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
  const updatedDate = new Date(note.updatedAt).toLocaleDateString();
  const createdDate = new Date(note.createdAt).toLocaleDateString();

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_284px]">
      <article className="space-y-6">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/docs", label: "Docs" },
            { label: note.title },
          ]}
        />

        <header className="surface-card space-y-4 rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">Note</p>
          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">{note.title}</h1>
          <p className="max-w-3xl text-[var(--muted)]">{note.summary}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5">
              {note.readingTimeMinutes} min read
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5">
              Created {createdDate}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5">
              Updated {updatedDate}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs hover:border-[var(--border-strong)]"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </header>

        <div className="surface-card rounded-3xl px-5 py-6 sm:px-8 sm:py-7">
          <div className="note-prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.renderedContent}</ReactMarkdown>
          </div>
        </div>

        {(note.backlinks.length > 0 || note.relatedSlugs.length > 0) && (
          <section className="grid gap-4 sm:grid-cols-2">
            {note.backlinks.length > 0 ? (
              <section className="surface-card rounded-2xl p-5">
                <h2 className="font-serif text-2xl">Backlinks</h2>
                <ul className="mt-3 space-y-2">
                  {note.backlinks.map((backlink) => {
                    const target = notes.find((entry) => entry.slug === backlink);
                    if (!target) {
                      return null;
                    }

                    return (
                      <li key={backlink}>
                        <Link
                          href={`/docs/${target.slug}`}
                          className="block rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium hover:border-[var(--border-strong)]"
                        >
                          {target.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {note.relatedSlugs.length > 0 ? (
              <section className="surface-card rounded-2xl p-5">
                <h2 className="font-serif text-2xl">Related notes</h2>
                <ul className="mt-3 space-y-2">
                  {note.relatedSlugs.map((relatedSlug) => {
                    const target = notes.find((entry) => entry.slug === relatedSlug);
                    if (!target) {
                      return null;
                    }

                    return (
                      <li key={relatedSlug}>
                        <Link
                          href={`/docs/${target.slug}`}
                          className="block rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium hover:border-[var(--border-strong)]"
                        >
                          {target.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}
          </section>
        )}

        <Pager
          prev={prev ? { href: `/docs/${prev.slug}`, label: prev.title } : undefined}
          next={next ? { href: `/docs/${next.slug}`, label: next.title } : undefined}
        />
      </article>

      <div className="space-y-4 lg:sticky lg:top-[5.5rem] lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
        <section className="surface-card rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Note stats
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
              <dt className="text-[var(--muted)]">Reading time</dt>
              <dd className="font-semibold">{note.readingTimeMinutes} min</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
              <dt className="text-[var(--muted)]">Backlinks</dt>
              <dd className="font-semibold">{note.backlinks.length}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
              <dt className="text-[var(--muted)]">Outgoing links</dt>
              <dd className="font-semibold">
                {note.outboundLinks.filter((link) => link.resolvedSlug).length}
              </dd>
            </div>
          </dl>
        </section>
        <TableOfContents headings={note.toc} />
      </div>
    </div>
  );
}
