"use client";

import type { MDXComponents } from "mdx/types";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/header";
import { articleBaseComponents, FigureFrame } from "@/components/mdx/article-base";
import { caseStudyComponents } from "@/components/mdx/case-study";
import { ArticleView } from "@/components/views/article-view";
import { CaseStudyView } from "@/components/views/case-study-view";
import type { Post, Project } from "@/lib/content/schema";
import { previewMeta, type FormDoc } from "@/lib/dashboard/doc";
import { headings } from "@/lib/headings";

export type PreviewMessage = { kind: "preview"; doc: FormDoc; images: Record<string, string> };

function Unknown({ name }: { name: string }) {
  return (
    <div className="border border-dashed border-rule px-3 py-2.5 font-mono text-[11px] text-muted">
      &lt;{name}&gt; renders on the site
    </div>
  );
}

function withPlaceholders(body: string, components: MDXComponents): MDXComponents {
  const names = new Set([...body.matchAll(/<([A-Z][A-Za-z0-9]*)/g)].map((m) => m[1]));
  const out: MDXComponents = { ...components };
  for (const name of names) {
    if (!(name in out)) out[name] = () => <Unknown name={name} />;
  }
  return out;
}

export function Preview() {
  const [doc, setDoc] = useState<FormDoc | null>(null);
  const [images, setImages] = useState<Record<string, string>>({});
  const [compiled, setCompiled] = useState<MDXRemoteSerializeResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const onMessage = (event: MessageEvent<PreviewMessage>) => {
      if (event.origin !== window.location.origin || event.data?.kind !== "preview") return;
      setDoc(event.data.doc);
      setImages(event.data.images);
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ kind: "preview-ready" }, window.location.origin);
    const block = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a")) e.preventDefault();
    };
    document.addEventListener("click", block);
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", block);
    };
  }, []);

  useEffect(() => {
    if (!doc) return;
    let cancelled = false;
    serialize(doc.body, { blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } })
      .then((result) => {
        if (cancelled) return;
        setCompiled(result);
        setError("");
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [doc]);

  if (!doc) return <main className="min-h-screen" />;

  const meta = previewMeta(doc);
  const Figure = ({ src, caption, alt }: { src?: string; caption?: string; alt?: string }) => (
    <FigureFrame caption={caption}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- preview shows staged, uncommitted uploads that next/image can't serve
        <img src={images[src] ?? src} alt={alt ?? caption ?? ""} className="aspect-video w-full object-cover" />
      ) : (
        <div className="aspect-video w-full border border-dashed border-rule" />
      )}
    </FigureFrame>
  );

  const components = withPlaceholders(
    doc.body,
    doc.type === "Project" ? caseStudyComponents(meta as Project) : { ...articleBaseComponents, Figure },
  );

  const body = error ? (
    <div role="alert" className="my-6 border border-dashed border-ink bg-soft p-4 font-mono text-[13px]">
      MDX error: {error}
    </div>
  ) : compiled ? (
    <MDXRemote {...compiled} components={components} />
  ) : null;

  return (
    <>
      <Header />
      {doc.type === "Project" ? (
        <CaseStudyView meta={meta as Project} body={body} />
      ) : (
        <ArticleView meta={meta as Post} toc={headings(doc.body)} body={body} />
      )}
    </>
  );
}
