import type { MDXComponents } from "mdx/types";
import type { Project } from "@/lib/content/schema";
import { Arrow, Box, Diagram, Row, Stack } from "./diagram";
import { DataTable, MdxMetric, Pre } from "./shared";

function Section({ label, last, children }: { label: string; last?: boolean; children: React.ReactNode }) {
  return (
    <section className={`side-grid py-[clamp(48px,6vw,80px)] ${last ? "" : "border-b border-rule"}`}>
      <div className="font-mono text-[13px] text-muted">{label}</div>
      <div className="col-span-2 flex min-w-0 flex-col gap-5 max-[640px]:col-span-1">{children}</div>
    </section>
  );
}

function KeyValues({ items }: { items: [string, string][] }) {
  return (
    <div className="flex max-w-[760px] flex-col border-t border-rule">
      {items.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[minmax(0,160px)_minmax(0,1fr)] gap-5 border-b border-rule py-3.5 text-base">
          <div className="text-muted">{k}</div>
          <div>{v}</div>
        </div>
      ))}
    </div>
  );
}

function Decision({
  title,
  chose,
  rejected,
  children,
}: {
  title: string;
  chose: string;
  rejected: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex max-w-[820px] flex-col gap-3.5">
      <h3 className="text-[clamp(24px,2.4vw,30px)] leading-[1.2] tracking-[-0.01em]">{title}</h3>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-8 gap-y-3 text-base">
        <div className="flex flex-col gap-1">
          <div className="font-mono text-xs text-muted">Chose</div>
          <div>{chose}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-mono text-xs text-muted">Rejected</div>
          <div>{rejected}</div>
        </div>
      </div>
      <div className="text-[17px] text-muted [&_p]:text-[17px]">{children}</div>
    </div>
  );
}

function Snippet({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex max-w-[820px] flex-col gap-2.5">
      <div className="font-mono text-xs text-muted">{label}</div>
      {children}
    </div>
  );
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="m-0 flex max-w-[760px] list-none flex-col gap-4 p-0 [counter-reset:step]">{children}</ol>;
}

function Step({ children }: { children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 text-[17px] text-pretty [counter-increment:step] before:pt-[3px] before:font-mono before:text-[13px] before:text-muted before:content-[counter(step)]">
      <div>{children}</div>
    </li>
  );
}

export function caseStudyComponents(project: Project): MDXComponents {
  return {
    Section,
    KeyValues,
    Diagram,
    Row,
    Box,
    Arrow,
    Stack,
    Decision,
    Snippet,
    Metric: MdxMetric,
    Results: () =>
      project.results ? (
        <DataTable
          head={["Measure", "Before", "After", "Source"]}
          rows={project.results.map((r) => [r.measure, r.before, r.after, r.source])}
        />
      ) : null,
    p: (props) => <p className="max-w-[760px] text-lg" {...props} />,
    ol: Steps,
    li: Step,
    pre: Pre,
  };
}
