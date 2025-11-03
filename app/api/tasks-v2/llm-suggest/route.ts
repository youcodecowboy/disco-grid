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
import crypto from 'crypto'

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
})

// Cache for LLM responses (in-memory, in production use Redis or similar)
const responseCache = new Map<string, {
  data: any
  expiresAt: number
}>()

// Cache TTL: 1 hour for same context
const CACHE_TTL_MS = 60 * 60 * 1000

function generateCacheKey(context: any, teamIds?: string[]): string {
  // Create a hash of the context to detect changes
  const contextStr = JSON.stringify({
    timeHorizon: context.timeHorizon,
    totalEvents: context.totalEvents,
    tasks: {
      totalActive: context.tasks.summary.totalActive,
      totalBlocked: context.tasks.summary.totalBlocked,
    },
    teams: context.teams.teams.map(t => ({ id: t.teamId, utilization: Math.round(t.utilizationRate) })),
    calendar: {
      totalUpcoming: context.calendar.summary.totalUpcoming,
      criticalDeadlines: context.calendar.summary.criticalDeadlines,
    },
    teamIds: teamIds?.sort().join(',') || 'all'
  })
  return crypto.createHash('md5').update(contextStr).digest('hex')
}

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

    // Check cache first
    const cacheKey = generateCacheKey(context, teamIds)
    const cached = responseCache.get(cacheKey)
    if (cached && cached.expiresAt > Date.now()) {
      console.log('💾 Returning cached LLM response')
      return NextResponse.json({
        success: true,
        suggestions: cached.data.suggestions,
        optimizations: cached.data.optimizations,
        analysis: cached.data.analysis,
        metadata: {
          ...cached.data.metadata,
          cached: true,
          contextCollectedAt: context.collectedAt
        }
      })
    }

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
        max_tokens: 6000, // Increased for complete JSON responses
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
            max_tokens: 6000, // Increased for complete JSON responses
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

    // Extract JSON from response (may be wrapped in markdown code blocks or truncated)
    let parsed: any
    try {
      // Try to parse directly
      parsed = JSON.parse(content)
    } catch (parseError: any) {
      console.log('⚠️  Direct JSON parse failed, trying to extract JSON from response...')
      console.log('Response preview (first 1000 chars):', content.substring(0, 1000))
      console.log('Response length:', content.length)
      
      // Try extracting from markdown code blocks first
      let jsonContent = content
      const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?)\s*```/)
      if (codeBlockMatch) {
        jsonContent = codeBlockMatch[1]
      } else {
        // Try to find JSON object in the content
        const jsonMatch = content.match(/(\{[\s\S]*)/)
        if (jsonMatch) {
          jsonContent = jsonMatch[1]
        }
      }
      
      // Try to fix common JSON issues (truncated arrays, unclosed objects)
      let fixedJson = jsonContent
      
      // If JSON appears truncated, try to close it properly
      if (!fixedJson.trim().endsWith('}')) {
        // Count open braces
        const openBraces = (fixedJson.match(/\{/g) || []).length
        const closeBraces = (fixedJson.match(/\}/g) || []).length
        const openBrackets = (fixedJson.match(/\[/g) || []).length
        const closeBrackets = (fixedJson.match(/\]/g) || []).length
        
        // Close arrays first
        for (let i = closeBrackets; i < openBrackets; i++) {
          fixedJson += ']'
        }
        
        // Close objects
        for (let i = closeBraces; i < openBraces; i++) {
          fixedJson += '}'
        }
      }
      
      try {
        parsed = JSON.parse(fixedJson)
        console.log('✅ Successfully parsed fixed JSON')
      } catch (secondParseError: any) {
        console.error('❌ JSON extraction/fixing also failed:', secondParseError.message)
        console.error('Error position:', secondParseError.message.match(/position (\d+)/)?.[1])
        
        // Try to extract what we can - find complete suggestion objects
        try {
          // Find the suggestions array and extract complete objects
          const suggestionsStart = jsonContent.indexOf('"suggestions"')
          if (suggestionsStart !== -1) {
            const afterSuggestions = jsonContent.substring(suggestionsStart)
            const arrayStart = afterSuggestions.indexOf('[')
            if (arrayStart !== -1) {
              let braceCount = 0
              let bracketCount = 1 // We're already inside the array
              let currentPos = arrayStart + 1
              const validSuggestions = []
              let currentSuggestion = ''
              
              while (currentPos < afterSuggestions.length) {
                const char = afterSuggestions[currentPos]
                
                if (char === '{') {
                  if (braceCount === 0 && currentSuggestion.trim()) {
                    // Starting a new object, save previous if valid
                    const prevSuggestion = currentSuggestion.trim().replace(/,\s*$/, '')
                    if (prevSuggestion.startsWith('{')) {
                      try {
                        const suggestion = JSON.parse(prevSuggestion)
                        validSuggestions.push(suggestion)
                      } catch {
                        // Not valid JSON, continue
                      }
                    }
                    currentSuggestion = ''
                  }
                  currentSuggestion += char
                  braceCount++
                } else if (char === '}') {
                  currentSuggestion += char
                  braceCount--
                  
                  // If we've closed a complete suggestion object
                  if (braceCount === 0 && currentSuggestion.trim().startsWith('{')) {
                    try {
                      const suggestion = JSON.parse(currentSuggestion.trim())
                      validSuggestions.push(suggestion)
                      currentSuggestion = ''
                    } catch {
                      // Not valid JSON, continue
                    }
                  }
                } else {
                  currentSuggestion += char
                  if (char === '[') bracketCount++
                  if (char === ']') bracketCount--
                }
                
                // If we've closed the array, stop
                if (bracketCount === 0) break
                
                currentPos++
              }
              
              // Check if there's a final suggestion that wasn't closed
              if (currentSuggestion.trim().startsWith('{') && braceCount === 0) {
                const finalSuggestion = currentSuggestion.trim().replace(/,\s*$/, '')
                try {
                  const suggestion = JSON.parse(finalSuggestion)
                  validSuggestions.push(suggestion)
                } catch {
                  // Not valid JSON, skip
                }
              }
              
              if (validSuggestions.length > 0) {
                parsed = {
                  suggestions: validSuggestions,
                  optimizations: [],
                  analysis: {
                    totalContextItems: context.totalEvents,
                    optimizationOpportunities: [],
                    riskFactors: []
                  }
                }
                console.log(`✅ Extracted ${validSuggestions.length} valid suggestions from partial response`)
              } else {
                throw secondParseError
              }
            } else {
              throw secondParseError
            }
          } else {
            throw secondParseError
          }
        } catch (recoveryError: any) {
          console.error('❌ Could not recover partial JSON')
          console.error('Extracted JSON preview (last 500 chars):', fixedJson.substring(Math.max(0, fixedJson.length - 500)))
          throw new Error(`JSON parse error: ${secondParseError.message}. Response may be truncated. Length: ${content.length} chars.`)
        }
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

    // 6. Store results and cache
    const contextHash = generateContextHash(context)
    suggestionStore.storeSuggestions(processedSuggestions.map(s => s), contextHash, 60)
    suggestionStore.storeOptimizations(processedOptimizations, contextHash, 60)

    // Cache the response
    responseCache.set(cacheKey, {
      data: {
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
      },
      expiresAt: Date.now() + CACHE_TTL_MS
    })

    // Clean up old cache entries (keep last 50)
    if (responseCache.size > 50) {
      const entries = Array.from(responseCache.entries())
      entries.sort((a, b) => b[1].expiresAt - a[1].expiresAt)
      responseCache.clear()
      entries.slice(0, 50).forEach(([key, value]) => responseCache.set(key, value))
    }

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

