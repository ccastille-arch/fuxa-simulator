# SC Brand Revamp — Handoff Notes

**Branch:** `claude/eloquent-sanderson`
**Target deploy:** `welllogicsim-dev-production.up.railway.app`
**Date:** 2026-04-16

## What changed

### Design token layer
- `tailwind.config.ts` — full SC palette (`sc-navy`, `sc-red`, `sc-cyan`, neutrals), Montserrat font stack, SC typography scale preserved at exact px values from the extraction, SC spacing scale, SC shadows. **Legacy `fuxa-*` colors are intentionally retained** because the simulator-native HMI SVGs reference them directly and the brand guidance explicitly marks the operator canvas as simulator-native.
- `app/globals.css` — Montserrat via Google Fonts, SC CSS variables, reusable primitives (`.sc-eyebrow`, `.sc-rule`, `.sc-headline`, `.sc-nav-link`, `.sc-btn-primary`, `.sc-btn-ghost`, `.sc-card`, `.sc-pill`, `.sc-pulse`, `.sc-container`, `.sc-section`), accessible focus ring, `prefers-reduced-motion` respect, SC-themed scrollbar.

### Shell components (new)
- `components/brand/SCLogo.tsx` — typographic wordmark with bolt glyph; `useImage` prop flips to the real SVG once Slant's `service-compression-logo.svg` is dropped in `/public/brand/`. No trademarked artwork is fabricated.
- `components/brand/SCHeader.tsx` — sticky navy nav, uppercase Montserrat 600 links at 2px tracking, 2px red underline on active route, mobile hamburger (inline SVG matching the brand kit's exact path), configurable `links` + `statusBadge`.
- `components/brand/SCFooter.tsx` — red hex-pattern ribbon + tri-column navy info grid + copyright baseline. Responsive (2-col @ 900px, 1-col @ 600px).
- `components/brand/SCSection.tsx` — canonical `eyebrow → red rule → headline → lede` stacking primitive seen on every SC/FieldTune page section.

### Page surfaces
- `app/layout.tsx` — SC metadata (title template, OG, theme color `#05233E`), robots noindex while in internal review.
- `app/page.tsx` — SC-branded landing: hero with radial navy vignette + cyan hex grid + red conic accent, project card grid, live analytics block (`SCSection` framed), capability strip, SC footer.
- `app/wellhead-v1/page.tsx` — SC chrome (header, sub-status band with SubStat chips, SC tab bar) wrapping the unchanged 1024×700 operator canvas. **Added real Pause + Reset controls** that actually rewind simulation state (addresses the Phase 1 credibility bug from the meeting notes), plus `min-width: 1024` on the HMI wrapper to fix the Safari/Chrome left-clipping issue.

### Simulator-native components (chrome-only edits)
- `components/OverviewScreen.tsx` — **not touched**. The 1024×700 SVG canvas is deliberately kept at the Altronic/Murphy HMI look operators expect.
- `components/WellheadDataScreen.tsx` — header strip repainted to SC (navy gradient, red accent bar, Montserrat eyebrow, SC-styled nav buttons). The interior data table is untouched.
- `components/SettingsScreen.tsx` — same treatment; header only.
- `components/AnalyticsDashboard.tsx` — full SC palette repaint (cyan/white lines, red only for alarm states, navy tooltip surfaces, Montserrat throughout). Chart types preserved so the signal is unchanged.

### Assets
- `public/brand/README.md` — explains which authoritative SVGs to drop in.
- `public/brand/sc-pattern-red.svg` — placeholder red hex/bolt overlay; functional fallback until Slant delivers the real one.

## What still needs real SC assets

| Asset | Consumer | Action |
|---|---|---|
| `service-compression-logo.svg` | `SCLogo` | Export from SC site or request from Slant; drop in `/public/brand/`; flip `useImage` prop on header/footer |
| `field_tune-logo.svg`          | `SCLogo variant="fieldtune"` | Same |
| `sc-pattern-red.svg` (real)    | Footer ribbon, `.sc-pattern-red` utility | Same — placeholder is passable but not canonical |
| `Refinery75SemiBold` webfont    | Sub-brand surfaces (FieldTune / Ask Ricky) | Not currently consumed — add an `@font-face` in `globals.css` if/when a FieldTune page is introduced |
| Real SC field photography (`.webp`) | Hero, project cards | Currently using a pure-CSS hero (brand-safe). Swap to `<Image>` with real SC photos when licensed copies are available |
| Vimeo embeds                   | Optional explainer slot | Not embedded (would require hardcoding IDs — deferred to user) |

## What I intentionally did NOT do

- **Did not retheme the 1024×700 operator SVGs** (Overview canvas). The brand guidance explicitly says the technical canvas stays simulator-native; operators and foremen need the existing HMI read.
- **Did not fabricate the Slant or SC trademarked logos.** Used a safe typographic placeholder until the real SVGs are supplied.
- **Did not remove `public/index.html`** (the legacy standalone simulator). Leaving it in case it's still linked externally; it's served at `/index.html` alongside the Next app.
- **Did not change `lib/simulator.ts`.** The control logic is the product; brand is the shell.
- **Did not touch `vercel.json`.** It's dead config for the Railway deploy target but not harmful.

## Known residual items from the master prompt's Phase 1 roadmap

| Issue | Status in this PR | Next step |
|---|---|---|
| Reset rewinds state, not just narration | **Fixed** in `app/wellhead-v1/page.tsx` (real `Reset` button calls `initState()`) | Expand test coverage once simulator gets a narration subsystem |
| Playback / narration sync | Not in scope — no narration module in this codebase yet | Implement when narration is added; keep tick source as single clock |
| Safari/Chrome clipping | **Fixed** — `min-width: 1024px` on HMI wrapper + `overflowX: auto` on the container | Monitor at ≤ 1024px viewports |
| Runtime/history label consistency | Not in scope here (analytics labels already match source units: MSCFD) | Audit when historian/trend module lands |

## Visual QA checklist (run before internal review)

- [ ] Navbar is sticky, navy `#05233E`, uppercase links 2px tracking
- [ ] Active route shows 2px red underline under its nav link
- [ ] Hero hex-grid + conic red accent render without layout shift
- [ ] `Launch Simulator` CTA is SC red, squared corners (border-radius 2px)
- [ ] Project card hover: border flips to SC red, -2px Y translate
- [ ] Analytics charts: cyan primary lines, white secondary, no green
- [ ] `/wellhead-v1` header shows the SC sub-status band with Priority / Suct Hdr / Alarms / Clock / Pause / Reset
- [ ] Reset button actually rewinds simulation state (not just text)
- [ ] Operator 1024×700 canvas is **unchanged** visually (intentionally)
- [ ] Footer: red ribbon on top, navy tri-column below, cyan column titles
- [ ] Focus rings visible, keyboard nav traversable on all CTAs
