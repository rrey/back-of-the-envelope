# v1 Site Design — back-of-the-envelope

## Goal

Ship the smallest version of the site that lets a user open an exercise, read the scenario, reveal hints progressively, submit a numeric answer, and see whether it falls within the case's tolerance — along with the explanation and reference numbers.

No filters, no stats, no persistence, no deploy automation. Those come in later iterations.

## Stack

- **Astro** with content collections (Zod-validated frontmatter)
- **One React island** for the per-case interactive widget (`client:load`)
- **TypeScript** (Astro default)
- **Plain CSS** in a single global stylesheet — no Tailwind, no CSS modules
- **Node** via `mise.toml` (already pinned to LTS)

No backend. Build output is fully static.

## File layout

```
back-of-the-envelope/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── mise.toml                        ← already exists
├── public/                          ← favicon, static assets
├── src/
│   ├── content/
│   │   ├── config.ts                ← Zod schema for the cases collection
│   │   └── cases/
│   │       ├── 001-requests-per-server.md
│   │       └── 002-log-storage.md
│   ├── components/
│   │   └── CaseInteractive.tsx      ← the only React island
│   ├── layouts/
│   │   └── BaseLayout.astro         ← <html>, <head>, global CSS import
│   ├── pages/
│   │   ├── index.astro              ← lists all cases
│   │   └── cases/
│   │       └── [slug].astro         ← dynamic route, one per case
│   └── styles/
│       └── global.css
└── CLAUDE.md, project.md            ← already exist
```

## Content schema

Each case is a markdown file in `src/content/cases/`. Frontmatter is validated at build time by `src/content/config.ts` (Zod):

```ts
{
  title: string,
  difficulty: 'easy' | 'medium' | 'hard',
  category: string,
  tags: string[],
  hints: string[],
  answer: {
    value: number,
    unit: string,
    tolerance: number,        // e.g. 0.5 = accept within ±50%
  },
  explanation: string,
  keyValues: { label: string, value: string }[],
}
```

The markdown **body** is the scenario narrative. It's rendered by Astro (`<Content />`), not by React. Everything else (hints, answer, explanation, keyValues) lives in frontmatter and is passed as props to the React island.

A malformed frontmatter fails `astro build` — so CI catches bad content before merge.

## Pages

### `pages/index.astro`
Lists every case in the collection. Each entry is a card that shows:
- title
- difficulty badge (easy / medium / hard)
- category

Each card links to `/cases/<slug>`. The slug is the markdown filename without `.md`. Pure static — no JS shipped to the browser for this page.

### `pages/cases/[slug].astro`
Uses `getStaticPaths()` over `getCollection('cases')` to pre-render one page per case. The page renders:
- Title, difficulty badge, category, tags (static, server-rendered)
- Scenario body via `<Content />` (static)
- A single `<CaseInteractive client:load>` island below the body, receiving all frontmatter fields needed for interactivity as props

## Interactive island: `CaseInteractive.tsx`

The island owns all interactive state. It receives the following props:

```ts
{
  hints: string[]
  answer: { value: number, unit: string, tolerance: number }
  explanation: string
  keyValues: { label: string, value: string }[]
}
```

### State

```
revealedHints: number       // count of hints currently shown; starts at 0
userInput: string           // raw string from input field
submitted: boolean          // true after first valid submit
isCorrect: boolean | null   // null until submitted, then computed
```

### UI sections

1. **Hints area**
   - Renders `hints[0..revealedHints - 1]` as a list
   - "Reveal hint" button increments `revealedHints`, disabled when all hints are shown

2. **Answer input**
   - `<input type="number">` + a label showing `answer.unit`
   - Submit button, disabled when `userInput` is empty, `NaN`, or `submitted` is already true
   - On submit: parse to number, compute `isCorrect`, set `submitted = true`. Submit is one-shot for v1 — no retry; to try again the user navigates back to the index.

3. **Post-submit reveal** (only rendered when `submitted` is true)
   - Verdict: "Correct!" or "Not quite — within ±{tolerance*100}%"
   - Full explanation text
   - keyValues rendered as a small two-column table
   - "Try another" link → `/`

### Answer checking

```
parsed = parseFloat(userInput)
isCorrect = Math.abs(parsed - answer.value) / answer.value <= answer.tolerance
```

The unit is shown to the user but not parsed. v1 trusts the user to enter in the displayed unit. If the user enters something un-parseable, the submit button stays disabled — no submit, no error state needed.

## Sample cases for v1

Two cases ship with v1, one easy + one medium, in different categories:
- `001-requests-per-server.md` — networking / throughput, medium
- `002-log-storage.md` — storage, easy

The exact content is illustrative; the goal is to validate the schema accepts variety and the index page lists more than one.

## Styling

A single `src/styles/global.css`, imported once by `BaseLayout.astro`. Class-based, no preprocessor. Initial classes needed:
- `.page`, `.card`, `.case-grid`
- `.difficulty`, `.difficulty--easy`, `.difficulty--medium`, `.difficulty--hard`
- `.button`, `.button:disabled`
- `.hint-list`, `.hint-item`
- `.verdict--correct`, `.verdict--incorrect`
- `.keyvalues` (the two-column table)

No design system, no theming, no dark mode. Readable defaults: system font stack, generous line-height, max-width on body content for legibility.

## Dev commands

```bash
mise install      # one-time, picks up node = lts from mise.toml
npm install
npm run dev       # astro dev
npm run build     # astro build → dist/
npm run preview   # astro preview
```

## Out of scope for v1

Deferred to later iterations, in roughly this priority order:
- Category filters on the index page
- Sidebar with streak / accuracy / attempted counts
- `localStorage` persistence for stats
- GitHub Actions workflow that builds + deploys to GitHub Pages
- Per-case "Next case →" navigation
- Search
- Dark mode
- Per-category index pages

None of these should leak into the v1 build.

## Success criteria

- `npm run build` succeeds on a clean checkout with both sample cases
- The index page lists both sample cases with their titles, categories, and difficulty badges
- Clicking a case opens its page with the scenario rendered
- Submitting a correct answer (within tolerance) shows the "correct" verdict, explanation, and keyValues
- Submitting an incorrect answer shows the "not quite" verdict and the same reveal
- Revealing hints works one at a time and stops at `hints.length`
- A markdown file with malformed frontmatter fails `astro build` with a useful error
