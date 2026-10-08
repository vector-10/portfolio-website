# Change 002: Private dashboard

**Scope:** new, owner-only area at `/dashboard`. It doesn't touch any public page.
**Reference:** `designs/Dashboard.dc.html`. Open it in a browser: every screen is clickable and the flows are simulated.
**Tokens:** same as the public site (`tokens.css`), plus one new token, `--field: #fbf9f5` for input backgrounds. Light theme only.

## Architecture (how it should work)
- **Auth:** GitHub OAuth (Auth.js). Allow exactly one GitHub username (env `DASHBOARD_ALLOWED_USER`). Protect `/dashboard/**` and `/api/dashboard/**` in middleware. Unauthenticated requests get a 404, not a login hint.
- **Rendering:** dashboard routes are dynamic (no SSG), excluded from the sitemap, `noindex`. None of the dashboard JS may load on public pages.
- **Source of truth:** MDX files in the repo. The dashboard reads and writes through the **GitHub API** (Octokit, contents/trees API), never the local filesystem.
  - Projects: `content/projects/<slug>.mdx`
  - Posts: `content/writing/<slug>.mdx`
  - Images: `public/images/{work,writing,site}/<file>`
  - Site settings: `content/site.json` (availability, note, email, résumé path)
- **Save draft:** commit the file to `main` with `status: draft`. The build skips drafts, so it deploys but stays hidden.
- **Publish:** commit with `status: published` in **one commit** containing the MDX plus any new images, using the Git trees API so it's atomic. Vercel deploys on push.
- **Deploy status:** poll the Vercel deployments API (or a webhook into KV) by commit SHA. Map it to Committed → Building → Live, or Failed.
- **Status "Changes"** (◐) means a file is published, but the editor holds unsaved or uncommitted edits. Keep the working copy in localStorage keyed by slug, and compare it with the file's last commit SHA.
- **Conflicts:** send the file's `sha` on every write. On a 409, show "This file changed on GitHub since you opened it. Reload / Overwrite."
- **Stats:** views and reactions from the analytics provider's API (Plausible or similar, or your own beacon + KV). Signups from the newsletter API. Cache for 5 minutes.
- **Validation:** use the same zod schema as the public build. Publish is **blocked** while any metric is missing value, unit, label, source, date or method. This is the core rule of the site.

## Layout
- **≥ 820px:** a 228px sticky sidebar plus a fluid main area.
  - Sidebar: name (Newsreader 19px) and "Dashboard · private" in mono 11px.
  - Nav buttons, 36px tall: Overview, Content (count), Media (count), Settings. The active one is `--ink` filled.
  - Bottom block: "● main · in sync", last deploy, "View live site ↗", "Sign out".
- **< 820px:** a top bar with "Dashboard", sync status and a Menu pill (44px). The menu expands to 48px nav rows.
- Main content max-width is 1280px (Settings 1080px), with padding `28px clamp(16px,3vw,40px)`.
- Page titles: Newsreader 34px/400, -0.02em.
- Base UI text: Geist 14px. Data and paths: Geist Mono 11–13px.
- Rules follow the public site: 1px `--ink` on top of lists, `--rule` between rows, square corners, pill buttons, no shadows.
- **Chips:** 32px tall, pill, `--rule` border. Active chips are `--ink` filled.
- **Inputs:** min-height 36px, `--field` background, 1px `--rule` border, square corners. On focus the border turns `--ink` with no outline glow. Labels are 12px muted, stacked 6px above the input.
- **Invalid field:** 1px **dashed** `--ink` border on a `--soft` background (there's no red; the system stays monochrome).

## Screens

### Overview
1. **Header row:** title, plus range chips for 7 / 30 / 90 days.
2. **Stat strip** (auto-fit, min 190px, `--ink` top rule). Each tile has a label in 12px muted, a value in Newsreader 40px and a note in mono 11px.
   - Views (+% vs previous period)
   - Newsletter signups (total subscribers)
   - Reactions (across N articles)
   - Live on site (drafts, plus how many have unpublished changes)
3. **Views over time:** a 1px `--rule` bordered box, with a bar chart 180px tall. Bars have a 2px gap, are `--muted` and turn `--ink` for annotated peaks. There's a 1px `--ink` baseline, start/mid/Today axis labels in mono, and a native tooltip per bar ("8 Oct: 412 views"). Use plain SVG or divs; no chart library is needed.
4. **Two columns** (auto-fit, min 440px):
   - **Top content:** the top 6 by views. Each row (44px min) has the title (ellipsis), mono type·path, Views and Reactions ("—" for projects). Clicking a row opens the editor.
   - **Recent deploys:** the last 5 commits. Each has a ✓/✕ glyph, the commit message, and mono `sha · when · note`.

### Content
- **Header:** "New post" (secondary) and "New project" (primary) buttons.
- **Filters:** type chips (All / Posts / Projects, with counts), a 1px divider, status chips (Any / Published / Changes / Draft), and a search box on the right.
- **Main column ≥ ~1000px wide (viewport ≥ 1240):** table rows. The header is mono 11px over a 1px `--ink` rule.
  - Columns: Title (flex, with the mono file path under it), Type 72px, Status 170px, Views 64px, Reactions 72px, Updated 84px.
  - Status glyphs: ● Published, ◐ Unpublished changes, ○ Draft.
- **Narrower:** stacked rows, with the title and then one mono line: `type · status · views · reactions · updated`.
- **Footer legend:** explains the three glyphs.
- The empty state reads "Nothing matches these filters."

### Editor (`/dashboard/edit/[type]/[slug]`)
One editor serves both types. Project-only sections are hidden for posts.

**Sticky top bar** (56px):
- "← Content" pill.
- The title, plus a mono status line: `Published · unsaved changes · content/projects/<slug>.mdx`.
- Save draft (secondary) and Publish… (primary) buttons.
- On mobile, an Edit / Preview segmented toggle sits before the buttons.

**Panes:**
- **≥ 820px:** two 50/50 panes, each scrolling independently (height `100vh - 57px`). The form is on the left with a `--rule` border on its right; the preview is on the right.
- **< 820px:** one pane at a time.

**Form sections** (max 760px wide, 32px gap). Each has a mono 11px label over a 1px `--ink` rule.
1. **Basics:**
   - Title, in Newsreader 20px.
   - Slug, with a mono prefix `/work/` or `/writing/`.
   - Outcome or description, with a character counter (warns at more than 160).
   - Project only: Kind, Category (Full product / Backend system), Role, Timeframe, Team, Stack (comma-separated), and a "Feature on Home" checkbox.
   - Post only: Tags and Date.
2. **Cover image:**
   - Once set: thumbnail, file name, dimensions/size and Remove.
   - Buttons: "Upload image" (dashed border) and "Choose from media", which opens an inline grid picker.
3. **Short version** (project): Problem, What I did, Result, labelled "plain language, for founders".
4. **Metrics** (project, `id="metrics"`): one bordered card per metric.
   - First row: Value, Unit, Source (select: Production / Benchmark), Date.
   - Then full-width Label ("what it means for the business") and Method ("how it was measured").
   - Each card has Remove, and there's an "+ Add metric" button (dashed).
   - The section header shows either "N incomplete · blocks publish" or "All complete", and missing fields use the invalid style.
5. **Links** (project): rows with a Label and a mono href, plus a × button and "+ Add link".
6. **Body · MDX:**
   - Word count and reading time (words ÷ 220) in the header.
   - An insert toolbar of mono chips: `## Heading`, `Code`, `Image`, `Metric`, `Decision`. They insert at the cursor.
   - A mono 13px/1.7 textarea, min 520px tall, with no spellcheck.

**Preview pane:**
- A sticky `--soft` strip: "Preview · /work/slug" on the left, "Live as you type" on the right.
- Below it, the page rendered with the **real public components** (import them; don't re-style). The prototype approximates this.
  - Project: eyebrow, H1, outcome, cover, the meta strip, the short version, metrics, the "Technical deep dive" band, then the body.
  - Post: tags · reading time, H1, description, then the body.
- Render the MDX with the same MDX components as the site: `@mdx-js/mdx` `evaluate` on the client, debounced 300ms.
- Unknown components show as a dashed box "‹Name› renders on the site".

### Publish dialog
A modal at `min(560px, 100%)` with a 1px `--ink` border on a scrim of `rgba(20,18,15,.45)`.

- **Confirm step:**
  - If validation fails, a dashed-border notice: "Can't publish yet", N missing fields, and a "Go to metrics" button that closes the dialog and scrolls to `#metrics`. The Commit button is disabled.
  - "Files in this commit": a mono list with A/M markers.
  - Commit message (mono, prefilled `Publish: <title>`).
  - Mono repo line `owner/repo · main → Vercel production deploy`.
  - Cancel / Commit and deploy buttons.
- **Progress step:** three rows.
  - Commit pushed to main (`sha · N files`).
  - Building on Vercel ("Usually 40–60 s").
  - Live (`/work/slug`).

  Glyphs are ✓ done, ◌ active, ○ pending, and pending rows sit at opacity .5. When it's live, show "View live ↗" and "Done". If the build fails, show ✕ on Building, a link to the Vercel logs, and a "Retry deploy" button.
- The status line returns to "in sync with main", and the commit appears in Recent deploys.

### Media
- **Header:** an Upload button (multi-file input).
- **Drop strip:** a dashed `--ink` box reading "Drop images anywhere on this page." on the left, and in mono on the right: "Committed to public/images/ on publish · converted to AVIF/WebP at build".
- **Filter chips:** All / Used / Unused, with counts.
- **Grid:** `auto-fill, minmax(160px, 1fr)`, 14px gap.
  - Each tile has a 4:3 thumbnail, the mono file name, `w×h · KB`, and flags (New · not committed / Used in N / Unused, Large over 500 KB, No alt text).
  - The selected tile gets a doubled `--ink` border.
- **Detail panel** (320px, sticky, 1px `--ink` border):
  - Thumbnail (contain), mono public path, dimensions and size.
  - Alt text field, which is **required** before Copy MDX works.
  - "Used in".
  - **Copy MDX** (primary): copies `<Figure src alt caption="" />`.
  - **Delete:** disabled while the image is in use, with a tooltip naming where.
- **Usage:** compute "Used in" by scanning MDX and `site.json` for the path at load.
- **Uploads:** compress client-side to max 2400px wide before staging. New files are staged until the next publish or save.

### Settings
Side-label sections (title and muted description on the left, content spanning 2 columns), separated by rules. "Save and publish" (top right) commits `content/site.json`.
1. **Site:**
   - "Available for new projects" switch (48×28 pill, `--ink` when on, `role="switch"`).
   - Availability note, which feeds the Home and Work-with-me eyebrows.
   - Contact email.
   - Résumé PDF row, with the file name and a Replace button.
2. **Repository:** mono key/value rows for Status, Repository, Branch, Content folders and Images folder, plus "Reconnect GitHub".
3. **Integrations:** Vercel, Newsletter provider (masked API key, "Replace key") and Analytics. Keys live in env vars, never in the repo.
4. **Access:** the allowed account, and active sessions with Sign out / Revoke.

## Feedback & states
- **Toast:** fixed bottom-centre on `--inv-bg`, 13px, auto-hides after 2.6s, `role="status"`. Used for:
  - Draft committed
  - Image added
  - Copied
  - Deleted
  - Settings committed
- **Loading:** skeleton rows in `--soft` rather than spinners.
- **Network or GitHub error:** an inline notice using the same dashed-border style as the publish blocker.
- **Leaving with unsaved edits:** `beforeunload` prompt. The working copy also persists in localStorage.

## Public-site impact
- Add `status` filtering to the content loader. Drafts are never rendered, listed, included in RSS or the sitemap.
- Read availability, note, email and résumé path from `content/site.json` instead of hard-coding them.
- The reactions API and view beacon from the original handoff feed the Overview stats.

## Acceptance checklist
- [ ] Only the allowed GitHub user can reach `/dashboard`; everyone else gets a 404.
- [ ] Publish creates exactly one commit with the MDX plus staged images, and the site is live within ~1 min.
- [ ] Publish is impossible while any metric field is empty, and the build also fails on it (defence in depth).
- [ ] Drafts commit but never appear on the public site.
- [ ] The preview matches the real page because it uses the same components.
- [ ] Editing works on a 375px phone using the Edit/Preview toggle, with touch targets ≥ 44px.
- [ ] No dashboard code ships in public page bundles.
