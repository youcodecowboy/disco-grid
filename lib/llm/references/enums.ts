/**
 * LLM Reference Library - Enum Definitions
 * 
 * Centralized enum definitions for all canonical values used across the application.
 * These serve as the source of truth for LLM prompts and validation.
 */

// ============================================================================
// COMPANY & INDUSTRY
// ============================================================================

export const INDUSTRIES = {
  MANUFACTURING: 'manufacturing',
  CONSTRUCTION: 'construction',
  LOGISTICS: 'logistics',
  DEFENSE: 'defense',
  OTHER: 'other'
} as const;

export const SUB_INDUSTRIES = {
  FASHION: 'fashion',
  GENERAL: 'general',
  NULL: null
} as const;

export const COMPANY_SIZES = {
  SMALL: '<10',
  MEDIUM: '10-50',
  LARGE: '50-200',
  ENTERPRISE: '200+'
} as const;

export const FACILITIES_TYPES = {
  SINGLE: 'single',
  MULTI: 'multi'
} as const;

// ============================================================================
// OPERATIONS & PRODUCTION
// ============================================================================

export const OPERATIONS_MODELS = {
  MTO: 'MTO',
  MTS: 'MTS',
  HYBRID: 'hybrid'
} as const;

export const MANUFACTURER_TYPES = {
  MTO: 'MTO',
  STOCK: 'Stock',
  WHITE_LABEL: 'WhiteLabel',
  MIXED: 'Mixed',
  OTHER: 'Other'
} as const;

export const CLIENT_TYPES = {
  BRANDS: 'Brands',
  DISTRIBUTORS: 'Distributors',
  END_CUSTOMERS: 'EndCustomers',
  MIXED: 'Mixed'
} as const;

export const SALES_CHANNELS = {
  ONLINE: 'Online',
  RETAIL: 'Retail',
  WHOLESALE: 'Wholesale'
} as const;

export const SHIFTS = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  TWENTY_FOUR: 24
} as const;

export const TRACKING_LEVELS = {
  UNIT: 'unit',
  BATCH: 'batch',
  ORDER: 'order'
} as const;

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export const PRODUCT_TYPES = {
  JEANS: 'Jeans',
  JACKETS: 'Jackets',
  SHIRTS: 'Shirts',
  DRESSES: 'Dresses',
  SKIRTS: 'Skirts',
  SHORTS: 'Shorts',
  ACCESSORIES: 'Accessories',
  OTHER: 'Other'
} as const;

// ============================================================================
// WORKFLOW STAGES
// ============================================================================

export const WORKFLOW_STAGES = {
  RECEIVING: 'Receiving',
  CUTTING: 'Cutting',
  SEWING: 'Sewing',
  WASHING: 'Washing',
  FINISHING: 'Finishing',
  PACKING: 'Packing',
  QA: 'QA',
  QUALITY: 'Quality',
  INSPECTION: 'Inspection',
  SHIPPING: 'Shipping',
  TESTING: 'Testing',
  ASSEMBLY: 'Assembly',
  IRONING: 'Ironing',
  EMBROIDERY: 'Embroidery',
  PRINTING: 'Printing'
} as const;

// ============================================================================
// DEPARTMENTS
// ============================================================================

export const DEPARTMENTS = {
  CUTTING: 'Cutting',
  SEWING: 'Sewing',
  WASHING: 'Washing',
  FINISHING: 'Finishing',
  QC: 'QC',
  PACKING: 'Packing',
  MAINTENANCE: 'Maintenance',
  ADMIN: 'Admin',
  LOGISTICS: 'Logistics',
  MANAGEMENT: 'Management',
  OPERATIONS: 'Operations',
  QUALITY: 'Quality',
  WAREHOUSE: 'Warehouse',
  SHIPPING: 'Shipping',
  RECEIVING: 'Receiving',
  DESIGN: 'Design',
  SALES: 'Sales',
  CUSTOMER_SERVICE: 'Customer Service',
  ENGINEERING: 'Engineering',
  OTHER: 'Other'
} as const;

// ============================================================================
// ROLES
// ============================================================================

export const ROLE_TYPES = {
  OPERATORS: 'Operators',
  SUPERVISORS: 'Supervisors',
  QUALITY_INSPECTORS: 'QualityInspectors',
  MAINTENANCE: 'Maintenance',
  LOGISTICS: 'Logistics',
  ADMIN: 'Admin',
  MANAGEMENT: 'Management',
  OTHER: 'Other'
} as const;

// ============================================================================
// PLANNING & TRACKING
// ============================================================================

export const PLANNING_METHODS = {
  MANUAL_BOARD: 'ManualBoard',
  SPREADSHEET: 'Spreadsheet',
  ERP: 'ERP',
  VERBAL: 'Verbal',
  OTHER: 'Other'
} as const;

export const DAILY_PLANNING_STYLES = {
  BY_ORDER: 'ByOrder',
  BY_BATCH: 'ByBatch',
  BY_CAPACITY: 'ByCapacity',
  MIXED: 'Mixed'
} as const;

export const DATA_TRACKING_METHODS = {
  PAPER: 'Paper',
  SPREADSHEET: 'Spreadsheet',
  SOFTWARE: 'Software',
  VERBAL: 'Verbal',
  OTHER: 'Other'
} as const;

export const DATA_ENTRY_FREQUENCIES = {
  REAL_TIME: 'RealTime',
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  AFTER_COMPLETION: 'AfterCompletion',
  NEVER: 'Never'
} as const;

// ============================================================================
// INVENTORY & STORAGE
// ============================================================================

export const INVENTORY_LEVELS = {
  RAW: 'Raw',
  WIP: 'WIP',
  FINISHED: 'Finished'
} as const;

export const STORAGE_SYSTEMS = {
  DEFINED_BINS: 'DefinedBins',
  RACKS: 'Racks',
  CARTS: 'Carts',
  MIXED: 'Mixed',
  OTHER: 'Other'
} as const;

export const QR_BARCODE_USE = {
  NONE: 'None',
  BARCODES: 'Barcodes',
  QR_CODES: 'QRCodes',
  BOTH: 'Both'
} as const;

// ============================================================================
// CHALLENGES & GOALS
// ============================================================================

export const CHALLENGE_CATEGORIES = {
  PRODUCTION_FLOW: 'ProductionFlow',
  DATA_VISIBILITY: 'DataVisibility',
  COMMUNICATION: 'Communication',
  QUALITY: 'Quality',
  LEAD_TIME: 'LeadTime',
  COSTS: 'Costs'
} as const;

export const GOAL_CATEGORIES = {
  MAINTAIN: 'Maintain',
  EXPAND: 'Expand',
  AGGRESSIVE_EXPAND: 'AggressiveExpand',
  EFFICIENCY: 'Efficiency',
  PROFITABILITY: 'Profitability',
  QUALITY: 'Quality'
} as const;

export const BOTTLENECK_TYPES = {
  PEOPLE: 'People',
  MACHINES: 'Machines',
  DATA: 'Data',
  OTHER: 'Other'
} as const;

// ============================================================================
// COMPLIANCE
// ============================================================================

export const COMPLIANCE_TYPES = {
  BSCI: 'BSCI',
  WRAP: 'WRAP',
  ISO9001: 'ISO9001',
  ISO14001: 'ISO14001',
  SEDEX: 'Sedex',
  GOTS: 'GOTS',
  OTHER: 'Other'
} as const;

// ============================================================================
// TEAMS & COMMUNICATION
// ============================================================================

export const SHIFT_STRUCTURES = {
  SINGLE_SHIFT: 'SingleShift',
  TWO_SHIFTS: 'TwoShifts',
  THREE_SHIFTS: 'ThreeShifts',
  VARIABLE: 'Variable'
} as const;

export const COMMUNICATION_METHODS = {
  VERBAL: 'Verbal',
  WHATSAPP: 'WhatsApp',
  PAPER: 'Paper',
  WALKIE_TALKIE: 'WalkieTalkie',
  SOFTWARE: 'Software',
  MIXED: 'Mixed',
  OTHER: 'Other'
} as const;

export const COMMUNICATION_TOOLS = {
  VERBAL: 'Verbal',
  WHATSAPP: 'WhatsApp',
  EMAIL: 'Email',
  SLACK: 'Slack',
  TEAMS: 'Teams',
  ERP_CHAT: 'ERPChat',
  OTHER: 'Other'
} as const;

export const MEETING_FREQUENCIES = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  BI_WEEKLY: 'BiWeekly',
  MONTHLY: 'Monthly',
  AD_HOC: 'AdHoc'
} as const;

export const TRAINING_METHODS = {
  SHADOWING: 'Shadowing',
  FORMAL_SESSIONS: 'FormalSessions',
  VIDEO_GUIDES: 'VideoGuides',
  MIXED: 'Mixed',
  OTHER: 'Other'
} as const;

export const CROSS_TRAINING_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
} as const;

export const ISSUE_OWNERSHIP_STYLES = {
  SUPERVISOR: 'Supervisor',
  MANAGER: 'Manager',
  QC: 'QC',
  TEAM_LEAD: 'TeamLead',
  MIXED: 'Mixed'
} as const;

export const PERFORMANCE_TRACKING = {
  INDIVIDUAL: 'Individual',
  TEAM: 'Team',
  BOTH: 'Both',
  NONE: 'None'
} as const;

export const PERFORMANCE_METRICS = {
  OUTPUT: 'Output',
  QUALITY: 'Quality',
  ATTENDANCE: 'Attendance',
  EFFICIENCY: 'Efficiency',
  OTHER: 'Other'
} as const;

export const HIRING_METHODS = {
  REFERRAL: 'Referral',
  AGENCY: 'Agency',
  DIRECT_HIRE: 'DirectHire',
  MIXED: 'Mixed',
  OTHER: 'Other'
} as const;

// ============================================================================
// INTEGRATIONS & SYSTEMS
// ============================================================================

export const DIGITAL_TOOLS_LEVELS = {
  NONE: 'None',
  BASIC: 'Basic (Excel/Sheets)',
  INTERMEDIATE: 'Intermediate (ERP/CRM)',
  ADVANCED: 'Advanced (Integrated Systems)'
} as const;

export const PRODUCTION_SYSTEMS = {
  PAPER: 'Paper',
  SPREADSHEET: 'Spreadsheet',
  ERP: 'ERP',
  CUSTOM_SOFTWARE: 'CustomSoftware',
  OTHER: 'Other'
} as const;

export const INVENTORY_SYSTEMS = {
  NONE: 'None',
  PAPER: 'Paper',
  SPREADSHEET: 'Spreadsheet',
  ERP: 'ERP',
  WMS: 'WMS',
  OTHER: 'Other'
} as const;

export const ORDER_SYSTEMS = {
  PAPER: 'Paper',
  SPREADSHEET: 'Spreadsheet',
  ERP: 'ERP',
  ECOMMERCE: 'ECommerce',
  EMAIL: 'Email',
  OTHER: 'Other'
} as const;

export const ORDER_PLATFORMS = {
  SHOPIFY: 'Shopify',
  WOOCOMMERCE: 'WooCommerce',
  CUSTOM: 'Custom',
  OTHER: 'Other'
} as const;

export const ACCOUNTING_SYSTEMS = {
  NONE: 'None',
  MANUAL: 'Manual',
  EXCEL: 'Excel',
  QUICKBOOKS: 'QuickBooks',
  XERO: 'Xero',
  ERP: 'ERP',
  OTHER: 'Other'
} as const;

export const FILE_STORAGE_SYSTEMS = {
  LOCAL_COMPUTER: 'LocalComputer',
  GOOGLE_DRIVE: 'GoogleDrive',
  DROPBOX: 'Dropbox',
  ONEDRIVE: 'OneDrive',
  ERP: 'ERP',
  PAPER: 'Paper',
  OTHER: 'Other'
} as const;

export const REPORTING_METHODS = {
  PAPER_REPORTS: 'PaperReports',
  EXCEL_DASHBOARDS: 'ExcelDashboards',
  ERP: 'ERP',
  NONE: 'None',
  OTHER: 'Other'
} as const;

export const REPORTING_FREQUENCIES = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  RARELY: 'Rarely'
} as const;

export const DATA_SHARING_FORMATS = {
  EMAIL: 'Email',
  PDF: 'PDF',
  SPREADSHEET: 'Spreadsheet',
  PORTAL: 'Portal',
  VERBAL: 'Verbal'
} as const;

export const DATA_BACKUP_METHODS = {
  NONE: 'None',
  MANUAL_COPIES: 'ManualCopies',
  CLOUD_AUTO: 'CloudAuto',
  IT_MANAGED: 'ITManaged',
  OTHER: 'Other'
} as const;

export const DATA_BACKUP_FREQUENCIES = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  RARELY: 'Rarely'
} as const;

// ============================================================================
// ANALYTICS & KPIs
// ============================================================================

export const DASHBOARD_TYPES = {
  TABLE_VIEW: 'TableView',
  CARD_VIEW: 'CardView',
  CHART_VIEW: 'ChartView',
  MIXED: 'Mixed'
} as const;

export const DEFAULT_DASHBOARDS = {
  PRODUCTION: 'Production',
  INVENTORY: 'Inventory',
  QUALITY: 'Quality',
  ORDERS: 'Orders',
  TEAM: 'Team',
  FINANCE: 'Finance',
  CUSTOM: 'Custom'
} as const;

export const KPIS_PRIORITY = {
  OUTPUT: 'Output',
  EFFICIENCY: 'Efficiency',
  LEAD_TIME: 'LeadTime',
  REWORK_RATE: 'ReworkRate',
  DEFECT_RATE: 'DefectRate',
  CAPACITY_UTILIZATION: 'CapacityUtilization',
  ON_TIME_DELIVERY: 'OnTimeDelivery',
  PROFIT_MARGIN: 'ProfitMargin',
  OTHER: 'Other'
} as const;

export const KPI_UPDATE_FREQUENCIES = {
  REAL_TIME: 'RealTime',
  HOURLY: 'Hourly',
  DAILY: 'Daily',
  WEEKLY: 'Weekly'
} as const;

export const VISUAL_PREFERENCES = {
  BAR_CHARTS: 'BarCharts',
  LINE_CHARTS: 'LineCharts',
  PIE_CHARTS: 'PieCharts',
  HEATMAPS: 'Heatmaps',
  TABLES: 'Tables',
  MIXED: 'Mixed'
} as const;

export const ALERT_CHANNELS = {
  EMAIL: 'Email',
  IN_APP: 'InApp',
  WHATSAPP: 'WhatsApp',
  SLACK: 'Slack',
  DASHBOARD_BANNER: 'DashboardBanner'
} as const;

export const AUTO_REPORT_RECIPIENTS = {
  ME: 'Me',
  SUPERVISORS: 'Supervisors',
  CLIENTS: 'Clients',
  FINANCE: 'Finance'
} as const;

// ============================================================================
// SITES & FACILITIES
// ============================================================================

export const FLOOR_ZONE_TYPES = {
  PRODUCTION: 'production',
  QA: 'qa',
  STORAGE: 'storage',
  SHIPPING: 'shipping',
  OFFICE: 'office'
} as const;

export const ZONE_TAGS = {
  CUTTING: 'Cutting',
  SEWING: 'Sewing',
  WASHING: 'Washing',
  FINISHING: 'Finishing',
  QC: 'QC',
  STORAGE: 'Storage',
  OFFICE: 'Office',
  PACKING: 'Packing',
  LOADING: 'Loading',
  OTHER: 'Other'
} as const;

export const MACHINE_TYPES = {
  SEWING: 'Sewing',
  CUTTING: 'Cutting',
  WASHING: 'Washing',
  IRONING: 'Ironing',
  EMBROIDERY: 'Embroidery',
  OTHER: 'Other'
} as const;

export const STORAGE_TYPES = {
  RACKS: 'Racks',
  BINS: 'Bins',
  HANGING: 'Hanging',
  MIXED: 'Mixed',
  OTHER: 'Other'
} as const;

export const DISPATCH_AREAS = {
  GROUND_FLOOR: 'GroundFloor',
  BASEMENT: 'Basement',
  LOADING_DOCK: 'LoadingDock',
  SHARED_WAREHOUSE: 'SharedWarehouse',
  OTHER: 'Other'
} as const;

export const FLOW_TRANSPORT_METHODS = {
  ELEVATOR: 'Elevator',
  STAIRS: 'Stairs',
  CARTS: 'Carts',
  MANUAL_CARRY: 'ManualCarry',
  OTHER: 'Other'
} as const;

export const BOTTLENECK_CAUSES = {
  SPACE: 'Space',
  LAYOUT: 'Layout',
  COORDINATION: 'Coordination',
  OTHER: 'Other'
} as const;

// ============================================================================
// WORKFLOW STAGE DEPENDENCIES & INPUTS/OUTPUTS
// ============================================================================

export const WORKFLOW_INPUT_TYPES = {
  QR_SCAN: 'qr_scan',
  FORM_SUBMISSION: 'form_submission',
  PHOTO_UPLOAD: 'photo_upload',
  MANUAL_CONFIRMATION: 'manual_confirmation',
  BARCODE_SCAN: 'barcode_scan',
  SIGNATURE: 'signature',
  MEASUREMENT: 'measurement',
  INSPECTION: 'inspection'
} as const;

export const WORKFLOW_OUTPUT_TYPES = {
  TASK_COMPLETION: 'task_completion',
  FORM_SUBMISSION: 'form_submission',
  PHOTO_UPLOAD: 'photo_upload',
  QUALITY_CHECK: 'quality_check',
  QUANTITY_CONFIRMATION: 'quantity_confirmation',
  APPROVAL: 'approval',
  SIGNATURE: 'signature'
} as const;

export const WORKFLOW_DEPENDENCY_TYPES = {
  TASK_COMPLETION: 'task_completion',
  APPROVAL: 'approval',
  TIME_DELAY: 'time_delay',
  CAPACITY: 'capacity',
  COMPONENT_COMPLETION: 'component_completion',
  QUANTITY_THRESHOLD: 'quantity_threshold',
  MATERIAL_ARRIVAL: 'material_arrival',
  CUSTOM_CONDITION: 'custom_condition'
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Industry = typeof INDUSTRIES[keyof typeof INDUSTRIES];
export type OperationsModel = typeof OPERATIONS_MODELS[keyof typeof OPERATIONS_MODELS];
export type ManufacturerType = typeof MANUFACTURER_TYPES[keyof typeof MANUFACTURER_TYPES];
export type WorkflowStage = typeof WORKFLOW_STAGES[keyof typeof WORKFLOW_STAGES];
export type Department = typeof DEPARTMENTS[keyof typeof DEPARTMENTS];
export type ProductType = typeof PRODUCT_TYPES[keyof typeof PRODUCT_TYPES];

