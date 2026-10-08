import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { ClosingBand } from "@/components/closing-band";
import { FilterChips } from "@/components/filter-chips";
import { talks } from "@/config/site";
import { getPosts } from "@/lib/content";
import { PostLink, postMetaLine } from "@/components/post-link";
import { slug } from "@/lib/format";

export const metadata: Metadata = pageMeta(
  "Writing",
  "Notes from production: payments, distributed systems and data, with the numbers and the mistakes left in.",
  "/writing",
);

const yearGrid = "grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-x-14";
const yearContent = "col-span-3 flex min-w-0 flex-col max-[792px]:col-span-full";

export default async function WritingPage() {
  const posts = await getPosts();

  const tags = [...new Set(posts.flatMap(({ meta }) => meta.tags))];

  const years = [...new Set(posts.map(({ meta }) => meta.date.slice(0, 4)))];

  return (
    <main>
      <section className="gutter grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-20 gap-y-8 pt-(--section-y) pb-[clamp(32px,4vw,56px)]">
        <div className="flex flex-col gap-6">
          <h1 className="text-[clamp(56px,8vw,120px)] leading-[0.95] tracking-[-0.04em]">Writing</h1>
          <p className="max-w-[520px] text-[clamp(17px,1.5vw,20px)] text-muted">
            Notes from production: payments, distributed systems and data, with the numbers and the mistakes left in.
          </p>
        </div>
      </section>

      <FilterChips
        label="Filter articles by topic"
        className="gutter border-b border-rule pb-6"
        options={tags.map((t) => ({ value: slug(t), label: t }))}
      >
        <section className="gutter flex flex-col pb-(--section-y)">
          {years.map((year) => (
            <div key={year} data-group className={`${yearGrid} gap-y-2 pt-10`}>
              <h2 className="text-[32px] leading-none tracking-[-0.02em]">{year}</h2>
              <div className={yearContent}>
                {posts
                  .filter(({ meta }) => meta.date.startsWith(year))
                  .map(({ meta }) => (
                    <PostLink
                      key={meta.slug}
                      meta={meta}
                      data-tags={meta.tags.map(slug).join(" ")}
                      className="flex flex-col gap-2 border-b border-rule py-6"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                        <div className="min-w-0 flex-[1_1_380px] font-serif text-[clamp(22px,2.2vw,28px)] leading-[1.2] tracking-[-0.01em] text-pretty">
                          {meta.title}
                        </div>
                        <div className="font-mono text-xs text-muted">{postMetaLine(meta)}</div>
                      </div>
                      <div className="max-w-[680px] text-base text-muted text-pretty">{meta.description}</div>
                      <div className="font-mono text-xs text-muted">{meta.tags.join(" · ")}</div>
                    </PostLink>
                  ))}
              </div>
            </div>
          ))}
        </section>
      </FilterChips>

      {talks.length > 0 && (
        <section className={`gutter ${yearGrid} gap-y-6 border-t border-rule py-[clamp(56px,7vw,96px)]`}>
          <h2 className="text-[32px] leading-[1.1] tracking-[-0.02em]">Talks and elsewhere</h2>
          <div className={`${yearContent} border-t border-ink`}>
            {talks.map((t) => (
              <a key={t.title} href={t.href} className="flex flex-wrap justify-between gap-x-8 gap-y-2 border-b border-rule py-[18px]">
                <span className="min-w-0 flex-[1_1_380px]">{t.title} ↗</span>
                <span className="font-mono text-xs text-muted">{t.meta}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <ClosingBand />
    </main>
  );
}
