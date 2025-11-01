/**
 * Task LLM Suggestion API Route
 * 
 * Uses OSS 20B model to analyze operational context and generate:
 * - New task suggestions
 * - Task optimizations (reschedule, reassign, reprioritize)
 */

import { NextRequest, NextResponse } from 'next/server'
import Together from 'together-ai'
import { collectContextForLLM, type CollectContextOptions } from '@/lib/tasks-v2/llm-analysis/contextCollector'
import { buildTaskAnalysisPrompt, type PromptConfig } from '@/lib/tasks-v2/llm-analysis/prompts'
import { processSuggestions, processOptimizations } from '@/lib/tasks-v2/llm-analysis/suggestionProcessor'
import { suggestionStore, generateContextHash } from '@/lib/tasks-v2/llm-analysis/suggestionStore'
import { MOCK_TASKS } from '@/lib/tasks-v2/mockData'

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json() as {
      timeHorizon?: number
      teamIds?: string[]
      optimizationWeights?: {
        capacityUtilization?: number
        timelineOptimization?: number
        processEfficiency?: number
      }
      strategy?: 'minimal' | 'optimized' | 'few_shot' | 'constrained'
    }

    const {
      timeHorizon = 7,
      teamIds,
      optimizationWeights,
      strategy = 'optimized'
    } = body

    console.log('🔍 Starting LLM task analysis...')
    console.log('📊 Options:', { timeHorizon, teamIds, strategy })

    // 1. Collect context from all sources
    const collectOptions: CollectContextOptions = {
      timeHorizon,
      teamIds,
    }
    const context = await collectContextForLLM(collectOptions)

    console.log('✅ Context collected:', {
      tasks: context.tasks.summary.totalActive,
      workflows: context.workflows.summary.totalActive,
      calendar: context.calendar.summary.totalUpcoming,
      teams: context.teams.summary.totalTeams,
      events: context.totalEvents
    })

    // 2. Build prompt
    const promptConfig: PromptConfig = {
      strategy,
      optimizationWeights: optimizationWeights ? {
        capacityUtilization: optimizationWeights.capacityUtilization || 0.4,
        timelineOptimization: optimizationWeights.timelineOptimization || 0.4,
        processEfficiency: optimizationWeights.processEfficiency || 0.2
      } : undefined,
      includeExamples: strategy === 'few_shot' || strategy === 'optimized',
      includePatterns: true,
      exampleCount: 2
    }

    const { systemPrompt, userMessage } = buildTaskAnalysisPrompt(context, promptConfig)

    console.log('📏 Prompt lengths:', {
      systemPrompt: systemPrompt.length,
      userMessage: userMessage.length,
      total: systemPrompt.length + userMessage.length
    })
    console.log('🤖 Using model: openai/gpt-oss-20b (20B)')

    // 3. Call LLM
    let response
    let modelUsed = 'openai/gpt-oss-20b'

    try {
      response = await together.chat.completions.create({
        model: modelUsed,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.2, // Lower temp for more consistent, analytical output
        max_tokens: 4000, // Enough for multiple suggestions and optimizations
        // Note: response_format json_object may not be supported by all models
        // We'll parse JSON from text if needed
      })
    } catch (apiError: any) {
      console.error('❌ Together.ai API Error with 20B model:', apiError)
      console.error('Error details:', {
        message: apiError?.message,
        status: apiError?.status,
        code: apiError?.code,
        model: modelUsed
      })

      // Fallback to 120B if 20B not available
      if (apiError?.message?.includes('model') || apiError?.status === 404) {
        console.log('⚠️  20B model not available, falling back to 120B model...')
        modelUsed = 'openai/gpt-oss-120b'
        try {
          response = await together.chat.completions.create({
            model: modelUsed,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: userMessage
              }
            ],
            temperature: 0.2,
            max_tokens: 4000,
            response_format: { type: 'json_object' }
          })
          console.log('✅ Fallback to 120B model succeeded')
        } catch (fallbackError: any) {
          console.error('❌ Fallback also failed:', fallbackError)
          throw fallbackError
        }
      } else {
        throw apiError
      }
    }

    // 4. Parse response
    const message = response.choices[0]?.message as any
    const content = message?.content || message?.reasoning

    if (!content) {
      console.error('❌ Empty response from LLM. Full response:', JSON.stringify(response, null, 2))
      throw new Error('No response from LLM')
    }

    console.log('📥 LLM response received, length:', content.length)

    // Extract JSON from response (may be wrapped in markdown code blocks)
    let parsed: any
    try {
      // Try to parse directly
      parsed = JSON.parse(content)
    } catch (parseError: any) {
      console.log('⚠️  Direct JSON parse failed, trying to extract JSON from response...')
      console.log('Response preview (first 500 chars):', content.substring(0, 500))
      
      // Try extracting from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || 
                        content.match(/(\{[\s\S]*\})/)
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[1])
        } catch (secondParseError: any) {
          console.error('❌ JSON extraction also failed:', secondParseError.message)
          console.error('Extracted JSON preview:', jsonMatch[1].substring(0, 500))
          throw new Error(`JSON parse error: ${secondParseError.message}. Response preview: ${content.substring(0, 200)}`)
        }
      } else {
        console.error('❌ Could not find JSON in response')
        console.error('Full response:', content)
        throw new Error('Could not extract JSON from LLM response. Response may not be valid JSON.')
      }
    }

    // Validate response structure
    if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
      parsed.suggestions = []
    }
    if (!parsed.optimizations || !Array.isArray(parsed.optimizations)) {
      parsed.optimizations = []
    }
    if (!parsed.analysis) {
      parsed.analysis = {
        totalContextItems: context.totalEvents,
        optimizationOpportunities: [],
        riskFactors: []
      }
    }

    // 5. Process suggestions and optimizations
    const existingSuggestions = suggestionStore.getPendingSuggestions()
    const processedSuggestions = processSuggestions(
      parsed.suggestions,
      MOCK_TASKS,
      existingSuggestions
    )

    const processedOptimizations = processOptimizations(
      parsed.optimizations,
      MOCK_TASKS
    )

    // 6. Store results
    const contextHash = generateContextHash(context)
    suggestionStore.storeSuggestions(processedSuggestions.map(s => s), contextHash, 60)
    suggestionStore.storeOptimizations(processedOptimizations, contextHash, 60)

    const tokensUsed = response.usage?.total_tokens || 0
    const durationMs = Date.now() - startTime

    console.log('✅ Analysis complete:', {
      suggestions: processedSuggestions.length,
      optimizations: processedOptimizations.length,
      autoApplied: processedOptimizations.filter(o => o.canAutoApply).length,
      tokens: tokensUsed,
      duration: `${durationMs}ms`,
      model: modelUsed
    })

    // 7. Return results
    return NextResponse.json({
      success: true,
      suggestions: processedSuggestions,
      optimizations: processedOptimizations,
      analysis: parsed.analysis,
      metadata: {
        model: modelUsed,
        tokensUsed,
        durationMs,
        contextCollectedAt: context.collectedAt,
        timeHorizon: context.timeHorizon,
        totalContextItems: context.totalEvents
      }
    })

  } catch (error: any) {
    console.error('❌ Error in LLM task analysis:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate task suggestions',
      suggestions: [],
      optimizations: [],
      analysis: {
        totalContextItems: 0,
        optimizationOpportunities: [],
        riskFactors: []
      }
    }, { status: 500 })
  }
}

