import type { Metadata } from "next";
import { site } from "@/config/site";

export function pageMeta(
  title: string,
  description: string,
  path: string,
  article?: { publishedTime: string; modifiedTime?: string; tags: string[] },
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      locale: "en",
      ...(article ? { type: "article", ...article } : { type: "website" }),
    },
    twitter: { card: "summary_large_image", title, description, creator: "@vector_ware" },
  };
}
