# Grid Container Contract — 24/09/25 11:08

## Purpose
Create a single source of truth for how grid-backed pages size their main container so layouts track the viewport and existing design tokens—matching current Dashboard behavior while preventing runaway widths or cramped defaults.

## Current Signals (Baseline)
- **Dashboard (`components/PageTemplate.tsx`)**: grid width is implicitly the width of the flex `main` element (`flex-1 p-4`). No explicit `max-w-*` token is applied, so the container stretches to the viewport minus sidebar.
- **Other pages**: onboarding-era pages (`app/disco/page.tsx`, `app/workflows/page.tsx`) already rely on Tailwind utilities such as `max-w-6xl`, `max-w-2xl`, and `max-w-md` for inner panels.
- **Grid math**: block widths use the 12-column percentage calculation and 8px gutters found in `components/GridCard.tsx:73-82`. Heights derive from the 40px row height defined in `lib/useGridSystem.ts:183`.

## Constraints to Honor
- Reuse existing Tailwind max-width tokens (`max-w-6xl`, `max-w-7xl`, `max-w-screen-2xl`, etc.) or CSS variables already declared in `app/globals.css`—no new numeric constants.
- Container rules must gracefully degrade to 100% width on smaller breakpoints while respecting padding (`p-4`) already in use.
- The Dashboard’s look-and-feel must remain unchanged after applying the shared container class.
- Blocks should remain large enough on first render to avoid scrollbars; container caps cannot cause charts/tables to overflow.

## Target Contract
1. **Container Wrapper**: introduce a utility (e.g., `gridContainerClass`) that returns a string combining `w-full`, `mx-auto`, and a tailwind `max-w-*` token currently used elsewhere (candidate: `max-w-6xl` per `app/disco/page.tsx`).
2. **Viewport Awareness**: rely on Tailwind’s built-in breakpoint scaling (`sm:`, `md:`, etc.) instead of inventing new breakpoints. If finer control is required, attach to existing CSS variables (e.g., `--radius`, theme spacing) defined in `app/globals.css`.
3. **Shared Padding**: maintain the existing `p-4`/`lg:p-6` pattern already scattered in page headers to keep breathing room consistent.
4. **Block Bounds**: pair the container cap with block-level helpers that reference the 12-column grid and row height so default cards expand to fit content.

## Implementation Notes
- Wire the container helper into all grid-driven pages (`PageTemplate`, legacy `app/page.tsx`, `app/items/page.tsx`) so they share the same outer wrapper.
- Cross-check responsive behavior at `sm`, `md`, `lg`, and `xl` breakpoints; confirm KPI/table blocks still render without scrollbars.
- Document any deviations inside this file with timestamps when adjustments occur.

## Implementation Log
- 24/09/25 11:16 — Created `lib/grid/container.ts` exporting shared helpers for `w-full mx-auto` containers with Tailwind max-width tokens, plus a `gridContainerClass` composer.
- 24/09/25 11:18 — Added `components/grid-v2/LayoutScaffold.tsx` to ensure every v2 page uses the shared container helper across header, page chrome, and grid surface.
- 24/09/25 11:27 — Introduced container variants (`default` → `max-w-6xl`, `wide` → `max-w-screen-2xl`) and updated the v2 layout to render the grid body with the `wide` variant so the canvas fills more of the viewport.
- 24/09/25 11:32 — Added `full` variant (`max-w-none`) and switched the v2 header + section wrappers to `full` (with padding) while keeping the grid body `full` so ultra-wide monitors get edge-to-edge canvas consistent with the legacy demo.

## Next Actions
- Update `components/PageTemplate.tsx` to wrap the grid area with the shared container helper without altering existing token usage.
- Migrate legacy pages (`app/page.tsx`, `app/items/page.tsx`) once the helper is in place.
- Add automated checks (later Section D work) to ensure container rules remain stable across breakpoints.

*Prepared 24/09/25 11:08.*
