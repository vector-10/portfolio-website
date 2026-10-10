"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deploymentStatus, deployStatus, retryDeploy, saveDoc, stageImage, type SaveResult } from "@/app/dashboard/actions";
import {
  emptyMetric,
  folderOf,
  METRIC_FIELDS,
  missingMetricFields,
  publicPathOf,
  publishIssues,
  type FormDoc,
  type MetricRow,
} from "@/lib/dashboard/doc";
import { clearDraft, readDraft, writeDraft } from "@/lib/dashboard/drafts";
import { compressImage, type StagedImage } from "@/lib/dashboard/images";
import { PublishDialog, type PublishPhase } from "./publish-dialog";
import { useToast } from "./toast";
import { fieldClass, primaryButton, secondaryButton } from "./ui";

type Media = { src: string; name: string };
type Deploy = { id: string | null; state: string; url: string | null; inspectorUrl: string | null };
type StoreInfo = { kind: "github" | "local"; repo: string; branch: string };
type WorkingCopy = { doc: FormDoc; baseSha: string | null };

const label = "flex flex-col gap-1.5 text-xs text-muted";
const input =
  "box-border min-h-9 w-full border border-rule bg-field px-2.5 text-sm text-ink focus:border-ink focus:outline-none";
const sectionHead = "border-b border-ink pb-1.5 font-mono text-[11px] text-muted";
const dashed = "min-h-9 max-[819px]:min-h-11 cursor-pointer self-start border border-dashed border-ink bg-transparent px-3.5 text-[13px] text-ink";

const SNIPPETS: [string, (project: boolean) => string][] = [
  ["## Heading", () => "\n## Heading\n\n"],
  ["Code", () => "\n```ts\n// code\n```\n"],
  ["Image", (p) => `\n<Figure src="/images/${p ? "work" : "writing"}/file.png" alt="" caption="Caption" />\n`],
  ["Metric", () => '\n<Metric value="" unit="" label="" source="Production" date="" method="" />\n'],
  ["Decision", () => '\n<Decision title="" chose="" rejected="">\nWhy.\n</Decision>\n'],
];

export default function Editor({ initial, media, store }: { initial: FormDoc; media: Media[]; store: StoreInfo }) {
  const router = useRouter();
  const { say, toast } = useToast();
  const draftSlug = initial.originalSlug ?? "new";

  const [base, setBase] = useState(initial);
  const [doc, setDoc] = useState<FormDoc>(() => {
    const saved = readDraft<WorkingCopy>(initial.type, draftSlug);
    return saved && saved.baseSha === initial.sha ? saved.doc : initial;
  });
  const [staged, setStaged] = useState<StagedImage[]>([]);
  const [pane, setPane] = useState<"edit" | "preview">("edit");
  const [picker, setPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<PublishPhase | null>(null);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [ready, setReady] = useState(0);

  const iframe = useRef<HTMLIFrameElement>(null);
  const formPane = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLTextAreaElement>(null);

  const isProject = doc.type === "Project";
  const dirty = useMemo(() => JSON.stringify(doc) !== JSON.stringify(base) || staged.length > 0, [doc, base, staged]);
  const missing = useMemo(() => missingMetricFields(doc), [doc]);
  const missingSet = useMemo(() => new Set(missing.map((m) => `${m.i}.${m.k}`)), [missing]);
  const badMetrics = new Set(missing.map((m) => m.i)).size;
  const path = `${folderOf(doc.type)}/${doc.slug}.mdx`;
  const words = doc.body.split(/\s+/).filter(Boolean).length;

  const set = useCallback(<K extends keyof FormDoc>(key: K, value: FormDoc[K]) => setDoc((d) => ({ ...d, [key]: value })), []);

  useEffect(() => {
    if (dirty) writeDraft(doc.type, draftSlug, { doc, baseSha: base.sha } satisfies WorkingCopy);
  }, [doc, dirty, draftSlug, base.sha]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.kind === "preview-ready") setReady((n) => n + 1);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      const images = Object.fromEntries(staged.map((s) => [s.src, s.url]));
      iframe.current?.contentWindow?.postMessage({ kind: "preview", doc, images }, window.location.origin);
    }, 300);
    return () => clearTimeout(t);
  }, [doc, staged, ready]);

  async function upload(files: FileList | null) {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const image = await compressImage(file, isProject ? "work" : "writing");
      setStaged((s) => [...s.filter((x) => x.path !== image.path), image]);
      set("cover", image.src);
      say("Image added · committed on next save");
    } catch {
      setNotice("Couldn't read that image. Try a JPEG, PNG or WebP.");
    }
  }

  function insert(text: string) {
    const el = body.current;
    const at = el && typeof el.selectionStart === "number" ? el.selectionStart : doc.body.length;
    set("body", doc.body.slice(0, at) + text + doc.body.slice(at));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(at + text.length, at + text.length);
    });
  }

  const setMetric = (i: number, k: keyof MetricRow, v: string) =>
    set("metrics", doc.metrics.map((m, j) => (j === i ? { ...m, [k]: v } : m)));

  async function commit(publish: boolean, commitMessage: string, overwrite = false): Promise<SaveResult> {
    const images: { path: string; blobSha: string }[] = [];
    for (const image of staged) {
      const res = await stageImage(image.base64);
      if (!res.ok) return { ok: false, error: res.error };
      images.push({ path: image.path, blobSha: res.blobSha });
    }
    const result = await saveDoc({ doc, publish, message: commitMessage, images }, overwrite);
    if (result.ok) {
      const saved: FormDoc = { ...doc, sha: result.sha, originalSlug: doc.slug, status: publish ? "Published" : "Draft" };
      clearDraft(doc.type, draftSlug);
      clearDraft(doc.type, doc.slug);
      setDoc(saved);
      setBase(saved);
      setStaged([]);
      const target = `/dashboard/edit/${doc.type.toLowerCase()}/${doc.slug}`;
      if (draftSlug !== doc.slug) router.replace(target);
      router.refresh();
    }
    return result;
  }

  async function saveDraft() {
    if (doc.status === "Published") {
      writeDraft(doc.type, draftSlug, { doc, baseSha: base.sha } satisfies WorkingCopy);
      say("Saved in this browser · Publish to update the live page");
      return;
    }
    setBusy(true);
    setNotice("");
    const res = await commit(false, `Draft: ${doc.title}`);
    setBusy(false);
    if (res.ok) say(store.kind === "local" ? "Draft saved to local files" : "Draft committed to main · hidden on the site until published");
    else setNotice(res.conflict ? `${res.error} Reload to get the latest, or publish to overwrite.` : res.error);
  }

  function openPublish() {
    setMessage(`Publish: ${doc.title}`);
    setPhase({ step: "confirm" });
  }

  async function runPublish(overwrite = false) {
    setPhase({ step: "committing" });
    const res = await commit(true, message, overwrite);
    if (!res.ok) {
      setPhase({ step: "confirm", error: res.error, conflict: res.conflict });
      return;
    }
    const files = res.files.length;
    if (store.kind === "local") {
      setPhase({ step: "done", label: "Saved to local files", meta: `${files} file${files === 1 ? "" : "s"} · dev mode, nothing deployed` });
      return;
    }
    await track(res.commit, files, () => deployStatus(res.commit));
  }

  async function track(commit: string, files: number, poll: () => Promise<Deploy | null>) {
    setPhase({ step: "building", commit, files });
    for (let attempt = 0; attempt < 100; attempt++) {
      await new Promise((r) => setTimeout(r, 3000));
      const status = await poll();
      if (!status) {
        setPhase({
          step: "done",
          label: "Commit pushed to main",
          meta: `${commit.slice(0, 7)} · Vercel deploys it automatically · connect Vercel in Settings to track the build`,
        });
        return;
      }
      if (status.state === "ready") return setPhase({ step: "live", commit, files, url: status.url });
      if (status.state === "error")
        return setPhase({ step: "failed", commit, files, logs: status.inspectorUrl, deployment: status.id });
    }
  }

  async function retry() {
    if (phase?.step !== "failed" || !phase.deployment) return;
    const { commit, files, deployment } = phase;
    setPhase({ ...phase, retrying: true, error: undefined });
    const res = await retryDeploy(deployment);
    if (!res.ok) return setPhase({ ...phase, retrying: false, error: res.error });
    await track(commit, files, () => deploymentStatus(res.id));
  }

  function goToFirstProblem() {
    setPhase(null);
    setPane("edit");
    requestAnimationFrame(() => {
      const target = formPane.current?.querySelector<HTMLElement>("[data-invalid='true']") ?? document.getElementById("metrics");
      target?.scrollIntoView({ block: "center" });
      target?.focus?.();
    });
  }

  const blockers = phase?.step === "confirm" ? publishIssues(doc) : [];
  const files = [
    { op: doc.originalSlug ? "M" : "A", path },
    ...(doc.originalSlug && doc.originalSlug !== doc.slug ? [{ op: "D", path: `${folderOf(doc.type)}/${doc.originalSlug}.mdx` }] : []),
    ...staged.map((s) => ({ op: "A", path: s.path })),
  ];
  const statusWord = !doc.originalSlug ? "New" : doc.status;
  const pickerItems = [...staged.map((s) => ({ src: s.src, name: s.src.split("/").pop()!, url: s.url })), ...media.map((m) => ({ ...m, url: m.src }))];
  const cover = pickerItems.find((p) => p.src === doc.cover);
  const metricField = (i: number, k: keyof MetricRow) => fieldClass(missingSet.has(`${i}.${k}`));

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-10 box-border flex min-h-14 flex-wrap items-center gap-3 border-b border-rule bg-bg px-[clamp(16px,2vw,24px)] py-2.5">
        <button
          type="button"
          onClick={() => router.push("/dashboard/content")}
          className="min-h-9 max-[819px]:min-h-11 cursor-pointer rounded-full border border-rule bg-transparent px-3 text-[13px] text-ink"
        >
          ← Content
        </button>
        <div className="flex min-w-0 flex-[1_1_200px] flex-col">
          <span className="truncate font-medium">{doc.title || "Untitled"}</span>
          <span className="truncate font-mono text-[11px] text-muted">
            {statusWord} · {dirty ? "unsaved changes" : store.kind === "local" ? "saved locally" : "in sync with main"} · {path}
          </span>
        </div>
        <div className="flex overflow-hidden rounded-full border border-ink min-[820px]:hidden">
          {(["edit", "preview"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPane(p)}
              aria-pressed={pane === p}
              className={`min-h-11 cursor-pointer px-3 text-[13px] capitalize ${pane === p ? "bg-ink text-bg" : "bg-transparent text-ink"}`}
            >
              {p}
            </button>
          ))}
        </div>
        <button type="button" onClick={saveDraft} disabled={busy} className={`${secondaryButton} min-h-9 max-[819px]:min-h-11 px-3.5 text-[13px]`}>
          {busy ? "Saving…" : "Save draft"}
        </button>
        <button type="button" onClick={openPublish} className={`${primaryButton} min-h-9 max-[819px]:min-h-11 text-[13px]`}>
          Publish…
        </button>
      </div>

      <div className="flex flex-col min-[820px]:h-[calc(100vh-57px)] min-[820px]:flex-row">
        <div
          ref={formPane}
          className={`min-w-0 min-[820px]:block min-[820px]:flex-[1_1_50%] min-[820px]:overflow-y-auto min-[820px]:border-r min-[820px]:border-rule ${
            pane === "edit" ? "" : "hidden"
          }`}
        >
          <div className="flex max-w-[760px] flex-col gap-8 px-[clamp(16px,2vw,28px)] pt-6 pb-16">
            {notice && (
              <div role="alert" className="border border-dashed border-ink bg-soft px-3.5 py-3 text-[13px]">
                {notice}
              </div>
            )}

            <section className="flex flex-col gap-3.5">
              <div className={sectionHead}>Basics</div>
              <label className={label}>
                Title
                <input value={doc.title} onChange={(e) => set("title", e.target.value)} className={`${input} min-h-10 font-serif text-xl`} />
              </label>
              <label className={label}>
                Slug
                <div className="flex border border-rule bg-field focus-within:border-ink">
                  <span className="flex items-center pl-2.5 font-mono text-[13px] text-muted">{isProject ? "/work/" : "/writing/"}</span>
                  <input
                    value={doc.slug}
                    onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                    className="min-h-9 min-w-0 flex-1 bg-transparent pr-2.5 font-mono text-[13px] text-ink outline-none"
                  />
                </div>
              </label>
              <label className={label}>
                {isProject ? "Outcome · one line, plain language" : "Description · shown under the title and in lists"}
                <textarea
                  value={doc.outcome}
                  onChange={(e) => set("outcome", e.target.value)}
                  rows={2}
                  className={`${input} resize-y px-2.5 py-2`}
                />
                <span className="font-mono text-[11px]">
                  {doc.outcome.length} / 160 characters{doc.outcome.length > 160 ? " · too long for list rows" : ""}
                </span>
              </label>

              {isProject ? (
                <>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3.5">
                    <label className={label}>
                      Kind
                      <input value={doc.kind} onChange={(e) => set("kind", e.target.value)} placeholder="Fintech · Payments" className={input} />
                    </label>
                    <label className={label}>
                      Category
                      <select value={doc.category} onChange={(e) => set("category", e.target.value as FormDoc["category"])} className={`${input} rounded-none`}>
                        <option value="Product">Full product</option>
                        <option value="Systems">Backend system</option>
                      </select>
                    </label>
                    <label className={label}>
                      Role
                      <input value={doc.role} onChange={(e) => set("role", e.target.value)} className={input} />
                    </label>
                    <label className={label}>
                      Timeframe
                      <input value={doc.timeframe} onChange={(e) => set("timeframe", e.target.value)} placeholder="Oct 2025 – Mar 2026" className={input} />
                    </label>
                    <label className={label}>
                      Team
                      <input value={doc.team} onChange={(e) => set("team", e.target.value)} className={input} />
                    </label>
                    <label className={label}>
                      <span>
                        Stack <span className="text-[11px]">comma-separated</span>
                      </span>
                      <input value={doc.stack} onChange={(e) => set("stack", e.target.value)} className={input} />
                    </label>
                  </div>
                  <label className="flex min-h-9 max-[819px]:min-h-11 cursor-pointer items-center gap-2.5 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={doc.featured}
                      onChange={(e) => set("featured", e.target.checked)}
                      className="size-[18px] accent-ink"
                    />
                    Feature on Home
                  </label>
                </>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3.5">
                  <label className={label}>
                    <span>
                      Tags <span className="text-[11px]">comma-separated</span>
                    </span>
                    <input value={doc.tags} onChange={(e) => set("tags", e.target.value)} className={input} />
                  </label>
                  <label className={label}>
                    Date
                    <input type="date" value={doc.date} onChange={(e) => set("date", e.target.value)} className={input} />
                  </label>
                </div>
              )}
            </section>

            <section className="flex flex-col gap-3">
              <div className={sectionHead}>Cover image</div>
              {doc.cover && (
                <div className="flex items-center gap-3.5 border border-rule p-2">
                  <div className="aspect-[16/10] w-24 flex-[0_0_96px] overflow-hidden bg-soft">
                    {cover && (
                      // eslint-disable-next-line @next/next/no-img-element -- staged uploads are blob URLs next/image can't optimise
                      <img src={cover.url} alt="" className="size-full object-cover" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-mono text-xs">{doc.cover}</span>
                    <span className="text-xs text-muted">
                      {staged.find((s) => s.src === doc.cover)
                        ? (() => {
                            const s = staged.find((x) => x.src === doc.cover)!;
                            return `${s.width}×${s.height} · ${s.kb} KB · not committed yet`;
                          })()
                        : "In repo"}
                    </span>
                  </div>
                  <button type="button" onClick={() => set("cover", "")} className="min-h-8 max-[819px]:min-h-11 cursor-pointer rounded-full border border-rule bg-transparent px-3 text-xs text-ink">
                    Remove
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <label className="flex min-h-9 max-[819px]:min-h-11 cursor-pointer items-center border border-dashed border-ink px-3.5 text-[13px] text-ink">
                  Upload image
                  <input type="file" accept="image/*" onChange={(e) => upload(e.target.files)} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={() => setPicker((p) => !p)}
                  className="min-h-9 max-[819px]:min-h-11 cursor-pointer border border-rule bg-transparent px-3.5 text-[13px] text-ink"
                >
                  {picker ? "Close library" : "Choose from media"}
                </button>
              </div>
              {picker && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2 border border-rule p-2">
                  {pickerItems.map((p) => (
                    <button
                      key={p.src}
                      type="button"
                      onClick={() => {
                        set("cover", p.src);
                        setPicker(false);
                      }}
                      className="flex cursor-pointer flex-col gap-1 bg-transparent p-0 text-left text-ink"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-soft">
                        {/* eslint-disable-next-line @next/next/no-img-element -- small library thumbnails, mixes blob URLs and repo paths */}
                        <img src={p.url} alt="" className="size-full object-cover" />
                      </div>
                      <span className="truncate font-mono text-[10px]">{p.name}</span>
                    </button>
                  ))}
                  {!pickerItems.length && <div className="p-2 text-[13px] text-muted">No images yet. Upload one.</div>}
                </div>
              )}
            </section>

            {isProject && (
              <>
                <section className="flex flex-col gap-3.5">
                  <div className={sectionHead}>Short version · plain language, for founders</div>
                  {(
                    [
                      ["problem", "The problem"],
                      ["did", "What I did"],
                      ["result", "The result"],
                    ] as const
                  ).map(([key, title]) => (
                    <label key={key} className={label}>
                      {title}
                      <textarea value={doc[key]} onChange={(e) => set(key, e.target.value)} rows={2} className={`${input} resize-y px-2.5 py-2`} />
                    </label>
                  ))}
                </section>

                <section id="metrics" className="flex flex-col gap-3">
                  <div className="flex justify-between gap-3 border-b border-ink pb-1.5 font-mono text-[11px]">
                    <span className="text-muted">Metrics · every field required</span>
                    <span>{badMetrics ? `${badMetrics} incomplete · blocks publish` : "All complete"}</span>
                  </div>
                  {doc.metrics.map((m, i) => {
                    const bad = METRIC_FIELDS.some((k) => missingSet.has(`${i}.${k}`));
                    return (
                      <div key={i} className="flex flex-col gap-2.5 border border-rule p-3">
                        <div className="flex items-center justify-between font-mono text-[11px] text-muted">
                          <span>
                            Metric {i + 1}
                            {bad ? " · incomplete" : ""}
                          </span>
                          <button
                            type="button"
                            onClick={() => set("metrics", doc.metrics.filter((_, j) => j !== i))}
                            className="min-h-7 max-[819px]:min-h-11 cursor-pointer bg-transparent text-[11px] text-muted"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,120px),1fr))] gap-2">
                          {(["value", "unit"] as const).map((k) => (
                            <label key={k} className="flex flex-col gap-1 text-[11px] text-muted capitalize">
                              {k}
                              <input
                                value={m[k]}
                                data-invalid={missingSet.has(`${i}.${k}`)}
                                onChange={(e) => setMetric(i, k, e.target.value)}
                                className={metricField(i, k)}
                              />
                            </label>
                          ))}
                          <label className="flex flex-col gap-1 text-[11px] text-muted">
                            Source
                            <select
                              value={m.source}
                              data-invalid={missingSet.has(`${i}.source`)}
                              onChange={(e) => setMetric(i, "source", e.target.value)}
                              className={metricField(i, "source")}
                            >
                              <option value="">Choose…</option>
                              <option value="Production">Production</option>
                              <option value="Benchmark">Benchmark</option>
                            </select>
                          </label>
                          <label className="flex flex-col gap-1 text-[11px] text-muted">
                            Date
                            <input
                              value={m.date}
                              placeholder="Jan – Mar 2026"
                              data-invalid={missingSet.has(`${i}.date`)}
                              onChange={(e) => setMetric(i, "date", e.target.value)}
                              className={metricField(i, "date")}
                            />
                          </label>
                        </div>
                        <label className="flex flex-col gap-1 text-[11px] text-muted">
                          Label · what it means for the business
                          <input
                            value={m.label}
                            data-invalid={missingSet.has(`${i}.label`)}
                            onChange={(e) => setMetric(i, "label", e.target.value)}
                            className={metricField(i, "label")}
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-[11px] text-muted">
                          Method · how it was measured
                          <input
                            value={m.method}
                            placeholder="p99, OpenTelemetry traces, 30 days"
                            data-invalid={missingSet.has(`${i}.method`)}
                            onChange={(e) => setMetric(i, "method", e.target.value)}
                            className={metricField(i, "method")}
                          />
                        </label>
                      </div>
                    );
                  })}
                  <button type="button" onClick={() => set("metrics", [...doc.metrics, emptyMetric()])} className={dashed}>
                    + Add metric
                  </button>
                </section>

                <section className="flex flex-col gap-2.5">
                  <div className={sectionHead}>Links</div>
                  {doc.links.map((l, i) => (
                    <div key={i} className="flex flex-wrap gap-2">
                      <input
                        value={l.label}
                        placeholder="Label"
                        aria-label="Link label"
                        onChange={(e) => set("links", doc.links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                        className={`${input} w-auto min-w-[100px] flex-[0_1_140px]`}
                      />
                      <input
                        value={l.href}
                        placeholder="https://"
                        aria-label="Link URL"
                        onChange={(e) => set("links", doc.links.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))}
                        className={`${input} w-auto min-w-0 flex-[1_1_240px] font-mono text-[13px]`}
                      />
                      <button
                        type="button"
                        aria-label="Remove link"
                        onClick={() => set("links", doc.links.filter((_, j) => j !== i))}
                        className="min-h-9 w-9 max-[819px]:min-h-11 max-[819px]:w-11 cursor-pointer border border-rule bg-transparent text-muted"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => set("links", [...doc.links, { label: "", href: "" }])} className={dashed}>
                    + Add link
                  </button>
                </section>
              </>
            )}

            <section className="flex flex-col gap-2.5">
              <div className="flex justify-between gap-3 border-b border-ink pb-1.5 font-mono text-[11px] text-muted">
                <span>Body · MDX</span>
                <span>
                  {words} words · {Math.max(1, Math.round(words / 220))} min
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SNIPPETS.map(([name, make]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => insert(make(isProject))}
                    className="min-h-8 max-[819px]:min-h-11 cursor-pointer border border-rule bg-field px-3 font-mono text-xs text-ink hover:border-ink"
                  >
                    {name}
                  </button>
                ))}
              </div>
              <textarea
                ref={body}
                value={doc.body}
                onChange={(e) => set("body", e.target.value)}
                spellCheck={false}
                aria-label="Body (MDX)"
                className="box-border min-h-[520px] w-full resize-y border border-rule bg-field p-3.5 font-mono text-[13px] leading-[1.7] text-ink [tab-size:2] focus:border-ink focus:outline-none"
              />
            </section>
          </div>
        </div>

        <div className={`min-w-0 bg-bg min-[820px]:flex min-[820px]:flex-[1_1_50%] min-[820px]:flex-col ${pane === "preview" ? "flex flex-col" : "hidden"}`}>
          <div className="flex justify-between border-b border-rule bg-soft px-5 py-2 font-mono text-[11px] text-muted">
            <span>Preview · {publicPathOf(doc)}</span>
            <span>Live as you type</span>
          </div>
          <iframe
            ref={iframe}
            src="/dashboard/preview"
            title="Live preview"
            onLoad={() => setReady((n) => n + 1)}
            className="min-h-[70vh] w-full flex-1 border-0 bg-bg"
          />
        </div>
      </div>

      {phase && (
        <PublishDialog
          phase={phase}
          blockers={blockers}
          files={files}
          message={message}
          onMessage={setMessage}
          repoLine={store.kind === "github" ? `${store.repo} · ${store.branch} → Vercel production deploy` : "Local files · dev mode, nothing is deployed"}
          livePath={publicPathOf(doc)}
          onCommit={() => runPublish(false)}
          onOverwrite={() => runPublish(true)}
          onFixMetrics={goToFirstProblem}
          onRetry={retry}
          onClose={() => setPhase(null)}
        />
      )}
      {toast}
    </div>
  );
}
