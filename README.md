# Cayro Multi-Store ERP — Frontend

> Vite + React + TypeScript SPA for the Cayro multi-store ERP. Consumes [`cayro-multi-store-backend`](../cayro-multi-store-backend/) (`/api/v1`).

---

## Quick start

```bash
npm install

# Optional: copy env (API base; defaults work with dev proxy)
cp .env.example .env.local

npm run dev
```

App: `http://localhost:5173`.

**API URL:** set `VITE_API_BASE_URL` in `.env` (e.g. `http://localhost:5050/api/v1`). The backend must enable **CORS** for `http://localhost:5173` when using a full URL (Nest `FRONTEND_ORIGIN` / equivalent). If you omit `VITE_API_BASE_URL`, Vite dev proxy maps `/api` → `http://localhost:3000` — adjust `vite.config.ts` if your API port differs.

---

## Tech stack

| Layer           | Choice                                                                            |
| --------------- | --------------------------------------------------------------------------------- |
| Framework       | Vite 8 + React 19                                                                 |
| Language        | TypeScript (strict)                                                               |
| UI              | shadcn/ui (Base UI) + Tailwind CSS 4                                              |
| Routing         | TanStack Router (file routes + codegen)                                           |
| Server state    | TanStack Query                                                                    |
| Client state    | Zustand                                                                           |
| Forms           | React Hook Form + Zod                                                             |
| Tables / charts | TanStack Table · Recharts                                                         |
| HTTP            | Axios (`withCredentials` for refresh cookie)                                      |
| Auth note       | Access JWT in memory · refresh HttpOnly cookie                                    |
| Toasts          | Sonner                                                                            |
| Errors          | react-error-boundary                                                              |
| Tests           | Vitest + RTL · Playwright                                                         |
| Quality         | ESLint + Prettier · Husky + lint-staged · Commitlint (repo root / backend config) |
| Deploy          | Vercel (`vercel.json`)                                                            |

---

## Project layout

```
src/
├── config/           # Validated env (Zod)
├── lib/              # api-client, query-client, utils
├── routes/           # TanStack Router file routes (+ generated route tree)
├── stores/           # Zustand
├── components/ui/    # shadcn components
└── test/             # Vitest setup
e2e/                  # Playwright specs
```

Path alias: `@/*` → `src/*` (same idea as backend `@/` aliases).

---

## Common commands

```bash
npm run dev           # Vite dev server
npm run build         # tsc + production bundle
npm run preview       # Preview production build

npm run lint          # ESLint --fix
npm run format        # Prettier

npm run test          # Vitest
npm run test:cov      # Coverage

npm run test:e2e      # Playwright (install browsers once: npx playwright install)
```

---

## Workflow (aligned with backend)

1. **Branches:** `feat/<scope>-<short-name>` or `fix/<scope>-<short-name>`.
2. **Commits:** Conventional Commits — enforced by Commitlint in `cayro-multi-store-backend`. Use scopes such as `feat(app): …`, `fix(ui): …`, `test(e2e): …`.
3. **Pre-commit:** From repo root with `core.hooksPath` → `cayro-multi-store-backend/.husky`, staged files in **both** backend and frontend run through lint-staged.

---

## Generated router file

`src/routeTree.gen.ts` is produced by `@tanstack/router-plugin` when you run `npm run dev` or `npm run build`. Commit this file so CI `tsc -b` passes on a clean clone.

---

## License

UNLICENSED — proprietary, internal use only.
