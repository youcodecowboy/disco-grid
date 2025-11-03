/**
 * Follow-up Questions System
 * Manages the conversation flow for dashboard generation
 */

export type QuestionType = 'text' | 'buttons' | 'data-source' | 'multi-select'

export interface Question {
  id: string
  type: QuestionType
  question: string
  options?: Array<{ value: string; label: string; icon?: string }>
  required?: boolean
  placeholder?: string
}

export interface Answer {
  questionId: string
  value: string | string[]
}

export interface ConversationState {
  initialPrompt: string
  answers: Answer[]
  currentQuestionIndex: number
}

/**
 * Available mock data sources
 */
export const MOCK_DATA_SOURCES = [
  {
    value: 'sales',
    label: 'Sales Data',
    icon: '💰',
    description: 'Revenue, orders, transactions'
  },
  {
    value: 'production',
    label: 'Production Data',
    icon: '🏭',
    description: 'Manufacturing, output, efficiency'
  },
  {
    value: 'inventory',
    label: 'Inventory Data',
    icon: '📦',
    description: 'Stock levels, items, SKUs'
  },
  {
    value: 'customers',
    label: 'Customer Data',
    icon: '👥',
    description: 'Users, accounts, demographics'
  },
  {
    value: 'analytics',
    label: 'Analytics Data',
    icon: '📊',
    description: 'Metrics, KPIs, performance'
  },
  {
    value: 'orders',
    label: 'Order Data',
    icon: '🛒',
    description: 'Purchases, fulfillment, shipping'
  },
  {
    value: 'quality',
    label: 'Quality Data',
    icon: '✅',
    description: 'Defects, inspections, standards'
  },
  {
    value: 'timeline',
    label: 'Activity Timeline',
    icon: '⏰',
    description: 'Events, history, changes'
  }
]

/**
 * Analyze initial prompt to determine what questions to ask
 */
export function generateFollowUpQuestions(initialPrompt: string): Question[] {
  const questions: Question[] = []
  const prompt = initialPrompt.toLowerCase()
  
  // Determine what types of components were mentioned
  const hasCharts = prompt.match(/chart|graph|visualization|trend|line|bar|pie|area/)
  const hasTables = prompt.match(/table|list|grid|data/)
  const hasMetrics = prompt.match(/metric|kpi|number|stat|score/)
  
  // Question 1: Primary data source
  questions.push({
    id: 'primary-data-source',
    type: 'data-source',
    question: 'What type of data should this dashboard display?',
    required: true
  })
  
  // Question 2: Specific component data sources
  if (hasCharts) {
    questions.push({
      id: 'chart-data-source',
      type: 'buttons',
      question: 'What data should the chart(s) display?',
      options: MOCK_DATA_SOURCES.slice(0, 6).map(ds => ({
        value: ds.value,
        label: ds.label,
        icon: ds.icon
      })),
      required: true
    })
  }
  
  if (hasTables) {
    questions.push({
      id: 'table-data-source',
      type: 'buttons',
      question: 'What data should the table(s) show?',
      options: MOCK_DATA_SOURCES.slice(0, 6).map(ds => ({
        value: ds.value,
        label: ds.label,
        icon: ds.icon
      })),
      required: true
    })
  }
  
  if (hasMetrics) {
    questions.push({
      id: 'metrics-data-source',
      type: 'buttons',
      question: 'What metrics should we display?',
      options: MOCK_DATA_SOURCES.slice(0, 6).map(ds => ({
        value: ds.value,
        label: ds.label,
        icon: ds.icon
      })),
      required: true
    })
  }
  
  // Question: Layout preference
  questions.push({
    id: 'layout-density',
    type: 'buttons',
    question: 'How would you like the components arranged?',
    options: [
      { value: 'compact', label: 'Compact', icon: '📐' },
      { value: 'comfortable', label: 'Comfortable', icon: '📏' },
      { value: 'spacious', label: 'Spacious', icon: '📐' }
    ],
    required: false
  })
  
  // Question: Additional components
  questions.push({
    id: 'additional-components',
    type: 'text',
    question: 'Any specific components or features you\'d like to add?',
    placeholder: 'e.g., "Add a timeline showing recent activity"',
    required: false
  })
  
  return questions
}

/**
 * Check if we have enough information to generate the dashboard
 */
export function canGenerateDashboard(answers: Answer[], questions: Question[]): boolean {
  const requiredQuestions = questions.filter(q => q.required)
  const answeredRequired = requiredQuestions.filter(rq => 
    answers.some(a => a.questionId === rq.id && a.value)
  )
  
  return answeredRequired.length === requiredQuestions.length
}

/**
 * Format answers for API consumption
 */
export function formatAnswersForAPI(
  initialPrompt: string,
  answers: Answer[]
): Record<string, any> {
  const formatted: Record<string, any> = {
    description: initialPrompt,
    dataSources: [],
    layoutDensity: 'comfortable',
    additionalRequirements: ''
  }
  
  answers.forEach(answer => {
    switch (answer.questionId) {
      case 'primary-data-source':
        if (Array.isArray(answer.value)) {
          formatted.dataSources = answer.value
        } else {
          formatted.dataSources = [answer.value]
        }
        break
      case 'chart-data-source':
      case 'table-data-source':
      case 'metrics-data-source':
        if (!formatted.componentDataSources) {
          formatted.componentDataSources = {}
        }
        formatted.componentDataSources[answer.questionId] = answer.value
        break
      case 'layout-density':
        formatted.layoutDensity = answer.value
        break
      case 'additional-components':
        formatted.additionalRequirements = answer.value
        break
    }
  })
  
  return formatted
}









