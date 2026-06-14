# back-of-the-envelope

A training tool for SREs and engineers to practice back-of-the-envelope calculations — the kind you're expected to do on a whiteboard during system design interviews or when sizing infrastructure on the fly.

Each exercise presents a real-world scenario (storage capacity, request throughput, latency budgets…), lets you answer with progressive hints if you're stuck, then reveals a full explanation and key reference numbers.

No account, no backend. Everything runs client-side at **[back-of-the-envelope.suited.sh](https://back-of-the-envelope.suited.sh)**.

## Cases

Most cases are adapted from [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) (CC BY 4.0) — a reference repository of system design interview questions with worked solutions. The estimation sections of those solutions are turned into standalone exercises here.

New cases are welcome via pull request. Each case is a single Markdown file — no JavaScript knowledge required. See [CONTRIBUTING.md](CONTRIBUTING.md) for the format.

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

## License

[CC BY 4.0](LICENSE) — content may be shared and adapted with attribution.
