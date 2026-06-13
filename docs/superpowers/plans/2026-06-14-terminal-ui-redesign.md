# Terminal UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retheme the site with a terminal/hacker aesthetic — dark background, Fira Mono chrome, green + amber accents — via CSS and minimal markup changes, keeping all 8 tests passing unchanged.

**Architecture:** CSS-only retheme (Approach A). `global.css` is fully rewritten with new custom properties and class rules. `BaseLayout.astro` gets a Google Fonts link. The three page/component files get targeted markup additions (class renames, `$` glyph, `[NNN]` prefix, copy tweaks). No new files, no logic changes, no test changes.

**Tech Stack:** Astro 5, React 19, plain CSS, Fira Mono (Google Fonts CDN), Vitest + RTL (tests unchanged).

**Spec:** `docs/superpowers/specs/2026-06-13-terminal-ui-redesign.md`

---

## File Map

| File | Change |
|---|---|
| `src/styles/global.css` | Full rewrite |
| `src/layouts/BaseLayout.astro` | Add Fira Mono `<link>` in `<head>` |
| `src/pages/index.astro` | Add `$` glyph, `[NNN]` prefix, rename classes |
| `src/pages/cases/[slug].astro` | Back link copy, `.case-header` wrapper, `[NNN]` prefix |
| `src/components/CaseInteractive.tsx` | Add `$` glyph, `hint-output` divs, section labels, rename classes |
| `.gitignore` | Add `.superpowers/` (visual companion output) |

---

## Task 1: Rewrite global.css + add Fira Mono

**Files:**
- Modify: `src/styles/global.css` (full rewrite)
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `.gitignore`

- [ ] **Step 1: Add `.superpowers/` to `.gitignore`**

Append to `.gitignore`:

```
# Visual companion session files
.superpowers/
```

- [ ] **Step 2: Add Fira Mono to `src/layouts/BaseLayout.astro`**

Replace the full file with:

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
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;700&display=swap" rel="stylesheet" />
    <title>{title}</title>
  </head>
  <body>
    <main class="page">
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 3: Rewrite `src/styles/global.css`**

Replace the entire file with:

```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;700&display=swap');

:root {
  --color-bg: #0d1117;
  --color-surface: #161b22;
  --color-border: #30363d;
  --color-border-muted: #21262d;
  --color-fg: #e6edf3;
  --color-muted: #8b949e;
  --color-green: #3fb950;
  --color-amber: #d29922;
  --color-red: #f85149;
  --color-prompt: #58a6ff;
  --font-mono: 'Fira Mono', 'Cascadia Code', 'Courier New', monospace;
  --font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --radius: 4px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-mono);
  background: var(--color-bg);
  color: var(--color-fg);
  line-height: 1.55;
}

/* ── Page shell ────────────────────────────── */

.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

/* ── Site header (index page) ──────────────── */

.site-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.site-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-green);
  letter-spacing: 0.02em;
}

.prompt {
  color: var(--color-prompt);
  margin-right: 0.3em;
}

.site-subtitle {
  font-size: 0.75rem;
  color: var(--color-muted);
  margin-top: 0.3rem;
}

/* ── Back link (case page) ─────────────────── */

.back-link {
  display: inline-block;
  font-size: 0.72rem;
  color: var(--color-prompt);
  text-decoration: none;
  margin-bottom: 1.5rem;
}
.back-link:hover { color: var(--color-green); }

/* ── Case list (index page) ────────────────── */

.case-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.case-card {
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.9rem 1rem;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s;
}
.case-card:hover { border-color: var(--color-green); }

.case-card-top {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
}

.case-num {
  font-size: 0.72rem;
  color: var(--color-prompt);
  flex-shrink: 0;
  width: 2.8rem;
}

.case-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-fg);
  line-height: 1.4;
}

.case-card-meta {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 0.45rem;
  padding-left: 3.55rem;
  font-size: 0.7rem;
  color: var(--color-muted);
}

/* ── Badges ────────────────────────────────── */

.badge {
  font-size: 0.63rem;
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.badge-easy   { color: var(--color-green); border: 1px solid var(--color-green); }
.badge-medium { color: var(--color-amber); border: 1px solid var(--color-amber); }
.badge-hard   { color: var(--color-red);   border: 1px solid var(--color-red); }

/* ── Tags ──────────────────────────────────── */

.tag {
  font-size: 0.63rem;
  color: var(--color-muted);
  background: var(--color-border-muted);
  padding: 0.1rem 0.4rem;
  border-radius: 2px;
}

/* ── Case page header card ─────────────────── */

.case-header {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.1rem 1.2rem;
  margin-bottom: 1.5rem;
}

.case-num-line {
  font-size: 0.7rem;
  color: var(--color-prompt);
  margin-bottom: 0.4rem;
}

.page-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-fg);
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.case-meta {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
}

/* ── Scenario body (system font for readability) */

.scenario {
  font-family: var(--font-body);
  font-size: 0.92rem;
  line-height: 1.7;
  color: #c9d1d9;
  margin-bottom: 2rem;
}
.scenario p { margin-bottom: 0.85rem; }
.scenario p:last-child { margin-bottom: 0; }

/* ── Section labels ────────────────────────── */

.section-label {
  font-size: 0.68rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.6rem;
}
.section-label::before { content: '# '; color: var(--color-border); }

/* ── Interactive island ────────────────────── */

.interactive {
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
  margin-top: 2rem;
}

/* Hints */

.hints-section { margin-bottom: 1.25rem; }

.hint-output {
  background: var(--color-surface);
  border-left: 2px solid var(--color-green);
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.4rem;
  font-size: 0.78rem;
  color: var(--color-muted);
  border-radius: 0 var(--radius) var(--radius) 0;
}
.hint-output::before { content: '> '; color: var(--color-green); }

.hint-btn {
  background: none;
  border: 1px solid var(--color-green);
  color: var(--color-green);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius);
  cursor: pointer;
}
.hint-btn:hover { background: rgba(63, 185, 80, 0.08); }
.hint-btn:disabled {
  border-color: var(--color-border);
  color: var(--color-muted);
  cursor: not-allowed;
  background: none;
}

/* Answer */

.answer-section { margin: 1.25rem 0; }

.answer-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.82rem;
}

.prompt-glyph { color: var(--color-prompt); }

.answer-label { color: var(--color-muted); }

.answer-input {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-fg);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  padding: 0.3rem 0.6rem;
  width: 8rem;
}
.answer-input:focus {
  outline: none;
  border-color: var(--color-amber);
}
.answer-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.unit {
  color: var(--color-muted);
  font-size: 0.75rem;
}

.submit-btn {
  background: var(--color-amber);
  color: #0d1117;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.9rem;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.submit-btn:hover { opacity: 0.88; }
.submit-btn:disabled {
  background: var(--color-border);
  color: var(--color-muted);
  cursor: not-allowed;
  opacity: 1;
}

/* Verdict */

.verdict {
  border-radius: var(--radius);
  padding: 0.75rem 1rem;
  font-size: 0.78rem;
  font-weight: 700;
  margin: 1.25rem 0;
}
.verdict-correct {
  background: rgba(63, 185, 80, 0.1);
  border: 1px solid var(--color-green);
  color: var(--color-green);
}
.verdict-correct::before { content: '✓ '; }
.verdict-incorrect {
  background: rgba(248, 81, 73, 0.1);
  border: 1px solid var(--color-red);
  color: var(--color-red);
}
.verdict-incorrect::before { content: '✗ '; }

/* Explanation */

.explanation {
  font-family: var(--font-body);
  font-size: 0.88rem;
  line-height: 1.7;
  color: #c9d1d9;
  margin-bottom: 1.25rem;
}

/* Key values */

.keyvalues {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
  margin-bottom: 1.25rem;
}
.keyvalues th,
.keyvalues td {
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid var(--color-border-muted);
  text-align: left;
}
.keyvalues th {
  color: var(--color-muted);
  font-weight: 400;
  width: 40%;
}
.keyvalues td {
  color: var(--color-green);
  font-weight: 700;
}

/* Try another link */

.try-another {
  font-size: 0.75rem;
  color: var(--color-prompt);
  text-decoration: none;
  display: inline-block;
  margin-top: 0.5rem;
}
.try-another:hover { color: var(--color-green); }

/* Utility */

.muted { color: var(--color-muted); }
```

- [ ] **Step 4: Start dev server and verify visual baseline**

```bash
npm run dev > /tmp/astro-ui.log 2>&1 &
PID=$!
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/
```

Expected: `200`. Open `http://localhost:4321` in the browser. The page should now be dark (#0d1117 background). Layout will look broken until Tasks 2–4 update the markup — that is expected.

```bash
kill $PID; wait $PID 2>/dev/null
```

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro .gitignore
git commit -m "feat: terminal dark theme — new CSS tokens and all class rules"
```

---

## Task 2: Index page markup

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';

const cases = await getCollection('cases');
cases.sort((a, b) => a.id.localeCompare(b.id));
---
<BaseLayout title="back-of-the-envelope">
  <header class="site-header">
    <div class="site-title">
      <span class="prompt">$</span>back-of-the-envelope
    </div>
    <div class="site-subtitle">order-of-magnitude estimation exercises for SREs and engineers</div>
  </header>

  <ul class="case-list">
    {cases.map((entry) => (
      <li>
        <a class="case-card" href={`/cases/${entry.id}`}>
          <div class="case-card-top">
            <span class="case-num">[{entry.id.slice(0, 3)}]</span>
            <span class="case-title">{entry.data.title}</span>
          </div>
          <div class="case-card-meta">
            <span class={`badge badge-${entry.data.difficulty}`}>
              {entry.data.difficulty}
            </span>
            <span>{entry.data.category}</span>
            {entry.data.tags.map((tag) => (
              <span class="tag">{tag}</span>
            ))}
          </div>
        </a>
      </li>
    ))}
  </ul>
</BaseLayout>
```

- [ ] **Step 2: Verify in dev server**

```bash
npm run dev > /tmp/astro-ui.log 2>&1 &
PID=$!
sleep 3
curl -s http://localhost:4321/ | grep -c "case-card"
curl -s http://localhost:4321/ | grep -q "\[001\]" && echo "num prefix present"
curl -s http://localhost:4321/ | grep -q "badge-medium" && echo "badge class present"
kill $PID; wait $PID 2>/dev/null
```

Expected: `2` (two cards), `num prefix present`, `badge class present`.

Open `http://localhost:4321` and confirm: dark page, `$ back-of-the-envelope` header, `[001]`/`[002]` prefixes, outlined badges, dark tag chips.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: index page terminal markup — dollar prompt, [NNN] prefixes, new classes"
```

---

## Task 3: Case page markup

**Files:**
- Modify: `src/pages/cases/[slug].astro`

- [ ] **Step 1: Replace `src/pages/cases/[slug].astro`**

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
const { title, difficulty, category, tags, hints, answer, explanation, keyValues } = entry.data;
const caseNum = entry.id.slice(0, 3);
---
<BaseLayout title={title}>
  <a class="back-link" href="/">← cd ..</a>

  <div class="case-header">
    <div class="case-num-line">[{caseNum}] {category}</div>
    <h1 class="page-title">{title}</h1>
    <div class="case-meta">
      <span class={`badge badge-${difficulty}`}>{difficulty}</span>
      {tags.map((tag) => <span class="tag">{tag}</span>)}
    </div>
  </div>

  <div class="scenario">
    <Content />
  </div>

  <CaseInteractive
    client:load
    hints={hints}
    answer={answer}
    explanation={explanation}
    keyValues={keyValues}
  />
</BaseLayout>
```

- [ ] **Step 2: Verify in dev server**

```bash
npm run dev > /tmp/astro-ui.log 2>&1 &
PID=$!
sleep 3
curl -s http://localhost:4321/cases/002-log-storage | grep -q "case-header" && echo "header card present"
curl -s http://localhost:4321/cases/002-log-storage | grep -q "cd \.\." && echo "back link present"
curl -s http://localhost:4321/cases/002-log-storage | grep -q "\[002\] storage" && echo "num + category present"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/cases/001-requests-per-server
kill $PID; wait $PID 2>/dev/null
```

Expected: all three "present" lines print, `200` for case 1.

Open `http://localhost:4321/cases/002-log-storage`. Confirm: dark header card with `[002] storage`, `← cd ..` back link, scenario body in system font.

- [ ] **Step 3: Commit**

```bash
git add 'src/pages/cases/[slug].astro'
git commit -m "feat: case page terminal markup — header card, cd.. back link, scenario system font"
```

---

## Task 4: CaseInteractive markup

**Files:**
- Modify: `src/components/CaseInteractive.tsx`

The logic (state, answer-checking math, hint reveal) is unchanged. Only class names, element types for the hint list, and minor copy change.

**Test compatibility note:** The 8 existing tests query by accessible role/text — none query by class name. These changes are safe:
- `getByRole('button', { name: /submit/i })` — still matches; button text stays "Submit"
- `getByRole('button', { name: /reveal hint/i })` — still matches; hint button text unchanged
- `getByLabelText(/your answer/i)` — `aria-label="your answer"` stays on the input
- `getByText(/correct/i)` / `getByText(/not quite/i)` — verdict text unchanged
- `getByText('because reasons')` — explanation text renders in `.explanation` div, still present
- `getByText('hint one')` / `queryByText('hint two')` — hint text renders in `.hint-output` div, still present

- [ ] **Step 1: Replace `src/components/CaseInteractive.tsx`**

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
  const [revealedHints, setRevealedHints] = useState(0);

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
      {hints.length > 0 && (
        <div className="hints-section">
          <div className="section-label">hints</div>
          {hints.slice(0, revealedHints).map((hint, i) => (
            <div className="hint-output" key={i}>{hint}</div>
          ))}
          <button
            className="hint-btn"
            onClick={() => setRevealedHints((n) => Math.min(n + 1, hints.length))}
            disabled={revealedHints >= hints.length}
          >
            Reveal hint ({revealedHints}/{hints.length})
          </button>
        </div>
      )}

      <div className="answer-section">
        <div className="section-label">your answer</div>
        <div className="answer-row">
          <span className="prompt-glyph">$</span>
          <span className="answer-label">answer:</span>
          <input
            className="answer-input"
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={submitted}
            aria-label="your answer"
          />
          <span className="unit">{answer.unit}</span>
          <button className="submit-btn" onClick={handleSubmit} disabled={!canSubmit}>
            Submit
          </button>
        </div>
      </div>

      {submitted && (
        <>
          <div className={isCorrect ? 'verdict verdict-correct' : 'verdict verdict-incorrect'}>
            {isCorrect
              ? `Correct! (Accepted: ${answer.value} ${answer.unit}, ±${Math.round(answer.tolerance * 100)}%)`
              : `Not quite — the answer is around ${answer.value} ${answer.unit} (±${Math.round(answer.tolerance * 100)}%).`}
          </div>
          <div className="explanation">{explanation}</div>
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
          <a href="/" className="try-another">→ try another case</a>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected:
```
Test Files  1 passed (1)
     Tests  8 passed (8)
```

If any test fails, read the failure message carefully. The most likely cause is a class or text change that wasn't anticipated. Cross-reference the "Test compatibility note" above before fixing.

- [ ] **Step 3: Verify in dev server**

```bash
npm run dev > /tmp/astro-ui.log 2>&1 &
PID=$!
sleep 3
curl -s http://localhost:4321/cases/002-log-storage | grep -q "hint-btn" && echo "hint-btn present"
curl -s http://localhost:4321/cases/002-log-storage | grep -q "submit-btn" && echo "submit-btn present"
curl -s http://localhost:4321/cases/002-log-storage | grep -q "prompt-glyph" && echo "prompt glyph present"
kill $PID; wait $PID 2>/dev/null
```

Expected: all three "present" lines. Open a case page in the browser and exercise the full flow: reveal hints, submit an answer, see the verdict + key values.

- [ ] **Step 4: Commit**

```bash
git add src/components/CaseInteractive.tsx
git commit -m "feat: CaseInteractive terminal markup — hint-output, prompt glyph, terminal classes"
```

---

## Task 5: Final verification

**Files:** None changed.

- [ ] **Step 1: Run tests**

Run: `npm test`
Expected: 8/8 pass.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: `3 page(s) built` with no errors.

Verify dist contains:
```bash
ls dist/ && ls dist/cases/
```
Expected: `index.html`, `_astro/`, `cases/` with both case directories.

- [ ] **Step 3: Malformed-frontmatter smoke test (regression guard)**

```bash
sed -i.bak 's/^difficulty: medium$/difficulty: extreme/' src/content/cases/001-requests-per-server.md
npm run build 2>&1 | grep -i "invalid\|error\|extreme" | head -5
mv src/content/cases/001-requests-per-server.md.bak src/content/cases/001-requests-per-server.md
```

Expected: the build fails with a Zod enum error mentioning `extreme`. After restore, the file is back to `difficulty: medium`.

- [ ] **Step 4: Preview smoke test**

```bash
npm run preview > /tmp/astro-preview.log 2>&1 &
PPID=$!
sleep 2
curl -s -o /dev/null -w "index: %{http_code}\n" http://localhost:4321/
curl -s -o /dev/null -w "case1: %{http_code}\n" http://localhost:4321/cases/001-requests-per-server
curl -s -o /dev/null -w "case2: %{http_code}\n" http://localhost:4321/cases/002-log-storage
kill $PPID; wait $PPID 2>/dev/null
```

Expected: all three return `200`.

Open the preview URL in the browser and walk through:
- Index: dark bg, `$ back-of-the-envelope` header, `[001]`/`[002]` cards with outlined badges
- Case page: dark header card, `← cd ..`, scenario in system font
- Interactive: reveal a hint (green bordered output with `>`), submit an answer, see amber submit button and green ✓ or red ✗ verdict box

- [ ] **Step 5: Commit is already done per task — nothing to commit here**

All changes are already committed in Tasks 1–4. If you made any incidental fixes in this task, commit them now:

```bash
git status
# if clean, nothing to do
```

---

## Done Criteria

- [ ] `npm test` → 8/8 pass, zero test file modifications
- [ ] `npm run build` → succeeds, 3 pages
- [ ] Index: dark bg, `$` glyph title, `[001]`/`[002]` prefixes, outlined difficulty badges, dark tag chips
- [ ] Case page: dark header card, `← cd ..` back link, system-font scenario body
- [ ] Interactive: `$` prompt before input, green-bordered hint outputs, amber submit, green ✓ / red ✗ verdict boxes, green key value `<td>` cells
- [ ] Fira Mono visible for all chrome (headers, labels, buttons)
