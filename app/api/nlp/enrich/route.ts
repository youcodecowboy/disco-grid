/**
 * AI Text Enrichment API Endpoint
 * 
 * Takes user's short answer + clarification and generates
 * a comprehensive, context-rich description
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { originalText, clarification, industry } = await request.json();
    
    if (!originalText || !clarification) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Build context-specific prompt
    const prompt = buildEnrichmentPrompt(originalText, clarification, industry);
    
    // Call LLM (using Together.ai or similar)
    const enrichedText = await callLLMForEnrichment(prompt);
    
    // Parse parts (original vs AI-added)
    const parts = parseEnrichedText(originalText, enrichedText);
    
    return NextResponse.json({
      success: true,
      enrichedText,
      parts,
      originalText,
      clarification,
    });
  } catch (error) {
    console.error('Enrichment error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Build prompt for enrichment based on industry and context
 */
function buildEnrichmentPrompt(originalText: string, clarification: string, industry: string): string {
  const industryContext = {
    manufacturing: "a manufacturing business that produces physical products",
    construction: "a construction company that manages projects and builds structures",
    defense: "a defense contractor that works on government contracts",
  }[industry] || "a business";
  
  return `You are helping a user complete an onboarding form for ${industryContext}.

The user wrote: "${originalText}"

They clarified that: ${clarification}

Write a comprehensive 2-3 sentence description in FIRST PERSON that:
1. Includes their original key information
2. Adds relevant industry-specific context based on the clarification
3. Mentions typical scale, products/services, or processes that would be relevant
4. Sounds natural and professional
5. Is between 80-150 words

Only return the enriched text, no explanations or meta-commentary.`;
}

/**
 * Call LLM for enrichment
 * (Using mock for now - replace with actual API call)
 */
async function callLLMForEnrichment(prompt: string): Promise<string> {
  // Mock implementation - replace with actual LLM call
  // In production, call Together.ai, OpenAI, or similar service
  
  // For now, return a mock enriched version based on common patterns
  // This should be replaced with actual LLM API call
  
  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY || ''}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3-8b-chat-hf',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that enriches and expands user descriptions with relevant industry context.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      throw new Error('LLM API call failed');
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('LLM call failed, using fallback:', error);
    
    // Fallback: Basic template enrichment
    return generateFallbackEnrichment(prompt);
  }
}

/**
 * Fallback enrichment if LLM fails
 */
function generateFallbackEnrichment(prompt: string): string {
  // Extract original text from prompt
  const originalMatch = prompt.match(/The user wrote: "(.+?)"/);
  const clarificationMatch = prompt.match(/They clarified that: (.+)/);
  
  const original = originalMatch?.[1] || '';
  const clarification = clarificationMatch?.[1] || '';
  
  // Simple template-based enrichment
  return `${original} Specifically, we focus on ${clarification.toLowerCase()}, which allows us to serve our target market effectively. Our operations are designed to maintain high quality standards while meeting customer demand efficiently.`;
}

/**
 * Parse enriched text to identify original vs AI-added parts
 * Returns array of parts with isAI flag
 */
function parseEnrichedText(
  originalText: string,
  enrichedText: string
): Array<{ text: string; isAI: boolean }> {
  const parts: Array<{ text: string; isAI: boolean }> = [];
  
  // Simple approach: find original text in enriched text
  const originalIndex = enrichedText.toLowerCase().indexOf(originalText.toLowerCase());
  
  if (originalIndex === -1) {
    // Original not found verbatim - mark entire text as AI
    return [{ text: enrichedText, isAI: true }];
  }
  
  // Split into parts
  if (originalIndex > 0) {
    parts.push({ text: enrichedText.substring(0, originalIndex), isAI: true });
  }
  
  parts.push({
    text: enrichedText.substring(originalIndex, originalIndex + originalText.length),
    isAI: false,
  });
  
  if (originalIndex + originalText.length < enrichedText.length) {
    parts.push({
      text: enrichedText.substring(originalIndex + originalText.length),
      isAI: true,
    });
  }
  
  return parts;
}

