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

    // Get workflow_creation prompt (comprehensive prompt from prompts.ts)
    const promptConfig = getPromptForContext('workflow_creation');
    const systemPrompt = promptConfig.systemPrompt;

    // Construct user message with context
    let userMessage = description;
    if (context?.industry) {
      userMessage = `Industry: ${context.industry}\n\n${userMessage}`;
    }
    if (context?.clientName) {
      userMessage = `Client: ${context.clientName}\n\n${userMessage}`;
    }

    console.log('🤖 Generating workflow from:', userMessage.substring(0, 100) + '...');
    console.log('📏 System prompt length:', systemPrompt.length, 'chars');
    console.log('🤖 Using model: openai/gpt-oss-20b (20B)');

    // Call LLM with 20B model and optimized prompt
    // Note: response_format json_object may not be supported by all models
    // We'll extract JSON from the response text if needed
    let response;
    let modelUsed = "openai/gpt-oss-20b";
    
    try {
      response = await together.chat.completions.create({
        model: modelUsed,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.2,
        max_tokens: 12000, // Large workflows need lots of tokens - prioritize accuracy
        // Note: Some models may not support response_format, so we'll parse JSON from text
        // response_format: { type: "json_object" }
      });
    } catch (apiError: any) {
      console.error('❌ Together.ai API Error with 20B model:', apiError);
      console.error('Error details:', {
        message: apiError?.message,
        status: apiError?.status,
        code: apiError?.code,
        model: modelUsed
      });
      
      // If 20B model fails, try fallback to 120B (original model)
      if (apiError?.message?.includes('model') || apiError?.status === 404) {
        console.log('⚠️ 20B model not available, falling back to 120B model...');
        modelUsed = "openai/gpt-oss-120b";
        try {
          response = await together.chat.completions.create({
            model: modelUsed,
            messages: [
              {
                role: "system",
                content: systemPrompt
              },
              {
                role: "user",
                content: userMessage
              }
            ],
            temperature: 0.2,
            max_tokens: 12000, // Large workflows need lots of tokens
            response_format: { type: "json_object" }
          });
          console.log('✅ Fallback to 120B model succeeded');
        } catch (fallbackError: any) {
          console.error('❌ Fallback to 120B also failed:', fallbackError);
          throw new Error(`LLM API error: ${apiError?.message || 'Unknown error'}. Fallback also failed: ${fallbackError?.message}`);
        }
      } else {
        throw new Error(`LLM API error: ${apiError?.message || 'Unknown error'}`);
      }
    }

    console.log('📊 API Response Structure:', {
      hasChoices: !!response.choices,
      choicesLength: response.choices?.length,
      hasMessage: !!response.choices?.[0]?.message,
      messageKeys: response.choices?.[0]?.message ? Object.keys(response.choices[0].message) : [],
      finishReason: response.choices?.[0]?.finish_reason,
      tokensUsed: response.usage?.total_tokens || 0,
      responseKeys: Object.keys(response)
    });

    // Parse LLM response
    if (!response.choices || response.choices.length === 0) {
      console.error('❌ No choices in response. Full response:', JSON.stringify(response, null, 2));
      throw new Error('No choices returned from LLM');
    }

    const message = response.choices[0]?.message;
    if (!message) {
      console.error('❌ No message in response. Full response:', JSON.stringify(response, null, 2));
      throw new Error('No message returned from LLM');
    }

    // Check all possible content fields (some models use different field names)
    const content = (message as any).content || (message as any).text || (message as any).message;
    
    if (!content) {
      console.error('❌ No content found in response');
      console.error('Message object:', JSON.stringify(message, null, 2));
      console.error('Full response:', JSON.stringify(response, null, 2));
      throw new Error('No content in LLM response. Message structure: ' + JSON.stringify(message));
    }

    console.log('✅ LLM Response received:', content.substring(0, 200) + '...');
    console.log('📊 Response details:', {
      contentLength: content.length,
      finishReason: response.choices[0]?.finish_reason,
      tokensUsed: response.usage?.completion_tokens || 0,
      maxTokens: 12000
    });

    // Check if response was truncated
    if (response.choices[0]?.finish_reason === 'length') {
      console.warn('⚠️ Response was truncated (hit max_tokens limit)');
    }

    // Try to parse the LLM response
    // First try direct JSON parse, then try extracting JSON from markdown code blocks
    let parsed;
    try {
      // Try direct parse first
      parsed = JSON.parse(content);
      console.log('✅ Parsed JSON directly');
    } catch (parseError) {
      // If that fails, try extracting JSON from markdown code blocks
      console.log('⚠️ Direct parse failed, trying to extract from markdown...');
      try {
        // Try to extract JSON from markdown code blocks
        // Match: ```json\n{...}\n``` or ```\n{...}\n```
        let jsonText = content.trim();
        
        // Remove markdown code block markers (handle ```json or just ```)
        jsonText = jsonText.replace(/^```(?:json)?\s*\n?/i, '');
        jsonText = jsonText.replace(/\n?```\s*$/, '');
        jsonText = jsonText.trim();
        
        // If still not valid JSON, try to find the JSON object
        if (!jsonText.startsWith('{')) {
          const jsonObjectMatch = jsonText.match(/(\{[\s\S]*\})/);
          if (jsonObjectMatch) {
            jsonText = jsonObjectMatch[1];
          }
        }
        
        // Try to parse the extracted JSON
        parsed = JSON.parse(jsonText);
        console.log('✅ Extracted and parsed JSON from markdown code block');
      } catch (extractError: any) {
        console.error('❌ Failed to parse LLM JSON response');
        console.error('Parse error:', extractError.message);
        console.error('Original content (first 1000 chars):', content.substring(0, 1000));
        console.error('Content length:', content.length);
        console.error('Finish reason:', response.choices[0]?.finish_reason);
        
        // Check if response was truncated
        if (response.choices[0]?.finish_reason === 'length') {
          throw new Error(`LLM response was truncated (hit max_tokens limit of 12000). The JSON is incomplete. Generated ${response.usage?.completion_tokens || 0} tokens. This workflow is very complex - consider breaking it into smaller workflows or we can increase max_tokens further.`);
        }
        
        // If JSON parsing failed but we have content, show what we got
        const errorMsg = extractError.message.includes('end of JSON') 
          ? 'LLM returned incomplete JSON (possibly truncated). Response: ' + content.substring(0, 500)
          : 'LLM returned invalid JSON. Parse error: ' + extractError.message + '. Response: ' + content.substring(0, 500);
        
        throw new Error(errorMsg);
      }
    }
    
    // Validate and normalize the response
    const result = {
      success: true,
      stages: parsed.stages || [],
      limboZones: parsed.limboZones || [],
      suggestedName: parsed.suggestedName,
      suggestedIndustry: parsed.suggestedIndustry,
      model: modelUsed, // Model actually used (20B or fallback to 120B)
      tokensUsed: response.usage?.total_tokens || 0,
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0
    };

    console.log(`✅ Generated ${result.stages.length} stages and ${result.limboZones.length} limbo zones`);
    console.log(`💰 Token Usage Summary:`);
    console.log(`   Input tokens: ${result.inputTokens}`);
    console.log(`   Output tokens: ${result.outputTokens}`);
    console.log(`   Total tokens: ${result.tokensUsed}`);
    console.log(`   Cost (20B): $${((result.inputTokens / 1_000_000) * 0.05 + (result.outputTokens / 1_000_000) * 0.20).toFixed(6)}`);
    console.log(`   Cost per 1K requests: $${(((result.inputTokens / 1_000_000) * 0.05 + (result.outputTokens / 1_000_000) * 0.20) * 1000).toFixed(2)}`);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Workflow generation failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

