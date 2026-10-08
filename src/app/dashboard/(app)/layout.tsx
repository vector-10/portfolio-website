import Link from "next/link";
import { Suspense } from "react";
import { devBypass, signOut } from "@/auth";
import { MobileBar, SideNav } from "@/components/dashboard/nav";
import { listContent, listMedia, recentCommits, storeInfo } from "@/lib/dashboard/data";
import { relativeTime } from "@/lib/dashboard/format";

async function Chrome() {
  const [content, media, commits, store] = await Promise.all([
    listContent(),
    listMedia(),
    recentCommits(1),
    storeInfo(),
  ]);

  const items = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/content", label: "Content", count: content.length },
    { href: "/dashboard/media", label: "Media", count: media.length },
    { href: "/dashboard/settings", label: "Settings" },
  ];
  const status = store.kind === "github" ? `● ${store.branch} · in sync` : "● local files · dev";
  const lastDeploy = commits[0] ? `Last commit ${relativeTime(commits[0].date).toLowerCase()}` : "No commits yet";

  return (
    <>
      <aside className="nav-wide sticky top-0 h-screen w-[228px] flex-[0_0_228px] flex-col gap-7 border-r border-rule px-3.5 py-[22px]">
        <Brand />
        <SideNav items={items} />
        <div className="flex-1" />
        <div className="flex flex-col gap-2.5 border-t border-rule px-2 pt-3.5 text-[13px]">
          <div className="flex flex-col gap-0.5 font-mono text-[11px] text-muted">
            <span className="text-ink">{status}</span>
            <span>{lastDeploy}</span>
          </div>
          <a href="/" target="_blank" rel="noopener">
            View live site ↗
          </a>
          {devBypass ? (
            <span className="text-muted">Dev mode · no sign-in</span>
          ) : (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="cursor-pointer bg-transparent p-0 text-[13px] text-muted hover:underline">
                Sign out
              </button>
            </form>
          )}
        </div>
      </aside>
      <MobileBar items={items} status={status} liveHref="/" />
    </>
  );
}

function Brand() {
  return (
    <div className="flex flex-col gap-0.5 px-2">
      <Link href="/" className="font-serif text-[19px] font-medium tracking-[-0.01em]">
        Chukwuduzie Blaise
      </Link>
      <div className="font-mono text-[11px] text-muted">Dashboard · private</div>
    </div>
  );
}

function ChromeSkeleton() {
  return (
    <aside className="nav-wide sticky top-0 h-screen w-[228px] flex-[0_0_228px] flex-col gap-7 border-r border-rule px-3.5 py-[22px]">
      <Brand />
      <div className="flex flex-col gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-9 bg-soft" />
        ))}
      </div>
    </aside>
  );
}

export default function DashboardAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-wrap bg-bg text-sm leading-normal text-ink">
      <Suspense fallback={<ChromeSkeleton />}>
        <Chrome />
      </Suspense>
      <main className="flex min-w-[min(100%,320px)] flex-[1_1_0] flex-col">{children}</main>
    </div>
  );
}
