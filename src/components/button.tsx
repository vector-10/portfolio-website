const base = "flex min-h-12 items-center rounded-full px-6 py-3.5 font-medium hover:no-underline";

export function buttonClass(variant: "primary" | "secondary" = "primary") {
  return `${base} ${variant === "primary" ? "bg-ink text-bg" : "border border-ink"}`;
}

export function ButtonLink({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={buttonClass(variant)}>
      {children}
    </a>
  );
}
