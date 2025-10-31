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
    description?: string;
    logoUrl?: string;
    industry: Industry;
    subIndustry?: SubIndustry;
    locations: LocationData[];
    hqLocation?: string;
    size?: "<10" | "10-50" | "50-200" | "200+";
    facilities?: "single" | "multi";
    foundedYear?: number;
    
    // Manufacturer type and client info
    manufacturerType?: "MTO" | "Stock" | "WhiteLabel" | "Mixed" | "Other";
    manufacturerTypeOther?: string;
    clientType?: "Brands" | "Distributors" | "EndCustomers" | "Mixed";
    ownBrand?: boolean;
    salesChannels?: Array<"Online" | "Retail" | "Wholesale">;
    
    // Team information
    teamSizeTotal?: number;
    teamSplit?: boolean;
    teamSplitProduction?: number;
    teamSplitManagement?: number;
    
    // Capacity information
    capacityMonthlyPcs?: number;
    capacityUtilizationFull?: boolean;
    capacityIncreasePlan?: boolean;
    capacityIncreasePct?: number;
    
    // Products and materials
    productTypes?: Array<"Jeans" | "Jackets" | "Shirts" | "Dresses" | "Skirts" | "Shorts" | "Accessories" | "Other">;
    productTypesOther?: string[];
    primaryProduct?: string;
    materialsList?: string[];
    trackMaterials?: boolean;
    
    // Seasonality
    demandSpikesMonths?: number[]; // 0-11 (Jan-Dec)
    slowMonths?: number[]; // 0-11 (Jan-Dec)
    
    // Decision making and goals
    decisionMakerTitle?: string;
    adminAccountCreate?: boolean;
    biggestChallengeText?: string;
    challengeCategory?: "ProductionFlow" | "DataVisibility" | "Communication" | "Quality" | "LeadTime" | "Costs";
    longTermGoalText?: string;
    goalCategory?: "Maintain" | "Expand" | "AggressiveExpand" | "Efficiency" | "Profitability" | "Quality";
    success12moText?: string;
    enableKpiTracking?: boolean;
    
    // Compliance
    complianceHas?: boolean;
    complianceList?: Array<"BSCI" | "WRAP" | "ISO9001" | "ISO14001" | "Sedex" | "GOTS" | "Other">;
    complianceMarkets?: string[];
    complianceReminders?: boolean;
  };
  
  operations: {
    model: "MTO" | "MTS" | "hybrid";
    monthlyCapacity?: number;
    shiftsPerDay?: 1 | 2 | 3 | 24;
    seasonality?: {
      months: number[]; // 0-11 (Jan-Dec)
    } | null;
    leadTimes?: LeadTimeData;
    
    // Production flow and stages
    overview_text?: string;
    stages_list?: string[];
    stage_durations?: Record<string, number>; // Stage name -> hours/days
    stage_buffer_use?: boolean;
    
    // Subcontracting
    subcontract_use?: boolean;
    subcontract_stages?: string[];
    subcontract_partners_consistent?: boolean;
    
    // Planning
    planning_method?: "ManualBoard" | "Spreadsheet" | "ERP" | "Verbal" | "Other";
    planning_method_other?: string;
    daily_planning_style?: "ByOrder" | "ByBatch" | "ByCapacity" | "Mixed";
    target_output_metric?: boolean;
    target_output_qty?: number;
    
    // Inventory and movement
    track_materials_internally?: boolean;
    inventory_levels_tracked?: Array<"Raw" | "WIP" | "Finished">;
    storage_system?: "DefinedBins" | "Racks" | "Carts" | "Mixed" | "Other";
    storage_system_other?: string;
    qr_or_barcode_use?: "None" | "Barcodes" | "QRCodes" | "Both";
    
    // Quality control
    qc_stages?: string[];
    qc_record_defects?: boolean;
    defect_rate_estimate?: number; // Percentage
    
    // Lead time and delays
    total_lead_time_days?: number;
    delay_bottleneck_stage?: string;
    
    // Data capture
    data_tracking_method?: "Paper" | "Spreadsheet" | "Software" | "Verbal" | "Other";
    data_tracking_tool?: string;
    data_entry_frequency?: "RealTime" | "Daily" | "Weekly" | "AfterCompletion" | "Never";
    
    // Pain points
    biggest_bottleneck_text?: string;
    bottleneck_type?: "People" | "Machines" | "Data" | "Other";
    
    // Automation and reporting
    auto_reports_interest?: boolean;
    auto_report_frequency?: "Daily" | "Weekly" | "Monthly";
    delay_alert_interest?: boolean;
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
    count?: number;
    list?: Array<{
      name: string;
      address?: string;
      is_primary?: boolean;
      handles_shipping?: boolean;
      floors_count?: number;
      floors?: Array<{
        name: string;
        zones?: Array<{
          name: string;
          tag?: "Cutting" | "Sewing" | "Washing" | "Finishing" | "QC" | "Storage" | "Office" | "Packing" | "Loading" | "Other";
          people_count?: number;
          has_machines?: boolean;
          machine_count?: number;
          machine_types?: Array<"Sewing" | "Cutting" | "Washing" | "Ironing" | "Embroidery" | "Other">;
          has_storage?: boolean;
          storage_type?: "Racks" | "Bins" | "Hanging" | "Mixed" | "Other";
          storage_capacity_estimate?: number;
        }>;
        total_people?: number;
      }>;
    }>;
    flow_between_floors?: boolean;
    flow_transport_methods?: Array<"Elevator" | "Stairs" | "Carts" | "ManualCarry" | "Other">;
    high_movement_floors?: string[];
    external_flow?: boolean;
    external_flow_locations?: string;
    external_flow_duration_days?: number;
    external_return_floor?: boolean;
    receiving_area_exists?: boolean;
    receiving_floor?: string;
    receiving_responsible?: string;
    dispatch_area_exists?: "GroundFloor" | "Basement" | "LoadingDock" | "SharedWarehouse" | "Other";
    dispatch_wait_time?: number;
    shifts_count?: number;
    shifts_shared_workstations?: boolean;
    environment_tracking_interest?: boolean;
    has_environment_sensors?: boolean;
    bottleneck_location_text?: string;
    bottleneck_cause?: "Space" | "Layout" | "Coordination" | "Other";
  } | null;
  
  teams: {
    departments: Department[];
    floorAppEnabled: boolean;
    // Teams & Roles fields
    total_people?: number;
    total_people_confirm?: boolean;
    departments_list?: Array<"Cutting" | "Sewing" | "Washing" | "Finishing" | "QC" | "Packing" | "Maintenance" | "Admin" | "Logistics" | "Management" | "Other">;
    departments_other?: string;
    department_sizes?: Record<string, number>;
    assign_supervisors?: boolean;
    supervisors?: Array<{ department: string; name: string }>;
    reporting_lines?: Array<{ from: string; to: string }>;
    role_types?: Array<"Operators" | "Supervisors" | "QualityInspectors" | "Maintenance" | "Logistics" | "Admin" | "Management" | "Other">;
    role_types_other?: string;
    role_counts?: Record<string, number>;
    shift_structure?: "SingleShift" | "TwoShifts" | "ThreeShifts" | "Variable";
    shift_lead_overlap?: boolean;
    communication_method?: "Verbal" | "WhatsApp" | "Paper" | "WalkieTalkie" | "Software" | "Mixed" | "Other";
    communication_tool?: string;
    meeting_frequency?: "Daily" | "Weekly" | "BiWeekly" | "Monthly" | "AdHoc";
    training_method?: "Shadowing" | "FormalSessions" | "VideoGuides" | "Mixed" | "Other";
    training_host_interest?: boolean;
    cross_training_level?: "Low" | "Medium" | "High";
    cross_training_links?: string[];
    issue_ownership_style?: "Supervisor" | "Manager" | "QC" | "TeamLead" | "Mixed";
    auto_assign_issues?: boolean;
    performance_tracking?: "Individual" | "Team" | "Both" | "None";
    performance_metrics?: Array<"Output" | "Quality" | "Attendance" | "Efficiency" | "Other">;
    rewards_exist?: boolean;
    rewards_method?: string;
    hiring_method?: "Referral" | "Agency" | "DirectHire" | "Mixed" | "Other";
    hiring_integration_interest?: boolean;
    management_focus_text?: string;
    management_kpi_tracking?: boolean;
  };
  
  integrations?: {
    systems: IntegrationSystem[];
    syncPreferences?: SyncPreferences;
    apiAccess: boolean;
    // Integrations & Data fields
    digital_tools_level?: "None" | "Basic (Excel/Sheets)" | "Intermediate (ERP/CRM)" | "Advanced (Integrated Systems)";
    production_system?: "Paper" | "Spreadsheet" | "ERP" | "CustomSoftware" | "Other";
    production_system_name?: string;
    inventory_system?: "None" | "Paper" | "Spreadsheet" | "ERP" | "WMS" | "Other";
    inventory_system_name?: string;
    order_system?: "Paper" | "Spreadsheet" | "ERP" | "ECommerce" | "Email" | "Other";
    order_platforms?: Array<"Shopify" | "WooCommerce" | "Custom" | "Other">;
    accounting_system?: "None" | "Manual" | "Excel" | "QuickBooks" | "Xero" | "ERP" | "Other";
    accounting_system_name?: string;
    communication_tools?: Array<"Verbal" | "WhatsApp" | "Email" | "Slack" | "Teams" | "ERPChat" | "Other">;
    communication_other?: string;
    file_storage_system?: Array<"LocalComputer" | "GoogleDrive" | "Dropbox" | "OneDrive" | "ERP" | "Paper" | "Other">;
    reporting_method?: "PaperReports" | "ExcelDashboards" | "ERP" | "None" | "Other";
    reporting_frequency?: "Daily" | "Weekly" | "Monthly" | "Rarely";
    data_sharing_partners?: boolean;
    data_sharing_format?: Array<"Email" | "PDF" | "Spreadsheet" | "Portal" | "Verbal">;
    data_backup_method?: "None" | "ManualCopies" | "CloudAuto" | "ITManaged" | "Other";
    data_backup_frequency?: "Daily" | "Weekly" | "Monthly" | "Rarely";
    data_challenges_text?: string;
    priority_issue_flag?: boolean;
    integration_interest?: string;
  } | null;
  
  analytics: {
    audience: Array<"exec" | "ops" | "floor" | "partners">;
    keyMetrics: string[];
    chartPreference: "trends" | "comparison" | "metrics" | "tables";
    reportFrequency: "realtime" | "daily" | "weekly" | "monthly";
    // Analytics & Design fields
    default_dashboard_type?: "TableView" | "CardView" | "ChartView" | "Mixed";
    show_kpi_header?: boolean;
    default_dashboards?: Array<"Production" | "Inventory" | "Quality" | "Orders" | "Team" | "Finance" | "Custom">;
    custom_dashboard_description?: string;
    kpis_priority?: Array<"Output" | "Efficiency" | "LeadTime" | "ReworkRate" | "DefectRate" | "CapacityUtilization" | "OnTimeDelivery" | "ProfitMargin" | "Other">;
    kpis_other?: string;
    kpis_update_frequency?: "RealTime" | "Hourly" | "Daily" | "Weekly";
    visual_preference?: "BarCharts" | "LineCharts" | "PieCharts" | "Heatmaps" | "Tables" | "Mixed";
    auto_visual_suggestions?: boolean;
    alert_preferences?: boolean;
    alert_kpis?: string[];
    alert_channels?: Array<"Email" | "InApp" | "WhatsApp" | "Slack" | "DashboardBanner">;
    auto_reports_enable?: boolean;
    auto_report_frequency?: "Daily" | "Weekly" | "Monthly";
    auto_report_recipients?: Array<"Me" | "Supervisors" | "Clients" | "Finance">;
  };
  
  design?: {
    brand_colors?: boolean;
    brand_primary?: string;
    brand_logo_url?: string;
    ui_density?: "Compact" | "Balanced" | "Spacious";
    theme_style?: "Light" | "Dark" | "Auto";
    grid_layout_interest?: boolean;
    grid_layout_config?: {
      rows?: number;
      columns?: number;
      widgets?: Array<{
        type: string;
        metric?: string;
        visual?: string;
        size: string;
      }>;
    };
    interaction_style?: "Concise" | "Conversational" | "Playful" | "Professional";
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
      stages_list: [],
      stage_durations: {},
      track_materials_internally: false,
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
    sites: {
      count: 0,
      list: [],
    },
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

