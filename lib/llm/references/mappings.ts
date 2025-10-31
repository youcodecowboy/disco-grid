/**
 * LLM Reference Library - Natural Language to Enum Mappings
 * 
 * Comprehensive mappings from natural language phrases to canonical enum values.
 * These mappings are used by LLMs to extract structured data from user input.
 * 
 * Structure: lowercase key → canonical enum value
 * Multiple variations map to the same canonical value for consistency.
 */

import {
  OPERATIONS_MODELS,
  MANUFACTURER_TYPES,
  CLIENT_TYPES,
  SALES_CHANNELS,
  PRODUCT_TYPES,
  WORKFLOW_STAGES,
  DEPARTMENTS,
  PLANNING_METHODS,
  DAILY_PLANNING_STYLES,
  DATA_TRACKING_METHODS,
  DATA_ENTRY_FREQUENCIES,
  STORAGE_SYSTEMS,
  QR_BARCODE_USE,
  CHALLENGE_CATEGORIES,
  GOAL_CATEGORIES,
  BOTTLENECK_TYPES,
  COMPLIANCE_TYPES,
  SHIFT_STRUCTURES,
  COMMUNICATION_METHODS,
  COMMUNICATION_TOOLS,
  MEETING_FREQUENCIES,
  TRAINING_METHODS,
  CROSS_TRAINING_LEVELS,
  ISSUE_OWNERSHIP_STYLES,
  PERFORMANCE_TRACKING,
  PERFORMANCE_METRICS,
  HIRING_METHODS,
  PRODUCTION_SYSTEMS,
  INVENTORY_SYSTEMS,
  ORDER_SYSTEMS,
  ORDER_PLATFORMS,
  ACCOUNTING_SYSTEMS,
  FILE_STORAGE_SYSTEMS,
  REPORTING_METHODS,
  REPORTING_FREQUENCIES,
  DATA_SHARING_FORMATS,
  DATA_BACKUP_METHODS,
  DATA_BACKUP_FREQUENCIES,
  ZONE_TAGS,
  MACHINE_TYPES,
  STORAGE_TYPES,
  DISPATCH_AREAS,
  FLOW_TRANSPORT_METHODS,
  BOTTLENECK_CAUSES,
  WORKFLOW_INPUT_TYPES,
  WORKFLOW_OUTPUT_TYPES,
  WORKFLOW_DEPENDENCY_TYPES
} from './enums';

// ============================================================================
// OPERATIONS MODEL MAPPINGS
// ============================================================================

export const NL_TO_OPS_MODEL: Record<string, string> = {
  // MTO variations
  'made to order': OPERATIONS_MODELS.MTO,
  'make to order': OPERATIONS_MODELS.MTO,
  'custom order': OPERATIONS_MODELS.MTO,
  'bespoke': OPERATIONS_MODELS.MTO,
  'on-demand': OPERATIONS_MODELS.MTO,
  'custom': OPERATIONS_MODELS.MTO,
  'mto': OPERATIONS_MODELS.MTO,
  
  // MTS variations
  'made to stock': OPERATIONS_MODELS.MTS,
  'make to stock': OPERATIONS_MODELS.MTS,
  'stock': OPERATIONS_MODELS.MTS,
  'ready stock': OPERATIONS_MODELS.MTS,
  'warehouse': OPERATIONS_MODELS.MTS,
  'inventory': OPERATIONS_MODELS.MTS,
  'mts': OPERATIONS_MODELS.MTS,
  
  // Hybrid variations
  'hybrid': OPERATIONS_MODELS.HYBRID,
  'mix': OPERATIONS_MODELS.HYBRID,
  'both': OPERATIONS_MODELS.HYBRID,
  'mixed': OPERATIONS_MODELS.HYBRID
};

export const NL_TO_MANUFACTURER_TYPE: Record<string, string> = {
  // MTO variations
  'made to order': MANUFACTURER_TYPES.MTO,
  'make to order': MANUFACTURER_TYPES.MTO,
  'custom order': MANUFACTURER_TYPES.MTO,
  'bespoke': MANUFACTURER_TYPES.MTO,
  'on-demand': MANUFACTURER_TYPES.MTO,
  'custom': MANUFACTURER_TYPES.MTO,
  'mto': MANUFACTURER_TYPES.MTO,
  
  // Stock variations
  'stock': MANUFACTURER_TYPES.STOCK,
  'ready stock': MANUFACTURER_TYPES.STOCK,
  'warehouse': MANUFACTURER_TYPES.STOCK,
  'inventory': MANUFACTURER_TYPES.STOCK,
  
  // White label variations
  'white label': MANUFACTURER_TYPES.WHITE_LABEL,
  'private label': MANUFACTURER_TYPES.WHITE_LABEL,
  'white label manufacturing': MANUFACTURER_TYPES.WHITE_LABEL,
  
  // Mixed variations
  'mix': MANUFACTURER_TYPES.MIXED,
  'both': MANUFACTURER_TYPES.MIXED,
  'hybrid': MANUFACTURER_TYPES.MIXED,
  'mixed': MANUFACTURER_TYPES.MIXED
};

// ============================================================================
// CLIENT TYPE MAPPINGS
// ============================================================================

export const NL_TO_CLIENT_TYPE: Record<string, string> = {
  'brands': CLIENT_TYPES.BRANDS,
  'labels': CLIENT_TYPES.BRANDS,
  'fashion houses': CLIENT_TYPES.BRANDS,
  'fashion brands': CLIENT_TYPES.BRANDS,
  'clothing brands': CLIENT_TYPES.BRANDS,
  
  'distributors': CLIENT_TYPES.DISTRIBUTORS,
  'wholesalers': CLIENT_TYPES.DISTRIBUTORS,
  'wholesale': CLIENT_TYPES.DISTRIBUTORS,
  'b2b': CLIENT_TYPES.DISTRIBUTORS,
  
  'direct to consumer': CLIENT_TYPES.END_CUSTOMERS,
  'd2c': CLIENT_TYPES.END_CUSTOMERS,
  'end customers': CLIENT_TYPES.END_CUSTOMERS,
  'sell online to customers': CLIENT_TYPES.END_CUSTOMERS,
  'retail customers': CLIENT_TYPES.END_CUSTOMERS,
  'consumers': CLIENT_TYPES.END_CUSTOMERS,
  
  'mixed': CLIENT_TYPES.MIXED,
  'both': CLIENT_TYPES.MIXED,
  'multiple': CLIENT_TYPES.MIXED
};

// ============================================================================
// SALES CHANNEL MAPPINGS
// ============================================================================

export const NL_TO_SALES_CHANNEL: Record<string, string> = {
  'online': SALES_CHANNELS.ONLINE,
  'website': SALES_CHANNELS.ONLINE,
  'shopify': SALES_CHANNELS.ONLINE,
  'amazon': SALES_CHANNELS.ONLINE,
  'ecommerce': SALES_CHANNELS.ONLINE,
  'e-commerce': SALES_CHANNELS.ONLINE,
  'web': SALES_CHANNELS.ONLINE,
  'internet': SALES_CHANNELS.ONLINE,
  
  'retail': SALES_CHANNELS.RETAIL,
  'store': SALES_CHANNELS.RETAIL,
  'boutique': SALES_CHANNELS.RETAIL,
  'shop': SALES_CHANNELS.RETAIL,
  'brick and mortar': SALES_CHANNELS.RETAIL,
  
  'wholesale': SALES_CHANNELS.WHOLESALE,
  'b2b': SALES_CHANNELS.WHOLESALE,
  'business to business': SALES_CHANNELS.WHOLESALE
};

// ============================================================================
// PRODUCT TYPE MAPPINGS
// ============================================================================

export const NL_TO_PRODUCT_TYPE: Record<string, string> = {
  'jeans': PRODUCT_TYPES.JEANS,
  'denim': PRODUCT_TYPES.JEANS,
  'denim jeans': PRODUCT_TYPES.JEANS,
  
  'jackets': PRODUCT_TYPES.JACKETS,
  'jacket': PRODUCT_TYPES.JACKETS,
  
  'shirts': PRODUCT_TYPES.SHIRTS,
  'shirt': PRODUCT_TYPES.SHIRTS,
  'tops': PRODUCT_TYPES.SHIRTS,
  
  'dresses': PRODUCT_TYPES.DRESSES,
  'dress': PRODUCT_TYPES.DRESSES,
  
  'skirts': PRODUCT_TYPES.SKIRTS,
  'skirt': PRODUCT_TYPES.SKIRTS,
  
  'shorts': PRODUCT_TYPES.SHORTS,
  'short': PRODUCT_TYPES.SHORTS,
  
  'accessories': PRODUCT_TYPES.ACCESSORIES,
  'accessory': PRODUCT_TYPES.ACCESSORIES
};

// ============================================================================
// WORKFLOW STAGE MAPPINGS
// ============================================================================

export const NL_TO_WORKFLOW_STAGE: Record<string, string> = {
  'receiving': WORKFLOW_STAGES.RECEIVING,
  'receive': WORKFLOW_STAGES.RECEIVING,
  'receipt': WORKFLOW_STAGES.RECEIVING,
  
  'cutting': WORKFLOW_STAGES.CUTTING,
  'cut': WORKFLOW_STAGES.CUTTING,
  'fabric prep': WORKFLOW_STAGES.CUTTING,
  'fabric preparation': WORKFLOW_STAGES.CUTTING,
  
  'sewing': WORKFLOW_STAGES.SEWING,
  'sew': WORKFLOW_STAGES.SEWING,
  'stitching': WORKFLOW_STAGES.SEWING,
  'stitch': WORKFLOW_STAGES.SEWING,
  
  'washing': WORKFLOW_STAGES.WASHING,
  'wash': WORKFLOW_STAGES.WASHING,
  'laundry': WORKFLOW_STAGES.WASHING,
  
  'finishing': WORKFLOW_STAGES.FINISHING,
  'finish': WORKFLOW_STAGES.FINISHING,
  'ironing': WORKFLOW_STAGES.FINISHING,
  'tagging': WORKFLOW_STAGES.FINISHING,
  
  'packing': WORKFLOW_STAGES.PACKING,
  'pack': WORKFLOW_STAGES.PACKING,
  'packaging': WORKFLOW_STAGES.PACKING,
  'boxing': WORKFLOW_STAGES.PACKING,
  
  'qa': WORKFLOW_STAGES.QA,
  'quality': WORKFLOW_STAGES.QA,
  'quality control': WORKFLOW_STAGES.QA,
  'quality check': WORKFLOW_STAGES.QA,
  'qc': WORKFLOW_STAGES.QA,
  
  'inspection': WORKFLOW_STAGES.INSPECTION,
  'inspect': WORKFLOW_STAGES.INSPECTION,
  'quality inspection': WORKFLOW_STAGES.INSPECTION,
  
  'shipping': WORKFLOW_STAGES.SHIPPING,
  'ship': WORKFLOW_STAGES.SHIPPING,
  'dispatch': WORKFLOW_STAGES.SHIPPING,
  
  'testing': WORKFLOW_STAGES.TESTING,
  'test': WORKFLOW_STAGES.TESTING,
  
  'assembly': WORKFLOW_STAGES.ASSEMBLY,
  'assemble': WORKFLOW_STAGES.ASSEMBLY,
  
  'embroidery': WORKFLOW_STAGES.EMBROIDERY,
  'embroidery work': WORKFLOW_STAGES.EMBROIDERY,
  
  'printing': WORKFLOW_STAGES.PRINTING,
  'print': WORKFLOW_STAGES.PRINTING
};

// ============================================================================
// DEPARTMENT MAPPINGS
// ============================================================================

export const NL_TO_DEPARTMENT: Record<string, string> = {
  'cutting': DEPARTMENTS.CUTTING,
  'cutting department': DEPARTMENTS.CUTTING,
  
  'sewing': DEPARTMENTS.SEWING,
  'sewing department': DEPARTMENTS.SEWING,
  
  'washing': DEPARTMENTS.WASHING,
  'wash department': DEPARTMENTS.WASHING,
  
  'finishing': DEPARTMENTS.FINISHING,
  'finishing department': DEPARTMENTS.FINISHING,
  
  'qc': DEPARTMENTS.QC,
  'quality': DEPARTMENTS.QC,
  'quality control': DEPARTMENTS.QC,
  'quality department': DEPARTMENTS.QC,
  
  'packing': DEPARTMENTS.PACKING,
  'packing department': DEPARTMENTS.PACKING,
  
  'maintenance': DEPARTMENTS.MAINTENANCE,
  'maintenance department': DEPARTMENTS.MAINTENANCE,
  
  'admin': DEPARTMENTS.ADMIN,
  'administration': DEPARTMENTS.ADMIN,
  'administrative': DEPARTMENTS.ADMIN,
  
  'logistics': DEPARTMENTS.LOGISTICS,
  'logistics department': DEPARTMENTS.LOGISTICS,
  
  'management': DEPARTMENTS.MANAGEMENT,
  'managers': DEPARTMENTS.MANAGEMENT,
  
  'operations': DEPARTMENTS.OPERATIONS,
  'production': DEPARTMENTS.OPERATIONS,
  'production department': DEPARTMENTS.OPERATIONS,
  
  'warehouse': DEPARTMENTS.WAREHOUSE,
  'warehouse department': DEPARTMENTS.WAREHOUSE,
  
  'shipping': DEPARTMENTS.SHIPPING,
  'shipping department': DEPARTMENTS.SHIPPING,
  
  'receiving': DEPARTMENTS.RECEIVING,
  'receiving department': DEPARTMENTS.RECEIVING,
  
  'design': DEPARTMENTS.DESIGN,
  'design department': DEPARTMENTS.DESIGN,
  
  'sales': DEPARTMENTS.SALES,
  'sales department': DEPARTMENTS.SALES,
  
  'customer service': DEPARTMENTS.CUSTOMER_SERVICE,
  'customer support': DEPARTMENTS.CUSTOMER_SERVICE,
  
  'engineering': DEPARTMENTS.ENGINEERING,
  'engineering department': DEPARTMENTS.ENGINEERING
};

// ============================================================================
// PLANNING METHOD MAPPINGS
// ============================================================================

export const NL_TO_PLANNING_METHOD: Record<string, string> = {
  'manual board': PLANNING_METHODS.MANUAL_BOARD,
  'whiteboard': PLANNING_METHODS.MANUAL_BOARD,
  'notes on wall': PLANNING_METHODS.MANUAL_BOARD,
  'manual': PLANNING_METHODS.MANUAL_BOARD,
  'kanban board': PLANNING_METHODS.MANUAL_BOARD,
  'board': PLANNING_METHODS.MANUAL_BOARD,
  
  'spreadsheet': PLANNING_METHODS.SPREADSHEET,
  'excel': PLANNING_METHODS.SPREADSHEET,
  'google sheets': PLANNING_METHODS.SPREADSHEET,
  'sheets': PLANNING_METHODS.SPREADSHEET,
  
  'erp': PLANNING_METHODS.ERP,
  'sap': PLANNING_METHODS.ERP,
  'netsuite': PLANNING_METHODS.ERP,
  'system': PLANNING_METHODS.ERP,
  'software': PLANNING_METHODS.ERP,
  
  'verbal': PLANNING_METHODS.VERBAL,
  'verbally': PLANNING_METHODS.VERBAL,
  'talk': PLANNING_METHODS.VERBAL,
  'memory': PLANNING_METHODS.VERBAL,
  'in person': PLANNING_METHODS.VERBAL
};

export const NL_TO_DAILY_PLANNING_STYLE: Record<string, string> = {
  'by order': DAILY_PLANNING_STYLES.BY_ORDER,
  'order-based': DAILY_PLANNING_STYLES.BY_ORDER,
  'per order': DAILY_PLANNING_STYLES.BY_ORDER,
  'order by order': DAILY_PLANNING_STYLES.BY_ORDER,
  
  'by batch': DAILY_PLANNING_STYLES.BY_BATCH,
  'grouped by product': DAILY_PLANNING_STYLES.BY_BATCH,
  'batch': DAILY_PLANNING_STYLES.BY_BATCH,
  'batches': DAILY_PLANNING_STYLES.BY_BATCH,
  
  'by capacity': DAILY_PLANNING_STYLES.BY_CAPACITY,
  'capacity slots': DAILY_PLANNING_STYLES.BY_CAPACITY,
  'machine hours': DAILY_PLANNING_STYLES.BY_CAPACITY,
  'takt time': DAILY_PLANNING_STYLES.BY_CAPACITY,
  'capacity': DAILY_PLANNING_STYLES.BY_CAPACITY,
  
  'mixed': DAILY_PLANNING_STYLES.MIXED,
  'both': DAILY_PLANNING_STYLES.MIXED,
  'combination': DAILY_PLANNING_STYLES.MIXED
};

// ============================================================================
// DATA TRACKING MAPPINGS
// ============================================================================

export const NL_TO_DATA_TRACKING_METHOD: Record<string, string> = {
  'paper': DATA_TRACKING_METHODS.PAPER,
  'manual logs': DATA_TRACKING_METHODS.PAPER,
  'clipboards': DATA_TRACKING_METHODS.PAPER,
  'handwritten': DATA_TRACKING_METHODS.PAPER,
  
  'spreadsheet': DATA_TRACKING_METHODS.SPREADSHEET,
  'excel': DATA_TRACKING_METHODS.SPREADSHEET,
  'sheet': DATA_TRACKING_METHODS.SPREADSHEET,
  'google sheets': DATA_TRACKING_METHODS.SPREADSHEET,
  
  'software': DATA_TRACKING_METHODS.SOFTWARE,
  'erp': DATA_TRACKING_METHODS.SOFTWARE,
  'system': DATA_TRACKING_METHODS.SOFTWARE,
  'application': DATA_TRACKING_METHODS.SOFTWARE,
  
  'verbal': DATA_TRACKING_METHODS.VERBAL,
  'memory': DATA_TRACKING_METHODS.VERBAL,
  'talk': DATA_TRACKING_METHODS.VERBAL
};

export const NL_TO_DATA_ENTRY_FREQUENCY: Record<string, string> = {
  'real time': DATA_ENTRY_FREQUENCIES.REAL_TIME,
  'realtime': DATA_ENTRY_FREQUENCIES.REAL_TIME,
  'live': DATA_ENTRY_FREQUENCIES.REAL_TIME,
  'as it happens': DATA_ENTRY_FREQUENCIES.REAL_TIME,
  
  'daily': DATA_ENTRY_FREQUENCIES.DAILY,
  'each day': DATA_ENTRY_FREQUENCIES.DAILY,
  'day': DATA_ENTRY_FREQUENCIES.DAILY,
  
  'weekly': DATA_ENTRY_FREQUENCIES.WEEKLY,
  'each week': DATA_ENTRY_FREQUENCIES.WEEKLY,
  'week': DATA_ENTRY_FREQUENCIES.WEEKLY,
  
  'after completion': DATA_ENTRY_FREQUENCIES.AFTER_COMPLETION,
  'when done': DATA_ENTRY_FREQUENCIES.AFTER_COMPLETION,
  'after finished': DATA_ENTRY_FREQUENCIES.AFTER_COMPLETION,
  
  'never': DATA_ENTRY_FREQUENCIES.NEVER,
  'don\'t track': DATA_ENTRY_FREQUENCIES.NEVER,
  'not tracked': DATA_ENTRY_FREQUENCIES.NEVER
};

// ============================================================================
// STORAGE & INVENTORY MAPPINGS
// ============================================================================

export const NL_TO_STORAGE_SYSTEM: Record<string, string> = {
  'defined bins': STORAGE_SYSTEMS.DEFINED_BINS,
  'bins': STORAGE_SYSTEMS.DEFINED_BINS,
  'labeled bins': STORAGE_SYSTEMS.DEFINED_BINS,
  
  'racks': STORAGE_SYSTEMS.RACKS,
  'rack': STORAGE_SYSTEMS.RACKS,
  'shelving': STORAGE_SYSTEMS.RACKS,
  
  'carts': STORAGE_SYSTEMS.CARTS,
  'cart': STORAGE_SYSTEMS.CARTS,
  'trolley': STORAGE_SYSTEMS.CARTS,
  'trolleys': STORAGE_SYSTEMS.CARTS,
  
  'mixed': STORAGE_SYSTEMS.MIXED,
  'both': STORAGE_SYSTEMS.MIXED,
  'combination': STORAGE_SYSTEMS.MIXED
};

export const NL_TO_QR_BARCODE_USE: Record<string, string> = {
  'none': QR_BARCODE_USE.NONE,
  'don\'t use': QR_BARCODE_USE.NONE,
  'no': QR_BARCODE_USE.NONE,
  'not using': QR_BARCODE_USE.NONE,
  
  'barcode': QR_BARCODE_USE.BARCODES,
  'barcodes': QR_BARCODE_USE.BARCODES,
  'upc': QR_BARCODE_USE.BARCODES,
  'ean': QR_BARCODE_USE.BARCODES,
  
  'qr code': QR_BARCODE_USE.QR_CODES,
  'qr codes': QR_BARCODE_USE.QR_CODES,
  'qr labels': QR_BARCODE_USE.QR_CODES,
  'qr': QR_BARCODE_USE.QR_CODES,
  
  'both': QR_BARCODE_USE.BOTH,
  'barcode and qr': QR_BARCODE_USE.BOTH
};

// ============================================================================
// CHALLENGE & GOAL MAPPINGS
// ============================================================================

export const NL_TO_CHALLENGE_CATEGORY: Record<string, string> = {
  'production flow': CHALLENGE_CATEGORIES.PRODUCTION_FLOW,
  'bottlenecks': CHALLENGE_CATEGORIES.PRODUCTION_FLOW,
  'wip stuck': CHALLENGE_CATEGORIES.PRODUCTION_FLOW,
  'routing': CHALLENGE_CATEGORIES.PRODUCTION_FLOW,
  'flow': CHALLENGE_CATEGORIES.PRODUCTION_FLOW,
  
  'data visibility': CHALLENGE_CATEGORIES.DATA_VISIBILITY,
  'visibility': CHALLENGE_CATEGORIES.DATA_VISIBILITY,
  'reporting': CHALLENGE_CATEGORIES.DATA_VISIBILITY,
  'tracking': CHALLENGE_CATEGORIES.DATA_VISIBILITY,
  'information': CHALLENGE_CATEGORIES.DATA_VISIBILITY,
  
  'communication': CHALLENGE_CATEGORIES.COMMUNICATION,
  'handoffs': CHALLENGE_CATEGORIES.COMMUNICATION,
  'updates': CHALLENGE_CATEGORIES.COMMUNICATION,
  'coordination': CHALLENGE_CATEGORIES.COMMUNICATION,
  
  'quality': CHALLENGE_CATEGORIES.QUALITY,
  'defects': CHALLENGE_CATEGORIES.QUALITY,
  'returns': CHALLENGE_CATEGORIES.QUALITY,
  'quality control': CHALLENGE_CATEGORIES.QUALITY,
  
  'lead time': CHALLENGE_CATEGORIES.LEAD_TIME,
  'speed': CHALLENGE_CATEGORIES.LEAD_TIME,
  'delivery time': CHALLENGE_CATEGORIES.LEAD_TIME,
  
  'costs': CHALLENGE_CATEGORIES.COSTS,
  'margins': CHALLENGE_CATEGORIES.COSTS,
  'cost': CHALLENGE_CATEGORIES.COSTS,
  'profit': CHALLENGE_CATEGORIES.COSTS
};

export const NL_TO_GOAL_CATEGORY: Record<string, string> = {
  'maintain': GOAL_CATEGORIES.MAINTAIN,
  'steady': GOAL_CATEGORIES.MAINTAIN,
  'same clients': GOAL_CATEGORIES.MAINTAIN,
  'keep current': GOAL_CATEGORIES.MAINTAIN,
  
  'grow': GOAL_CATEGORIES.EXPAND,
  'expand': GOAL_CATEGORIES.EXPAND,
  'more capacity': GOAL_CATEGORIES.EXPAND,
  'growth': GOAL_CATEGORIES.EXPAND,
  
  'double': GOAL_CATEGORIES.AGGRESSIVE_EXPAND,
  'new markets': GOAL_CATEGORIES.AGGRESSIVE_EXPAND,
  'aggressive': GOAL_CATEGORIES.AGGRESSIVE_EXPAND,
  'aggressive expansion': GOAL_CATEGORIES.AGGRESSIVE_EXPAND,
  
  'efficiency': GOAL_CATEGORIES.EFFICIENCY,
  'reduce waste': GOAL_CATEGORIES.EFFICIENCY,
  'lean': GOAL_CATEGORIES.EFFICIENCY,
  'optimize': GOAL_CATEGORIES.EFFICIENCY,
  
  'profit': GOAL_CATEGORIES.PROFITABILITY,
  'margin': GOAL_CATEGORIES.PROFITABILITY,
  'finance': GOAL_CATEGORIES.PROFITABILITY,
  'profitability': GOAL_CATEGORIES.PROFITABILITY,
  
  'quality': GOAL_CATEGORIES.QUALITY,
  'craftsmanship': GOAL_CATEGORIES.QUALITY,
  'improve quality': GOAL_CATEGORIES.QUALITY
};

export const NL_TO_BOTTLENECK_TYPE: Record<string, string> = {
  'people': BOTTLENECK_TYPES.PEOPLE,
  'operators': BOTTLENECK_TYPES.PEOPLE,
  'staff': BOTTLENECK_TYPES.PEOPLE,
  'training': BOTTLENECK_TYPES.PEOPLE,
  'team': BOTTLENECK_TYPES.PEOPLE,
  'workers': BOTTLENECK_TYPES.PEOPLE,
  
  'machines': BOTTLENECK_TYPES.MACHINES,
  'equipment': BOTTLENECK_TYPES.MACHINES,
  'breakdown': BOTTLENECK_TYPES.MACHINES,
  'machine': BOTTLENECK_TYPES.MACHINES,
  
  'data': BOTTLENECK_TYPES.DATA,
  'information': BOTTLENECK_TYPES.DATA,
  'tracking': BOTTLENECK_TYPES.DATA,
  'visibility': BOTTLENECK_TYPES.DATA
};

// ============================================================================
// COMPLIANCE MAPPINGS
// ============================================================================

export const NL_TO_COMPLIANCE_TYPE: Record<string, string> = {
  'bsci': COMPLIANCE_TYPES.BSCI,
  'wrap': COMPLIANCE_TYPES.WRAP,
  'iso9001': COMPLIANCE_TYPES.ISO9001,
  'iso 9001': COMPLIANCE_TYPES.ISO9001,
  'iso14001': COMPLIANCE_TYPES.ISO14001,
  'iso 14001': COMPLIANCE_TYPES.ISO14001,
  'sedex': COMPLIANCE_TYPES.SEDEX,
  'gots': COMPLIANCE_TYPES.GOTS
};

// ============================================================================
// TEAMS & COMMUNICATION MAPPINGS
// ============================================================================

export const NL_TO_SHIFT_STRUCTURE: Record<string, string> = {
  'single shift': SHIFT_STRUCTURES.SINGLE_SHIFT,
  'one shift': SHIFT_STRUCTURES.SINGLE_SHIFT,
  'day only': SHIFT_STRUCTURES.SINGLE_SHIFT,
  'single': SHIFT_STRUCTURES.SINGLE_SHIFT,
  
  'two shifts': SHIFT_STRUCTURES.TWO_SHIFTS,
  'two': SHIFT_STRUCTURES.TWO_SHIFTS,
  'morning/evening': SHIFT_STRUCTURES.TWO_SHIFTS,
  'day and night': SHIFT_STRUCTURES.TWO_SHIFTS,
  
  'three shifts': SHIFT_STRUCTURES.THREE_SHIFTS,
  'three': SHIFT_STRUCTURES.THREE_SHIFTS,
  '24-hour': SHIFT_STRUCTURES.THREE_SHIFTS,
  '24/7': SHIFT_STRUCTURES.THREE_SHIFTS,
  
  'variable': SHIFT_STRUCTURES.VARIABLE,
  'rotating': SHIFT_STRUCTURES.VARIABLE
};

export const NL_TO_COMMUNICATION_METHOD: Record<string, string> = {
  'verbal': COMMUNICATION_METHODS.VERBAL,
  'talk': COMMUNICATION_METHODS.VERBAL,
  'in person': COMMUNICATION_METHODS.VERBAL,
  'face to face': COMMUNICATION_METHODS.VERBAL,
  
  'whatsapp': COMMUNICATION_METHODS.WHATSAPP,
  'telegram': COMMUNICATION_METHODS.WHATSAPP,
  'signal': COMMUNICATION_METHODS.WHATSAPP,
  'messaging': COMMUNICATION_METHODS.WHATSAPP,
  
  'paper': COMMUNICATION_METHODS.PAPER,
  'clipboard': COMMUNICATION_METHODS.PAPER,
  'forms': COMMUNICATION_METHODS.PAPER,
  
  'walkie talkie': COMMUNICATION_METHODS.WALKIE_TALKIE,
  'walkie': COMMUNICATION_METHODS.WALKIE_TALKIE,
  'radio': COMMUNICATION_METHODS.WALKIE_TALKIE,
  
  'software': COMMUNICATION_METHODS.SOFTWARE,
  'erp chat': COMMUNICATION_METHODS.SOFTWARE,
  'slack': COMMUNICATION_METHODS.SOFTWARE,
  'system': COMMUNICATION_METHODS.SOFTWARE,
  
  'mixed': COMMUNICATION_METHODS.MIXED,
  'both': COMMUNICATION_METHODS.MIXED,
  'combination': COMMUNICATION_METHODS.MIXED
};

export const NL_TO_COMMUNICATION_TOOL: Record<string, string> = {
  'whatsapp': COMMUNICATION_TOOLS.WHATSAPP,
  'telegram': COMMUNICATION_TOOLS.WHATSAPP,
  'wechat': COMMUNICATION_TOOLS.WHATSAPP,
  
  'email': COMMUNICATION_TOOLS.EMAIL,
  'gmail': COMMUNICATION_TOOLS.EMAIL,
  'outlook': COMMUNICATION_TOOLS.EMAIL,
  
  'slack': COMMUNICATION_TOOLS.SLACK,
  
  'teams': COMMUNICATION_TOOLS.TEAMS,
  'microsoft teams': COMMUNICATION_TOOLS.TEAMS,
  
  'verbal': COMMUNICATION_TOOLS.VERBAL,
  'talk': COMMUNICATION_TOOLS.VERBAL,
  'meetings': COMMUNICATION_TOOLS.VERBAL,
  
  'erp chat': COMMUNICATION_TOOLS.ERP_CHAT,
  'internal system': COMMUNICATION_TOOLS.ERP_CHAT
};

export const NL_TO_MEETING_FREQUENCY: Record<string, string> = {
  'daily': MEETING_FREQUENCIES.DAILY,
  'each day': MEETING_FREQUENCIES.DAILY,
  
  'weekly': MEETING_FREQUENCIES.WEEKLY,
  'each week': MEETING_FREQUENCIES.WEEKLY,
  
  'bi-weekly': MEETING_FREQUENCIES.BI_WEEKLY,
  'biweekly': MEETING_FREQUENCIES.BI_WEEKLY,
  'every two weeks': MEETING_FREQUENCIES.BI_WEEKLY,
  
  'monthly': MEETING_FREQUENCIES.MONTHLY,
  'each month': MEETING_FREQUENCIES.MONTHLY,
  
  'ad hoc': MEETING_FREQUENCIES.AD_HOC,
  'adhoc': MEETING_FREQUENCIES.AD_HOC,
  'as needed': MEETING_FREQUENCIES.AD_HOC,
  'when needed': MEETING_FREQUENCIES.AD_HOC
};

export const NL_TO_TRAINING_METHOD: Record<string, string> = {
  'shadowing': TRAINING_METHODS.SHADOWING,
  'shadow': TRAINING_METHODS.SHADOWING,
  'follow': TRAINING_METHODS.SHADOWING,
  
  'formal sessions': TRAINING_METHODS.FORMAL_SESSIONS,
  'formal': TRAINING_METHODS.FORMAL_SESSIONS,
  'classroom': TRAINING_METHODS.FORMAL_SESSIONS,
  
  'video guides': TRAINING_METHODS.VIDEO_GUIDES,
  'videos': TRAINING_METHODS.VIDEO_GUIDES,
  'video': TRAINING_METHODS.VIDEO_GUIDES,
  
  'mixed': TRAINING_METHODS.MIXED,
  'both': TRAINING_METHODS.MIXED,
  'combination': TRAINING_METHODS.MIXED
};

export const NL_TO_CROSS_TRAINING_LEVEL: Record<string, string> = {
  'low': CROSS_TRAINING_LEVELS.LOW,
  'only in one area': CROSS_TRAINING_LEVELS.LOW,
  'single area': CROSS_TRAINING_LEVELS.LOW,
  
  'medium': CROSS_TRAINING_LEVELS.MEDIUM,
  'some overlap': CROSS_TRAINING_LEVELS.MEDIUM,
  'a few people move around': CROSS_TRAINING_LEVELS.MEDIUM,
  
  'high': CROSS_TRAINING_LEVELS.HIGH,
  'most can do multiple jobs': CROSS_TRAINING_LEVELS.HIGH,
  'cross trained': CROSS_TRAINING_LEVELS.HIGH
};

export const NL_TO_ISSUE_OWNERSHIP_STYLE: Record<string, string> = {
  'supervisor': ISSUE_OWNERSHIP_STYLES.SUPERVISOR,
  'supervisor handles': ISSUE_OWNERSHIP_STYLES.SUPERVISOR,
  'line lead': ISSUE_OWNERSHIP_STYLES.SUPERVISOR,
  
  'manager': ISSUE_OWNERSHIP_STYLES.MANAGER,
  'production head': ISSUE_OWNERSHIP_STYLES.MANAGER,
  'management': ISSUE_OWNERSHIP_STYLES.MANAGER,
  
  'qc': ISSUE_OWNERSHIP_STYLES.QC,
  'qc team': ISSUE_OWNERSHIP_STYLES.QC,
  'inspection': ISSUE_OWNERSHIP_STYLES.QC,
  
  'team lead': ISSUE_OWNERSHIP_STYLES.TEAM_LEAD,
  'operator in charge': ISSUE_OWNERSHIP_STYLES.TEAM_LEAD,
  
  'mixed': ISSUE_OWNERSHIP_STYLES.MIXED,
  'depends': ISSUE_OWNERSHIP_STYLES.MIXED,
  'varies': ISSUE_OWNERSHIP_STYLES.MIXED
};

export const NL_TO_PERFORMANCE_TRACKING: Record<string, string> = {
  'individual': PERFORMANCE_TRACKING.INDIVIDUAL,
  'per person': PERFORMANCE_TRACKING.INDIVIDUAL,
  'by person': PERFORMANCE_TRACKING.INDIVIDUAL,
  
  'team': PERFORMANCE_TRACKING.TEAM,
  'by team': PERFORMANCE_TRACKING.TEAM,
  'team level': PERFORMANCE_TRACKING.TEAM,
  
  'both': PERFORMANCE_TRACKING.BOTH,
  'individual and team': PERFORMANCE_TRACKING.BOTH,
  
  'none': PERFORMANCE_TRACKING.NONE,
  'don\'t track': PERFORMANCE_TRACKING.NONE,
  'not tracked': PERFORMANCE_TRACKING.NONE
};

export const NL_TO_PERFORMANCE_METRIC: Record<string, string> = {
  'output': PERFORMANCE_METRICS.OUTPUT,
  'production': PERFORMANCE_METRICS.OUTPUT,
  'quantity': PERFORMANCE_METRICS.OUTPUT,
  
  'quality': PERFORMANCE_METRICS.QUALITY,
  'defects': PERFORMANCE_METRICS.QUALITY,
  
  'attendance': PERFORMANCE_METRICS.ATTENDANCE,
  'punctuality': PERFORMANCE_METRICS.ATTENDANCE,
  
  'efficiency': PERFORMANCE_METRICS.EFFICIENCY,
  'speed': PERFORMANCE_METRICS.EFFICIENCY
};

export const NL_TO_HIRING_METHOD: Record<string, string> = {
  'referral': HIRING_METHODS.REFERRAL,
  'referrals': HIRING_METHODS.REFERRAL,
  'word of mouth': HIRING_METHODS.REFERRAL,
  
  'agency': HIRING_METHODS.AGENCY,
  'recruitment agency': HIRING_METHODS.AGENCY,
  'staffing': HIRING_METHODS.AGENCY,
  
  'direct hire': HIRING_METHODS.DIRECT_HIRE,
  'direct': HIRING_METHODS.DIRECT_HIRE,
  'hire directly': HIRING_METHODS.DIRECT_HIRE,
  
  'mixed': HIRING_METHODS.MIXED,
  'both': HIRING_METHODS.MIXED,
  'combination': HIRING_METHODS.MIXED
};

// ============================================================================
// INTEGRATION & SYSTEM MAPPINGS
// ============================================================================

export const NL_TO_PRODUCTION_SYSTEM: Record<string, string> = {
  'paper': PRODUCTION_SYSTEMS.PAPER,
  'handwritten': PRODUCTION_SYSTEMS.PAPER,
  'manual logs': PRODUCTION_SYSTEMS.PAPER,
  'clipboards': PRODUCTION_SYSTEMS.PAPER,
  
  'spreadsheet': PRODUCTION_SYSTEMS.SPREADSHEET,
  'excel': PRODUCTION_SYSTEMS.SPREADSHEET,
  'google sheets': PRODUCTION_SYSTEMS.SPREADSHEET,
  
  'erp': PRODUCTION_SYSTEMS.ERP,
  'netsuite': PRODUCTION_SYSTEMS.ERP,
  'sap': PRODUCTION_SYSTEMS.ERP,
  'zoho': PRODUCTION_SYSTEMS.ERP,
  
  'custom software': PRODUCTION_SYSTEMS.CUSTOM_SOFTWARE,
  'our own software': PRODUCTION_SYSTEMS.CUSTOM_SOFTWARE,
  'custom tool': PRODUCTION_SYSTEMS.CUSTOM_SOFTWARE
};

export const NL_TO_INVENTORY_SYSTEM: Record<string, string> = {
  'none': INVENTORY_SYSTEMS.NONE,
  'don\'t track': INVENTORY_SYSTEMS.NONE,
  
  'paper': INVENTORY_SYSTEMS.PAPER,
  'manual': INVENTORY_SYSTEMS.PAPER,
  
  'spreadsheet': INVENTORY_SYSTEMS.SPREADSHEET,
  'excel': INVENTORY_SYSTEMS.SPREADSHEET,
  
  'erp': INVENTORY_SYSTEMS.ERP,
  'wms': INVENTORY_SYSTEMS.WMS,
  'warehouse management': INVENTORY_SYSTEMS.WMS
};

export const NL_TO_ORDER_SYSTEM: Record<string, string> = {
  'paper': ORDER_SYSTEMS.PAPER,
  'spreadsheet': ORDER_SYSTEMS.SPREADSHEET,
  'excel': ORDER_SYSTEMS.SPREADSHEET,
  'erp': ORDER_SYSTEMS.ERP,
  'ecommerce': ORDER_SYSTEMS.ECOMMERCE,
  'e-commerce': ORDER_SYSTEMS.ECOMMERCE,
  'email': ORDER_SYSTEMS.EMAIL
};

export const NL_TO_ORDER_PLATFORM: Record<string, string> = {
  'shopify': ORDER_PLATFORMS.SHOPIFY,
  'woocommerce': ORDER_PLATFORMS.WOOCOMMERCE,
  'custom': ORDER_PLATFORMS.CUSTOM,
  'our own': ORDER_PLATFORMS.CUSTOM
};

export const NL_TO_ACCOUNTING_SYSTEM: Record<string, string> = {
  'none': ACCOUNTING_SYSTEMS.NONE,
  'manual': ACCOUNTING_SYSTEMS.MANUAL,
  'excel': ACCOUNTING_SYSTEMS.EXCEL,
  'quickbooks': ACCOUNTING_SYSTEMS.QUICKBOOKS,
  'xero': ACCOUNTING_SYSTEMS.XERO,
  'erp': ACCOUNTING_SYSTEMS.ERP
};

export const NL_TO_FILE_STORAGE_SYSTEM: Record<string, string> = {
  'local computer': FILE_STORAGE_SYSTEMS.LOCAL_COMPUTER,
  'computer': FILE_STORAGE_SYSTEMS.LOCAL_COMPUTER,
  'local': FILE_STORAGE_SYSTEMS.LOCAL_COMPUTER,
  'desktop': FILE_STORAGE_SYSTEMS.LOCAL_COMPUTER,
  
  'google drive': FILE_STORAGE_SYSTEMS.GOOGLE_DRIVE,
  'gdrive': FILE_STORAGE_SYSTEMS.GOOGLE_DRIVE,
  
  'dropbox': FILE_STORAGE_SYSTEMS.DROPBOX,
  
  'onedrive': FILE_STORAGE_SYSTEMS.ONEDRIVE,
  'sharepoint': FILE_STORAGE_SYSTEMS.ONEDRIVE,
  
  'erp': FILE_STORAGE_SYSTEMS.ERP,
  
  'paper': FILE_STORAGE_SYSTEMS.PAPER,
  'files cabinet': FILE_STORAGE_SYSTEMS.PAPER
};

export const NL_TO_REPORTING_METHOD: Record<string, string> = {
  'paper reports': REPORTING_METHODS.PAPER_REPORTS,
  'paper': REPORTING_METHODS.PAPER_REPORTS,
  
  'excel dashboards': REPORTING_METHODS.EXCEL_DASHBOARDS,
  'excel': REPORTING_METHODS.EXCEL_DASHBOARDS,
  'spreadsheet': REPORTING_METHODS.EXCEL_DASHBOARDS,
  
  'erp': REPORTING_METHODS.ERP,
  
  'none': REPORTING_METHODS.NONE,
  'don\'t report': REPORTING_METHODS.NONE
};

export const NL_TO_REPORTING_FREQUENCY: Record<string, string> = {
  'daily': REPORTING_FREQUENCIES.DAILY,
  'each day': REPORTING_FREQUENCIES.DAILY,
  
  'weekly': REPORTING_FREQUENCIES.WEEKLY,
  'each week': REPORTING_FREQUENCIES.WEEKLY,
  
  'monthly': REPORTING_FREQUENCIES.MONTHLY,
  'each month': REPORTING_FREQUENCIES.MONTHLY,
  
  'rarely': REPORTING_FREQUENCIES.RARELY,
  'seldom': REPORTING_FREQUENCIES.RARELY,
  'not often': REPORTING_FREQUENCIES.RARELY
};

export const NL_TO_DATA_SHARING_FORMAT: Record<string, string> = {
  'email': DATA_SHARING_FORMATS.EMAIL,
  'pdf': DATA_SHARING_FORMATS.PDF,
  'spreadsheet': DATA_SHARING_FORMATS.SPREADSHEET,
  'portal': DATA_SHARING_FORMATS.PORTAL,
  'verbal': DATA_SHARING_FORMATS.VERBAL
};

export const NL_TO_DATA_BACKUP_METHOD: Record<string, string> = {
  'none': DATA_BACKUP_METHODS.NONE,
  'manual copies': DATA_BACKUP_METHODS.MANUAL_COPIES,
  'cloud auto': DATA_BACKUP_METHODS.CLOUD_AUTO,
  'cloud': DATA_BACKUP_METHODS.CLOUD_AUTO,
  'it managed': DATA_BACKUP_METHODS.IT_MANAGED,
  'it': DATA_BACKUP_METHODS.IT_MANAGED
};

export const NL_TO_DATA_BACKUP_FREQUENCY: Record<string, string> = {
  'daily': DATA_BACKUP_FREQUENCIES.DAILY,
  'weekly': DATA_BACKUP_FREQUENCIES.WEEKLY,
  'monthly': DATA_BACKUP_FREQUENCIES.MONTHLY,
  'rarely': DATA_BACKUP_FREQUENCIES.RARELY
};

// ============================================================================
// SITES & FACILITIES MAPPINGS
// ============================================================================

export const NL_TO_ZONE_TAG: Record<string, string> = {
  'cutting': ZONE_TAGS.CUTTING,
  'fabric prep': ZONE_TAGS.CUTTING,
  
  'sewing': ZONE_TAGS.SEWING,
  'stitching': ZONE_TAGS.SEWING,
  
  'wash': ZONE_TAGS.WASHING,
  'washing': ZONE_TAGS.WASHING,
  'laundry': ZONE_TAGS.WASHING,
  
  'finish': ZONE_TAGS.FINISHING,
  'finishing': ZONE_TAGS.FINISHING,
  'ironing': ZONE_TAGS.FINISHING,
  'tagging': ZONE_TAGS.FINISHING,
  
  'qc': ZONE_TAGS.QC,
  'quality check': ZONE_TAGS.QC,
  'inspection': ZONE_TAGS.QC,
  
  'storage': ZONE_TAGS.STORAGE,
  'inventory': ZONE_TAGS.STORAGE,
  'rack room': ZONE_TAGS.STORAGE,
  
  'office': ZONE_TAGS.OFFICE,
  'admin': ZONE_TAGS.OFFICE,
  
  'packing': ZONE_TAGS.PACKING,
  'boxing': ZONE_TAGS.PACKING,
  
  'loading': ZONE_TAGS.LOADING,
  'shipping': ZONE_TAGS.LOADING
};

export const NL_TO_MACHINE_TYPE: Record<string, string> = {
  'sewing': MACHINE_TYPES.SEWING,
  'sewing machine': MACHINE_TYPES.SEWING,
  
  'cutting': MACHINE_TYPES.CUTTING,
  'cutting machine': MACHINE_TYPES.CUTTING,
  
  'washing': MACHINE_TYPES.WASHING,
  'washing machine': MACHINE_TYPES.WASHING,
  
  'ironing': MACHINE_TYPES.IRONING,
  'iron': MACHINE_TYPES.IRONING,
  
  'embroidery': MACHINE_TYPES.EMBROIDERY,
  'embroidery machine': MACHINE_TYPES.EMBROIDERY
};

export const NL_TO_STORAGE_TYPE: Record<string, string> = {
  'racks': STORAGE_TYPES.RACKS,
  'rack': STORAGE_TYPES.RACKS,
  'shelving': STORAGE_TYPES.RACKS,
  
  'bins': STORAGE_TYPES.BINS,
  'bin': STORAGE_TYPES.BINS,
  
  'hanging': STORAGE_TYPES.HANGING,
  'hangers': STORAGE_TYPES.HANGING,
  
  'mixed': STORAGE_TYPES.MIXED,
  'both': STORAGE_TYPES.MIXED
};

export const NL_TO_DISPATCH_AREA: Record<string, string> = {
  'ground floor': DISPATCH_AREAS.GROUND_FLOOR,
  'first floor': DISPATCH_AREAS.GROUND_FLOOR,
  
  'basement': DISPATCH_AREAS.BASEMENT,
  
  'loading dock': DISPATCH_AREAS.LOADING_DOCK,
  'dock': DISPATCH_AREAS.LOADING_DOCK,
  
  'shared warehouse': DISPATCH_AREAS.SHARED_WAREHOUSE,
  'warehouse': DISPATCH_AREAS.SHARED_WAREHOUSE
};

export const NL_TO_FLOW_TRANSPORT_METHOD: Record<string, string> = {
  'elevator': FLOW_TRANSPORT_METHODS.ELEVATOR,
  'lift': FLOW_TRANSPORT_METHODS.ELEVATOR,
  
  'stairs': FLOW_TRANSPORT_METHODS.STAIRS,
  'staircase': FLOW_TRANSPORT_METHODS.STAIRS,
  
  'cart': FLOW_TRANSPORT_METHODS.CARTS,
  'carts': FLOW_TRANSPORT_METHODS.CARTS,
  'trolley': FLOW_TRANSPORT_METHODS.CARTS,
  'push cart': FLOW_TRANSPORT_METHODS.CARTS,
  
  'carry': FLOW_TRANSPORT_METHODS.MANUAL_CARRY,
  'by hand': FLOW_TRANSPORT_METHODS.MANUAL_CARRY,
  'manual carry': FLOW_TRANSPORT_METHODS.MANUAL_CARRY
};

export const NL_TO_BOTTLENECK_CAUSE: Record<string, string> = {
  'space': BOTTLENECK_CAUSES.SPACE,
  'too crowded': BOTTLENECK_CAUSES.SPACE,
  'cramped': BOTTLENECK_CAUSES.SPACE,
  
  'layout': BOTTLENECK_CAUSES.LAYOUT,
  'distance': BOTTLENECK_CAUSES.LAYOUT,
  'pathway': BOTTLENECK_CAUSES.LAYOUT,
  
  'coordination': BOTTLENECK_CAUSES.COORDINATION,
  'timing': BOTTLENECK_CAUSES.COORDINATION,
  'handoffs': BOTTLENECK_CAUSES.COORDINATION
};

// ============================================================================
// WORKFLOW INPUT/OUTPUT/DEPENDENCY MAPPINGS
// ============================================================================

export const NL_TO_WORKFLOW_INPUT_TYPE: Record<string, string> = {
  'qr scan': WORKFLOW_INPUT_TYPES.QR_SCAN,
  'scan qr': WORKFLOW_INPUT_TYPES.QR_SCAN,
  'qr code': WORKFLOW_INPUT_TYPES.QR_SCAN,
  
  'form submission': WORKFLOW_INPUT_TYPES.FORM_SUBMISSION,
  'fill form': WORKFLOW_INPUT_TYPES.FORM_SUBMISSION,
  'form': WORKFLOW_INPUT_TYPES.FORM_SUBMISSION,
  
  'photo upload': WORKFLOW_INPUT_TYPES.PHOTO_UPLOAD,
  'take photo': WORKFLOW_INPUT_TYPES.PHOTO_UPLOAD,
  'photo': WORKFLOW_INPUT_TYPES.PHOTO_UPLOAD,
  
  'manual confirmation': WORKFLOW_INPUT_TYPES.MANUAL_CONFIRMATION,
  'confirm': WORKFLOW_INPUT_TYPES.MANUAL_CONFIRMATION,
  
  'barcode scan': WORKFLOW_INPUT_TYPES.BARCODE_SCAN,
  'scan barcode': WORKFLOW_INPUT_TYPES.BARCODE_SCAN,
  'barcode': WORKFLOW_INPUT_TYPES.BARCODE_SCAN,
  
  'signature': WORKFLOW_INPUT_TYPES.SIGNATURE,
  'sign': WORKFLOW_INPUT_TYPES.SIGNATURE,
  
  'measurement': WORKFLOW_INPUT_TYPES.MEASUREMENT,
  'measure': WORKFLOW_INPUT_TYPES.MEASUREMENT,
  
  'inspection': WORKFLOW_INPUT_TYPES.INSPECTION,
  'inspect': WORKFLOW_INPUT_TYPES.INSPECTION
};

export const NL_TO_WORKFLOW_OUTPUT_TYPE: Record<string, string> = {
  'task completion': WORKFLOW_OUTPUT_TYPES.TASK_COMPLETION,
  'complete task': WORKFLOW_OUTPUT_TYPES.TASK_COMPLETION,
  'done': WORKFLOW_OUTPUT_TYPES.TASK_COMPLETION,
  
  'form submission': WORKFLOW_OUTPUT_TYPES.FORM_SUBMISSION,
  'submit form': WORKFLOW_OUTPUT_TYPES.FORM_SUBMISSION,
  
  'photo upload': WORKFLOW_OUTPUT_TYPES.PHOTO_UPLOAD,
  'upload photo': WORKFLOW_OUTPUT_TYPES.PHOTO_UPLOAD,
  
  'quality check': WORKFLOW_OUTPUT_TYPES.QUALITY_CHECK,
  'qc': WORKFLOW_OUTPUT_TYPES.QUALITY_CHECK,
  
  'quantity confirmation': WORKFLOW_OUTPUT_TYPES.QUANTITY_CONFIRMATION,
  'count items': WORKFLOW_OUTPUT_TYPES.QUANTITY_CONFIRMATION,
  
  'approval': WORKFLOW_OUTPUT_TYPES.APPROVAL,
  'approve': WORKFLOW_OUTPUT_TYPES.APPROVAL,
  
  'signature': WORKFLOW_OUTPUT_TYPES.SIGNATURE,
  'sign off': WORKFLOW_OUTPUT_TYPES.SIGNATURE
};

export const NL_TO_WORKFLOW_DEPENDENCY_TYPE: Record<string, string> = {
  'task completion': WORKFLOW_DEPENDENCY_TYPES.TASK_COMPLETION,
  'wait for task': WORKFLOW_DEPENDENCY_TYPES.TASK_COMPLETION,
  
  'approval': WORKFLOW_DEPENDENCY_TYPES.APPROVAL,
  'manager approval': WORKFLOW_DEPENDENCY_TYPES.APPROVAL,
  'needs approval': WORKFLOW_DEPENDENCY_TYPES.APPROVAL,
  
  'time delay': WORKFLOW_DEPENDENCY_TYPES.TIME_DELAY,
  'wait': WORKFLOW_DEPENDENCY_TYPES.TIME_DELAY,
  'rest': WORKFLOW_DEPENDENCY_TYPES.TIME_DELAY,
  
  'capacity': WORKFLOW_DEPENDENCY_TYPES.CAPACITY,
  'team capacity': WORKFLOW_DEPENDENCY_TYPES.CAPACITY,
  
  'component completion': WORKFLOW_DEPENDENCY_TYPES.COMPONENT_COMPLETION,
  'all pieces': WORKFLOW_DEPENDENCY_TYPES.COMPONENT_COMPLETION,
  
  'quantity threshold': WORKFLOW_DEPENDENCY_TYPES.QUANTITY_THRESHOLD,
  'batch': WORKFLOW_DEPENDENCY_TYPES.QUANTITY_THRESHOLD,
  
  'material arrival': WORKFLOW_DEPENDENCY_TYPES.MATERIAL_ARRIVAL,
  'materials arrive': WORKFLOW_DEPENDENCY_TYPES.MATERIAL_ARRIVAL
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Normalize text for mapping lookup
 */
export function normalizeTextForMapping(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Find enum value from natural language text
 */
export function mapNaturalLanguageToEnum<T extends Record<string, string>>(
  text: string,
  mapping: T
): string | null {
  const normalized = normalizeTextForMapping(text);
  
  // Direct match
  if (mapping[normalized]) {
    return mapping[normalized];
  }
  
  // Partial match (check if any key is contained in text)
  for (const [key, value] of Object.entries(mapping)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
}

/**
 * Get all possible enum values for a given natural language phrase
 * Useful for debugging and understanding mappings
 */
export function getEnumCandidates(text: string, mapping: Record<string, string>): string[] {
  const normalized = normalizeTextForMapping(text);
  const candidates: string[] = [];
  
  for (const [key, value] of Object.entries(mapping)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      if (!candidates.includes(value)) {
        candidates.push(value);
      }
    }
  }
  
  return candidates;
}

