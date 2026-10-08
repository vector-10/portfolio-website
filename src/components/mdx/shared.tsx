export function Pre({ className = "", ...props }: React.ComponentProps<"pre">) {
  return <pre className={`code-block ${className}`} {...props} />;
}

export function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
  const cell = "py-3.5 pr-4 last:pr-0 border-b border-rule";
  return (
    <div className="max-w-[820px] min-w-0 overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-base">
        <thead>
          <tr className="text-left font-mono text-xs text-muted">
            {head.map((h) => (
              <th key={h} className="border-b border-ink pr-4 pb-3 font-normal last:pr-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([measure, before, after, source]) => (
            <tr key={measure}>
              <td className={cell}>{measure}</td>
              <td className={`${cell} text-muted`}>{before}</td>
              <td className={`${cell} font-medium`}>{after}</td>
              <td className={`${cell} font-mono text-xs text-muted`}>{source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
