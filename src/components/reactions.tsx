"use client";

import { useSyncExternalStore } from "react";
import { REACTIONS, type ReactionId } from "@/lib/reactions";

const EVENT = "cb-reactions";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function read(key: string) {
  try {
    return localStorage.getItem(key) ?? "{}";
  } catch {
    return "{}";
  }
}

export function Reactions({ post, counts }: { post: string; counts: Record<ReactionId, number> }) {
  const key = `cb-reactions:${post}`;
  const raw = useSyncExternalStore(subscribe, () => read(key), () => "{}");
  const picked: Partial<Record<ReactionId, boolean>> = JSON.parse(raw);

  function toggle(id: ReactionId) {
    const on = !picked[id];
    try {
      localStorage.setItem(key, JSON.stringify({ ...picked, [id]: on }));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
    fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post, reaction: id, on }),
    }).catch(() => {});
  }

  return (
    <div className="mt-8 flex flex-col gap-3.5 border-t border-ink pt-6">
      <div className="text-[15px] text-muted">Was this useful?</div>
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((r) => {
          const on = !!picked[r.id];
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(r.id)}
              className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border px-4 text-[15px] ${
                on ? "border-ink bg-ink text-bg" : "border-rule bg-transparent text-ink"
              }`}
            >
              {r.label}
              <span className="font-mono text-[13px] opacity-75">{counts[r.id] + (on ? 1 : 0)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
