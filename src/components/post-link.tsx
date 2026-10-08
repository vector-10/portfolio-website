import Link from "next/link";
import type { Post } from "@/lib/content/schema";
import { monthYear } from "@/lib/format";

export function postMetaLine(meta: Post) {
  return [
    monthYear(meta.date),
    meta.readingTime && `${meta.readingTime} min`,
    meta.external && `${meta.source ?? new URL(meta.external).hostname.replace(/^www\./, "")} ↗`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function PostLink({
  meta,
  className,
  children,
  ...rest
}: { meta: Post; className?: string; children: React.ReactNode } & Record<`data-${string}`, string>) {
  if (meta.external) {
    return (
      <a href={meta.external} rel="noopener" className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={`/writing/${meta.slug}`} className={className} {...rest}>
      {children}
    </Link>
  );
}
