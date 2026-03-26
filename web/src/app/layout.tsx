import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claude Plugins Marketplace",
  description:
    "Browse and install Claude Code plugins to extend your development workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 font-mono text-sm font-bold text-accent">
                C
              </div>
              <span className="font-semibold tracking-tight">
                Claude Plugins
              </span>
            </Link>
            <nav className="flex items-center gap-5 text-sm text-muted">
              <a
                href="https://github.com/manuel71/claude-plugins"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="https://code.claude.com/docs/en/plugins"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                Docs
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-5xl px-6 py-6 text-center text-xs text-muted">
            Claude Plugins Marketplace &middot; Powered by{" "}
            <a
              href="https://code.claude.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-dim hover:text-accent"
            >
              Claude Code
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
