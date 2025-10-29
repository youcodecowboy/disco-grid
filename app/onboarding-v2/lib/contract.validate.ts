/**
 * Contract Validation with Zod
 * 
 * Type-safe validation for the Generation Contract
 */

import { z } from 'zod';
import type { GenerationContractV1 } from '../types.contract';

// Provenance and Confidence schemas
const ProvenanceSchema = z.enum(['nlp', 'manual', 'default']);
const ConfidenceSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);

// Location schema
const LocationDataSchema = z.object({
  city: z.string().min(1),
  country: z.string().optional(),
  timezone: z.string().optional(),
  prov: ProvenanceSchema,
  conf: ConfidenceSchema,
});

// Lead time schema
const LeadTimeDataSchema = z.object({
  avgDays: z.number().positive().optional(),
  prov: ProvenanceSchema,
  conf: ConfidenceSchema,
});

// Item attribute schema
const ItemAttributeSchema = z.object({
  key: z.string().min(1),
  type: z.enum(['text', 'number', 'date', 'dropdown', 'checkbox']),
  required: z.boolean(),
  values: z.array(z.string()).optional(),
});

// Component definition schema
const ComponentDefinitionSchema = z.object({
  name: z.string().min(1),
  attributes: z.array(ItemAttributeSchema),
});

// Workflow stage schema
const WorkflowStageSchema = z.object({
  name: z.string().min(1),
  durationHours: z.number().positive().optional(),
  ownerDept: z.string().optional(),
  quality: z.object({
    checkpoint: z.boolean(),
    criteria: z.array(z.string()).optional(),
  }).nullable().optional(),
});

// Floor zone schema
const FloorZoneSchema = z.object({
  type: z.enum(['production', 'qa', 'storage', 'shipping', 'office']),
  name: z.string().min(1),
  sqft: z.number().positive().optional(),
  supervisor: z.string().optional(),
});

// Floor definition schema
const FloorDefinitionSchema = z.object({
  name: z.string().min(1),
  zones: z.array(FloorZoneSchema),
});

// Department schema
const DepartmentSchema = z.object({
  name: z.string().min(1),
  roles: z.array(z.string()),
  access: z.enum(['view', 'edit', 'full']),
});

// Integration system schema
const IntegrationSystemSchema = z.object({
  type: z.enum(['erp', 'mrp', 'spreadsheet', 'custom']),
  name: z.string().min(1),
  priority: z.enum(['day1', 'soon', 'later']),
});

// Sync preferences schema
const SyncPreferencesSchema = z.object({
  dataTypes: z.array(z.string()),
  frequency: z.enum(['realtime', 'hourly', 'daily', 'manual']),
});

// Playbook task schema
const PlaybookTaskSchema = z.object({
  task: z.string().min(1),
  dept: z.string().min(1),
});

// Branching log entry schema
const BranchingLogEntrySchema = z.object({
  ruleId: z.string(),
  outcome: z.boolean(),
  because: z.string(),
  timestamp: z.string(),
});

// Main Generation Contract schema
export const GenerationContractSchema = z.object({
  version: z.literal('1.0.0'),
  
  company: z.object({
    name: z.string().min(1, 'Company name is required'),
    logoUrl: z.string().url().optional(),
    industry: z.enum(['manufacturing', 'construction', 'logistics', 'other']),
    locations: z.array(LocationDataSchema).min(1, 'At least one location is required'),
    size: z.enum(['<10', '10-50', '50-200', '200+']),
    facilities: z.enum(['single', 'multi']),
  }),
  
  operations: z.object({
    model: z.enum(['MTO', 'MTS', 'hybrid']),
    monthlyCapacity: z.number().positive().optional(),
    shiftsPerDay: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(24)]).optional(),
    seasonality: z.object({
      months: z.array(z.number().min(0).max(11)),
    }).nullable().optional(),
    leadTimes: LeadTimeDataSchema.optional(),
  }),
  
  items: z.object({
    categories: z.array(z.string()).min(1, 'At least one item category is required'),
    trackingLevel: z.enum(['unit', 'batch', 'order']),
    attributes: z.array(ItemAttributeSchema).min(3, 'At least name, code, and quantity are required'),
    components: z.array(ComponentDefinitionSchema).optional(),
  }),
  
  workflows: z.object({
    stages: z.array(WorkflowStageSchema).min(1, 'At least one workflow stage is required'),
  }),
  
  sites: z.object({
    floors: z.array(FloorDefinitionSchema).min(1),
  }).nullable().optional(),
  
  teams: z.object({
    departments: z.array(DepartmentSchema),
    floorAppEnabled: z.boolean(),
  }),
  
  integrations: z.object({
    systems: z.array(IntegrationSystemSchema),
    syncPreferences: SyncPreferencesSchema.optional(),
    apiAccess: z.boolean(),
  }).nullable().optional(),
  
  analytics: z.object({
    audience: z.array(z.enum(['exec', 'ops', 'floor', 'partners'])).min(1),
    keyMetrics: z.array(z.string()),
    chartPreference: z.enum(['trends', 'comparison', 'metrics', 'tables']),
    reportFrequency: z.enum(['realtime', 'daily', 'weekly', 'monthly']),
  }),
  
  playbooks: z.object({
    orderOnAccepted: z.array(PlaybookTaskSchema),
  }).nullable().optional(),
  
  metadata: z.object({
    idempotencyKey: z.string().uuid(),
    createdAt: z.string().datetime(),
    completedAt: z.string().datetime().optional(),
    lastStep: z.string(),
    branchingLog: z.array(BranchingLogEntrySchema),
  }),
});

export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
  normalizedContract?: GenerationContractV1;
};

/**
 * Validate a generation contract
 */
export function validateContract(contract: unknown): ValidationResult {
  try {
    const result = GenerationContractSchema.safeParse(contract);
    
    if (result.success) {
      return {
        valid: true,
        errors: [],
        normalizedContract: result.data as GenerationContractV1,
      };
    } else {
      const errors: ValidationError[] = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      return {
        valid: false,
        errors,
      };
    }
  } catch (error) {
    return {
      valid: false,
      errors: [{
        field: 'general',
        message: error instanceof Error ? error.message : 'Unknown validation error',
      }],
    };
  }
}

/**
 * Validate required fields for a specific step
 */
export function validateStep(contract: Partial<GenerationContractV1>, step: string): boolean {
  // Step-specific validation logic
  switch (step) {
    case 'company_name':
      return !!contract.company?.name && contract.company.name.length > 0;
    
    case 'company_location':
      return !!contract.company?.locations && contract.company.locations.length > 0;
    
    case 'items_categories':
      return !!contract.items?.categories && contract.items.categories.length > 0;
    
    case 'workflow_stages':
      return !!contract.workflows?.stages && contract.workflows.stages.length > 0;
    
    default:
      return true; // No validation for unknown steps
  }
}

