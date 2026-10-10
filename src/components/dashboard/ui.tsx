export const chipClass = (on: boolean) =>
  `min-h-8 cursor-pointer rounded-full border px-3 text-[13px] ${
    on ? "border-ink bg-ink text-bg" : "border-rule bg-transparent text-ink"
  }`;

export const fieldClass = (bad = false) =>
  `w-full min-h-9 rounded-none px-2 text-[13px] text-ink focus:border-ink focus:outline-none ${
    bad ? "border border-dashed border-ink bg-soft" : "border border-rule bg-field"
  }`;

export const primaryButton =
  "inline-flex min-h-10 max-[819px]:min-h-11 cursor-pointer items-center rounded-full border-0 bg-ink px-4 font-medium text-bg hover:no-underline disabled:cursor-not-allowed disabled:bg-rule disabled:text-muted";

export const secondaryButton =
  "inline-flex min-h-10 max-[819px]:min-h-11 cursor-pointer items-center rounded-full border border-ink bg-transparent px-4 font-medium text-ink hover:no-underline";

export function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-[34px] leading-none tracking-[-0.02em]">{children}</h1>;
}

export function Page({ children, narrow }: { children: React.ReactNode; narrow?: boolean }) {
  return (
    <div
      className={`box-border flex w-full flex-col gap-5 px-[clamp(16px,3vw,40px)] pt-7 pb-12 ${
        narrow ? "max-w-[1080px]" : "max-w-[1280px]"
      }`}
    >
      {children}
    </div>
  );
}

export function Notice({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div role="alert" className="flex flex-col gap-2 border border-dashed border-ink bg-soft p-4">
      <div className="font-medium">{title}</div>
      {children && <div className="text-[13px] text-muted">{children}</div>}
    </div>
  );
}
