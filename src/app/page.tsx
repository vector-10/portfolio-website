import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { ClosingBand } from "@/components/closing-band";
import { Avatar, Logo } from "@/components/media";
import { MetricGrid } from "@/components/metric";
import { PostLink, postMetaLine } from "@/components/post-link";
import { ProjectRow } from "@/components/project-row";
import { SectionHead } from "@/components/section-head";
import { TestimonialRow } from "@/components/testimonial-row";
import { homeMetrics, logos, site, testimonials, tiers } from "@/config/site";
import { getPosts, getProjects } from "@/lib/content";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = {
  ...pageMeta(site.name, site.description, "/"),
  title: { absolute: site.name },
};

const section = "gutter py-(--section-y)";

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const featured = projects.filter((p) => p.meta.featured).slice(0, 3);

  return (
    <main>
      <section className="gutter box-content flex max-w-[1440px] flex-wrap items-center gap-[clamp(40px,6vw,96px)] pt-[clamp(56px,9vw,128px)] pb-[clamp(48px,7vw,96px)]">
        <div className="flex max-w-[760px] min-w-0 flex-[1_1_520px] flex-col gap-8">
          <div className="font-mono text-[13px] tracking-[0.02em] text-muted">
            Software engineer · Problem solver · Available for new projects
          </div>
          <h1 className="text-[clamp(46px,7.2vw,112px)] leading-[0.98] tracking-[-0.035em]">
            I build full products, with the backend done right.
          </h1>
          <p className="max-w-[580px] text-[clamp(17px,1.5vw,20px)] text-muted">
            Web apps and APIs end to end, from interface to infrastructure. My depth is the hard part: payments, data
            and scale.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`mailto:${site.email}`}>Email me</ButtonLink>
            <ButtonLink href="#work" variant="secondary">
              See the work
            </ButtonLink>
          </div>
        </div>
        <div className="min-w-0 flex-[0_1_456px] min-[1340px]:ml-[10%]">
          <Image
            src={site.portrait.src}
            width={site.portrait.width}
            height={site.portrait.height}
            alt={`Portrait of ${site.name}`}
            sizes="(min-width: 500px) 456px, calc(100vw - 40px)"
            quality={90}
            preload
            className="h-auto w-full max-w-[456px]"
          />
        </div>
      </section>

      {logos.length > 0 && (
        <section className="gutter flex flex-wrap items-center gap-[clamp(24px,4vw,56px)] border-y border-rule py-7">
          <div className="shrink-0 text-sm text-muted">Trusted by teams at</div>
          <div className="flex flex-[1_1_320px] flex-wrap items-center gap-[clamp(20px,3vw,40px)]">
            {logos.map((l, i) => (
              <Logo key={i} {...l} />
            ))}
          </div>
        </section>
      )}

      <section className={`${section} flex flex-col gap-12`}>
        <SectionHead
          title="Results in production"
          aside={<p className="max-w-[380px] text-sm text-muted">Every number states how it was measured, where and when.</p>}
        />
        <MetricGrid metrics={homeMetrics} variant="home" />
      </section>

      <section id="work" className={`${section} flex flex-col gap-10 border-t border-rule`}>
        <SectionHead
          title="Selected work"
          aside={
            <Link href="/work" className="text-[15px] font-medium">
              All projects →
            </Link>
          }
        />
        <div className="flex flex-col border-t border-ink">
          {featured.map((p, i) => (
            <ProjectRow key={p.meta.slug} project={p.meta} index={i} />
          ))}
        </div>
      </section>

      {site.showHireTeaser && (
        <section id="hire" className={`${section} flex flex-col gap-12 bg-inv-bg text-inv-ink`}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-[clamp(32px,4vw,56px)] leading-[1.05] tracking-[-0.025em]">Work with me</h2>
            <p className="max-w-[380px] text-base opacity-80">
              Not sure which fits? Email me what you&apos;re building and I&apos;ll tell you honestly.
            </p>
          </div>
          <div className="flex flex-col border-t border-inv-ink">
            {tiers.map((t) => (
              <Link
                key={t.name}
                href="/work-with-me"
                className="flex flex-wrap items-baseline justify-between gap-x-12 gap-y-3 border-b border-inv-rule py-8"
              >
                <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-2">
                  <div className="font-serif text-[clamp(30px,3.2vw,40px)] leading-[1.05] tracking-[-0.02em]">{t.name}</div>
                  <div className="max-w-[520px] text-base opacity-85">{t.teaser}</div>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <div className="font-serif text-[clamp(32px,3.2vw,44px)] leading-none tracking-[-0.02em]">{t.price}</div>
                  <div className="text-sm opacity-75">{t.time}</div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/work-with-me" className="self-start text-base font-medium">
            What&apos;s included and how it works →
          </Link>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="flex flex-col gap-10 py-(--section-y)">
          <TestimonialRow title="What clients say">
            {testimonials.map((q, i) => (
              <figure
                key={i}
                className="m-0 flex flex-[0_0_min(86%,480px)] snap-start flex-col justify-between gap-8 border-t border-ink pt-7"
              >
                <blockquote className="m-0 font-serif text-[clamp(24px,2.4vw,32px)] leading-[1.3] tracking-[-0.01em] text-pretty">
                  “{q.text}”
                </blockquote>
                <figcaption className="flex items-center gap-3.5">
                  <Avatar src={q.avatar} alt={q.name} />
                  <div className="flex flex-col text-[15px] leading-[1.35]">
                    <span className="font-medium">{q.name}</span>
                    <span className="text-muted">{q.title}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </TestimonialRow>
        </section>
      )}

      <section id="writing" className={`${section} flex flex-col gap-10 border-t border-rule`}>
        <SectionHead
          title="Writing"
          aside={
            <Link href="/writing" className="text-[15px] font-medium">
              All articles →
            </Link>
          }
        />
        <div className="flex flex-col border-t border-ink">
          {posts.slice(0, 3).map(({ meta }) => (
            <PostLink
              key={meta.slug}
              meta={meta}
              className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-b border-rule py-6"
            >
              <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-2">
                <div className="font-serif text-[clamp(21px,2vw,26px)] leading-[1.25] tracking-[-0.01em] text-pretty">
                  {meta.title}
                </div>
                <div className="max-w-[640px] text-base text-muted text-pretty">{meta.description}</div>
              </div>
              <div className="shrink-0 font-mono text-xs text-muted">{postMetaLine(meta)}</div>
            </PostLink>
          ))}
        </div>
      </section>

      <ClosingBand large>
        <p className="max-w-[560px] text-[clamp(17px,1.5vw,20px)] opacity-80">
          I reply within one working day. Send a few lines on what you&apos;re building and where it hurts.
        </p>
      </ClosingBand>
    </main>
  );
}
