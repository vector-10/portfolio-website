import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { articleComponents } from "@/components/mdx/article";
import { ArticleView } from "@/components/views/article-view";
import { getLocalPosts, getPost } from "@/lib/content";
import { headings } from "@/lib/headings";
import { articleLd, JsonLd } from "@/lib/json-ld";
import { renderMDX } from "@/lib/mdx";
import { pageMeta } from "@/lib/meta";

export async function generateStaticParams() {
  const posts = await getLocalPosts();
  return posts.map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return pageMeta(post.meta.title, post.meta.description, `/writing/${slug}`, {
    publishedTime: post.meta.date,
    modifiedTime: post.meta.updated,
    tags: post.meta.tags,
  });
}

async function ArticleBody({ slug }: { slug: string }) {
  "use cache";
  cacheLife("max");
  const post = await getPost(slug);
  if (!post) return null;
  return renderMDX(post.body, articleComponents);
}

async function Article({ params }: Pick<PageProps<"/writing/[slug]">, "params">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const { meta, body, older, newer } = post;
  return (
    <>
      <JsonLd data={articleLd(meta)} />
      <ArticleView meta={meta} toc={headings(body)} older={older} newer={newer} body={<ArticleBody slug={slug} />} />
    </>
  );
}

export default function ArticlePage({ params }: PageProps<"/writing/[slug]">) {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <Article params={params} />
    </Suspense>
  );
}
