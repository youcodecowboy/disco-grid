/**
 * Disco Chat API Route
 * 
 * Main chat endpoint using 120B OSS model on Together.ai
 */

import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';
import { DISCO_SYSTEM_PROMPT } from '@/lib/disco/prompts';
import type { DiscoChatResponse, DiscoSystemContext } from '@/lib/disco/types';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { message, context, conversationHistory } = await request.json() as {
      message: string;
      context: DiscoSystemContext;
      conversationHistory: Array<{ role: string; content: string }>;
    };

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build messages array for the LLM
    const messages: Array<{ role: string; content: string }> = [
      {
        role: 'system',
        content: `${DISCO_SYSTEM_PROMPT}\n\nCurrent Page: ${context.currentPage}\nAvailable Actions: ${context.availableActions.join(', ')}`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    console.log('🤖 Disco Chat Request:', {
      messageLength: message.length,
      conversationHistoryLength: conversationHistory.length,
      currentPage: context.currentPage,
    });

    // Call 120B model
    let modelUsed = 'openai/gpt-oss-120b';
    let response;

    try {
      response = await together.chat.completions.create({
        model: modelUsed,
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });
    } catch (apiError: any) {
      console.error('❌ Together.ai API Error with 120B model:', apiError);
      
      // Fallback to 20B if 120B unavailable
      if (apiError?.message?.includes('model') || apiError?.status === 404) {
        console.log('⚠️ 120B model not available, falling back to 20B model...');
        modelUsed = 'openai/gpt-oss-20b';
        
        try {
          response = await together.chat.completions.create({
            model: modelUsed,
            messages: messages as any,
            temperature: 0.7,
            max_tokens: 4000,
            // Note: 20B may not support response_format json_object
          });
          console.log('✅ Fallback to 20B model succeeded');
        } catch (fallbackError: any) {
          console.error('❌ Fallback also failed:', fallbackError);
          throw new Error(`LLM API error: ${apiError?.message || 'Unknown error'}. Fallback also failed: ${fallbackError?.message}`);
        }
      } else {
        throw new Error(`LLM API error: ${apiError?.message || 'Unknown error'}`);
      }
    }

    // Parse response
    const messageResponse = response.choices[0]?.message as any;
    const content = messageResponse?.content || messageResponse?.reasoning;

    if (!content) {
      console.error('❌ Empty response from LLM. Full response:', JSON.stringify(response, null, 2));
      throw new Error('No response from LLM');
    }

    // Parse JSON response
    let chatResponse: DiscoChatResponse;
    try {
      chatResponse = JSON.parse(content);
    } catch (parseError) {
      // If parsing fails, treat as plain text
      console.warn('⚠️ Failed to parse JSON response, treating as plain text');
      chatResponse = {
        text: content,
      };
    }

    // Validate response structure
    if (!chatResponse.text) {
      chatResponse.text = content; // Fallback to full content
    }

    // Check if description is too short for workflow creation
    if (chatResponse.action === 'create_workflow') {
      const description = chatResponse.actionParams?.description || chatResponse.actionParams?.initialDescription || '';
      if (description.length < 50) {
        // Replace action with clarification request
        chatResponse.action = 'ask_clarification';
        chatResponse.needsClarification = true;
        chatResponse.clarificationQuestions = [
          'What type of workflow are you looking to create?',
          'What industry or business context is this for?',
          'What are the main steps or stages you want to include?',
        ];
        chatResponse.text = chatResponse.text || "I'd be happy to help you create a workflow! To create the best workflow for you, I need a bit more information. Could you tell me more about what you're trying to accomplish?";
      }
    }

    // Check if description is too short for playbook creation
    if (chatResponse.action === 'create_playbook') {
      const description = chatResponse.actionParams?.description || chatResponse.actionParams?.initialDescription || '';
      if (description.length < 50) {
        // Replace action with clarification request
        chatResponse.action = 'ask_clarification';
        chatResponse.needsClarification = true;
        chatResponse.clarificationQuestions = [
          'What type of automation are you looking to create?',
          'What triggers should start this automation?',
          'What tasks or actions should be performed?',
        ];
        chatResponse.text = chatResponse.text || "I'd be happy to help you create a playbook! To create the best automation for you, I need a bit more information. Could you tell me more about what you're trying to automate?";
      }
    }

    console.log('✅ Disco Chat Response:', {
      model: modelUsed,
      hasAction: !!chatResponse.action,
      action: chatResponse.action,
      needsClarification: chatResponse.needsClarification,
      tokensUsed: response.usage?.total_tokens || 0,
    });

    return NextResponse.json(chatResponse);

  } catch (error) {
    console.error('❌ Disco Chat Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        text: 'Sorry, I encountered an error. Please try again.',
      },
      { status: 500 }
    );
  }
}

