import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostTag = "fintech" | "distributed-systems" | "project-deepdive";

export interface PostFrontmatter {
  title: string;
  summary: string;
  date: string;
  tag: PostTag;
  relatedProject?: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
}

export function getAllPosts(): Post[] {
  const files = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const fileContents = fs.readFileSync(
      path.join(postsDirectory, filename),
      "utf8"
    );
    const { data, content } = matter(fileContents);
    return { slug, content, ...(data as PostFrontmatter) };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export const tagLabels: Record<PostTag, string> = {
  fintech: "Fintech",
  "distributed-systems": "Distributed Systems",
  "project-deepdive": "Project Deep-Dive",
};
