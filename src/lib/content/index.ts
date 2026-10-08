import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { cacheLife } from "next/cache";
import type { z } from "zod";
import { PostSchema, ProjectSchema, type Post, type Project } from "./schema";

const root = path.join(process.cwd(), "content");

function readDir<T extends z.ZodType>(dir: string, schema: T) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = schema.safeParse({ slug: file.replace(/\.mdx$/, ""), ...data });
      if (!parsed.success) {
        throw new Error(`Invalid frontmatter in content/${dir}/${file}:\n${parsed.error.message}`);
      }
      return { meta: parsed.data as z.infer<T>, body: content };
    });
}

const isPublished = (status: string) =>
  status === "published" || process.env.NODE_ENV === "development";

export async function getProjects(): Promise<{ meta: Project; body: string }[]> {
  "use cache";
  cacheLife("max");
  return readDir("projects", ProjectSchema)
    .filter((p) => isPublished(p.meta.status))
    .sort((a, b) => (a.meta.order ?? 99) - (b.meta.order ?? 99));
}

export async function getProject(slug: string) {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.meta.slug === slug);
  if (index === -1) return null;
  const next = projects.length > 1 ? projects[(index + 1) % projects.length].meta : null;
  return { ...projects[index], next };
}

export async function getPosts(): Promise<{ meta: Post; body: string }[]> {
  "use cache";
  cacheLife("max");
  return readDir("posts", PostSchema)
    .filter((p) => isPublished(p.meta.status))
    .map((p) => ({
      meta: p.meta.external
        ? p.meta
        : { ...p.meta, readingTime: Math.max(1, Math.round(readingTime(p.body).minutes)) },
      body: p.body,
    }))
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

export async function getLocalPosts() {
  return (await getPosts()).filter((p) => !p.meta.external);
}

export async function getPost(slug: string) {
  const posts = await getLocalPosts();
  const index = posts.findIndex((p) => p.meta.slug === slug);
  if (index === -1) return null;
  return {
    ...posts[index],
    newer: posts[index - 1]?.meta ?? null,
    older: posts[index + 1]?.meta ?? null,
  };
}
