export function generateStaticParams() {
  return [{ tag: "all" }];
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  return (
    <section className="space-y-3">
      <h1 className="font-serif text-3xl">Tag: {tag}</h1>
      <p className="text-[var(--muted)]">
        Tag pages will list published notes after content indexing is in place.
      </p>
    </section>
  );
}
