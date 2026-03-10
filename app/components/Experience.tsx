const experience = [
  {
    company: "FinCore Systems",
    role: "Senior Backend Engineer",
    period: "Jan 2022 — Present",
    description:
      "Leading backend development for a core banking platform serving 2M+ users across 15 markets. Own the wallet API layer, disbursements engine, and cross-border payment integrations.",
    highlights: [
      "Architected and shipped WalletCore API — now processes $500M+ monthly in transaction volume",
      "Reduced p99 API latency from 800ms to 45ms through a targeted Redis caching strategy",
      "Led zero-downtime migration from a monolith to 6 independently deployed microservices",
      "Mentored 3 junior engineers and introduced team-wide API design standards",
    ],
    tags: ["Node.js", "MySQL", "Redis", "AWS", "Kafka"],
  },
  {
    company: "PayStack (Acquired by Stripe)",
    role: "Backend Engineer",
    period: "Jun 2021 — Dec 2021",
    description:
      "Worked on the payment processing pipeline, improving reliability and extending support for new payment methods across West Africa.",
    highlights: [
      "Built webhook delivery system with guaranteed at-least-once delivery semantics",
      "Improved transaction success rate by 12% through a comprehensive retry logic overhaul",
      "Integrated 4 new bank APIs enabling direct debit support for 3 new markets",
    ],
    tags: ["Node.js", "PostgreSQL", "Redis", "TypeScript"],
  },
  {
    company: "TechBridge Solutions",
    role: "Full-Stack Engineer",
    period: "Aug 2019 — May 2021",
    description:
      "Built internal tooling and customer-facing web applications for logistics and supply chain clients across the full stack.",
    highlights: [
      "Developed a real-time shipment tracking dashboard serving 50k+ active users",
      "Designed and implemented a REST API consumed by 3 mobile applications",
      "Reduced report generation time from 45s to under 3s via targeted query optimisation",
    ],
    tags: ["Node.js", "React", "MySQL", "TypeScript"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-28 border-t border-wire">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="font-mono text-neon text-xs tracking-[0.35em] uppercase mb-5">
            04. Experience
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-snow leading-tight">
            Where I&apos;ve built.
          </h2>
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-0 top-2 bottom-0 w-px bg-wire hidden lg:block" />

          <div className="flex flex-col gap-14">
            {experience.map((job, i) => (
              <div key={i} className="lg:pl-12 relative">
                {/* Timeline dot */}
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-neon hidden lg:block ring-4 ring-canvas" />

                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-start gap-2 lg:gap-8 mb-4">
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-snow">
                      {job.role}
                    </h3>
                    <p className="text-neon font-medium text-sm mt-0.5">
                      {job.company}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-mist bg-panel border border-wire rounded-full px-3 py-1.5 h-fit whitespace-nowrap">
                    {job.period}
                  </span>
                </div>

                <p className="text-mist text-sm leading-relaxed mb-5">
                  {job.description}
                </p>

                <ul className="space-y-2.5 mb-5">
                  {job.highlights.map((point, j) => (
                    <li key={j} className="flex gap-3 text-sm text-mist">
                      <span className="text-neon mt-0.5 shrink-0 leading-none">
                        →
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full font-mono text-xs bg-panel border border-wire text-mist"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
