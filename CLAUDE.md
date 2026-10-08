# Portfolio + Engineering Journal

Personal portfolio and technical blog for a T-shaped backend engineer. Fresh rebuild started 2026-10-08 — the previous site was deleted on purpose; do not consult or restore files from earlier commits.

## Audience
- Foreign remote startup founders, CTOs, technical PMs — judge on proof of work.
- Tier-1 domestic principal engineers / tech leads (Paystack, Moniepoint level) — judge on system-design depth.

Content leads with the deep specialty (backend, async distributed systems, data pipelines, multi-tenant isolation, payment orchestration), not a flat list of tools.

## Stack & architecture (agreed)
- **Framework:** Next.js 16 App Router, TypeScript, Tailwind v4, `src/` dir, `@/*` alias.
- **Package manager:** pnpm only (never npm/yarn).
- **Content:** MDX in the repo — `content/posts/`, `content/projects/`. Frontmatter validated with Zod at build; invalid content fails the build.
- **Publishing:** private `/dashboard` writes MDX (and images) to GitHub via the API → Vercel rebuild. Git is the source of truth for content.
- **Auth:** Auth.js with GitHub OAuth, allowlisted to the owner's GitHub account only. No user table.
- **Database:** Neon Postgres for runtime data only — view counts, reactions, newsletter signups. Never for post content.
- **Rendering:** public pages statically generated; server components by default, client components only for real interactivity.
- **Assets:** `next/image` (AVIF/WebP), `next/font` self-hosted, no third-party asset domains.
- **Extras:** `next/og` social cards, RSS, sitemap.

## Content rules
- Project metrics always carry context: value, unit, how measured, production vs benchmark, date.
- Case-study structure: problem → constraints → architecture → trade-offs → results.

@AGENTS.md

## Hard rule: research, don't assume
Before using any Next.js API or any library/tool feature, look up current best practice: the docs in `node_modules/next/dist/docs/`, the package's own docs/types, or a web search. If the docs don't settle it, ask the owner. Never guess at an API or a fix and present it as fact.

## Workflow
UI is designed first in Claude Design, then handed back here for implementation. Don't write UI layout code ahead of the design.

## Owner-supplied content checklist
Everything not ticked is placeholder copy from the design handoff and must be replaced before launch. Never invent numbers; leave a gap and ask.

**Profile & config** (`src/config/site.ts`)
- [x] GitHub, LinkedIn, X links
- [ ] Contact email (currently `hello@chukwuduzie.dev`)
- [ ] Availability line on Work with me (e.g. "Taking 2 new projects for Q1 2027")
- [ ] Pricing for both tiers: price, duration, included items, "good fit if"
- [ ] How-it-works steps and FAQ answers (payment terms, time zone, etc.)
- [ ] About: location line, "Where I go deep" specialties, stack by area, experience (company, role, dates, one outcome each)
- [ ] About bio prose (in `src/app/about/page.tsx`)
- [ ] Home "Results in production" metrics: value, unit, label, source (Production/Benchmark), method, date
- [ ] Testimonials: quote, name, title (+ avatar, optional)
- [ ] Client logos for "Trusted by teams at" (or remove the strip)
- [ ] Talks and elsewhere: title, link, type · venue · date
- [ ] Production domain → `NEXT_PUBLIC_SITE_URL` in Vercel

**Files** (`public/`)
- [x] Home portrait → `images/portrait.jpg` (4:5)
- [x] About photo → `images/about.jpg` (4:5)
- [ ] Résumé → `resume.pdf`
- [ ] Project covers → `images/work/<slug>.png` (16:10, ≥1600×1000)
- [ ] Article figures → `images/writing/<name>.png` (16:9, ≥1440×810)
- [ ] Client logos → `images/logos/<name>.svg` (monochrome, ~120×32)
- [ ] Testimonial avatars → `images/avatars/<name>.jpg` (square, ≥88×88)

**Projects** (`content/projects/<slug>.mdx`, one per project; current five are placeholders)
- [ ] Title, kind (e.g. "Fintech · Payments"), type (Product/Systems), role, timeframe, team, stack, links
- [ ] Plain-language outcome + headline metric line
- [ ] Short version: problem / what I did / result
- [ ] Metrics with full provenance (value, unit, label, source, date, method)
- [ ] Deep dive: context & constraints, architecture (boxes/arrows), decisions (chose / rejected / why), what went wrong, results table (before / after / source)
- [ ] Closing-band headline (`cta`), featured flag and order

**Articles** (`content/posts/<slug>.mdx`; current seven are placeholders)
- [ ] Published elsewhere: title, one-line description, tags, original date, URL, publication name, reading time
- [ ] New articles written here: full MDX body plus title, description, tags, date
