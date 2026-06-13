# v1 Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the back-of-the-envelope estimation site with two sample cases, an index page, per-case pages, and a single React island that handles answer checking, hint reveal, and post-submit explanation reveal.

**Architecture:** Astro static site with content collections (Zod-validated frontmatter). One React island per case page (`client:load`) owns all interactive state. Plain CSS in one global stylesheet. No backend, no persistence, no deploy automation in v1.

**Tech Stack:** Astro 5, React 19, TypeScript, Vitest + React Testing Library, plain CSS.

**Spec:** `docs/superpowers/specs/2026-06-13-v1-site-design.md`

---

## File map (what gets created)

| Path | Purpose |
|---|---|
| `package.json` | Project manifest + scripts |
| `astro.config.mjs` | Astro config, registers React integration |
| `tsconfig.json` | TS config extending Astro's strict preset |
| `.gitignore` | Ignore `node_modules`, `dist`, `.astro` |
| `vitest.config.ts` | Vitest config (happy-dom env) |
| `vitest.setup.ts` | jest-dom matchers |
| `src/content.config.ts` | Zod schema for the `cases` collection |
| `src/content/cases/001-requests-per-server.md` | Sample case (medium, networking) |
| `src/content/cases/002-log-storage.md` | Sample case (easy, storage) |
| `src/layouts/BaseLayout.astro` | HTML skeleton + global CSS import |
| `src/styles/global.css` | All site styles |
| `src/pages/index.astro` | Lists all cases |
| `src/pages/cases/[slug].astro` | Renders one case + mounts island |
| `src/components/CaseInteractive.tsx` | React island (answer/hints/reveal) |
| `src/components/CaseInteractive.test.tsx` | Vitest + RTL tests for the island |

---

## Task 1: Scaffold project (Astro + React + TS)

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Ensure Node is provisioned via mise**

Run: `mise install`
Expected: Node LTS installed and active (verify with `node --version`).

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "back-of-the-envelope",
  "type": "module",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/react": "^4.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.4.0"
  }
}
```

If `npm install` later complains that a version is unavailable, run `npm install astro@latest @astrojs/react@latest react@latest react-dom@latest` to pull current versions — the constraints above are minimums, not pins.

- [ ] **Step 3: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

- [ ] **Step 5: Create `.gitignore`**

```
# build output
dist/
.astro/

# dependencies
node_modules/

# logs
npm-debug.log*

# environment
.env
.env.production

# editor / OS
.DS_Store
.vscode/
.idea/
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`
Expected: `node_modules/` populated, no errors. A `package-lock.json` is created.

- [ ] **Step 7: Verify Astro is wired up**

Run: `npx astro --version`
Expected: prints a version number like `5.x.x` with no error.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore
git commit -m "chore: scaffold astro + react + typescript"
```

---

## Task 2: Content collection schema

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Create the Zod schema**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    category: z.string(),
    tags: z.array(z.string()),
    hints: z.array(z.string()),
    answer: z.object({
      value: z.number(),
      unit: z.string(),
      tolerance: z.number(),
    }),
    explanation: z.string(),
    keyValues: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
  }),
});

export const collections = { cases };
```

- [ ] **Step 2: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add cases content collection schema"
```

Note: the schema can't be validated until at least one markdown file exists. That happens in Task 3.

---

## Task 3: Add two sample cases

**Files:**
- Create: `src/content/cases/001-requests-per-server.md`
- Create: `src/content/cases/002-log-storage.md`

- [ ] **Step 1: Create the networking case**

```markdown
---
title: "How many requests per second can one app server handle?"
difficulty: medium
category: networking
tags: [throughput, servers, latency]
hints:
  - "Think about typical thread pool sizes for a modern app server."
  - "If each request takes ~10ms to process, how many can one thread serve per second?"
  - "Multiply per-thread throughput by the thread count."
answer:
  value: 10000
  unit: "req/s"
  tolerance: 0.5
explanation: "A modern app server with ~100 worker threads, each handling a 10ms request, processes about 100 req/s per thread × 100 threads = ~10,000 req/s. Real-world numbers vary widely with workload (CPU-bound vs IO-bound), but ~10k req/s is a useful ballpark for a single well-tuned instance serving simple endpoints."
keyValues:
  - label: "Typical thread pool"
    value: "100–500 threads"
  - label: "Simple request latency"
    value: "5–20 ms"
  - label: "Per-instance throughput"
    value: "~10k req/s"
---

## The scenario

Your company runs a monolithic web app on a fleet of identical app servers behind a load balancer. Each server has 8 cores, 32 GB of RAM, and runs a typical JVM-based stack.

You're sizing capacity for a new endpoint that does a single database lookup and returns JSON. The endpoint is roughly as expensive as the existing "get user profile" endpoint, which you've measured at ~10ms p50 latency.

About how many requests per second can a **single** server handle for this endpoint?
```

- [ ] **Step 2: Create the storage case**

```markdown
---
title: "How much disk does one day of access logs use?"
difficulty: easy
category: storage
tags: [logging, disk, retention]
hints:
  - "Estimate per-log-line size (a typical access log line is a few hundred bytes)."
  - "Multiply by daily request volume."
answer:
  value: 100
  unit: "GB/day"
  tolerance: 0.5
explanation: "A typical access log line — IP, timestamp, method, path, status, user-agent, latency — is around 500 bytes. At 200M requests/day, that's 200M × 500B = 100 GB/day uncompressed. With gzip, expect ~10–20 GB/day. This matters for retention planning: 30 days uncompressed = ~3 TB."
keyValues:
  - label: "Typical access log line"
    value: "200–800 bytes"
  - label: "Compression ratio (gzip)"
    value: "5–10×"
  - label: "1 day at 200M req"
    value: "~100 GB raw"
---

## The scenario

You operate a service that handles roughly 200 million requests per day. Every request emits one line to an access log (think nginx combined format: IP, timestamp, method, path, status code, user-agent, response time).

How much disk does **one day** of raw (uncompressed) access logs consume?
```

- [ ] **Step 3: Verify the schema accepts both cases**

Run: `npx astro sync`
Expected: completes with no errors. (If the schema rejects either case, the command prints a clear validation error pointing at the offending file.)

- [ ] **Step 4: Commit**

```bash
git add src/content/cases/
git commit -m "feat: add two sample cases"
```

---

## Task 4: Base layout + global CSS

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/styles/global.css`

- [ ] **Step 1: Create the global stylesheet**

```css
:root {
  --color-bg: #fafaf7;
  --color-fg: #1a1a1a;
  --color-muted: #666;
  --color-accent: #2563eb;
  --color-border: #d4d4d4;
  --color-correct-bg: #dcfce7;
  --color-correct-fg: #166534;
  --color-incorrect-bg: #fee2e2;
  --color-incorrect-fg: #991b1b;
  --radius: 6px;
  --font: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font);
  background: var(--color-bg);
  color: var(--color-fg);
  line-height: 1.55;
}

.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

.page h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
}

.muted {
  color: var(--color-muted);
}

.case-grid {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  display: grid;
  gap: 0.75rem;
}

.card {
  display: block;
  padding: 1rem 1.1rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  text-decoration: none;
  color: inherit;
}

.card:hover {
  border-color: var(--color-accent);
}

.card-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-meta {
  font-size: 0.85rem;
  color: var(--color-muted);
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.difficulty {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.difficulty--easy { background: #dcfce7; color: #166534; }
.difficulty--medium { background: #fef3c7; color: #854d0e; }
.difficulty--hard { background: #fee2e2; color: #991b1b; }

.button {
  font: inherit;
  padding: 0.5rem 1rem;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}

.button:disabled {
  background: var(--color-border);
  cursor: not-allowed;
}

.input {
  font: inherit;
  padding: 0.5rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  width: 12rem;
}

.hint-list {
  margin: 0.5rem 0 1rem;
  padding-left: 1.25rem;
}

.hint-item { margin: 0.25rem 0; }

.interactive {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.answer-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin: 1rem 0;
}

.verdict {
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  font-weight: 600;
  margin: 1rem 0;
}

.verdict--correct {
  background: var(--color-correct-bg);
  color: var(--color-correct-fg);
}

.verdict--incorrect {
  background: var(--color-incorrect-bg);
  color: var(--color-incorrect-fg);
}

.keyvalues {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.keyvalues th,
.keyvalues td {
  text-align: left;
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid var(--color-border);
}

.keyvalues th {
  font-weight: 600;
  width: 40%;
  color: var(--color-muted);
}
```

- [ ] **Step 2: Create the base layout**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
}

const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
  </head>
  <body>
    <main class="page">
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat: add base layout and global styles"
```

---

## Task 5: Index page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Write the index page**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';

const cases = await getCollection('cases');
cases.sort((a, b) => a.id.localeCompare(b.id));
---
<BaseLayout title="back-of-the-envelope">
  <h1>back-of-the-envelope</h1>
  <p class="muted">Order-of-magnitude estimation exercises for SREs and engineers.</p>

  <ul class="case-grid">
    {cases.map((entry) => (
      <li>
        <a class="card" href={`/cases/${entry.id}`}>
          <div class="card-title">{entry.data.title}</div>
          <div class="card-meta">
            <span class={`difficulty difficulty--${entry.data.difficulty}`}>
              {entry.data.difficulty}
            </span>
            <span>{entry.data.category}</span>
          </div>
        </a>
      </li>
    ))}
  </ul>
</BaseLayout>
```

- [ ] **Step 2: Run the dev server**

Run: `npm run dev`
Expected: server starts at `http://localhost:4321`. Open it — the page shows the heading and both sample cases as cards with difficulty badges.

Stop the server with Ctrl-C before continuing.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add index page listing all cases"
```

---

## Task 6: Dynamic case page (static, no island yet)

**Files:**
- Create: `src/pages/cases/[slug].astro`

- [ ] **Step 1: Write the dynamic route**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const cases = await getCollection('cases');
  return cases.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const { title, difficulty, category } = entry.data;
---
<BaseLayout title={title}>
  <p><a href="/">← all cases</a></p>
  <h1>{title}</h1>
  <div class="card-meta" style="margin-bottom: 1rem;">
    <span class={`difficulty difficulty--${difficulty}`}>{difficulty}</span>
    <span>{category}</span>
  </div>
  <Content />
</BaseLayout>
```

- [ ] **Step 2: Verify both case pages render**

Run: `npm run dev`
Expected: visiting `http://localhost:4321/cases/001-requests-per-server` shows the title, badge, and scenario body. Same for `/cases/002-log-storage`.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/cases/[slug].astro
git commit -m "feat: add dynamic case page (static, no island yet)"
```

---

## Task 7: Test framework setup

**Files:**
- Modify: `package.json` (add devDependencies)
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Install test dependencies**

Run:
```bash
npm install --save-dev vitest @vitest/ui happy-dom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Expected: `package.json` `devDependencies` now includes those packages, no install errors.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Verify the test runner works with no tests**

Run: `npm test`
Expected: vitest runs, finds no test files (exit code 0 with a "No test files found" message), or exits cleanly. If it exits non-zero with "No test files" — that's fine for now; the next task adds the first test.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "chore: add vitest + react testing library"
```

---

## Task 8: CaseInteractive — answer checking (TDD)

**Files:**
- Create: `src/components/CaseInteractive.test.tsx`
- Create: `src/components/CaseInteractive.tsx`

- [ ] **Step 1: Write failing tests for the submit + verdict flow**

Create `src/components/CaseInteractive.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import CaseInteractive from './CaseInteractive';

const baseProps = {
  hints: ['hint one', 'hint two'],
  answer: { value: 100, unit: 'GB/day', tolerance: 0.5 },
  explanation: 'because reasons',
  keyValues: [{ label: 'rate', value: '200M/day' }],
};

describe('CaseInteractive — answer checking', () => {
  it('shows the unit next to the input', () => {
    render(<CaseInteractive {...baseProps} />);
    expect(screen.getByText('GB/day')).toBeInTheDocument();
  });

  it('disables submit until a numeric value is entered', async () => {
    const user = userEvent.setup();
    render(<CaseInteractive {...baseProps} />);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toBeDisabled();

    await user.type(screen.getByLabelText(/your answer/i), '80');
    expect(button).toBeEnabled();
  });

  it('shows the correct verdict when within tolerance', async () => {
    const user = userEvent.setup();
    render(<CaseInteractive {...baseProps} />);
    await user.type(screen.getByLabelText(/your answer/i), '80');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/correct/i)).toBeInTheDocument();
    expect(screen.getByText('because reasons')).toBeInTheDocument();
  });

  it('shows the incorrect verdict when outside tolerance', async () => {
    const user = userEvent.setup();
    render(<CaseInteractive {...baseProps} />);
    await user.type(screen.getByLabelText(/your answer/i), '10');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/not quite/i)).toBeInTheDocument();
    expect(screen.getByText('because reasons')).toBeInTheDocument();
  });

  it('disables submit after submitting (one-shot)', async () => {
    const user = userEvent.setup();
    render(<CaseInteractive {...baseProps} />);
    await user.type(screen.getByLabelText(/your answer/i), '100');
    const button = screen.getByRole('button', { name: /submit/i });
    await user.click(button);
    expect(button).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './CaseInteractive'` (or similar). Confirms the test runner is wired up but the component doesn't exist yet.

- [ ] **Step 3: Implement minimal component to make these tests pass**

Create `src/components/CaseInteractive.tsx`:

```tsx
import { useState } from 'react';

interface Props {
  hints: string[];
  answer: { value: number; unit: string; tolerance: number };
  explanation: string;
  keyValues: { label: string; value: string }[];
}

export default function CaseInteractive({ hints, answer, explanation, keyValues }: Props) {
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const parsed = parseFloat(userInput);
  const canSubmit = !submitted && Number.isFinite(parsed);
  const isCorrect = submitted
    ? Math.abs(parsed - answer.value) / answer.value <= answer.tolerance
    : null;

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitted(true);
  }

  return (
    <div className="interactive">
      <div className="answer-row">
        <label>
          Your answer:{' '}
          <input
            className="input"
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={submitted}
            aria-label="your answer"
          />
        </label>
        <span className="muted">{answer.unit}</span>
        <button className="button" onClick={handleSubmit} disabled={!canSubmit}>
          Submit
        </button>
      </div>

      {submitted && (
        <>
          <div className={isCorrect ? 'verdict verdict--correct' : 'verdict verdict--incorrect'}>
            {isCorrect
              ? `Correct! (Accepted answer: ${answer.value} ${answer.unit}, ±${Math.round(answer.tolerance * 100)}%)`
              : `Not quite — the answer is around ${answer.value} ${answer.unit} (±${Math.round(answer.tolerance * 100)}%).`}
          </div>
          <p>{explanation}</p>
          {keyValues.length > 0 && (
            <table className="keyvalues">
              <tbody>
                {keyValues.map((kv) => (
                  <tr key={kv.label}>
                    <th scope="row">{kv.label}</th>
                    <td>{kv.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p><a href="/">Try another case →</a></p>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: all 5 tests in "CaseInteractive — answer checking" pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/CaseInteractive.tsx src/components/CaseInteractive.test.tsx
git commit -m "feat: CaseInteractive island with answer checking (TDD)"
```

---

## Task 9: CaseInteractive — hint reveal (TDD)

**Files:**
- Modify: `src/components/CaseInteractive.test.tsx`
- Modify: `src/components/CaseInteractive.tsx`

- [ ] **Step 1: Add failing tests for hint reveal**

Append this block to `src/components/CaseInteractive.test.tsx` (after the existing `describe` block, inside the file):

```tsx
describe('CaseInteractive — hint reveal', () => {
  it('shows no hints initially', () => {
    render(<CaseInteractive {...baseProps} />);
    expect(screen.queryByText('hint one')).not.toBeInTheDocument();
    expect(screen.queryByText('hint two')).not.toBeInTheDocument();
  });

  it('reveals hints one at a time', async () => {
    const user = userEvent.setup();
    render(<CaseInteractive {...baseProps} />);
    const button = screen.getByRole('button', { name: /reveal hint/i });

    await user.click(button);
    expect(screen.getByText('hint one')).toBeInTheDocument();
    expect(screen.queryByText('hint two')).not.toBeInTheDocument();

    await user.click(button);
    expect(screen.getByText('hint two')).toBeInTheDocument();
  });

  it('disables the reveal button when all hints are shown', async () => {
    const user = userEvent.setup();
    render(<CaseInteractive {...baseProps} />);
    const button = screen.getByRole('button', { name: /reveal hint/i });
    await user.click(button);
    await user.click(button);
    expect(button).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: the three new tests fail — "Unable to find role 'button' with name /reveal hint/i" or similar.

- [ ] **Step 3: Add hint reveal to the component**

Edit `src/components/CaseInteractive.tsx`. Add `revealedHints` state and a hints section at the top of the rendered output (above the answer row):

Add to the imports/state — change the `useState` block to:

```tsx
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
```

Then, inside the returned JSX, add this block **immediately after `<div className="interactive">` and before `<div className="answer-row">`**:

```tsx
      {hints.length > 0 && (
        <>
          <ul className="hint-list">
            {hints.slice(0, revealedHints).map((hint, i) => (
              <li className="hint-item" key={i}>{hint}</li>
            ))}
          </ul>
          <button
            className="button"
            onClick={() => setRevealedHints((n) => Math.min(n + 1, hints.length))}
            disabled={revealedHints >= hints.length}
          >
            Reveal hint ({revealedHints}/{hints.length})
          </button>
        </>
      )}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: all 8 tests pass (5 from Task 8 + 3 new).

- [ ] **Step 5: Commit**

```bash
git add src/components/CaseInteractive.tsx src/components/CaseInteractive.test.tsx
git commit -m "feat: progressive hint reveal in CaseInteractive (TDD)"
```

---

## Task 10: Wire the island into the case page

**Files:**
- Modify: `src/pages/cases/[slug].astro`

- [ ] **Step 1: Mount the React island on the case page**

Replace the contents of `src/pages/cases/[slug].astro` with:

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import CaseInteractive from '../../components/CaseInteractive';

export async function getStaticPaths() {
  const cases = await getCollection('cases');
  return cases.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const { title, difficulty, category, hints, answer, explanation, keyValues } = entry.data;
---
<BaseLayout title={title}>
  <p><a href="/">← all cases</a></p>
  <h1>{title}</h1>
  <div class="card-meta" style="margin-bottom: 1rem;">
    <span class={`difficulty difficulty--${difficulty}`}>{difficulty}</span>
    <span>{category}</span>
  </div>
  <Content />
  <CaseInteractive
    client:load
    hints={hints}
    answer={answer}
    explanation={explanation}
    keyValues={keyValues}
  />
</BaseLayout>
```

- [ ] **Step 2: Verify in the browser**

Run: `npm run dev`
Open `http://localhost:4321/cases/002-log-storage`. Verify:
- "Reveal hint" button works — clicking shows hints one at a time
- Submit is disabled until you type a number
- Typing `100` and clicking Submit shows the green "Correct!" verdict, the explanation, and the keyValues table
- Submit button is now disabled
- "Try another case →" link goes back to `/`

Then try `/cases/001-requests-per-server` with answer `100` — should show the red "Not quite" verdict.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/cases/[slug].astro
git commit -m "feat: mount CaseInteractive island on case pages"
```

---

## Task 11: Final verification — full build + tests

- [ ] **Step 1: Run the test suite**

Run: `npm test`
Expected: all 8 tests pass.

- [ ] **Step 2: Run a production build**

Run: `npm run build`
Expected: completes with no errors. `dist/` contains:
- `dist/index.html`
- `dist/cases/001-requests-per-server/index.html` (or similar)
- `dist/cases/002-log-storage/index.html`
- a `_astro/` directory with hashed JS/CSS assets

- [ ] **Step 3: Run the preview server and smoke test**

Run: `npm run preview`
Open the printed URL. Walk through both cases end-to-end:
- Index lists both cases with badges
- Each case page renders title, scenario, hints button, answer input
- Submit on each shows the verdict, explanation, keyValues, and "Try another" link
- Bad-frontmatter smoke test: temporarily change one case's `difficulty:` to `extreme`, run `npm run build`, confirm it fails with a Zod validation error pointing at the file. Revert the change.

Stop the preview server.

- [ ] **Step 4: Update CLAUDE.md to reflect the now-scaffolded state**

Edit `CLAUDE.md`:
- Remove the "**Repo state:** pre-scaffold" line — the repo is no longer pre-scaffold.
- Change the "## Planned Stack" heading to "## Stack".
- Keep everything else.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md now that v1 site is scaffolded"
```

---

## Done criteria (from spec)

- [x] `npm run build` succeeds on a clean checkout with both sample cases — Task 11 Step 2
- [x] Index page lists both sample cases with title, category, difficulty badge — Task 5 Step 2, Task 11 Step 3
- [x] Clicking a case opens its page with the scenario rendered — Task 6 Step 2, Task 11 Step 3
- [x] Submitting a correct answer shows the "correct" verdict + explanation + keyValues — Task 10 Step 2, tested in Task 8
- [x] Submitting an incorrect answer shows the "not quite" verdict + same reveal — Task 10 Step 2, tested in Task 8
- [x] Hints reveal one at a time, stop at `hints.length` — Task 9, Task 10 Step 2
- [x] Malformed frontmatter fails `astro build` with a useful error — Task 11 Step 3
