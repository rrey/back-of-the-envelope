# Contributing

The fastest way to contribute is to add a new exercise — it's one markdown file, no JavaScript required.

## Adding an exercise

Create a file in `src/content/cases/` following the `NNN-slug.md` naming convention:

```
src/content/cases/003-your-exercise-name.md
```

Use the frontmatter schema below. A malformed file fails `npm run build` immediately with a clear Zod error — CI will catch it before merge.

```markdown
---
title: "A concrete, answerable question?"
difficulty: easy | medium | hard
category: networking          # one word, lowercase
tags: [tag1, tag2, tag3]
hints:
  - "A nudge toward the right mental model."
  - "A more specific hint that narrows the range."
  - "The key multiplication or lookup needed."
answer:
  value: 10000                # numeric, in the unit below
  unit: "req/s"               # displayed next to the input
  tolerance: 0.5              # 0.5 = accept answers within ±50%
explanation: "Full explanation shown after submission. Include the reasoning chain."
keyValues:
  - label: "Reference number label"
    value: "the number or range"
---

## The scenario

Write 2–3 paragraphs that set up the problem. Give enough context that
an engineer can estimate without knowing the exact answer in advance.

End with a bolded question: About how many **widgets per second** does this require?
```

### Tips for good exercises

- **Tolerance:** `0.5` (±50%) suits most order-of-magnitude questions. Use `0.1` only for questions with a definitive numerical answer (e.g. "how many bits in an IPv6 address?").
- **Hints:** Write them progressively — first hint is directional, second narrows it, third gives the key number needed to compute the answer.
- **keyValues:** Include 3–5 reference numbers an SRE should have memorised. These appear after submission.
- **Difficulty:** `easy` = one multiplication; `medium` = two or three steps; `hard` = requires combining several estimates.

## Running the site locally

```bash
mise install   # or ensure Node LTS is active
npm install
npm run dev
```

After adding your file, visit `http://localhost:4321` to see it listed, then click through to verify the hints, answer checking, and explanation all render correctly.

## Tests

```bash
npm test
```

The test suite covers the interactive island logic. If you're only adding a markdown exercise, existing tests should pass unchanged.

## Commit style

This repo uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add 003-database-connections exercise
fix: correct tolerance on 002-log-storage
docs: improve explanation in 001-requests-per-server
```
