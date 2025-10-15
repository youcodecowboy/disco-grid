/**
 * Reporting System Type Definitions
 * Comprehensive types for the AI-powered reporting and analytics system
 */

// ============================================================================
// Core Report Types
// ============================================================================

export type Report = {
  id: string;
  name: string;
  description?: string;
  
  // Report structure
  template: ReportTemplate;
  
  // Data configuration
  dataSources: DataSourceConfig[];
  filters: FilterConfig[];
  dateRange: DateRangeConfig;
  
  // Visual settings
  theme: "light" | "dark" | "brand";
  format: "pdf" | "html" | "dashboard";
  orientation: "portrait" | "landscape";
  includeTableOfContents: boolean;
  includeFooter: boolean;
  
  // Scheduling & automation
  schedule?: ScheduleConfig;
  lastGenerated?: string;
  nextGeneration?: string;
  
  // Distribution
  distribution: DistributionConfig;
  
  // Status & tracking
  status: "Draft" | "Active" | "Paused" | "Archived";
  runs: string[]; // ReportRun IDs
  
  // Ownership
  createdBy: string;
  owner: string;
  sharedWith: string[];
  
  // Metadata
  tags: string[];
  category: string;
  isTemplate: boolean;
  
  createdAt: string;
  updatedAt: string;
};

export type ReportTemplate = {
  id: string;
  name: string;
  
  // Grid-based layout
  layout: {
    cols: number;
    rows: number;
    gap: number;
  };
  
  // Components on the report
  blocks: ReportBlock[];
  
  // Page settings
  pages: number;
  pageBreaks: string[];
  
  // Header/Footer
  header?: ReportSection;
  footer?: ReportSection;
  
  // Styling
  styles: {
    fonts: FontConfig;
    colors: ColorPalette;
    spacing: SpacingConfig;
    branding?: BrandingConfig;
  };
};

export type ReportBlock = {
  id: string;
  type: AnalyticsBlockType;
  title?: string;
  dataSource: string;
  config: BlockConfig;
  position: GridCoordinates;
  filters?: FilterConfig[];
  
  // Interactivity
  interactive: boolean;
  drillDown?: DrillDownConfig;
};

export type AnalyticsBlockType =
  // Charts
  | "chart.line"
  | "chart.bar"
  | "chart.pie"
  | "chart.donut"
  | "chart.area"
  | "chart.scatter"
  | "chart.heatmap"
  | "chart.gauge"
  | "chart.waterfall"
  | "chart.combo"
  
  // Tables
  | "table.data"
  | "table.summary"
  | "table.comparison"
  
  // KPIs & Metrics
  | "metric.kpi"
  | "metric.grid"
  | "metric.comparison"
  | "metric.trend"
  | "metric.leaderboard"
  
  // Specialized
  | "timeline.events"
  | "calendar.heatmap"
  | "map.geographic"
  | "progress.tracker"
  
  // Content
  | "text.heading"
  | "text.paragraph"
  | "text.bullet"
  | "image"
  | "divider"
  | "spacer";

// ============================================================================
// Data Source Types
// ============================================================================

export type DataSourceConfig = {
  id: string;
  name: string;
  type: DataSourceType;
  
  source: string;
  query?: QueryConfig;
  staticData?: any[];
  
  refreshMode: "realtime" | "scheduled" | "static";
  refreshInterval?: number;
  lastRefreshed?: string;
  
  aggregations?: AggregationConfig[];
  calculations?: CalculationConfig[];
  joins?: JoinConfig[];
};

export type DataSourceType =
  | "orders"
  | "items"
  | "line_items"
  | "teams"
  | "people"
  | "tasks"
  | "devices"
  | "scans"
  | "workflows"
  | "custom"
  | "formula";

export type QueryConfig = {
  entity: string;
  filters: FilterExpression[];
  groupBy?: string[];
  aggregates?: AggregateFunction[];
  sortBy?: string;
  limit?: number;
};

export type FilterConfig = {
  field: string;
  operator: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "in" | "nin" | "contains" | "startsWith" | "endsWith";
  value: any;
};

export type FilterExpression = FilterConfig;

export type AggregateFunction = {
  function: "sum" | "avg" | "min" | "max" | "count" | "distinct";
  field: string;
  as?: string;
};

export type AggregationConfig = {
  field: string;
  operation: "sum" | "avg" | "min" | "max" | "count" | "distinct";
  as: string;
};

export type CalculationConfig = {
  name: string;
  formula: string;
  format?: "number" | "percent" | "currency";
};

export type JoinConfig = {
  sourceId: string;
  type: "inner" | "left" | "right" | "outer";
  on: { left: string; right: string };
};

// ============================================================================
// Scheduling Types
// ============================================================================

export type ScheduleConfig = {
  enabled: boolean;
  frequency: "once" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "custom";
  time?: string;
  timezone: string;
  daysOfWeek?: Array<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday">;
  dayOfMonth?: number | "last";
  cronExpression?: string;
  startDate?: string;
  endDate?: string;
  skipWeekends?: boolean;
  skipHolidays?: boolean;
  reportPeriod: "last_day" | "last_week" | "last_month" | "last_quarter" | "last_year" | "custom";
};

export type AdvancedScheduleConfig = {
  baseSchedule: ScheduleConfig;
  conditions?: ScheduleCondition[];
  adaptive?: AdaptiveScheduleConfig;
  triggers?: EventTrigger[];
  pauseRules?: PauseRule[];
  notifications: NotificationConfig;
};

export type ScheduleCondition = {
  id: string;
  type: "data_threshold" | "business_rule" | "calendar_event";
  condition: string;
  action: "send" | "skip" | "modify";
  modification?: {
    addWarning?: boolean;
    highlightSection?: string;
    changeRecipients?: string[];
  };
};

export type AdaptiveScheduleConfig = {
  enabled: boolean;
  adaptToDataVolume: boolean;
  optimizeForEngagement: boolean;
  skipIfNoChanges: boolean;
  skipIfBelowThreshold: boolean;
  respectBusinessHours: boolean;
  shiftAroundHolidays: boolean;
};

export type EventTrigger = {
  id: string;
  type: "data_event" | "system_event" | "external_event";
  event: string;
  conditions?: string[];
  minTimeBetweenTriggers: number;
  maxTriggersPerDay: number;
  recipientsOverride?: string[];
};

export type PauseRule = {
  id: string;
  reason: string;
  startDate?: string;
  endDate?: string;
  condition?: string;
  autoResume: boolean;
};

// ============================================================================
// Distribution & Contact Types
// ============================================================================

export type DistributionConfig = {
  enabled: boolean;
  recipients: Recipient[];
  channels: DistributionChannel[];
  attachmentFormat?: "pdf" | "excel" | "csv";
  includeLink?: boolean;
  embedInEmail?: boolean;
  requireAuth?: boolean;
  expiresAfter?: number;
  password?: string;
  notifyOnFailure?: boolean;
  notifyOnSuccess?: boolean;
};

export type Recipient = {
  id: string;
  type: "person" | "team" | "contact" | "email";
  value: string;
  name: string;
  role?: string;
  personalizedView?: boolean;
  filters?: FilterConfig[];
};

export type DistributionChannel = {
  type: "email" | "sms" | "slack" | "webhook" | "internal";
  config: Record<string, any>;
  subject?: string;
  message?: string;
  from?: string;
  replyTo?: string;
};

export type Contact = {
  id: string;
  type: "internal_user" | "external_client" | "team" | "distribution_list";
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  department?: string;
  role?: string;
  title?: string;
  reportsTo?: string;
  manages?: string[];
  teams?: string[];
  accessLevel: "full" | "limited" | "custom";
  dataFilters?: FilterConfig[];
  preferences: RecipientPreferences;
  subscribedReports: string[];
  ownedReports: string[];
  engagementStats: EngagementStats;
  dataOwnership: DataOwnership;
  status: "active" | "inactive" | "out_of_office";
  outOfOffice?: OutOfOfficeConfig;
  createdAt: string;
  lastContacted: string;
};

export type RecipientPreferences = {
  userId: string;
  preferredChannel: "email" | "slack" | "sms" | "in-app";
  fallbackChannel?: "email" | "sms";
  frequencyOverride?: {
    reportId: string;
    preferredFrequency: "real-time" | "daily" | "weekly" | "monthly" | "never";
  }[];
  enableDigest: boolean;
  digestFrequency: "daily" | "weekly";
  digestTime: string;
  doNotDisturb: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    exceptUrgent: boolean;
  };
  onlyIfRelevant: boolean;
  minimumThreshold?: number;
  preferredFormat: "pdf" | "html" | "excel";
  embedInEmail: boolean;
  unsubscribed: string[];
};

export type EngagementStats = {
  averageOpenRate: number;
  averageResponseTime: number;
  lastOpenedReport: string;
  preferredFormat: "pdf" | "html" | "excel";
  mostEngagedReportType: string;
};

export type DataOwnership = {
  ownsOrders?: string[];
  ownsClients?: string[];
  ownsTeams?: string[];
};

export type OutOfOfficeConfig = {
  startDate: string;
  endDate: string;
  delegate?: string;
  notification: boolean;
  copyToDelegate: boolean;
  pauseForRecipient: boolean;
};

export type NotificationConfig = {
  preSendNotification?: {
    enabled: boolean;
    minutesBefore: number;
    recipients: string[];
  };
  postSendConfirmation: {
    enabled: boolean;
    includeMetrics: boolean;
    notifyOnlyOwner: boolean;
  };
  failureAlerts: {
    enabled: boolean;
    recipients: string[];
    retryAttempts: number;
    escalateAfter: number;
    escalateTo: string[];
  };
  engagementTracking: {
    enabled: boolean;
    notifyOnLowEngagement: boolean;
    threshold: number;
  };
  digest: {
    enabled: boolean;
    combineMultipleReports: boolean;
    frequency: "daily" | "weekly";
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
    action: "delay" | "skip";
  };
  recipientPreferences: {
    allowUnsubscribe: boolean;
    allowFrequencyChange: boolean;
    allowChannelSelection: boolean;
  };
};

// ============================================================================
// AI Recommendation Types
// ============================================================================

export type AIRecommendation = {
  id: string;
  confidence: number;
  reportType: string;
  reasoning: string;
  suggestedBlocks: SuggestedBlock[];
  suggestedSchedule: ScheduleConfig;
  suggestedRecipients: string[];
  similarReports: string[];
  usageCount: number;
  averageRating: number;
};

export type SuggestedBlock = {
  type: AnalyticsBlockType;
  dataSource: string;
  config: Partial<BlockConfig>;
  position: GridCoordinates;
  reasoning: string;
  alternatives: AnalyticsBlockType[];
};

export type VisualizationRecommendation = {
  type: AnalyticsBlockType;
  confidence: number;
  reasoning: string;
  alternatives: AnalyticsBlockType[];
};

export type DataProfile = {
  hasTimestamp: boolean;
  isSequential: boolean;
  hasCategorical: boolean;
  hasNumericValues: boolean;
  isProportional: boolean;
  categoryCount: number;
  recordCount: number;
  isSingleValue: boolean;
  hasTwoTimeRanges: boolean;
  isHierarchical: boolean;
  hasGeolocation: boolean;
};

// ============================================================================
// Report Run & History Types
// ============================================================================

export type ReportRun = {
  id: string;
  reportId: string;
  startedAt: string;
  completedAt?: string;
  duration: number;
  status: "queued" | "running" | "completed" | "failed";
  error?: string;
  outputFormat: "pdf" | "html" | "excel";
  fileUrl?: string;
  fileSize?: number;
  distributionStatus: DistributionStatus[];
  dataCapturedAt: string;
  dataPoints: number;
  triggeredBy: "schedule" | "manual" | "api";
  triggeredByUser?: string;
};

export type DistributionStatus = {
  recipientId: string;
  channel: string;
  status: "sent" | "delivered" | "opened" | "failed";
  sentAt: string;
  deliveredAt?: string;
  openedAt?: string;
  error?: string;
};

// ============================================================================
// Supporting Types
// ============================================================================

export type GridCoordinates = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type BlockConfig = {
  [key: string]: any;
};

export type DateRangeConfig = {
  type: "fixed" | "rolling";
  startDate?: string;
  endDate?: string;
  rollingPeriod?: "last_day" | "last_week" | "last_month" | "last_quarter" | "last_year";
};

export type ReportSection = {
  content: string;
  height: number;
};

export type FontConfig = {
  heading: string;
  body: string;
  sizes: {
    h1: number;
    h2: number;
    h3: number;
    body: number;
    small: number;
  };
};

export type ColorPalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type SpacingConfig = {
  section: number;
  block: number;
  content: number;
};

export type BrandingConfig = {
  logo: string;
  logoHeight: number;
  companyName: string;
  colors: ColorPalette;
};

export type DrillDownConfig = {
  enabled: boolean;
  target: string;
  filters: FilterConfig[];
};

export type DistributionList = {
  id: string;
  name: string;
  description: string;
  members: string[];
  dynamicRules?: {
    includeRoles?: string[];
    includeDepartments?: string[];
    includeTeams?: string[];
    excludeUsers?: string[];
  };
  allowSelfSubscribe: boolean;
  allowSelfUnsubscribe: boolean;
  requireApproval: boolean;
  owner: string;
  defaultPreferences: RecipientPreferences;
  createdAt: string;
  updatedAt: string;
};


