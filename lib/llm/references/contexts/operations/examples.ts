/**
 * Operations Context - Real-World Examples
 * 
 * Examples of natural language inputs and their expected extractions.
 * Used for few-shot learning in prompts to improve accuracy.
 */

export interface ExtractionExample {
  input: string;
  output: Record<string, any>;
  confidence: 1 | 2 | 3;
  keywords?: string[];
  notes?: string;
}

/**
 * Operations Model Examples
 */
export const OPS_MODEL_EXAMPLES: ExtractionExample[] = [
  {
    input: "We make custom orders based on customer requests",
    output: { ops_model: "MTO" },
    confidence: 3,
    keywords: ["custom", "customer requests", "made to order"]
  },
  {
    input: "We produce stock items for our warehouse",
    output: { ops_model: "MTS" },
    confidence: 3,
    keywords: ["stock", "warehouse", "inventory"]
  },
  {
    input: "We do both - some custom orders and some stock items",
    output: { ops_model: "hybrid" },
    confidence: 3,
    keywords: ["both", "custom", "stock"]
  },
  {
    input: "Everything is made to order, we don't keep inventory",
    output: { ops_model: "MTO" },
    confidence: 3,
    keywords: ["made to order", "don't keep inventory"]
  }
];

/**
 * Planning Method Examples
 */
export const PLANNING_METHOD_EXAMPLES: ExtractionExample[] = [
  {
    input: "We use a whiteboard to plan our production",
    output: { planning_method: "ManualBoard" },
    confidence: 3,
    keywords: ["whiteboard", "board"]
  },
  {
    input: "We track everything in Excel spreadsheets",
    output: { planning_method: "Spreadsheet" },
    confidence: 3,
    keywords: ["excel", "spreadsheet"]
  },
  {
    input: "We use our ERP system for planning",
    output: { planning_method: "ERP" },
    confidence: 3,
    keywords: ["erp", "system"]
  },
  {
    input: "We just talk about it, no formal system",
    output: { planning_method: "Verbal" },
    confidence: 3,
    keywords: ["talk", "verbal"]
  }
];

/**
 * Production Stages Examples
 */
export const STAGES_EXAMPLES: ExtractionExample[] = [
  {
    input: "Our process is cutting, then sewing, then washing, finishing, QA, and packing",
    output: {
      stages_list: ["Cutting", "Sewing", "Washing", "Finishing", "QA", "Packing"]
    },
    confidence: 3,
    keywords: ["cutting", "sewing", "washing", "finishing", "qa", "packing"]
  },
  {
    input: "We start with fabric inspection, then cut, sew, wash, finish, inspect quality, and ship",
    output: {
      stages_list: ["Fabric Inspection", "Cutting", "Sewing", "Washing", "Finishing", "Quality Inspection", "Shipping"]
    },
    confidence: 3,
    keywords: ["inspection", "cut", "sew", "wash", "finish", "inspect", "ship"]
  }
];

/**
 * Capacity Examples
 */
export const CAPACITY_EXAMPLES: ExtractionExample[] = [
  {
    input: "We produce about 50,000 units per month",
    output: { capacity_monthly_pcs: 50000 },
    confidence: 3,
    keywords: ["50,000", "units per month"]
  },
  {
    input: "Our monthly capacity is around 30k pieces",
    output: { capacity_monthly_pcs: 30000 },
    confidence: 3,
    keywords: ["30k", "monthly capacity"]
  },
  {
    input: "We make roughly 10k garments weekly",
    output: { capacity_monthly_pcs: 40000 },
    confidence: 2,
    keywords: ["10k", "weekly"],
    notes: "Converted weekly to monthly (10k * 4)"
  },
  {
    input: "Our facility can handle 1,500 units per day",
    output: { capacity_monthly_pcs: 45000 },
    confidence: 2,
    keywords: ["1,500", "per day"],
    notes: "Converted daily to monthly (1,500 * 30)"
  }
];

/**
 * Shifts Examples
 */
export const SHIFTS_EXAMPLES: ExtractionExample[] = [
  {
    input: "We run two shifts per day",
    output: { shifts: 2 },
    confidence: 3,
    keywords: ["two shifts", "2 shifts"]
  },
  {
    input: "Our factory operates 24/7",
    output: { shifts: 24 },
    confidence: 3,
    keywords: ["24/7", "around the clock"]
  },
  {
    input: "Single shift operation, Monday through Friday",
    output: { shifts: 1 },
    confidence: 3,
    keywords: ["single shift", "one shift"]
  }
];

/**
 * Storage System Examples
 */
export const STORAGE_SYSTEM_EXAMPLES: ExtractionExample[] = [
  {
    input: "We use racks to store our finished goods",
    output: { storage_system: "Racks" },
    confidence: 3,
    keywords: ["racks"]
  },
  {
    input: "Materials are stored in defined bins with labels",
    output: { storage_system: "DefinedBins" },
    confidence: 3,
    keywords: ["bins", "defined bins"]
  },
  {
    input: "We use carts to move items around the floor",
    output: { storage_system: "Carts" },
    confidence: 3,
    keywords: ["carts"]
  }
];

/**
 * QR/Barcode Examples
 */
export const QR_BARCODE_EXAMPLES: ExtractionExample[] = [
  {
    input: "We use barcodes on all our products",
    output: { qr_or_barcode_use: "Barcodes" },
    confidence: 3,
    keywords: ["barcodes", "barcode"]
  },
  {
    input: "Everything has a QR code label",
    output: { qr_or_barcode_use: "QRCodes" },
    confidence: 3,
    keywords: ["QR code", "QR"]
  },
  {
    input: "We don't use any scanning system",
    output: { qr_or_barcode_use: "None" },
    confidence: 3,
    keywords: ["don't use", "no scanning"]
  }
];

/**
 * Get examples for few-shot learning
 * Returns N examples formatted for prompt inclusion
 */
export function getFewShotExamples(
  entityType: 'ops_model' | 'planning_method' | 'stages' | 'capacity',
  count: number = 2
): string {
  let examples: ExtractionExample[] = [];
  
  switch (entityType) {
    case 'ops_model':
      examples = OPS_MODEL_EXAMPLES.slice(0, count);
      break;
    case 'planning_method':
      examples = PLANNING_METHOD_EXAMPLES.slice(0, count);
      break;
    case 'stages':
      examples = STAGES_EXAMPLES.slice(0, count);
      break;
    case 'capacity':
      examples = CAPACITY_EXAMPLES.slice(0, count);
      break;
  }
  
  return examples.map((ex, i) => 
    `Example ${i + 1}:\nInput: "${ex.input}"\nOutput: ${JSON.stringify(ex.output)}`
  ).join('\n\n');
}

/**
 * Get prompt snippet with examples
 */
export function getExamplePrompt(entityType: string, exampleCount: number = 2): string {
  const examples = getFewShotExamples(entityType as any, exampleCount);
  return `Here are ${exampleCount} examples of correct extractions:\n\n${examples}\n\nNow extract similar entities from the user's input.`;
}

