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
- **Database:** Neon Postgres for runtime data only — view counts, reactions, newsletter signups. Never for post content. **Deferred:** not set up yet; see "Deferred features".
- **Rendering:** public pages statically generated; server components by default, client components only for real interactivity.
- **Theme:** light only, `color-scheme: light`. Dark mode and its toggle were removed on purpose 2026-10-08; ignore the dark tokens and "both themes" checks in the design handoff.
- **Assets:** `next/image` (AVIF/WebP), `next/font` self-hosted, no third-party asset domains.
- **Extras:** `next/og` social cards, sitemap, robots, JSON-LD structured data (`Person` + `WebSite` in the root layout, `Article` per post). No RSS: removed on purpose 2026-10-08.
- **Discoverability:** all crawlers allowed, including AI search and training bots (OAI-SearchBot, GPTBot, ClaudeBot, PerplexityBot). Don't block them. No `llms.txt`: evidence shows crawlers don't read it.

## Content rules
- Project metrics always carry context: value, unit, how measured, production vs benchmark, date.
- Case-study structure: problem → constraints → architecture → trade-offs → results.

@AGENTS.md

## Hard rule: research, don't assume
Before using any Next.js API or any library/tool feature, look up current best practice: the docs in `node_modules/next/dist/docs/`, the package's own docs/types, or a web search. If the docs don't settle it, ask the owner. Never guess at an API or a fix and present it as fact.

## Workflow
UI is designed first in Claude Design, then handed back here for implementation. Don't write UI layout code ahead of the design.

## Deferred features (build later, owner's call)
Decision 2026-10-08: launch as a read-only site so people can read the work. No database, no forms, no API routes. The earlier code for these was deleted, so rebuild from this spec. All of them need Neon (`DATABASE_URL` in `.env.local`, never committed).

**Article reactions** ("Was this useful?")
- Sits at the end of each local article (`src/app/writing/[slug]/page.tsx`, after `<ArticleBody>`): 1px `--ink` top rule, "Was this useful?" in 15px muted, then three pill toggles: Useful / Learned something / Want a follow-up, each with a Geist Mono 13px count. Inactive: `--rule` border; active: `--ink` fill, `--bg` text. Min height 44px.
- Client island. One pick per reaction per browser, remembered in localStorage (`cb-reactions:<slug>`) via `useSyncExternalStore`, not setState in an effect (lint rule). Optimistic count update.
- Counts are stored server-side (Neon table keyed by post slug + reaction), fetched at build time and revalidated. Writes go through a POST route handler validated with Zod.

**Newsletter**
- Two placements: on `/writing`, a form in the hero's right column (label "New articles by email, about once a month", max 460px); and at the end of each article, a `--soft` box with Newsreader 26px heading "Get the next article by email", the line "About once a month. Production notes on payments, data and distributed systems. No spam.", then the form (input fill `--bg` inside the box).
- Form: pill email input + "Subscribe" button, both 48px. Browser email validation; disable the button while submitting; success text "Thanks. Check your inbox to confirm."; error text "Something went wrong. Try again or email me." in muted.
- Open decision: Neon-only storage vs a mailing service (e.g. Resend, Buttondown). The success copy promises a confirmation email, so storage alone isn't enough.

**View counts** (needed by the future dashboard): a tiny privacy-friendly beacon per page view, no third-party analytics script.

**Dashboard** (`/dashboard`): spec is `design_handoff_portfolio/changes/002-dashboard.md`; visual reference `designs/Dashboard.dc.html` (still to be supplied). Decisions 2026-10-08, which override the spec where they differ:
- Build every screen in full, Overview stats included. Stats come from one provider interface that returns "not connected" until reactions / newsletter / a view beacon exist; the UI shows empty states, never fake numbers. Posting articles and projects is the priority use today.
- Posts stay in `content/posts/` (the spec says `content/writing/`).
- Route protection goes in `src/proxy.ts` (Next 16 renamed middleware to Proxy).
- Ignore the spec's RSS mentions; RSS was removed.
- Deploy status polls the Vercel API with a token from env vars.

**How the dashboard is built** (keep these unless the owner says otherwise):
- Routes: `src/app/dashboard/layout.tsx` locks the area (session check + `noindex`); `(app)/` holds the screens with the sidebar; `preview/` is the bare page shown inside the editor's preview frame. Public pages live in `src/app/(site)/`.
- Three locks: Proxy (`src/proxy.ts`) returns 404 to anyone but the owner, the layout checks again, and every data function and Server Action calls `requireOwner()`.
- Dev bypass: when `pnpm dev` runs without `AUTH_SECRET`, the dashboard opens without sign-in. It can never apply in production.
- Content goes through one store (`src/lib/dashboard/store/`): GitHub when `GITHUB_TOKEN` is set, local files in dev otherwise. Publishing is one commit (blobs → tree → commit → move branch) with conflict checks.
- Images are uploaded as Git blobs one at a time, then referenced by the commit, so no request exceeds the 4 MB Server Action limit.
- Every dashboard page exports `instant = false` (private area, blocking is fine) and has a skeleton loading state.
- The editor preview uses the real `CaseStudyView` / `ArticleView` inside an iframe, so headline sizes match the pane width. The preview compiles MDX in the browser with `next-mdx-remote`.
- Save draft: commits `status: draft` for new or draft content; for published content it keeps the edits in this browser only, so the live page never disappears by accident.
- Drafts are skipped by the public build; invalid drafts never fail it.
- Site settings live in `content/site.json`, imported by `src/config/site.ts`.
- To test the dashboard in a browser, use a scripted Chrome (puppeteer-core). Command-line Chrome screenshots with `--virtual-time-budget` don't run the preview frame properly.

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

**After launch (owner, off-site)**
- [ ] Submit `https://<domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools
- [ ] Same name + one-line pitch on GitHub, LinkedIn and X, each linking back to the site; add the site to the GitHub profile README; externally hosted articles link back

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
