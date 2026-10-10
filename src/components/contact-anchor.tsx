"use client";

export const CONTACT_EVENT = "contact:open";

export function ContactAnchor({
  href,
  subject,
  className,
  children,
}: {
  href: string;
  subject?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (!document.getElementById("contact-dialog")) return;
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(CONTACT_EVENT, { detail: subject ?? "" }));
      }}
    >
      {children}
    </a>
  );
}
