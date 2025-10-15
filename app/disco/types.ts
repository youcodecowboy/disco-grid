// Disco AI Showcase - Type Definitions

export type DataSourceType = 'production' | 'inventory' | 'workflow' | 'customer' | 'team' | 'custom';

export type ModelType = 'standard' | 'custom' | 'training';

export type ModelStatus = 'active' | 'training' | 'failed' | 'outdated';

export type TrainingStage = 'collecting' | 'processing' | 'extracting' | 'training' | 'validating' | 'deploying';

export interface TableSchema {
  fields: {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'json';
    required: boolean;
    completeness: number;
  }[];
}

export interface DataTable {
  id: string;
  name: string;
  recordCount: number;
  lastUpdated: Date;
  qualityScore: number;
  selected: boolean;
  preview: Record<string, any>[];
  schema: TableSchema;
}

export interface DataSource {
  id: string;
  name: string;
  icon: string;
  type: DataSourceType;
  
  // Metrics
  totalRecords: number;
  recordsToday: number;
  recentActivity: number[]; // Last 7 days
  lastUpdated: Date;
  
  // Quality
  qualityScore: number; // 0-100
  completeness: number; // 0-100
  consistency: number; // 0-100
  issues: string[];
  
  // Tables
  tables: DataTable[];
  
  // State
  selected: boolean;
  available: boolean;
  
  // Streaming
  isLive: boolean;
  recentCount: number; // New records in last minute
}

export interface DiscoModelState {
  // Version Info
  version: string;
  type: ModelType;
  
  // Training Info
  trainingRecords: number;
  trainingDate: Date | null;
  trainingDuration: number; // seconds
  
  // Performance
  qualityScore: number;
  accuracy: number;
  responseTime: number;
  successRate: number;
  
  // Status
  status: ModelStatus;
  lastUpdated: Date;
  nextTraining: Date | null;
}

export interface TrainingProgress {
  stage: TrainingStage;
  progress: number; // 0-100
  currentAction: string;
  startTime: Date;
  estimatedComplete: Date;
  
  // Stage-specific data
  stageData: {
    recordsProcessed?: number;
    totalRecords?: number;
    currentLoss?: number;
    currentAccuracy?: number;
    testsCompleted?: number;
    totalTests?: number;
  };
}

export interface ScanningRule {
  id: string;
  name: string;
  conditions: any[];
  actions: any[];
  enabled: boolean;
}

export interface ScanningModelConfig {
  enabled: boolean;
  
  // Input Selection
  recordTypes: {
    type: string;
    enabled: boolean;
    recommended: boolean;
  }[];
  
  // Scanning Settings
  frequency: 'realtime' | '5min' | '15min' | '1hour' | 'custom';
  customSchedule?: string; // Cron expression
  
  // Actions
  actions: {
    dataValidation: boolean;
    anomalyDetection: boolean;
    autoCategorization: boolean;
    priorityAssignment: boolean;
    alertTriggering: boolean;
  };
  
  // Custom Rules
  customRules: ScanningRule[];
}

export type TabType = 'model-builder' | 'configuration' | 'performance';

