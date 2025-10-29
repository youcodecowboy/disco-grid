/**
 * Defense-Specific Contract Extensions
 * 
 * Extends base contract with defense/government contract fields
 */

export interface DefenseContract {
  // Contract types
  contractTypes: Array<'R&D' | 'Manufacturing' | 'Services' | 'Maintenance' | 'IT/Software'>;
  contractVehicles?: string[]; // GSA Schedule, IDIQ, BPA, etc.
  
  // Security clearances
  securityClearances: {
    required: boolean;
    levels?: Array<'Confidential' | 'Secret' | 'Top Secret' | 'TS/SCI' | 'Unclassified'>;
    facilityCleared?: boolean;
    personnelCount?: { [level: string]: number };
  };
  
  // Deliverables tracking
  deliverables: {
    types: string[]; // Hardware, Software, Reports, etc.
    cdrls?: boolean; // Contract Data Requirements List
    trackingGranularity: 'high' | 'medium' | 'standard';
  };
  
  // Specifications and compliance
  specifications: {
    standards: string[]; // MIL-STD-XXX, ISO-9001, AS9100, etc.
    complianceTracking: boolean;
    auditFrequency?: 'monthly' | 'quarterly' | 'annual';
  };
  
  // Chain of custody
  chainOfCustody: {
    required: boolean;
    itemTracking?: 'full' | 'partial' | 'none';
    serialization: boolean;
    documentRetention?: number; // years
  };
  
  // Testing and validation
  testing: {
    required: boolean;
    stages?: string[]; // Unit, Integration, System, Acceptance, etc.
    witnessPoints?: boolean; // Government witness required
    testReports: boolean;
  };
  
  // Quality management
  quality: {
    system: 'ISO-9001' | 'AS9100' | 'CMMI' | 'custom';
    nonConformanceTracking: boolean;
    correctiveActions: boolean;
  };
  
  // Security and access
  facilityAccess?: {
    badgeSystem: boolean;
    visitorManagement: boolean;
    restrictedAreas?: string[];
  };
  
  // Government property
  governmentProperty?: {
    tracking: boolean;
    types?: string[];
    inventoryFrequency?: 'monthly' | 'quarterly' | 'annual';
  };
}

