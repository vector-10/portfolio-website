import Link from "next/link";
import { ClosingBand } from "@/components/closing-band";
import { MetricGrid } from "@/components/metric";
import type { Project } from "@/lib/content/schema";

export function CaseStudyView({
  meta,
  body,
  next,
}: {
  meta: Project;
  body: React.ReactNode;
  next?: { slug: string; title: string } | null;
}) {
  const facts = [
    { k: "Role", v: meta.role },
    { k: "Timeframe", v: meta.timeframe },
    ...(meta.team ? [{ k: "Team", v: meta.team }] : []),
    { k: "Stack", v: meta.stack.join(", ") },
  ];

  const summary = [
    { h: "The problem", p: meta.summary.problem },
    { h: "What I did", p: meta.summary.did },
    { h: "The result", p: meta.summary.result },
  ];

  return (
    <main>
      <section className="gutter flex flex-col gap-7 pt-[clamp(48px,7vw,96px)] pb-[clamp(40px,5vw,64px)]">
        <Link href="/work" className="text-sm text-muted">
          ← All work
        </Link>
        <div className="font-mono text-[13px] text-muted">Case study · {meta.kind}</div>
        <h1 className="max-w-[1100px] text-[clamp(44px,6.4vw,96px)] leading-none tracking-[-0.035em]">{meta.title}</h1>
        <p className="max-w-[760px] text-[clamp(19px,1.8vw,24px)] leading-[1.4]">{meta.outcome}</p>
        <dl className="m-0 grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-6 border-t border-ink pt-6">
          {facts.map((f) => (
            <div key={f.k} className="flex flex-col gap-1">
              <dt className="text-[13px] text-muted">{f.k}</dt>
              <dd className="m-0">{f.v}</dd>
            </div>
          ))}
          {meta.links.length > 0 && (
            <div className="flex flex-col gap-1">
              <dt className="text-[13px] text-muted">Links</dt>
              <dd className="m-0 flex flex-wrap gap-4">
                {meta.links.map((l) => (
                  <a key={l.href} href={l.href} className="underline underline-offset-4">
                    {l.label} ↗
                  </a>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </section>

      <section className="gutter flex flex-col gap-10 border-t border-rule py-[clamp(48px,6vw,88px)]">
        <div className="font-mono text-[13px] text-muted">The short version</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-14 gap-y-10">
          {summary.map((s) => (
            <div key={s.h} className="flex min-w-0 flex-col gap-3">
              <h2 className="text-[30px] leading-[1.1] tracking-[-0.015em]">{s.h}</h2>
              <p className="text-lg leading-[1.55]">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="gutter pb-[clamp(56px,7vw,96px)]">
        <MetricGrid metrics={meta.metrics} />
      </section>

      <div className="gutter flex flex-wrap items-end justify-between gap-6 bg-inv-bg py-[clamp(40px,5vw,64px)] text-inv-ink">
        <h2 className="text-[clamp(36px,4.6vw,64px)] leading-none tracking-[-0.03em]">Technical deep dive</h2>
        <p className="max-w-[420px] text-[15px] opacity-80">
          For engineers: constraints, architecture, trade-offs and what I&apos;d do differently.
        </p>
      </div>

      <div className="gutter flex flex-col">{body}</div>

      <ClosingBand
        headline={meta.cta}
        aside={
          next && (
            <Link href={`/work/${next.slug}`} className="flex flex-col gap-2 border-t border-inv-ink pt-5">
              <span className="font-mono text-xs opacity-75">Next case study</span>
              <span className="font-serif text-[clamp(26px,2.8vw,36px)] leading-[1.15]">{next.title} →</span>
            </Link>
          )
        }
      />
    </main>
  );
}
