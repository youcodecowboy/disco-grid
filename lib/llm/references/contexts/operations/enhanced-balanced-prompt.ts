/**
 * Enhanced Balanced Operations Prompt with Few-Shot Examples
 * 
 * This version includes comprehensive examples to push accuracy to 95%+
 * Priority: Accuracy over token usage
 */

export function buildEnhancedBalancedOperationsPrompt(): string {
  return `Extract operations entities from text. Return valid JSON only.

FORMAT:
{
  "entities": [
    {
      "type": "<entity_type>",
      "value": <extracted_value>,
      "confidence": 1 | 2 | 3,
      "rawText": "<source_text>"
    }
  ]
}

CRITICAL EXTRACTION RULES:

1. ops_model: ALWAYS extract one of: "MTO", "MTS", "hybrid"
   - "custom orders", "made to order", "customer requests" → "MTO"
   - "stock items", "inventory", "pre-made" → "MTS"
   - "both custom and stock", "mixed" → "hybrid"
   - If not explicitly mentioned, infer from context (custom = MTO, stock = MTS)

2. subcontract_use: ALWAYS extract boolean (true/false)
   - "subcontract", "external partners", "outsource" → true
   - "we do everything", "in-house" → false
   - If not mentioned, default to false

3. subcontract_stages: Extract as SEPARATE entities (one per stage)
   - "subcontract washing and finishing" → two entities: "Washing", "Finishing"

4. stage_durations: ALWAYS extract as object with stage names as keys
   - "Cutting takes 30 minutes" → {"Cutting": 0.5}
   - "Sewing takes 1 hour" → {"Sewing": 1.0}
   - Convert all to hours (30 min = 0.5, 1 hour = 1.0, 1 day = 24)

5. capacity: ALWAYS extract as number (not string)
   - "50,000 units" → 50000
   - "50k units" → 50000
   - Extract from any mention of production volume

6. stages_list: Extract as SEPARATE entities (one per stage)
   - "cutting, sewing, washing" → three entities

7. planning_method: Use exact enum values
   - "whiteboard", "board", "manual" → "ManualBoard"
   - "excel", "spreadsheet", "sheets" → "Spreadsheet"
   - "erp", "system", "software" → "ERP"
   - "verbal", "talk", "memory" → "Verbal"

EXAMPLES:

Example 1: Custom orders with stages
Input: "We make custom orders based on customer requests. We use a whiteboard to plan production. Our process is cutting, then sewing, then washing, finishing, QA, and packing. We produce about 50,000 units per month."
Output: {
  "entities": [
    {"type": "ops_model", "value": "MTO", "confidence": 3, "rawText": "custom orders based on customer requests"},
    {"type": "planning_method", "value": "ManualBoard", "confidence": 3, "rawText": "whiteboard"},
    {"type": "stages_list", "value": "Cutting", "confidence": 3, "rawText": "cutting"},
    {"type": "stages_list", "value": "Sewing", "confidence": 3, "rawText": "sewing"},
    {"type": "stages_list", "value": "Washing", "confidence": 3, "rawText": "washing"},
    {"type": "stages_list", "value": "Finishing", "confidence": 3, "rawText": "finishing"},
    {"type": "stages_list", "value": "QA", "confidence": 3, "rawText": "QA"},
    {"type": "stages_list", "value": "Packing", "confidence": 3, "rawText": "packing"},
    {"type": "capacity", "value": 50000, "confidence": 3, "rawText": "50,000 units per month"}
  ]
}

Example 2: Subcontracting with durations
Input: "We subcontract our washing and finishing stages to external partners. We use our ERP system for planning. Cutting takes 30 minutes, sewing takes 1 hour. We track materials internally using racks."
Output: {
  "entities": [
    {"type": "subcontract_use", "value": true, "confidence": 3, "rawText": "subcontract our washing and finishing"},
    {"type": "subcontract_stages", "value": "Washing", "confidence": 3, "rawText": "washing"},
    {"type": "subcontract_stages", "value": "Finishing", "confidence": 3, "rawText": "finishing"},
    {"type": "planning_method", "value": "ERP", "confidence": 3, "rawText": "ERP system"},
    {"type": "stage_durations", "value": {"Cutting": 0.5, "Sewing": 1.0}, "confidence": 3, "rawText": "Cutting takes 30 minutes, sewing takes 1 hour"},
    {"type": "track_materials_internally", "value": true, "confidence": 3, "rawText": "track materials internally"},
    {"type": "storage_system", "value": "Racks", "confidence": 3, "rawText": "racks"}
  ]
}

Example 3: Hybrid model with multiple details
Input: "We do both custom and stock items. We track everything in Excel. Our stages are inspection, cutting, sewing, washing, finishing, and shipping. We use barcodes on all products. We run two shifts per day."
Output: {
  "entities": [
    {"type": "ops_model", "value": "hybrid", "confidence": 3, "rawText": "both custom and stock"},
    {"type": "planning_method", "value": "Spreadsheet", "confidence": 3, "rawText": "Excel"},
    {"type": "stages_list", "value": "Inspection", "confidence": 3, "rawText": "inspection"},
    {"type": "stages_list", "value": "Cutting", "confidence": 3, "rawText": "cutting"},
    {"type": "stages_list", "value": "Sewing", "confidence": 3, "rawText": "sewing"},
    {"type": "stages_list", "value": "Washing", "confidence": 3, "rawText": "washing"},
    {"type": "stages_list", "value": "Finishing", "confidence": 3, "rawText": "finishing"},
    {"type": "stages_list", "value": "Shipping", "confidence": 3, "rawText": "shipping"},
    {"type": "qr_or_barcode_use", "value": "Barcodes", "confidence": 3, "rawText": "barcodes"},
    {"type": "shifts", "value": 2, "confidence": 3, "rawText": "two shifts"}
  ]
}

EXTRACT THESE ENTITY TYPES:

PRODUCTION FLOW:
- overview_text: string (full production flow description)
- stages_list: string (extract as SEPARATE entities, one per stage - NOT as array)
- stage_durations: object (stage name → hours, e.g., {"Cutting": 0.5})
- stage_buffer_use: boolean

SUBCONTRACTING:
- subcontract_use: boolean (ALWAYS extract, default false if not mentioned)
- subcontract_stages: string (extract as SEPARATE entities, one per stage)
- subcontract_partners_consistent: boolean

PLANNING:
- planning_method: "ManualBoard" | "Spreadsheet" | "ERP" | "Verbal" | "Other"
- planning_method_other: string (if Other)
- daily_planning_style: "ByOrder" | "ByBatch" | "ByCapacity" | "Mixed"
- target_output_metric: boolean
- target_output_qty: number

INVENTORY & MOVEMENT:
- track_materials_internally: boolean
- inventory_levels_tracked: string[] (values: "Raw", "WIP", "Finished")
- storage_system: "DefinedBins" | "Racks" | "Carts" | "Mixed" | "Other"
- storage_system_other: string (if Other)
- qr_or_barcode_use: "None" | "Barcodes" | "QRCodes" | "Both"

QUALITY CONTROL:
- qc_stages: string[] (stages with quality checks)
- qc_record_defects: boolean
- defect_rate_estimate: number (percentage)

LEAD TIME & DELAYS:
- total_lead_time_days: number
- delay_bottleneck_stage: string (stage name from stages_list)

DATA CAPTURE:
- data_tracking_method: "Paper" | "Spreadsheet" | "Software" | "Verbal" | "Other"
- data_tracking_tool: string (if Software)
- data_entry_frequency: "RealTime" | "Daily" | "Weekly" | "AfterCompletion" | "Never"

PAIN POINTS:
- biggest_bottleneck_text: string
- bottleneck_type: "People" | "Machines" | "Data" | "Other"

AUTOMATION & REPORTING:
- auto_reports_interest: boolean
- auto_report_frequency: "Daily" | "Weekly" | "Monthly"
- delay_alert_interest: boolean

LEGACY FIELDS:
- ops_model: "MTO" | "MTS" | "hybrid" (ALWAYS extract one)
- capacity: number (monthly, extract as number not string)
- capacity_monthly_pcs: number (alternative field name)
- shifts: number (1 | 2 | 3 | 24, extract as number)
- lead_time: number (days)
- seasonality: number[] (months 0-11)
- tracking_level: "unit" | "batch" | "order"

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- stages_list: Extract as SEPARATE entities (one entity per stage), NOT as array
- stage_durations: object with stage names as keys, hours as values
- Numbers: Extract as numbers (50000), not strings ("50k" or "50,000")
- Convert durations to hours (30 minutes = 0.5, 1 day = 24)
- Use exact enum values where specified
- Extract what's mentioned, infer only when strongly implied
- ALWAYS extract ops_model (infer if not mentioned)
- ALWAYS extract subcontract_use (default false if not mentioned)`;
}

/**
 * Estimate tokens for enhanced balanced prompt
 */
export function estimateEnhancedBalancedTokens(): number {
  const prompt = buildEnhancedBalancedOperationsPrompt();
  return Math.ceil(prompt.length / 4); // Rough estimate: 4 chars per token
}

