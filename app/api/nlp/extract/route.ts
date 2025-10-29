/**
 * NLP Entity Extraction API Route
 * 
 * Uses Together.ai's Llama-3.2-3B-Instruct-Turbo to extract structured entities
 * from natural language business descriptions.
 */

import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';
import { getPromptForContext, type ExtractionContext } from './prompts';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { text, context } = await request.json() as { text: string; context?: ExtractionContext };

    if (!text || text.length < 50) {
      return NextResponse.json({ 
        success: false, 
        error: 'Text too short (minimum 50 characters)',
        entities: [] 
      });
    }

    // Get context-specific prompt (reduces token usage by 60-80%)
    const promptConfig = getPromptForContext(context);

    // Call Llama model with context-specific prompt
    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: promptConfig.systemPrompt
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.1, // Low temperature for deterministic output
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    // Check both content and reasoning fields (some models use reasoning)
    const message = response.choices[0]?.message as any;
    const content = message?.content || message?.reasoning;
    if (!content) {
      console.error('❌ Empty response from LLM. Full response:', JSON.stringify(response, null, 2));
      throw new Error('No response from LLM');
    }

    const parsed = JSON.parse(content);
    
    // Validate and normalize entities
    const entities = (parsed.entities || []).map((entity: any) => ({
      type: entity.type,
      value: entity.value,
      confidence: Math.min(3, Math.max(1, entity.confidence)) as 1 | 2 | 3,
      rawText: entity.rawText || text.substring(0, 100),
      provenance: 'llm' as const
    }));

    return NextResponse.json({
      success: true,
      entities,
      model: 'llama-3.2-3b',
      context: context || 'general',
      entityTypes: promptConfig.entityTypes,
      usage: response.usage,
      tokensUsed: response.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('LLM extraction failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      entities: []
    }, { status: 500 });
  }
}

