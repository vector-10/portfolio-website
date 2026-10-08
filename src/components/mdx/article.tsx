import type { MDXComponents } from "mdx/types";
import { Media } from "../media";
import { articleBaseComponents, FigureFrame } from "./article-base";

function Figure({ src, caption, alt }: { src?: string; caption?: string; alt?: string }) {
  return (
    <FigureFrame caption={caption}>
      <Media src={src} alt={alt ?? caption ?? ""} ratio="16/9" sizes="(min-width: 800px) 720px, 100vw" />
    </FigureFrame>
  );
}

export const articleComponents: MDXComponents = { ...articleBaseComponents, Figure };
