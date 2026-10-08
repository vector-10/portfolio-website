"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { commitMedia, stageImage } from "@/app/dashboard/actions";
import type { MediaItem } from "@/lib/dashboard/data";
import { compressImage, type StagedImage } from "@/lib/dashboard/images";
import { useToast } from "./toast";
import { chipClass, Page, PageTitle, primaryButton } from "./ui";

type Tile = {
  key: string;
  src: string;
  url: string;
  name: string;
  path: string;
  kb: number;
  usedIn: string[];
  fresh: boolean;
  sha?: string;
};

const short = (path: string) => path.split("/").pop()!.replace(/\.mdx$/, "");

export function MediaLibrary({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const { say, toast } = useToast();
  const [staged, setStaged] = useState<StagedImage[]>([]);
  const [filter, setFilter] = useState<"All" | "Used" | "Unused">("All");
  const [selected, setSelected] = useState<string | null>(items[0]?.path ?? null);
  const [alt, setAlt] = useState<Record<string, string>>({});
  const [dims, setDims] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const tiles: Tile[] = [
    ...staged.map((s) => ({ key: s.path, src: s.src, url: s.url, name: s.src.split("/").pop()!, path: s.path, kb: s.kb, usedIn: [], fresh: true })),
    ...items.map((m) => ({ key: m.path, src: m.src, url: m.src, name: m.name, path: m.path, kb: Math.round(m.size / 1024), usedIn: m.usedIn, fresh: false, sha: m.sha })),
  ];
  const used = tiles.filter((t) => t.usedIn.length).length;
  const visible = tiles.filter((t) => filter === "All" || (filter === "Used" ? t.usedIn.length : !t.usedIn.length));
  const sel = tiles.find((t) => t.key === selected) ?? null;

  async function add(files: FileList | null) {
    const list = Array.from(files ?? []).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    const images = await Promise.all(list.map((f) => compressImage(f, "site")));
    setStaged((s) => [...images, ...s.filter((x) => !images.some((i) => i.path === x.path))]);
    setSelected(images[0].path);
    say(`${images.length} image${images.length === 1 ? "" : "s"} added · commit to publish`);
  }

  async function commit(remove: Tile[] = []) {
    setBusy(true);
    setError("");
    const add: { path: string; blobSha: string }[] = [];
    for (const image of remove.length ? [] : staged) {
      const res = await stageImage(image.base64);
      if (!res.ok) {
        setBusy(false);
        return setError(res.error);
      }
      add.push({ path: image.path, blobSha: res.blobSha });
    }
    const res = await commitMedia({ add, remove: remove.map((t) => ({ path: t.path, sha: t.sha! })) });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    if (!remove.length) setStaged([]);
    say(remove.length ? "Deleted · removed from the repo" : "Images committed");
    router.refresh();
  }

  function copy() {
    if (!sel) return;
    const text = alt[sel.key]?.trim();
    if (!text) return say("Add alt text first");
    navigator.clipboard?.writeText(`<Figure src="${sel.src}" alt="${text.replace(/"/g, "&quot;")}" caption="" />`);
    say("Copied MDX snippet");
  }

  return (
    <Page>
      <div
        className="contents"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          add(e.dataTransfer.files);
        }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PageTitle>Media</PageTitle>
          <div className="flex flex-wrap gap-2">
            {staged.length > 0 && (
              <button type="button" onClick={() => commit()} disabled={busy} className={primaryButton}>
                {busy ? "Committing…" : `Commit ${staged.length} new`}
              </button>
            )}
            <label className={`${primaryButton} px-[18px]`}>
              Upload
              <input type="file" accept="image/*" multiple onChange={(e) => add(e.target.files)} className="hidden" />
            </label>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border border-dashed border-ink p-[18px]">
          <span>Drop images anywhere on this page.</span>
          <span className="font-mono text-[11px] text-muted">Committed to public/images/ · converted to AVIF/WebP at build</span>
        </div>
        {error && (
          <div role="alert" className="border border-dashed border-ink bg-soft px-3.5 py-3 text-[13px]">
            {error}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["All", `All ${tiles.length}`],
              ["Used", `Used ${used}`],
              ["Unused", `Unused ${tiles.length - used}`],
            ] as const
          ).map(([v, l]) => (
            <button key={v} type="button" aria-pressed={filter === v} onClick={() => setFilter(v)} className={chipClass(filter === v)}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-start gap-6">
          <div className="grid min-w-0 flex-[1_1_520px] grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3.5">
            {visible.map((t) => {
              const on = t.key === selected;
              const flags = [
                t.fresh ? "New · not committed" : t.usedIn.length ? `Used in ${t.usedIn.length}` : "Unused",
                t.kb > 500 ? "Large" : "",
                !alt[t.key] ? "No alt text" : "",
              ].filter(Boolean);
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setSelected(t.key)}
                  aria-pressed={on}
                  className={`flex min-w-0 cursor-pointer flex-col bg-field p-0 text-left text-ink ${on ? "border border-ink outline outline-ink" : "border border-rule"}`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element -- library thumbnails include uncommitted blob URLs */}
                    <img
                      src={t.url}
                      alt=""
                      onLoad={(e) => {
                        const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                        setDims((d) => (d[t.key] ? d : { ...d, [t.key]: `${w}×${h}` }));
                      }}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 p-2">
                    <span className="truncate font-mono text-[11px]">{t.name}</span>
                    <span className="text-[11px] text-muted">{[dims[t.key], `${t.kb} KB`].filter(Boolean).join(" · ")}</span>
                    <span className="text-[11px] text-muted">{flags.join(" · ")}</span>
                  </div>
                </button>
              );
            })}
            {!visible.length && <div className="py-10 text-muted">No images here yet.</div>}
          </div>

          {sel && (
            <aside className="sticky top-4 flex min-w-[min(100%,280px)] flex-[0_1_320px] flex-col gap-3.5 border border-ink p-4">
              <div className="aspect-[4/3] w-full overflow-hidden bg-soft">
                {/* eslint-disable-next-line @next/next/no-img-element -- detail preview of a library image */}
                <img src={sel.url} alt="" className="size-full object-contain" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs break-all">{sel.src}</span>
                <span className="text-xs text-muted">
                  {[dims[sel.key], `${sel.kb} KB`, sel.kb > 500 ? "large, compressed at build" : ""].filter(Boolean).join(" · ")}
                </span>
              </div>
              <label className="flex flex-col gap-1.5 text-xs text-muted">
                Alt text
                <input
                  value={alt[sel.key] ?? ""}
                  onChange={(e) => setAlt((a) => ({ ...a, [sel.key]: e.target.value }))}
                  placeholder="Describe the image for screen readers"
                  className="min-h-9 w-full border border-rule bg-field px-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                />
                <span className="text-[11px]">
                  {alt[sel.key] ? "Used as alt in the Figure snippet." : "Required. Copy MDX is disabled until it has alt text."}
                </span>
              </label>
              <div className="flex flex-col gap-1 text-[13px]">
                <span className="text-xs text-muted">Used in</span>
                <span>{sel.usedIn.length ? sel.usedIn.map(short).join(", ") : "Not used yet"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={copy} disabled={!alt[sel.key]?.trim()} className={`${primaryButton} min-h-9 px-3.5 text-[13px]`}>
                  Copy MDX
                </button>
                <button
                  type="button"
                  disabled={sel.usedIn.length > 0 || busy}
                  title={sel.usedIn.length ? `Remove it from ${sel.usedIn.map(short).join(", ")} first` : sel.fresh ? "Discard this upload" : "Delete from the repo"}
                  onClick={() => {
                    if (sel.fresh) return setStaged((s) => s.filter((x) => x.path !== sel.path));
                    if (confirm(`Delete ${sel.name} from the repo?`)) commit([sel]);
                  }}
                  className="min-h-9 cursor-pointer rounded-full border border-rule bg-transparent px-3.5 text-[13px] text-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
      {toast}
    </Page>
  );
}
