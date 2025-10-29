/**
 * LLM-Powered Component Generation API
 * 
 * Uses Together.ai's Llama-3.2-3B-Instruct-Turbo to intelligently select
 * and configure dashboard components based on natural language input.
 * 
 * Falls back to keyword matching if LLM fails.
 */

import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';
import { COMPONENT_SELECTION_PROMPT } from '../prompts/componentSelection';
import { validateComponentResponse } from './validate';
import { matchPromptToComponent } from '@/app/playground/lib/keywordMatcher';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, existingComponents, context } = await request.json();

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Prompt is required'
      }, { status: 400 });
    }

    // Try LLM first
    try {
      const response = await together.chat.completions.create({
        model: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
        messages: [
          {
            role: "system",
            content: COMPONENT_SELECTION_PROMPT
          },
          {
            role: "user",
            content: prompt.trim()
          }
        ],
        temperature: 0.3, // More creative than onboarding (0.1)
        max_tokens: 800,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from LLM');
      }

      const parsed = JSON.parse(content);

      // Validate the LLM response
      const validation = validateComponentResponse(parsed);

      if (!validation.isValid) {
        console.warn('LLM response validation failed:', validation.errors);
        throw new Error(`Invalid LLM response: ${validation.errors.join(', ')}`);
      }

      // Check confidence threshold
      if (validation.sanitized!.confidence < 0.7) {
        console.warn('LLM confidence too low:', validation.sanitized!.confidence);
        throw new Error('Low confidence, falling back to keywords');
      }

      // Success! Return LLM result
      return NextResponse.json({
        success: true,
        componentType: validation.sanitized!.componentType,
        confidence: validation.sanitized!.confidence,
        reasoning: validation.sanitized!.reasoning,
        config: validation.sanitized!.config,
        title: validation.sanitized!.title,
        size: validation.sanitized!.size,
        provenance: 'llm',
        model: 'llama-3.2-3b',
        tokensUsed: response.usage?.total_tokens || 0,
        warnings: validation.warnings
      });

    } catch (llmError) {
      console.error('LLM component generation failed, falling back to keywords:', llmError);

      // FALLBACK: Use keyword matcher
      const keywordMatch = matchPromptToComponent(prompt.trim());

      if (keywordMatch) {
        return NextResponse.json({
          success: true,
          componentType: keywordMatch.componentType,
          confidence: keywordMatch.confidence,
          reasoning: 'Keyword-based matching used as fallback',
          config: {
            dataSource: keywordMatch.dataSource,
            ...(keywordMatch.entityContext && {
              metric: keywordMatch.entityContext.action,
              timeFilter: keywordMatch.entityContext.timeContext
            })
          },
          title: keywordMatch.suggestedTitle || 'Component',
          size: keywordMatch.defaultSize,
          provenance: 'keyword-fallback',
          model: 'keyword-matcher',
          tokensUsed: 0
        });
      }

      // If even keyword matching fails, return error
      return NextResponse.json({
        success: false,
        error: 'Could not generate component from prompt. Try being more specific about what you want to visualize.'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Component generation endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

