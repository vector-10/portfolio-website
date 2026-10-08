import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const includeDrafts = process.argv.includes("--drafts");
const root = path.join(process.cwd(), "content");

function slugs(dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .filter((f) => {
      const { data } = matter(fs.readFileSync(path.join(full, f), "utf8"));
      return !data.external && (includeDrafts || data.status === "published");
    })
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

const out = path.join(process.cwd(), "src/generated/content-slugs.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify({ work: slugs("projects"), writing: slugs("posts") }, null, 2)}\n`);
