"use client";

import { useEffect } from "react";
import { primaryButton, secondaryButton } from "./ui";

export type PublishPhase =
  | { step: "confirm"; error?: string; conflict?: boolean }
  | { step: "committing" }
  | { step: "building"; commit: string; files: number }
  | { step: "live"; commit: string; files: number; url: string | null }
  | {
      step: "failed";
      commit: string;
      files: number;
      logs: string | null;
      deployment: string | null;
      retrying?: boolean;
      error?: string;
    }
  | { step: "done"; label: string; meta: string };

const GLYPH = { done: "✓", active: "◌", pending: "○", failed: "✕" } as const;

export function PublishDialog({
  phase,
  blockers,
  files,
  message,
  onMessage,
  repoLine,
  livePath,
  onCommit,
  onOverwrite,
  onFixMetrics,
  onRetry,
  onClose,
}: {
  phase: PublishPhase;
  blockers: string[];
  files: { op: string; path: string }[];
  message: string;
  onMessage: (value: string) => void;
  repoLine: string;
  livePath: string;
  onCommit: () => void;
  onOverwrite: () => void;
  onFixMetrics: () => void;
  onRetry: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && phase.step === "confirm" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase.step, onClose]);

  const title =
    phase.step === "confirm" ? "Publish to GitHub" : phase.step === "live" ? "Published" : phase.step === "done" ? "Saved" : phase.step === "failed" ? "Build failed" : "Publishing…";
  const blocked = blockers.length > 0;

  const steps =
    phase.step === "confirm"
      ? []
      : phase.step === "done"
        ? [{ state: "done" as const, label: phase.label, meta: phase.meta }]
        : [
            {
              state: phase.step === "committing" ? ("active" as const) : ("done" as const),
              label: phase.step === "committing" ? "Committing to main…" : "Commit pushed to main",
              meta: "commit" in phase ? `${phase.commit.slice(0, 7)} · ${phase.files} file${phase.files === 1 ? "" : "s"}` : "",
            },
            {
              state:
                phase.step === "building" ? ("active" as const) : phase.step === "live" ? ("done" as const) : phase.step === "failed" ? ("failed" as const) : ("pending" as const),
              label: phase.step === "building" ? "Building on Vercel…" : "Building on Vercel",
              meta: phase.step === "failed" ? "The build failed" : "Usually 40–60 s",
            },
            { state: phase.step === "live" ? ("done" as const) : ("pending" as const), label: "Live", meta: livePath },
          ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,18,15,0.45)] p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="box-border flex max-h-[calc(100vh-32px)] w-[min(560px,100%)] flex-col gap-[18px] overflow-auto border border-ink bg-bg p-6"
      >
        <div className="flex items-baseline justify-between gap-3">
          <div className="font-serif text-[26px] leading-[1.1] tracking-[-0.02em]">{title}</div>
          <button type="button" onClick={onClose} aria-label="Close" className="min-h-9 min-w-9 max-[819px]:min-h-11 max-[819px]:min-w-11 cursor-pointer bg-transparent text-xl text-muted">
            ×
          </button>
        </div>

        {phase.step === "confirm" ? (
          <div className="flex flex-col gap-4">
            {blocked && (
              <div className="flex flex-col gap-2 border border-dashed border-ink px-3.5 py-3">
                <span className="font-medium">Can&apos;t publish yet</span>
                <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[13px] text-muted">
                  {blockers.slice(0, 6).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <button type="button" onClick={onFixMetrics} className="min-h-8 max-[819px]:min-h-11 self-start rounded-full border border-ink bg-transparent px-3.5 text-[13px] text-ink">
                  Go to the first problem
                </button>
              </div>
            )}
            {phase.error && (
              <div role="alert" className="flex flex-col gap-2 border border-dashed border-ink bg-soft px-3.5 py-3 text-[13px]">
                <span>{phase.error}</span>
                {phase.conflict && (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => window.location.reload()} className={secondaryButton}>
                      Reload
                    </button>
                    <button type="button" onClick={onOverwrite} className={secondaryButton}>
                      Overwrite
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Files in this commit</span>
              <div className="flex flex-col border-t border-rule">
                {files.map((f) => (
                  <div key={f.path} className="flex gap-2.5 border-b border-rule py-2 font-mono text-xs">
                    <span className="w-3.5 text-muted">{f.op}</span>
                    <span className="break-all">{f.path}</span>
                  </div>
                ))}
              </div>
            </div>
            <label className="flex flex-col gap-1.5 text-xs text-muted">
              Commit message
              <input
                value={message}
                onChange={(e) => onMessage(e.target.value)}
                className="min-h-[38px] w-full border border-rule bg-field px-2.5 font-mono text-[13px] text-ink focus:border-ink focus:outline-none"
              />
            </label>
            <div className="font-mono text-[11px] text-muted">{repoLine}</div>
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" onClick={onClose} className={secondaryButton}>
                Cancel
              </button>
              <button type="button" onClick={onCommit} disabled={blocked || !message.trim()} className={primaryButton}>
                Commit and deploy
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col border-t border-ink">
              {steps.map((s) => (
                <div
                  key={s.label}
                  className={`flex items-start gap-3 border-b border-rule py-3 ${s.state === "pending" ? "opacity-50" : ""}`}
                >
                  <span className="w-4 font-mono">{GLYPH[s.state]}</span>
                  <span className="flex flex-1 flex-col">
                    <span>{s.label}</span>
                    <span className="font-mono text-[11px] text-muted">{s.meta}</span>
                  </span>
                </div>
              ))}
            </div>
            {phase.step === "failed" && phase.error && (
              <div role="alert" className="border border-dashed border-ink bg-soft px-3.5 py-3 text-[13px]">
                {phase.error}
              </div>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              {phase.step === "failed" && phase.logs && (
                <a href={phase.logs} target="_blank" rel="noopener" className={secondaryButton}>
                  Vercel logs ↗
                </a>
              )}
              {phase.step === "failed" && phase.deployment && (
                <button type="button" onClick={onRetry} disabled={phase.retrying} className={secondaryButton}>
                  {phase.retrying ? "Retrying…" : "Retry deploy"}
                </button>
              )}
              {phase.step === "live" && (
                <a href={livePath} target="_blank" rel="noopener" className={secondaryButton}>
                  View live ↗
                </a>
              )}
              <button type="button" onClick={onClose} className={primaryButton}>
                {phase.step === "live" || phase.step === "done" || phase.step === "failed" ? "Done" : "Hide"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
