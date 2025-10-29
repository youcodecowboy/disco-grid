/**
 * Component Refinement API
 * 
 * Refines existing AI-generated components based on natural language feedback.
 * Uses context-aware prompting to modify components in place.
 */

import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';
import { COMPONENT_REFINEMENT_PROMPT } from '../prompts/componentRefinement';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export async function POST(request: NextRequest) {
  console.log('🔧 [Refinement API] Request received')
  
  try {
    const { 
      refinementPrompt,
      currentComponent 
    } = await request.json();

    console.log('📝 [Refinement API] Prompt:', refinementPrompt)
    console.log('📦 [Refinement API] Current component:', currentComponent)

    // Validate inputs
    if (!refinementPrompt || typeof refinementPrompt !== 'string') {
      console.error('❌ [Refinement API] Invalid prompt')
      return NextResponse.json({
        success: false,
        error: 'Refinement prompt is required'
      }, { status: 400 });
    }

    if (!currentComponent || !currentComponent.type) {
      console.error('❌ [Refinement API] Invalid component')
      return NextResponse.json({
        success: false,
        error: 'Current component state is required'
      }, { status: 400 });
    }

    // Build context message with current component state
    const contextMessage = `CURRENT COMPONENT:
Type: ${currentComponent.type}
Title: ${currentComponent.title || 'Untitled'}
Config: ${JSON.stringify(currentComponent.config || {}, null, 2)}

USER REQUEST: ${refinementPrompt}`;

    console.log('🤖 [Refinement API] Calling LLM...')
    
    // Call LLM with refinement prompt
    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: COMPONENT_REFINEMENT_PROMPT
        },
        {
          role: "user",
          content: contextMessage
        }
      ],
      temperature: 0.2, // Lower than creation (0.3) for more precise modifications
      max_tokens: 600,
      response_format: { type: "json_object" }
    });

    console.log('✅ [Refinement API] LLM response received')

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error('❌ [Refinement API] No content in LLM response')
      throw new Error('No response from LLM');
    }

    console.log('📄 [Refinement API] Raw LLM response:', content)

    const parsed = JSON.parse(content);
    console.log('🔍 [Refinement API] Parsed response:', parsed)

    // Validate confidence
    if (parsed.confidence < 0.6) {
      return NextResponse.json({
        success: false,
        error: 'Unable to understand refinement request. Please be more specific.',
        suggestion: parsed.reasoning || 'Try: "show only January" or "change to bar chart"',
        confidence: parsed.confidence
      }, { status: 400 });
    }

    // Clean up config changes (remove null/undefined values)
    const configChanges: Record<string, any> = {};
    if (parsed.configChanges) {
      Object.entries(parsed.configChanges).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          configChanges[key] = value;
        }
      });
    }

    const result = {
      success: true,
      modificationType: parsed.modificationType,
      newComponentType: parsed.newComponentType,
      configChanges,
      newTitle: parsed.newTitle,
      reasoning: parsed.reasoning,
      confidence: parsed.confidence,
      provenance: 'llm-refinement',
      model: 'llama-3.2-3b',
      tokensUsed: response.usage?.total_tokens || 0
    };

    console.log('✨ [Refinement API] Returning success:', result)
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ [Refinement API] Exception:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

