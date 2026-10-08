"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/config/site";
import { NavLink } from "./nav-link";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="nav-narrow min-h-11 cursor-pointer rounded-full border border-ink bg-transparent px-4.5 text-[15px] text-ink"
      >
        {open ? "Close" : "Menu"}
      </button>
      {open && (
        <nav id="mobile-menu" className="nav-narrow flex w-full flex-col pt-2 pb-3">
          {nav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              activeClassName="underline underline-offset-[6px]"
              className="border-b border-rule py-2.5 font-serif text-[30px] tracking-[-0.01em]"
            >
              {item.label}
            </NavLink>
          ))}
          <div className="flex flex-wrap gap-2.5 pt-5">
            <a
              href={site.resume}
              className="flex min-h-11 items-center gap-1.5 rounded-full border border-ink px-4.5"
            >
              Résumé <span>↓</span>
            </a>
          </div>
        </nav>
      )}
    </>
  );
}
