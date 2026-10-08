# Change 001: Home hero, portrait closer to the headline

**Problem:** on wide screens the hero used two equal grid columns with the photo right-aligned, so the portrait drifted to the far edge of the page, detached from the text.

**Scope:** the Home hero section only. Nothing else changes.

## Spec
- **Hero section:** use flex with wrap instead of the equal-column grid.
  - `display: flex; flex-wrap: wrap; align-items: center;`
  - `gap: clamp(40px, 6vw, 96px);`
  - `max-width: 1440px;` (keep the existing page gutter padding)
- **Text column:** `flex: 1 1 520px; max-width: 760px; min-width: 0;`
- **Photo column:** `flex: 0 1 380px; min-width: 0;`. Remove any `justify-content: flex-end` / `justify-self: end`.
- **Portrait:** `width: 100%; max-width: 380px; aspect-ratio: 4/5;`, down from 400px.
- **Vertical alignment:** the photo is now vertically centred with the text block (`align-items: center`), not bottom-aligned.

## Result
- **Desktop:** the photo sits roughly 96px to the right of the headline's widest line, not at the far right edge.
- **Mobile (< ~960px):** behaviour is unchanged. The photo wraps below the text and is full width up to 380px.

Reference: `designs/Home.dc.html` (updated).
