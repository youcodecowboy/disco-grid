/**
 * LLM Extraction Evaluation Test Suite
 * 
 * Tests accuracy of different prompt strategies against ground truth examples.
 */

export interface TestCase {
  id: string;
  context: 'operations' | 'workflows' | 'teams' | 'company';
  input: string;
  expected: {
    type: string;
    value: any;
    confidence?: 1 | 2 | 3;
  }[];
  description?: string;
}

export interface TestResult {
  testCase: TestCase;
  strategy: string;
  extracted: any[];
  accuracy: {
    correct: number;
    incorrect: number;
    missing: number;
    extra: number;
    precision: number;
    recall: number;
    f1: number;
  };
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  cost: number;
}

/**
 * Operations test cases
 */
export const OPERATIONS_TEST_CASES: TestCase[] = [
  {
    id: 'ops-001',
    context: 'operations',
    input: "We make custom orders based on customer requests. We use a whiteboard to plan production. Our process is cutting, then sewing, then washing, finishing, QA, and packing. We produce about 50,000 units per month.",
    expected: [
      { type: 'ops_model', value: 'MTO', confidence: 3 },
      { type: 'planning_method', value: 'ManualBoard', confidence: 3 },
      { type: 'stages_list', value: 'Cutting', confidence: 3 },
      { type: 'stages_list', value: 'Sewing', confidence: 3 },
      { type: 'stages_list', value: 'Washing', confidence: 3 },
      { type: 'stages_list', value: 'Finishing', confidence: 3 },
      { type: 'stages_list', value: 'QA', confidence: 3 },
      { type: 'stages_list', value: 'Packing', confidence: 3 },
      { type: 'capacity', value: 50000, confidence: 3 }
    ],
    description: 'Basic operations extraction with custom orders, whiteboard planning, stages, and capacity'
  },
  {
    id: 'ops-002',
    context: 'operations',
    input: "We do both custom and stock items. We track everything in Excel. Our stages are inspection, cutting, sewing, washing, finishing, and shipping. We use barcodes on all products. We run two shifts per day.",
    expected: [
      { type: 'ops_model', value: 'hybrid', confidence: 3 },
      { type: 'planning_method', value: 'Spreadsheet', confidence: 3 },
      { type: 'stages_list', value: 'Inspection', confidence: 3 },
      { type: 'stages_list', value: 'Cutting', confidence: 3 },
      { type: 'stages_list', value: 'Sewing', confidence: 3 },
      { type: 'stages_list', value: 'Washing', confidence: 3 },
      { type: 'stages_list', value: 'Finishing', confidence: 3 },
      { type: 'stages_list', value: 'Shipping', confidence: 3 },
      { type: 'qr_or_barcode_use', value: 'Barcodes', confidence: 3 },
      { type: 'shifts', value: 2, confidence: 3 }
    ],
    description: 'Hybrid operations model with Excel planning, barcodes, and shifts'
  },
  {
    id: 'ops-003',
    context: 'operations',
    input: "We subcontract our washing and finishing stages to external partners. We use our ERP system for planning. Cutting takes 30 minutes, sewing takes 1 hour. We track materials internally using racks.",
    expected: [
      { type: 'subcontract_use', value: true, confidence: 3 },
      { type: 'subcontract_stages', value: 'Washing', confidence: 3 },
      { type: 'subcontract_stages', value: 'Finishing', confidence: 3 },
      { type: 'planning_method', value: 'ERP', confidence: 3 },
      { type: 'stage_durations', value: { Cutting: 0.5, Sewing: 1.0 }, confidence: 3 },
      { type: 'track_materials_internally', value: true, confidence: 3 },
      { type: 'storage_system', value: 'Racks', confidence: 3 }
    ],
    description: 'Complex operations with subcontracting, ERP, durations, and storage'
  }
];

/**
 * Calculate accuracy metrics
 */
export function calculateAccuracy(
  expected: TestCase['expected'],
  extracted: any[]
): TestResult['accuracy'] {
  // Normalize values for comparison
  const normalizeValue = (value: any): any => {
    if (typeof value === 'string') {
      return value.toLowerCase().trim();
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'object' && value !== null) {
      // For objects, normalize recursively
      const normalized: any = {};
      Object.keys(value).forEach(k => {
        normalized[k.toLowerCase()] = normalizeValue(value[k]);
      });
      return normalized;
    }
    return value;
  };

  const normalizeForComparison = (val: any): string => {
    return JSON.stringify(normalizeValue(val));
  };

  const expectedMap = new Map<string, Set<string>>();
  expected.forEach(e => {
    const key = e.type;
    if (!expectedMap.has(key)) {
      expectedMap.set(key, new Set());
    }
    expectedMap.get(key)!.add(normalizeForComparison(e.value));
  });

  const extractedMap = new Map<string, Set<string>>();
  extracted.forEach(e => {
    // Handle field name variants (capacity vs capacity_monthly_pcs)
    let key = e.type;
    if (key === 'capacity_monthly_pcs') {
      key = 'capacity';
    }
    
    if (!extractedMap.has(key)) {
      extractedMap.set(key, new Set());
    }
    extractedMap.get(key)!.add(normalizeForComparison(e.value));
  });

  let correct = 0;
  let incorrect = 0;
  let missing = 0;
  let extra = 0;

  // Check expected items
  expectedMap.forEach((expectedValues, type) => {
    const extractedValues = extractedMap.get(type) || new Set();
    
    expectedValues.forEach(expectedValue => {
      if (extractedValues.has(expectedValue)) {
        correct++;
        extractedValues.delete(expectedValue);
      } else {
        missing++;
      }
    });

    // Remaining extracted values are extras
    extra += extractedValues.size;
  });

  // Check for extra extracted items not in expected
  extractedMap.forEach((extractedValues, type) => {
    if (!expectedMap.has(type)) {
      extra += extractedValues.size;
    }
  });

  const precision = correct + extra > 0 ? correct / (correct + extra) : 0;
  const recall = correct + missing > 0 ? correct / (correct + missing) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    correct,
    incorrect,
    missing,
    extra,
    precision,
    recall,
    f1
  };
}

/**
 * Format test results for display
 */
export function formatTestResults(results: TestResult[]): string {
  let output = '\n📊 EVALUATION RESULTS\n';
  output += '═'.repeat(70) + '\n\n';

  // Group by strategy
  const byStrategy = new Map<string, TestResult[]>();
  results.forEach(r => {
    if (!byStrategy.has(r.strategy)) {
      byStrategy.set(r.strategy, []);
    }
    byStrategy.get(r.strategy)!.push(r);
  });

  byStrategy.forEach((strategyResults, strategy) => {
    output += `\n${strategy.toUpperCase()} Strategy:\n`;
    output += '─'.repeat(70) + '\n';

    const avgPrecision = strategyResults.reduce((sum, r) => sum + r.accuracy.precision, 0) / strategyResults.length;
    const avgRecall = strategyResults.reduce((sum, r) => sum + r.accuracy.recall, 0) / strategyResults.length;
    const avgF1 = strategyResults.reduce((sum, r) => sum + r.accuracy.f1, 0) / strategyResults.length;
    const avgTokens = strategyResults.reduce((sum, r) => sum + r.tokens.total, 0) / strategyResults.length;
    const avgCost = strategyResults.reduce((sum, r) => sum + r.cost, 0) / strategyResults.length;

    output += `  Average Precision: ${(avgPrecision * 100).toFixed(1)}%\n`;
    output += `  Average Recall: ${(avgRecall * 100).toFixed(1)}%\n`;
    output += `  Average F1: ${(avgF1 * 100).toFixed(1)}%\n`;
    output += `  Average Tokens: ${avgTokens.toFixed(0)}\n`;
    output += `  Average Cost: $${avgCost.toFixed(6)}\n`;

    strategyResults.forEach(r => {
      output += `\n  Test ${r.testCase.id}: ${r.testCase.description || 'No description'}\n`;
      output += `    Precision: ${(r.accuracy.precision * 100).toFixed(1)}%, Recall: ${(r.accuracy.recall * 100).toFixed(1)}%, F1: ${(r.accuracy.f1 * 100).toFixed(1)}%\n`;
      output += `    Correct: ${r.accuracy.correct}, Missing: ${r.accuracy.missing}, Extra: ${r.accuracy.extra}\n`;
      output += `    Tokens: ${r.tokens.total}, Cost: $${r.cost.toFixed(6)}\n`;
    });
  });

  return output;
}

