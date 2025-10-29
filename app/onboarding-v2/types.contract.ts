/**
 * Generation Contract V1 - Source of Truth
 * 
 * This is the single source of truth for all data collected during onboarding.
 * Every piece of information flows into this contract with provenance tracking
 * and confidence scoring.
 */

import type { ManufacturingContract } from './types.contracts.manufacturing';
import type { ConstructionContract } from './types.contracts.construction';
import type { DefenseContract } from './types.contracts.defense';

export type Provenance = "nlp" | "manual" | "default";
export type Confidence = 0 | 1 | 2 | 3; // 0=unknown, 1=low, 2=medium, 3=high
export type Industry = "manufacturing" | "construction" | "defense";
export type SubIndustry = "fashion" | "general" | null;

export interface LocationData {
  city: string;
  country?: string;
  timezone?: string;
  prov: Provenance;
  conf: Confidence;
}

export interface LeadTimeData {
  avgDays?: number;
  prov: Provenance;
  conf: Confidence;
}

export interface ItemAttribute {
  key: string;
  type: "text" | "number" | "date" | "dropdown" | "checkbox";
  required: boolean;
  values?: string[]; // For dropdown options
}

export interface ComponentDefinition {
  name: string;
  attributes: ItemAttribute[];
}

export interface WorkflowStage {
  name: string;
  durationHours?: number;
  ownerDept?: string;
  quality?: {
    checkpoint: boolean;
    criteria?: string[];
  } | null;
}

export interface FloorZone {
  type: "production" | "qa" | "storage" | "shipping" | "office";
  name: string;
  sqft?: number;
  supervisor?: string;
}

export interface FloorDefinition {
  name: string;
  zones: FloorZone[];
}

export interface Department {
  name: string;
  roles: string[];
  access: "view" | "edit" | "full";
}

export interface IntegrationSystem {
  type: "erp" | "mrp" | "spreadsheet" | "custom";
  name: string;
  priority: "day1" | "soon" | "later";
}

export interface SyncPreferences {
  dataTypes: string[];
  frequency: "realtime" | "hourly" | "daily" | "manual";
}

export interface PlaybookTask {
  task: string;
  dept: string;
}

export interface BranchingLogEntry {
  ruleId: string;
  outcome: boolean;
  because: string;
  timestamp: string;
}

/**
 * Complete Generation Contract
 * Maps to all data collected across all onboarding sections
 */
export interface GenerationContractV1 {
  version: "1.0.0";
  
  company: {
    name: string;
    logoUrl?: string;
    industry: Industry;
    subIndustry?: SubIndustry;
    locations: LocationData[];
    size: "<10" | "10-50" | "50-200" | "200+";
    facilities: "single" | "multi";
  };
  
  operations: {
    model: "MTO" | "MTS" | "hybrid";
    monthlyCapacity?: number;
    shiftsPerDay?: 1 | 2 | 3 | 24;
    seasonality?: {
      months: number[]; // 0-11 (Jan-Dec)
    } | null;
    leadTimes?: LeadTimeData;
  };
  
  items: {
    categories: string[];
    trackingLevel: "unit" | "batch" | "order";
    attributes: ItemAttribute[];
    components?: ComponentDefinition[];
  };
  
  workflows: {
    stages: WorkflowStage[];
  };
  
  sites?: {
    floors: FloorDefinition[];
  } | null;
  
  teams: {
    departments: Department[];
    floorAppEnabled: boolean;
  };
  
  integrations?: {
    systems: IntegrationSystem[];
    syncPreferences?: SyncPreferences;
    apiAccess: boolean;
  } | null;
  
  analytics: {
    audience: Array<"exec" | "ops" | "floor" | "partners">;
    keyMetrics: string[];
    chartPreference: "trends" | "comparison" | "metrics" | "tables";
    reportFrequency: "realtime" | "daily" | "weekly" | "monthly";
  };
  
  playbooks?: {
    orderOnAccepted: PlaybookTask[];
  } | null;
  
  metadata: {
    idempotencyKey: string;
    createdAt: string;
    completedAt?: string;
    lastStep: string;
    branchingLog: BranchingLogEntry[];
    extractedEntities?: any[];
    committedFields?: string[]; // Track which fields have been explicitly confirmed
  };
  
  // Industry-specific extensions
  manufacturingExt?: ManufacturingContract;
  constructionExt?: ConstructionContract;
  defenseExt?: DefenseContract;
}

/**
 * Helper to create an empty contract with defaults
 */
export function createEmptyContract(idempotencyKey: string): GenerationContractV1 {
  return {
    version: "1.0.0",
    company: {
      name: "",
      industry: "manufacturing",
      locations: [],
      size: "10-50",
      facilities: "single",
    },
    operations: {
      model: "MTO",
      seasonality: null,
    },
    items: {
      categories: [],
      trackingLevel: "batch",
      attributes: [
        { key: "name", type: "text", required: true },
        { key: "code", type: "text", required: true },
        { key: "quantity", type: "number", required: true },
      ],
    },
    workflows: {
      stages: [],
    },
    sites: null,
    teams: {
      departments: [],
      floorAppEnabled: false,
    },
    integrations: null,
    analytics: {
      audience: ["ops"],
      keyMetrics: [],
      chartPreference: "trends",
      reportFrequency: "realtime",
    },
    playbooks: null,
    metadata: {
      idempotencyKey,
      createdAt: new Date().toISOString(),
      lastStep: "welcome",
      branchingLog: [],
    },
  };
}

