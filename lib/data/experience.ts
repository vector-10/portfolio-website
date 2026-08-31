export interface ExperienceEntry {
  company: string;
  location: string;
  role: string;
  dates: string;
  highlights: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: "Eulav-Grow",
    location: "Remote, US",
    role: "Software Engineer",
    dates: "Mar 2025 – Aug 2025",
    highlights: [
      "Designed and implemented a metered billing system on Stripe's usage-based API, tracking AI chat sessions via Grafana and translating consumption into pay-as-you-go invoicing — directly increasing revenue.",
      "Built developer-facing TypeScript SDKs and APIs for Shopify, BigCommerce, and WooCommerce integrations, contributing to a 15% increase in client sales.",
      "Introduced Redis-backed async queues to offload intensive tasks (media processing, email delivery), improving onboarding flow performance by 20%.",
      "Implemented structured API observability with Grafana, monitoring 1000+ RPS in production and enabling real-time incident detection across distributed services.",
      "Participated in code reviews and aligned backend delivery with product timelines across a small engineering team.",
    ],
  },
  {
    company: "First Software Systems",
    location: "Lagos, Nigeria",
    role: "Backend Engineer",
    dates: "Jan 2024 – Present",
    highlights: [
      "Integrated Paystack with HMAC-verified webhook handling and idempotency keys, enabling reliable transaction processing for a food ordering platform at 10,000+ users.",
      "Designed multi-tenant PostgreSQL and MongoDB schemas supporting 10,000+ concurrent users across fintech and logistics platforms.",
      "Built WebSocket-powered real-time chat handling 2,000+ concurrent connections, improving application responsiveness by 25%.",
      "Built backend services for a crypto savings and bank transfer platform, integrating Paystack and VTPass APIs with secure transaction flows and multi-provider support.",
    ],
  },
  {
    company: "RadicalX",
    location: "Remote, US",
    role: "Software Engineering Intern",
    dates: "Dec 2023 – Mar 2024",
    highlights: [
      "Built GPT-powered chatbot APIs for healthcare triage and an AI PDF summarizer SDK, shipping production Python backends during an intensive engineering bootcamp.",
      "Secured 2nd place in a global AI hackathon with a malaria triage project targeting African homes.",
    ],
  },
];
