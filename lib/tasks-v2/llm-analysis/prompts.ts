/**
 * Task Analysis Prompt Builder
 * 
 * Builds optimized prompts for LLM task suggestion and optimization analysis.
 * Uses reference library patterns and examples.
 */

import type { LLMContext } from './contextCollector'

export type PromptStrategy = 'minimal' | 'optimized' | 'few_shot' | 'constrained'

export interface PromptConfig {
  strategy?: PromptStrategy
  optimizationWeights?: {
    capacityUtilization: number // 0-1
    timelineOptimization: number // 0-1
    processEfficiency: number // 0-1
  }
  includeExamples?: boolean
  includePatterns?: boolean
  exampleCount?: number
}

export interface BuiltPrompt {
  systemPrompt: string
  userMessage: string
}

/**
 * Build task analysis prompt
 */
export function buildTaskAnalysisPrompt(
  context: LLMContext,
  config: PromptConfig = {}
): BuiltPrompt {
  const {
    strategy = 'optimized',
    optimizationWeights = {
      capacityUtilization: 0.4,
      timelineOptimization: 0.4,
      processEfficiency: 0.2
    },
    includeExamples = true,
    includePatterns = true,
    exampleCount = 2
  } = config

  // Normalize weights to sum to 1.0
  const totalWeight = optimizationWeights.capacityUtilization + 
                      optimizationWeights.timelineOptimization + 
                      optimizationWeights.processEfficiency
  const normalizedWeights = {
    capacityUtilization: optimizationWeights.capacityUtilization / totalWeight,
    timelineOptimization: optimizationWeights.timelineOptimization / totalWeight,
    processEfficiency: optimizationWeights.processEfficiency / totalWeight
  }

  // Build system prompt based on strategy
  const systemPrompt = buildSystemPrompt(strategy, normalizedWeights, includeExamples, includePatterns, exampleCount)

  // Build user message with context
  const userMessage = buildUserMessage(context, normalizedWeights)

  return { systemPrompt, userMessage }
}

/**
 * Build system prompt
 */
function buildSystemPrompt(
  strategy: PromptStrategy,
  weights: { capacityUtilization: number; timelineOptimization: number; processEfficiency: number },
  includeExamples: boolean,
  includePatterns: boolean,
  exampleCount: number
): string {
  const basePrompt = `You are an expert operations analyst specializing in manufacturing and production operations optimization. Your role is to analyze operational data and provide intelligent task suggestions and optimizations to improve efficiency, capacity utilization, and timeline adherence.

## Your Capabilities

You analyze:
- Task status, assignments, and dependencies
- Workflow stages and bottlenecks
- Calendar events and deadlines
- Playbook execution patterns
- Team workloads and capacity
- Order statuses and requirements

## Optimization Goals (Weighted Priorities)

Your analysis should prioritize:

1. **Capacity Utilization** (${(weights.capacityUtilization * 100).toFixed(0)}% weight)
   - Balance team workloads
   - Identify underutilized resources
   - Optimize team assignments
   - Prevent overload situations

2. **Timeline Optimization** (${(weights.timelineOptimization * 100).toFixed(0)}% weight)
   - Ensure deadline adherence
   - Resolve blockers quickly
   - Optimize task scheduling
   - Manage dependencies effectively

3. **Process Efficiency** (${(weights.processEfficiency * 100).toFixed(0)}% weight)
   - Identify bottlenecks and optimization opportunities
   - Suggest process improvements based on playbook patterns
   - Recommend automation opportunities
   - Learn from historical patterns

## Output Format

**CRITICAL**: You MUST return COMPLETE, valid JSON. Ensure all arrays and objects are properly closed. Do not truncate your response.

You MUST return valid JSON matching this exact structure:

\`\`\`json
{
  "suggestions": [
    {
      "title": "Task title (clear and actionable)",
      "description": "Detailed description of what needs to be done",
      "rationale": "Your reasoning for why this task is needed (2-3 sentences)",
      "recommendedAssignees": [
        {
          "userId": "user-id",
          "reason": "Why this person is best suited"
        }
      ],
      "recommendedTeamId": "team-id",
      "suggestedDueDate": "2025-10-15T10:00:00Z",
      "priority": "critical|high|medium|low",
      "estimatedMinutes": 120,
      "tags": ["tag1", "tag2"],
      "checklist": [
        {
          "label": "Checklist item 1",
          "sequence": 0
        }
      ],
      "dependencies": [
        {
          "taskId": "task-id",
          "type": "finish_to_start"
        }
      ],
      "workflowContext": {
        "workflowId": "workflow-id",
        "workflowName": "Workflow Name",
        "stageId": "stage-id",
        "stageName": "Stage Name"
      },
      "location": "Location name",
      "contexts": [
        {
          "type": "order|workflow|calendar|task",
          "referenceId": "entity-id",
          "label": "Human-readable label",
          "role": "primary|supporting"
        }
      ],
      "confidence": 0.85,
      "expectedOutcome": "What will be achieved by completing this task",
      "highlights": [
        "Key point 1",
        "Key point 2"
      ]
    }
  ],
  "optimizations": [
    {
      "taskId": "task-id",
      "taskTitle": "Current task title",
      "action": "reschedule|reassign|reprioritize|split|merge",
      "currentValue": "Current value/state",
      "suggestedValue": "Suggested new value/state",
      "rationale": "Why this optimization improves operations (2-3 sentences)",
      "confidence": 0.80,
      "expectedImpact": "Expected improvement (e.g., 'Reduces delay by 2 days')",
      "requiresApproval": true
    }
  ],
  "analysis": {
    "totalContextItems": 150,
    "optimizationOpportunities": [
      "Opportunity description 1",
      "Opportunity description 2"
    ],
    "riskFactors": [
      "Risk description 1",
      "Risk description 2"
    ],
    "optimizationGoalWeights": {
      "capacityUtilization": ${weights.capacityUtilization},
      "timelineOptimization": ${weights.timelineOptimization},
      "processEfficiency": ${weights.processEfficiency}
    }
  }
}
\`\`\`

## Task Structure Guidelines

**IMPORTANT**: Tasks are assigned to PEOPLE, not teams directly. The team is derived from the first assignee's team membership.

1. **Assignments**:
   - MUST specify recommendedAssignees array with at least one person
   - First assignee becomes the task "owner" (requiredAck: true)
   - Additional assignees become "collaborators"
   - Team is inferred from the first assignee's teamId
   - Always include recommendedTeamId for reference (team of first assignee)

2. **Optional Fields** (include when relevant):
   - **checklist**: Suggested subtasks/checklist items (e.g., ["Prepare materials", "Test equipment"])
   - **dependencies**: Tasks this depends on (use existing task IDs from context)
   - **workflowContext**: If task relates to a workflow stage, include workflowId and stageId
   - **location**: Physical location if applicable (e.g., "Warehouse A", "Production Floor 1")
   - **tags**: Relevant tags for categorization

3. **Context Links**:
   - Link to related entities (orders, workflows, calendar events)
   - Use "primary" role for main context, "supporting" for additional context

4. **Suggestions**: Only suggest tasks that are genuinely needed and actionable. Base suggestions on:
   - Upcoming deadlines without assigned tasks
   - Workflow bottlenecks requiring intervention
   - Calendar events needing preparation
   - Patterns from playbook execution history
   - Capacity gaps or overload situations

5. **Optimizations**: Suggest optimizations for existing tasks when:
   - Deadlines are at risk
   - Team capacity is imbalanced
   - Dependencies create delays
   - Priority mismatches exist

6. **Confidence Scores**: 
   - 0.9+ = High confidence, strong data support
   - 0.7-0.9 = Medium-high confidence, good data support
   - 0.5-0.7 = Medium confidence, some uncertainty
   - <0.5 = Low confidence, should not be auto-applied

7. **Priority Assignment**:
   - Critical: Immediate deadlines, blockers, system failures
   - High: Important deadlines, high-value work
   - Medium: Standard work, normal priority
   - Low: Nice-to-have, can be deferred

8. **Equal Weighting**: All data sources (tasks, workflows, calendar, playbooks, teams, orders) are equally important. Consider all sources when making suggestions.`

  if (includeExamples && exampleCount > 0) {
    const examples = getExamples(exampleCount)
    return `${basePrompt}

## Examples

${examples}`
  }

  if (includePatterns) {
    const patterns = getPatterns()
    return `${basePrompt}

## Common Patterns

${patterns}`
  }

  if (strategy === 'minimal') {
    return `Analyze operational context and return JSON with suggestions and optimizations.
Format: {"suggestions":[],"optimizations":[],"analysis":{}}`
  }

  if (strategy === 'constrained') {
    return `Return ONLY JSON, no explanations:
{"suggestions":[],"optimizations":[],"analysis":{}}`
  }

  return basePrompt
}

/**
 * Build user message with context
 */
function buildUserMessage(
  context: LLMContext,
  weights: { capacityUtilization: number; timelineOptimization: number; processEfficiency: number }
): string {
  // Summarize context for token efficiency
  const contextSummary = summarizeContext(context)

  return `Analyze the following operational context and provide:

1. **New Task Suggestions**: Identify missing tasks needed for upcoming deadlines, workflow progression, or capacity optimization
2. **Task Optimizations**: Suggest improvements to existing tasks (reschedule, reassign, reprioritize) to improve operations

## Context Summary

${contextSummary}

## Analysis Guidelines

Based on the optimization weights:
- Capacity Utilization (${(weights.capacityUtilization * 100).toFixed(0)}%): Focus on workload balancing and resource optimization
- Timeline Optimization (${(weights.timelineOptimization * 100).toFixed(0)}%): Focus on deadline adherence and blocker resolution
- Process Efficiency (${(weights.processEfficiency * 100).toFixed(0)}%): Focus on bottleneck identification and process improvements

All data sources are equally weighted - consider tasks, workflows, calendar, playbooks, teams, and orders equally when making recommendations.

## Available Users and Teams

**IMPORTANT**: You MUST use ONLY these user IDs and team IDs when making suggestions. Do not invent or guess IDs.

Available Users:
${context.availableUsers.map(u => `- ${u.id} (${u.name}, ${u.role}, Team: ${u.teamId})`).join('\n')}

Available Teams:
${context.availableTeams.map(t => `- ${t.id} (${t.name})`).join('\n')}

When assigning tasks, use userIds from the Available Users list above. The team will be automatically inferred from the user's teamId.

Return your analysis as JSON matching the specified format.`
}

/**
 * Summarize context for prompt (token optimization)
 */
function summarizeContext(context: LLMContext): string {
  const parts: string[] = []

  // Tasks summary
  parts.push(`**Tasks:**
- Active: ${context.tasks.summary.totalActive} (${context.tasks.summary.totalBlocked} blocked)
- Upcoming: ${context.tasks.summary.totalUpcoming}
- Completion rate: ${context.tasks.summary.completionRate.toFixed(1)}%
- Recent completions: ${context.tasks.recentCompletions.length}`)

  if (context.tasks.blocked.length > 0) {
    parts.push(`- Blocked tasks: ${context.tasks.blocked.slice(0, 5).map(t => `"${t.title}"`).join(', ')}`)
  }

  // Workflows summary
  parts.push(`\n**Workflows:**
- Active workflows: ${context.workflows.summary.totalActive}
- Items in workflow: ${context.workflows.summary.totalItemsInWorkflow}
- Bottlenecks: ${context.workflows.summary.bottlenecksCount}
- Completion rate: ${context.workflows.summary.averageCompletionRate.toFixed(1)}%`)

  if (context.workflows.bottlenecks.length > 0) {
    parts.push(`- Key bottlenecks: ${context.workflows.bottlenecks.slice(0, 3).map(b => `${b.stageName} (${b.workflowName})`).join(', ')}`)
  }

  // Calendar summary
  parts.push(`\n**Calendar:**
- Upcoming events: ${context.calendar.summary.totalUpcoming}
- Critical deadlines: ${context.calendar.summary.criticalDeadlines}
- Next 7 days: ${context.calendar.summary.next7Days}
- Next 14 days: ${context.calendar.summary.next14Days}`)

  if (context.calendar.deadlines.length > 0) {
    parts.push(`- Upcoming deadlines: ${context.calendar.deadlines.slice(0, 5).map(d => `"${d.title}" (${d.date})`).join(', ')}`)
  }

  // Playbooks summary
  parts.push(`\n**Playbooks:**
- Active playbooks: ${context.playbooks.summary.totalActive}
- Total executions: ${context.playbooks.summary.totalExecutions}
- Average execution rate: ${context.playbooks.summary.averageExecutionRate.toFixed(1)}`)

  // Teams summary
  parts.push(`\n**Teams:**
- Total teams: ${context.teams.summary.totalTeams}
- Average utilization: ${context.teams.summary.averageUtilization.toFixed(1)}%
- Overloaded teams: ${context.teams.summary.overloadedTeams}
- Underutilized teams: ${context.teams.summary.underutilizedTeams}`)

  if (context.teams.teams.length > 0) {
    const overloaded = context.teams.teams.filter(t => t.utilizationRate > 90)
    const underutilized = context.teams.teams.filter(t => t.utilizationRate < 30)
    if (overloaded.length > 0) {
      parts.push(`- Overloaded: ${overloaded.map(t => `${t.teamName} (${t.utilizationRate.toFixed(0)}%)`).join(', ')}`)
    }
    if (underutilized.length > 0) {
      parts.push(`- Underutilized: ${underutilized.map(t => `${t.teamName} (${t.utilizationRate.toFixed(0)}%)`).join(', ')}`)
    }
  }

  // Orders summary
  parts.push(`\n**Orders:**
- Active orders: ${context.orders.summary.totalActive}
- Upcoming deadlines: ${context.orders.summary.upcomingDeadlines}`)

  // Recent events
  if (context.totalEvents > 0) {
    parts.push(`\n**Recent Activity:**
- Events in time window: ${context.totalEvents}`)
  }

  return parts.join('\n')
}

/**
 * Get examples for few-shot learning
 */
function getExamples(count: number): string {
  const examples = [
    {
      input: "Calendar shows deadline in 2 days, no task assigned",
      output: {
        suggestion: {
          title: "Prepare delivery documentation for Order #123",
          rationale: "Deadline approaching in 2 days. Historical pattern shows documentation takes 4 hours. Team has capacity.",
          confidence: 0.9
        }
      }
    },
    {
      input: "Workflow bottleneck at 'Cutting' stage with 15 items waiting",
      output: {
        suggestion: {
          title: "Reassign additional operator to Cutting stage",
          rationale: "15 items waiting creates delay. Beta Assembly team has capacity (65% utilization). Reassignment will reduce bottleneck.",
          confidence: 0.85
        }
      }
    },
    {
      input: "Task blocked for 3 days, blocking 5 dependent tasks",
      output: {
        optimization: {
          action: "reassign",
          rationale: "Task blocked for 3 days. Alternative assignee available with required skills. Reassignment will unblock 5 dependent tasks.",
          confidence: 0.88
        }
      }
    }
  ]

  return examples.slice(0, count).map((ex, i) => 
    `Example ${i + 1}:
Input: ${ex.input}
Output: ${JSON.stringify(ex.output, null, 2)}`
  ).join('\n\n')
}

/**
 * Get common patterns
 */
function getPatterns(): string {
  return `1. **Deadline Gaps**: When calendar shows deadline but no task exists → Suggest preparation task
2. **Bottleneck Response**: When workflow stage has >10 items waiting → Suggest capacity increase or reassignment
3. **Blocked Task Cascade**: When blocked task blocks >3 dependents → Suggest blocker resolution or task split
4. **Capacity Imbalance**: When team utilization >90% and another <50% → Suggest workload redistribution
5. **Playbook Patterns**: When playbook executes successfully → Suggest similar tasks for similar contexts
6. **Historical Timing**: When similar tasks took X hours → Use for estimation and scheduling
7. **Dependency Chains**: When task A blocks B blocks C → Optimize A priority or split dependencies`
}

