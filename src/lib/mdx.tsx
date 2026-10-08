import rehypeShiki from "@shikijs/rehype";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { MDXComponents } from "mdx/types";

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
