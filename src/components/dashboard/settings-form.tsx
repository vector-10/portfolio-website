"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSettings, stageImage } from "@/app/dashboard/actions";
import { useToast } from "./toast";
import { Page, PageTitle, primaryButton } from "./ui";

type Settings = { available: boolean; note: string; email: string; resume: string };

const input =
  "box-border min-h-9 w-full border border-rule bg-field px-2.5 text-sm text-ink focus:border-ink focus:outline-none";

function Section({ title, note, first, children }: { title: string; note: string; first?: boolean; children: React.ReactNode }) {
  return (
    <section
      className={`grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-10 gap-y-3 py-[22px] ${
        first ? "border-t border-ink" : "border-t border-rule"
      }`}
    >
      <div className="flex flex-col gap-1">
        <div className="font-medium">{title}</div>
        <div className="text-[13px] text-muted">{note}</div>
      </div>
      <div className="col-span-2 flex min-w-0 flex-col gap-3.5 max-[700px]:col-span-full">{children}</div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] gap-4 border-b border-rule py-[11px]">
      <span className="text-muted">{k}</span>
      <span className="font-mono text-[13px] break-words">{v}</span>
    </div>
  );
}

export function SettingsForm({
  initial,
  sha: initialSha,
  store,
  allowedUser,
  vercel,
}: {
  initial: Settings;
  sha: string | null;
  store: { kind: "github" | "local"; repo: string; branch: string };
  allowedUser: string;
  vercel: boolean;
}) {
  const router = useRouter();
  const { say, toast } = useToast();
  const [settings, setSettings] = useState(initial);
  const [sha, setSha] = useState(initialSha);
  const [resume, setResume] = useState<{ name: string; base64: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setSettings((s) => ({ ...s, [k]: v }));

  async function pickResume(files: FileList | null) {
    const file = files?.[0];
    if (!file || file.type !== "application/pdf") return setError("Choose a PDF file.");
    if (file.size > 3_000_000) return setError("The PDF must be under 3 MB.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    setResume({ name: file.name, base64: btoa(binary) });
    setError("");
  }

  async function save() {
    setBusy(true);
    setError("");
    let resumeBlob: string | null = null;
    if (resume) {
      const staged = await stageImage(resume.base64);
      if (!staged.ok) {
        setBusy(false);
        return setError(staged.error);
      }
      resumeBlob = staged.blobSha;
    }
    const res = await saveSettings({ settings, sha, resumeBlob });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setSha(res.sha);
    setResume(null);
    say(store.kind === "local" ? "Saved content/site.json locally" : "Committed content/site.json · deploying");
    router.refresh();
  }

  return (
    <Page narrow>
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
        <PageTitle>Settings</PageTitle>
        <button type="button" onClick={save} disabled={busy} className={`${primaryButton} px-[18px]`}>
          {busy ? "Saving…" : "Save and publish"}
        </button>
      </div>
      {error && (
        <div role="alert" className="border border-dashed border-ink bg-soft px-3.5 py-3 text-[13px]">
          {error}
        </div>
      )}

      <div className="flex flex-col">
        <Section first title="Site" note="Shown on Home, Work with me and every contact link. Saved to content/site.json.">
          <div className="flex min-h-11 items-center justify-between gap-4">
            <div className="flex flex-col">
              <span>Available for new projects</span>
              <span className="text-xs text-muted">Turns the availability line on or off across the site.</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.available}
              aria-label="Available for new projects"
              onClick={() => set("available", !settings.available)}
              className={`relative h-7 w-12 flex-[0_0_48px] cursor-pointer rounded-full border border-ink p-0 ${settings.available ? "bg-ink" : "bg-transparent"}`}
            >
              <span
                className={`absolute top-[3px] size-5 rounded-full motion-safe:transition-[left] ${
                  settings.available ? "left-[23px] bg-bg" : "left-[3px] bg-ink"
                }`}
              />
            </button>
          </div>
          <label className="flex flex-col gap-1.5 text-xs text-muted">
            Availability note
            <input value={settings.note} onChange={(e) => set("note", e.target.value)} className={input} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-muted">
            Contact email
            <input type="email" value={settings.email} onChange={(e) => set("email", e.target.value)} className={input} />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3 border border-rule px-3 py-2.5">
            <div className="flex min-w-0 flex-col">
              <span className="font-mono text-xs">{resume ? `${resume.name} · not committed yet` : settings.resume}</span>
              <span className="text-xs text-muted">Résumé PDF · linked in the header on every page</span>
            </div>
            <label className="flex min-h-8 cursor-pointer items-center rounded-full border border-ink px-3.5 text-[13px]">
              Replace
              <input type="file" accept="application/pdf" onChange={(e) => pickResume(e.target.files)} className="hidden" />
            </label>
          </div>
        </Section>

        <Section title="Repository" note="Publishing commits MDX and images here. Vercel deploys on every push to the branch.">
          <div className="flex flex-col border-t border-rule">
            <Row k="Status" v={store.kind === "github" ? "● Connected with a GitHub token" : "○ Local files · dev mode"} />
            <Row k="Repository" v={store.kind === "github" ? `github.com/${store.repo}` : "not connected"} />
            <Row k="Branch" v={store.branch} />
            <Row k="Content" v="content/projects · content/posts" />
            <Row k="Images" v="public/images/{work,writing,site}" />
          </div>
        </Section>

        <Section title="Integrations" note="Keys are stored as server environment variables, never in the repo.">
          <div className="flex flex-col border-t border-rule">
            {[
              { k: "Vercel", v: vercel ? "Connected · tracks builds after publish" : "Not connected · set VERCEL_TOKEN and VERCEL_PROJECT_ID" },
              { k: "Newsletter", v: "Not connected · deferred feature" },
              { k: "Analytics", v: "Not connected · deferred feature" },
            ].map((r) => (
              <div key={r.k} className="flex flex-col border-b border-rule py-[11px]">
                <span>{r.k}</span>
                <span className="font-mono text-[11px] text-muted">{r.v}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Access" note="Sign-in with GitHub. Only the allowed account can open the dashboard.">
          <div className="flex flex-col border-t border-rule">
            <Row k="Allowed account" v={allowedUser === "not set" ? "not set" : `@${allowedUser}`} />
            <div className="flex flex-col border-b border-rule py-[11px]">
              <span>Sessions</span>
              <span className="font-mono text-[11px] text-muted">Use “Sign out” in the sidebar to end this session.</span>
            </div>
          </div>
        </Section>
      </div>
      {toast}
    </Page>
  );
}
