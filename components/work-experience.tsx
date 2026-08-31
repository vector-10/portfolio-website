import { Reveal } from "@/components/reveal";
import { experience } from "@/lib/data/experience";

export function WorkExperience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-24">
      <Reveal>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Work Experience
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Roles where the work actually shipped and carried real load.
        </p>
      </Reveal>

      <div className="mt-10 flex flex-col divide-y divide-border">
        {experience.map((entry, index) => (
          <Reveal key={entry.company} delay={index * 0.05}>
            <div className="py-8 first:pt-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-medium">
                  {entry.role} <span className="text-muted-foreground">— {entry.company}</span>
                </h3>
                <p className="font-mono text-sm text-muted-foreground">
                  {entry.dates}
                </p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {entry.location}
              </p>
              <ul className="mt-4 space-y-2">
                {entry.highlights.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
