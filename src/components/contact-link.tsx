import { site } from "@/config/site";
import { ContactAnchor } from "./contact-anchor";

export function ContactLink({
  subject,
  className,
  children,
}: {
  subject?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const href = `mailto:${site.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
  return (
    <ContactAnchor href={href} subject={subject} className={className}>
      {children}
    </ContactAnchor>
  );
}
