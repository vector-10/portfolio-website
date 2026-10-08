import { site } from "@/config/site";

export function ClosingBand({
  headline = "Building something? Tell me about it.",
  large = false,
  children,
  aside,
  subject,
}: {
  headline?: string;
  large?: boolean;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  subject?: string;
}) {
  const email = (
    <a
      href={`mailto:${site.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`}
      className={`border-b-2 border-inv-ink font-serif leading-[1.2] wrap-break-word hover:no-underline ${
        large ? "text-[clamp(26px,3vw,40px)] tracking-[-0.01em]" : "text-[clamp(24px,2.6vw,34px)]"
      }`}
    >
      {site.email}
    </a>
  );

  return (
    <div className="bg-inv-bg text-inv-ink">
      {large ? (
        <section className="gutter flex flex-col items-start gap-8 py-[clamp(72px,10vw,144px)]">
          <h2 className="max-w-[1000px] text-[clamp(44px,6.4vw,96px)] leading-none tracking-[-0.035em]">{headline}</h2>
          {children}
          {email}
        </section>
      ) : (
        <section className="gutter grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-end gap-x-20 gap-y-12 py-(--section-y)">
          <div className="flex flex-col items-start gap-6">
            <h2 className="text-[clamp(36px,4.6vw,64px)] leading-[1.02] tracking-[-0.03em]">{headline}</h2>
            {children}
            {email}
          </div>
          {aside}
        </section>
      )}
      <footer className="gutter flex flex-wrap justify-between gap-5 border-t border-inv-rule py-8 text-sm opacity-80">
        <div>© 2026 {site.name}</div>
        <div className="flex flex-wrap gap-6">
          <a href={site.social.github}>GitHub</a>
          <a href={site.social.linkedin}>LinkedIn</a>
          <a href={site.social.x}>X</a>
          <a href={site.resume}>Résumé (PDF)</a>
          <a href="/rss.xml">RSS</a>
        </div>
      </footer>
    </div>
  );
}
