import Link from "next/link";
import { nav, site } from "@/config/site";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="gutter flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-rule py-5">
      <Link href="/" className="flex min-h-10 items-center font-serif text-[22px] font-medium tracking-[-0.01em]">
        {site.name}
      </Link>
      <nav className="nav-wide items-center gap-7 text-[15px]">
        {nav.map((item) => (
          <NavLink key={item.href} href={item.href}>
            {item.label}
          </NavLink>
        ))}
        <a href={site.resume} className="flex items-center gap-1.5 rounded-full border border-ink px-3.5 py-1.5">
          Résumé <span>↓</span>
        </a>
        <ThemeToggle className="min-h-8 px-3 py-1.5 text-[13px]" />
      </nav>
      <MobileMenu />
    </header>
  );
}
