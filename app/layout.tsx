import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ShellFrame } from "@/components/layout/shell-frame";
import { siteConfig } from "@/lib/site/config";
import { getAllNotes, getAllTags } from "@/lib/content/load-content";
import { buildNavigationTree } from "@/lib/content/navigation";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const notes = await getAllNotes();
  const tags = await getAllTags();
  const navNodes = buildNavigationTree(notes);
  const searchItems = notes.map((note) => ({
    title: note.title,
    href: `/docs/${note.slug}`,
    description: note.summary,
  }));

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ShellFrame
            navNodes={navNodes}
            searchItems={searchItems}
            stats={{ notes: notes.length, tags: tags.length }}
          >
            {children}
          </ShellFrame>
        </ThemeProvider>
      </body>
    </html>
  );
}
