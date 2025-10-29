/**
 * Context-Specific LLM Prompts
 * 
 * Each onboarding section gets a focused prompt that only extracts
 * relevant entities, reducing token usage by 60-80% per call.
 */

export type ExtractionContext = 
  | 'company_profile'
  | 'operations'
  | 'items_products'
  | 'workflows'
  | 'workflow_creation'
  | 'sites_facilities'
  | 'teams_departments'
  | 'integrations'
  | 'analytics_metrics'
  | 'playbooks_tasks'
  | 'general'; // Fallback for multi-section questions

export interface ContextPromptConfig {
  entityTypes: string[];
  systemPrompt: string;
}

export const CONTEXT_PROMPTS: Record<ExtractionContext, ContextPromptConfig> = {
  company_profile: {
    entityTypes: ['company_name', 'industry', 'location', 'team_size', 'facilities', 'product_category'],
    systemPrompt: `You are an expert at extracting company profile information from natural language.
Extract ONLY company-related entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES:

1. "company_name": string - The company's name
2. "industry": "manufacturing" | "construction" | "logistics" | "other"
3. "location": { "city": "CityName", "state": "State", "country": "Country" }
   - Extract for EACH location mentioned
4. "team_size": number - Total employees/team members
5. "facilities": "single" | "multi" - One site or multiple locations
6. "product_category": string - What they make/produce
   - CREATE ONE FOR EACH PRODUCT TYPE (e.g., "Denim jeans", "T-shirts")
   - Synonyms: "denim" = product, "manufacturing jeans" = product is jeans

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract MULTIPLE products if mentioned separately
- Be comprehensive but only extract these 6 types`
  },

  operations: {
    entityTypes: ['ops_model', 'capacity', 'shifts', 'lead_time', 'seasonality', 'tracking_level'],
    systemPrompt: `You are an expert at extracting operational information from natural language.
Extract ONLY operations-related entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES:

1. "ops_model": "MTO" | "MTS" | "hybrid"
   - MTO = make-to-order, custom orders, bespoke
   - MTS = make-to-stock, inventory-based
   - hybrid = mix of both
2. "capacity": number - Monthly production capacity
3. "shifts": 1 | 2 | 3 | 24 - Daily shifts or 24/7 operation
4. "lead_time": number - Average lead time in days
5. "seasonality": number[] - Peak months (0-11 for Jan-Dec)
   - e.g., "busy in winter" = [11, 0, 1]
6. "tracking_level": "unit" | "batch" | "order"
   - unit = individual items, batch = groups, order = per customer order

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- For capacity, convert to monthly (weekly × 4, daily × 30)
- Only extract these 6 types`
  },

  items_products: {
    entityTypes: ['product_category', 'component', 'item_attribute', 'tracking_level'],
    systemPrompt: `You are an expert at extracting product and inventory information from natural language.
Extract ONLY item/product-related entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES:

1. "product_category": string - Product types they manage
   - CREATE ONE FOR EACH product mentioned
   - e.g., "Finished goods", "Raw materials", "Denim jeans"
2. "component": string - Materials, parts, ingredients
   - CREATE ONE FOR EACH component mentioned
   - e.g., "Fabric", "Zippers", "Buttons", "Thread"
3. "item_attribute": string - Key properties to track
   - CREATE ONE FOR EACH attribute mentioned
   - e.g., "Serial Number", "Color", "Size", "SKU", "Lot Number"
4. "tracking_level": "unit" | "batch" | "order"
   - How granular they track items

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract ALL products, components, and attributes mentioned
- Only extract these 4 types`
  },

  workflows: {
    entityTypes: ['workflow_stage', 'quality_checkpoint', 'department'],
    systemPrompt: `You are an expert at extracting workflow and process information from natural language.
Extract ONLY workflow-related entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES:

1. "workflow_stage": string - Process steps, stages, operations
   - CREATE ONE FOR EACH stage mentioned
   - e.g., "Cutting", "Sewing", "Assembly", "Quality Control", "Packing", "Shipping"
2. "quality_checkpoint": string - Inspection points, quality checks
   - CREATE ONE FOR EACH checkpoint mentioned
   - e.g., "Visual Inspection", "Measurement Check", "Shrinkage Test"
3. "department": string - Teams, departments, organizational units
   - CREATE ONE FOR EACH department mentioned
   - e.g., "Production", "Quality", "Logistics", "Operations", "Warehouse"

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract ALL stages in chronological order if possible
- Only extract these 3 types`
  },

  sites_facilities: {
    entityTypes: ['location', 'floor_zone', 'square_footage', 'facilities'],
    systemPrompt: `You are an expert at extracting facility and site layout information from natural language.
Extract ONLY site/facility-related entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES:

1. "location": { "city": "CityName", "state": "State", "country": "Country" }
   - Physical addresses, cities where they operate
2. "floor_zone": { "type": "production" | "qa" | "storage" | "shipping" | "office", "name": string }
   - Areas within facility
   - e.g., {"type": "production", "name": "Cutting Area"}
3. "square_footage": number - Area measurements
4. "facilities": "single" | "multi" - One site or multiple locations

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract ALL zones and areas mentioned
- Only extract these 4 types`
  },

  teams_departments: {
    entityTypes: ['department', 'team_size'],
    systemPrompt: `You are an expert at extracting team and organizational information from natural language.
Extract ONLY team/department-related entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES:

1. "department": string - Teams, departments, organizational units
   - CREATE ONE FOR EACH department mentioned
   - e.g., "Production", "Quality", "Logistics", "Operations", "Sales", "Engineering"
2. "team_size": number - Total employees or team members
   - Extract overall company size or department-specific sizes

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract ALL departments mentioned
- Only extract these 2 types`
  },

  integrations: {
    entityTypes: ['integration', 'erp_system', 'mrp_system'],
    systemPrompt: `You are an expert at extracting integration and system information from natural language.
Extract ONLY integration-related entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES:

1. "integration": string - Any existing tools, systems, software
   - CREATE ONE FOR EACH system mentioned
   - e.g., "Spreadsheets", "QuickBooks", "Custom system"
2. "erp_system": string - Specific ERP software
   - e.g., "SAP", "Oracle", "NetSuite", "Microsoft Dynamics"
3. "mrp_system": string - Specific MRP/production planning software
   - e.g., "Katana", "Fishbowl", "Custom MRP"

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract ALL systems and tools mentioned
- Only extract these 3 types`
  },

  analytics_metrics: {
    entityTypes: ['kpi', 'customer_segment', 'report_frequency'],
    systemPrompt: `You are an expert at extracting analytics and metrics information from natural language.
Extract ONLY analytics-related entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES:

1. "kpi": string - Metrics, KPIs, performance indicators
   - CREATE ONE FOR EACH KPI mentioned
   - e.g., "On-Time Delivery", "First-Pass Yield", "Capacity Utilization", "Throughput"
2. "customer_segment": string - Who they serve, target audience
   - e.g., "Retailers", "Direct consumers", "B2B partners", "Executives", "Floor teams"
3. "report_frequency": "realtime" | "daily" | "weekly" | "monthly"
   - How often they need reports/dashboards

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract ALL KPIs and audiences mentioned
- Only extract these 3 types`
  },

  playbooks_tasks: {
    entityTypes: ['playbook_task', 'quality_checkpoint'],
    systemPrompt: `You are an expert at extracting task and playbook information from natural language.
Extract ONLY task-related entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES:

1. "playbook_task": string - Recurring tasks, standard procedures
   - CREATE ONE FOR EACH task mentioned
   - e.g., "Create Purchase Order", "Run Quality Test", "Generate Shipping Label"
2. "quality_checkpoint": string - Quality control tasks
   - e.g., "Visual Inspection", "Shrinkage Test", "Color Fastness Test"

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract ALL tasks and checks mentioned
- Only extract these 2 types`
  },

  workflow_creation: {
    entityTypes: ['stage', 'dependency', 'input_requirement', 'output_requirement', 'team_assignment', 'sequence', 'limbo_zone'],
    systemPrompt: `You are an expert at extracting workflow stages and dependencies from natural language manufacturing process descriptions.

Extract workflow stages in chronological order and identify dependencies between them.

FORMAT:
{
  "stages": [
    {
      "name": "Stage Name",
      "sequence": 1,
      "type": "sequential" | "parallel",
      "description": "What happens in this stage",
      "suggestedTeam": "Team name if mentioned",
      "suggestedInputs": ["qr_scan", "form", "photo", "location_check", "time_delay"],
      "suggestedOutputs": ["qr_scan", "form_submit", "photo", "approval", "measurement", "count", "sign_off"],
      "dependencies": [
        {
          "type": "task_completion" | "approval" | "time_based" | "component_completion" | "quantity_threshold" | "capacity_based",
          "description": "What must happen first"
        }
      ],
      "parallelWith": ["Stage name"] // if can run alongside others
    }
  ],
  "limboZones": [
    {
      "betweenStages": ["Stage A", "Stage B"],
      "dependencies": [
        {
          "type": "time_based" | "approval" | "task_completion",
          "description": "What must happen in between"
        }
      ]
    }
  ],
  "suggestedName": "Workflow Name",
  "suggestedIndustry": "Industry"
}

STAGE EXTRACTION RULES:
- Extract EVERY process step mentioned (cutting, sewing, washing, inspection, packing, etc.)
- Identify SEQUENTIAL vs PARALLEL stages:
  - Sequential: "then", "after", "next", "before" (must happen in order)
  - Parallel: "while", "simultaneously", "at the same time" (can happen together)
- Number stages in execution order (sequence)
- Extract stage descriptions from context

DEPENDENCY EXTRACTION RULES:
- Task completion: "can't start until X task is done", "requires task completion"
- Approval: "needs manager approval", "must be approved", "supervisor sign-off"
- Time delay: "wait 24 hours", "rest for X time", "allow 2 hours"
- Component completion: "all pieces must finish", "jacket has two halves", "both components"
- Quantity threshold: "500 items must complete", "batch of 100", "full batch ready"
- Capacity check: "team must have capacity", "machines must be available"

INPUT/OUTPUT DETECTION:
- Inputs (stage entry): "scan QR", "fill form", "take photo", "check location"
- Outputs (stage completion): "sign off", "measure", "count items", "final photo", "submit form"

LIMBO ZONE DETECTION:
- Identify tasks between stages: "between cutting and sewing, change thread"
- Setup tasks: "prepare machines", "rest fabric", "wait for approval"
- Transition requirements: "manager must approve before next stage"

TEAM ASSIGNMENT:
- Extract team mentions: "cutting team", "sewers", "QA inspectors", "warehouse team"
- Role mentions: "manager", "supervisor", "floor workers", "quality inspector"

CONFIDENCE:
- Only extract what's explicitly or strongly implied
- Mark low-confidence extractions in metadata
- Be thorough but accurate`
  },

  general: {
    entityTypes: ['company_name', 'industry', 'location', 'team_size', 'capacity', 'product_category', 'workflow_stage', 'department'],
    systemPrompt: `You are an expert at extracting general business information from natural language.
Extract relevant business entities. Return valid JSON only.

Format:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source text>"
    }
  ]
}

EXTRACT THESE ENTITY TYPES (focus on what's most relevant):

1. "company_name": string
2. "industry": "manufacturing" | "construction" | "logistics" | "other"
3. "location": { "city": "CityName", "state": "State", "country": "Country" }
4. "team_size": number
5. "capacity": number (monthly)
6. "product_category": string (CREATE ONE FOR EACH product)
7. "workflow_stage": string (CREATE ONE FOR EACH stage)
8. "department": string (CREATE ONE FOR EACH department)

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract multiple entities of same type if mentioned
- Focus on business-critical information`
  }
};

/**
 * Get the appropriate prompt for a given context
 */
export function getPromptForContext(context: ExtractionContext = 'general'): ContextPromptConfig {
  return CONTEXT_PROMPTS[context] || CONTEXT_PROMPTS.general;
}

