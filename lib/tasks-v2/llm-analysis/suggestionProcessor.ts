/**
 * Suggestion Processor
 * 
 * Validates, enriches, and deduplicates LLM-generated suggestions and optimizations.
 */

import type { SuggestedTask, TaskPriority, TaskContextType } from '../types'
import { MOCK_TEAMS } from '../mockData'
import { MOCK_USERS } from '../mockData'
import type { Task } from '../types'

export interface LLMSuggestion {
  title: string
  description?: string
  rationale: string
  recommendedTeamId: string
  recommendedAssignee?: {
    userId: string
    reason: string
  }
  suggestedDueDate: string
  priority: TaskPriority
  estimatedMinutes?: number
  tags?: string[]
  linkedContext: {
    type: TaskContextType
    id: string
    label: string
  }
  confidence: number
  expectedOutcome: string
  highlights: string[]
}

export interface LLMOptimization {
  taskId: string
  taskTitle: string
  action: 'reschedule' | 'reassign' | 'reprioritize' | 'split' | 'merge'
  currentValue: any
  suggestedValue: any
  rationale: string
  confidence: number
  expectedImpact: string
  requiresApproval: boolean
}

export interface ProcessedSuggestion extends SuggestedTask {
  processedAt: string
  validationErrors?: string[]
}

export interface ProcessedOptimization extends LLMOptimization {
  processedAt: string
  validationErrors?: string[]
  canAutoApply: boolean
}

/**
 * Process LLM suggestions - validate, enrich, deduplicate
 */
export function processSuggestions(
  llmSuggestions: LLMSuggestion[],
  existingTasks: Task[],
  existingSuggestions: SuggestedTask[] = []
): ProcessedSuggestion[] {
  const processed: ProcessedSuggestion[] = []

  for (const suggestion of llmSuggestions) {
    // Validate
    const validationErrors = validateSuggestion(suggestion)
    
    if (validationErrors.length > 0) {
      console.warn('⚠️  Suggestion validation failed:', validationErrors, suggestion)
      // Still add but mark with errors
    }

    // Enrich with system data
    const enriched = enrichSuggestion(suggestion)

    // Check for duplicates
    const isDuplicate = checkDuplicate(enriched, existingTasks, existingSuggestions)
    if (isDuplicate) {
      console.log('🔍 Duplicate suggestion detected, skipping:', enriched.title)
      continue
    }

    processed.push({
      ...enriched,
      processedAt: new Date().toISOString(),
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined
    })
  }

  return processed
}

/**
 * Process LLM optimizations - validate, enrich, determine auto-apply eligibility
 */
export function processOptimizations(
  llmOptimizations: LLMOptimization[],
  existingTasks: Task[]
): ProcessedOptimization[] {
  const processed: ProcessedOptimization[] = []

  for (const optimization of llmOptimizations) {
    // Validate
    const validationErrors = validateOptimization(optimization, existingTasks)
    
    if (validationErrors.length > 0) {
      console.warn('⚠️  Optimization validation failed:', validationErrors, optimization)
    }

    // Determine if can auto-apply (high confidence, low risk)
    const canAutoApply = determineAutoApplyEligibility(optimization, validationErrors)

    processed.push({
      ...optimization,
      processedAt: new Date().toISOString(),
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      canAutoApply
    })
  }

  return processed
}

/**
 * Validate suggestion structure and content
 */
function validateSuggestion(suggestion: LLMSuggestion): string[] {
  const errors: string[] = []

  if (!suggestion.title || suggestion.title.trim().length < 5) {
    errors.push('Title too short or missing')
  }

  if (!suggestion.recommendedTeamId) {
    errors.push('Missing recommendedTeamId')
  } else {
    // Verify team exists
    const team = MOCK_TEAMS.find(t => t.id === suggestion.recommendedTeamId)
    if (!team) {
      errors.push(`Team ${suggestion.recommendedTeamId} not found`)
    }
  }

  if (suggestion.recommendedAssignee?.userId) {
    // Verify user exists
    const user = MOCK_USERS.find(u => u.id === suggestion.recommendedAssignee!.userId)
    if (!user) {
      errors.push(`User ${suggestion.recommendedAssignee.userId} not found`)
    }
  }

  if (!suggestion.suggestedDueDate) {
    errors.push('Missing suggestedDueDate')
  } else {
    // Verify date is valid
    const dueDate = new Date(suggestion.suggestedDueDate)
    if (isNaN(dueDate.getTime())) {
      errors.push('Invalid suggestedDueDate format')
    }
  }

  if (!['critical', 'high', 'medium', 'low'].includes(suggestion.priority)) {
    errors.push(`Invalid priority: ${suggestion.priority}`)
  }

  if (suggestion.confidence < 0 || suggestion.confidence > 1) {
    errors.push(`Invalid confidence: ${suggestion.confidence} (must be 0-1)`)
  }

  if (!suggestion.linkedContext || !suggestion.linkedContext.type || !suggestion.linkedContext.id) {
    errors.push('Missing or invalid linkedContext')
  }

  return errors
}

/**
 * Validate optimization structure and content
 */
function validateOptimization(
  optimization: LLMOptimization,
  existingTasks: Task[]
): string[] {
  const errors: string[] = []

  if (!optimization.taskId) {
    errors.push('Missing taskId')
  } else {
    // Verify task exists
    const task = existingTasks.find(t => t.id === optimization.taskId)
    if (!task) {
      errors.push(`Task ${optimization.taskId} not found`)
    }
  }

  if (!['reschedule', 'reassign', 'reprioritize', 'split', 'merge'].includes(optimization.action)) {
    errors.push(`Invalid action: ${optimization.action}`)
  }

  if (optimization.confidence < 0 || optimization.confidence > 1) {
    errors.push(`Invalid confidence: ${optimization.confidence} (must be 0-1)`)
  }

  // Action-specific validation
  if (optimization.action === 'reschedule') {
    if (!optimization.suggestedValue || typeof optimization.suggestedValue !== 'string') {
      errors.push('Reschedule action requires suggestedValue as ISO date string')
    } else {
      const date = new Date(optimization.suggestedValue)
      if (isNaN(date.getTime())) {
        errors.push('Invalid suggestedValue date format for reschedule')
      }
    }
  }

  if (optimization.action === 'reassign') {
    if (!optimization.suggestedValue || typeof optimization.suggestedValue !== 'string') {
      errors.push('Reassign action requires suggestedValue as userId')
    } else {
      const user = MOCK_USERS.find(u => u.id === optimization.suggestedValue)
      if (!user) {
        errors.push(`User ${optimization.suggestedValue} not found for reassignment`)
      }
    }
  }

  if (optimization.action === 'reprioritize') {
    if (!['critical', 'high', 'medium', 'low'].includes(optimization.suggestedValue)) {
      errors.push(`Invalid priority for reprioritize: ${optimization.suggestedValue}`)
    }
  }

  return errors
}

/**
 * Enrich suggestion with system data (team colors, user avatars, etc.)
 */
function enrichSuggestion(suggestion: LLMSuggestion): SuggestedTask {
  const team = MOCK_TEAMS.find(t => t.id === suggestion.recommendedTeamId)
  const user = suggestion.recommendedAssignee?.userId
    ? MOCK_USERS.find(u => u.id === suggestion.recommendedAssignee!.userId)
    : undefined

  return {
    id: `suggest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: suggestion.title,
    description: suggestion.description,
    rationale: suggestion.rationale,
    recommendedTeamId: suggestion.recommendedTeamId,
    recommendedTeamLabel: team?.name || 'Unknown Team',
    recommendedAssignee: user ? {
      userId: user.id,
      name: user.name,
      avatar: user.avatar
    } : undefined,
    suggestedDueDate: suggestion.suggestedDueDate,
    origin: 'ai',
    expectedOutcome: suggestion.expectedOutcome,
    highlights: suggestion.highlights || [],
    confidence: suggestion.confidence,
    linkedContext: suggestion.linkedContext.label || suggestion.linkedContext.id,
    contextType: suggestion.linkedContext.type,
    contextId: suggestion.linkedContext.id,
    priority: suggestion.priority,
    estimatedMinutes: suggestion.estimatedMinutes,
    tags: suggestion.tags || [],
    createdAt: new Date().toISOString()
  }
}

/**
 * Check if suggestion is duplicate of existing task or suggestion
 */
function checkDuplicate(
  suggestion: SuggestedTask,
  existingTasks: Task[],
  existingSuggestions: SuggestedTask[]
): boolean {
  // Check against existing tasks
  const duplicateTask = existingTasks.find(t => 
    t.title.toLowerCase() === suggestion.title.toLowerCase() &&
    t.owningTeamId === suggestion.recommendedTeamId
  )
  if (duplicateTask) return true

  // Check against existing suggestions (within last 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recentSuggestions = existingSuggestions.filter(s => 
    new Date(s.createdAt) >= oneDayAgo
  )
  
  const duplicateSuggestion = recentSuggestions.find(s =>
    s.title.toLowerCase() === suggestion.title.toLowerCase() &&
    s.recommendedTeamId === suggestion.recommendedTeamId
  )
  if (duplicateSuggestion) return true

  return false
}

/**
 * Determine if optimization can be auto-applied
 */
function determineAutoApplyEligibility(
  optimization: LLMOptimization,
  validationErrors: string[]
): boolean {
  // Cannot auto-apply if validation errors
  if (validationErrors.length > 0) return false

  // Require high confidence (>= 0.85) for auto-apply
  if (optimization.confidence < 0.85) return false

  // Some actions always require approval
  if (['split', 'merge'].includes(optimization.action)) return false

  // Reprioritize to critical always requires approval
  if (optimization.action === 'reprioritize' && optimization.suggestedValue === 'critical') {
    return false
  }

  // Reschedule far into future requires approval
  if (optimization.action === 'reschedule') {
    const suggestedDate = new Date(optimization.suggestedValue)
    const now = new Date()
    const daysDiff = (suggestedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    if (Math.abs(daysDiff) > 7) return false // More than 7 days change
  }

  return true
}

