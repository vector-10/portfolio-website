"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { ContentItem } from "@/lib/dashboard/data";
import { draftSlugs } from "@/lib/dashboard/drafts";
import { relativeTime } from "@/lib/dashboard/format";
import { chipClass } from "./ui";

type Status = "Published" | "Changes" | "Draft";

const statusLabel: Record<Status, string> = {
  Published: "● Published",
  Changes: "◐ Unpublished changes",
  Draft: "○ Draft",
};

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function ContentList({ items }: { items: ContentItem[] }) {
  const draftKeys = useSyncExternalStore(subscribe, () => [...draftSlugs()].sort().join("|"), () => "");
  const [type, setType] = useState<"All" | "Post" | "Project">("All");
  const [status, setStatus] = useState<"All" | Status>("All");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const local = new Set(draftKeys.split("|"));
    const q = query.trim().toLowerCase();
    return items
      .map((item) => {
        const changed = local.has(`${item.type.toLowerCase()}:${item.slug}`);
        const s: Status = item.status === "Published" && changed ? "Changes" : item.status;
        return { ...item, s, href: `/dashboard/edit/${item.type.toLowerCase()}/${item.slug}` };
      })
      .filter(
        (r) =>
          (type === "All" || r.type === type) &&
          (status === "All" || r.s === status) &&
          (!q || r.title.toLowerCase().includes(q)),
      );
  }, [items, draftKeys, type, status, query]);

  const count = (t: string) => items.filter((i) => i.type === t).length;

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["All", `All ${items.length}`],
              ["Post", `Posts ${count("Post")}`],
              ["Project", `Projects ${count("Project")}`],
            ] as const
          ).map(([v, l]) => (
            <button key={v} type="button" aria-pressed={type === v} onClick={() => setType(v)} className={chipClass(type === v)}>
              {l}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-rule" />
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["All", "Any status"],
              ["Published", "Published"],
              ["Changes", "Changes"],
              ["Draft", "Draft"],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              type="button"
              aria-pressed={status === v}
              onClick={() => setStatus(v)}
              className={chipClass(status === v)}
            >
              {l}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles"
          aria-label="Search titles"
          className="ml-auto min-h-9 min-w-40 flex-[0_1_240px] border border-rule bg-field px-3 text-sm text-ink focus:border-ink focus:outline-none"
        />
      </div>

      <div className="flex flex-col">
        <div className="hidden gap-4 border-b border-ink pb-2 font-mono text-[11px] text-muted min-[1240px]:flex">
          <span className="min-w-0 flex-1">Title</span>
          <span className="w-[72px]">Type</span>
          <span className="w-[170px]">Status</span>
          <span className="w-16 text-right">Views</span>
          <span className="w-[72px] text-right">Reactions</span>
          <span className="w-[84px] text-right">Updated</span>
        </div>
        <div className="border-t border-ink min-[1240px]:hidden" />
        {rows.map((r) => (
          <Link key={r.path} href={r.href} className="border-b border-rule hover:bg-soft hover:no-underline">
            <span className="hidden min-h-[52px] items-center gap-4 py-3 min-[1240px]:flex">
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-medium text-pretty">{r.title}</span>
                <span className="font-mono text-[11px] text-muted">{r.path}</span>
              </span>
              <span className="w-[72px] font-mono text-xs text-muted">{r.type}</span>
              <span className="w-[170px] font-mono text-xs">{statusLabel[r.s]}</span>
              <span className="w-16 text-right font-mono text-[13px]">—</span>
              <span className="w-[72px] text-right font-mono text-[13px] text-muted">—</span>
              <span className="w-[84px] text-right font-mono text-xs text-muted">{relativeTime(r.updated)}</span>
            </span>
            <span className="flex min-h-[52px] flex-col gap-1 py-3 min-[1240px]:hidden">
              <span className="font-medium text-pretty">{r.title}</span>
              <span className="font-mono text-[11px] text-muted">
                {[r.type, statusLabel[r.s], r.external ? "external link" : "", relativeTime(r.updated)].filter(Boolean).join(" · ")}
              </span>
            </span>
          </Link>
        ))}
        {rows.length === 0 && <div className="py-10 text-muted">Nothing matches these filters.</div>}
      </div>
      <div className="font-mono text-[11px] whitespace-pre-wrap text-muted">
        ● Published   ◐ Published, with unpublished changes   ○ Draft (in repo, hidden on site)
      </div>
    </>
  );
}
