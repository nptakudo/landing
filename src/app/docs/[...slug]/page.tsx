import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell } from "@/components/layout/docs-shell";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import {
  getNavigationRoot,
  getPagerForSlug,
  getPublishedNoteBySlug,
  getPublishedNotes,
} from "@/lib/site/content";
import { siteConfig } from "@/site.config";

export async function generateStaticParams() {
  const notes = await getPublishedNotes();
  return notes.map((note) => ({
    slug: note.slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const joinedSlug = (slug ?? []).join("/");
  const note = await getPublishedNoteBySlug(joinedSlug);

  if (!note) {
    return {
      title: "Not found",
    };
  }

  return {
    title: note.title,
    description: note.description ?? note.excerpt,
    alternates: {
      canonical: `/docs/${note.slug}`,
    },
    openGraph: {
      title: note.title,
      description: note.description ?? note.excerpt,
      url: new URL(`/docs/${note.slug}`, siteConfig.url).toString(),
      type: "article",
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const joinedSlug = (slug ?? []).join("/");

  const [note, navigation, pager, allNotes] = await Promise.all([
    getPublishedNoteBySlug(joinedSlug),
    getNavigationRoot(),
    getPagerForSlug(joinedSlug),
    getPublishedNotes(),
  ]);

  if (!note) {
    notFound();
  }

  const relatedNotes = note.relatedSlugs
    .map((relatedSlug) => allNotes.find((candidate) => candidate.slug === relatedSlug))
    .filter((candidate): candidate is (typeof allNotes)[number] => Boolean(candidate));
  const breadcrumbSegments = [{ label: "Docs", href: "/docs" }, ...note.folderSegments.map((segment) => ({
    label: segment.replace(/-/g, " "),
  }))];
  const fileAttachments = note.attachments.filter((attachment) => attachment.type !== "image");

  return (
    <DocsShell
      navigation={navigation}
      outline={note.headings}
      activeHref={`/docs/${note.slug}`}
    >
      <article className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)] sm:p-10">
        <header className="border-b border-[var(--border-soft)] pb-8">
          <Breadcrumbs segments={breadcrumbSegments} currentLabel={note.title} />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            {(note.folderSegments[0] ?? "Notes").replace(/-/g, " ")} · {note.readingTimeMinutes} min read
            {note.updatedAt ? ` · Updated ${note.updatedAt.slice(0, 10)}` : ""}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-tight tracking-tight text-[var(--foreground)]">
            {note.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted)]">
            {note.description ?? note.excerpt}
          </p>
          {note.tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <Link
                  key={`${note.slug}-${tag}`}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)] transition hover:text-[var(--foreground)]"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          ) : null}
        </header>

        <div
          className="note-body mt-10"
          dangerouslySetInnerHTML={{ __html: note.html }}
        />

        {fileAttachments.length > 0 ? (
          <section className="mt-10 rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--panel)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Attachments
            </p>
            <div className="mt-4 grid gap-3">
              {fileAttachments.map((attachment) => (
                <a
                  key={attachment.raw}
                  href={attachment.publicPath}
                  className="rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--foreground)]"
                >
                  {attachment.alias ?? attachment.target} · {attachment.type}
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {note.backlinks.length > 0 ? (
          <section className="mt-10 rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--panel)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Backlinks
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {note.backlinks.map((backlink) => (
                <Link
                  key={`${note.slug}-${backlink.slug}`}
                  href={`/docs/${backlink.slug}`}
                  className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-4 py-2 text-sm text-[var(--foreground)]"
                >
                  {backlink.title}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {(pager.previous || pager.next) ? (
          <nav className="mt-10 grid gap-4 sm:grid-cols-2">
            {pager.previous ? (
              <Link
                href={`/docs/${pager.previous.slug}`}
                className="rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                  Previous
                </p>
                <p className="mt-2 font-serif text-2xl tracking-tight text-[var(--foreground)]">
                  {pager.previous.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {pager.next ? (
              <Link
                href={`/docs/${pager.next.slug}`}
                className="rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface)] p-5 text-right shadow-[var(--shadow-soft)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                  Next
                </p>
                <p className="mt-2 font-serif text-2xl tracking-tight text-[var(--foreground)]">
                  {pager.next.title}
                </p>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </article>

      {relatedNotes.length > 0 ? (
        <section className="mt-6 rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Related notes
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {relatedNotes.map((relatedNote) => (
              <Link
                key={relatedNote.slug}
                href={`/docs/${relatedNote.slug}`}
                className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-4 py-2 text-sm text-[var(--foreground)]"
              >
                {relatedNote.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </DocsShell>
  );
}
