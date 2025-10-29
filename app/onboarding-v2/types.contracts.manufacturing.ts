/**
 * Manufacturing-Specific Contract Extensions
 * 
 * Extends base contract with manufacturing-specific fields
 * for fashion and general manufacturing operations
 */

export interface FashionSpecificFields {
  garmentTypes: string[]; // Jeans, Jackets, Shirts, Dresses, etc.
  fabricTypes?: string[]; // Denim, Cotton, Polyester, etc.
  washProcesses?: string[]; // Stone wash, Acid wash, Enzyme wash, etc.
  sizeRanges?: {
    system: 'US' | 'EU' | 'UK' | 'Asia';
    ranges: string[]; // XS-XL, 0-14, etc.
  };
  colorVariants?: string[]; // Blue, Black, Indigo, Raw, etc.
  seasonalCollections?: {
    enabled: boolean;
    seasons: Array<'Spring' | 'Summer' | 'Fall' | 'Winter'>;
  };
  qualityCheckpoints?: {
    preCut?: boolean;
    preSew?: boolean;
    postSew?: boolean;
    preWash?: boolean;
    postWash?: boolean;
    finalInspection?: boolean;
  };
}

export interface GeneralManufacturingFields {
  productLines?: string[]; // Different product categories
  bomComplexity?: 'simple' | 'moderate' | 'complex';
  assemblyStations?: number;
  yieldTracking?: boolean;
  scrapManagement?: boolean;
  lotTracking?: boolean;
  serialization?: boolean;
}

export interface ManufacturingContract {
  subIndustry: 'fashion' | 'general';
  
  // Production specifics
  production: {
    lineCount?: number;
    stationsPerLine?: number;
    averageSetupTime?: number; // minutes
    averageCycleTime?: number; // minutes per unit
    dailyTargetUnits?: number;
  };
  
  // Quality management
  quality: {
    defectTracking: boolean;
    firstPassYield?: number; // percentage
    qualityStages: string[];
    rejectionProcess?: 'rework' | 'scrap' | 'both';
  };
  
  // Fashion-specific (if subIndustry === 'fashion')
  fashion?: FashionSpecificFields;
  
  // General manufacturing (if subIndustry === 'general')
  general?: GeneralManufacturingFields;
  
  // Materials management
  materials?: {
    rawMaterials: string[];
    suppliers?: string[];
    leadTimesDays?: { [material: string]: number };
  };
}

