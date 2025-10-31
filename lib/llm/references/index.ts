/**
 * LLM Reference Library - Main Export
 * 
 * Centralized exports for all enum definitions and natural language mappings.
 * This library serves as the source of truth for LLM prompts and validation.
 */

// Enum definitions
export * from './enums';

// Natural language mappings
export * from './mappings';

// Component mappings
export * from './component-mappings';

// Re-export helper functions
export {
  normalizeTextForMapping,
  mapNaturalLanguageToEnum,
  getEnumCandidates
} from './mappings';

export {
  mapNaturalLanguageToComponent,
  getComponentCandidates
} from './component-mappings';

