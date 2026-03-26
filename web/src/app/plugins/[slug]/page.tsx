import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import {
  getPlugin,
  getPluginSlugs,
  getMarketplaceMeta,
} from "@/lib/plugins";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPluginSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const plugin = getPlugin(slug);
  if (!plugin) return {};
  return {
    title: `${plugin.name} - Claude Plugins`,
    description: plugin.description,
  };
}

export default async function PluginDetailPage({ params }: Props) {
  const { slug } = await params;
  const plugin = getPlugin(slug);
  if (!plugin) notFound();

  const marketplace = getMarketplaceMeta();
  const marketplaceName = marketplace?.name ?? "claude-plugins-manuel71";
  const installCmd = `/plugin install ${plugin.name}@${marketplaceName}`;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Plugins
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{plugin.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{plugin.name}</h1>
          <span className="rounded-md bg-accent/10 px-2.5 py-0.5 font-mono text-sm text-accent">
            v{plugin.version}
          </span>
        </div>
        <p className="mt-2 text-base text-muted">{plugin.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {plugin.keywords.map((kw) => (
            <span
              key={kw}
              className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-xs text-muted"
            >
              {kw}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-muted">
          {plugin.license && <span>License: {plugin.license}</span>}
          {plugin.author && <span>Author: {plugin.author.name}</span>}
        </div>
      </div>

      {/* Install Command */}
      <div className="mb-8 rounded-lg border border-border bg-card p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Install
        </p>
        <code className="block font-mono text-sm text-accent">
          {installCmd}
        </code>
      </div>

      {/* Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* README */}
        <div className="lg:col-span-2">
          {plugin.readme ? (
            <article className="prose-invert prose prose-zinc max-w-none prose-headings:text-foreground prose-p:text-muted prose-a:text-accent prose-strong:text-foreground prose-code:rounded prose-code:bg-foreground/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-card prose-th:text-foreground prose-td:text-muted">
              <Markdown remarkPlugins={[remarkGfm]}>{plugin.readme}</Markdown>
            </article>
          ) : (
            <p className="text-sm text-muted">No README available.</p>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Skills */}
          {plugin.skills.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">Skills</h3>
              <ul className="space-y-2.5">
                {plugin.skills.map((skill) => (
                  <li key={skill.name}>
                    <code className="text-sm text-accent">
                      /{plugin.name}:{skill.name}
                    </code>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">
                      {skill.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dependencies */}
          {Object.keys(plugin.dependencies).length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">Dependencies</h3>
              <ul className="space-y-1">
                {Object.entries(plugin.dependencies).map(([name, version]) => (
                  <li
                    key={name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-foreground">{name}</span>
                    <span className="font-mono text-muted">{version}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          {(plugin.homepage || plugin.repository) && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">Links</h3>
              <ul className="space-y-1.5 text-sm">
                {plugin.homepage && (
                  <li>
                    <a
                      href={plugin.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-dim hover:text-accent"
                    >
                      Homepage
                    </a>
                  </li>
                )}
                {plugin.repository && (
                  <li>
                    <a
                      href={plugin.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-dim hover:text-accent"
                    >
                      Repository
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
