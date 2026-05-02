# ERP UI standards (Cayro frontend)

Aligned with common enterprise dashboards (SAP Fiori / NetSuite-style operational UX): clarity over decoration.

## Layout

- **Shell:** persistent sidebar + top bar; content max-width ~1280px (`max-w-7xl`), generous padding.
- **Density:** default table density; avoid oversized touch targets on desktop (mobile sheet nav uses larger hit areas).
- **Hierarchy:** page title + short helper line referencing the backing API where useful for operators/debugging.

## Data presentation

- **Identifiers:** store codes, GSTIN, IDs in `font-mono` where precision matters.
- **Status:** use `Badge` — outline for passive states, secondary for scope/type.
- **Money:** when inventory/finance screens ship, render amounts as **strings** from the API (never trust JS `number` for decimals).

## Theme

- **Light & dark** required for every screen — verify both when changing tokens or components.
- Use CSS variables from `src/index.css` / shadcn theme — avoid hard-coded hex except rare accents.

## Navigation

- Primary nav from **`GET /auth/me/menu`** only.
- Secondary shortcuts (e.g. dashboard tiles) may deep-link to modules but must not invent permission checks — server returns 403 if needed.

## Feedback

- Mutations: toast success/error via Sonner; destructive actions need confirmation patterns (dialog) when implemented.
