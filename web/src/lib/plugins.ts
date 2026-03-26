import fs from "fs";
import path from "path";

export type Skill = {
  name: string;
  description: string;
  userInvocable: boolean;
};

export type Plugin = {
  slug: string;
  name: string;
  description: string;
  version: string;
  author?: { name: string; email?: string };
  homepage?: string;
  repository?: string;
  license?: string;
  keywords: string[];
  category?: string;
  skills: Skill[];
  dependencies: Record<string, string>;
  readme: string;
};

const REPO_ROOT = path.resolve(process.cwd(), "..");

function parseSkillFrontmatter(content: string): Omit<Skill, "name"> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const frontmatter = match[1];
  const description =
    frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? "";
  const userInvocable =
    frontmatter.match(/^user-invocable:\s*(.+)$/m)?.[1]?.trim() === "true";
  return { description, userInvocable };
}

function readSkills(pluginDir: string): Skill[] {
  const skillsDir = path.join(pluginDir, "skills");
  if (!fs.existsSync(skillsDir)) return [];

  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const skillFile = path.join(skillsDir, d.name, "SKILL.md");
      if (!fs.existsSync(skillFile)) return null;
      const content = fs.readFileSync(skillFile, "utf-8");
      const parsed = parseSkillFrontmatter(content);
      if (!parsed) return null;
      return { name: d.name, ...parsed };
    })
    .filter((s): s is Skill => s !== null);
}

export function getPluginSlugs(): string[] {
  return fs
    .readdirSync(REPO_ROOT, { withFileTypes: true })
    .filter((d) => {
      if (!d.isDirectory()) return false;
      if (d.name.startsWith(".") || d.name === "web" || d.name === "node_modules") return false;
      return fs.existsSync(
        path.join(REPO_ROOT, d.name, ".claude-plugin", "plugin.json")
      );
    })
    .map((d) => d.name);
}

export function getPlugin(slug: string): Plugin | null {
  const pluginDir = path.join(REPO_ROOT, slug);
  const manifestPath = path.join(pluginDir, ".claude-plugin", "plugin.json");
  if (!fs.existsSync(manifestPath)) return null;

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  let license = manifest.license ?? "";
  let dependencies: Record<string, string> = {};
  const pkgPath = path.join(pluginDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    if (!license) license = pkg.license ?? "";
    dependencies = pkg.dependencies ?? {};
  }

  let readme = "";
  const readmePath = path.join(pluginDir, "README.md");
  if (fs.existsSync(readmePath)) {
    readme = fs.readFileSync(readmePath, "utf-8");
  }

  return {
    slug,
    name: manifest.name ?? slug,
    description: manifest.description ?? "",
    version: manifest.version ?? "0.0.0",
    author: manifest.author,
    homepage: manifest.homepage,
    repository: manifest.repository,
    license,
    keywords: manifest.keywords ?? [],
    category: manifest.category,
    skills: readSkills(pluginDir),
    dependencies,
    readme,
  };
}

export function getAllPlugins(): Plugin[] {
  return getPluginSlugs()
    .map(getPlugin)
    .filter((p): p is Plugin => p !== null);
}

export function getMarketplaceMeta() {
  const marketplacePath = path.join(
    REPO_ROOT,
    ".claude-plugin",
    "marketplace.json"
  );
  if (!fs.existsSync(marketplacePath)) return null;
  return JSON.parse(fs.readFileSync(marketplacePath, "utf-8"));
}
