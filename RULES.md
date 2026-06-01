# Rules for AI Agents

All agents working in this repository must follow these rules.

## Code quality

- Write **clean, simple code**. Prefer obvious solutions over clever ones.
- Do **not** over-engineer: no unnecessary abstractions, helpers, or indirection.
- Keep each file focused on **one responsibility**.
- Match existing naming, types, and patterns in the codebase.
- Only add comments when behavior is non-obvious.

## Architecture

- Use a **modular architecture**: separate fetch, persistence, HTTP, and UI layers.
- **Backend**: Coinbase fetch → repository → SQLite. HTTP handlers must not embed SQL.
- **Frontend**: API client, formatters, and UI components stay in `frontend/src/lib/`.
- Share types within each package; do not duplicate business logic across layers.

## Database

- All schema changes go through **`backend/src/db/schema.ts`** migrations.
- Use the **prices repository** (`backend/src/db/prices.ts`) for reads and writes.
- Do not query SQLite from route handlers or `add-to-db.ts` directly.
- Use indexes for columns used in `ORDER BY` or filters.

## Testing

- Add or update tests when changing behavior.
- Cover **happy paths and edge cases** (empty data, errors, invalid input, boundaries).
- Use in-memory SQLite (`:memory:`) for backend DB tests.
- Mock external HTTP (Coinbase) in tests; never call live APIs in CI.

## Frontend

- Use **daisyUI** components and utility classes for UI.
- Theme switching uses daisyUI **`theme-controller`** (see `ThemeToggle.svelte`).
- Keep components small; move logic to plain `.ts` modules when it aids testing.

## Safety and scope

- Minimize diff scope: only change what the task requires.
- Do not commit secrets, `.env`, or `db.sqlite`.
- Do not edit plan files unless the user asks.
- Run `bun test` in `backend/` (and `frontend/` when present) before finishing.

## Git

- Do not create commits or push unless the user explicitly asks.
