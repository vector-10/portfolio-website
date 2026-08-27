import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { stack } from "@/lib/data/stack";

export function About() {
  return (
    <section id="about" className="bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            About
          </h2>

          <div className="mt-6 max-w-3xl space-y-4 text-muted-foreground">
            <p>
              I build backend systems and distributed infrastructure —
              services that stay correct under retries, partial failures, and
              concurrent writes, not just under a clean happy path.
            </p>
            <p>
              Most of that work has landed in fintech and payments: idempotent
              transaction handling, ledger reconciliation, and integrations
              where a bug doesn&apos;t just break a feature, it moves money
              incorrectly. That constraint has shaped how I approach every
              system I build, fintech or not.
            </p>
            <p>
              My core stack is Node.js, TypeScript, and PostgreSQL. I&apos;m
              deliberately expanding into Java and Spring Boot to work
              comfortably in the JVM-based stacks that larger enterprise and
              fintech platforms run on.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {stack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
