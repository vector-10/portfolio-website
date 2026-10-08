import rehypeShiki from "@shikijs/rehype";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { MDXComponents } from "mdx/types";
import { slug } from "github-slugger";

export async function renderMDX(source: string, components: MDXComponents) {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypeShiki, { theme: "github-dark-default" }]],
      },
    },
  });
  return content;
}

export function headings(source: string) {
  const withoutCode = source.replace(/```[\s\S]*?```/g, "");
  return [...withoutCode.matchAll(/^## (.+)$/gm)].map((m) => {
    const text = m[1].trim();
    return { text, id: slug(text) };
  });
}
