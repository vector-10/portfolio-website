import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import type { NextAuthRequest } from "next-auth";
import { auth, devBypass, isOwner } from "@/auth";
import slugs from "@/generated/content-slugs.json";

const known: Record<string, Set<string>> = {
  work: new Set(slugs.work),
  writing: new Set(slugs.writing),
};

const notFound = (request: NextRequest) => NextResponse.rewrite(new URL("/_not-found", request.url));

const dashboardGate = auth((request: NextAuthRequest, _event: NextFetchEvent) => {
  if (!isOwner(request.auth)) return notFound(request);
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const [, section, slug] = request.nextUrl.pathname.split("/");

  if (section === "dashboard" || (section === "api" && slug === "dashboard")) {
    if (devBypass) return;
    return dashboardGate(request, event);
  }

  if (process.env.NODE_ENV === "development") return;
  if (!known[section]?.has(decodeURIComponent(slug))) return notFound(request);
}

export const config = {
  matcher: ["/work/:slug", "/writing/:slug", "/dashboard/:path*", "/dashboard", "/api/dashboard/:path*"],
};
