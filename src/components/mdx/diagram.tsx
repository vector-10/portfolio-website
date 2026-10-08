export function Diagram({ caption, children }: { caption?: string; children: React.ReactNode }) {
  return (
    <figure className="m-0 mb-2 flex flex-col gap-[18px] border border-ink p-[clamp(20px,3vw,40px)] font-mono text-[13px]">
      {children}
      {caption && (
        <figcaption className="border-t border-rule pt-3.5 font-sans text-sm text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2.5">{children}</div>;
}

export function Stack({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

export function Box({
  sub,
  primary,
  external,
  children,
}: {
  sub?: string;
  primary?: boolean;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`border border-ink ${external ? "border-dashed px-3 py-1.5" : "px-3.5 py-2.5"} ${primary ? "bg-soft" : ""}`}
    >
      {children}
      {sub && <div className="text-[11px] text-muted">{sub}</div>}
    </div>
  );
}

export function Arrow({ indent, children }: { indent?: boolean; children: React.ReactNode }) {
  return <div className={`text-muted ${indent ? "pl-[clamp(0px,30vw,420px)]" : ""}`}>{children}</div>;
}
