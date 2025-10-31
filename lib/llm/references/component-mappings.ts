/**
 * LLM Reference Library - Component Type Mappings
 * 
 * Natural language → component type mappings for dashboard component selection.
 * Used by LLM to select appropriate visualization components from user requests.
 */

// ============================================================================
// COMPONENT TYPE CONSTANTS
// ============================================================================

export const COMPONENT_TYPES = {
  // Charts
  AREA_CHART: 'v3.chart.area',
  BAR_CHART: 'v3.chart.bar',
  DONUT_CHART: 'v3.chart.donut',
  SANKEY_CHART: 'v3.chart.sankey',
  RADAR_CHART: 'v3.chart.radar',
  SPARKLINE_CHART: 'v3.chart.sparkline',
  WAVE_CHART: 'v3.chart.wave',
  
  // Tables
  TABLE: 'v3.table',
  
  // Metrics
  KPI: 'v3.kpi',
  COUNTER_ANIMATED: 'v3.counter.animated',
  METRIC_LARGE: 'construction.metric.large',
  
  // Specialized
  MAP_SITE: 'v3.map.site',
  HEATMAP: 'v3.heatmap',
  CALENDAR_HEATMAP: 'v3.calendar.heatmap',
  KANBAN: 'v3.kanban',
  ACTIVITY_TIMELINE: 'v3.activity.timeline',
  STATUS_GRID: 'v3.status.grid',
  PROGRESS_TRACKER: 'v3.progress.tracker',
  GRID_PULSE: 'v3.grid.pulse',
  GRAPH_NETWORK: 'v3.graph.network',
  CARDS_3D: 'v3.cards.3d'
} as const;

// ============================================================================
// NATURAL LANGUAGE → COMPONENT MAPPINGS
// ============================================================================

export const NL_TO_COMPONENT_TYPE: Record<string, string> = {
  // Area Chart - Temporal/Trend data
  'trend': COMPONENT_TYPES.AREA_CHART,
  'trends': COMPONENT_TYPES.AREA_CHART,
  'over time': COMPONENT_TYPES.AREA_CHART,
  'growth': COMPONENT_TYPES.AREA_CHART,
  'timeline': COMPONENT_TYPES.AREA_CHART,
  'historical': COMPONENT_TYPES.AREA_CHART,
  'past': COMPONENT_TYPES.AREA_CHART,
  'since': COMPONENT_TYPES.AREA_CHART,
  'time series': COMPONENT_TYPES.AREA_CHART,
  'over the last': COMPONENT_TYPES.AREA_CHART,
  'over the past': COMPONENT_TYPES.AREA_CHART,
  'throughout': COMPONENT_TYPES.AREA_CHART,
  
  // Bar Chart - Comparisons
  'compare': COMPONENT_TYPES.BAR_CHART,
  'comparison': COMPONENT_TYPES.BAR_CHART,
  'top': COMPONENT_TYPES.BAR_CHART,
  'bottom': COMPONENT_TYPES.BAR_CHART,
  'ranking': COMPONENT_TYPES.BAR_CHART,
  'versus': COMPONENT_TYPES.BAR_CHART,
  'vs': COMPONENT_TYPES.BAR_CHART,
  'best': COMPONENT_TYPES.BAR_CHART,
  'worst': COMPONENT_TYPES.BAR_CHART,
  'ranked': COMPONENT_TYPES.BAR_CHART,
  'comparison of': COMPONENT_TYPES.BAR_CHART,
  
  // Donut Chart - Distributions
  'breakdown': COMPONENT_TYPES.DONUT_CHART,
  'percentage': COMPONENT_TYPES.DONUT_CHART,
  'distribution': COMPONENT_TYPES.DONUT_CHART,
  'share': COMPONENT_TYPES.DONUT_CHART,
  'split': COMPONENT_TYPES.DONUT_CHART,
  'proportion': COMPONENT_TYPES.DONUT_CHART,
  'by status': COMPONENT_TYPES.DONUT_CHART,
  'by category': COMPONENT_TYPES.DONUT_CHART,
  'pie': COMPONENT_TYPES.DONUT_CHART,
  
  // Sankey Chart - Flows
  'flow': COMPONENT_TYPES.SANKEY_CHART,
  'funnel': COMPONENT_TYPES.SANKEY_CHART,
  'journey': COMPONENT_TYPES.SANKEY_CHART,
  'conversion': COMPONENT_TYPES.SANKEY_CHART,
  'path': COMPONENT_TYPES.SANKEY_CHART,
  'from': COMPONENT_TYPES.SANKEY_CHART,
  'to': COMPONENT_TYPES.SANKEY_CHART,
  'process flow': COMPONENT_TYPES.SANKEY_CHART,
  
  // Table - Detailed data
  'list': COMPONENT_TYPES.TABLE,
  'records': COMPONENT_TYPES.TABLE,
  'rows': COMPONENT_TYPES.TABLE,
  'detailed view': COMPONENT_TYPES.TABLE,
  'all items': COMPONENT_TYPES.TABLE,
  'entries': COMPONENT_TYPES.TABLE,
  'table': COMPONENT_TYPES.TABLE,
  'data table': COMPONENT_TYPES.TABLE,
  'grid': COMPONENT_TYPES.TABLE,
  
  // KPI - Single metrics
  'total': COMPONENT_TYPES.KPI,
  'count': COMPONENT_TYPES.KPI,
  'single number': COMPONENT_TYPES.KPI,
  'current': COMPONENT_TYPES.KPI,
  'latest value': COMPONENT_TYPES.KPI,
  'metric': COMPONENT_TYPES.KPI,
  'kpi': COMPONENT_TYPES.KPI,
  'key metric': COMPONENT_TYPES.KPI,
  
  // Counter - Animated metrics
  'live counting': COMPONENT_TYPES.COUNTER_ANIMATED,
  'ticker': COMPONENT_TYPES.COUNTER_ANIMATED,
  'animated numbers': COMPONENT_TYPES.COUNTER_ANIMATED,
  'live metric': COMPONENT_TYPES.COUNTER_ANIMATED,
  
  // Real-time components
  'live': COMPONENT_TYPES.WAVE_CHART,
  'real-time': COMPONENT_TYPES.WAVE_CHART,
  'realtime': COMPONENT_TYPES.WAVE_CHART,
  'streaming': COMPONENT_TYPES.WAVE_CHART,
  'updates': COMPONENT_TYPES.ACTIVITY_TIMELINE,
  'current activity': COMPONENT_TYPES.ACTIVITY_TIMELINE,
  'recent activity': COMPONENT_TYPES.ACTIVITY_TIMELINE,
  'activity feed': COMPONENT_TYPES.ACTIVITY_TIMELINE,
  
  // Tasks/Projects
  'tasks': COMPONENT_TYPES.KANBAN,
  'projects': COMPONENT_TYPES.KANBAN,
  'workflow': COMPONENT_TYPES.KANBAN,
  'completion': COMPONENT_TYPES.PROGRESS_TRACKER,
  'todo': COMPONENT_TYPES.KANBAN,
  'stages': COMPONENT_TYPES.KANBAN,
  'progress': COMPONENT_TYPES.PROGRESS_TRACKER,
  'milestones': COMPONENT_TYPES.PROGRESS_TRACKER,
  'tracker': COMPONENT_TYPES.PROGRESS_TRACKER,
  
  // Location-based
  'facility': COMPONENT_TYPES.MAP_SITE,
  'floor': COMPONENT_TYPES.MAP_SITE,
  'zones': COMPONENT_TYPES.MAP_SITE,
  'capacity by area': COMPONENT_TYPES.HEATMAP,
  'map': COMPONENT_TYPES.MAP_SITE,
  'floor plan': COMPONENT_TYPES.MAP_SITE,
  'utilization': COMPONENT_TYPES.HEATMAP,
  'heatmap': COMPONENT_TYPES.HEATMAP,
  
  // Multi-dimensional
  'performance across': COMPONENT_TYPES.RADAR_CHART,
  'multiple metrics': COMPONENT_TYPES.RADAR_CHART,
  'compare dimensions': COMPONENT_TYPES.RADAR_CHART,
  'radar': COMPONENT_TYPES.RADAR_CHART,
  
  // Status/Health
  'status': COMPONENT_TYPES.STATUS_GRID,
  'health': COMPONENT_TYPES.STATUS_GRID,
  'uptime': COMPONENT_TYPES.STATUS_GRID,
  'system status': COMPONENT_TYPES.STATUS_GRID,
  
  // Calendar/Time patterns
  'calendar': COMPONENT_TYPES.CALENDAR_HEATMAP,
  'daily patterns': COMPONENT_TYPES.CALENDAR_HEATMAP,
  'activity over time': COMPONENT_TYPES.CALENDAR_HEATMAP,
  
  // Network/Relationships
  'relationships': COMPONENT_TYPES.GRAPH_NETWORK,
  'connections': COMPONENT_TYPES.GRAPH_NETWORK,
  'org chart': COMPONENT_TYPES.GRAPH_NETWORK,
  'network': COMPONENT_TYPES.GRAPH_NETWORK,
  
  // Pulse/Live activity
  'pulse': COMPONENT_TYPES.GRID_PULSE,
  'live activity': COMPONENT_TYPES.GRID_PULSE,
  'real-time grid': COMPONENT_TYPES.GRID_PULSE
};

// ============================================================================
// COMPONENT SELECTION RULES
// ============================================================================

export interface ComponentSelectionRule {
  keywords: string[];
  componentType: string;
  description: string;
  priority: number; // Higher = more specific, checked first
}

export const COMPONENT_SELECTION_RULES: ComponentSelectionRule[] = [
  {
    keywords: ['over time', 'trend', 'growth', 'timeline', 'historical', 'past', 'since'],
    componentType: COMPONENT_TYPES.AREA_CHART,
    description: 'Temporal data - trends over time',
    priority: 10
  },
  {
    keywords: ['compare', 'top', 'bottom', 'ranking', 'versus', 'vs', 'best', 'worst'],
    componentType: COMPONENT_TYPES.BAR_CHART,
    description: 'Comparisons and rankings',
    priority: 10
  },
  {
    keywords: ['breakdown', 'percentage', 'distribution', 'share', 'split', 'proportion'],
    componentType: COMPONENT_TYPES.DONUT_CHART,
    description: 'Distribution and percentages',
    priority: 10
  },
  {
    keywords: ['flow', 'funnel', 'journey', 'conversion', 'path', 'from...to'],
    componentType: COMPONENT_TYPES.SANKEY_CHART,
    description: 'Process flows and conversions',
    priority: 10
  },
  {
    keywords: ['list', 'records', 'rows', 'detailed view', 'all items', 'entries'],
    componentType: COMPONENT_TYPES.TABLE,
    description: 'Detailed data tables',
    priority: 10
  },
  {
    keywords: ['total', 'count', 'single number', 'current', 'latest value'],
    componentType: COMPONENT_TYPES.KPI,
    description: 'Single key metrics',
    priority: 9
  },
  {
    keywords: ['live', 'real-time', 'streaming', 'updates', 'current activity'],
    componentType: COMPONENT_TYPES.WAVE_CHART,
    description: 'Real-time streaming data',
    priority: 9
  },
  {
    keywords: ['tasks', 'projects', 'workflow', 'completion', 'todo', 'stages'],
    componentType: COMPONENT_TYPES.KANBAN,
    description: 'Task boards and workflows',
    priority: 9
  },
  {
    keywords: ['facility', 'floor', 'zones', 'capacity by area', 'map'],
    componentType: COMPONENT_TYPES.MAP_SITE,
    description: 'Location-based visualizations',
    priority: 8
  },
  {
    keywords: ['performance across', 'multiple metrics', 'compare dimensions'],
    componentType: COMPONENT_TYPES.RADAR_CHART,
    description: 'Multi-dimensional comparisons',
    priority: 8
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Find component type from natural language text
 */
export function mapNaturalLanguageToComponent(text: string): string | null {
  const normalized = text.toLowerCase().trim();
  
  // Check rules first (more specific)
  for (const rule of COMPONENT_SELECTION_RULES.sort((a, b) => b.priority - a.priority)) {
    for (const keyword of rule.keywords) {
      if (normalized.includes(keyword)) {
        return rule.componentType;
      }
    }
  }
  
  // Fallback to direct mapping
  if (NL_TO_COMPONENT_TYPE[normalized]) {
    return NL_TO_COMPONENT_TYPE[normalized];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(NL_TO_COMPONENT_TYPE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
}

/**
 * Get component candidates for a given text
 */
export function getComponentCandidates(text: string): Array<{ componentType: string; confidence: number; reason: string }> {
  const normalized = text.toLowerCase().trim();
  const candidates: Array<{ componentType: string; confidence: number; reason: string }> = [];
  
  // Check rules
  for (const rule of COMPONENT_SELECTION_RULES.sort((a, b) => b.priority - a.priority)) {
    for (const keyword of rule.keywords) {
      if (normalized.includes(keyword)) {
        candidates.push({
          componentType: rule.componentType,
          confidence: rule.priority / 10,
          reason: rule.description
        });
        break; // Only add once per rule
      }
    }
  }
  
  // Remove duplicates
  const seen = new Set<string>();
  return candidates.filter(c => {
    if (seen.has(c.componentType)) {
      return false;
    }
    seen.add(c.componentType);
    return true;
  });
}

