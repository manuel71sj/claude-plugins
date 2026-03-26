import { getAllPlugins, getMarketplaceMeta } from "@/lib/plugins";
import { PluginCard } from "@/components/plugin-card";

export default function HomePage() {
  const plugins = getAllPlugins();
  const marketplace = getMarketplaceMeta();
  const marketplaceName = marketplace?.name ?? "claude-plugins-manuel71";

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <section className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">
          Plugin Marketplace
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          Claude Code plugins to extend your development workflow. Browse the
          catalog and install with a single command.
        </p>

        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
            Quick Start
          </p>
          <div className="space-y-1.5 font-mono text-sm">
            <p className="text-muted">
              <span className="text-accent-dim"># Add this marketplace</span>
            </p>
            <p>
              <span className="text-accent">/plugin marketplace add</span>{" "}
              manuel71/claude-plugins
            </p>
            <p className="mt-2 text-muted">
              <span className="text-accent-dim"># Install a plugin</span>
            </p>
            <p>
              <span className="text-accent">/plugin install</span>{" "}
              {"<plugin>"}@{marketplaceName}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Plugins
            <span className="ml-2 text-sm font-normal text-muted">
              ({plugins.length})
            </span>
          </h2>
        </div>

        {plugins.length === 0 ? (
          <p className="text-sm text-muted">No plugins available yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {plugins.map((plugin) => (
              <PluginCard key={plugin.slug} plugin={plugin} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
