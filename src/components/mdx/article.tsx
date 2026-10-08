import { Children, isValidElement } from "react";
import type { MDXComponents } from "mdx/types";
import { slug } from "github-slugger";
import { Media } from "../media";
import { Pre } from "./shared";

function text(node: React.ReactNode): string {
  return Children.toArray(node)
    .map((c) => (typeof c === "string" || typeof c === "number" ? String(c) : isValidElement<{ children?: React.ReactNode }>(c) ? text(c.props.children) : ""))
    .join("");
}

function Figure({ src, caption, alt }: { src?: string; caption?: string; alt?: string }) {
  return (
    <figure className="my-2 flex flex-col gap-2.5">
      <Media src={src} alt={alt ?? caption ?? ""} ratio="16/9" sizes="(min-width: 800px) 720px, 100vw" />
      {caption && <figcaption className="text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}

const cell = "border-b border-rule py-3 pr-4 last:pr-0";

export const articleComponents: MDXComponents = {
  Figure,
  h2: ({ children }) => (
    <h2 id={slug(text(children))} className="mt-6 scroll-mt-6 text-[clamp(28px,3vw,36px)] leading-[1.15] tracking-[-0.02em]">
      {children}
    </h2>
  ),
  ul: (props) => <ul className="m-0 flex list-disc flex-col gap-2.5 pl-5.5" {...props} />,
  ol: (props) => <ol className="m-0 flex list-decimal flex-col gap-2.5 pl-5.5" {...props} />,
  pre: ({ className = "", ...props }) => <Pre {...props} className={`${className} my-2 text-sm!`} />,
  table: (props) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full min-w-[440px] border-collapse text-base" {...props} />
    </div>
  ),
  thead: (props) => <thead className="text-left font-mono text-xs text-muted" {...props} />,
  th: (props) => <th className="border-b border-ink pr-4 pb-2.5 text-left font-normal last:pr-0" {...props} />,
  td: (props) => <td className={`${cell} nth-2:text-muted last:font-medium`} {...props} />,
};
