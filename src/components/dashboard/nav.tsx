"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Item = { href: string; label: string; count?: number };

function useActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href) || (href === "/dashboard/content" && pathname.startsWith("/dashboard/edit"));
}

const itemClass = (on: boolean) =>
  `flex items-center justify-between px-2.5 hover:no-underline ${on ? "bg-ink text-bg" : "text-ink hover:bg-soft"}`;

export function SideNav({ items }: { items: Item[] }) {
  const isActive = useActive();
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={`${itemClass(isActive(item.href))} min-h-9 text-sm`}>
          <span>{item.label}</span>
          <span className="font-mono text-[11px] opacity-70">{item.count ?? ""}</span>
        </Link>
      ))}
    </nav>
  );
}

export function MobileBar({ items, status, liveHref }: { items: Item[]; status: string; liveHref: string }) {
  const [open, setOpen] = useState(false);
  const isActive = useActive();
  return (
    <header className="nav-narrow flex flex-[1_1_100%] flex-col gap-2 border-b border-rule px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-serif text-lg font-medium">Dashboard</span>
          <span className="font-mono text-[11px] text-muted">{status}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="min-h-11 cursor-pointer rounded-full border border-ink bg-transparent px-4.5 text-sm text-ink"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-0.5 pt-1 pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`${itemClass(isActive(item.href))} min-h-12 text-base`}
            >
              <span>{item.label}</span>
              <span className="font-mono text-xs opacity-70">{item.count ?? ""}</span>
            </Link>
          ))}
          <a href={liveHref} className="px-2.5 py-3 text-[15px]">
            View live site ↗
          </a>
        </nav>
      )}
    </header>
  );
}
