# Grid Standardization Context Priming

This is the standing context that must be reviewed before making any grid/canvas or block-engine changes.

## Core Goal
Build a standardized, grid-first component engine and block registry that reuses the current working dashboard grid without regressing behavior.

## Non-Negotiable Constraints
- **No new numeric constants** for sizes, breakpoints, gutters, or limits. Reuse existing design tokens, Tailwind scales, CSS variables, container queries, or viewport-derived calculations that already exist in the codebase.
- **Viewport-derived sizing**: max widths, min/max block sizes, and responsive rules must flow from the viewport and the existing design system tokens.
- **Preserve Dashboard behavior**: the dashboard remains the canonical reference for layout, responsiveness, and interactions.
- **Documentation-first workflow**: every feature change must include matching updates in `/docs`.

## Behavioral Expectations
- Grid malleability must stay predictable across desktop, tablet, and mobile. Layouts should not become unusably large or small on extreme viewport sizes.
- Blocks must render with sensible default dimensions on first load so content never overflows or collapses inside its container; resizing should enhance, not repair, the initial layout.
- Default block generation should surface complete content without internal scrollbars or clipped UI; end users can opt into smaller sizes afterwards, but the initial render must be fully legible.
- Refactors are encouraged where needed, but they must maintain existing Dashboard visuals and interactions.
- Component engine, registry, and future onboarding flows all ride on the same underlying grid physics.

## Immediate Implementation Focus (24/09/25 11:08)
- **Container & Viewport Contract**: establish a single container rule that derives max width from existing tokens (e.g., Tailwind `max-w-*`, CSS variables) and applies uniformly across all grid-backed pages without introducing new measurements.
- **Default Block Bounds**: audit initial block presets so KPI, table, and chart components render without scrollbars immediately, using viewport-aware helpers that piggyback on the 12-column grid and 40px row height.
- **Registry First**: maintain the block registry as the source of truth for default sizing, props, and labels so onboarding and v2 pages stay in sync.
- **Quick Edit Surfaces**: control panel actions should route through registry metadata and schemas so variant swaps and data bindings remain consistent across pages.
- **Documentation Discipline**: every code change in the grid stack must update `/docs` in the same commit/PR, noting timestamp and scope.
- These focus areas precede deeper efforts (block registry, PageSpec engine, data bindings) and should be revisited before starting each Section D task.

## Primary References
- `components/PageTemplate.tsx`
- `lib/useGridSystem.ts`
- `BLOCK_DATA_STRUCTURES.md`
- `COMPONENT_LIBRARY.md`
- `lib/mock.ts`

## Working Agreement
Review these priming notes before starting any task in Section D of the working to-do list so we stay aligned on quality and consistency.

## Recent Updates
- (25/09/25 13:30) Added reusable presets (`dashboard`, `onboarding`, blank scaffold) under `lib/grid-v2/presets.ts` so dynamic routes can load canonical layouts while preserving dashboard behavior.
