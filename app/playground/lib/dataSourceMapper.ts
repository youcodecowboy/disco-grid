/**
 * Data Source Mapper for AI Playground
 * Intelligently detects data sources and entities from prompts
 * to generate more realistic and contextual mock data
 */

export interface DataSource {
  type: 'customers' | 'orders' | 'products' | 'sales' | 'revenue' | 'users' | 'transactions' | 
        'inventory' | 'employees' | 'projects' | 'tasks' | 'leads' | 'invoices' | 'generic'
  label: string
  confidence: number
  detectedKeywords: string[]
}

export interface EntityContext {
  dataSource: DataSource
  actionType?: 'view' | 'list' | 'analyze' | 'track' | 'monitor'
  timeContext?: 'recent' | 'all' | 'active' | 'pending' | 'completed'
  metric?: 'total' | 'count' | 'revenue' | 'growth' | 'trend'
}

// Data source detection rules with priority
const DATA_SOURCE_RULES = [
  {
    keywords: ['customer', 'customers', 'client', 'clients', 'buyer', 'buyers'],
    type: 'customers' as const,
    label: 'Customers',
    confidence: 0.95,
    priority: 10
  },
  {
    keywords: ['order', 'orders', 'purchase', 'purchases', 'booking', 'bookings'],
    type: 'orders' as const,
    label: 'Orders',
    confidence: 0.95,
    priority: 10
  },
  {
    keywords: ['product', 'products', 'item', 'items', 'inventory', 'stock'],
    type: 'products' as const,
    label: 'Products',
    confidence: 0.95,
    priority: 10
  },
  {
    keywords: ['sale', 'sales', 'selling'],
    type: 'sales' as const,
    label: 'Sales',
    confidence: 0.9,
    priority: 9
  },
  {
    keywords: ['revenue', 'income', 'earnings'],
    type: 'revenue' as const,
    label: 'Revenue',
    confidence: 0.9,
    priority: 9
  },
  {
    keywords: ['user', 'users', 'member', 'members', 'account', 'accounts'],
    type: 'users' as const,
    label: 'Users',
    confidence: 0.9,
    priority: 8
  },
  {
    keywords: ['transaction', 'transactions', 'payment', 'payments'],
    type: 'transactions' as const,
    label: 'Transactions',
    confidence: 0.9,
    priority: 8
  },
  {
    keywords: ['employee', 'employees', 'staff', 'team member', 'team members'],
    type: 'employees' as const,
    label: 'Employees',
    confidence: 0.9,
    priority: 8
  },
  {
    keywords: ['project', 'projects', 'initiative', 'initiatives'],
    type: 'projects' as const,
    label: 'Projects',
    confidence: 0.85,
    priority: 7
  },
  {
    keywords: ['task', 'tasks', 'todo', 'todos', 'to-do'],
    type: 'tasks' as const,
    label: 'Tasks',
    confidence: 0.85,
    priority: 7
  },
  {
    keywords: ['lead', 'leads', 'prospect', 'prospects'],
    type: 'leads' as const,
    label: 'Leads',
    confidence: 0.85,
    priority: 7
  },
  {
    keywords: ['invoice', 'invoices', 'bill', 'bills'],
    type: 'invoices' as const,
    label: 'Invoices',
    confidence: 0.85,
    priority: 7
  }
]

// Action detection keywords
const ACTION_KEYWORDS = {
  view: ['view', 'show', 'display', 'see'],
  list: ['list', 'table', 'all', 'every'],
  analyze: ['analyze', 'analysis', 'chart', 'graph', 'trend'],
  track: ['track', 'monitor', 'watch'],
  monitor: ['monitor', 'monitoring', 'status', 'health']
}

// Time context keywords
const TIME_KEYWORDS = {
  recent: ['recent', 'latest', 'new', 'this month', 'this week', 'today'],
  all: ['all', 'every', 'total', 'complete list'],
  active: ['active', 'current', 'ongoing', 'in progress'],
  pending: ['pending', 'waiting', 'queue'],
  completed: ['completed', 'finished', 'done', 'closed']
}

// Metric keywords
const METRIC_KEYWORDS = {
  total: ['total', 'sum', 'all'],
  count: ['count', 'number', 'how many'],
  revenue: ['revenue', 'income', 'earnings', 'money'],
  growth: ['growth', 'increase', 'rising', 'growing'],
  trend: ['trend', 'over time', 'timeline', 'historical']
}

/**
 * Detect the data source from a prompt
 */
export function detectDataSource(prompt: string): DataSource {
  const normalizedPrompt = prompt.toLowerCase().trim()
  
  let bestMatch: DataSource | null = null
  let highestPriority = -1
  
  for (const rule of DATA_SOURCE_RULES) {
    const matchedKeywords: string[] = []
    
    for (const keyword of rule.keywords) {
      if (normalizedPrompt.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword)
      }
    }
    
    if (matchedKeywords.length > 0 && rule.priority > highestPriority) {
      highestPriority = rule.priority
      bestMatch = {
        type: rule.type,
        label: rule.label,
        confidence: rule.confidence,
        detectedKeywords: matchedKeywords
      }
    }
  }
  
  // Default to generic if no match
  if (!bestMatch) {
    return {
      type: 'generic',
      label: 'Data',
      confidence: 0.5,
      detectedKeywords: []
    }
  }
  
  return bestMatch
}

/**
 * Detect action type from prompt
 */
function detectAction(prompt: string): EntityContext['actionType'] {
  const normalized = prompt.toLowerCase()
  
  for (const [action, keywords] of Object.entries(ACTION_KEYWORDS)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return action as EntityContext['actionType']
    }
  }
  
  return undefined
}

/**
 * Detect time context from prompt
 */
function detectTimeContext(prompt: string): EntityContext['timeContext'] {
  const normalized = prompt.toLowerCase()
  
  for (const [time, keywords] of Object.entries(TIME_KEYWORDS)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return time as EntityContext['timeContext']
    }
  }
  
  return undefined
}

/**
 * Detect metric type from prompt
 */
function detectMetric(prompt: string): EntityContext['metric'] {
  const normalized = prompt.toLowerCase()
  
  for (const [metric, keywords] of Object.entries(METRIC_KEYWORDS)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return metric as EntityContext['metric']
    }
  }
  
  return undefined
}

/**
 * Extract full entity context from a prompt
 */
export function extractEntityContext(prompt: string): EntityContext {
  return {
    dataSource: detectDataSource(prompt),
    actionType: detectAction(prompt),
    timeContext: detectTimeContext(prompt),
    metric: detectMetric(prompt)
  }
}

/**
 * Generate a contextual title based on entity context
 */
export function generateContextualTitle(
  prompt: string, 
  componentType: string,
  entityContext?: EntityContext
): string {
  const context = entityContext || extractEntityContext(prompt)
  const { dataSource, actionType, timeContext } = context
  
  // Build title parts
  const timePart = timeContext === 'recent' ? 'Recent' :
                   timeContext === 'active' ? 'Active' :
                   timeContext === 'pending' ? 'Pending' :
                   timeContext === 'completed' ? 'Completed' :
                   timeContext === 'all' ? 'All' : ''
  
  const sourcePart = dataSource.label
  
  // Component-specific title generation
  if (componentType.includes('table')) {
    // For tables: "Active Customers", "Recent Orders", "All Products"
    if (timePart) {
      return `${timePart} ${sourcePart}`
    }
    return sourcePart
  }
  
  if (componentType.includes('chart.bar')) {
    // For bar charts: "Top Customers", "Sales Comparison", "Product Rankings"
    if (prompt.includes('top') || prompt.includes('best')) {
      return `Top ${sourcePart}`
    }
    if (prompt.includes('compar')) {
      return `${sourcePart} Comparison`
    }
    if (prompt.includes('rank')) {
      return `${sourcePart} Rankings`
    }
    return `${sourcePart} Overview`
  }
  
  if (componentType.includes('chart.donut') || componentType.includes('pie')) {
    // For donut/pie charts: "Sales Distribution", "Revenue Breakdown"
    if (prompt.includes('distribution') || prompt.includes('split')) {
      return `${sourcePart} Distribution`
    }
    if (prompt.includes('breakdown')) {
      return `${sourcePart} Breakdown`
    }
    return `${sourcePart} by Category`
  }
  
  if (componentType.includes('chart.area') || componentType.includes('line')) {
    // For line/area charts: "Sales Trend", "Revenue Over Time"
    if (prompt.includes('trend')) {
      return `${sourcePart} Trend`
    }
    if (prompt.includes('growth')) {
      return `${sourcePart} Growth`
    }
    if (prompt.includes('over time') || prompt.includes('timeline')) {
      return `${sourcePart} Over Time`
    }
    return `${sourcePart} Timeline`
  }
  
  if (componentType.includes('kpi') || componentType.includes('metric')) {
    // For metrics: "Total Revenue", "Active Users Count"
    if (prompt.includes('total')) {
      return `Total ${sourcePart}`
    }
    if (prompt.includes('count') || prompt.includes('number')) {
      return `${sourcePart} Count`
    }
    if (timePart) {
      return `${timePart} ${sourcePart}`
    }
    return sourcePart
  }
  
  if (componentType.includes('activity') || componentType.includes('timeline')) {
    // For activity: "Recent Activity", "Customer Activity"
    return `${timePart || 'Recent'} ${sourcePart} Activity`
  }
  
  if (componentType.includes('status')) {
    // For status: "System Status", "Order Status"
    return `${sourcePart} Status`
  }
  
  if (componentType.includes('progress')) {
    // For progress: "Project Progress", "Task Completion"
    return `${sourcePart} Progress`
  }
  
  // Generic fallback
  if (timePart) {
    return `${timePart} ${sourcePart}`
  }
  
  return sourcePart
}



