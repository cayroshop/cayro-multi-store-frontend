# Cayro Multi-Store ERP Frontend — Agent Context

> Read this before changing UI or API wiring. Canonical backend contracts live in `../cayro-multi-store-backend/CLAUDE.md` and `docs/`.

## What this app is

SPA for the Cayro multi-store ERP: HQ / store operations staff authenticate against NestJS, consume **naked JSON** APIs (`/api/v1`), and render navigation from **`GET /auth/me/menu`** (no hardcoded role→menu maps).

## Stack (locked — ask before swapping)

Vite · React 19 · TypeScript · TanStack Router (file routes) · TanStack Query · Zustand · shadcn/ui (Base UI) · Tailwind 4 · Axios · Zod · next-themes · Sonner · Vitest/Playwright.

## Auth model

- **Access JWT:** memory only (`@/lib/access-token.ts` + Zustand).
- **Refresh token:** opaque string; persisted in **`sessionStorage`** key `cayro_refresh_token` (backend currently returns tokens in JSON — HttpOnly cookie can be added later without changing route guards).
- **401 handling:** axios interceptor refreshes once via `POST /auth/refresh`, then retries the request.
- **Logout:** `POST /auth/logout` with `{ refreshToken }`, then clear client state.

## Menu & routing

- Sidebar tree comes from **`GET /auth/me/menu`** → `{ user, menu }`. Icons are Lucide **kebab** names from the backend (`layout-dashboard`, `building-2`, …) resolved in `@/components/layout/menu-icon.tsx`.
- Route paths align with backend menu paths: `/hq/*` for `scope === 'HQ'`, `/store/*` for store users.
- Do **not** duplicate RBAC in the UI beyond hiding unavailable menu entries — abilities are enforced on the server.

## API client

- `@/lib/api-client.ts` — base URL from `VITE_API_BASE_URL` or `/api/v1` (Vite proxy in dev).
- Errors: `{ code, message, details?, correlationId? }` — use `getApiErrorMessage`.
- **Idempotency:** `POST /stores` and `POST /stores/:id/pickup-locations` require `Idempotency-Key` — use `createIdempotencyKey()` when implementing those mutations.

## Path alias

`@/*` → `src/*` only — no deep `../../../`.

## File routes

`src/routeTree.gen.ts` is generated — commit it so CI `tsc -b` passes.

## When backend adds modules

1. Add TanStack routes under `src/routes/` matching menu paths (or placeholders).
2. Add API wrappers in `src/api/`.
3. Prefer TanStack Query per resource; keep Zustand for UI/session only.

## ERP UI norms

Dense tables, clear hierarchy, status badges, monospace for codes/GSTIN, light+dark parity. See `docs/ui-erp-standards.md`.
