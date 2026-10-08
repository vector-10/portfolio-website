export function SectionHead({ title, aside }: { title: string; aside?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-6">
      <h2 className="text-[clamp(32px,4vw,56px)] leading-[1.05] tracking-[-0.025em]">{title}</h2>
      {aside}
    </div>
  );
}
