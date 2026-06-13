# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static site for back-of-the-envelope estimation exercises, targeted at SREs and engineers. Users answer order-of-magnitude questions with progressive hints and see explanations. No backend — everything runs client-side with `localStorage` for persistence.

## Toolchain

Node is pinned via `mise.toml` (`node = "lts"`). Run `mise install` (or rely on shell auto-activation) before any `npm` command so versions match.

## Stack

- **Astro** — static site generator, handles content collections and build
- **React islands** — interactive components (answer input, hints, score tracking) embedded in otherwise-static pages
- **Markdown content** — each exercise is a `.md` file in `src/content/cases/`
- **GitHub Actions** — `astro build` on push to `main`, deploys to GitHub Pages

## Development Commands (once scaffolded)

```bash
npm install
npm run dev       # local dev server
npm run build     # production build
npm run preview   # preview production build locally
```

## Content Architecture

Each exercise lives in `src/content/cases/` as a Markdown file. The frontmatter schema (validated at build time by Astro's content collections) is:

```markdown
---
title: string
difficulty: easy | medium | hard
category: string          # e.g. networking, storage, compute
tags: string[]
hints: string[]           # revealed progressively
answer:
  value: number
  unit: string
  tolerance: number       # e.g. 0.5 = accept within 50%
explanation: string
keyValues:
  - label: string
    value: string
---
```

**Adding a new exercise = adding one `.md` file.** No JS knowledge required. A malformed frontmatter will fail CI before merging.

## Interactive Logic

All interactivity lives in `src/components/CaseCard.tsx` (React island). Key behaviors:
- Answer checking uses order-of-magnitude tolerance (`tolerance` field per case)
- Hints reveal one at a time
- Streak, accuracy, and attempted counts persist in `localStorage`
- Category filtering is client-side

## Deployment

GitHub Actions workflow at `.github/workflows/deploy.yml` runs `astro build` and deploys the `dist/` output to GitHub Pages on every push to `main`.
