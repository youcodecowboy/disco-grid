# Groovy Onboarding — Company (Fashion Manufacturing)

### Purpose

Collect high-signal company context for fashion manufacturers in a conversational flow, while mapping natural-language answers to canonical enums/booleans needed to generate the app configuration.

---

## Table: Questions, Types, Enums, Follow-ups

| Section | Entity Key | Question (user-facing) | Type | Options / Enum (canonical) | Follow-ups (Type) | Required | Purpose / Notes |
|----------|-------------|------------------------|------|-----------------------------|-------------------|-----------|-----------------|
| Company | `company.name` | What's your company name? | text | – | – | ✅ | Primary identifier for workspace and docs. |
| Company | `company.description` | In a few sentences, how would you describe your company? | long-text | – | Suggest category? (buttons: `Manufacturer`, `Brand`, `Both`) | ✅ | Seeding tone + quick self-identity. |
| Company | `company.founded_year` | What year were you founded? | number (YYYY) | – | – | ❌ | Maturity signal for defaults/reporting. |
| Company | `company.hq_location` | Where is your HQ based? (City, Country) | text | – | Operate in multiple locations? (yes/no) → if yes: `company.locations` (chips/multi-text) | ✅ | Timezone, logistics, compliance hints. |
| Company | `company.manufacturer_type` | What type of manufacturer are you? | single-select | `MTO`, `Stock`, `WhiteLabel`, `Mixed`, `Other` | If `Other`: describe (short-text) → `company.manufacturer_type_other` | ✅ | Activates order vs. stock modules. |
| Company | `company.client_type` | Who do you primarily serve? | single-select | `Brands`, `Distributors`, `EndCustomers`, `Mixed` | – | ✅ | Determines buyer/seller app side. |
| Company | `company.own_brand` | Do you sell your own branded products? | yes/no | – | If yes: `company.sales_channels` (multi-select: `Online`, `Retail`, `Wholesale`) | ❌ | Enables D2C features if yes. |
| Company | `company.team_size_total` | Roughly how many people work at your company? | number | – | Split approx? `company.team_split_production` and `company.team_split_management` (numbers) | ✅ | Seats, permissions, UX defaults. |
| Company | `company.capacity_monthly_pcs` | What's your current monthly production capacity (pcs/month)? | number | – | Do you typically run at full capacity? (yes/no) → `company.capacity_utilization_full` | ✅ | Throughput modeling + alerts. |
| Company | `company.capacity_increase_plan` | Do you plan to increase capacity in the next 12 months? | yes/no | – | If yes: By ~what %? → `company.capacity_increase_pct` (number) | ❌ | Forecasting + roadmap nudges. |
| Company | `company.product_types` | What products do you primarily produce? | multi-select | `Jeans`, `Jackets`, `Shirts`, `Dresses`, `Skirts`, `Shorts`, `Accessories`, `Other` | If `Other`: list (chips/multi-text) | ✅ | Seeds item taxonomy + workflows. |
| Company | `company.primary_product` | Which product is your main volume driver? | single-select (from previous) | – | – | ❌ | Focuses dashboards + KPIs. |
| Company | `company.materials_list` | What materials/fabrics do you commonly use? | chips/multi-text | – | Track materials separately (SKUs/rolls/lots)? (yes/no) → `company.track_materials` | ❌ | Enables material-level inventory. |
| Company | `company.demand_spikes_months` | Do you have demand spikes during the year? Select months that spike. | multi-select | Months `Jan–Dec` | – | ❌ | Replaces "seasonal vs continuous". Drives staffing/inventory prep. |
| Company | `company.slow_months` | Which months are typically slow? | multi-select | Months `Jan–Dec` | – | ❌ | Capacity smoothing + forecast seasonality. |
| Company | `company.decision_maker_title` | Who usually makes day-to-day operational decisions? (role/title) | short-text | – | Create them an admin account later? (yes/no) → `company.admin_account_create` | ❌ | Early role mapping (optional invite). |
| Company | `company.biggest_challenge_text` | What's the biggest challenge you want Groovy to solve first? | long-text | – | Does this relate most to… (buttons) → `company.challenge_category`: `ProductionFlow`, `DataVisibility`, `Communication`, `Quality`, `LeadTime`, `Costs` | ✅ | Aligns expectations + first dashboards. |
| Company | `company.long_term_goal_text` | In plain words, what's your 12–18 month goal? | long-text | – | Map goal style (buttons) → `company.goal_category`: `Maintain`, `Expand`, `AggressiveExpand`, `Efficiency`, `Profitability`, `Quality` | ✅ | NL→enum for app defaults and prompts. |
| Company | `company.success_12mo_text` | What would "success in 12 months" look like? | long-text | – | Enable KPI tracking towards this? (yes/no) → `company.enable_kpi_tracking` | ❌ | Auto-create KPI set + review cadence. |
| Company | `company.compliance_has` | Do you hold any certifications/audits? | yes/no | – | If yes: `company.compliance_list` (multi-select: `BSCI`, `WRAP`, `ISO9001`, `ISO14001`, `Sedex`, `GOTS`, `Other`) | ❌ | Enables compliance module setup. |
| Company | `company.compliance_markets` | Do clients/markets enforce specific compliance? Which ones? | chips/multi-text | – | – | ❌ | Market rules → doc reminders. |
| Company | `company.compliance_reminders` | Should Groovy manage audit/renewal reminders? | yes/no | – | – | ❌ | Turns on reminders + owners. |

---

## Enum Dictionaries (Canonical Targets)

```ts
export const ENUMS = {
  manufacturer_type: ['MTO','Stock','WhiteLabel','Mixed','Other'] as const,
  client_type: ['Brands','Distributors','EndCustomers','Mixed'] as const,
  sales_channels: ['Online','Retail','Wholesale'] as const,
  product_types: ['Jeans','Jackets','Shirts','Dresses','Skirts','Shorts','Accessories','Other'] as const,
  months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] as const,
  challenge_category: ['ProductionFlow','DataVisibility','Communication','Quality','LeadTime','Costs'] as const,
  goal_category: ['Maintain','Expand','AggressiveExpand','Efficiency','Profitability','Quality'] as const,
  compliance_list: ['BSCI','WRAP','ISO9001','ISO14001','Sedex','GOTS','Other'] as const
}
```

---

## NL → Enum Mapping Rules

(You can paste these into your LLM system prompt or function config for entity extraction.)

### manufacturer_type
- "made to order", "on-demand", "custom", "MTO" → MTO
- "stock", "ready stock", "warehouse", "inventory" → Stock
- "white label", "private label" → WhiteLabel
- "mix", "both", "hybrid" → Mixed
- else → Other

### client_type
- "brands", "labels", "fashion houses" → Brands
- "distributors", "wholesalers" → Distributors
- "direct to consumer", "D2C", "sell online to customers" → EndCustomers
- multiple → Mixed

### sales_channels
- "website", "shopify", "amazon" → Online
- "store", "retail", "boutique" → Retail
- "wholesale", "B2B" → Wholesale

### product_types
- map garments directly; if unmatched, mark Other

### challenge_category
- "bottlenecks", "WIP stuck", "routing" → ProductionFlow
- "visibility", "reporting", "tracking" → DataVisibility
- "communication", "handoffs", "updates" → Communication
- "defects", "returns", "quality control" → Quality
- "lead time", "speed" → LeadTime
- "margins", "cost", "profit" → Costs

### goal_category
- "maintain", "steady", "same clients" → Maintain
- "grow", "expand", "more capacity" → Expand
- "double", "new markets", "aggressive" → AggressiveExpand
- "efficiency", "reduce waste", "lean" → Efficiency
- "profit", "margin", "finance" → Profitability
- "quality", "craftsmanship" → Quality

---

## Confirmation & Confidence

- Each NL-parsed field stores value, source_span, and confidence.
- If confidence < 0.75, trigger conversational follow-up or a Confirm & Edit card.
- Checkpoints after: Identity → Model/Clients → Scale/Capacity → Products/Materials → Seasonality → Goals → Compliance.

**Example checkpoint UI copy:**

"We captured Monthly capacity = 25,000 pcs from your earlier answer. Is this correct? (Yes / Edit)"

---

## Example output shape

```json
{
  "company": {
    "name": "Groovy Labs Denim",
    "description": "Mid-size MTO denim manufacturer with six sites and 45 staff.",
    "founded_year": 2019,
    "hq_location": "Istanbul, Türkiye",
    "locations": ["Istanbul","Izmir"],
    "manufacturer_type": "MTO",
    "client_type": "Brands",
    "own_brand": false,
    "team_size_total": 45,
    "team_split_production": 36,
    "team_split_management": 9,
    "capacity_monthly_pcs": 25000,
    "capacity_utilization_full": true,
    "capacity_increase_plan": true,
    "capacity_increase_pct": 40,
    "product_types": ["Jeans","Jackets"],
    "primary_product": "Jeans",
    "materials_list": ["13oz indigo denim","selvedge","hardware: YKK"],
    "track_materials": true,
    "demand_spikes_months": ["Mar","Aug","Nov"],
    "slow_months": ["Jan","Jul"],
    "decision_maker_title": "Head of Production",
    "admin_account_create": true,
    "biggest_challenge_text": "We lose track of WIP and status updates to brands.",
    "challenge_category": "DataVisibility",
    "long_term_goal_text": "Increase capacity 40% without hurting margins.",
    "goal_category": "Efficiency",
    "success_12mo_text": "Lead time <14 days, first-time-right 98%.",
    "enable_kpi_tracking": true,
    "compliance_has": true,
    "compliance_list": ["BSCI","Sedex"],
    "compliance_markets": ["EU","UK"],
    "compliance_reminders": true
  }
}
```

