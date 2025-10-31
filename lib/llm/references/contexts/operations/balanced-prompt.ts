/**
 * Balanced Operations Prompt
 * 
 * Strikes balance between token optimization and accuracy.
 * Includes all entity types with logical grouping, enough guidance for accuracy,
 * but leverages server-side normalization for value mappings.
 */

/**
 * Build balanced operations prompt
 * 
 * Strategy:
 * - Include ALL entity types (36 total) grouped logically
 * - Provide clear format requirements
 * - Include enum value options (for model understanding)
 * - NO verbose mappings (handled server-side)
 * - NO examples (model infers from context)
 * - Clear extraction rules
 */
export function buildBalancedOperationsPrompt(): string {
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

EXTRACT THESE ENTITY TYPES:

PRODUCTION FLOW:
- overview_text: string (full production flow description)
- stages_list: string (extract as SEPARATE entities, one per stage - NOT as array)
  Example: "cutting, sewing, washing" → extract THREE entities: {"type":"stages_list","value":"Cutting"}, {"type":"stages_list","value":"Sewing"}, {"type":"stages_list","value":"Washing"}
- stage_durations: object (stage name → hours, e.g., {"Cutting": 0.5})
- stage_buffer_use: boolean

SUBCONTRACTING:
- subcontract_use: boolean
- subcontract_stages: string[] (which stages are subcontracted)
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
- ops_model: "MTO" | "MTS" | "hybrid"
- capacity: number (monthly, extract as number not string)
- capacity_monthly_pcs: number (alternative field name)
- shifts: number (1 | 2 | 3 | 24, extract as number)
- lead_time: number (days)
- seasonality: number[] (months 0-11)
- tracking_level: "unit" | "batch" | "order"

RULES:
- confidence: 3=explicit, 2=implied, 1=inferred
- stages_list: Extract as SEPARATE entities (one entity per stage), NOT as array
  Example: "cutting, sewing" → two entities, not one array entity
- stage_durations: object with stage names as keys, hours as values
- Numbers: Extract as numbers (50000), not strings ("50k" or "50,000")
- Convert durations to hours (30 minutes = 0.5, 1 day = 24)
- Use exact enum values where specified
- Extract what's mentioned, infer only when strongly implied`;
}

/**
 * Estimate tokens for balanced prompt
 */
export function estimateBalancedPromptTokens(): number {
  const prompt = buildBalancedOperationsPrompt();
  return Math.ceil(prompt.length / 4);
}

