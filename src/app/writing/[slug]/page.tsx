import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ClosingBand } from "@/components/closing-band";
import { site } from "@/config/site";
import { articleComponents } from "@/components/mdx/article";
import { NewsletterForm } from "@/components/newsletter-form";
import { Reactions } from "@/components/reactions";
import { getLocalPosts, getPost } from "@/lib/content";
import { fullDate } from "@/lib/format";
import { headings, renderMDX } from "@/lib/mdx";
import { getReactionCounts } from "@/lib/reactions";

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
  const toc = headings(body);

  return (
    <main>
      <section className="gutter flex max-w-[1100px] flex-col gap-6 pt-[clamp(48px,7vw,96px)] pb-[clamp(32px,4vw,56px)] box-content">
        <Link href="/writing" className="text-sm text-muted">
          ← All writing
        </Link>
        <div className="font-mono text-[13px] text-muted">{meta.tags.join(" · ")}</div>
        <h1 className="text-[clamp(40px,5.6vw,80px)] leading-[1.02] tracking-[-0.03em]">{meta.title}</h1>
        <p className="max-w-[760px] text-[clamp(19px,1.8vw,23px)] leading-[1.45] text-muted">{meta.description}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2.5 border-t border-rule pt-5 font-mono text-[13px] text-muted">
          <span>{fullDate(meta.date)}</span>
          <span>{meta.readingTime} min read</span>
          {meta.updated && <span>Updated {fullDate(meta.updated)}</span>}
        </div>
      </section>

      <div className="gutter flex flex-wrap items-start gap-x-20 gap-y-10 pb-[clamp(56px,7vw,96px)]">
        {toc.length > 0 && (
          <nav aria-label="On this page" className="sticky top-6 flex flex-[0_1_220px] flex-col gap-2.5 text-sm">
            <div className="font-mono text-xs text-muted">On this page</div>
            {toc.map((h) => (
              <a key={h.id} href={`#${h.id}`}>
                {h.text}
              </a>
            ))}
          </nav>
        )}
        <article className="article flex max-w-[720px] min-w-0 flex-[1_1_560px] flex-col gap-6 text-lg leading-[1.7]">
          <ArticleBody slug={slug} />
          {site.reactions && <Reactions post={slug} counts={await getReactionCounts()} />}
          {site.newsletter && (
            <div className="mt-4 flex flex-col gap-3.5 bg-soft p-[clamp(24px,3vw,36px)]">
              <h2 className="text-[26px] leading-[1.2] tracking-[-0.01em]">Get the next article by email</h2>
              <p className="text-base text-muted">
                About once a month. Production notes on payments, data and distributed systems. No spam.
              </p>
              <NewsletterForm inputClassName="bg-bg" />
            </div>
          )}
        </article>
      </div>

      {(older || newer) && (
        <nav
          aria-label="More articles"
          className="gutter grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-14 gap-y-6 border-t border-rule py-[clamp(40px,5vw,64px)]"
        >
          {older ? (
            <Link href={`/writing/${older.slug}`} className="flex flex-col gap-2">
              <span className="font-mono text-xs text-muted">← Previous</span>
              <span className="font-serif text-[clamp(22px,2.2vw,28px)] leading-[1.2]">{older.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {newer && (
            <Link href={`/writing/${newer.slug}`} className="flex flex-col items-end gap-2 text-right">
              <span className="font-mono text-xs text-muted">Next →</span>
              <span className="font-serif text-[clamp(22px,2.2vw,28px)] leading-[1.2]">{newer.title}</span>
            </Link>
          )}
        </nav>
      )}

      <ClosingBand headline="Dealing with something like this?" />
    </main>
  );
}

export default function ArticlePage({ params }: PageProps<"/writing/[slug]">) {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <Article params={params} />
    </Suspense>
  );
}
