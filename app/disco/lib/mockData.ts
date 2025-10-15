// Mock Data Generators for Disco AI Showcase

import { DataSource, DiscoModelState, ScanningModelConfig } from '../types';

export const generateMockDataSources = (): DataSource[] => {
  return [
    {
      id: 'production-orders',
      name: 'Production Orders',
      icon: 'ShoppingCart',
      type: 'production',
      totalRecords: 12543,
      recordsToday: 45,
      recentActivity: [120, 134, 128, 156, 145, 167, 172],
      lastUpdated: new Date(Date.now() - 120000), // 2 minutes ago
      qualityScore: 96,
      completeness: 98,
      consistency: 94,
      issues: [],
      tables: [
        {
          id: 'orders-main',
          name: 'Orders',
          recordCount: 8234,
          lastUpdated: new Date(Date.now() - 120000),
          qualityScore: 97,
          selected: true,
          preview: [],
          schema: { fields: [] }
        },
        {
          id: 'orders-line-items',
          name: 'Line Items',
          recordCount: 4309,
          lastUpdated: new Date(Date.now() - 120000),
          qualityScore: 95,
          selected: true,
          preview: [],
          schema: { fields: [] }
        }
      ],
      selected: true,
      available: true,
      isLive: true,
      recentCount: 3
    },
    {
      id: 'inventory',
      name: 'Inventory Tracking',
      icon: 'Package',
      type: 'inventory',
      totalRecords: 8762,
      recordsToday: 234,
      recentActivity: [180, 195, 210, 234, 198, 215, 234],
      lastUpdated: new Date(Date.now() - 180000), // 3 minutes ago
      qualityScore: 89,
      completeness: 92,
      consistency: 86,
      issues: ['Missing supplier data in 5% of records'],
      tables: [
        {
          id: 'inventory-items',
          name: 'Inventory Items',
          recordCount: 5421,
          lastUpdated: new Date(Date.now() - 180000),
          qualityScore: 91,
          selected: true,
          preview: [],
          schema: { fields: [] }
        },
        {
          id: 'inventory-movements',
          name: 'Movements',
          recordCount: 3341,
          lastUpdated: new Date(Date.now() - 180000),
          qualityScore: 87,
          selected: true,
          preview: [],
          schema: { fields: [] }
        }
      ],
      selected: true,
      available: true,
      isLive: true,
      recentCount: 8
    },
    {
      id: 'workflows',
      name: 'Workflow Executions',
      icon: 'Workflow',
      type: 'workflow',
      totalRecords: 23456,
      recordsToday: 567,
      recentActivity: [450, 478, 521, 498, 534, 556, 567],
      lastUpdated: new Date(Date.now() - 60000), // 1 minute ago
      qualityScore: 94,
      completeness: 96,
      consistency: 92,
      issues: [],
      tables: [
        {
          id: 'workflow-runs',
          name: 'Workflow Runs',
          recordCount: 15234,
          lastUpdated: new Date(Date.now() - 60000),
          qualityScore: 95,
          selected: true,
          preview: [],
          schema: { fields: [] }
        },
        {
          id: 'workflow-stages',
          name: 'Stage Executions',
          recordCount: 8222,
          lastUpdated: new Date(Date.now() - 60000),
          qualityScore: 93,
          selected: true,
          preview: [],
          schema: { fields: [] }
        }
      ],
      selected: true,
      available: true,
      isLive: true,
      recentCount: 12
    },
    {
      id: 'customers',
      name: 'Customer Data',
      icon: 'Users',
      type: 'customer',
      totalRecords: 1842,
      recordsToday: 12,
      recentActivity: [8, 11, 9, 15, 10, 14, 12],
      lastUpdated: new Date(Date.now() - 300000), // 5 minutes ago
      qualityScore: 92,
      completeness: 94,
      consistency: 90,
      issues: [],
      tables: [
        {
          id: 'customers-main',
          name: 'Customers',
          recordCount: 1024,
          lastUpdated: new Date(Date.now() - 300000),
          qualityScore: 93,
          selected: false,
          preview: [],
          schema: { fields: [] }
        },
        {
          id: 'customer-orders',
          name: 'Customer Orders',
          recordCount: 818,
          lastUpdated: new Date(Date.now() - 300000),
          qualityScore: 91,
          selected: false,
          preview: [],
          schema: { fields: [] }
        }
      ],
      selected: false,
      available: true,
      isLive: true,
      recentCount: 1
    },
    {
      id: 'materials',
      name: 'Materials Management',
      icon: 'Layers',
      type: 'production',
      totalRecords: 6234,
      recordsToday: 89,
      recentActivity: [65, 72, 78, 81, 76, 85, 89],
      lastUpdated: new Date(Date.now() - 240000), // 4 minutes ago
      qualityScore: 88,
      completeness: 90,
      consistency: 86,
      issues: ['Some lead time data incomplete'],
      tables: [
        {
          id: 'materials-main',
          name: 'Materials',
          recordCount: 3456,
          lastUpdated: new Date(Date.now() - 240000),
          qualityScore: 89,
          selected: false,
          preview: [],
          schema: { fields: [] }
        },
        {
          id: 'materials-suppliers',
          name: 'Suppliers',
          recordCount: 2778,
          lastUpdated: new Date(Date.now() - 240000),
          qualityScore: 87,
          selected: false,
          preview: [],
          schema: { fields: [] }
        }
      ],
      selected: false,
      available: true,
      isLive: true,
      recentCount: 5
    },
    {
      id: 'teams',
      name: 'Team Activities',
      icon: 'Users',
      type: 'team',
      totalRecords: 15678,
      recordsToday: 456,
      recentActivity: [320, 345, 389, 412, 398, 434, 456],
      lastUpdated: new Date(Date.now() - 90000), // 1.5 minutes ago
      qualityScore: 91,
      completeness: 93,
      consistency: 89,
      issues: [],
      tables: [
        {
          id: 'team-tasks',
          name: 'Tasks',
          recordCount: 9876,
          lastUpdated: new Date(Date.now() - 90000),
          qualityScore: 92,
          selected: false,
          preview: [],
          schema: { fields: [] }
        },
        {
          id: 'team-messages',
          name: 'Messages',
          recordCount: 5802,
          lastUpdated: new Date(Date.now() - 90000),
          qualityScore: 90,
          selected: false,
          preview: [],
          schema: { fields: [] }
        }
      ],
      selected: false,
      available: true,
      isLive: true,
      recentCount: 7
    },
    {
      id: 'quality-checks',
      name: 'Quality Inspections',
      icon: 'CheckSquare',
      type: 'production',
      totalRecords: 4521,
      recordsToday: 67,
      recentActivity: [45, 52, 48, 61, 55, 64, 67],
      lastUpdated: new Date(Date.now() - 420000), // 7 minutes ago
      qualityScore: 85,
      completeness: 88,
      consistency: 82,
      issues: ['Missing inspection notes in 12% of records'],
      tables: [
        {
          id: 'quality-inspections',
          name: 'Inspections',
          recordCount: 2876,
          lastUpdated: new Date(Date.now() - 420000),
          qualityScore: 86,
          selected: false,
          preview: [],
          schema: { fields: [] }
        },
        {
          id: 'quality-issues',
          name: 'Issues Found',
          recordCount: 1645,
          lastUpdated: new Date(Date.now() - 420000),
          qualityScore: 84,
          selected: false,
          preview: [],
          schema: { fields: [] }
        }
      ],
      selected: false,
      available: true,
      isLive: true,
      recentCount: 2
    },
    {
      id: 'communications',
      name: 'Communications',
      icon: 'MessageSquare',
      type: 'customer',
      totalRecords: 8934,
      recordsToday: 123,
      recentActivity: [89, 95, 101, 108, 98, 115, 123],
      lastUpdated: new Date(Date.now() - 150000), // 2.5 minutes ago
      qualityScore: 87,
      completeness: 89,
      consistency: 85,
      issues: [],
      tables: [
        {
          id: 'comm-emails',
          name: 'Emails',
          recordCount: 5234,
          lastUpdated: new Date(Date.now() - 150000),
          qualityScore: 88,
          selected: false,
          preview: [],
          schema: { fields: [] }
        },
        {
          id: 'comm-messages',
          name: 'Messages',
          recordCount: 3700,
          lastUpdated: new Date(Date.now() - 150000),
          qualityScore: 86,
          selected: false,
          preview: [],
          schema: { fields: [] }
        }
      ],
      selected: false,
      available: true,
      isLive: true,
      recentCount: 4
    }
  ];
};

export const generateInitialModelState = (): DiscoModelState => {
  return {
    version: 'v2.4',
    type: 'standard',
    trainingRecords: 0,
    trainingDate: null,
    trainingDuration: 0,
    qualityScore: 82,
    accuracy: 82,
    responseTime: 340,
    successRate: 94,
    status: 'active',
    lastUpdated: new Date(Date.now() - 7200000), // 2 hours ago
    nextTraining: null
  };
};

export const generateDefaultScanningConfig = (): ScanningModelConfig => {
  return {
    enabled: true,
    recordTypes: [
      { type: 'Production Orders', enabled: true, recommended: true },
      { type: 'Material Receipts', enabled: true, recommended: true },
      { type: 'Inventory Changes', enabled: true, recommended: true },
      { type: 'Quality Checks', enabled: false, recommended: false },
      { type: 'Workflow Events', enabled: false, recommended: false },
      { type: 'Team Activities', enabled: false, recommended: false },
      { type: 'Customer Communications', enabled: false, recommended: false },
    ],
    frequency: 'realtime',
    actions: {
      dataValidation: true,
      anomalyDetection: true,
      autoCategorization: true,
      priorityAssignment: false,
      alertTriggering: true
    },
    customRules: []
  };
};

// Simulate data streaming
export const simulateDataUpdate = (sources: DataSource[]): DataSource[] => {
  return sources.map(source => {
    if (!source.isLive) return source;
    
    // Randomly add records to some sources
    const shouldUpdate = Math.random() > 0.7;
    if (shouldUpdate) {
      const newRecords = Math.floor(Math.random() * 5) + 1;
      return {
        ...source,
        totalRecords: source.totalRecords + newRecords,
        recentCount: source.recentCount + newRecords,
        recordsToday: source.recordsToday + newRecords,
        lastUpdated: new Date()
      };
    }
    
    return source;
  });
};

