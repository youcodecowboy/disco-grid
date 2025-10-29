/**
 * Validation utilities for LLM-generated component responses
 */

import type { BlockType } from "@/lib/grid-v2/types";

/**
 * Valid component types (from keywordMatcher rules)
 */
export const VALID_COMPONENT_TYPES: BlockType[] = [
  // Charts
  'v3.chart.area',
  'v3.chart.bar',
  'v3.chart.donut',
  'v3.chart.sankey',
  'v3.chart.radar',
  'v3.chart.sparkline',
  'v3.chart.wave',
  
  // Tables
  'v3.table',
  
  // Metrics
  'v3.kpi',
  'v3.counter.animated',
  'construction.metric.large',
  
  // Specialized
  'v3.map.site',
  'v3.heatmap',
  'v3.calendar.heatmap',
  'v3.kanban',
  'v3.activity.timeline',
  'v3.status.grid',
  'v3.progress.tracker',
  'v3.grid.pulse',
  'v3.graph.network',
  'v3.cards.3d',
];

export interface ComponentConfig {
  dataSource?: string;
  metric?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
  timeFilter?: string;
  groupBy?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any; // Allow additional properties
}

export interface LLMComponentResponse {
  componentType: BlockType;
  confidence: number;
  reasoning: string;
  config: ComponentConfig;
  title: string;
  size: { w: number; h: number };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitized?: LLMComponentResponse;
}

/**
 * Validate LLM component response
 */
export function validateComponentResponse(response: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!response.componentType) {
    errors.push('Missing required field: componentType');
  }
  
  if (response.componentType && !VALID_COMPONENT_TYPES.includes(response.componentType)) {
    errors.push(`Invalid componentType: ${response.componentType}. Must be one of: ${VALID_COMPONENT_TYPES.join(', ')}`);
  }
  
  if (typeof response.confidence !== 'number') {
    errors.push('Missing or invalid field: confidence (must be a number)');
  }
  
  if (response.confidence < 0 || response.confidence > 1) {
    warnings.push('Confidence should be between 0 and 1');
  }
  
  if (!response.reasoning || typeof response.reasoning !== 'string') {
    errors.push('Missing or invalid field: reasoning (must be a string)');
  }
  
  if (!response.title || typeof response.title !== 'string') {
    errors.push('Missing or invalid field: title (must be a string)');
  }
  
  if (!response.size || typeof response.size !== 'object') {
    errors.push('Missing or invalid field: size (must be an object)');
  } else {
    if (typeof response.size.w !== 'number' || typeof response.size.h !== 'number') {
      errors.push('Invalid size: w and h must be numbers');
    }
    
    if (response.size.w < 1 || response.size.w > 12) {
      warnings.push('Size w should be between 1 and 12');
    }
    
    if (response.size.h < 1 || response.size.h > 12) {
      warnings.push('Size h should be between 1 and 12');
    }
  }
  
  if (!response.config || typeof response.config !== 'object') {
    warnings.push('Missing or invalid config object');
  }

  // If there are errors, return early
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // Sanitize and normalize the response
  const sanitized: LLMComponentResponse = {
    componentType: response.componentType,
    confidence: Math.max(0, Math.min(1, response.confidence)), // Clamp to 0-1
    reasoning: response.reasoning.trim(),
    config: sanitizeConfig(response.config || {}),
    title: response.title.trim(),
    size: {
      w: Math.max(1, Math.min(12, Math.round(response.size.w))),
      h: Math.max(1, Math.min(12, Math.round(response.size.h)))
    }
  };

  return {
    isValid: true,
    errors: [],
    warnings,
    sanitized
  };
}

/**
 * Sanitize config object
 */
function sanitizeConfig(config: any): ComponentConfig {
  const sanitized: ComponentConfig = {};
  
  // Only include known config fields (with type checking)
  if (config.dataSource && typeof config.dataSource === 'string') {
    sanitized.dataSource = config.dataSource.trim();
  }
  
  if (config.metric && typeof config.metric === 'string') {
    sanitized.metric = config.metric.trim();
  }
  
  if (config.aggregation && ['sum', 'avg', 'count', 'max', 'min'].includes(config.aggregation)) {
    sanitized.aggregation = config.aggregation;
  }
  
  if (config.timeFilter && typeof config.timeFilter === 'string') {
    sanitized.timeFilter = config.timeFilter.trim();
  }
  
  if (config.groupBy && typeof config.groupBy === 'string') {
    sanitized.groupBy = config.groupBy.trim();
  }
  
  if (config.limit && typeof config.limit === 'number') {
    sanitized.limit = Math.max(1, Math.min(100, config.limit)); // Clamp to 1-100
  }
  
  if (config.sortBy && typeof config.sortBy === 'string') {
    sanitized.sortBy = config.sortBy.trim();
  }
  
  if (config.sortOrder && ['asc', 'desc'].includes(config.sortOrder)) {
    sanitized.sortOrder = config.sortOrder;
  }
  
  // Pass through any other properties (but only if they're simple types)
  for (const key in config) {
    if (!(key in sanitized) && (typeof config[key] === 'string' || typeof config[key] === 'number' || typeof config[key] === 'boolean')) {
      sanitized[key] = config[key];
    }
  }
  
  return sanitized;
}

/**
 * Get default size for component type
 */
export function getDefaultSize(componentType: BlockType): { w: number; h: number } {
  const sizes: Record<string, { w: number; h: number }> = {
    'v3.chart.area': { w: 8, h: 8 },
    'v3.chart.bar': { w: 6, h: 8 },
    'v3.chart.donut': { w: 6, h: 8 },
    'v3.chart.sankey': { w: 10, h: 8 },
    'v3.chart.radar': { w: 6, h: 8 },
    'v3.chart.sparkline': { w: 4, h: 4 },
    'v3.chart.wave': { w: 10, h: 6 },
    'v3.table': { w: 6, h: 8 },
    'v3.kpi': { w: 4, h: 4 },
    'v3.counter.animated': { w: 4, h: 6 },
    'construction.metric.large': { w: 3, h: 4 },
    'v3.map.site': { w: 8, h: 10 },
    'v3.heatmap': { w: 6, h: 8 },
    'v3.calendar.heatmap': { w: 8, h: 6 },
    'v3.kanban': { w: 12, h: 10 },
    'v3.activity.timeline': { w: 4, h: 8 },
    'v3.status.grid': { w: 6, h: 6 },
    'v3.progress.tracker': { w: 4, h: 8 },
    'v3.grid.pulse': { w: 6, h: 8 },
    'v3.graph.network': { w: 10, h: 8 },
    'v3.cards.3d': { w: 8, h: 10 },
  };
  
  return sizes[componentType] || { w: 6, h: 8 };
}

