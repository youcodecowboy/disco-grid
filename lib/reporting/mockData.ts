/**
 * Mock Data for Reporting System
 * Provides sample data for development and testing
 */

import type {
    Report,
    AIRecommendation,
    Contact,
    DataSourceType,
    AnalyticsBlockType
} from './types';

// ============================================================================
// AI Recommendations Mock Data
// ============================================================================

export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: 'rec-1',
    confidence: 95,
    reportType: 'Weekly Production Summary',
    reasoning: 'This is the most common report type for order data, created by 78% of operations managers',
    suggestedBlocks: [
      {
        type: 'metric.grid' as AnalyticsBlockType,
        dataSource: 'orders',
        config: {
          metrics: ['total_orders', 'completion_rate', 'on_time_percentage', 'overdue_count'],
          layout: '2x2',
        },
        position: { x: 0, y: 0, w: 12, h: 4 },
        reasoning: 'KPI grids provide quick overview of key metrics',
        alternatives: ['metric.kpi', 'metric.comparison'],
      },
      {
        type: 'chart.line' as AnalyticsBlockType,
        dataSource: 'orders',
        config: {
          xAxis: 'date',
          yAxis: 'count',
          timeRange: 'last_7_days',
        },
        position: { x: 0, y: 4, w: 8, h: 6 },
        reasoning: 'Line charts show trends over time clearly',
        alternatives: ['chart.bar', 'chart.area'],
      },
      {
        type: 'table.data' as AnalyticsBlockType,
        dataSource: 'orders',
        config: {
          columns: ['client', 'order_name', 'status', 'items_count', 'deadline'],
          filters: [{ field: 'status', operator: 'in', value: ['In Production', 'Completed'] }],
          limit: 20,
        },
        position: { x: 0, y: 10, w: 12, h: 6 },
        reasoning: 'Tables show detailed order information',
        alternatives: ['table.summary'],
      },
      {
        type: 'timeline.events' as AnalyticsBlockType,
        dataSource: 'orders',
        config: {
          dateField: 'ship_date',
          daysAhead: 14,
          showCompleted: false,
        },
        position: { x: 8, y: 4, w: 4, h: 6 },
        reasoning: 'Timelines help visualize upcoming deadlines',
        alternatives: ['calendar.heatmap'],
      },
    ],
    suggestedSchedule: {
      enabled: true,
      frequency: 'weekly',
      time: '17:00',
      timezone: 'America/New_York',
      daysOfWeek: ['Friday'],
      reportPeriod: 'last_week',
    },
    suggestedRecipients: ['operations_team', 'production_managers'],
    similarReports: ['report-1', 'report-5', 'report-8'],
    usageCount: 156,
    averageRating: 4.7,
  },
  {
    id: 'rec-2',
    confidence: 88,
    reportType: 'Client Performance Report',
    reasoning: 'Great for tracking client relationships and identifying top customers',
    suggestedBlocks: [
      {
        type: 'metric.leaderboard' as AnalyticsBlockType,
        dataSource: 'orders',
        config: {
          groupBy: 'client',
          metric: 'order_volume',
          limit: 10,
          showTrend: true,
        },
        position: { x: 0, y: 0, w: 6, h: 8 },
        reasoning: 'Leaderboards show top performers',
        alternatives: ['chart.bar', 'table.summary'],
      },
      {
        type: 'table.comparison' as AnalyticsBlockType,
        dataSource: 'orders',
        config: {
          groupBy: 'client',
          compareColumns: ['this_month', 'last_month'],
          metrics: ['order_count', 'revenue', 'avg_order_value'],
        },
        position: { x: 6, y: 0, w: 6, h: 8 },
        reasoning: 'Comparison tables show month-over-month changes',
        alternatives: ['metric.comparison'],
      },
      {
        type: 'chart.heatmap' as AnalyticsBlockType,
        dataSource: 'orders',
        config: {
          xAxis: 'week',
          yAxis: 'client',
          metric: 'order_count',
          colorScale: 'blue',
        },
        position: { x: 0, y: 8, w: 12, h: 6 },
        reasoning: 'Heatmaps reveal ordering patterns',
        alternatives: ['chart.bar'],
      },
    ],
    suggestedSchedule: {
      enabled: true,
      frequency: 'monthly',
      time: '16:00',
      timezone: 'America/New_York',
      dayOfMonth: 'last',
      reportPeriod: 'last_month',
    },
    suggestedRecipients: ['account_managers', 'sales_team'],
    similarReports: ['report-3', 'report-9'],
    usageCount: 89,
    averageRating: 4.5,
  },
  {
    id: 'rec-3',
    confidence: 82,
    reportType: 'Production Velocity Dashboard',
    reasoning: 'Real-time production tracking for fast-paced environments',
    suggestedBlocks: [
      {
        type: 'chart.gauge' as AnalyticsBlockType,
        dataSource: 'orders',
        config: {
          metric: 'completion_rate',
          target: 95,
          colorZones: [
            { min: 0, max: 70, color: 'red' },
            { min: 70, max: 90, color: 'yellow' },
            { min: 90, max: 100, color: 'green' },
          ],
        },
        position: { x: 0, y: 0, w: 4, h: 4 },
        reasoning: 'Gauges show current performance vs target',
        alternatives: ['metric.kpi'],
      },
      {
        type: 'chart.waterfall' as AnalyticsBlockType,
        dataSource: 'items',
        config: {
          stages: ['received', 'cutting', 'sewing', 'finishing', 'shipped'],
          metric: 'item_count',
        },
        position: { x: 4, y: 0, w: 8, h: 6 },
        reasoning: 'Waterfall charts show items moving through stages',
        alternatives: ['chart.bar'],
      },
      {
        type: 'timeline.events' as AnalyticsBlockType,
        dataSource: 'orders',
        config: {
          dateField: 'ship_date',
          daysAhead: 7,
          highlightOverdue: true,
        },
        position: { x: 0, y: 6, w: 12, h: 6 },
        reasoning: 'Timelines help track imminent deadlines',
        alternatives: ['table.data'],
      },
    ],
    suggestedSchedule: {
      enabled: true,
      frequency: 'daily',
      time: '08:00',
      timezone: 'America/New_York',
      reportPeriod: 'last_day',
      skipWeekends: true,
    },
    suggestedRecipients: ['production_floor', 'shift_leads'],
    similarReports: ['report-2', 'report-11'],
    usageCount: 67,
    averageRating: 4.3,
  },
];

// ============================================================================
// Sample Reports
// ============================================================================

export const mockReports: Report[] = [
  {
    id: 'report-1',
    name: 'Weekly Production Summary',
    description: 'Comprehensive overview of production activity for the week',
    template: {
      id: 'template-1',
      name: 'Production Summary Template',
      layout: { cols: 12, rows: 20, gap: 16 },
      blocks: [],
      pages: 1,
      pageBreaks: [],
      styles: {
        fonts: {
          heading: 'Inter',
          body: 'Inter',
          sizes: { h1: 32, h2: 24, h3: 18, body: 14, small: 12 },
        },
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#8b5cf6',
          background: '#ffffff',
          text: '#1e293b',
        },
        spacing: { section: 32, block: 16, content: 8 },
      },
    },
    dataSources: [
      {
        id: 'ds-orders',
        name: 'Orders',
        type: 'orders' as DataSourceType,
        source: 'orders',
        refreshMode: 'scheduled',
        refreshInterval: 60,
      },
    ],
    filters: [],
    dateRange: { type: 'rolling', rollingPeriod: 'last_week' },
    theme: 'light',
    format: 'pdf',
    orientation: 'portrait',
    includeTableOfContents: false,
    includeFooter: true,
    schedule: {
      enabled: true,
      frequency: 'weekly',
      time: '17:00',
      timezone: 'America/New_York',
      daysOfWeek: ['Friday'],
      reportPeriod: 'last_week',
    },
    distribution: {
      enabled: true,
      recipients: [
        {
          id: 'recip-1',
          type: 'team',
          value: 'operations_team',
          name: 'Operations Team',
          role: 'Primary Recipients',
        },
      ],
      channels: [
        {
          type: 'email',
          config: {},
          subject: 'Weekly Production Summary - {{date}}',
          message: 'Please find attached this week\'s production summary.',
        },
      ],
      attachmentFormat: 'pdf',
      includeLink: true,
    },
    status: 'Active',
    runs: [],
    createdBy: 'user-1',
    owner: 'user-1',
    sharedWith: ['team-operations'],
    tags: ['production', 'weekly', 'summary'],
    category: 'Production',
    isTemplate: false,
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-09T14:30:00Z',
  },
];

// ============================================================================
// Sample Contacts
// ============================================================================

export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    type: 'internal_user',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0123',
    organization: 'Company',
    department: 'Operations',
    role: 'Operations Manager',
    title: 'Senior Operations Manager',
    manages: ['user-3', 'user-4', 'user-5'],
    teams: ['operations_team', 'production_team'],
    accessLevel: 'full',
    preferences: {
      userId: 'contact-1',
      preferredChannel: 'email',
      fallbackChannel: 'sms',
      frequencyOverride: [],
      enableDigest: false,
      digestFrequency: 'weekly',
      digestTime: '08:00',
      doNotDisturb: {
        enabled: true,
        startTime: '22:00',
        endTime: '07:00',
        exceptUrgent: true,
      },
      onlyIfRelevant: false,
      preferredFormat: 'pdf',
      embedInEmail: false,
      unsubscribed: [],
    },
    subscribedReports: ['report-1', 'report-2'],
    ownedReports: ['report-1'],
    engagementStats: {
      averageOpenRate: 95,
      averageResponseTime: 10,
      lastOpenedReport: '2025-10-09T09:15:00Z',
      preferredFormat: 'pdf',
      mostEngagedReportType: 'Production',
    },
    dataOwnership: {
      ownsOrders: ['order-1', 'order-2', 'order-3'],
      ownsTeams: ['operations_team'],
    },
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
    lastContacted: '2025-10-09T09:00:00Z',
  },
  {
    id: 'contact-2',
    type: 'internal_user',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    phone: '+1-555-0124',
    organization: 'Company',
    department: 'Production',
    role: 'Team Lead',
    title: 'Team Lead - Sewing Line A',
    reportsTo: 'contact-1',
    teams: ['sewing_line_a'],
    accessLevel: 'limited',
    preferences: {
      userId: 'contact-2',
      preferredChannel: 'slack',
      enableDigest: true,
      digestFrequency: 'daily',
      digestTime: '07:30',
      doNotDisturb: {
        enabled: false,
        startTime: '22:00',
        endTime: '07:00',
        exceptUrgent: false,
      },
      onlyIfRelevant: true,
      preferredFormat: 'html',
      embedInEmail: true,
      unsubscribed: [],
    },
    subscribedReports: ['report-1', 'report-4'],
    ownedReports: [],
    engagementStats: {
      averageOpenRate: 87,
      averageResponseTime: 25,
      lastOpenedReport: '2025-10-08T16:45:00Z',
      preferredFormat: 'html',
      mostEngagedReportType: 'Team Performance',
    },
    dataOwnership: {
      ownsTeams: ['sewing_line_a'],
    },
    status: 'active',
    createdAt: '2025-02-01T10:00:00Z',
    lastContacted: '2025-10-08T16:00:00Z',
  },
  {
    id: 'contact-3',
    type: 'external_client',
    name: 'Jessica Martinez',
    email: 'jessica@horizonapparel.com',
    phone: '+1-555-0999',
    organization: 'Horizon Apparel',
    role: 'Brand Manager',
    title: 'Senior Brand Manager',
    accessLevel: 'custom',
    dataFilters: [
      { field: 'client', operator: 'eq', value: 'horizon-apparel' },
    ],
    preferences: {
      userId: 'contact-3',
      preferredChannel: 'email',
      enableDigest: false,
      digestFrequency: 'weekly',
      digestTime: '09:00',
      doNotDisturb: {
        enabled: true,
        startTime: '18:00',
        endTime: '09:00',
        exceptUrgent: false,
      },
      onlyIfRelevant: true,
      preferredFormat: 'pdf',
      embedInEmail: false,
      unsubscribed: [],
    },
    subscribedReports: ['report-3'],
    ownedReports: [],
    engagementStats: {
      averageOpenRate: 92,
      averageResponseTime: 120,
      lastOpenedReport: '2025-10-05T10:30:00Z',
      preferredFormat: 'pdf',
      mostEngagedReportType: 'Client Updates',
    },
    dataOwnership: {
      ownsClients: ['horizon-apparel'],
    },
    status: 'active',
    createdAt: '2025-03-10T10:00:00Z',
    lastContacted: '2025-10-05T10:00:00Z',
  },
];

// ============================================================================
// Data Source Suggestions
// ============================================================================

export const dataSourceSuggestions = {
  orders: {
    label: 'Orders',
    description: 'All order data with status, timelines, and client information',
    commonReports: ['Production Summary', 'Client Reports', 'Completion Tracking'],
    recommendedBlocks: ['metric.grid', 'table.data', 'chart.line', 'timeline.events'],
  },
  items: {
    label: 'Items',
    description: 'Item codes and line items with workflow stages',
    commonReports: ['Item Progress', 'Production Velocity', 'Quality Reports'],
    recommendedBlocks: ['chart.waterfall', 'table.data', 'progress.tracker'],
  },
  teams: {
    label: 'Teams & People',
    description: 'Team performance and individual metrics',
    commonReports: ['Team Performance', 'Efficiency Reports', 'Capacity Planning'],
    recommendedBlocks: ['metric.leaderboard', 'chart.bar', 'table.comparison'],
  },
  tasks: {
    label: 'Tasks',
    description: 'Task completion, assignments, and status from Task Master',
    commonReports: ['Task Completion', 'Overdue Items', 'Team Workload'],
    recommendedBlocks: ['table.data', 'metric.grid', 'chart.pie'],
  },
};


