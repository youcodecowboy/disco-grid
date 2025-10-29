/**
 * Contract Factory
 * 
 * Creates industry-specific contract templates based on selected industry
 */

import type { GenerationContractV1, Industry, SubIndustry } from '../types.contract';
import type { ManufacturingContract } from '../types.contracts.manufacturing';
import type { ConstructionContract } from '../types.contracts.construction';
import type { DefenseContract } from '../types.contracts.defense';
import { createEmptyContract } from '../types.contract';

/**
 * Initialize industry-specific contract extension
 */
export function getContractForIndustry(
  industry: Industry,
  subIndustry?: SubIndustry,
  idempotencyKey?: string
): GenerationContractV1 {
  const baseContract = createEmptyContract(idempotencyKey || generateIdempotencyKey());
  
  // Update industry
  baseContract.company.industry = industry;
  baseContract.company.subIndustry = subIndustry || null;
  
  // Add industry-specific extension
  switch (industry) {
    case 'manufacturing':
      baseContract.manufacturingExt = createManufacturingExtension(subIndustry);
      break;
    case 'construction':
      baseContract.constructionExt = createConstructionExtension();
      break;
    case 'defense':
      baseContract.defenseExt = createDefenseExtension();
      break;
  }
  
  return baseContract;
}

/**
 * Create manufacturing-specific extension
 */
function createManufacturingExtension(subIndustry?: SubIndustry): ManufacturingContract {
  const base: ManufacturingContract = {
    subIndustry: (subIndustry as 'fashion' | 'general') || 'general',
    production: {
      lineCount: undefined,
      stationsPerLine: undefined,
      averageSetupTime: undefined,
      averageCycleTime: undefined,
      dailyTargetUnits: undefined,
    },
    quality: {
      defectTracking: false,
      qualityStages: [],
    },
  };
  
  // Add fashion-specific fields if fashion
  if (subIndustry === 'fashion') {
    base.fashion = {
      garmentTypes: [],
      fabricTypes: [],
      washProcesses: [],
      seasonalCollections: {
        enabled: false,
        seasons: [],
      },
    };
  } else {
    base.general = {
      productLines: [],
      bomComplexity: 'simple',
      yieldTracking: false,
      scrapManagement: false,
    };
  }
  
  return base;
}

/**
 * Create construction-specific extension
 */
function createConstructionExtension(): ConstructionContract {
  return {
    projectTypes: [],
    typicalProjectSize: 'medium',
    jobSites: {
      active: 0,
      management: 'single',
    },
    subcontractors: {
      used: false,
    },
    materials: {
      tracking: false,
    },
    phases: {
      typical: [],
      durationTracking: false,
    },
    changeOrders: {
      frequency: 'occasional',
      tracking: false,
    },
  };
}

/**
 * Create defense-specific extension
 */
function createDefenseExtension(): DefenseContract {
  return {
    contractTypes: [],
    securityClearances: {
      required: false,
    },
    deliverables: {
      types: [],
      trackingGranularity: 'standard',
    },
    specifications: {
      standards: [],
      complianceTracking: false,
    },
    chainOfCustody: {
      required: false,
      serialization: false,
    },
    testing: {
      required: false,
      testReports: false,
    },
    quality: {
      system: 'ISO-9001',
      nonConformanceTracking: false,
      correctiveActions: false,
    },
  };
}

/**
 * Generate idempotency key
 */
function generateIdempotencyKey(): string {
  return `onboarding_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Check if a contract field has been committed (user confirmed)
 */
export function isFieldCommitted(contract: GenerationContractV1, fieldPath: string): boolean {
  return contract.metadata.committedFields?.includes(fieldPath) || false;
}

/**
 * Mark a field as committed
 */
export function commitField(contract: GenerationContractV1, fieldPath: string): GenerationContractV1 {
  const committedFields = contract.metadata.committedFields || [];
  if (!committedFields.includes(fieldPath)) {
    committedFields.push(fieldPath);
  }
  
  return {
    ...contract,
    metadata: {
      ...contract.metadata,
      committedFields,
    },
  };
}

/**
 * Mark multiple fields as committed
 */
export function commitFields(contract: GenerationContractV1, fieldPaths: string[]): GenerationContractV1 {
  const committedFields = contract.metadata.committedFields || [];
  const newFields = fieldPaths.filter(path => !committedFields.includes(path));
  
  return {
    ...contract,
    metadata: {
      ...contract.metadata,
      committedFields: [...committedFields, ...newFields],
    },
  };
}

/**
 * Get value from contract by dot-notation path
 */
export function getContractValue(contract: GenerationContractV1, path: string): any {
  const keys = path.split('.');
  let value: any = contract;
  
  for (const key of keys) {
    if (value === undefined || value === null) {
      return undefined;
    }
    value = value[key];
  }
  
  return value;
}

/**
 * Check if contract has meaningful value at path
 */
export function hasContractValue(contract: GenerationContractV1, path: string): boolean {
  const value = getContractValue(contract, path);
  
  if (value === undefined || value === null) {
    return false;
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return false;
  }
  
  return true;
}

