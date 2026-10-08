import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import { ClosingBand } from "@/components/closing-band";
import { Media } from "@/components/media";
import { about, site } from "@/config/site";

export const metadata: Metadata = pageMeta(
  "About",
  "Product and backend engineer. Payments, data pipelines and multi-tenant systems.",
  "/about",
);

const section = "gutter side-grid gap-y-6 border-t border-rule py-[clamp(56px,7vw,96px)]";
const sideH2 = "text-[clamp(32px,3.6vw,48px)] leading-[1.05] tracking-[-0.025em]";
const sideContent = "col-span-2 flex min-w-0 flex-col border-t border-ink max-[640px]:col-span-full";
const prose = "text-lg leading-[1.7]";

export default function AboutPage() {
  return (
    <main>
      <section className="gutter side-grid items-start gap-y-10 py-(--section-y)">
        <div className="flex max-w-[280px] min-w-0 flex-col gap-4">
          <Media
            src={about.photo}
            alt={`Photo of ${site.name}`}
            ratio="4/5"
            sizes="240px"
            className="max-w-[240px]"
          />
          <div className="font-mono text-xs leading-[1.7] text-muted">
            {about.location.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
        <article className="col-span-2 flex max-w-[680px] min-w-0 flex-col gap-[22px] max-[640px]:col-span-full">
          <div className="font-mono text-[13px] text-muted">About</div>
          <h1 className="mb-2 text-[clamp(36px,4.4vw,60px)] leading-[1.05] tracking-[-0.03em]">
            I&apos;m Chukwuduzie. I build products and make them hold up.
          </h1>
          <p className="font-serif text-[clamp(20px,1.9vw,24px)] leading-[1.5]">
            I started writing software because I wanted to build things people used. I stayed because I kept getting
            pulled into the part nobody else wanted to touch: the bit that breaks when real users and real money show up.
          </p>
          <p className={prose}>
            Over six years I&apos;ve shipped products for startups and fintech teams, from first prototypes to systems
            moving billions of naira a month. I work across the whole product, interface to infrastructure, and I go
            deepest on payments, data pipelines and multi-tenant systems.
          </p>
          <p className={prose}>
            The work that shaped me most was a payout platform that was quietly double-paying customers. Fixing it
            taught me that reliability is a product decision, not only an engineering one, and that the best fix is the
            one finance notices before engineering does.
          </p>
          <p className={prose}>
            Today I work independently. Founders bring me in to get a product live without building tomorrow&apos;s
            outage into it. Engineering teams bring me in when the backend needs someone who has been paged at 2am and
            fixed the cause, not the symptom.
          </p>
          <p className={prose}>
            I write about what I learn in{" "}
            <Link href="/writing" className="underline underline-offset-4">
              the journal
            </Link>
            , with the numbers and the mistakes left in.
          </p>
        </article>
      </section>

      <section className={section}>
        <div className="flex flex-col gap-2.5">
          <h2 className={sideH2}>Where I go deep</h2>
          <p className="max-w-[280px] text-[15px] text-muted">The problems I&apos;ve solved repeatedly in production.</p>
        </div>
        <div className={sideContent}>
          {about.depth.map((d) => (
            <div
              key={d.k}
              className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-10 gap-y-1.5 border-b border-rule py-[22px]"
            >
              <h3 className="text-2xl leading-[1.2] tracking-[-0.01em]">{d.k}</h3>
              <p className="text-base text-muted">{d.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={section}>
        <div className="flex flex-col gap-2.5">
          <h2 className={sideH2}>What I work with</h2>
          <p className="max-w-[280px] text-[15px] text-muted">Tools I use in production, by area.</p>
        </div>
        <dl className={`${sideContent} m-0`}>
          {about.stack.map((s) => (
            <div key={s.k} className="grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] gap-5 border-b border-rule py-4 text-base">
              <dt className="text-muted">{s.k}</dt>
              <dd className="m-0">{s.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={section}>
        <div className="flex flex-col gap-2.5">
          <h2 className={sideH2}>Experience</h2>
          <a href={site.resume} className="text-[15px] font-medium">
            Full résumé (PDF) ↓
          </a>
        </div>
        <div className={sideContent}>
          {about.jobs.map((j) => (
            <div
              key={j.company}
              className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-10 gap-y-2 border-b border-rule py-[26px]"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl leading-[1.2] tracking-[-0.01em]">{j.company}</h3>
                <div className="text-[15px] text-muted">{j.role}</div>
                <div className="font-mono text-xs text-muted">{j.time}</div>
              </div>
              <p className="text-base">{j.did}</p>
            </div>
          ))}
        </div>
      </section>

      <ClosingBand
        aside={
          <div className="flex flex-col border-t border-inv-ink text-base">
            {[
              { label: "GitHub", href: site.social.github, mark: "↗" },
              { label: "LinkedIn", href: site.social.linkedin, mark: "↗" },
              { label: "X", href: site.social.x, mark: "↗" },
              { label: "Résumé (PDF)", href: site.resume, mark: "↓" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="flex justify-between border-b border-inv-rule py-4">
                <span>{l.label}</span>
                <span className="opacity-75">{l.mark}</span>
              </a>
            ))}
          </div>
        }
      />
    </main>
  );
}
