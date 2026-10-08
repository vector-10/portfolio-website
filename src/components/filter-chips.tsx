"use client";

import { useEffect, useRef, useState } from "react";

export function FilterChips({
  options,
  label,
  className = "",
  children,
}: {
  options: { value: string; label: string }[];
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState("all");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-tags]").forEach((el) => {
      el.hidden = active !== "all" && !el.dataset.tags!.split(" ").includes(active);
    });
    root.querySelectorAll<HTMLElement>("[data-group]").forEach((group) => {
      group.hidden = !group.querySelector("[data-tags]:not([hidden])");
    });
  }, [active]);

  const all = [{ value: "all", label: "All" }, ...options];

  return (
    <>
      <div role="group" aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
        {all.map((o) => {
          const on = o.value === active;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(o.value)}
              className={`min-h-10 cursor-pointer rounded-full border px-4 text-sm ${
                on ? "border-ink bg-ink text-bg" : "border-rule bg-transparent text-ink"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <div ref={ref}>{children}</div>
    </>
  );
}
