import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';
import { WorkflowStageV3 } from '@/lib/workflows-v3/types';
import { getRefinementPrompt, logRefinementStats, type RefinementField } from '../refinement-prompts';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { stage, question, answer, field } = await request.json();

    if (!stage || !question || !answer || !field) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    console.log(`🔍 Refining stage "${stage.name}" field "${field}" with answer: "${answer}"`);

    // Get optimized prompt for this specific field
    const promptConfig = getRefinementPrompt(field as RefinementField);
    
    // Build minimal user message (no need to send full stage data for most fields)
    const userMessage = `Question: ${question}\n\nUser's Answer: ${answer}`;

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
      temperature: 0.1, // Lower temp for more consistent extraction
      max_tokens: 500, // Much lower since we just need simple extractions
      response_format: { type: "json_object" }
    });

    // Check both content and reasoning fields (some models use reasoning)
    const message = response.choices[0]?.message as any;
    const content = message?.content || message?.reasoning;
    if (!content) {
      console.error('❌ Empty response from LLM. Full response:', JSON.stringify(response, null, 2));
      throw new Error('No response from LLM');
    }

    const tokensUsed = response.usage?.total_tokens || 0;
    const durationMs = Date.now() - startTime;
    
    console.log(`✅ LLM Refinement response received (${tokensUsed} tokens in ${durationMs}ms)`);
    
    // Log stats for optimization
    logRefinementStats(field as RefinementField, tokensUsed, durationMs);

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error('❌ Failed to parse LLM refinement response:', parseError);
      throw new Error('LLM returned invalid JSON');
    }

    // Merge the updates into the stage
    const updatedStage: WorkflowStageV3 = {
      ...stage,
      ...parsed.updates
    };

    console.log(`✅ Updated field "${field}" for stage "${stage.name}"`);

    return NextResponse.json({
      success: true,
      updatedStage,
      interpretation: parsed.interpretation,
      confidence: parsed.confidence,
      tokensUsed: response.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('❌ Stage refinement failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

