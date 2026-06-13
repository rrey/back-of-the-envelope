# back-of-the-envelope

Order-of-magnitude estimation exercises for SREs and engineers. Answer questions like "how many requests per second can one server handle?" with progressive hints, then see a full explanation and key reference numbers.

No account, no backend. Everything runs client-side.

## Running locally

```bash
mise install        # pins Node LTS via mise.toml — skip if you manage Node yourself
npm install
npm run dev         # http://localhost:4321
```

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the test suite |

## Stack

- **Astro 5** — static site generator, content collections, build
- **React 19** — interactive islands (answer input, hints, score)
- **TypeScript** — strict mode throughout
- **Vitest + React Testing Library** — unit tests for the interactive island
- **Plain CSS** — single global stylesheet, terminal dark theme

## Adding an exercise

See [CONTRIBUTING.md](CONTRIBUTING.md).
