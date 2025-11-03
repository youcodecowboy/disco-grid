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
  | 'playbook_creation'
  | 'playbook_refinement'
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
    entityTypes: [
      'company_name', 
      'company_description',
      'industry', 
      'location', 
      'hq_location',
      'team_size', 
      'team_size_total',
      'facilities', 
      'product_category',
      'product_types',
      'manufacturer_type',
      'client_type',
      'sales_channels',
      'own_brand',
      'capacity_monthly_pcs',
      'capacity_utilization_full',
      'capacity_increase_plan',
      'capacity_increase_pct',
      'materials_list',
      'track_materials',
      'founded_year',
      'decision_maker_title',
      'challenge_category',
      'goal_category',
      'biggest_challenge_text',
      'long_term_goal_text',
      'success_12mo_text',
      'compliance_has',
      'compliance_list',
      'compliance_markets'
    ],
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
2. "company_description": string - Full company description
3. "industry": "manufacturing" | "construction" | "logistics" | "other"
4. "location": { "city": "CityName", "state": "State", "country": "Country" }
   - Extract for EACH location mentioned
5. "hq_location": string - Headquarters location (City, Country format)
6. "team_size" or "team_size_total": number - Total employees/team members
7. "facilities": "single" | "multi" - One site or multiple locations
8. "product_category" or "product_types": string | string[] - What they make/produce
   - CREATE ONE FOR EACH PRODUCT TYPE (e.g., "Jeans", "Jackets", "Shirts")
   - Map to canonical values: Jeans, Jackets, Shirts, Dresses, Skirts, Shorts, Accessories, Other
9. "manufacturer_type": "MTO" | "Stock" | "WhiteLabel" | "Mixed" | "Other"
   - Mapping: "made to order", "on-demand", "custom", "MTO" → MTO
   - "stock", "ready stock", "warehouse", "inventory" → Stock
   - "white label", "private label" → WhiteLabel
   - "mix", "both", "hybrid" → Mixed
   - else → Other
10. "client_type": "Brands" | "Distributors" | "EndCustomers" | "Mixed"
    - Mapping: "brands", "labels", "fashion houses" → Brands
    - "distributors", "wholesalers" → Distributors
    - "direct to consumer", "D2C", "sell online to customers" → EndCustomers
    - multiple → Mixed
11. "sales_channels": string[] - "Online" | "Retail" | "Wholesale"
    - Mapping: "website", "shopify", "amazon" → Online
    - "store", "retail", "boutique" → Retail
    - "wholesale", "B2B" → Wholesale
12. "own_brand": boolean - Do they sell their own branded products?
13. "capacity_monthly_pcs": number - Monthly production capacity in pieces/units
14. "capacity_utilization_full": boolean - Running at full capacity?
15. "capacity_increase_plan": boolean - Planning to increase capacity?
16. "capacity_increase_pct": number - Percentage increase planned
17. "materials_list": string[] - Materials/fabrics commonly used
18. "track_materials": boolean - Track materials separately as SKUs/rolls/lots?
19. "founded_year": number - Year company was founded (YYYY)
20. "decision_maker_title": string - Role/title of decision maker
21. "challenge_category": "ProductionFlow" | "DataVisibility" | "Communication" | "Quality" | "LeadTime" | "Costs"
    - Mapping: "bottlenecks", "WIP stuck", "routing" → ProductionFlow
    - "visibility", "reporting", "tracking" → DataVisibility
    - "communication", "handoffs", "updates" → Communication
    - "defects", "returns", "quality control" → Quality
    - "lead time", "speed" → LeadTime
    - "margins", "cost", "profit" → Costs
22. "goal_category": "Maintain" | "Expand" | "AggressiveExpand" | "Efficiency" | "Profitability" | "Quality"
    - Mapping: "maintain", "steady", "same clients" → Maintain
    - "grow", "expand", "more capacity" → Expand
    - "double", "new markets", "aggressive" → AggressiveExpand
    - "efficiency", "reduce waste", "lean" → Efficiency
    - "profit", "margin", "finance" → Profitability
    - "quality", "craftsmanship" → Quality
23. "biggest_challenge_text": string - Text describing main challenge
24. "long_term_goal_text": string - Text describing 12-18 month goal
25. "success_12mo_text": string - Text describing success vision
26. "compliance_has": boolean - Hold certifications/audits?
27. "compliance_list": string[] - BSCI, WRAP, ISO9001, ISO14001, Sedex, GOTS, Other
28. "compliance_markets": string[] - Markets that enforce compliance (e.g., EU, UK, US)

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract MULTIPLE products if mentioned separately
- Use canonical enum values where specified
- Be comprehensive but accurate`
  },

  operations: {
    entityTypes: [
      'ops_model',
      'capacity',
      'shifts',
      'lead_time',
      'seasonality',
      'tracking_level',
      'overview_text',
      'stages_list',
      'stage_durations',
      'stage_buffer_use',
      'subcontract_use',
      'subcontract_stages',
      'subcontract_partners_consistent',
      'planning_method',
      'planning_method_other',
      'daily_planning_style',
      'target_output_metric',
      'target_output_qty',
      'track_materials_internally',
      'inventory_levels_tracked',
      'storage_system',
      'storage_system_other',
      'qr_or_barcode_use',
      'qc_stages',
      'qc_record_defects',
      'defect_rate_estimate',
      'total_lead_time_days',
      'delay_bottleneck_stage',
      'data_tracking_method',
      'data_tracking_tool',
      'data_entry_frequency',
      'biggest_bottleneck_text',
      'bottleneck_type',
      'auto_reports_interest',
      'auto_report_frequency',
      'delay_alert_interest'
    ],
    systemPrompt: `You are an expert at extracting operational and production flow information from natural language.
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

PRODUCTION FLOW:
1. "overview_text": string - Full production flow description
2. "stages_list": string[] - Array of production stage names (e.g., ["Cutting", "Sewing", "Washing", "Finishing", "Packing"])
   - Extract ALL stages mentioned in chronological order
   - Use exact names mentioned: "cutting" → "Cutting", "sewing line" → "Sewing"
3. "stage_durations": object - Stage name → duration in hours (e.g., {"Cutting": 0.5, "Sewing": 1.0})
   - Extract durations mentioned: "cutting takes 30 minutes" → {"Cutting": 0.5}
   - Convert to hours: "1 day" → 24, "2 hours" → 2, "30 minutes" → 0.5
4. "stage_buffer_use": boolean - Use buffer time between stages?

SUBCONTRACTING:
5. "subcontract_use": boolean - Do they subcontract any production?
6. "subcontract_stages": string[] - Which stages are subcontracted (from stages_list)
7. "subcontract_partners_consistent": boolean - Work with same partners regularly?

PLANNING:
8. "planning_method": "ManualBoard" | "Spreadsheet" | "ERP" | "Verbal" | "Other"
   - Mapping: "whiteboard", "notes on wall", "manual", "kanban board" → ManualBoard
   - "excel", "google sheets" → Spreadsheet
   - "ERP", "SAP", "netsuite", "system" → ERP
   - "verbally", "talk", "memory" → Verbal
   - else → Other
9. "planning_method_other": string - Description if "Other"
10. "daily_planning_style": "ByOrder" | "ByBatch" | "ByCapacity" | "Mixed"
    - Mapping: "by order", "order-based" → ByOrder
    - "by batch", "grouped by product" → ByBatch
    - "capacity slots", "machine hours", "takt time" → ByCapacity
    - multiple → Mixed
11. "target_output_metric": boolean - Have daily/weekly production target?
12. "target_output_qty": number - Target quantity (units per day/week)

INVENTORY & MOVEMENT:
13. "track_materials_internally": boolean - Track materials/stock movement?
14. "inventory_levels_tracked": string[] - ["Raw", "WIP", "Finished"]
    - Extract which types mentioned: "raw materials" → ["Raw"], "finished goods" → ["Finished"]
15. "storage_system": "DefinedBins" | "Racks" | "Carts" | "Mixed" | "Other"
    - Extract storage method mentioned
16. "storage_system_other": string - Description if "Other"
17. "qr_or_barcode_use": "None" | "Barcodes" | "QRCodes" | "Both"
    - Mapping: "none", "don't use" → None
    - "barcode", "UPC", "EAN" → Barcodes
    - "QR code", "QR labels" → QRCodes
    - "both" → Both

QUALITY CONTROL:
18. "qc_stages": string[] - Stages with quality checks (from stages_list)
19. "qc_record_defects": boolean - Record defect reasons?
20. "defect_rate_estimate": number - Percentage requiring rework (e.g., 3.2 for 3.2%)

LEAD TIME & DELAYS:
21. "total_lead_time_days": number - Total time from start to finish (days)
22. "delay_bottleneck_stage": string - Stage causing most delays (from stages_list)

DATA CAPTURE:
23. "data_tracking_method": "Paper" | "Spreadsheet" | "Software" | "Verbal" | "Other"
    - Mapping: "paper", "manual logs" → Paper
    - "excel", "sheet" → Spreadsheet
    - "software", "erp", "system" → Software
    - "verbal", "memory" → Verbal
    - else → Other
24. "data_tracking_tool": string - Tool name if "Software" (e.g., "Excel", "SAP")
25. "data_entry_frequency": "RealTime" | "Daily" | "Weekly" | "AfterCompletion" | "Never"
    - Extract frequency mentioned

PAIN POINTS:
26. "biggest_bottleneck_text": string - Text describing main bottleneck/delay
27. "bottleneck_type": "People" | "Machines" | "Data" | "Other"
    - Mapping: "operators", "staff", "training", "team" → People
    - "machines", "equipment", "breakdown" → Machines
    - "information", "tracking", "visibility" → Data
    - else → Other

AUTOMATION & REPORTING:
28. "auto_reports_interest": boolean - Want automated reports?
29. "auto_report_frequency": "Daily" | "Weekly" | "Monthly" - If interested
30. "delay_alert_interest": boolean - Want delay alerts?

LEGACY FIELDS (for backward compatibility):
31. "ops_model": "MTO" | "MTS" | "hybrid"
32. "capacity": number - Monthly production capacity
33. "shifts": 1 | 2 | 3 | 24 - Daily shifts
34. "lead_time": number - Average lead time in days
35. "seasonality": number[] - Peak months (0-11 for Jan-Dec)
36. "tracking_level": "unit" | "batch" | "order"

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract stages_list as separate string entities (one per stage)
- For stage_durations, create object with stage names as keys
- Convert all durations to hours
- Use canonical enum values where specified
- Be comprehensive but accurate`
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
    entityTypes: [
      'sites_count',
      'site_name',
      'site_address',
      'site_is_primary',
      'site_handles_shipping',
      'floors_count',
      'floor_name',
      'zone_tag',
      'zone_name',
      'zone_people_count',
      'zone_has_machines',
      'zone_machine_count',
      'zone_machine_types',
      'zone_has_storage',
      'zone_storage_type',
      'zone_storage_capacity',
      'flow_between_floors',
      'flow_transport_methods',
      'external_flow',
      'external_flow_locations',
      'external_flow_duration_days',
      'receiving_area_exists',
      'receiving_floor',
      'receiving_responsible',
      'dispatch_area',
      'dispatch_wait_time',
      'shifts_count',
      'shifts_shared_workstations',
      'environment_tracking_interest',
      'has_environment_sensors',
      'bottleneck_location_text',
      'bottleneck_cause'
    ],
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

SITE IDENTIFICATION:
1. "sites_count": number - How many factory sites/locations?
2. "site_name": string - Name of site (e.g., "Main Factory", "Warehouse A")
3. "site_address": string - Location address (city, country)
4. "site_is_primary": boolean - Is this the main site?
5. "site_handles_shipping": boolean - Does this site handle logistics?

FLOOR STRUCTURE:
6. "floors_count": number - How many floors/levels?
7. "floor_name": string - Floor names (e.g., "Cutting & Sewing", "Storage & Dispatch")
   - CREATE ONE FOR EACH floor mentioned

ZONES:
8. "zone_tag": "Cutting" | "Sewing" | "Washing" | "Finishing" | "QC" | "Storage" | "Office" | "Packing" | "Loading" | "Other"
   - Mapping: "cutting", "fabric prep" → Cutting
   - "sewing", "stitching" → Sewing
   - "wash", "laundry" → Washing
   - "finish", "ironing", "tagging" → Finishing
   - "qc", "quality check", "inspection" → QC
   - "storage", "inventory", "rack room" → Storage
   - "office", "admin" → Office
   - "packing", "boxing" → Packing
   - "loading", "shipping" → Loading
   - else → Other
9. "zone_name": string - Zone names (e.g., "Cutting Area", "Sewing Line 1")
   - CREATE ONE FOR EACH zone mentioned
10. "zone_people_count": number - People working in zone
11. "zone_has_machines": boolean - Zone contains machines?
12. "zone_machine_count": number - Number of machines
13. "zone_machine_types": string[] - Machine types: ["Sewing", "Cutting", "Washing", "Ironing", "Embroidery", "Other"]
14. "zone_has_storage": boolean - Zone has storage?
15. "zone_storage_type": "Racks" | "Bins" | "Hanging" | "Mixed" | "Other"
16. "zone_storage_capacity": number - Storage capacity (items)

FLOW & MOVEMENT:
17. "flow_between_floors": boolean - Items move between floors?
18. "flow_transport_methods": string[] - ["Elevator", "Stairs", "Carts", "ManualCarry", "Other"]
    - Mapping: "elevator", "lift" → Elevator
    - "stairs" → Stairs
    - "cart", "trolley", "push cart" → Carts
    - "carry", "by hand" → ManualCarry
    - else → Other
19. "external_flow": boolean - Items leave site mid-production?
20. "external_flow_locations": string - Where items go (e.g., "Local Washer")
21. "external_flow_duration_days": number - How long items are out (days)

LOGISTICS:
22. "receiving_area_exists": boolean - Dedicated receiving area?
23. "receiving_floor": string - Which floor for receiving?
24. "receiving_responsible": string - Who handles receiving?
25. "dispatch_area": "GroundFloor" | "Basement" | "LoadingDock" | "SharedWarehouse" | "Other"
26. "dispatch_wait_time": number - Wait time before shipping (hours/days)

WORKFORCE:
27. "shifts_count": number - How many shifts per day?
28. "shifts_shared_workstations": boolean - Shifts share workstations?

ENVIRONMENT:
29. "environment_tracking_interest": boolean - Track environmental factors?
30. "has_environment_sensors": boolean - Existing sensors?

BOTTLENECKS:
31. "bottleneck_location_text": string - Where items pile up/slow down
32. "bottleneck_cause": "Space" | "Layout" | "Coordination" | "Other"
    - Mapping: "space", "too crowded" → Space
    - "layout", "distance", "pathway" → Layout
    - "coordination", "timing", "handoffs" → Coordination
    - else → Other

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract ALL sites, floors, zones mentioned
- Use canonical enum values where specified
- CREATE MULTIPLE entities for arrays (one per item)`
  },

  teams_departments: {
    entityTypes: [
      'total_people',
      'department',
      'departments_list',
      'department_sizes',
      'supervisor',
      'reporting_line',
      'role_type',
      'role_counts',
      'shift_structure',
      'shift_lead_overlap',
      'communication_method',
      'communication_tool',
      'meeting_frequency',
      'training_method',
      'training_host_interest',
      'cross_training_level',
      'cross_training_links',
      'issue_ownership_style',
      'auto_assign_issues',
      'performance_tracking',
      'performance_metrics',
      'rewards_exist',
      'rewards_method',
      'hiring_method',
      'hiring_integration_interest',
      'management_focus_text',
      'management_kpi_tracking'
    ],
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

ORG STRUCTURE:
1. "total_people": number - Total number of employees
2. "department": string - Department names
   - CREATE ONE FOR EACH department mentioned
   - Use canonical: "Cutting", "Sewing", "Washing", "Finishing", "QC", "Packing", "Maintenance", "Admin", "Logistics", "Management", "Other"
3. "departments_list": string[] - Array of all departments
4. "department_sizes": object - Department name → number of people (e.g., {"Cutting": 8, "Sewing": 20})

SUPERVISORS & LEADERSHIP:
5. "supervisor": { "department": string, "name": string } - Supervisor information
   - CREATE ONE FOR EACH supervisor mentioned
6. "reporting_line": { "from": string, "to": string } - Reporting relationships
   - e.g., {"from": "Meryem", "to": "Production Manager"}

ROLES & FUNCTIONS:
7. "role_type": string - Role types
   - Use canonical: "Operators", "Supervisors", "QualityInspectors", "Maintenance", "Logistics", "Admin", "Management", "Other"
   - CREATE ONE FOR EACH role type mentioned
8. "role_counts": object - Role type → number (e.g., {"Operators": 35, "Supervisors": 4})

SHIFTS & SCHEDULING:
9. "shift_structure": "SingleShift" | "TwoShifts" | "ThreeShifts" | "Variable"
   - Mapping: "one shift", "day only" → SingleShift
   - "two", "morning/evening", "day and night" → TwoShifts
   - "three", "24-hour" → ThreeShifts
   - "rotating", "variable" → Variable
10. "shift_lead_overlap": boolean - Are shift leads same as supervisors?

COMMUNICATION:
11. "communication_method": "Verbal" | "WhatsApp" | "Paper" | "WalkieTalkie" | "Software" | "Mixed" | "Other"
    - Mapping: "talk", "verbal", "in person" → Verbal
    - "whatsapp", "telegram", "signal" → WhatsApp
    - "paper", "clipboard", "forms" → Paper
    - "walkie", "radio" → WalkieTalkie
    - "software", "ERP chat", "slack" → Software
    - combos → Mixed
12. "communication_tool": string - Specific tool name if Software
13. "meeting_frequency": "Daily" | "Weekly" | "BiWeekly" | "Monthly" | "AdHoc"

TRAINING & SKILLS:
14. "training_method": "Shadowing" | "FormalSessions" | "VideoGuides" | "Mixed" | "Other"
15. "training_host_interest": boolean - Want Groovy to host training?
16. "cross_training_level": "Low" | "Medium" | "High"
    - Mapping: "only in one area" → Low
    - "some overlap", "a few people move around" → Medium
    - "most can do multiple jobs" → High
17. "cross_training_links": string[] - Departments that share staff

ACCOUNTABILITY:
18. "issue_ownership_style": "Supervisor" | "Manager" | "QC" | "TeamLead" | "Mixed"
    - Mapping: "supervisor handles", "line lead" → Supervisor
    - "manager", "production head" → Manager
    - "qc team", "inspection" → QC
    - "team lead", "operator in charge" → TeamLead
    - "depends", "varies" → Mixed
19. "auto_assign_issues": boolean - Auto-assign issues?

PERFORMANCE & REWARDS:
20. "performance_tracking": "Individual" | "Team" | "Both" | "None"
21. "performance_metrics": string[] - ["Output", "Quality", "Attendance", "Efficiency", "Other"]
22. "rewards_exist": boolean - Offer incentives?
23. "rewards_method": string - How rewards are determined

HR & ADMIN:
24. "hiring_method": "Referral" | "Agency" | "DirectHire" | "Mixed" | "Other"
25. "hiring_integration_interest": boolean - Want hiring integration?

LEADERSHIP VISION:
26. "management_focus_text": string - Management priorities for next 6-12 months
27. "management_kpi_tracking": boolean - Track KPIs against goals?

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract ALL departments, roles, supervisors mentioned
- Use canonical enum values where specified
- CREATE MULTIPLE entities for arrays (one per item)`
  },

  integrations: {
    entityTypes: [
      'digital_tools_level',
      'production_system',
      'production_system_name',
      'inventory_system',
      'inventory_system_name',
      'order_system',
      'order_platforms',
      'accounting_system',
      'accounting_system_name',
      'communication_tools',
      'communication_other',
      'file_storage_system',
      'reporting_method',
      'reporting_frequency',
      'data_sharing_partners',
      'data_sharing_format',
      'data_backup_method',
      'data_backup_frequency',
      'data_challenges_text',
      'priority_issue_flag',
      'integration_interest'
    ],
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

DIGITAL MATURITY:
1. "digital_tools_level": "None" | "Basic (Excel/Sheets)" | "Intermediate (ERP/CRM)" | "Advanced (Integrated Systems)"

PRODUCTION DATA:
2. "production_system": "Paper" | "Spreadsheet" | "ERP" | "CustomSoftware" | "Other"
   - Mapping: "handwritten", "manual logs", "clipboards" → Paper
   - "excel", "google sheets" → Spreadsheet
   - "erp", "netsuite", "sap", "zoho" → ERP
   - "our own software", "custom tool" → CustomSoftware
   - else → Other
3. "production_system_name": string - Specific system name if ERP/CustomSoftware

INVENTORY TRACKING:
4. "inventory_system": "None" | "Paper" | "Spreadsheet" | "ERP" | "WMS" | "Other"
   - Same mapping as production_system
5. "inventory_system_name": string - Specific system name if ERP/WMS

ORDER MANAGEMENT:
6. "order_system": "Paper" | "Spreadsheet" | "ERP" | "ECommerce" | "Email" | "Other"
7. "order_platforms": string[] - ["Shopify", "WooCommerce", "Custom", "Other"]
   - Extract if ECommerce is mentioned

ACCOUNTING & FINANCE:
8. "accounting_system": "None" | "Manual" | "Excel" | "QuickBooks" | "Xero" | "ERP" | "Other"
9. "accounting_system_name": string - Specific system name if ERP/Other

COMMUNICATION:
10. "communication_tools": string[] - ["Verbal", "WhatsApp", "Email", "Slack", "Teams", "ERPChat", "Other"]
    - Mapping: "whatsapp", "telegram", "wechat" → WhatsApp
    - "email", "gmail", "outlook" → Email
    - "slack" → Slack
    - "teams" → Teams
    - "verbal", "talk", "meetings" → Verbal
    - "erp chat", "internal system" → ERPChat
    - CREATE ONE FOR EACH tool mentioned
11. "communication_other": string - Other communication tools

FILE STORAGE:
12. "file_storage_system": string[] - ["LocalComputer", "GoogleDrive", "Dropbox", "OneDrive", "ERP", "Paper", "Other"]
    - Mapping: "google drive", "gdrive" → GoogleDrive
    - "dropbox" → Dropbox
    - "onedrive", "sharepoint" → OneDrive
    - "computer", "local", "desktop" → LocalComputer
    - "paper", "files cabinet" → Paper
    - "erp" → ERP
    - CREATE ONE FOR EACH storage system mentioned

REPORTING & ANALYTICS:
13. "reporting_method": "PaperReports" | "ExcelDashboards" | "ERP" | "None" | "Other"
    - Mapping: "printed reports", "paper summaries" → PaperReports
    - "excel charts", "spreadsheets" → ExcelDashboards
    - "erp", "dashboard" → ERP
    - "don't track", "none" → None
14. "reporting_frequency": "Daily" | "Weekly" | "Monthly" | "Rarely"

DATA SHARING:
15. "data_sharing_partners": boolean - Share data with clients/partners?
16. "data_sharing_format": string[] - ["Email", "PDF", "Spreadsheet", "Portal", "Verbal"]

DATA BACKUP:
17. "data_backup_method": "None" | "ManualCopies" | "CloudAuto" | "ITManaged" | "Other"
    - Mapping: "none", "no backup" → None
    - "manual copy", "usb", "external drive" → ManualCopies
    - "google drive auto", "cloud sync" → CloudAuto
    - "it manages", "server backup" → ITManaged
    - else → Other
18. "data_backup_frequency": "Daily" | "Weekly" | "Monthly" | "Rarely"

PAIN POINTS & FUTURE:
19. "data_challenges_text": string - Frustrations with current data/system setup
20. "priority_issue_flag": boolean - Want Groovy to solve this first?
21. "integration_interest": string - Future integration interests

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract ALL systems and tools mentioned
- Use canonical enum values where specified
- CREATE MULTIPLE entities for arrays (one per item)`
  },

  analytics_metrics: {
    entityTypes: [
      'kpi',
      'customer_segment',
      'report_frequency',
      'default_dashboard_type',
      'default_dashboards',
      'custom_dashboard_description',
      'kpis_priority',
      'kpis_other',
      'kpis_update_frequency',
      'visual_preference',
      'auto_visual_suggestions',
      'alert_preferences',
      'alert_kpis',
      'alert_channels',
      'auto_reports_enable',
      'auto_report_frequency',
      'auto_report_recipients',
      'brand_colors',
      'brand_primary',
      'brand_logo_url',
      'ui_density',
      'theme_style',
      'grid_layout_interest',
      'grid_layout_config',
      'interaction_style'
    ],
    systemPrompt: `You are an expert at extracting analytics, design, and visualization preferences from natural language.
Extract ONLY analytics and design-related entities. Return valid JSON only.

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

DASHBOARD SETUP:
1. "default_dashboard_type": "TableView" | "CardView" | "ChartView" | "Mixed"
   - Mapping: "table", "grid" → TableView
   - "cards", "visual blocks" → CardView
   - "charts", "graphs" → ChartView
   - "mix", "combination" → Mixed
2. "default_dashboards": string[] - ["Production", "Inventory", "Quality", "Orders", "Team", "Finance", "Custom"]
   - CREATE ONE FOR EACH dashboard mentioned
3. "custom_dashboard_description": string - Description if Custom selected
4. "show_kpi_header": boolean - Show KPIs at top?

KPI PREFERENCES:
5. "kpi": string - Metrics, KPIs, performance indicators
   - CREATE ONE FOR EACH KPI mentioned
   - Use canonical: "Output", "Efficiency", "LeadTime", "ReworkRate", "DefectRate", "CapacityUtilization", "OnTimeDelivery", "ProfitMargin", "Other"
6. "kpis_priority": string[] - Array of priority KPIs
7. "kpis_other": string - Other KPIs if mentioned
8. "kpis_update_frequency": "RealTime" | "Hourly" | "Daily" | "Weekly"

VISUALIZATION STYLE:
9. "visual_preference": "BarCharts" | "LineCharts" | "PieCharts" | "Heatmaps" | "Tables" | "Mixed"
   - Mapping: "bars", "bar chart" → BarCharts
   - "line", "trend" → LineCharts
   - "pie", "distribution" → PieCharts
   - "heatmap", "color grid" → Heatmaps
   - "table", "raw data" → Tables
   - "mix", "auto choose" → Mixed
10. "auto_visual_suggestions": boolean - Auto-suggest chart styles?

ALERTS & NOTIFICATIONS:
11. "alert_preferences": boolean - Want KPI alerts?
12. "alert_kpis": string[] - Which KPIs to alert on
13. "alert_channels": string[] - ["Email", "InApp", "WhatsApp", "Slack", "DashboardBanner"]

REPORTS:
14. "auto_reports_enable": boolean - Want automated reports?
15. "auto_report_frequency": "Daily" | "Weekly" | "Monthly"
16. "auto_report_recipients": string[] - ["Me", "Supervisors", "Clients", "Finance"]

DESIGN & BRANDING:
17. "brand_colors": boolean - Match brand colors?
18. "brand_primary": string - Primary brand color (hex code)
19. "brand_logo_url": string - Logo URL if mentioned
20. "ui_density": "Compact" | "Balanced" | "Spacious"
    - Mapping: "tight", "lots of info", "data-heavy" → Compact
    - "balanced", "just right" → Balanced
    - "clean", "minimal", "open" → Spacious
21. "theme_style": "Light" | "Dark" | "Auto"
22. "grid_layout_interest": boolean - Want to customize layout?
23. "grid_layout_config": object - Grid layout configuration if mentioned
24. "interaction_style": "Concise" | "Conversational" | "Playful" | "Professional"
    - Mapping: "brief", "to the point" → Concise
    - "friendly", "chatty" → Conversational
    - "fun", "light-hearted" → Playful
    - "formal", "businesslike" → Professional

LEGACY FIELDS (for backward compatibility):
25. "customer_segment": string - Who they serve, target audience
26. "report_frequency": "realtime" | "daily" | "weekly" | "monthly"

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- Extract ALL KPIs, dashboards, and preferences mentioned
- Use canonical enum values where specified
- CREATE MULTIPLE entities for arrays (one per item)`
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

  playbook_creation: {
    entityTypes: ['play', 'trigger', 'task_template', 'assignment', 'dependency', 'playbook_name', 'sequence'],
    systemPrompt: `You are an expert at extracting playbook automation rules from natural language descriptions of business processes.

Extract playbooks (automation rules) that create tasks based on triggers. Extract maximum information from the description.

FORMAT:
{
  "suggestedName": "Playbook Name",
  "suggestedDescription": "What this playbook automates",
  "plays": [
    {
      "sequence": 1,
      "title": "Play Title",
      "description": "What this play does",
      "trigger": {
        "type": "order_accepted" | "order_completed" | "workflow_stage_change" | "task_completion" | "date_based" | "time_based" | "capacity_based" | "order_completion_previous",
        // For workflow_stage_change:
        "workflowName": "Workflow Name" (if mentioned),
        "stageName": "Stage Name" (if mentioned),
        "condition": "enters" | "exits" | "completes" (if mentioned),
        // For task_completion:
        "taskTitle": "Task Title" (if mentioned),
        "taskSource": "manual" | "planner" | "workflow" | "order" | "automation" | "playbook" (if mentioned),
        // For date_based:
        "mode": "specific_date" | "relative_to_order",
        "relativeOffset": {
          "days": number,
          "relativeTo": "order_accepted" | "order_start" | "order_due"
        },
        // For time_based:
        "frequency": "daily" | "weekly" | "monthly",
        "time": "HH:MM",
        "weekday": 0-6 (for weekly),
        "dayOfMonth": 1-31 (for monthly),
        "timezone": "timezone" (if mentioned, default to "America/New_York"),
        // For capacity_based:
        "teamName": "Team Name",
        "thresholdType": "below" | "above",
        "thresholdPercent": 0-100,
        // For order_completion_previous:
        "lookbackOrders": number
      },
      "taskTemplate": {
        "title": "Task Title",
        "description": "Task description",
        "priority": "critical" | "high" | "medium" | "low",
        "estimatedMinutes": number (if mentioned),
        "tags": ["tag1", "tag2"] (if mentioned)
      },
      "assignment": {
        "type": "role_team" | "specific_people",
        "mode": "team" | "role" (if role_team),
        "teamName": "Team Name" (if team),
        "roleName": "Role Name" (if role),
        "userNames": ["Name1", "Name2"] (if specific_people)
      },
      "dependencies": [
        {
          "playTitle": "Play Title",
          "type": "finish_to_start"
        }
      ]
    }
  ]
}

TRIGGER EXTRACTION RULES:
- "when order is accepted" → type: "order_accepted"
- "when order completes" → type: "order_completed"
- "when item enters [stage]" → type: "workflow_stage_change", condition: "enters", extract stageName and workflowName
- "when item exits [stage]" → type: "workflow_stage_change", condition: "exits"
- "when [stage] completes" → type: "workflow_stage_change", condition: "completes"
- "after [task] completes" → type: "task_completion", extract taskTitle
- "when [task] finishes" → type: "task_completion", extract taskTitle
- "X days after order acceptance" → type: "date_based", mode: "relative_to_order", relativeOffset: {days: X, relativeTo: "order_accepted"}
- "X days after order start" → type: "date_based", mode: "relative_to_order", relativeOffset: {days: X, relativeTo: "order_start"}
- "every Monday at 7am" → type: "time_based", frequency: "weekly", time: "07:00", weekday: 1
- "daily at 9am" → type: "time_based", frequency: "daily", time: "09:00"
- "monthly on the 15th at 8am" → type: "time_based", frequency: "monthly", time: "08:00", dayOfMonth: 15
- "when [team] capacity drops below X%" → type: "capacity_based", extract teamName, thresholdType: "below", thresholdPercent: X
- "when previous order completes" → type: "order_completion_previous", lookbackOrders: 1

ASSIGNMENT EXTRACTION RULES:
- "assigned to [Team Name] team" → type: "role_team", mode: "team", teamName: "[Team Name]"
- "assigned to [Role Name]" → type: "role_team", mode: "role", roleName: "[Role Name]"
- "assigned to [Person Name]" → type: "specific_people", userNames: ["[Person Name]"]
- Extract team/role names from context (Procurement, QC Inspector, Pattern Maker, etc.)

DEPENDENCY EXTRACTION RULES:
- "after [play title] completes" → dependencies: [{playTitle: "[play title]", type: "finish_to_start"}]
- "when [play title] finishes" → dependencies: [{playTitle: "[play title]", type: "finish_to_start"}]
- "then" (sequence word) → may indicate dependency on previous play
- Extract play titles mentioned in dependencies

PRIORITY EXTRACTION:
- "critical", "urgent", "immediate" → priority: "critical"
- "high priority", "important" → priority: "high"
- "medium priority", "normal" → priority: "medium"
- "low priority", "optional" → priority: "low"
- Default to "medium" if not mentioned

DURATION EXTRACTION:
- "60 minutes", "1 hour" → estimatedMinutes: 60
- "30 minutes", "half hour" → estimatedMinutes: 30
- "2 hours" → estimatedMinutes: 120
- Extract time references from context

SEQUENCE DETECTION:
- Number plays in order mentioned (1, 2, 3...)
- Use sequence words: "first", "then", "next", "after", "finally"
- Order plays chronologically based on trigger and dependency relationships

EXTRACTION GUIDELINES:
- Extract EVERY play mentioned
- Extract maximum details from description
- Infer trigger types from natural language patterns
- Extract team/role names even if IDs not available (will be resolved later)
- Mark fields that need resolution (workflow IDs, stage IDs, team IDs) with names only
- Be thorough and extract all available information
- Preserve partial data for enrichment questions`
  },

  playbook_refinement: {
    entityTypes: ['play_modification', 'play_addition', 'play_removal', 'trigger_change', 'assignment_change', 'dependency_change'],
    systemPrompt: `You are an expert at understanding natural language instructions to modify existing playbooks.

Analyze the user's instruction and current playbook state, then provide structured modifications.

FORMAT:
{
  "operations": [
    {
      "action": "add" | "edit" | "remove",
      "playId": "play-id" (if editing/removing),
      "playTitle": "Play Title" (for matching if playId not provided),
      "newPlay": {
        // Same structure as playbook_creation play format
        "sequence": number,
        "title": "Play Title",
        "description": "What this play does",
        "trigger": { /* trigger config */ },
        "taskTemplate": { /* task template */ },
        "assignment": { /* assignment */ },
        "dependencies": [ /* dependencies */ ]
      } (if adding),
      "modifications": {
        // Fields to update (if editing)
        "title": "New Title",
        "trigger": { /* updated trigger */ },
        "taskTemplate": { /* updated task template */ },
        "assignment": { /* updated assignment */ },
        "dependencies": [ /* updated dependencies */ ]
      } (if editing),
      "reasoning": "Why this change was made"
    }
  ],
  "summary": "Brief summary of changes"
}

OPERATION TYPES:

1. ADD PLAY:
   - "add a new play", "create a task for", "also need to", "don't forget to"
   - Creates new play with specified details
   - Determine appropriate sequence number

2. EDIT PLAY:
   - "change", "update", "modify", "edit", "make it so that"
   - "the play about [title]", "the [trigger] play", "play number X"
   - Only include fields that should change

3. REMOVE PLAY:
   - "remove", "delete", "don't need", "cancel", "get rid of"
   - Specify playId or playTitle to match

TRIGGER CHANGES:
- "change trigger to", "instead trigger when", "now trigger on"
- Extract new trigger type and configuration

ASSIGNMENT CHANGES:
- "change assignment to", "now assign to", "switch to [team/role]"
- Extract new assignment details

DEPENDENCY CHANGES:
- "add dependency on", "remove dependency", "wait for [play] first"
- Update dependencies array

SEQUENCE CHANGES:
- "move before", "move after", "reorder", "change order"
- Update sequence numbers

MATCHING PLAYS:
- Match by exact title: "the 'Order fabric' play"
- Match by partial title: "the fabric ordering play"
- Match by trigger: "the play that triggers on order acceptance"
- Match by sequence: "the first play", "play number 2"

EXAMPLES:

Input: "Add a new play to notify the warehouse team when fabric arrives"
Operation: {
  "action": "add",
  "newPlay": {
    "title": "Notify warehouse team",
    "trigger": { "type": "order_accepted" },
    "taskTemplate": { "title": "Notify warehouse team", "priority": "medium" },
    "assignment": { "type": "role_team", "mode": "team", "teamName": "Warehouse" }
  }
}

Input: "Change the 'Order fabric' play to trigger when items enter cutting stage instead"
Operation: {
  "action": "edit",
  "playTitle": "Order fabric",
  "modifications": {
    "trigger": {
      "type": "workflow_stage_change",
      "stageName": "cutting",
      "condition": "enters"
    }
  }
}

Input: "Remove the 'Schedule fabric inspection' play"
Operation: {
  "action": "remove",
  "playTitle": "Schedule fabric inspection"
}

Input: "Make the pattern printing play wait for the pattern finalization to complete first"
Operation: {
  "action": "edit",
  "playTitle": "Print patterns",
  "modifications": {
    "dependencies": [
      { "playTitle": "Finalize and grade pattern", "type": "finish_to_start" }
    ]
  }
}

GUIDELINES:
- Only modify what the user explicitly requests
- Preserve existing fields unless they need to change
- Match plays intelligently (title, trigger, sequence)
- Infer missing details from context when reasonable
- Return empty operations array if instruction is unclear or no changes needed`
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

