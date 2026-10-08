import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { ClosingBand } from "@/components/closing-band";
import { FilterChips } from "@/components/filter-chips";
import { ProjectRow } from "@/components/project-row";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = pageMeta(
  "Work",
  "Products built end to end, and backend systems rebuilt to hold up under real load.",
  "/work",
);

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <main>
      <section className="gutter flex flex-col gap-6 pt-(--section-y) pb-[clamp(32px,4vw,56px)]">
        <h1 className="text-[clamp(56px,8vw,120px)] leading-[0.95] tracking-[-0.04em]">Work</h1>
        <p className="max-w-[560px] text-[clamp(17px,1.5vw,20px)] text-muted">
          Products I&apos;ve built end to end, and systems I&apos;ve rebuilt to hold up under real load. Each case study
          starts with the outcome and goes as deep as you want.
        </p>
      </section>
      <section className="gutter pb-(--section-y)">
        <FilterChips
          label="Filter projects"
          className="mb-6"
          options={[
            { value: "Product", label: "Full products" },
            { value: "Systems", label: "Backend systems" },
          ]}
        >
          <div className="flex flex-col border-t border-ink">
            {projects.map((p, i) => (
              <ProjectRow key={p.meta.slug} project={p.meta} index={i} showStack />
            ))}
          </div>
        </FilterChips>
      </section>
      <ClosingBand />
    </main>
  );
}
