import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ slug: ["welcome"] }];
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const current = slug.join("/");

  if (current !== "welcome") {
    notFound();
  }

  return (
    <article className="prose prose-neutral max-w-none dark:prose-invert">
      <h1>Welcome</h1>
      <p>
        This starter note proves static export wiring for catch-all docs routes.
      </p>
      <p>
        Milestone 3 replaces this placeholder with generated Obsidian content.
      </p>
    </article>
  );
}
