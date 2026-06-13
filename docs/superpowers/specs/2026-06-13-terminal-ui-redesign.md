# Terminal UI Redesign

## Goal

Retheme the back-of-the-envelope site with a terminal/hacker aesthetic: dark background, monospace chrome, green + amber accent palette. CSS-only approach — no component restructuring, no new files beyond updating `global.css` and `BaseLayout.astro`.

## Approach

CSS-only retheme (Approach A). All changes live in `src/styles/global.css` and `src/layouts/BaseLayout.astro`. Component markup (`CaseInteractive.tsx`, `index.astro`, `[slug].astro`) gets minimal targeted changes for terminal-specific copy and class additions. All 8 existing tests remain passing with no modifications.

## Color & Type Tokens

Replace all current custom properties with:

```css
--color-bg: #0d1117
--color-surface: #161b22
--color-border: #30363d
--color-border-muted: #21262d
--color-fg: #e6edf3
--color-muted: #8b949e
--color-green: #3fb950        /* hints, correct verdict, success states */
--color-amber: #d29922        /* submit button, active states, CTAs */
--color-red: #f85149          /* incorrect verdict */
--color-prompt: #58a6ff       /* $ glyph, back link, "try another" link */
--font-mono: 'Fira Mono', 'Cascadia Code', 'Courier New', monospace
--font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
--radius: 4px
```

Fira Mono loaded via one `<link>` in `BaseLayout.astro` (weights 400 + 700, Latin subset, ~25 KB).

Color semantics:
- Green = informational / success (hints revealed, correct answer)
- Amber = action / CTA (submit button, active badge border)
- Red = error / failure (incorrect answer verdict)
- Blue/prompt = navigation (back link, "try another" link)

## BaseLayout.astro

Add a single Google Fonts `<link>` preconnect + stylesheet in `<head>` before the existing CSS import. No other changes to layout structure.

## Index Page (`index.astro`)

Markup changes:
- Site header: `<span class="prompt">$</span>back-of-the-envelope` — adds the `$` prompt glyph before the title
- Case number prefix: each card gets `<span class="case-num">[001]</span>` derived from `entry.id` (slice the leading digits)
- Back link copy: unchanged

CSS changes (new/updated classes):
- `.site-header` — bottom border separator, monospace font
- `.site-title` — green color, tight letter-spacing
- `.prompt` — blue color for `$` glyph
- `.case-list` — replaces `.case-grid`; flex column, tighter gap
- `.case-card` — replaces `.card`; dark surface bg, `--color-surface` fill, green hover border
- `.case-num` — blue prompt color, fixed width
- `.case-card-top` / `.case-card-meta` — replace `.card-title` / `.card-meta`
- `.badge` base + `.badge-easy` / `.badge-medium` / `.badge-hard` — outlined style (border only, no fill); green/amber/red text + border
- `.tag` — dark chip (`--color-border-muted` bg)
- `.stats-bar` — small monospace row for future streak/completed counts; renders but values are static for now (deferred feature)

## Case Page (`[slug].astro`)

Markup changes:
- Back link: `← cd ..` instead of `← all cases`
- Case header: wrapped in `.case-header` panel (dark surface card)
- Case number prefix: `[001] networking` derived from `entry.id` + `category`

CSS changes:
- `.back-link` — blue, small monospace
- `.case-header` — surface bg, border, rounded, padding
- `.case-num-line` — blue, small
- `.case-title` — white, bold
- `.case-meta` — flex row of badge + tags
- `.scenario` — switches to `--font-body` (system font), slightly muted fg color `#c9d1d9` for comfortable long-form reading

## CaseInteractive Island (`CaseInteractive.tsx`)

Markup changes only (no logic changes, no new state):
- Hints section: each revealed hint wrapped in `.hint-output` (green left border, `> ` prefix via CSS)
- Hint button: class `hint-btn` (replaces `button` for the reveal button only)
- Answer row: adds `<span className="prompt-glyph">$</span>` before the label
- Submit button: keeps `.submit-btn` class (amber fill, uppercase, monospace)
- Verdict: `.verdict-correct` / `.verdict-incorrect` with `✓` / `✗` prefix via CSS `::before`
- Key values table: `.keyvalues` values (`<td>`) get green color
- "Try another" link: `→ try another case` copy, `.try-another` class (blue)

CSS changes:
- `.interactive` — same border-top separator, adjusted spacing
- `.hint-output` — dark surface, green left border (`border-left: 2px solid --color-green`), `> ` prefix via `::before`
- `.hint-btn` — outline style, green border + text, dark hover bg
- `.answer-row` — flex, monospace, `$` glyph in blue
- `.answer-input` — replaces `.input`; dark surface bg, amber focus border
- `.prompt-glyph` — blue
- `.submit-btn` — amber fill, dark text, uppercase, monospace
- `.verdict` — border-box style (background + border instead of just background)
- `.verdict-correct` — green border + tinted bg, `::before { content: '✓ ' }`
- `.verdict-incorrect` — red border + tinted bg, `::before { content: '✗ ' }`
- `.keyvalues td` — green color for values
- `.try-another` — blue, small, no underline

## Section Labels

A new `.section-label` class renders small uppercase monospace category headers above hints and the answer section:

```css
.section-label {
  font-size: 0.68rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.6rem;
}
.section-label::before { content: '# '; color: var(--color-border); }
```

Used before the hints block (`# hints`) and before the answer row (`# your answer`) in `CaseInteractive.tsx`.

## Files Changed

| File | Change |
|---|---|
| `src/styles/global.css` | Full rewrite of custom properties + all class rules |
| `src/layouts/BaseLayout.astro` | Add Google Fonts `<link>` in `<head>` |
| `src/pages/index.astro` | Add `.prompt` glyph, `.case-num` prefix, rename classes |
| `src/pages/cases/[slug].astro` | Back link copy, `.case-header` wrapper, case num prefix |
| `src/components/CaseInteractive.tsx` | Add `$` glyph, `.hint-output`, `.section-label`, rename classes, update copy |

## Not Changed

- `src/content.config.ts` — no schema changes
- `src/content/cases/*.md` — no content changes
- `vitest.config.ts`, `vitest.setup.ts` — no test config changes
- `src/components/CaseInteractive.test.tsx` — all 8 tests pass unchanged

## Success Criteria

- `npm run build` succeeds
- `npm test` passes (all 8 tests, no modifications)
- Index page: dark background, `$` glyph title, `[001]`/`[002]` card prefixes, outlined difficulty badges, dark chip tags
- Case page: dark surface header card, `← cd ..` back link, system-font scenario body
- Interactive island: `$` prompt before answer input, green-bordered hint outputs, amber submit button, green ✓ / red ✗ verdict boxes, green key values
- Fira Mono loads correctly for all chrome elements
