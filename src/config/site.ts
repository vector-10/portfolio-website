import type { Metric } from "@/lib/content/schema";

export const site = {
  name: "Chukwuduzie Blaise",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Software engineer building full products, with the backend done right: payments, data and scale.",
  email: "hello@chukwuduzie.dev",
  resume: "/resume.pdf",
  portrait: { src: "/images/hero-full.jpg", width: 1920, height: 2560 },
  social: {
    github: "https://github.com/vector-10",
    linkedin: "https://www.linkedin.com/in/chukwuduzie-blaise-46811026b",
    x: "https://x.com/vector_ware",
  },
  showHireTeaser: true,
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/work-with-me", label: "Work with me" },
] as const;

export const homeMetrics: Metric[] = [
  { value: "7", unit: "weeks", label: "From first call to a live product with paying users", source: "Production", method: "kickoff to launch", date: "Feb 2026" },
  { value: "₦2.4B", unit: "/mo", label: "Payments processed without manual reconciliation", source: "Production", method: "ledger totals", date: "Jun 2026" },
  { value: "14k", unit: "events/s", label: "Sustained through a sales peak with no dropped events", source: "Production", method: "Kafka consumer lag, 7-day peak", date: "Mar 2026" },
  { value: "120", unit: "ms", label: "Checkout response time for 99% of requests", source: "Production", method: "p99, 30-day window", date: "Aug 2026" },
];

export const logos: { name: string; src?: string }[] = [
  { name: "logo" },
  { name: "logo" },
  { name: "logo" },
  { name: "logo" },
  { name: "logo" },
];

export const availability = "Taking 2 new projects for Q1 2027";

export const tiers = [
  {
    name: "Product build",
    teaser: "Your product built end to end, from MVP to launch. For founders with an idea and a deadline.",
    desc: "Your product built end to end, from MVP to launch.",
    price: "$3k – $5k",
    time: "Per project · 4 – 8 weeks",
    items: ["Web app and API", "Auth, payments and admin", "Database design and hosting", "Weekly demos on a live link", "30 days of post-launch fixes"],
    fit: ["You need a first version live", "You have a clear problem and a budget", "You want one person accountable"],
  },
  {
    name: "Embedded engineer",
    teaser: "Senior engineering capacity inside your team. For startups that need to ship more, reliably.",
    desc: "Senior engineering capacity inside your team, part- or full-time.",
    price: "$2.5k",
    time: "Per month · contract",
    items: ["Feature development", "Backend and infrastructure work", "Code review and mentoring", "Incident support", "Joins your standups and tools"],
    fit: ["You already have a product and a team", "Backend or payments are a bottleneck", "You want flexibility month to month"],
  },
];

export const problems = [
  { q: "You have an idea and a deadline, but no one to build it.", a: "I take it from rough notes or designs to a live product people can pay for." },
  { q: "Your MVP works, but it slows down or breaks as users grow.", a: "I find what will fail first and fix it without stopping the product." },
  { q: "Payments are failing, duplicated or impossible to reconcile.", a: "This is my deepest specialty. I've rebuilt payout systems handling billions of naira." },
  { q: "Your team needs senior backend help, but not a full-time hire yet.", a: "I join as an embedded engineer, ship features and raise the bar for everyone else." },
];

export const steps = [
  { t: "Intro call", when: "30 min · free", d: "You tell me what you are building. I ask questions and tell you honestly whether I am the right fit." },
  { t: "Written proposal", when: "Within 3 days", d: "Scope, price, timeline and what is not included, in one page. No work starts until you agree." },
  { t: "Build", when: "Weekly milestones", d: "A demo every week on a live link, a short written update, and a shared board so you can see progress any time." },
  { t: "Launch and handover", when: "+ 30 days support", d: "Deployed to your accounts, documented, and supported for a month while real users arrive." },
];

export const faqs = [
  { q: "Who owns the code?", a: "You do. Everything lives in your repository and your cloud accounts from day one." },
  { q: "How do payments work?", a: "For product builds, 40% upfront, 30% at a midway milestone and 30% at launch. Embedded work is billed monthly in advance." },
  { q: "What if the scope changes halfway?", a: "It usually does. We agree changes in writing with their effect on price and timeline before I build them." },
  { q: "Do you design too?", a: "I can build from your designs or work with a designer. For simple products I can produce clean, usable interfaces myself." },
  { q: "What time zone do you work in?", a: "UTC+1, with at least four hours of overlap with Europe and the US East Coast." },
];

export const testimonials: { text: string; name: string; title: string; avatar?: string }[] = [
  { text: "He found the reason our payouts were failing in a week, then fixed it so it stayed fixed. Finance noticed before engineering did.", name: "Placeholder Name", title: "CTO, lending startup" },
  { text: "Rare mix: deep on distributed systems, and he explains trade-offs so the whole team can make the call.", name: "Placeholder Name", title: "Engineering lead, fintech" },
  { text: "We went from a Figma file to paying customers in under two months. He handled everything technical so I could focus on selling.", name: "Placeholder Name", title: "Founder, SaaS startup" },
  { text: "Clear updates, no surprises, and the system still runs without him babysitting it. That is what I want from a contractor.", name: "Placeholder Name", title: "Head of Product, logistics" },
];

export const talks: { title: string; href: string; meta: string }[] = [
  { title: "Designing payouts that survive provider outages", href: "#", meta: "Talk · DevFest Lagos · Nov 2025" },
  { title: "Guest post: Multi-tenancy without the multi-headache", href: "#", meta: "Article · Placeholder Engineering Blog · Jun 2025" },
  { title: "Podcast: Building fintech backends in Africa", href: "#", meta: "Podcast · Placeholder Show · Feb 2025" },
];

export const about = {
  photo: "/images/about.jpg",
  location: ["Lagos, Nigeria", "Works remotely · UTC+1"],
  depth: [
    { k: "Payments and transactions", v: "Payout and collection flows, ledgers, idempotent retries, provider failover and reconciliation." },
    { k: "Asynchronous distributed systems", v: "Event-driven services, outbox patterns, queues and the failure modes between them." },
    { k: "High-throughput data pipelines", v: "Streaming ingestion and processing that stays correct under spikes and replays." },
    { k: "Multi-tenant isolation", v: "One platform for hundreds of customers, with data, limits and noisy neighbours kept apart." },
    { k: "Infrastructure", v: "Containerised deployments on AWS, observability, and on-call that rarely gets called." },
  ],
  stack: [
    { k: "Languages", v: "TypeScript, Go, Python" },
    { k: "Backend", v: "NestJS, FastAPI, Gin" },
    { k: "Frontend", v: "Next.js, React" },
    { k: "Data", v: "PostgreSQL, MySQL, Redis" },
    { k: "Messaging", v: "Kafka, BullMQ" },
    { k: "Infrastructure", v: "Docker, AWS" },
  ],
  jobs: [
    { company: "Independent", role: "Product and backend engineer", time: "2025 – now", did: "Building products end to end for startup founders, and embedding with fintech teams on payments and infrastructure." },
    { company: "Placeholder Lending Co.", role: "Lead backend engineer", time: "2023 – 2025", did: "Led the payout platform rebuild. Failed payouts fell from 4.1% to 0.6% and double payments stopped entirely." },
    { company: "Placeholder Analytics", role: "Backend engineer", time: "2021 – 2023", did: "Built the real-time event pipeline handling 14k events per second, replacing overnight batch reporting." },
    { company: "Placeholder SaaS", role: "Software engineer", time: "2020 – 2021", did: "Shipped multi-tenant billing and onboarding for a B2B platform, from 20 to 340 business customers." },
  ],
};
