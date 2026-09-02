import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { PostBanner } from "@/components/blog/post-banner";
import { Reveal } from "@/components/reveal";
import {
  getAllPosts,
  getPostsByTag,
  getReadingTime,
  tagLabels,
  tagOrder,
  type Post,
  type PostTag,
} from "@/lib/posts";

export const metadata: Metadata = {
  title: "Articles — Chukwuduzie Blaise",
  description:
    "Articles on system design, project architecture, career notes, and the business case for software.",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PostCard({ post }: { post: Post }) {
  const isExternal = Boolean(post.externalUrl);

  return (
    <Link
      href={isExternal ? post.externalUrl! : `/blog/${post.slug}`}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group block h-full"
    >
      <PostBanner tag={post.tag as PostTag} className="h-52 rounded-md" />
      <div className="pt-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <time>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          {isExternal ? (
            <Badge variant="outline">{post.platform}</Badge>
          ) : (
            <span>{getReadingTime(post.content)} min read</span>
          )}
        </div>
        <h3 className="mt-1 flex items-center gap-1.5 text-lg font-medium group-hover:text-accent-warm">
          {post.title}
          {isExternal && (
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground group-hover:text-accent-warm" />
          )}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {post.summary}
        </p>
        {!isExternal && (
          <div className="mt-4 flex items-center justify-end">
            <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-warm group-hover:opacity-100" />
          </div>
        )}
      </div>
    </Link>
  );
}

function BigPostCard({ post }: { post: Post }) {
  const isExternal = Boolean(post.externalUrl);

  return (
    <Link
      href={isExternal ? post.externalUrl! : `/blog/${post.slug}`}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group block h-full"
    >
      <PostBanner
        tag={post.tag as PostTag}
        className="h-64 rounded-lg sm:h-72 lg:h-84"
      />
      <div className="pt-6 sm:pt-8">
        <p className="font-mono text-xs tracking-widest text-accent-warm uppercase">
          Latest
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <time>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          {isExternal ? (
            <Badge variant="outline">{post.platform}</Badge>
          ) : (
            <span>{getReadingTime(post.content)} min read</span>
          )}
          <Badge variant="outline">{tagLabels[post.tag as PostTag]}</Badge>
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-3 text-muted-foreground">{post.summary}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
          Read the piece
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

export default function BlogIndex() {
  const posts = getAllPosts();
  const [first, second, third] = posts;
  

  return (
    <>
      <Nav />

      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 pt-14 pb-16">
          <Reveal>
            <p className="font-mono text-sm tracking-widest text-accent-warm uppercase">
              Articles
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Notes on backend systems &amp; fintech
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              System design, project architecture, career notes, and the
              business case for software.
            </p>
          </Reveal>
        </div>
      </section>

      {first && (
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="relative">
              <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <BigPostCard post={first} />
                <div className="flex flex-col gap-6">
                  {second && <PostCard post={second} />}
                  {third && <PostCard post={third} />}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-20">
        {tagOrder.map((tag) => {
          const tagPosts = getPostsByTag(tag).slice(0, 4);
          if (tagPosts.length === 0) return null;

          return (
            <div key={tag} className="mb-16 last:mb-0">
              <Reveal>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {tagLabels[tag]}
                </h2>
              </Reveal>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {tagPosts.map((post, index) => (
                  <Reveal key={post.slug} delay={index * 0.05}>
                    <PostCard post={post} />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
