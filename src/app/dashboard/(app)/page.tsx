import Link from "next/link";
import { chipClass, Page, PageTitle } from "@/components/dashboard/ui";
import { listContent, recentCommits, storeInfo } from "@/lib/dashboard/data";
import { compact, relativeTime } from "@/lib/dashboard/format";
import { getStats, type Range } from "@/lib/dashboard/stats";
import { deploymentsFor, vercelConfigured } from "@/lib/dashboard/vercel";

export const instant = false;

const RANGES: [Range, string][] = [
  ["7d", "7 days"],
  ["30d", "30 days"],
  ["90d", "90 days"],
];

const GLYPH = { ready: "✓", error: "✕", building: "◌", pending: "○", unknown: "·" } as const;

export default async function OverviewPage({ searchParams }: PageProps<"/dashboard">) {
  const param = (await searchParams).range;
  const range: Range = param === "7d" || param === "90d" ? param : "30d";

  const [stats, content, commits, store] = await Promise.all([
    getStats(range),
    listContent(),
    recentCommits(5),
    storeInfo(),
  ]);
  const deploys = await deploymentsFor(commits.map((c) => c.sha));

  const live = content.filter((c) => c.status === "Published").length;
  const drafts = content.length - live;
  const off = "Not connected";

  const tiles = [
    {
      label: "Views",
      value: stats.connected ? compact(stats.views) : "—",
      note: stats.connected ? `${stats.viewsChange >= 0 ? "+" : ""}${stats.viewsChange}% vs previous ${range}` : off,
    },
    {
      label: "Newsletter signups",
      value: stats.connected ? String(stats.signups) : "—",
      note: stats.connected ? `${stats.subscribers} subscribers total` : off,
    },
    {
      label: "Reactions",
      value: stats.connected ? String(stats.reactions) : "—",
      note: stats.connected ? `across ${content.filter((c) => c.type === "Post").length} articles` : off,
    },
    { label: "Live on site", value: String(live), note: `${drafts} draft${drafts === 1 ? "" : "s"}` },
  ];

  const top = content.slice(0, 6).map((c) => {
    const path = `/${c.type === "Post" ? "writing" : "work"}/${c.slug}`;
    const s = stats.connected ? stats.byPath[path] : undefined;
    return {
      ...c,
      path,
      views: s ? compact(s.views) : "—",
      reactions: c.type === "Post" && s?.reactions != null ? String(s.reactions) : "—",
    };
  });

  return (
    <Page>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle>Overview</PageTitle>
        <div className="flex gap-1.5">
          {RANGES.map(([value, label]) => (
            <Link
              key={value}
              href={`/dashboard?range=${value}`}
              aria-current={range === value ? "page" : undefined}
              className={`${chipClass(range === value)} inline-flex items-center hover:no-underline`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] border-t border-ink">
        {tiles.map((t) => (
          <div key={t.label} className="flex min-w-0 flex-col gap-1.5 border-b border-rule py-[18px] pr-[18px]">
            <div className="text-xs text-muted">{t.label}</div>
            <div className="font-serif text-[40px] leading-none tracking-[-0.02em]">{t.value}</div>
            <div className="font-mono text-[11px] text-muted">{t.note}</div>
          </div>
        ))}
      </div>

      <section className="mt-2 flex flex-col gap-3.5 border border-rule p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="font-medium">Views over time</div>
          <div className="font-mono text-[11px] text-muted">
            {stats.connected ? `${compact(stats.views)} views` : "Connect analytics in Settings"}
          </div>
        </div>
        {stats.connected ? (
          <div className="flex h-[180px] items-end gap-0.5 border-b border-ink">
            {stats.series.map((p) => {
              const max = Math.max(...stats.series.map((x) => x.views), 1);
              return (
                <div
                  key={p.date}
                  title={`${p.date}: ${p.views} views`}
                  className="min-w-px flex-1 bg-muted"
                  style={{ height: `${Math.max(3, Math.round((p.views / max) * 100))}%` }}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex h-[180px] items-center justify-center border-b border-ink text-[13px] text-muted">
            Views appear here once analytics is connected.
          </div>
        )}
      </section>

      <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-7">
        <section className="flex min-w-0 flex-col">
          <div className="flex items-baseline justify-between pb-2.5">
            <div className="font-medium">{stats.connected ? "Top content" : "Recently updated"}</div>
            <div className="flex gap-5 font-mono text-[11px] text-muted">
              <span className="w-14 text-right">Views</span>
              <span className="w-16 text-right">Reactions</span>
            </div>
          </div>
          <div className="flex flex-col border-t border-ink">
            {top.map((c) => (
              <Link
                key={c.path}
                href={`/dashboard/edit/${c.type.toLowerCase()}/${c.slug}`}
                className="flex min-h-11 items-center gap-5 border-b border-rule py-2.5 hover:bg-soft hover:no-underline"
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{c.title}</span>
                  <span className="font-mono text-[11px] text-muted">
                    {c.type} · {c.path}
                  </span>
                </span>
                <span className="w-14 text-right font-mono text-[13px]">{c.views}</span>
                <span className="w-16 text-right font-mono text-[13px] text-muted">{c.reactions}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex min-w-0 flex-col">
          <div className="flex items-baseline justify-between pb-2.5">
            <div className="font-medium">Recent deploys</div>
            {store.kind === "github" && (
              <a href={`https://github.com/${store.repo}/commits/${store.branch}`} className="font-mono text-[11px] text-muted">
                GitHub ↗
              </a>
            )}
          </div>
          <div className="flex flex-col border-t border-ink">
            {commits.map((c) => {
              const d = deploys[c.sha];
              return (
                <div key={c.sha} className="flex items-start gap-3 border-b border-rule py-2.5">
                  <span className="w-3.5 flex-[0_0_14px] font-mono text-[13px]">{GLYPH[d?.state ?? "unknown"]}</span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-pretty">{c.message}</span>
                    <span className="font-mono text-[11px] text-muted">
                      {[c.sha.slice(0, 7), relativeTime(c.date), d?.state === "error" ? "Build failed" : ""]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                </div>
              );
            })}
            {!commits.length && <div className="py-6 text-muted">No commits yet.</div>}
          </div>
          {!vercelConfigured() && (
            <div className="pt-2.5 font-mono text-[11px] text-muted">Build status appears once Vercel is connected.</div>
          )}
        </section>
      </div>
    </Page>
  );
}
