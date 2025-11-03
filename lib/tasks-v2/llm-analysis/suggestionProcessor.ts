/**
 * Suggestion Processor
 * 
 * Validates, enriches, and deduplicates LLM-generated suggestions and optimizations.
 */

import type { SuggestedTask, TaskPriority, TaskContextType } from '../types'
import { MOCK_TEAMS } from '../mockData'
import { MOCK_USERS } from '../mockData'
import { generateMockTeams } from '@/lib/data/teams'
import type { Task } from '../types'

export interface LLMSuggestion {
  title: string
  description?: string
  rationale: string
  recommendedAssignees?: Array<{
    userId: string
    reason?: string
  }>
  recommendedTeamId?: string
  suggestedDueDate?: string
  dueWindow?: {
    start?: string
    end?: string
    timezone?: string
  }
  priority: TaskPriority
  estimatedMinutes?: number
  tags?: string[]
  checklist?: Array<{
    label: string
    sequence: number
  }>
  dependencies?: Array<{
    taskId: string
    type: 'finish_to_start' | 'finish_to_finish' | 'start_to_start' | 'start_to_finish'
  }>
  workflowContext?: {
    workflowId: string
    workflowName: string
    stageId?: string
    stageName?: string
  }
  location?: string
  contexts?: Array<{
    type: TaskContextType
    referenceId: string
    label?: string
    role?: 'primary' | 'supporting'
  }>
  confidence: number
  expectedOutcome: string
  highlights: string[]
  
  // Legacy fields for backward compatibility
  recommendedAssignee?: {
    userId: string
    reason?: string
  }
  linkedContext?: {
    type: TaskContextType
    id: string
    label: string
  }
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

  // Must have at least one assignee (new format) or recommendedAssignee (legacy)
  const hasAssignees = (suggestion.recommendedAssignees && suggestion.recommendedAssignees.length > 0) || 
                        suggestion.recommendedAssignee?.userId
  
  if (!hasAssignees) {
    errors.push('Missing recommendedAssignees - must specify at least one person to assign')
  } else {
    // Validate assignees
    const assignees = suggestion.recommendedAssignees || 
                      (suggestion.recommendedAssignee ? [suggestion.recommendedAssignee] : [])
    
    assignees.forEach((assignee, idx) => {
      const user = MOCK_USERS.find(u => u.id === assignee.userId)
      if (!user) {
        errors.push(`User ${assignee.userId} not found for assignee ${idx + 1}`)
      }
    })

    // Verify team can be derived from assignees or is explicitly provided
    const firstAssignee = assignees[0]
    if (firstAssignee) {
      const firstUser = MOCK_USERS.find(u => u.id === firstAssignee.userId)
      if (!firstUser?.teamId && !suggestion.recommendedTeamId) {
        errors.push('Cannot derive team from assignees and no recommendedTeamId provided')
      }
    }
  }

  // Verify date if provided
  if (suggestion.suggestedDueDate) {
    const dueDate = new Date(suggestion.suggestedDueDate)
    if (isNaN(dueDate.getTime())) {
      errors.push('Invalid suggestedDueDate format')
    }
  }
  
  // Verify dueWindow if provided
  if (suggestion.dueWindow) {
    if (suggestion.dueWindow.start) {
      const start = new Date(suggestion.dueWindow.start)
      if (isNaN(start.getTime())) {
        errors.push('Invalid dueWindow.start format')
      }
    }
    if (suggestion.dueWindow.end) {
      const end = new Date(suggestion.dueWindow.end)
      if (isNaN(end.getTime())) {
        errors.push('Invalid dueWindow.end format')
      }
    }
  }

  if (!['critical', 'high', 'medium', 'low'].includes(suggestion.priority)) {
    errors.push(`Invalid priority: ${suggestion.priority}`)
  }

  if (suggestion.confidence < 0 || suggestion.confidence > 1) {
    errors.push(`Invalid confidence: ${suggestion.confidence} (must be 0-1)`)
  }

  // Validate contexts (either new format or legacy)
  if (!suggestion.contexts && !suggestion.linkedContext) {
    errors.push('Missing contexts - must provide at least one context link')
  }
  
  if (suggestion.contexts && suggestion.contexts.length > 0) {
    suggestion.contexts.forEach((ctx, idx) => {
      if (!ctx.type || !ctx.referenceId) {
        errors.push(`Invalid context at index ${idx}: missing type or referenceId`)
      }
    })
  }
  
  if (suggestion.linkedContext && (!suggestion.linkedContext.type || !suggestion.linkedContext.id)) {
    errors.push('Invalid linkedContext: missing type or id')
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
  // Handle assignees - convert from LLM format to TaskAssignment[]
  const assignees: Array<{ userId: string; reason?: string }> = []
  
  // Support both new format (recommendedAssignees) and legacy (recommendedAssignee)
  if (suggestion.recommendedAssignees && suggestion.recommendedAssignees.length > 0) {
    assignees.push(...suggestion.recommendedAssignees)
  } else if (suggestion.recommendedAssignee?.userId) {
    assignees.push(suggestion.recommendedAssignee)
  }

  // Build TaskAssignment array
  const taskAssignments = assignees.map((assignee, idx) => {
    const user = MOCK_USERS.find(u => u.id === assignee.userId)
    if (!user) {
      // Instead of throwing, try to find a similar user or use first available
      console.warn(`⚠️  User ${assignee.userId} not found, attempting to find replacement`)
      const availableUser = MOCK_USERS[0] // Fallback to first user
      if (!availableUser) {
        throw new Error(`No users available in system. Invalid userId: ${assignee.userId}`)
      }
      console.warn(`   Using ${availableUser.id} (${availableUser.name}) as replacement`)
      return {
        taskId: '',
        userId: availableUser.id,
        userName: availableUser.name,
        userAvatar: availableUser.avatar,
        role: idx === 0 ? 'owner' as const : 'collaborator' as const,
        requiredAck: idx === 0,
      }
    }
    
    return {
      taskId: '', // Will be set when task is created
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      role: idx === 0 ? 'owner' as const : 'collaborator' as const,
      requiredAck: idx === 0, // First assignee is owner and requires ack
    }
  })

  // Derive team from first assignee
  const firstAssignee = assignees[0]
  let teamId: string | undefined
  let teamLabel: string | undefined
  
  if (firstAssignee) {
    const firstUser = MOCK_USERS.find(u => u.id === firstAssignee.userId)
    if (firstUser?.teamId) {
      teamId = firstUser.teamId
      // Try to find team in both MOCK_TEAMS and generateMockTeams()
      let team = MOCK_TEAMS.find(t => t.id === teamId)
      if (!team) {
        const allTeams = generateMockTeams()
        team = allTeams.find(t => t.id === teamId)
      }
      teamLabel = team?.name
    }
  }

  // Fallback to recommendedTeamId if provided
  if (!teamId && suggestion.recommendedTeamId) {
    teamId = suggestion.recommendedTeamId
    let team = MOCK_TEAMS.find(t => t.id === teamId)
    if (!team) {
      const allTeams = generateMockTeams()
      team = allTeams.find(t => t.id === teamId)
    }
    teamLabel = team?.name || 'Unknown Team'
  }

  // Build contexts array
  const contexts: Array<{
    id: string
    taskId: string
    type: TaskContextType
    referenceId: string
    label?: string
    role: 'primary' | 'supporting'
  }> = []

  if (suggestion.contexts && suggestion.contexts.length > 0) {
    suggestion.contexts.forEach((ctx, idx) => {
      contexts.push({
        id: `ctx-${Date.now()}-${idx}`,
        taskId: '', // Will be set when task is created
        type: ctx.type,
        referenceId: ctx.referenceId,
        label: ctx.label,
        role: ctx.role || (idx === 0 ? 'primary' : 'supporting')
      })
    })
  } else if (suggestion.linkedContext) {
    // Legacy format support
    contexts.push({
      id: `ctx-${Date.now()}-0`,
      taskId: '',
      type: suggestion.linkedContext.type,
      referenceId: suggestion.linkedContext.id,
      label: suggestion.linkedContext.label,
      role: 'primary'
    })
  }

  return {
    id: `suggest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: suggestion.title,
    description: suggestion.description,
    rationale: suggestion.rationale,
    recommendedAssignees: taskAssignments,
    recommendedTeamId: teamId,
    recommendedTeamLabel: teamLabel,
    suggestedDueDate: suggestion.suggestedDueDate,
    dueWindow: suggestion.dueWindow,
    priority: suggestion.priority,
    estimatedMinutes: suggestion.estimatedMinutes,
    tags: suggestion.tags || [],
    checklist: suggestion.checklist,
    dependencies: suggestion.dependencies,
    workflowContext: suggestion.workflowContext,
    location: suggestion.location,
    contexts,
    origin: 'ai',
    expectedOutcome: suggestion.expectedOutcome,
    highlights: suggestion.highlights || [],
    confidence: suggestion.confidence,
    createdAt: new Date().toISOString(),
    // Backward compatibility
    recommendedAssignee: taskAssignments[0] ? {
      userId: taskAssignments[0].userId,
      name: taskAssignments[0].userName,
      avatar: taskAssignments[0].userAvatar
    } : undefined
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
  const suggestionTitle = suggestion.title.toLowerCase()
  const suggestionTeamId = suggestion.recommendedTeamId
  
  // Check against existing tasks
  const duplicateTask = existingTasks.find(t => 
    t.title.toLowerCase() === suggestionTitle &&
    t.owningTeamId === suggestionTeamId
  )
  if (duplicateTask) return true

  // Check against existing suggestions (within last 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recentSuggestions = existingSuggestions.filter(s => 
    new Date(s.createdAt) >= oneDayAgo
  )
  
  const duplicateSuggestion = recentSuggestions.find(s =>
    s.title.toLowerCase() === suggestionTitle &&
    s.recommendedTeamId === suggestionTeamId
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

