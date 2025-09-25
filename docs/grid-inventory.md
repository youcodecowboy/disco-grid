# Grid Inventory — 24/09/25 10:44

## Overview
Current dashboard pages share an ad-hoc but consistent grid stack: React grid state in hooks, absolute-positioned cards translating 12-column units into pixels, and Tailwind/container-query styling layered on top. This document inventories the moving parts before we standardize them.

## Grid/Canvas Implementations
- `components/PageTemplate.tsx` (core reusable dashboard shell) — owns grid state, drag/resize logic, overlap fixes, and frozen snapshots. Key logic at `components/PageTemplate.tsx:169-349`.
- `lib/useGridSystem.ts` (legacy hook used by older pages) — mirrors much of the grid math, including block add/delete and drag/resize mechanics (`lib/useGridSystem.ts:60-233`).
- `components/GridCanvas.tsx` — wraps the grid surface, applies background gridlines in edit mode, and computes min height from the tallest block (`components/GridCanvas.tsx:20-54`).
- `components/GridCard.tsx` — renders each block with absolute positioning derived from grid units, standardized padding, and a shared control panel (`components/GridCard.tsx:70-206`).
- Page-level implementations that still inline grid state instead of using `PageTemplate`: `app/page.tsx`, `app/items/page.tsx`; newer pages (`app/materials/page.tsx`, `app/teams/page.tsx`) already delegate to `PageTemplate`.
- **New v2 scaffolding (24/09/25 11:16)**: `lib/grid-v2/` and `components/grid-v2/` re-export the proven grid behavior (via `useGrid`, `GridSurface`, `BlockShell`) while introducing a shared container helper (`lib/grid/container.ts`). These files currently mirror legacy functionality and provide a safe place for future evolution.
- **LayoutScaffold (24/09/25 11:32)**: `components/grid-v2/LayoutScaffold.tsx` packages the legacy header + collapsible sidebar layout so every new page can keep the same frame while opting into the v2 grid container helper (header/section wrappers and grid body use the `full` variant with internal padding so the chrome + canvas align edge-to-edge across large viewports).
- **/v2 Page Harness (24/09/25 11:33)**: `app/v2/page.tsx` showcases the v2 stack—grid toggle, block control panel, add-block rail, and modal editing—while delegating all layout/control wiring to the new helpers. New blocks default to an AI prompt note (`note` block) instead of a heavy KPI so the canvas stays tidy.
- **Block Registry (24/09/25 12:30)**: `lib/block-registry/` tracks block labels, categories, default sizing, starter props, schemas, variants, and control metadata. `useGrid` consumes the registry so new/updated blocks inherit validated props and consistent layout footprints.
- **Quick Edit Controls (24/09/25 12:45)**: `components/grid-v2/QuickEditControls.tsx` reads registry variants/controls to expose inline editing (variant swap, data source binding, density toggles) inside the block toolbar; `/app/v2/page.tsx` wires it to `replaceBlockType` and `updateBlock`.

## Layout State & Props
- Shared layout model: `GridPos { x, y, w, h, i }` plus `blocks: Record<string, Block>` and a `mode` flag (`lib/useGridSystem.ts:4-58`, `components/PageTemplate.tsx:138-158`).
- Width math assumes 12 columns. Cards compute pixel width as a percentage of container width minus an 8px gutter (`components/GridCard.tsx:73-79`).
- Height units map to a 40px row height; card height is `(gridPos.h * 40) - 8` (`components/GridCard.tsx:80-82`).
- Default block sizing when added is `{ w: 6, h: 8 }` grid units (`lib/useGridSystem.ts:100-114`).
- `PageTemplate` also tracks drag state, resize metadata, content heights, and maintains saved snapshots for “frozen” layouts (`components/PageTemplate.tsx:169-349`).

## Responsiveness Handling
- Absolute positioning is percentage-based for width and pixel-based for height; container ref drives drag math via `gridRef.getBoundingClientRect()` (`lib/useGridSystem.ts:175-188`).
- Tailwind responsive classes in `GridCard` scale icon/button sizes across breakpoints (`components/GridCard.tsx:19-132`).
- Container queries in `app/globals.css` adjust card padding/title sizes for narrow containers (`app/globals.css:33-74`).
- No dedicated breakpoint logic for layout reflow; responsiveness relies on the 12-column percentage math and the surrounding flex layout in page headers.

## Existing Constraints & Guardrails
- Drag calculations clamp `x` between 0 and 11 and `y` to `>= 0` (`lib/useGridSystem.ts:186-187`).
- Resize handlers enforce minimum width/height of 2 grid units and cap width at the remaining columns (`lib/useGridSystem.ts:236-217, 261-273` & `components/PageTemplate.tsx:181-188, 313-343`).
- `toggleBlockCollapse` snaps height between 4 and 8 units for quick minimize (`lib/useGridSystem.ts:269-273`).
- `PageTemplate` includes `fixLayoutOverlaps` to push overlapping blocks downward and `adjustLayoutForContent` to grow blocks when measured content demands more height (`components/PageTemplate.tsx:307-360`).
- v2 `useGrid` normalizes layout via `resolveOverlaps`, pushing neighbors down whenever blocks are resized, dragged, or swapped so the canvas stays collision-free (`lib/grid-v2/useGrid.ts`).

## Design Tokens & Utilities
- Gutters and offsets use existing values: 8px spacing in width/height calcs (`components/GridCard.tsx:75-81`), row height 40px (`lib/useGridSystem.ts:183`).
- Theme tokens from Tailwind CSS and CSS variables defined in `app/globals.css` (e.g., `--radius`, sidebar colors) feed the card styling but no new numeric breakpoints are introduced (`app/globals.css:1-94`).
- React Grid Layout base styles remain in `app/globals.css` (`app/globals.css:96-146`).

## Known Behaviors / Issues to Preserve While Improving
- Dashboard already exhibits smooth drag/resize and persistence via `localStorage` keys (`components/PageTemplate.tsx:196-278`).
- Default block dimensions sometimes ship smaller than their content, leading to internal scrollbars or clipped visuals (noted across metric/table blocks in `components/blocks/*`). Our upcoming constraints work must address this without breaking the current layouts.

*Documented 24/09/25 10:44.*
