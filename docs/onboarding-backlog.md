# Onboarding Backlog — 26/09/25 10:55

Working list that tracks everything we still owe the onboarding wizard before the demo, plus the follow-on agentic work.

## Immediate Demo Polish
- Add “This or That” component presentation picker (table-first vs. KPI-first vs. map-first) so presets feel co-designed.
- Polish quick-edit chip styles and accent previews to match the richer onboarding cards.
- Layer friendly microcopy/tooltips on new cards so first-time users know why we ask each question.
- Transition wizard to a sequential reveal (one active card at a time) with dimmed history blocks and auto-scroll.

## Agentic Foundations
- Define a state machine map describing which questions unlock next based on natural-language answers.
- Capture freeform “biggest pain / desired outcome” text and route it into an intent parser stub.
- Instrument each card interaction (selection, slider, text input) so the future agent can observe choices in-session.
- Sketch API contract for an "Onboarding Orchestrator" agent: inputs (current state, user utterance), outputs (next question, block template).
- Allow optional “Let the assistant choose for me" toggles that will later delegate to the agent.

## UX Enhancements
- Add lightweight iconography/illustrations to industry tiles and floorplan zones to boost approachability.
- Introduce explanatory tooltips / info badges that preview how a given answer impacts the generated workspace.
- Swap static floorplan legend for a live key with zone totals and color swatches; add undo/clear controls.
- Persist per-step block positions within the session so any rearranging sticks when users revisit a step.

## Step Gates & Question Trees
- ✅ Systems step branches on inventory/ERP/import strategy and records integration priority (26/09/25).
- ✅ Capacity step captures tracking lens + seasonal spikes, unlocking peak-month chips (26/09/25).
- ✅ Floorplan step now asks about existing CAD assets and unit preference (26/09/25).
- ✅ Operations step gathers audience + chart preference for dashboard presets (26/09/25).
- Still to add: dynamic follow-up prompts (offer SKU templates when no system exists, surface import helpers, etc.).

## Decision Tree Inputs to Add
- **Sites, floors, zones:** quick counts, default zone palette; drives facility pages, queue filters, map blocks.
- **Traceability level:** unit vs lot vs kit/container; influences item detail schema, labels, custody panels.
- **Process preset:** choose between apparel flow vs generic assembly; sets workflow template, queue layout, operator view.
- **Order & item mode:** make-to-order/make-to-stock, unit vs batch, variant complexity; impacts order wizard, item generator, table columns.
- **External visibility:** brand portal toggle + data scope; configures share grants and brand dashboards.
- **Scanning & labels:** QR vs 1D (RFID later), label field defaults; drives scan blocks and label previews.
- **Bins & locations:** bin usage toggles and types; seeds bin pages and transfer behaviors.
- **Teams & scopes:** starter teams, zone coverage, access scope; informs permissions and filters.
- **SLA & alerts:** lead time, checkpoints, backlog thresholds; feeds KPI targets and alert panels.
- **Dashboard priorities:** top KPIs + chart shells; maps directly to Mission Control preset ordering.
- **Styling & mood:** palette intensity, typography weight, motion preference; determines theme token adjustments for generated pages.

_Note: the manufacturing path now captures the inputs above (26/09/25); we still need agent wiring + persistence hooks._

## Branching Examples for Agent Hand-off
- If **existing ERP = yes + vendor = Netsuite**, queue integration tasks and propose order sync block in summary.
- If **traceability = kit/container**, auto-include kit detail view + child item tables in the suggested block list.
- If **brand portal enabled**, mark summary to include partner login CTA and show masked columns preview.
- If **QR scanning preferred + bins enabled**, recommend QR-coded bin labels and add “Scan to Bin” workflow notes.

## Future Nice-to-Haves
- Layered progress narrative: short copy at top of each step summarizing what the agent has “learned” so far.
- Multi-tenant support prompts (e.g., invite teammates now?) driving later share flows.
- Optional import paths (upload CSV of SKUs, upload existing floorplan) with stubbed parsing.

## Completed
- (26/09/25 09:40) Hydration and nested-button issues resolved so onboarding loads cleanly.
- (26/09/25 10:55) Added systems & operations grids with quiz gating, go-live/compliance intake, seasonality + SLA controls, and richer summary cards.
