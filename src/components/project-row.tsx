import Link from "next/link";
import type { Project } from "@/lib/content/schema";
import { Media } from "./media";

export function ProjectRow({ project, index, showStack }: { project: Project; index: number; showStack?: boolean }) {
  const live = project.links.find((l) => l.label.toLowerCase() === "live");
  return (
    <div
      data-tags={project.type}
      className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-x-16 gap-y-8 border-b border-rule py-12"
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div className="font-mono text-xs text-muted">
          {String(index + 1).padStart(2, "0")} · {project.kind}
        </div>
        <h3 className="text-[clamp(30px,3.2vw,44px)] leading-[1.05] tracking-[-0.02em]">{project.title}</h3>
        <div className="text-sm text-muted">
          {project.role} · {project.timeframe}
        </div>
        <p className="mt-1 text-[clamp(18px,1.6vw,20px)] leading-[1.45]">{project.outcome}</p>
        <div className="font-mono text-xs text-muted">{project.headlineMetric}</div>
        {showStack && <div className="text-sm text-muted">{project.stack.join(", ")}</div>}
        <div className="flex flex-wrap gap-6 pt-1 text-[15px] font-medium">
          <Link href={`/work/${project.slug}`}>Read case study →</Link>
          {live && (
            <a href={live.href} className="text-muted">
              Live site ↗
            </a>
          )}
        </div>
      </div>
      <Media
        src={project.cover}
        alt={`${project.title} screenshot`}
        ratio="16/10"
        sizes="(min-width: 900px) 50vw, 100vw"
      />
    </div>
  );
}
