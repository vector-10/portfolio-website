import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getLocalPosts, getProjects } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getLocalPosts()]);
  const pages = ["", "/work", "/writing", "/about", "/work-with-me"].map((path) => ({ url: `${site.url}${path}` }));
  return [
    ...pages,
    ...projects.map(({ meta }) => ({ url: `${site.url}/work/${meta.slug}` })),
    ...posts.map(({ meta }) => ({
      url: `${site.url}/writing/${meta.slug}`,
      lastModified: meta.updated ?? meta.date,
    })),
  ];
}
