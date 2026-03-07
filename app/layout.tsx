import type { Metadata } from "next";
import { Manrope, Newsreader, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TopNav } from "@/components/layout/top-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { siteConfig } from "@/lib/site/config";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${newsreader.variable} ${mono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <TopNav />
            <div className="mx-auto flex max-w-7xl">
              <Sidebar />
              <main className="w-full px-4 py-8 sm:px-6 lg:px-10">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
