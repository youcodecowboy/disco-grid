/**
 * Operations Context - Pattern Recognition
 * 
 * Common patterns and edge cases for extracting operations-related entities.
 * Used to improve extraction accuracy and handle variations.
 */

/**
 * Capacity extraction patterns
 */
export const CAPACITY_PATTERNS = [
  /(\d+[,\d]*k?)\s*(?:units?|items?|pieces?|garments?)?(?:\s*(?:per|\/)\s*(?:month|mo|week|day))?/gi,
  /(?:capacity|produce|make|output)\s*(?:of|is)?\s*(\d+[,\d]*k?)/gi,
  /(\d+[,\d]*k?)\s*(?:per\s*(?:month|mo|week|day))/gi
];

/**
 * Shift patterns
 */
export const SHIFT_PATTERNS = [
  /(\d+)\s*shifts?(?:\s+per\s+day|\/day)?/i,
  /(?:run|operate|have)\s*(\d+)\s*shifts?/i,
  /(?:single|one|two|three)\s*shift/i,
  /24\/7|twenty[- ]four\s+seven|around\s+the\s+clock/i
];

/**
 * Lead time patterns
 */
export const LEAD_TIME_PATTERNS = [
  /lead\s*time\s*(?:of|is)?\s*(\d+)\s*(days?|weeks?|hours?)/i,
  /(?:takes?|takes?)\s*(\d+)\s*(days?|weeks?|hours?)\s*(?:to|for)/i,
  /(\d+)\s*(?:day|week|hour)\s*(?:lead|cycle)/i
];

/**
 * Stage duration patterns
 */
export const STAGE_DURATION_PATTERNS = [
  /(\w+)\s+takes?\s*(\d+)\s*(?:minutes?|hours?|days?)/i,
  /(\d+)\s*(?:minutes?|hours?|days?)\s*(?:for|in)\s*(\w+)/i,
  /(\w+)\s*(?:is|takes?)\s*(\d+)\s*(?:minutes?|hours?|days?)/i
];

/**
 * Planning method keywords
 */
export const PLANNING_KEYWORDS = {
  ManualBoard: ['whiteboard', 'board', 'kanban board', 'notes on wall', 'manual'],
  Spreadsheet: ['excel', 'google sheets', 'spreadsheet', 'sheet'],
  ERP: ['erp', 'sap', 'netsuite', 'system', 'software'],
  Verbal: ['verbal', 'talk', 'memory', 'verbally', 'in person']
};

/**
 * Extract capacity from text using patterns
 */
export function extractCapacityWithPatterns(text: string): number | null {
  for (const pattern of CAPACITY_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const number = parseInt(match[0].replace(/[,\s]/g, '').replace(/k/i, '000'));
      if (number > 0) {
        // Convert to monthly if weekly/daily mentioned
        if (text.toLowerCase().includes('week')) {
          return number * 4;
        } else if (text.toLowerCase().includes('day')) {
          return number * 30;
        }
        return number;
      }
    }
  }
  return null;
}

/**
 * Extract shifts from text using patterns
 */
export function extractShiftsWithPatterns(text: string): 1 | 2 | 3 | 24 | null {
  for (const pattern of SHIFT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      if (match[0].toLowerCase().includes('24') || match[0].toLowerCase().includes('seven')) {
        return 24;
      }
      const num = parseInt(match[1] || match[0]);
      if ([1, 2, 3].includes(num)) {
        return num as 1 | 2 | 3;
      }
    }
  }
  return null;
}

/**
 * Get pattern hints for prompt
 */
export function getPatternHints(): string {
  return `
Common patterns to look for:
- Capacity: "50k units/month", "produce 30,000 pieces"
- Shifts: "2 shifts", "run 3 shifts per day", "24/7"
- Lead time: "lead time is 2 weeks", "takes 5 days"
- Stage duration: "cutting takes 30 minutes", "sewing is 1 hour"
`;
}

