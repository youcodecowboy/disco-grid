# Onboarding Wizard Plan — 25/09/25 13:45

The demo onboarding flow shifts from a form-stack into a guided, step-by-step experience that lives on the grid but hides the sidebar until the workspace is generated. Each step collects high-signal inputs we need to assemble a tailored dashboard/app preset.

## Step Outline
1. **Company & Branding**
   - Inputs: company name, logo upload, headquarters location, multi-site toggle.
   - Immediate effect: header updates to show the submitted logo/name so the user feels ownership from the first screen.
2. **Style Preferences**
   - Theme toggles (light/dark, accent color), component density, layout vibe (cards vs. tables emphasis).
3. **Industry & Scenario Selection**
   - Large selectable tiles with icons for Manufacturing, Construction, Defense, Logistics, plus an "Other" path.
   - Branch metadata informs downstream presets.
4. **Team & Capacity**
   - Two sliders (monthly items managed, active users) + optional text chip for shift info.
5. **Items & SKU Focus**
   - Multi-select chips for tracked asset types, SKU prefix entry, attribute toggles (expiry, serial, lot, etc.).
6. **Floorplan Sketch**
   - Mini grid builder: users paint zones (Production, QA, Staging, etc.) with color-coded tiles, set approximate square footage per zone.
7. **Summary & Confirmation**
   - Read-only cards showing the choices above, plus a generated block roster preview.

## Interaction Contract
- Sticky footer carries **Back / Next** and a progress bar (fraction + bar).
- Breadcrumbs across the top let users jump to completed steps without losing state.
- Each step’s component set is bespoke (no generic FormBuilder); blocks still live inside grid cards so the malleability story is intact.
- Wizard state is stored client-side (`useReducer`) and will later feed preset generation + GenerationSummary.

## Implementation Notes
- Create `app/onboarding/page.tsx` with a custom layout (no sidebar) and scoped components under `components/onboarding/`.
- Reuse design tokens: existing cards, buttons, typography, and the grid container helper to preserve spacing guidelines.
- Ensure uploads/sliders remain mock/local for now; state shape should anticipate future persistence.
- Final step exposes a CTA to “Generate my workspace” (stub for now) and displays the selected block families.
- Next iteration: cards reveal sequentially—only the active block is full color, prior answers stay dimmed but clickable and auto-scroll brings the new card into view.

## Status Log
- (25/09/25 14:05) Initial interactive wizard shipped at `app/onboarding/page.tsx` with bespoke step components, progress UI, and summary preview.
- (26/09/25 09:40) Fixed nested button markup to silence hydration warnings, expanded the onboarding grid to full-width container, and resized step layouts so cards render their content without clipping.
- (26/09/25 10:55) Added systems & operations steps, quiz gating, richer summaries, and go-live/compliance inputs; Next is disabled until required answers land.

*Prepared 25/09/25 13:45.*
