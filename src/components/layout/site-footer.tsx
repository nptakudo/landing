import { siteConfig } from "@/site.config";

export function SiteFooter() {
    return (
        <footer className="border-t border-[var(--border-soft)] bg-[var(--surface)]">
            <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-6 px-5 py-12 sm:flex-row sm:justify-between sm:px-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--foreground)] font-serif text-sm font-bold text-[var(--background)]">
                        {siteConfig.author.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">{siteConfig.title}</p>
                        <p className="text-xs text-[var(--muted)]">by {siteConfig.author}</p>
                    </div>
                </div>
                <p className="text-center text-xs text-[var(--muted)]">
                    Built with Obsidian + Next.js · {siteConfig.location}
                </p>
                <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                    <a href="/docs" className="transition hover:text-[var(--foreground)]">Docs</a>
                    <a href="/graph" className="transition hover:text-[var(--foreground)]">Graph</a>
                    <a href="/tags" className="transition hover:text-[var(--foreground)]">Tags</a>
                </div>
            </div>
        </footer>
    );
}
