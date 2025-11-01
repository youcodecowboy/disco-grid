/**
 * Task LLM Suggestion Cron Endpoint
 * 
 * Scheduled execution endpoint for daily task analysis.
 * Can be triggered by external cron service or Next.js cron.
 * 
 * Usage:
 * - External cron: Call this endpoint daily at configured time
 * - Next.js cron: Configure in next.config.mjs
 */

import { NextRequest, NextResponse } from 'next/server'
import { collectContextForLLM } from '@/lib/tasks-v2/llm-analysis/contextCollector'
import { buildTaskAnalysisPrompt } from '@/lib/tasks-v2/llm-analysis/prompts'
import { generateContextHash } from '@/lib/tasks-v2/llm-analysis/suggestionStore'
import { suggestionStore } from '@/lib/tasks-v2/llm-analysis/suggestionStore'
import { processSuggestions, processOptimizations } from '@/lib/tasks-v2/llm-analysis/suggestionProcessor'
import { MOCK_TASKS } from '@/lib/tasks-v2/mockData'
import Together from 'together-ai'

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
})

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'default-secret-change-in-production'
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized'
    }, { status: 401 })
  }

  // Check if auto-run is enabled (in production, check user preferences)
  // For now, always allow auto-run
  const autoRunEnabled = true // TODO: Check user preferences

  if (!autoRunEnabled) {
    return NextResponse.json({
      success: false,
      error: 'Auto-run is disabled',
      skipped: true
    }, { status: 200 })
  }

  try {
    console.log('⏰ Cron: Starting scheduled task analysis...')

    // Collect context
    const context = await collectContextForLLM({
      timeHorizon: 7 // Default: 7 days
    })

    // Check if we can use cached snapshot
    const contextHash = generateContextHash(context)
    if (suggestionStore.isSnapshotValid(contextHash)) {
      console.log('✅ Using cached snapshot')
      return NextResponse.json({
        success: true,
        cached: true,
        message: 'Using cached suggestions'
      })
    }

    // Build prompt
    const { systemPrompt, userMessage } = buildTaskAnalysisPrompt(context, {
      strategy: 'optimized'
    })

    // Call LLM
    const response = await together.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.2,
      max_tokens: 4000
    })

    // Parse response
    const message = response.choices[0]?.message as any
    const content = message?.content || message?.reasoning

    if (!content) {
      throw new Error('No response from LLM')
    }

    // Extract JSON
    let parsed: any
    try {
      parsed = JSON.parse(content)
    } catch {
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || 
                        content.match(/(\{[\s\S]*\})/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1])
      } else {
        throw new Error('Could not extract JSON from LLM response')
      }
    }

    // Process suggestions and optimizations
    const existingSuggestions = suggestionStore.getPendingSuggestions()
    const processedSuggestions = processSuggestions(
      parsed.suggestions || [],
      MOCK_TASKS,
      existingSuggestions
    )

    const processedOptimizations = processOptimizations(
      parsed.optimizations || [],
      MOCK_TASKS
    )

    // Store results
    suggestionStore.storeSuggestions(processedSuggestions.map(s => s), contextHash, 60)
    suggestionStore.storeOptimizations(processedOptimizations, contextHash, 60)

    const stats = suggestionStore.getStats()

    console.log('✅ Cron: Analysis complete', {
      suggestions: processedSuggestions.length,
      optimizations: processedOptimizations.length,
      autoApplied: processedOptimizations.filter(o => o.canAutoApply).length
    })

    return NextResponse.json({
      success: true,
      cached: false,
      suggestions: processedSuggestions.length,
      optimizations: processedOptimizations.length,
      autoApplied: processedOptimizations.filter(o => o.canAutoApply).length,
      stats
    })

  } catch (error: any) {
    console.error('❌ Cron: Error in scheduled analysis:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to run scheduled analysis'
    }, { status: 500 })
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}

