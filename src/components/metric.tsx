import type { Metric } from "@/lib/content/schema";

export function MetricWithContext({ metric, variant = "case" }: { metric: Metric; variant?: "case" | "home" }) {
  return (
    <div className="flex min-w-0 flex-col gap-2.5 border-b border-rule py-7 pr-6">
      <div className="font-serif text-[clamp(44px,4.6vw,64px)] leading-none tracking-[-0.03em]">
        {metric.value}
        <span className="ml-1.5 text-[0.42em] tracking-normal text-muted">{metric.unit}</span>
      </div>
      <div className="text-base text-pretty">{metric.label}</div>
      {variant === "case" ? (
        <div className="flex flex-col gap-0.5 font-mono text-xs leading-[1.6] text-muted">
          <div>
            <span className="mr-1.5 inline-block rounded-[3px] border border-muted px-1.5">{metric.source}</span>
            {metric.date}
          </div>
          <div>{metric.method}</div>
        </div>
      ) : (
        <div className="font-mono text-xs leading-[1.6] text-muted">
          {metric.source} · {metric.method} · {metric.date}
        </div>
      )}
    </div>
  );
}

export function MetricGrid({ metrics, variant }: { metrics: Metric[]; variant?: "case" | "home" }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] border-t border-ink">
      {metrics.map((m) => (
        <MetricWithContext key={`${m.value}${m.unit}${m.label}`} metric={m} variant={variant} />
      ))}
    </div>
  );
}
