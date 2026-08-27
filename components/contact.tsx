import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { Reveal } from "@/components/reveal";

const links = [
  {
    label: "Email",
    href: "mailto:contact@chukwuduzie-blaise.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    href: "https://github.com/vector-10",
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: Linkedin,
  },
];

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Contact
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Open to international remote and contract backend engineering
          roles. Reach out directly.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          {links.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
