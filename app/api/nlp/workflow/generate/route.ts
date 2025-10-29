/**
 * Workflow Generation API Route
 * 
 * Uses LLM to generate workflow stages from natural language description
 */

import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';
import { getPromptForContext } from '../../extract/prompts';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { description, context } = await request.json() as { 
      description: string;
      context?: { industry?: string; clientName?: string }
    };

    if (!description || description.length < 50) {
      return NextResponse.json({ 
        success: false, 
        error: 'Description too short (minimum 50 characters)',
      }, { status: 400 });
    }

    // Get workflow_creation prompt
    const promptConfig = getPromptForContext('workflow_creation');

    // Construct user message with context
    let userMessage = description;
    if (context?.industry) {
      userMessage = `Industry: ${context.industry}\n\n${userMessage}`;
    }
    if (context?.clientName) {
      userMessage = `Client: ${context.clientName}\n\n${userMessage}`;
    }

    console.log('🤖 Generating workflow from:', userMessage.substring(0, 100) + '...');
    console.log('📏 System prompt length:', promptConfig.systemPrompt.length, 'chars');

    // Call LLM with workflow_creation prompt
    const response = await together.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: promptConfig.systemPrompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.2,
      max_tokens: 4000, // Increased for complex workflows
      response_format: { type: "json_object" }
    });

    console.log('📊 API Response:', {
      hasChoices: !!response.choices,
      choicesLength: response.choices?.length,
      hasMessage: !!response.choices?.[0]?.message,
      hasContent: !!response.choices?.[0]?.message?.content,
      hasReasoning: !!response.choices?.[0]?.message?.reasoning,
      finishReason: response.choices?.[0]?.finish_reason
    });

    // Parse LLM response - check both content and reasoning fields
    const message = response.choices[0]?.message as any;
    const content = message?.content || message?.reasoning;
    if (!content) {
      console.error('❌ Empty response from LLM. Full response:', JSON.stringify(response, null, 2));
      throw new Error('No response from LLM');
    }

    console.log('✅ LLM Response received:', content.substring(0, 200) + '...');

    // Try to parse the LLM response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error('❌ Failed to parse LLM JSON response:', parseError);
      console.error('Content that failed to parse:', content);
      throw new Error('LLM returned invalid JSON. This may be due to special characters or malformed response.');
    }
    
    // Validate and normalize the response
    const result = {
      success: true,
      stages: parsed.stages || [],
      limboZones: parsed.limboZones || [],
      suggestedName: parsed.suggestedName,
      suggestedIndustry: parsed.suggestedIndustry,
      model: 'gpt-oss-120b',
      tokensUsed: response.usage?.total_tokens || 0
    };

    console.log(`✅ Generated ${result.stages.length} stages and ${result.limboZones.length} limbo zones`);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Workflow generation failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

