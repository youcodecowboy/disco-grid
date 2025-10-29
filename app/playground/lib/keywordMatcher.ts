/**
 * Keyword Matcher for AI Playground
 * 
 * NOTE: This is now a FALLBACK system. Primary component selection
 * is done via LLM (see /api/playground/generate-component).
 * This matcher is used when LLM fails or is unavailable.
 * 
 * Phase 1: Simple keyword matching for 22+ component types
 */

import type { BlockType } from "@/lib/grid-v2/types"
import { extractEntityContext, generateContextualTitle, type DataSource, type EntityContext } from './dataSourceMapper'

export interface KeywordRule {
  keywords: string[]
  componentType: BlockType
  confidence: number
  defaultSize: { w: number; h: number }
  priority: number
  category: 'chart' | 'table' | 'metric' | 'other'
}

export interface MatchResult {
  componentType: BlockType
  confidence: number
  defaultSize: { w: number; h: number }
  category: string
  detectedKeywords: string[]
  dataSource?: DataSource
  entityContext?: EntityContext
  suggestedTitle?: string
}

// Phase 1: Core keyword rules - using V3 components
const KEYWORD_RULES: KeywordRule[] = [
  // Charts - Bar (highest priority for comparison/ranking terms)
  {
    keywords: ['bar chart', 'bar graph', 'comparison', 'compare', 'ranking', 'versus', 'vs', 'top', 'bottom'],
    componentType: 'v3.chart.bar',
    confidence: 0.95,
    defaultSize: { w: 6, h: 8 },
    priority: 11,
    category: 'chart'
  },
  
  // Charts - Donut/Pie (highest priority for distribution/percentage terms)
  {
    keywords: ['donut', 'pie chart', 'distribution', 'breakdown', 'percentage', 'portion', 'share', 'split'],
    componentType: 'v3.chart.donut',
    confidence: 0.95,
    defaultSize: { w: 6, h: 8 },
    priority: 11,
    category: 'chart'
  },
  
  // Charts - Area/Line (highest priority for trend-related terms)
  {
    keywords: ['line chart', 'area chart', 'trend', 'over time', 'timeline', 'growth', 'time series', 'sales', 'revenue'],
    componentType: 'v3.chart.area',
    confidence: 0.95,
    defaultSize: { w: 8, h: 8 },
    priority: 10,
    category: 'chart'
  },
  
  // Charts - Generic (fallback for chart keywords)
  {
    keywords: ['chart', 'graph', 'visualization', 'visual', 'plot'],
    componentType: 'v3.chart.area',
    confidence: 0.7,
    defaultSize: { w: 8, h: 8 },
    priority: 5,
    category: 'chart'
  },
  
  // Tables
  {
    keywords: ['table', 'list', 'data', 'rows', 'records', 'entries', 'spreadsheet', 'orders'],
    componentType: 'v3.table',
    confidence: 0.9,
    defaultSize: { w: 6, h: 8 },
    priority: 10,
    category: 'table'
  },
  
  // Activity Timeline
  {
    keywords: ['activity', 'feed', 'timeline', 'recent', 'updates', 'events', 'log', 'history'],
    componentType: 'v3.activity.timeline',
    confidence: 0.9,
    defaultSize: { w: 4, h: 8 },
    priority: 10,
    category: 'other'
  },
  
  // Status Grid
  {
    keywords: ['status', 'health', 'monitoring', 'system', 'uptime', 'online', 'offline', 'availability'],
    componentType: 'v3.status.grid',
    confidence: 0.9,
    defaultSize: { w: 6, h: 6 },
    priority: 10,
    category: 'other'
  },
  
  // Progress Tracker
  {
    keywords: ['progress', 'tasks', 'completion', 'checklist', 'todo', 'to do', 'tracking', 'milestones'],
    componentType: 'v3.progress.tracker',
    confidence: 0.9,
    defaultSize: { w: 4, h: 8 },
    priority: 10,
    category: 'other'
  },
  
  // KPI Card V3
  {
    keywords: ['kpi card', 'simple metric', 'single value', 'quick stat'],
    componentType: 'v3.kpi',
    confidence: 0.95,
    defaultSize: { w: 4, h: 4 },
    priority: 11,
    category: 'metric'
  },
  
  // Metrics - Single KPI (construction style)
  {
    keywords: ['metric', 'kpi', 'total', 'count', 'number', 'stat', 'statistic'],
    componentType: 'construction.metric.large',
    confidence: 0.9,
    defaultSize: { w: 3, h: 4 },
    priority: 10,
    category: 'metric'
  },
  
  // Interactive Site Map
  {
    keywords: ['site map', 'location map', 'zone map', 'floor plan', 'area map', 'facility map'],
    componentType: 'v3.map.site',
    confidence: 0.95,
    defaultSize: { w: 8, h: 10 },
    priority: 11,
    category: 'other'
  },
  
  // Heatmap (capacity/utilization monitoring)
  {
    keywords: ['heatmap', 'heat map', 'capacity map', 'utilization', 'production stages', 'manufacturing stages', 
               'material utilization', 'stage capacity', 'workflow capacity', 'bottleneck'],
    componentType: 'v3.heatmap',
    confidence: 0.95,
    defaultSize: { w: 6, h: 8 },
    priority: 11,
    category: 'chart'
  },
  
  // Pulse Grid
  {
    keywords: ['pulse grid', 'activity grid', 'live grid', 'monitoring grid', 'pulse monitor'],
    componentType: 'v3.grid.pulse',
    confidence: 0.95,
    defaultSize: { w: 6, h: 8 },
    priority: 11,
    category: 'other'
  },
  
  // Kanban Board
  {
    keywords: ['kanban', 'kanban board', 'board', 'workflow', 'pipeline', 'stages', 'task board', 'project board'],
    componentType: 'v3.kanban',
    confidence: 0.95,
    defaultSize: { w: 12, h: 10 },
    priority: 11,
    category: 'other'
  },
  
  // Calendar Heatmap
  {
    keywords: ['calendar heatmap', 'activity calendar', 'contribution calendar', 'daily activity', 'github style calendar'],
    componentType: 'v3.calendar.heatmap',
    confidence: 0.95,
    defaultSize: { w: 8, h: 6 },
    priority: 11,
    category: 'chart'
  },
  
  // Animated Counter
  {
    keywords: ['counter', 'animated counter', 'ticker', 'live count', 'animated number', 'counting metric'],
    componentType: 'v3.counter.animated',
    confidence: 0.95,
    defaultSize: { w: 4, h: 6 },
    priority: 11,
    category: 'metric'
  },
  
  // Sankey Diagram
  {
    keywords: ['sankey', 'sankey diagram', 'flow chart', 'flow diagram', 'funnel flow', 'customer journey', 'conversion flow'],
    componentType: 'v3.chart.sankey',
    confidence: 0.95,
    defaultSize: { w: 10, h: 8 },
    priority: 11,
    category: 'chart'
  },
  
  // Radar Chart
  {
    keywords: ['radar', 'radar chart', 'spider chart', 'web chart', 'star chart', 'multi-axis', 'performance metrics'],
    componentType: 'v3.chart.radar',
    confidence: 0.95,
    defaultSize: { w: 6, h: 8 },
    priority: 11,
    category: 'chart'
  },
  
  // Network Graph
  {
    keywords: ['network', 'network graph', 'relationship graph', 'connection map', 'org chart', 'collaboration network', 'social network'],
    componentType: 'v3.graph.network',
    confidence: 0.95,
    defaultSize: { w: 10, h: 8 },
    priority: 11,
    category: 'other'
  },
  
  // 3D Card Stack
  {
    keywords: ['3d cards', 'card stack', 'stacked cards', '3d stack', 'card carousel', 'metric cards'],
    componentType: 'v3.cards.3d',
    confidence: 0.95,
    defaultSize: { w: 8, h: 10 },
    priority: 11,
    category: 'other'
  },
  
  // Sparkline Chart
  {
    keywords: ['sparkline', 'mini chart', 'trend line', 'micro chart', 'inline chart'],
    componentType: 'v3.chart.sparkline',
    confidence: 0.95,
    defaultSize: { w: 4, h: 4 },
    priority: 11,
    category: 'chart'
  },
  
  // Wave Chart
  {
    keywords: ['wave', 'wave chart', 'real-time chart', 'live chart', 'streaming data', 'oscilloscope'],
    componentType: 'v3.chart.wave',
    confidence: 0.95,
    defaultSize: { w: 10, h: 6 },
    priority: 11,
    category: 'chart'
  },
]

/**
 * Match a prompt to the best component type
 */
export function matchPromptToComponent(prompt: string): MatchResult | null {
  if (!prompt || prompt.trim().length === 0) {
    return null
  }
  
  const normalizedPrompt = prompt.toLowerCase().trim()
  
  // Extract entity context (data source, action, time context, etc.)
  const entityContext = extractEntityContext(prompt)
  
  let bestMatch: (MatchResult & { priority: number }) | null = null
  
  for (const rule of KEYWORD_RULES) {
    const matchedKeywords: string[] = []
    
    // Check each keyword in the rule
    for (const keyword of rule.keywords) {
      if (normalizedPrompt.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword)
      }
    }
    
    // If we found matching keywords
    if (matchedKeywords.length > 0) {
      // Calculate confidence based on number of matches
      const adjustedConfidence = Math.min(
        rule.confidence + (matchedKeywords.length - 1) * 0.05,
        1.0
      )
      
      // Check if this is a better match than what we have
      if (!bestMatch || rule.priority > bestMatch.priority) {
        // Generate contextual title for this component type
        const suggestedTitle = generateContextualTitle(prompt, rule.componentType, entityContext)
        
        bestMatch = {
          componentType: rule.componentType,
          confidence: adjustedConfidence,
          defaultSize: rule.defaultSize,
          category: rule.category,
          detectedKeywords: matchedKeywords,
          dataSource: entityContext.dataSource,
          entityContext,
          suggestedTitle,
          priority: rule.priority
        }
      }
    }
  }
  
  if (!bestMatch) {
    return null
  }
  
  // Remove priority from the final result
  const { priority, ...result } = bestMatch
  return result
}

/**
 * Generate a title from the prompt (legacy function, now uses contextual title generation)
 */
export function generateTitleFromPrompt(prompt: string, componentType: BlockType, matchResult?: MatchResult): string {
  // If we have a suggested title from the match result, use it
  if (matchResult?.suggestedTitle) {
    return matchResult.suggestedTitle
  }
  
  // Otherwise, generate a contextual title
  const entityContext = extractEntityContext(prompt)
  return generateContextualTitle(prompt, componentType, entityContext)
}

/**
 * Get friendly component name for display
 */
export function getComponentDisplayName(componentType: BlockType): string {
  const names: Record<string, string> = {
    'v3.chart.area': 'Area Chart',
    'v3.chart.bar': 'Bar Chart',
    'v3.chart.donut': 'Donut Chart',
    'v3.table': 'Data Table',
    'v3.activity.timeline': 'Activity Timeline',
    'v3.kpi': 'KPI Card',
    'v3.status.grid': 'Status Grid',
    'v3.progress.tracker': 'Progress Tracker',
    'construction.metric.large': 'Metric Card',
    'v3.map.site': 'Site Map',
    'v3.heatmap': 'Capacity Heatmap',
    'v3.grid.pulse': 'Pulse Grid',
    'v3.kanban': 'Kanban Board',
    'v3.calendar.heatmap': 'Calendar Heatmap',
    'v3.counter.animated': 'Animated Counter',
    'v3.chart.sankey': 'Sankey Diagram',
    'v3.chart.radar': 'Radar Chart',
    'v3.graph.network': 'Network Graph',
    'v3.cards.3d': '3D Card Stack',
    'v3.chart.sparkline': 'Sparkline Chart',
    'v3.chart.wave': 'Wave Chart'
  }
  
  return names[componentType] || 'Component'
}

