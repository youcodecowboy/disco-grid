/**
 * Contract Completeness & Gap Analysis
 * 
 * Determines which contract fields are satisfied and which still need answers.
 * Used to skip redundant questions and identify missing information.
 */

import type { GenerationContractV1, Provenance, Confidence } from '../types.contract';

export interface ContractField {
  path: string; // e.g., "company.name"
  required: boolean;
  description: string;
  satisfied: boolean;
  value?: any;
  provenance?: Provenance;
  confidence?: Confidence;
}

export interface ContractCompleteness {
  overallComplete: boolean;
  percentComplete: number;
  requiredFields: ContractField[];
  optionalFields: ContractField[];
  missingRequired: ContractField[];
  lowConfidenceFields: ContractField[];
}

/**
 * Define all contract fields and their requirements
 */
export const CONTRACT_FIELD_DEFINITIONS: Record<string, { required: boolean; description: string }> = {
  // COMPANY - Required
  'company.name': { required: true, description: 'Company name' },
  'company.industry': { required: true, description: 'Industry type' },
  'company.locations': { required: true, description: 'At least one location' },
  'company.size': { required: true, description: 'Team size range' },
  'company.facilities': { required: true, description: 'Single or multi-site' },
  
  // COMPANY - Optional
  'company.logoUrl': { required: false, description: 'Company logo' },
  
  // OPERATIONS - Required
  'operations.model': { required: true, description: 'Operations model (MTO/MTS/hybrid)' },
  
  // OPERATIONS - Optional
  'operations.monthlyCapacity': { required: false, description: 'Monthly production capacity' },
  'operations.shiftsPerDay': { required: false, description: 'Number of shifts per day' },
  'operations.seasonality': { required: false, description: 'Seasonal patterns' },
  'operations.leadTimes': { required: false, description: 'Average lead times' },
  
  // ITEMS - Required
  'items.categories': { required: true, description: 'Product/item categories' },
  'items.trackingLevel': { required: true, description: 'Tracking granularity (unit/batch/order)' },
  'items.attributes': { required: true, description: 'Item attributes schema' },
  
  // ITEMS - Optional
  'items.components': { required: false, description: 'Sub-components or materials' },
  
  // WORKFLOWS - Required
  'workflows.stages': { required: true, description: 'Workflow stages/process steps' },
  
  // TEAMS - Required
  'teams.departments': { required: true, description: 'Team departments' },
  'teams.floorAppEnabled': { required: true, description: 'Floor app usage' },
  
  // ANALYTICS - Required
  'analytics.audience': { required: true, description: 'Dashboard audience' },
  'analytics.keyMetrics': { required: true, description: 'Key metrics to track' },
  'analytics.chartPreference': { required: true, description: 'Chart visualization preference' },
  'analytics.reportFrequency': { required: true, description: 'Reporting frequency' },
  
  // OPTIONAL SECTIONS
  'sites': { required: false, description: 'Facility site maps' },
  'integrations': { required: false, description: 'System integrations' },
  'playbooks': { required: false, description: 'Automated playbook tasks' },
};

/**
 * Get value at a nested path in the contract
 */
function getValueAtPath(contract: GenerationContractV1, path: string): any {
  const parts = path.split('.');
  let value: any = contract;
  
  for (const part of parts) {
    if (value === undefined || value === null) return undefined;
    value = value[part];
  }
  
  return value;
}

/**
 * Get provenance/confidence for a field if it exists
 */
function getFieldMetadata(contract: GenerationContractV1, path: string): { provenance?: Provenance; confidence?: Confidence } {
  const value = getValueAtPath(contract, path);
  
  // Check if value has provenance metadata
  if (value && typeof value === 'object') {
    if ('prov' in value && 'conf' in value) {
      return { provenance: value.prov, confidence: value.conf };
    }
    // For arrays/objects with metadata in first item
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      if ('prov' in value[0] && 'conf' in value[0]) {
        return { provenance: value[0].prov, confidence: value[0].conf };
      }
    }
  }
  
  return {};
}

/**
 * Check if a contract field is satisfied (has meaningful value)
 */
function isFieldSatisfied(contract: GenerationContractV1, path: string): boolean {
  const value = getValueAtPath(contract, path);
  
  // Empty checks
  if (value === undefined || value === null) return false;
  if (value === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  
  // Check for default/placeholder values
  if (typeof value === 'string') {
    const lowercased = value.toLowerCase();
    if (lowercased === 'unknown' || lowercased === 'n/a' || lowercased === 'tbd') return false;
  }
  
  return true;
}

/**
 * Analyze contract completeness
 */
export function analyzeContractCompleteness(contract: GenerationContractV1): ContractCompleteness {
  const allFields: ContractField[] = [];
  const requiredFields: ContractField[] = [];
  const optionalFields: ContractField[] = [];
  const missingRequired: ContractField[] = [];
  const lowConfidenceFields: ContractField[] = [];
  
  // Analyze each defined field
  for (const [path, definition] of Object.entries(CONTRACT_FIELD_DEFINITIONS)) {
    const satisfied = isFieldSatisfied(contract, path);
    const value = getValueAtPath(contract, path);
    const { provenance, confidence } = getFieldMetadata(contract, path);
    
    const field: ContractField = {
      path,
      required: definition.required,
      description: definition.description,
      satisfied,
      value,
      provenance,
      confidence,
    };
    
    allFields.push(field);
    
    if (definition.required) {
      requiredFields.push(field);
      if (!satisfied) {
        missingRequired.push(field);
      }
    } else {
      optionalFields.push(field);
    }
    
    // Flag low confidence fields (< 2) that might need confirmation
    if (satisfied && confidence !== undefined && confidence < 2) {
      lowConfidenceFields.push(field);
    }
  }
  
  // Calculate completeness
  const totalRequired = requiredFields.length;
  const satisfiedRequired = requiredFields.filter(f => f.satisfied).length;
  const percentComplete = totalRequired > 0 ? Math.round((satisfiedRequired / totalRequired) * 100) : 0;
  const overallComplete = missingRequired.length === 0;
  
  return {
    overallComplete,
    percentComplete,
    requiredFields,
    optionalFields,
    missingRequired,
    lowConfidenceFields,
  };
}

/**
 * Check if a specific question should be skipped because its data is already satisfied
 */
export function shouldSkipQuestion(contract: GenerationContractV1, questionMapsTo: string | null): boolean {
  if (!questionMapsTo) return false;
  
  // Handle wildcard mappings (e.g., "company.*")
  if (questionMapsTo.endsWith('.*')) {
    const prefix = questionMapsTo.slice(0, -2);
    // Check if ALL required fields in this section are satisfied
    const sectionFields = Object.keys(CONTRACT_FIELD_DEFINITIONS)
      .filter(path => path.startsWith(prefix + '.'))
      .filter(path => CONTRACT_FIELD_DEFINITIONS[path].required);
    
    return sectionFields.every(path => isFieldSatisfied(contract, path));
  }
  
  // Direct path check
  if (CONTRACT_FIELD_DEFINITIONS[questionMapsTo]) {
    return isFieldSatisfied(contract, questionMapsTo);
  }
  
  return false;
}

/**
 * Generate gap-filling questions for missing required fields
 * Returns prompts that can be asked to the user
 */
export function generateGapFillingQuestions(missingFields: ContractField[]): Array<{
  fieldPath: string;
  question: string;
  helper: string;
}> {
  const questions: Array<{ fieldPath: string; question: string; helper: string }> = [];
  
  for (const field of missingFields) {
    let question = '';
    let helper = '';
    
    switch (field.path) {
      case 'company.name':
        question = 'What is your company name?';
        helper = 'This will appear throughout your workspace.';
        break;
      case 'company.industry':
        question = 'What industry do you operate in?';
        helper = 'Select the category that best describes your business.';
        break;
      case 'company.locations':
        question = 'Where is your primary facility located?';
        helper = 'City and country help us set regional defaults.';
        break;
      case 'company.size':
        question = 'How many people work at your company?';
        helper = 'Select the range that best describes your team.';
        break;
      case 'operations.model':
        question = 'What is your primary operations model?';
        helper = 'Do you make-to-order, make-to-stock, or both?';
        break;
      case 'items.categories':
        question = 'What types of products or items do you manage?';
        helper = 'List the main categories of things you produce or track.';
        break;
      case 'items.trackingLevel':
        question = 'How do you track your items?';
        helper = 'Do you need unique IDs per item, or batch/lot tracking?';
        break;
      case 'workflows.stages':
        question = 'What are the main stages in your production process?';
        helper = 'List the steps items go through from start to finish.';
        break;
      case 'teams.departments':
        question = 'What departments or teams do you have?';
        helper = 'List your main organizational units.';
        break;
      case 'analytics.keyMetrics':
        question = 'What metrics or KPIs do you track?';
        helper = 'List the performance indicators that matter most.';
        break;
      default:
        question = `Please provide: ${field.description}`;
        helper = 'This information is required to complete your setup.';
    }
    
    questions.push({
      fieldPath: field.path,
      question,
      helper,
    });
  }
  
  return questions;
}

/**
 * Create a summary of what's been collected so far
 */
export function generateProgressSummary(completeness: ContractCompleteness): string {
  const { percentComplete, missingRequired, lowConfidenceFields } = completeness;
  
  let summary = `✅ ${percentComplete}% complete\n\n`;
  
  if (missingRequired.length > 0) {
    summary += `**Still needed:**\n`;
    missingRequired.forEach(field => {
      summary += `- ${field.description}\n`;
    });
  }
  
  if (lowConfidenceFields.length > 0) {
    summary += `\n**Please confirm:**\n`;
    lowConfidenceFields.forEach(field => {
      summary += `- ${field.description} (we made an educated guess)\n`;
    });
  }
  
  if (completeness.overallComplete) {
    summary = `🎉 All required information collected!\n\n`;
  }
  
  return summary;
}

