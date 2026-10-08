import { NextResponse, type NextRequest } from "next/server";
import slugs from "@/generated/content-slugs.json";

const known: Record<string, Set<string>> = {
  work: new Set(slugs.work),
  writing: new Set(slugs.writing),
};

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "development") return;
  const [, section, slug] = request.nextUrl.pathname.split("/");
  if (!known[section]?.has(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/_not-found-slug", request.url));
  }
}

export const config = {
  matcher: ["/work/:slug", "/writing/:slug"],
};
