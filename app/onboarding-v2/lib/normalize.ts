/**
 * Normalization & Coercion Layer
 * 
 * Normalizes user input into consistent formats:
 * - Units: "10k", "10,000", "10k/mo" → 10000 per month
 * - Text: trim, normalize case
 * - Dates: ISO format
 * - Numbers: extract from freeform text
 */

/**
 * Normalize capacity numbers from various formats
 */
export function normalizeCapacity(input: string): number | null {
  if (!input) return null;
  
  // Remove common separators and whitespace
  let normalized = input.toLowerCase().replace(/[,\s]/g, '');
  
  // Handle "k" suffix (thousands)
  if (normalized.includes('k')) {
    const num = parseFloat(normalized.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? null : Math.round(num * 1000);
  }
  
  // Handle "m" suffix (millions)
  if (normalized.includes('m')) {
    const num = parseFloat(normalized.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? null : Math.round(num * 1000000);
  }
  
  // Extract plain number
  const num = parseFloat(normalized.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? null : Math.round(num);
}

/**
 * Extract numbers from freeform text
 */
export function extractNumbers(text: string): number[] {
  const matches = text.match(/\d+(?:,\d{3})*(?:\.\d+)?/g);
  if (!matches) return [];
  
  return matches.map(match => {
    const cleaned = match.replace(/,/g, '');
    return parseFloat(cleaned);
  }).filter(n => !isNaN(n));
}

/**
 * Normalize text for matching (lowercase, trim, remove extra spaces)
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Capitalize first letter of each word
 */
export function capitalize(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * City/Country database (simple lookup)
 * In production, this would be a more comprehensive database
 */
const CITY_DATABASE: Record<string, { country: string; timezone: string }> = {
  'istanbul': { country: 'Turkey', timezone: 'Europe/Istanbul' },
  'new york': { country: 'United States', timezone: 'America/New_York' },
  'london': { country: 'United Kingdom', timezone: 'Europe/London' },
  'paris': { country: 'France', timezone: 'Europe/Paris' },
  'tokyo': { country: 'Japan', timezone: 'Asia/Tokyo' },
  'shanghai': { country: 'China', timezone: 'Asia/Shanghai' },
  'mumbai': { country: 'India', timezone: 'Asia/Kolkata' },
  'dubai': { country: 'United Arab Emirates', timezone: 'Asia/Dubai' },
  'singapore': { country: 'Singapore', timezone: 'Asia/Singapore' },
  'hong kong': { country: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  'toronto': { country: 'Canada', timezone: 'America/Toronto' },
  'sydney': { country: 'Australia', timezone: 'Australia/Sydney' },
  'berlin': { country: 'Germany', timezone: 'Europe/Berlin' },
  'mexico city': { country: 'Mexico', timezone: 'America/Mexico_City' },
  'bangkok': { country: 'Thailand', timezone: 'Asia/Bangkok' },
  'los angeles': { country: 'United States', timezone: 'America/Los_Angeles' },
  'chicago': { country: 'United States', timezone: 'America/Chicago' },
  'barcelona': { country: 'Spain', timezone: 'Europe/Madrid' },
  'milan': { country: 'Italy', timezone: 'Europe/Rome' },
  'amsterdam': { country: 'Netherlands', timezone: 'Europe/Amsterdam' },
};

/**
 * Lookup city details (country, timezone)
 */
export function lookupCity(city: string): { country?: string; timezone?: string } | null {
  const normalized = normalizeText(city);
  const found = CITY_DATABASE[normalized];
  
  if (found) {
    return {
      country: found.country,
      timezone: found.timezone,
    };
  }
  
  return null;
}

/**
 * Parse duration strings to hours
 * "2 days" → 48, "3 hours" → 3, "1 week" → 168
 */
export function parseDuration(input: string): number | null {
  const normalized = normalizeText(input);
  
  // Extract number
  const numMatch = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!numMatch) return null;
  const num = parseFloat(numMatch[1]);
  
  // Determine unit
  if (normalized.includes('hour')) return num;
  if (normalized.includes('day')) return num * 24;
  if (normalized.includes('week')) return num * 24 * 7;
  if (normalized.includes('month')) return num * 24 * 30;
  
  // Default to hours if no unit specified
  return num;
}

/**
 * Extract email addresses from text
 */
export function extractEmails(text: string): string[] {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  return text.match(emailRegex) || [];
}

/**
 * Parse percentage strings
 * "85%", "85 percent" → 0.85
 */
export function parsePercentage(input: string): number | null {
  const normalized = normalizeText(input);
  const numMatch = normalized.match(/(\d+(?:\.\d+)?)/);
  
  if (!numMatch) return null;
  const num = parseFloat(numMatch[1]);
  
  // If already decimal (0-1), return as is
  if (num <= 1) return num;
  
  // Otherwise convert percentage to decimal
  return num / 100;
}

