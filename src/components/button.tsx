const base = "flex min-h-12 items-center rounded-full px-6 py-3.5 font-medium hover:no-underline";

export function ButtonLink({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) {
  const style = variant === "primary" ? "bg-ink text-bg" : "border border-ink";
  return (
    <a href={href} className={`${base} ${style}`}>
      {children}
    </a>
  );
}
