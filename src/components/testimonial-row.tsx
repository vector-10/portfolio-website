"use client";

import { useRef } from "react";

export function TestimonialRow({ title, children }: { title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + gap), behavior: reduce ? "auto" : "smooth" });
  }

  const arrow = "size-12 cursor-pointer rounded-full border border-ink bg-transparent text-lg text-ink";

  return (
    <>
      <div className="gutter flex flex-wrap items-baseline justify-between gap-6">
        <h2 className="text-[clamp(32px,4vw,56px)] leading-[1.05] tracking-[-0.025em]">{title}</h2>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous testimonial" onClick={() => scroll(-1)} className={arrow}>
            ←
          </button>
          <button type="button" aria-label="Next testimonial" onClick={() => scroll(1)} className={arrow}>
            →
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="no-scrollbar gutter flex snap-x snap-mandatory scroll-px-(--gutter) gap-[clamp(20px,3vw,40px)] overflow-x-auto pb-2"
      >
        {children}
      </div>
    </>
  );
}
