import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { getAllPosts, getReadingTime, tagLabels } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Articles — Chukwuduzie Blaise",
  description:
    "Articles on fintech engineering, distributed systems, and project deep-dives.",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndex() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Nav />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-accent-warm/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-6 pt-24 pb-16">
          <Reveal>
            <p className="font-mono text-sm tracking-widest text-accent-warm uppercase">
              Articles
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Notes on backend systems &amp; fintech
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Case studies, decisions, and the reasoning behind them — fintech
              engineering, distributed systems, and project deep-dives.
            </p>
          </Reveal>
        </div>
      </section>

      {featured && (
        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-accent-warm/10 blur-2xl" />
              <Link
                href={`/blog/${featured.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-border bg-card p-8 transition-colors hover:border-accent-warm/40"
              >
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
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  {featured.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                  Read the piece
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="flex flex-col divide-y divide-border">
          {rest.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.05}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-center justify-between gap-6 py-6"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <time>{formatDate(post.date)}</time>
                    <span aria-hidden>·</span>
                    <span>{getReadingTime(post.content)} min read</span>
                    <Badge variant="outline">
                      {tagLabels[post.tag] ?? post.tag}
                    </Badge>
                  </div>
                  <h2 className="mt-2 text-xl font-medium group-hover:text-accent-warm">
                    {post.title}
                  </h2>
                  <p className="mt-1 text-muted-foreground">{post.summary}</p>
                </div>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-warm group-hover:opacity-100" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
