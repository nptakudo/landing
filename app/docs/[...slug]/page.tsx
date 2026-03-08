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
  const outboundResolved = note.outboundLinks.filter((link) => link.resolvedSlug).length;

  const backlinks = note.backlinks
    .map((backlink) => notes.find((entry) => entry.slug === backlink))
    .filter((target): target is (typeof notes)[number] => Boolean(target));

  const related = note.relatedSlugs
    .map((relatedSlug) => notes.find((entry) => entry.slug === relatedSlug))
    .filter((target): target is (typeof notes)[number] => Boolean(target));

  return (
    <section className="mx-auto max-w-[860px] space-y-5">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/docs", label: "Docs" },
          { label: note.title },
        ]}
      />

      <header className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Note</p>
        <h1 className="mt-2 font-serif text-5xl tracking-[-0.02em] text-[var(--brand)]">{note.title}</h1>
        <p className="mt-3 max-w-3xl text-[var(--muted)]">{note.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
          <span className="rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5">
            {note.readingTimeMinutes} min read
          </span>
          <span className="rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5">
            Created {createdDate}
          </span>
          <span className="rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5">
            Updated {updatedDate}
          </span>
        </div>
        {note.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--muted-strong)] hover:border-[var(--border-strong)]"
              >
                #{tag}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <TableOfContents headings={note.toc} variant="inline" />

      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8">
        <div className="note-prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.renderedContent}</ReactMarkdown>
        </div>
      </article>

      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--muted)]">Note stats</h2>
          <dl className="mt-2 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5">
              <dt className="text-[var(--muted)]">Reading time</dt>
              <dd className="font-semibold text-[var(--text-strong)]">{note.readingTimeMinutes} min</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5">
              <dt className="text-[var(--muted)]">Backlinks</dt>
              <dd className="font-semibold text-[var(--text-strong)]">{note.backlinks.length}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5">
              <dt className="text-[var(--muted)]">Outgoing links</dt>
              <dd className="font-semibold text-[var(--text-strong)]">{outboundResolved}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]">
          <h2 className="font-serif text-2xl text-[var(--brand)]">Backlinks</h2>
          {backlinks.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {backlinks.map((target) => (
                <li key={target.slug}>
                  <Link
                    href={`/docs/${target.slug}`}
                    className="block rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-sm font-medium text-[var(--text-strong)] hover:border-[var(--border-strong)]"
                  >
                    {target.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-[var(--muted)]">No backlinks yet.</p>
          )}
        </article>

        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]">
          <h2 className="font-serif text-2xl text-[var(--brand)]">Related notes</h2>
          {related.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {related.map((target) => (
                <li key={target.slug}>
                  <Link
                    href={`/docs/${target.slug}`}
                    className="block rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-sm font-medium text-[var(--text-strong)] hover:border-[var(--border-strong)]"
                  >
                    {target.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-[var(--muted)]">No related notes yet.</p>
          )}
        </article>
      </section>

      <Pager
        prev={prev ? { href: `/docs/${prev.slug}`, label: prev.title } : undefined}
        next={next ? { href: `/docs/${next.slug}`, label: next.title } : undefined}
      />
    </section>
  );
}
