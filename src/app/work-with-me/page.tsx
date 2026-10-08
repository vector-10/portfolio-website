import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { ButtonLink } from "@/components/button";
import { ClosingBand } from "@/components/closing-band";
import { availability, faqs, problems, site, steps, tiers } from "@/config/site";

export const metadata: Metadata = pageMeta(
  "Work with me",
  "Product builds and embedded engineering for founders and small teams. Fixed scope, clear pricing.",
  "/work-with-me",
);

const subject = "Project enquiry";
const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
const sideH2 = "text-[clamp(32px,3.6vw,48px)] leading-[1.05] tracking-[-0.025em]";
const sideContent = "col-span-2 min-w-0 max-[640px]:col-span-full";

function DashList({ label, items, children }: { label: string; items: string[]; children?: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2.5 text-base">
      <div className="pb-1 font-mono text-xs opacity-75">{label}</div>
      {items.map((item) => (
        <div key={item} className="flex gap-3">
          <span className="opacity-55">—</span>
          <span>{item}</span>
        </div>
      ))}
      {children}
    </div>
  );
}

export default function WorkWithMePage() {
  return (
    <main>
      <section className="gutter flex flex-col gap-7 pt-[clamp(56px,9vw,128px)] pb-[clamp(48px,6vw,80px)]">
        <div className="font-mono text-[13px] text-muted">Work with me · {availability}</div>
        <h1 className="max-w-[1150px] text-[clamp(46px,7vw,108px)] leading-[0.98] tracking-[-0.035em]">
          You bring the problem. I&apos;ll ship the product.
        </h1>
        <p className="max-w-[600px] text-[clamp(17px,1.5vw,20px)] text-muted">
          I work with founders and small teams who need software built properly the first time. Fixed scope, clear
          pricing, and you own everything I write.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={mailto}>Email me about a project</ButtonLink>
          <ButtonLink href="#options" variant="secondary">
            See pricing
          </ButtonLink>
        </div>
      </section>

      <section className="gutter side-grid gap-y-6 border-t border-rule py-[clamp(56px,7vw,96px)]">
        <h2 className={sideH2}>Sound familiar?</h2>
        <div className={`${sideContent} grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] border-t border-ink`}>
          {problems.map((p) => (
            <div key={p.q} className="flex flex-col gap-2 border-b border-rule py-6 pr-6">
              <div className="font-serif text-2xl leading-[1.2] tracking-[-0.01em] text-pretty">{p.q}</div>
              <div className="text-base text-muted text-pretty">{p.a}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="options" className="gutter flex flex-col gap-12 bg-inv-bg py-(--section-y) text-inv-ink">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[clamp(32px,4vw,56px)] leading-[1.05] tracking-[-0.025em]">Two ways to work together</h2>
          <p className="max-w-[380px] text-base opacity-80">
            Prices in USD. Final quote after a short call, in writing, before any work starts.
          </p>
        </div>
        <div className="flex flex-col border-t border-inv-ink">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] items-start gap-x-12 gap-y-7 border-b border-inv-rule py-11"
            >
              <div className="flex min-w-0 flex-col gap-3">
                <div className="font-mono text-xs opacity-75">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-[clamp(32px,3.4vw,44px)] leading-[1.05] tracking-[-0.02em]">{t.name}</h3>
                <p className="text-base opacity-85">{t.desc}</p>
                <div className="flex flex-col gap-1 pt-3">
                  <div className="font-serif text-[clamp(36px,3.6vw,48px)] leading-none tracking-[-0.02em]">{t.price}</div>
                  <div className="text-sm opacity-75">{t.time}</div>
                </div>
              </div>
              <DashList label="Included" items={t.items} />
              <DashList label="Good fit if" items={t.fit}>
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent(t.name)}`}
                  className="mt-3.5 text-[15px] font-medium"
                >
                  Email about this →
                </a>
              </DashList>
            </div>
          ))}
        </div>
      </section>

      <section className="gutter side-grid gap-y-6 py-(--section-y)">
        <div className="flex flex-col gap-2.5">
          <h2 className={sideH2}>How it works</h2>
          <p className="max-w-[280px] text-[15px] text-muted">
            From first email to launch, you always know what&apos;s happening and what it costs.
          </p>
        </div>
        <ol className={`${sideContent} m-0 flex list-none flex-col border-t border-ink p-0`}>
          {steps.map((s, i) => (
            <li key={s.t} className="grid grid-cols-[56px_minmax(0,1fr)] gap-4 border-b border-rule py-6">
              <div className="font-serif text-[32px] leading-none tracking-[-0.02em]">{i + 1}</div>
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="text-2xl leading-[1.2] tracking-[-0.01em]">{s.t}</h3>
                  <div className="font-mono text-xs text-muted">{s.when}</div>
                </div>
                <p className="max-w-[620px] text-base text-muted">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="gutter side-grid gap-y-6 border-t border-rule py-[clamp(56px,7vw,96px)]">
        <h2 className={sideH2}>Questions founders ask</h2>
        <div className={`${sideContent} flex flex-col border-t border-ink`}>
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-rule">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <span aria-hidden className="font-mono text-muted group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-[640px] pb-[22px] text-base text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <ClosingBand
        headline="Tell me what you're building."
        subject={subject}
        aside={
          <div className="flex flex-col gap-2.5 border-t border-inv-ink pt-5 text-base">
            <div className="pb-1 font-mono text-xs opacity-75">Helpful to include</div>
            {[
              "What you're building and who it's for",
              "Where you are now: idea, designs, or a live product",
              "Your timeline and rough budget",
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <span className="opacity-55">—</span>
                <span>{item}</span>
              </div>
            ))}
            <div className="pt-2 text-sm opacity-75">I reply within one working day.</div>
          </div>
        }
      />
    </main>
  );
}
