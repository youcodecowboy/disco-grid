/**
 * Construction-Specific Contract Extensions
 * 
 * Extends base contract with construction project management fields
 */

export interface ConstructionContract {
  // Project types and scale
  projectTypes: Array<'residential' | 'commercial' | 'infrastructure' | 'industrial' | 'renovation'>;
  typicalProjectSize: 'small' | 'medium' | 'large' | 'mixed';
  averageProjectDuration?: number; // days
  concurrentProjects?: number;
  
  // Job sites
  jobSites: {
    active: number;
    management: 'single' | 'multiple';
    geographicSpread?: 'local' | 'regional' | 'national';
  };
  
  // Subcontractors
  subcontractors?: {
    used: boolean;
    count?: number;
    types?: string[]; // Electrical, Plumbing, HVAC, etc.
    managementSystem?: 'internal' | 'external' | 'both';
  };
  
  // Materials tracking
  materials?: {
    tracking: boolean;
    deliveryTracking?: boolean;
    wasteTracking?: boolean;
    majorMaterials?: string[]; // Concrete, Steel, Lumber, etc.
  };
  
  // Permits and compliance
  permits?: {
    management: boolean;
    types?: string[]; // Building, Electrical, Plumbing, etc.
    jurisdictions?: string[];
  };
  
  // Project phases
  phases: {
    typical: string[]; // Planning, Foundation, Framing, etc.
    durationTracking: boolean;
    milestonePayments?: boolean;
  };
  
  // Change orders
  changeOrders: {
    frequency: 'rare' | 'occasional' | 'frequent';
    approvalProcess?: 'simple' | 'complex';
    tracking: boolean;
  };
  
  // Safety and compliance
  safety?: {
    osha: boolean;
    incidentTracking: boolean;
    inspections: boolean;
  };
}

