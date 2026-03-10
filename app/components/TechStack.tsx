const stack = [
  {
    category: "Backend",
    color: "text-neon",
    items: [
      "Node.js",
      "TypeScript",
      "MySQL",
      "PosstgreSQL",
      "MongoDB",
      "Redis",
      "REST APIs",
      "Microservices",
    ],
  },
  {
    category: "Frontend",
    color: "text-gold",
    items: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Vite"],
  },
  {
    category: "Infrastructure",
    color: "text-neon",
    items: ["AWS", "Docker", "Kafka", "EventBridge", "Lambda Functions", "Github Actions(CI/CD)"],
  },
  {
    category: "Practices",
    color: "text-gold",
    items: [
      "Communication",
      "TDD",
      "ACID Transactions",
      "Event-Driven",
      "Agile / Scrum",
    ],
  },
];

export default function TechStack() {
  return (
    <section id="stack" className="py-28 border-t border-wire">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="font-mono text-neon text-xs tracking-[0.35em] uppercase mb-5">
            03. Stack
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-snow leading-tight">
            Tools of the trade.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stack.map(({ category, color, items }) => (
            <div
              key={category}
              className="bg-surface border border-wire rounded-xs p-6 hover:border-wire/60 transition-colors"
            >
              <p
                className={`font-mono text-xs tracking-[0.25em] uppercase mb-6 ${color}`}
              >
                {category}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon/50 shrink-0" />
                    <span className="text-mist text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
