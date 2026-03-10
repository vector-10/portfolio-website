const projects = [
  {
    name: "Mono-Parser",
    status: "Production",
    description:
      "A B2B API-first credit scoring and decisioning engine. Mono Parser helps loan officers at fintech companies make better-informed lending decisions by processing bank data through a rule-based scoring engine and returning clear, it is an event driven system with Webhook delivery.",
    tags: ["Node.js", "PostgreSQL", "Redis", "REST APIs", "Webhooks"],
    architecture: [
      "Microservices: NestJS gateway layer + FastAPI scoring engine",
      "Async job queues (BullMQ) end-to-end pipeline under 30s latency",
      "Webhook system with retry mechanisms + signature-based authentication",
      "Gemini AI integration for explainable loan decision generation",
      "Rule-based decisioning engine with knockout rules + affordability checks",
    ],
    github: "https://github.com/vector-10/mono-parser",
    live: "https://mono-parser.shop",
  },
  {
    name: "Pera Wallet Service",
    status: "Github",
    description:
      "A secure wallet system built for fintech operations and Lending, users can fund, transfer, withdraw and  view transaction history for disputes and review.",
    tags: ["Node.js(Express)", "MySQL", "Knex.js", "TypeScript", "Jest"],
    architecture: [
      "ACID compliant wallet infrastructure for Lending and Fintech Transactions",
      "Idempotency keys prevent duplicate disbursements on retry",
      "Row-level locking for finance transactions to prevent dead locks and ensure data consistent fund transfers",
      "Transaction history logs with references tied to senders and receivers enforced on database level to avoid Transaction Disputes",
    ],
    github: "https://github.com/vector-10/wallet-service-lendsqr",
    
  },
  {
    name: "Merez Logistics",
    status: "Client project",
    description:
      "A B2B Logistics Web application desgined to handle 10,000 concurrent food deliveries daily between customers and businesses with their Dispatch Riders",
    tags: ["Node.js", "MongoDB", "React", "AWS EC2"],
    architecture: [
      "Multi-tenant backend architecture on MongoDB powering web and Mobile applications between riders, food vendors and customers",
      "Websockets for real-time chatting and customer support",
      "Rider tracking and realtime map usage for customers",
      "React dashboard with real-time updates for vendors and Admin to monitor application statistics.",
    ],
    live: "https://merezglobal.com/",
  },
];

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-28 border-t border-wire">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="font-mono text-neon text-xs tracking-[0.35em] uppercase mb-5">
            02. Projects
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-snow leading-tight">
            Work that ships
            <br />
            and scales.
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {projects.map((project) => (
            <article
              key={project.name}
              className="bg-surface border border-wire rounded-2xl p-8 hover:border-neon/40 transition-colors duration-300 group"
            >
              {/* Status + tags */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="flex items-center gap-2 font-mono text-xs text-mist">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  {project.status}
                </span>
                <span className="text-wire text-xs">·</span>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full font-mono text-xs bg-panel border border-wire text-gold"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: name + description + links */}
                <div>
                  <h3 className="font-display text-2xl font-bold text-snow mb-3 group-hover:text-neon transition-colors duration-200">
                    {project.name}
                  </h3>
                  <p className="text-mist text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>
                  <div className="flex gap-5">
                    <a
                      href={project.github}
                      className="flex items-center gap-2 font-mono text-xs text-mist hover:text-snow transition-colors"
                    >
                      <GitHubIcon />
                      GitHub
                    </a>
                    <a
                      href={project.live}
                      className="flex items-center gap-2 font-mono text-xs text-mist hover:text-snow transition-colors"
                    >
                      <ExternalLinkIcon />
                      Live
                    </a>
                  </div>
                </div>

                {/* Right: architecture callout */}
                <div className="bg-panel rounded-xl p-5 border-l-2 border-neon/50">
                  <p className="font-mono text-xs text-neon/60 mb-4">
                    // Architecture
                  </p>
                  <ul className="space-y-2.5">
                    {project.architecture.map((point, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 font-mono text-xs text-mist leading-relaxed"
                      >
                        <span className="text-neon/40 mt-0.5 shrink-0">─</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
