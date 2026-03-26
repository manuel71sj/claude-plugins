import Link from "next/link";
import type { Plugin } from "@/lib/plugins";

export function PluginCard({ plugin }: { plugin: Plugin }) {
  return (
    <Link
      href={`/plugins/${plugin.slug}`}
      className="group block rounded-xl border border-border bg-card p-6 transition-colors hover:bg-card-hover hover:border-accent-dim"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground group-hover:text-accent">
          {plugin.name}
        </h2>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">
          v{plugin.version}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
        {plugin.description}
      </p>

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

      <div className="mt-4 flex items-center gap-4 text-xs text-muted">
        {plugin.skills.length > 0 && (
          <span>{plugin.skills.length} skills</span>
        )}
        {plugin.license && <span>{plugin.license}</span>}
        {plugin.category && (
          <span className="rounded bg-foreground/5 px-1.5 py-0.5">
            {plugin.category}
          </span>
        )}
      </div>
    </Link>
  );
}
