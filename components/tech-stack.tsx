import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { stack } from "@/lib/data/stack";

export function TechStack() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <Reveal>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Tech Stack
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {stack.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
