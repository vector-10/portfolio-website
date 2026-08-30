import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { PostBanner } from "@/components/blog/post-banner";
import { getAllPosts, getPostBySlug, getReadingTime, tagLabels } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Chukwuduzie Blaise`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

const proseClasses =
  "[&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight " +
  "[&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold " +
  "[&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground " +
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-muted-foreground " +
  "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-muted-foreground " +
  "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 " +
  "[&_strong]:text-foreground [&_strong]:font-semibold " +
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm " +
  "[&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:text-sm";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <article className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent-warm"
        >
          <ArrowLeft className="size-4" />
          Back to Articles
        </Link>

        <PostBanner
          tag={post.tag}
          className="mt-8 h-56 rounded-md sm:h-80"
        />

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <time>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span aria-hidden>·</span>
          <span>{getReadingTime(post.content)} min read</span>
          <Badge variant="outline">{tagLabels[post.tag] ?? post.tag}</Badge>
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        <div className={proseClasses}>
          <MDXRemote source={post.content} />
        </div>

        <div className="mt-12 flex items-center gap-4 border-t border-border pt-8">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-warm/15 font-mono text-sm font-medium text-accent-warm">
            CB
          </div>
          <div>
            <p className="font-medium">Chukwuduzie Blaise</p>
            <p className="text-sm text-muted-foreground">
              Backend engineer building distributed systems, with a specialty
              in fintech and payments infrastructure.
            </p>
          </div>
        </div>
      </article>      
    </>
  );
}
