export interface Project {
  slug: string;
  title: string;
  summary: string[];
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  articleSlug?: string;
  articleUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "mono-parser",
    title: "Mono-Parser",
    summary: [
      "Built a B2B credit-decisioning API that analyzes cash flow, income stability, and debt exposure from Mono Open Banking data to automate loan underwriting for Nigerian fintechs.",
      "Architected as two services — NestJS handling orchestration, FastAPI running the scoring engine — aggregating 6+ data sources into 3 clean endpoints through an event-driven BullMQ pipeline for account linking, scoring, and decisioning.",
      "Outbound webhook delivery includes retries, signature-based authentication, and at-least-once delivery guarantees, with Gemini AI generating explainable reasoning behind each loan decision.",
    ],
    tags: ["NestJS", "FastAPI", "PostgreSQL", "Mono Open Banking API", "Gemini AI"],
    githubUrl: "https://github.com/vector-10",
    articleUrl:
      "https://medium.com/@duzieblaise/i-built-mono-parser-to-help-fintechs-underwrite-loans-at-scale-0dba3e2367a6",
  },
  {
    slug: "credwallet-service",
    title: "CredWallet Service",
    summary: [
      "A production-grade fintech wallet REST API supporting deposits, transfers, and withdrawals, backed by atomic MySQL transactions with pessimistic row locking and deadlock prevention via sorted lock acquisition.",
      "Ledger design follows double-entry accounting with immutable entries, so every debit has a corresponding credit and the full history of money movement stays auditable.",
      "Idempotency-key middleware, scoped per user with a 24-hour TTL, prevents duplicate financial transactions, alongside strict Zod validation and IP-based rate limiting.",
    ],
    tags: ["Knex.js", "TypeScript", "Express", "MySQL"],
    githubUrl: "https://github.com/vector-10",
  },
  {
    slug: "kanall",
    title: "Kanall — Multi-Tenant Virtual Account Infrastructure",
    summary: [
      "Built virtual account infrastructure for multi-tenant fintech platforms — provisioning dedicated Nigerian bank accounts (NUBANs) per tenant via Nomba's APIs, with full payment attribution and reconciliation.",
      "A double-entry ledger keeps every payment as paired credit/debit entries that always sum to zero, while an idempotent ingestion gate silently drops duplicate webhooks instead of double-crediting accounts.",
      "Confirmation runs through a tiered pipeline — fast per-transaction checks, background bulk sweeps, and a 24-hour audit cycle — so a missed webhook still gets caught eventually.",
      "Outbound webhook delivery uses exponential backoff, dead-letter tracking, and HMAC-SHA256 signing, with settlement transfers that auto-reverse on failure.",
    ],
    tags: ["Go", "PostgreSQL", "React", "TypeScript"],
    githubUrl: "https://github.com/vector-10/kanall",
    liveUrl: "https://www.kanall-app.online/",
  },
];
