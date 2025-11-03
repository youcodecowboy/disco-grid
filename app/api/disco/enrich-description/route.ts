/**
 * Disco Description Enrichment API Route
 * 
 * Expands short user descriptions into comprehensive workflow descriptions
 * using the LLM to meet minimum length requirements
 */

import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

const MIN_DESCRIPTION_LENGTH = 50;

export async function POST(request: NextRequest) {
  try {
    const { description, context, conversationHistory } = await request.json() as {
      description: string;
      context?: {
        industry?: string;
        currentPage?: string;
      };
      conversationHistory?: Array<{ role: string; content: string }>;
    };

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Description is required' },
        { status: 400 }
      );
    }

    // If description is already long enough, return as-is
    if (description.trim().length >= MIN_DESCRIPTION_LENGTH) {
      return NextResponse.json({
        success: true,
        enrichedDescription: description.trim(),
        wasEnriched: false,
      });
    }

    // Build enrichment prompt
    const systemPrompt = `You are helping a user create a comprehensive workflow description. The user has provided a short description that needs to be expanded into a detailed, actionable workflow description.

Guidelines:
1. Expand the description to be at least ${MIN_DESCRIPTION_LENGTH} characters
2. Add relevant details about what the workflow should accomplish
3. Include typical steps or stages that would be involved
4. Make it professional and clear
5. Keep it focused on the user's original intent
6. Do not add unnecessary details that weren't implied

Return ONLY the enriched description, no explanations or meta-commentary.`;

    const userPrompt = `User's original description: "${description.trim()}"

${context?.industry ? `Context: Industry is ${context.industry}` : ''}

Expand this into a comprehensive workflow description that is at least ${MIN_DESCRIPTION_LENGTH} characters and clearly describes what the workflow should do.`;

    // Call LLM to enrich description
    let modelUsed = 'openai/gpt-oss-120b';
    let response;

    try {
      response = await together.chat.completions.create({
        model: modelUsed,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });
    } catch (apiError: any) {
      // Fallback to 20B
      if (apiError?.message?.includes('model') || apiError?.status === 404) {
        modelUsed = 'openai/gpt-oss-20b';
        response = await together.chat.completions.create({
          model: modelUsed,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 500,
        });
      } else {
        throw apiError;
      }
    }

    const messageResponse = response.choices[0]?.message as any;
    const enrichedDescription = (messageResponse?.content || messageResponse?.reasoning || '').trim();

    if (!enrichedDescription || enrichedDescription.length < MIN_DESCRIPTION_LENGTH) {
      // Fallback: Add standard workflow language
      const fallback = `${description.trim()}. This workflow will help manage and track the process from start to finish, ensuring all necessary steps are completed efficiently and accurately.`;
      return NextResponse.json({
        success: true,
        enrichedDescription: fallback,
        wasEnriched: true,
        usedFallback: true,
      });
    }

    return NextResponse.json({
      success: true,
      enrichedDescription,
      wasEnriched: true,
      originalLength: description.trim().length,
      enrichedLength: enrichedDescription.length,
      tokensUsed: response.usage?.total_tokens || 0,
    });

  } catch (error) {
    console.error('❌ Disco Description Enrichment Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

