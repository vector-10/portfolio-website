export interface Project {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  articleSlug?: string;
}

export const projects: Project[] = [
  {
    slug: "idempotent-payment-gateway",
    title: "Idempotent Payment Gateway",
    summary:
      "Payment retries from flaky mobile networks were creating duplicate charges. I designed an idempotency-key layer backed by Postgres row-level locking so retried requests resolve to the original transaction instead of a new one, and cut duplicate-charge incidents to zero in staging load tests.",
    tags: ["Node.js", "TypeScript", "PostgreSQL", "Fintech"],
    githubUrl: "https://github.com/vector-10",
    articleSlug: "idempotent-payment-gateway",
  },
  {
    slug: "event-driven-ledger-reconciliation",
    title: "Event-Driven Ledger Reconciliation",
    summary:
      "Built a reconciliation engine that consumes transaction events off RabbitMQ and reconciles internal ledger state against upstream provider records asynchronously, replacing a nightly batch job that was hours behind reality with near real-time drift detection.",
    tags: ["RabbitMQ", "Distributed Systems", "PostgreSQL", "Node.js"],
    githubUrl: "https://github.com/vector-10",
  },
  {
    slug: "multi-tenant-billing-service",
    title: "Multi-Tenant Subscription Billing Service",
    summary:
      "Designed a multi-tenant billing service in Java/Spring Boot to support usage-based and flat-rate plans on shared infrastructure, with tenant isolation enforced at the schema level to keep the system auditable as the customer base scales.",
    tags: ["Java", "Spring Boot", "PostgreSQL", "Distributed Systems"],
    githubUrl: "https://github.com/vector-10",
  },
  {
    slug: "realtime-fraud-scoring-pipeline",
    title: "Real-Time Fraud Scoring Pipeline",
    summary:
      "Built a streaming risk-scoring pipeline that evaluates transactions against rule-based and statistical signals in under 200ms, so high-risk payments get flagged before settlement instead of during a next-day batch review.",
    tags: ["RabbitMQ", "Node.js", "Distributed Systems", "Fintech"],
    githubUrl: "https://github.com/vector-10",
  },
  {
    slug: "resilient-payment-provider-gateway",
    title: "Resilient Third-Party Payment Gateway",
    summary:
      "Integrated multiple third-party payment providers behind a single internal API, with circuit breakers and automatic failover so a provider outage degrades gracefully instead of taking checkout down.",
    tags: ["TypeScript", "PostgreSQL", "Distributed Systems", "Fintech"],
    githubUrl: "https://github.com/vector-10",
  },
  {
    slug: "distributed-billing-job-scheduler",
    title: "Distributed Billing Job Scheduler",
    summary:
      "Replaced a single-node cron setup with a distributed job scheduler for recurring billing and settlement runs, using leader election so jobs run exactly once even as worker instances scale up and down.",
    tags: ["Java", "Spring Boot", "Distributed Systems", "PostgreSQL"],
    githubUrl: "https://github.com/vector-10",
  },
];
