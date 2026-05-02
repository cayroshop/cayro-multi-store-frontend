# Frontend architecture

## Layers

| Layer | Responsibility |
| --- | --- |
| `src/routes/` | TanStack Router file routes; route-level loading/auth via `beforeLoad`. |
| `src/api/` | Thin wrappers around `apiClient` — no React imports. |
| `src/components/layout/` | ERP shell, sidebar, theme toggle. |
| `src/components/ui/` | shadcn primitives. |
| `src/stores/` | Zustand — auth session + ephemeral UI (sidebar mobile). |
| `src/lib/` | Axios client, access token, env, shared helpers. |
| `src/types/` | Shared TS types mirroring API shapes where stable. |

## Data fetching

- **TanStack Query** for server state (`['users']`, `['stores']`, `['auth-menu']`, …).
- Invalidate queries after mutations when write endpoints are added.

## Authentication flow

1. **Login:** `POST /auth/login` → `setSession(access, refresh, user)`.
2. **Reload:** `bootstrapSession()` reads refresh from `sessionStorage`, calls `POST /auth/refresh`, rotates tokens.
3. **Protected routes:** `/hq/*` and `/store/*` layouts call `bootstrapSession` in `beforeLoad` when access token is missing but refresh exists.

## Cross-origin dev

When `VITE_API_BASE_URL=http://localhost:5050/api/v1`, the backend must allow the Vite origin (`http://localhost:5173`) with credentials if cookies are introduced later. Currently tokens are JSON bodies.
