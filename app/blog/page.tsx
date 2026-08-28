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
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-colors hover:ring-accent-warm/40"
    >
      <PostBanner tag={post.tag} className="h-36" />
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <time>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{getReadingTime(post.content)} min read</span>
        </div>
        <h3 className="mt-1 text-lg font-medium group-hover:text-accent-warm">
          {post.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {post.summary}
        </p>
        <div className="mt-4 flex items-center justify-end">
          <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-warm group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}

export default function BlogIndex() {
  const posts = getAllPosts();
  const [featured] = posts;

  return (
    <>
      <Nav />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-accent-warm/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16">
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

      {featured && (
        <div className="relative mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-accent-warm/10 blur-2xl" />
              <Link
                href={`/blog/${featured.slug}`}
                className="group relative block overflow-hidden rounded-2xl ring-1 ring-foreground/10 transition-colors hover:ring-accent-warm/40"
              >
                <PostBanner tag={featured.tag} className="h-48 sm:h-56" />
                <div className="bg-card p-8 sm:p-10">
                  <p className="font-mono text-xs tracking-widest text-accent-warm uppercase">
                    Latest
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <time>{formatDate(featured.date)}</time>
                    <span aria-hidden>·</span>
                    <span>{getReadingTime(featured.content)} min read</span>
                    <Badge variant="outline">
                      {tagLabels[featured.tag] ?? featured.tag}
                    </Badge>
                  </div>
                  <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-muted-foreground">
                    {featured.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    Read the piece
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </div>
          </Reveal>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 py-20">
        {tagOrder.map((tag) => {
          const tagPosts = getPostsByTag(tag, featured?.slug).slice(0, 2);
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
