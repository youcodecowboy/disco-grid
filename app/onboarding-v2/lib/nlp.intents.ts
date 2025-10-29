/**
 * NLP Intent Grid
 * 
 * Pattern → intent mapping with confidence scoring.
 * Extracts structured data from natural language input.
 */

import { normalizeText, normalizeCapacity, extractNumbers, lookupCity, capitalize } from './normalize';
import type { Confidence } from '../types.contract';

export type Intent =
  | 'company_profile'
  | 'ops_model'
  | 'capacity'
  | 'location'
  | 'kpi'
  | 'workflow_stage'
  | 'department'
  | 'product_type'
  | 'team_size'
  | 'lead_time'
  | 'seasonality'
  | 'unknown';

export interface EntityExtraction {
  type: string;
  value: any;
  confidence: Confidence;
  rawText: string;
  provenance?: 'llm' | 'keyword' | 'nlp'; // Track extraction source
}

export interface IntentResult {
  intent: Intent;
  entities: EntityExtraction[];
  confidence: Confidence;
  rawText: string;
}

/**
 * Industry/product type patterns
 */
const PRODUCT_PATTERNS = [
  { keywords: ['denim', 'jeans'], value: 'Denim', industry: 'manufacturing' },
  { keywords: ['apparel', 'clothing', 'garment', 'fashion', 'textile'], value: 'Apparel', industry: 'manufacturing' },
  { keywords: ['furniture', 'cabinet'], value: 'Furniture', industry: 'manufacturing' },
  { keywords: ['electronics', 'circuit', 'pcb'], value: 'Electronics', industry: 'manufacturing' },
  { keywords: ['construction', 'building', 'contractor'], value: 'Construction', industry: 'construction' },
  { keywords: ['logistics', 'shipping', 'warehouse', 'distribution'], value: 'Logistics', industry: 'logistics' },
  { keywords: ['food', 'beverage', 'bakery', 'restaurant'], value: 'Food & Beverage', industry: 'manufacturing' },
  { keywords: ['automotive', 'car', 'vehicle'], value: 'Automotive', industry: 'manufacturing' },
];

/**
 * Operations model patterns
 */
const OPS_MODEL_PATTERNS = [
  { keywords: ['make to order', 'custom', 'bespoke', 'custom order'], value: 'MTO', conf: 3 as Confidence },
  { keywords: ['make to stock', 'inventory', 'stock'], value: 'MTS', conf: 3 as Confidence },
  { keywords: ['batch', 'lot'], value: 'MTO', conf: 2 as Confidence },
];

/**
 * Department/team patterns
 */
const DEPARTMENT_PATTERNS = [
  'operations', 'quality', 'qa', 'qc', 'production', 'manufacturing',
  'warehouse', 'logistics', 'shipping', 'receiving', 'admin', 'management',
  'engineering', 'design', 'sales', 'customer service'
];

/**
 * Workflow stage patterns
 */
const WORKFLOW_STAGE_PATTERNS = [
  'receive', 'receiving', 'cut', 'cutting', 'sew', 'sewing', 'assembly', 'assemble',
  'wash', 'washing', 'finish', 'finishing', 'qa', 'quality', 'inspect', 'inspection',
  'pack', 'packing', 'package', 'packaging', 'ship', 'shipping', 'test', 'testing'
];

/**
 * KPI patterns
 */
const KPI_PATTERNS = [
  { keywords: ['on time', 'otd', 'delivery'], value: 'On-Time Delivery' },
  { keywords: ['defect', 'quality', 'first pass', 'fpy', 'yield'], value: 'First-Pass Yield' },
  { keywords: ['throughput', 'output', 'production rate'], value: 'Throughput' },
  { keywords: ['capacity', 'utilization', 'efficiency'], value: 'Capacity Utilization' },
  { keywords: ['wip', 'work in progress', 'inventory'], value: 'WIP Age' },
  { keywords: ['lead time', 'cycle time'], value: 'Lead Time' },
  { keywords: ['backlog', 'orders'], value: 'Order Backlog' },
];

/**
 * Extract location information
 */
export function extractLocation(text: string): EntityExtraction[] {
  const entities: EntityExtraction[] = [];
  
  // Pattern for "in [City], [State/Country]" or "based in [City]"
  const locationPatterns = [
    /(?:in|at|from|based\s+in|located\s+in|operates?\s+in|headquartered\s+in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*([A-Z][a-z]+|[A-Z]{2,})?/g,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z][a-z]+|[A-Z]{2,})\b/g,
  ];
  
  const seen = new Set<string>();
  
  locationPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const city = match[1]?.trim();
      const region = match[2]?.trim();
      
      if (city && city.length > 2) {
        const key = `${city}-${region || ''}`;
        if (!seen.has(key)) {
          seen.add(key);
          
          const cityInfo = lookupCity(city);
          
          entities.push({
            type: 'location',
            value: {
              city: capitalize(city),
              state: region,
              country: region && region.length === 2 ? 'USA' : region,
              ...cityInfo,
            },
            confidence: region ? 3 : 2,
            rawText: match[0],
          });
        }
      }
    }
  });
  
  // Fallback: check for standalone capitalized words
  if (entities.length === 0) {
    const words = text.split(/\s+/);
    for (const word of words) {
      const cityInfo = lookupCity(word);
      if (cityInfo && !seen.has(word)) {
        seen.add(word);
        entities.push({
          type: 'location',
          value: {
            city: capitalize(word),
            ...cityInfo,
          },
          confidence: 2,
          rawText: word,
        });
      }
    }
  }
  
  return entities;
}

/**
 * Extract capacity/volume information
 */
export function extractCapacity(text: string): EntityExtraction[] {
  const normalized = normalizeText(text);
  const entities: EntityExtraction[] = [];
  
  // Look for capacity indicators
  const capacityRegex = /(\d+[,\d]*k?)\s*(?:units?|items?|pieces?|garments?)?(?:\s*(?:per|\/)\s*(?:month|mo|week|day))?/gi;
  const matches = text.match(capacityRegex);
  
  if (matches) {
    matches.forEach(match => {
      const normalized = normalizeCapacity(match);
      if (normalized) {
        // Convert to monthly if weekly or daily mentioned
        let monthly = normalized;
        if (match.toLowerCase().includes('week')) {
          monthly = normalized * 4;
        } else if (match.toLowerCase().includes('day')) {
          monthly = normalized * 30;
        }
        
        entities.push({
          type: 'capacity',
          value: monthly,
          confidence: 3,
          rawText: match,
        });
      }
    });
  }
  
  return entities;
}

/**
 * Extract product/industry information
 */
export function extractProduct(text: string): EntityExtraction[] {
  const normalized = normalizeText(text);
  const entities: EntityExtraction[] = [];
  
  PRODUCT_PATTERNS.forEach(pattern => {
    const found = pattern.keywords.some(keyword => normalized.includes(keyword));
    if (found) {
      entities.push({
        type: 'product',
        value: pattern.value,
        confidence: 3,
        rawText: pattern.keywords.find(k => normalized.includes(k)) || '',
      });
      
      entities.push({
        type: 'industry',
        value: pattern.industry,
        confidence: 3,
        rawText: pattern.keywords.find(k => normalized.includes(k)) || '',
      });
    }
  });
  
  return entities;
}

/**
 * Extract operations model
 */
export function extractOpsModel(text: string): EntityExtraction[] {
  const normalized = normalizeText(text);
  const entities: EntityExtraction[] = [];
  
  OPS_MODEL_PATTERNS.forEach(pattern => {
    const found = pattern.keywords.some(keyword => normalized.includes(keyword));
    if (found) {
      entities.push({
        type: 'ops_model',
        value: pattern.value,
        confidence: pattern.conf,
        rawText: pattern.keywords.find(k => normalized.includes(k)) || '',
      });
    }
  });
  
  // Also look for shift information
  const shiftMatch = text.match(/(\d+)\s*shifts?(?:\s+per\s+day|\/day)?/i);
  if (shiftMatch) {
    const shifts = parseInt(shiftMatch[1]);
    if ([1, 2, 3].includes(shifts)) {
      entities.push({
        type: 'shifts',
        value: shifts,
        confidence: 3,
        rawText: shiftMatch[0],
      });
    }
  }
  
  if (/24\/7|twenty[- ]four\s+seven|around\s+the\s+clock/i.test(text)) {
    entities.push({
      type: 'shifts',
      value: 24,
      confidence: 3,
      rawText: '24/7',
    });
  }
  
  // Extract lead time
  const leadTimeMatch = text.match(/lead\s*time\s*(?:of|is)?\s*(\d+)\s*(days?|weeks?|hours?)/i);
  if (leadTimeMatch) {
    let days = parseInt(leadTimeMatch[1]);
    const unit = leadTimeMatch[2].toLowerCase();
    
    if (unit.startsWith('week')) {
      days = days * 7;
    } else if (unit.startsWith('hour')) {
      days = Math.ceil(days / 24);
    }
    
    entities.push({
      type: 'lead_time',
      value: days,
      confidence: 3,
      rawText: leadTimeMatch[0],
    });
  }
  
  return entities;
}

/**
 * Extract team size
 */
export function extractTeamSize(text: string): EntityExtraction[] {
  const normalized = normalizeText(text);
  const entities: EntityExtraction[] = [];
  
  // Expanded patterns for team size detection
  const patterns = [
    /(?:team|company|staff|workforce)\s+(?:of|size|has|with)?\s*(\d+[,\d]*)\s*(?:people|employees?|workers?|staff|team\s*members?|person)?/gi,
    /(\d+[,\d]*)\s*(?:people|employees?|workers?|staff|team\s*members?|person)/gi,
    /(?:we|they)\s+(?:have|are)\s+(\d+[,\d]*)/gi,
    /headcount\s*(?:of|is)?\s*(\d+[,\d]*)/gi,
    /(\d+[,\d]*)[- ]person\s+team/gi,
    /about\s+(\d+[,\d]*)\s+(?:people|employees?|staff)/gi,
  ];
  
  const seen = new Set<number>();
  
  patterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const nums = extractNumbers(match[0]);
      if (nums.length > 0 && nums[0] > 0 && nums[0] < 100000 && !seen.has(nums[0])) {
        seen.add(nums[0]);
        entities.push({
          type: 'team_size',
          value: nums[0],
          confidence: 3,
          rawText: match[0],
        });
      }
    }
  });
  
  return entities;
}

/**
 * Extract departments
 */
export function extractDepartments(text: string): EntityExtraction[] {
  const normalized = normalizeText(text);
  const entities: EntityExtraction[] = [];
  
  DEPARTMENT_PATTERNS.forEach(dept => {
    if (normalized.includes(dept)) {
      entities.push({
        type: 'department',
        value: capitalize(dept),
        confidence: 3,
        rawText: dept,
      });
    }
  });
  
  return entities;
}

/**
 * Extract workflow stages
 */
export function extractWorkflowStages(text: string): EntityExtraction[] {
  const normalized = normalizeText(text);
  const entities: EntityExtraction[] = [];
  
  WORKFLOW_STAGE_PATTERNS.forEach(stage => {
    if (normalized.includes(stage)) {
      entities.push({
        type: 'workflow_stage',
        value: capitalize(stage),
        confidence: 2,
        rawText: stage,
      });
    }
  });
  
  return entities;
}

/**
 * Extract KPIs
 */
export function extractKPIs(text: string): EntityExtraction[] {
  const normalized = normalizeText(text);
  const entities: EntityExtraction[] = [];
  
  KPI_PATTERNS.forEach(pattern => {
    const found = pattern.keywords.some(keyword => normalized.includes(keyword));
    if (found) {
      entities.push({
        type: 'kpi',
        value: pattern.value,
        confidence: 2,
        rawText: pattern.keywords.find(k => normalized.includes(k)) || '',
      });
    }
  });
  
  return entities;
}

/**
 * Main extraction function - runs all extractors
 */
export function extractEntities(text: string): EntityExtraction[] {
  const location = extractLocation(text);
  const capacity = extractCapacity(text);
  const product = extractProduct(text);
  const opsModel = extractOpsModel(text);
  const teamSize = extractTeamSize(text);
  const departments = extractDepartments(text);
  const workflowStages = extractWorkflowStages(text);
  const kpis = extractKPIs(text);
  
  const allEntities: EntityExtraction[] = [
    ...location,
    ...capacity,
    ...product,
    ...opsModel,
    ...teamSize,
    ...departments,
    ...workflowStages,
    ...kpis,
  ];
  
  // Deduplicate by type and value
  const unique = allEntities.reduce((acc, entity) => {
    const key = `${entity.type}:${JSON.stringify(entity.value)}`;
    if (!acc.has(key)) {
      acc.set(key, entity);
    }
    return acc;
  }, new Map<string, EntityExtraction>());
  
  return Array.from(unique.values());
}

/**
 * Determine primary intent from text
 */
export function determineIntent(text: string): Intent {
  const entities = extractEntities(text);
  
  if (entities.some(e => e.type === 'product' || e.type === 'industry')) {
    return 'company_profile';
  }
  
  if (entities.some(e => e.type === 'capacity')) {
    return 'capacity';
  }
  
  if (entities.some(e => e.type === 'location')) {
    return 'location';
  }
  
  if (entities.some(e => e.type === 'ops_model')) {
    return 'ops_model';
  }
  
  if (entities.some(e => e.type === 'kpi')) {
    return 'kpi';
  }
  
  if (entities.some(e => e.type === 'workflow_stage')) {
    return 'workflow_stage';
  }
  
  if (entities.some(e => e.type === 'department')) {
    return 'department';
  }
  
  return 'unknown';
}

/**
 * Full NLP processing
 */
export function processNaturalLanguage(text: string): IntentResult {
  const entities = extractEntities(text);
  const intent = determineIntent(text);
  
  // Calculate overall confidence based on entities found
  const avgConfidence = entities.length > 0
    ? Math.round(entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length) as Confidence
    : 0;
  
  return {
    intent,
    entities,
    confidence: avgConfidence,
    rawText: text,
  };
}

/**
 * Match intent and return entities in a format suitable for UI display
 */
export function matchIntent(text: string): Array<{
  intent: string;
  value: any;
  confidence: Confidence;
  provenance: 'nlp';
}> {
  const result = processNaturalLanguage(text);
  
  // Transform entities to the format expected by the UI
  return result.entities.map(entity => ({
    intent: entity.type,
    value: entity.value,
    confidence: entity.confidence,
    provenance: 'nlp' as const,
  }));
}

