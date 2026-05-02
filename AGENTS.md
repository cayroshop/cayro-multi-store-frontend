# AGENTS.md — Cayro Multi-Store ERP Frontend

Generic AI tooling loads this file alongside Cursor rules.

**Canonical context:** [`CLAUDE.md`](./CLAUDE.md). Backend contracts: [`../cayro-multi-store-backend/CLAUDE.md`](../cayro-multi-store-backend/CLAUDE.md).

## Doc index

| Topic | File |
| --- | --- |
| Architecture | [`docs/frontend-architecture.md`](./docs/frontend-architecture.md) |
| ERP UI norms | [`docs/ui-erp-standards.md`](./docs/ui-erp-standards.md) |

## Rules

1. Use `@/` imports only.
2. Do not hardcode menus — use `/auth/me/menu`.
3. Money/decimals: strings from API when financial screens exist.
4. Light + dark must remain usable after UI changes.
5. Keep `src/routeTree.gen.ts` buildable (commit generated tree).
