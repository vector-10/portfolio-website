import "server-only";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { cache } from "react";
import { auth, devBypass, isOwner } from "@/auth";
import { getStore } from "./store";

export async function requireOwner() {
  if (devBypass) return;
  if (!isOwner(await auth())) notFound();
}

export type ContentType = "Project" | "Post";

export const FOLDERS: Record<ContentType, string> = { Project: "content/projects", Post: "content/posts" };

export type ContentItem = {
  type: ContentType;
  slug: string;
  title: string;
  status: "Published" | "Draft";
  external: boolean;
  path: string;
  sha: string;
  updated: string;
};

export type EditorDoc = {
  type: ContentType;
  slug: string;
  path: string;
  sha: string | null;
  data: Record<string, unknown>;
  body: string;
};

const typeOf = (path: string): ContentType | null =>
  path.startsWith(`${FOLDERS.Project}/`) ? "Project" : path.startsWith(`${FOLDERS.Post}/`) ? "Post" : null;

const slugOf = (path: string) => path.split("/").pop()!.replace(/\.mdx$/, "");

export const listContent = cache(async (): Promise<ContentItem[]> => {
  await requireOwner();
  const store = getStore();
  const files = (await store.tree()).filter((e) => e.path.endsWith(".mdx") && typeOf(e.path));
  const items = await Promise.all(
    files.map(async (entry) => {
      const [file, history] = await Promise.all([store.read(entry.path), store.log(1, entry.path)]);
      const { data } = matter(file?.content.toString("utf8") ?? "");
      return {
        type: typeOf(entry.path)!,
        slug: slugOf(entry.path),
        title: String(data.title ?? slugOf(entry.path)),
        status: data.status === "published" ? "Published" : "Draft",
        external: !!data.external,
        path: entry.path,
        sha: entry.sha,
        updated: history[0]?.date ?? "",
      } satisfies ContentItem;
    }),
  );
  return items.sort((a, b) => b.updated.localeCompare(a.updated));
});

export async function readDoc(type: ContentType, slug: string): Promise<EditorDoc | null> {
  await requireOwner();
  const path = `${FOLDERS[type]}/${slug}.mdx`;
  const file = await getStore().read(path);
  if (!file) return null;
  const { data, content } = matter(file.content.toString("utf8"));
  return { type, slug, path, sha: file.sha, data: JSON.parse(JSON.stringify(data)), body: content.replace(/^\n+/, "") };
}

export type MediaItem = { path: string; src: string; folder: string; name: string; size: number; sha: string; usedIn: string[] };

export const listMedia = cache(async (): Promise<MediaItem[]> => {
  await requireOwner();
  const store = getStore();
  const tree = await store.tree();
  const images = tree.filter((e) => e.path.startsWith("public/images/") && /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(e.path));
  const texts = tree.filter((e) => e.path.endsWith(".mdx") || e.path === "content/site.json" || e.path === "src/config/site.ts");
  const bodies = await Promise.all(
    texts.map(async (e) => ({ path: e.path, text: (await store.read(e.path))?.content.toString("utf8") ?? "" })),
  );
  return images.map((e) => {
    const src = e.path.replace(/^public/, "");
    const parts = e.path.split("/");
    return {
      path: e.path,
      src,
      folder: parts.length > 3 ? parts[2] : "",
      name: parts[parts.length - 1],
      size: e.size,
      sha: e.sha,
      usedIn: bodies.filter((b) => b.text.includes(src)).map((b) => b.path),
    };
  });
});

export async function recentCommits(limit = 5) {
  await requireOwner();
  return getStore().log(limit);
}

export async function storeInfo() {
  await requireOwner();
  const { kind, repo, branch } = getStore();
  return { kind, repo, branch };
}
