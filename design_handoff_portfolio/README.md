# Handoff: Chukwuduzie Blaise — Portfolio & Engineering Journal (public site)

## Overview
A personal portfolio and technical blog for a T-shaped software engineer who freelances. It serves two audiences on one site:

- **Founders / CTOs hiring on proof of work.** They skim, judge clarity and outcomes, and want to know price and process.
- **Principal engineers / tech leads at fintech teams.** They judge system-design depth and the credibility of numbers.

The core principle is **layered depth**. Every page leads with plain-language outcomes for founders, and technical depth follows below for engineers. Never mix the two registers in one paragraph.

Scope of this handoff: the 7 public pages. The private dashboard (content list, MDX editor, publish, stats) is **not designed yet** and will come as a separate handoff.

## About the design files
The files in `designs/` are **design references built in HTML**. They are prototypes showing the intended look, copy and behaviour, not production code. Rebuild them in the target stack:

- **Next.js (App Router) + TypeScript**, statically generated (SSG) for every public page
- Content in **MDX** files (or a CMS later). See *Content model*.
- Use Tailwind or CSS Modules, whichever you prefer. The tokens below map directly to CSS custom properties.

To view a design, open any `.dc.html` file in a browser (keep `support.js` and `image-slot.js` beside it). `.dc.html` files use a small template runtime. Ignore `{{ }}`, `<sc-for>` and `<sc-if>` syntax, and read the inline styles and the data arrays in each file's `<script>` class for the exact copy and values.

## Fidelity
**High-fidelity.** Colours, type, spacing, copy and interactions are final. Recreate them pixel-accurately. All *content* (projects, metrics, prices, quotes, bio, experience, email) is **placeholder** and must come from the content files.

## Non-negotiable performance requirements
Readers are often on mobile over slow cellular connections.

- Static HTML for all public pages. Ship **zero JS by default**. Only these need client JS: theme toggle, mobile menu, testimonial arrows, writing/work filters, article reactions, newsletter form. Make each a small client island.
- Budget: **< 100 KB** transferred for first load on Home excluding images; LCP < 1.5 s on a 4G profile.
- Fonts: self-host via `next/font` (Newsreader, Geist, Geist Mono), subset Latin, `display: swap`. Load Newsreader in weights 400/500 and italic 400 only; Geist 400/500/600; Geist Mono 400/500.
- Images: `next/image`, AVIF/WebP, explicit width/height, lazy below the fold. Portrait on Home is the only above-the-fold image and should be `priority`.
- Diagrams are **inline HTML/SVG**, never raster.
- Code highlighting at build time (Shiki), no client highlighter.
- No analytics script on the client except a tiny privacy-friendly beacon (needed later for the dashboard's view counts).
- Avoid a flash of the wrong theme: an inline `<script>` in `<head>` reads `localStorage['cb-theme']`, or falls back to `prefers-color-scheme`, and sets `data-theme` on `<html>` before paint.

## Design tokens

### Colour (CSS custom properties)
| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f4f1ea` | `#12110e` | Page background (warm paper / warm near-black) |
| `--ink` | `#14120f` | `#f1ede4` | Primary text, strong rules, primary button fill |
| `--muted` | `#5b564d` | `#a59f93` | Secondary text, meta, mono labels |
| `--rule` | `#d9d3c7` | `#2d2a24` | Hairline dividers, inactive borders |
| `--soft` | `#ebe7de` | `#1c1a16` | Hover fill, inline code bg, newsletter box, image placeholder stripes |
| `--inv-bg` | `#14120f` | `#f1ede4` | Inverted bands (pricing, deep-dive divider, closing CTA + footer, code blocks) |
| `--inv-ink` | `#f4f1ea` | `#12110e` | Text on inverted bands |

Inside inverted bands, the subtle divider is `color-mix(in oklab, var(--inv-ink) 22%, transparent)`, and secondary text is `opacity: 0.75–0.85`.
There is **no accent colour**. The palette is monochrome and high-contrast by design.

Theme is set by `data-theme="light|dark"` on the root. Use one 0.2 s `background, color` transition on the root only.

### Typography
| Role | Family | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Display H1 (Home hero) | Newsreader | `clamp(46px, 7.2vw, 112px)` | 400 | 0.98 | -0.035em |
| Page H1 (Work, Writing) | Newsreader | `clamp(56px, 8vw, 120px)` | 400 | 0.95 | -0.04em |
| Page H1 (Case study, Work with me) | Newsreader | `clamp(44px, 6.4vw, 96px)` / `clamp(46px,7vw,108px)` | 400 | 1 / 0.98 | -0.035em |
| Article H1 | Newsreader | `clamp(40px, 5.6vw, 80px)` | 400 | 1.02 | -0.03em |
| About H1 | Newsreader | `clamp(36px, 4.4vw, 60px)` | 400 | 1.05 | -0.03em |
| Section H2 | Newsreader | `clamp(32px, 4vw, 56px)` (side-label variant `clamp(32px,3.6vw,48px)`) | 400 | 1.05 | -0.025em |
| Closing CTA H2 | Newsreader | `clamp(44px, 6.4vw, 96px)` (Home) / `clamp(36px, 4.6vw, 64px)` (others) | 400 | 1–1.02 | -0.03em |
| Item title (project, tier) | Newsreader | `clamp(30px, 3.2vw, 44px)` | 400 | 1.05 | -0.02em |
| List title (article row) | Newsreader | `clamp(21px, 2vw, 28px)` | 400 | 1.2–1.25 | -0.01em |
| Metric value | Newsreader | `clamp(44px, 4.6vw, 64px)`; unit at `0.42em` in `--muted` | 400 | 1 | -0.03em |
| Quote | Newsreader | `clamp(24px, 2.4vw, 32px)` | 400 | 1.3 | -0.01em |
| Lede / intro | Geist | `clamp(17px, 1.5vw, 20px)` in `--muted` | 400 | 1.55 | 0 |
| Body | Geist | 17px (18px in article / case-study prose) | 400 | 1.55–1.7 | 0 |
| Small / meta | Geist | 14–16px | 400–500 | — | 0 |
| Mono label / metric context | Geist Mono | 12–13px in `--muted` | 400 | 1.6 | 0.02em on eyebrow |
| Code block | Geist Mono | 13–14px | 400 | 1.7 | 0 |

Use `text-wrap: balance` on headlines and `text-wrap: pretty` on paragraphs.

### Spacing & layout
- Page gutter: `padding-inline: clamp(20px, 5vw, 72px)`. Content is full-width with no centred max container; individual text blocks cap at 560–820px.
- Section vertical padding: `clamp(56px, 8vw, 112px)` (hero `clamp(56px, 9vw, 128px)` top).
- Common gaps: 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80px.
- Grids use `repeat(auto-fit, minmax(min(100%, Npx), 1fr))` so they collapse to one column on mobile with no media queries. N is 240 for metrics, 260 for side-label sections, 300–420 for others.
- **Side-label section pattern** (Case study deep-dive, About, Work with me, Writing year groups): left column holds a label or H2, right content spans 2 columns (`grid-column: span 2`), and everything stacks on mobile.

### Borders, radius, shadow
- Lists start with a `1px solid var(--ink)` top rule. Rows are separated by `1px solid var(--rule)`.
- Radius: pills (buttons, chips, inputs) `999px`. Everything else is **square (0)**.
- **No shadows anywhere.**

### Buttons & controls
- Primary: `--ink` fill, `--bg` text, `14px 24px` padding, min-height 48px, pill, weight 500.
- Secondary: 1px `--ink` border, transparent.
- Header résumé link: 1px `--ink` border, `6px 14px`, pill, with "Résumé ↓".
- Theme toggle: 1px `--rule` border, 13px, label shows the *target* mode ("Dark" / "Light").
- Filter chips: min-height 40px, `0 16px`, pill. Inactive: `--rule` border, transparent. Active: `--ink` fill and `--bg` text.
- Round icon buttons (testimonial arrows): 48×48, 1px `--ink` border, `←` / `→`.
- Links: inherit colour, no underline; hover underline with `text-underline-offset: 4px`. Active nav item is underlined.
- All touch targets ≥ 44px on mobile.

## Shared components

### Header (all pages)
- Left: name in Newsreader 22px/500, linking to Home.
- **≥ 820px:** a nav row with Work · Writing · About · Work with me, then the Résumé pill and theme toggle. The current section is underlined. Work is active on Work and Case study; Writing is active on Writing and Article.
- **< 820px:** a "Menu" pill button (44px min-height) toggles a full-width panel below the header. The panel holds the same links in Newsreader 30px with rule dividers, then the Résumé pill and a "Dark mode / Light mode" button. The button label changes to "Close" while open, with `aria-expanded`. Implement the breakpoint with CSS media queries (the prototype uses JS only because of its inline-style constraint).
- Bottom border: 1px `--rule`.

### MetricWithContext (the site's signature component)
Every number on the site carries its provenance. Fields:
```ts
type Metric = {
  value: string;        // "0.6", "14k", "₦2.4B"
  unit: string;         // "%", "events/s", "/mo"
  label: string;        // plain-language meaning, for founders
  source: 'Production' | 'Benchmark';
  date: string;         // "Jan – Mar 2026"
  method: string;       // "90-day rolling, failed ÷ attempted"
};
```
Render the value large in Newsreader with the unit smaller and muted, the label in 16px Geist, and the context in Geist Mono 12px muted. On the Case study, the source is a small outlined tag (`1px solid --muted`, radius 3px, `0 6px`). On Home, the context is a single line (`Production · method · date`). Display metrics in a grid with a 1px `--ink` top rule and `--rule` bottoms.

### Closing band + footer (all pages)
A single `--inv-bg` block.
- CTA section: H2, then the email as a large Newsreader link with a 2px bottom border.
- Footer below it, with a subtle top divider: "© 2026 Chukwuduzie Blaise" on the left, and GitHub · LinkedIn · Résumé (PDF) · RSS on the right, at 14px and opacity 0.8.
- The headline varies per page: Home/Writing/Work/About use "Building something? Tell me about it.", Article uses "Dealing with something like this?", and Case study uses "Need payments that hold up?" (derive it from the project category).

### Image placeholders
In the prototypes, `<image-slot>` stands in for real images. Replace with `next/image`:
- Home portrait 4:5, max 400px wide; About photo 4:5, max 240px
- Project screenshots 16:10
- Article figures 16:9 with caption (14px muted)
- Testimonial avatars 44px circle
- Logos: 120×32 monochrome SVGs in `--muted` or `--ink`

## Screens

### 1. Home (`/`) — `Home.dc.html`
Founder-first sales page. Sections in order:
1. **Hero:** a two-column auto-fit grid (min 420px), bottom-aligned. Left column:
   - Mono eyebrow "Software engineer · Problem solver · Available for new projects"
   - H1 "I build full products, with the backend done right."
   - Lede "Web apps and APIs end to end, from interface to infrastructure. My depth is the hard part: payments, data and scale."
   - Buttons: Email me (mailto, primary) and See the work (secondary)

   Right column: the portrait.
2. **Logo strip:** top and bottom `--rule` borders. "Trusted by teams at" in 14px muted, then wrapping logos.
3. **Results in production:** H2, a right-hand note "Every number states how it was measured, where and when.", then 4 MetricWithContext cells.
4. **Selected work** (`#work`): H2 with an "All projects →" link to `/work`. Three project rows, each a two-column grid (min 380px):
   - Text column: mono `01 · Product · SaaS`, Newsreader title, role · time, outcome paragraph 18–20px, mono metric line, then "Read case study →" and "Live site ↗" in muted.
   - Image column: the 16:10 screenshot.

   Order the rows as one full-product project first, then backend-depth projects.
5. **Work with me teaser** (`#hire`, `--inv-bg`):
   - H2 "Work with me", with a note on the right: "Not sure which fits? Email me what you're building and I'll tell you honestly."
   - Two rows linking to `/work-with-me`, each with the name and a one-line description on the left, and the price with its unit/time on the right. Product build: $3k – $5k · Per project · 4 – 8 weeks. Embedded engineer: $2.5k · Per month · contract.
   - Link "What's included and how it works →". This section can be hidden with a config flag.
6. **What clients say:** H2 with ← → round buttons on the right.
   - A horizontal scroll-snap row (`scroll-snap-type: x mandatory`, hidden scrollbar, touch-scrollable) that bleeds to the page edges, with `scroll-padding` equal to the gutter.
   - Cards are `flex: 0 0 min(86%, 480px)`, each with a 1px `--ink` top rule, the quote in Newsreader, and an avatar, name and title.
   - The arrows `scrollBy` one card width + gap, smoothly.
   - New testimonials are just new data entries.
7. **Writing:** H2 with an "All articles →" link, then 3 rows, each with the title in Newsreader, a one-line description in muted, and mono meta on the right ("Sep 2026 · 14 min").
8. **Closing band + footer**, using the large CTA H2 variant and the copy "I reply within one working day. Send a few lines on what you're building and where it hurts."

### 2. Work (`/work`) — `Work.dc.html`
- H1 "Work" and a lede.
- Filter chips: All / Full products / Backend systems. They filter client-side, or render as static tabs with `?type=`.
- The full project list uses the same row component as Home, adding a stack line in 14px muted.
- Closing band.

### 3. Case study (`/work/[slug]`) — `Case Study.dc.html`
An inverted pyramid: top half for founders, deep dive for engineers.
1. "← All work", a mono eyebrow, H1 (project title), an outcome line at 19–24px, then a meta grid (min 180px) with a 1px `--ink` top rule: Role, Timeframe, Team, Stack, Links.
2. **The short version:** 3 columns (Problem / What I did / Result), each with a Newsreader 30px head and 18px text.
3. **Metrics:** 4 MetricWithContext cells with the source tag.
4. **"Technical deep dive" divider:** a full-width `--inv-bg` band with the H2 on the left and the note "For engineers: constraints, architecture, trade-offs and what I'd do differently." on the right.
5. Deep-dive sections, each in the side-label pattern with a mono label (`01 · Context and constraints`) and `--rule` bottoms:
   - **Context and constraints:** a paragraph plus a key/value list (`minmax(0,160px) 1fr`).
   - **Architecture:** a diagram figure with a 1px `--ink` border, in Geist Mono 13px. Boxes are 1px `--ink` with a 10×14 padding and a muted sub-label at 11px. The primary store box has a `--soft` fill, external providers have dashed borders, and arrows are text in muted. Below it: a caption, then a numbered walkthrough. In production, author diagrams as inline SVG or MDX components that keep this exact look and wrap on mobile.
   - **Decisions and trade-offs:** for each decision, a Newsreader title, then Chose / Rejected side by side (mono labels), then a muted "why" paragraph. Optional code block (`--inv-bg`, mono 13px, horizontal scroll).
   - **What went wrong:** prose.
   - **Results:** a table with Measure / Before (muted) / After (500 weight) / Source (mono 12px muted). It has a 1px `--ink` header rule and horizontally scrolls on mobile (min-width 480px).
6. Closing band with the CTA on the left and "Next case study →" on the right (mono label + Newsreader title, 1px top rule).

### 4. Writing (`/writing`) — `Writing.dc.html`
- Hero grid with H1 "Writing" and a lede on the left, and the newsletter form on the right (label, email input, Subscribe button).
- Tag chips: All, Payments, Distributed systems, Data, Postgres, Product.
- Posts grouped by year, using the side-label pattern with the year in Newsreader 32px. Each row is a link with the title, mono meta (date · read time), a description and a mono tag.
- **Talks and elsewhere:** external links with "↗" and mono meta (`Talk · Event · Date`).
- Closing band.

### 5. Article (`/writing/[slug]`) — `Article.dc.html`
- Header block (max 1100px): "← All writing", mono tags, H1, a dek at 19–23px muted, and mono meta (date · read time · updated) above a top rule.
- Body is a flex-wrap row. The **sticky ToC** aside (220px, `top: 24px`) is auto-generated from H2s. The article column is max 720px with 18px/1.7 prose.
  - H2 in Newsreader `clamp(28px,3vw,36px)` with a 24px top margin
  - Inline code in mono 0.88em on `--soft` with `2px 6px` padding
  - Code blocks on `--inv-bg`
  - Tables matching the case-study table
  - Figures with captions
  - Lists with 22px indent and 10px gap
- **Reactions:** "Was this useful?" with 3 pill toggles (Useful / Learned something / Want a follow-up), each showing a mono count. Active state is `--ink` fill. The prototype stores picks in localStorage; production needs an API (see State).
- **Newsletter box:** `--soft` background, Newsreader 26px heading "Get the next article by email", a description, the form, and success text "Thanks. Check your inbox to confirm."
- Previous / Next articles in two columns (Next is right-aligned).
- Closing band.

### 6. About (`/about`) — `About.dc.html`
Deliberately unlike Home: editorial, no hero buttons.
- Side-label intro: a small 4:5 photo (max 240px) and mono location on the left, and an article column (max 680px) on the right. The column holds a mono "About", the H1, a first paragraph in Newsreader 20–24px, then 18px/1.7 Geist paragraphs, with a link to the journal at the end.
- **Where I go deep:** specialty rows (Newsreader 24px name with a muted description).
- **What I work with:** key/value rows by area (Languages, Backend, Frontend, Data, Messaging, Infrastructure).
- **Experience:** rows with company, role and mono dates on the left and one outcome sentence on the right, plus a "Full résumé (PDF) ↓" link under the H2.
- Closing band with the CTA and a contact link list on the right (GitHub ↗, LinkedIn ↗, Résumé ↓).

### 7. Work with me (`/work-with-me`) — `Work With Me.dc.html`
Founder-facing.
1. **Hero:** mono availability eyebrow, H1 "You bring the problem. I'll ship the product.", lede, then buttons "Email me about a project" (mailto with subject) and "See pricing" (anchor).
2. **Sound familiar?:** 4 problem/answer cells (Newsreader 24px question, muted answer).
3. **Two ways to work together** (`#options`, `--inv-bg`): each tier is a 3-column row with name, description and price on the left, "Included" in the middle and "Good fit if" on the right, plus "Email about this →". There's a note: "Prices in USD. Final quote after a short call…".
4. **How it works:** 4 numbered steps (Newsreader 32px number, title, mono timing on the right, description).
5. **Questions founders ask:** a native `<details>`/`<summary>` accordion with an 18px/500 question, a "+" marker and a muted answer. Hide the default marker.
6. Closing band with the CTA on the left and a "Helpful to include" checklist on the right.

## Interactions & behaviour
- **Theme:** toggle on every page, persisted to `localStorage['cb-theme']`, defaulting to the OS preference. Set it before paint (see Performance).
- **Mobile menu:** below 820px. Closes on link tap and on Escape.
- **Testimonials:** native horizontal scroll plus arrow buttons. No autoplay.
- **Filters** (Work, Writing): instant client-side filtering. With JS disabled, all items show.
- **Reactions:** toggle per reader, optimistic count update. Deduplicate per browser (localStorage) and store counts server-side.
- **Newsletter:** HTML5 email validation, then POST to the newsletter provider. Show success text inline; on error show "Something went wrong. Try again or email me." in muted. Disable the button while submitting.
- **Hover:** links underline, and project rows have no hover background. No other animation.
- **Reduced motion:** disable smooth scroll and the theme transition under `prefers-reduced-motion`.

## State management
Public pages are static. The only client state:
- `theme: 'light' | 'dark'`
- `menuOpen: boolean`
- `filter` / `tag: string` on the Work and Writing lists
- `reactions: Record<reactionId, boolean>` per article, plus counts fetched at build time and revalidated
- `newsletter: 'idle' | 'submitting' | 'success' | 'error'`

## Content model (MDX frontmatter)
These types also feed the future dashboard.
```ts
type Project = {
  slug: string; title: string; kind: string;            // "Fintech · Payments"
  type: 'Product' | 'Systems';
  outcome: string;                                      // plain-language, 1–2 sentences
  role: string; timeframe: string; team?: string;
  stack: string[];
  links: { label: string; href: string }[];             // Live, Repo, Write-up…
  metrics: Metric[];                                    // see MetricWithContext
  headlineMetric: string;                               // mono line on list rows
  summary: { problem: string; did: string; result: string };
  results?: { measure: string; before: string; after: string; source: string }[];
  cover?: string; featured?: boolean; order?: number;
  status: 'draft' | 'published';
};
type Post = {
  slug: string; title: string; description: string; tags: string[];
  date: string; updated?: string; readingTime: number;  // computed at build
  status: 'draft' | 'published';
};
```
Deep-dive sections, diagrams and code live in the MDX body. Provide MDX components for `<Metric>`, `<Diagram>`/`<Box>`/`<Arrow>`, `<Decision chose rejected>`, `<Figure caption>` and tables.

## SEO / sharing
Per-page `<title>` and description. Open Graph images generated at build time (`next/og`) with the page title in Newsreader on `--bg`. RSS feed at `/rss.xml`. Sitemap. A 404 page in the same style (H1 "Not found" with a link home).

## Assets
No icons or illustrations; arrows are text glyphs (→ ↗ ↓ ← +). Fonts: Newsreader, Geist and Geist Mono (Google Fonts / Vercel, OFL). Photos, screenshots, logos and avatars are still to be supplied.

## Build plan (suggested order)
1. Next.js App Router + TS scaffold. Add `tokens.css` to globals, load fonts with `next/font`, and add the no-flash theme script.
2. Shared layout: Header (desktop nav + mobile menu), ClosingBand + Footer, ThemeToggle.
3. Content layer: MDX loading with typed frontmatter (validate with zod; fail the build on missing metric fields), reading time, Shiki.
4. Components: MetricWithContext, ProjectRow, ArticleRow, Chip filters, SideLabelSection, TestimonialRow, NewsletterForm, Reactions, plus the MDX components (Section, KeyValues, Diagram/Row/Box/Arrow, Decision, Figure, tables).
5. Pages in this order: Case study → Home → Work → Writing → Article → Work with me → About → 404.
6. RSS, sitemap, OG images, metadata.
7. Performance pass against the budget (Lighthouse mobile, throttled 4G).

## Acceptance checklist
- [ ] Each page matches its screenshot at 1440px in both themes.
- [ ] At 375px nothing overflows horizontally except the testimonial row and wide tables, which scroll on purpose. Every grid collapses to one column. The menu button appears below 820px.
- [ ] Touch targets are ≥ 44px. Text contrast is ≥ 4.5:1 in both themes.
- [ ] Theme persists across pages with no flash on load.
- [ ] Every metric renders its value, unit, label, source, date and method, and the build fails if any is missing.
- [ ] Public pages work with JS disabled (filters show everything, the FAQ still opens, links work).
- [ ] Home first load is < 100 KB excluding images; Lighthouse mobile performance is ≥ 95.
- [ ] Code blocks and tables scroll horizontally inside their container on mobile.
- [ ] Keyboard: visible focus ring (2px `--ink` outline, 2px offset), the menu closes on Escape, and the accordion works with the keyboard.

## Screenshots
These are in `screenshots/`, taken at 1485px wide, light theme unless noted. They're the visual source of truth where the README and the HTML disagree.
- `01-home.png`, `02-work.png`, `03-case-study.png`, `04-writing.png`, `05-article.png`, `06-about.png`, `07-work-with-me.png`
- `08-home-dark.png`: dark theme. Inverted bands flip to light in dark mode on purpose.

The grey striped boxes are image placeholders, not part of the design.

## Extra files
- `tokens.css`: all tokens as CSS custom properties, ready for `globals.css`.
- `content-examples/projects/payout-orchestration.mdx`: full project frontmatter and an MDX body showing the case-study components.
- `content-examples/writing/idempotency-keys-are-not-enough.mdx`: post frontmatter and body with a figure, code and a table.

## Files
`designs/`:
- `Home.dc.html` — `/`
- `Work.dc.html` — `/work`
- `Case Study.dc.html` — `/work/[slug]`
- `Writing.dc.html` — `/writing`
- `Article.dc.html` — `/writing/[slug]`
- `About.dc.html` — `/about`
- `Work With Me.dc.html` — `/work-with-me`
- `support.js`, `image-slot.js` — prototype runtime only, so the files open in a browser. Do not port.
