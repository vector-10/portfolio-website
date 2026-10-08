export default function DashboardLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className="box-border flex w-full max-w-[1280px] flex-col gap-5 px-[clamp(16px,3vw,40px)] pt-7 pb-12"
    >
      <div className="h-[34px] w-48 bg-soft" />
      <div className="flex gap-1.5">
        {[64, 72, 80].map((w) => (
          <div key={w} className="h-8 rounded-full bg-soft" style={{ width: w }} />
        ))}
      </div>
      <div className="flex flex-col border-t border-ink">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2 border-b border-rule py-3">
            <div className="h-4 bg-soft" style={{ width: `${55 - (i % 3) * 10}%` }} />
            <div className="h-3 w-1/4 bg-soft" />
          </div>
        ))}
      </div>
    </div>
  );
}
