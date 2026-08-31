import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { Reveal } from "@/components/reveal";

const links = [
  {
    label: "Email",
    href: "mailto:duzieblaise10@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    href: "https://github.com/vector-10",
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/chukwuduzie-blaise",
    icon: LinkedinIcon,
  },
];

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-24">
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

        <div className="mt-12 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
          <div>
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Education
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              B.Eng Mechanical Engineering, GPA 4.0
              <br />
              Federal University of Technology Owerri, 2019–2024
            </p>
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Awards
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Hack4Futo Hackathon Winner (2023)
              <br />
              Legacy Leadership Award, Hack4Futo Third Hackathon (2024)
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
