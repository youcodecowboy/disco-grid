/**
 * Playbook Refinement API Route
 * 
 * Accepts natural language instructions to modify existing playbooks
 */

import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';
import { getPromptForContext } from '../../extract/prompts';
import type { Playbook } from '@/lib/playbooks/types';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { playbook, instruction } = await request.json() as { 
      playbook: Playbook;
      instruction: string;
    };

    if (!playbook || !instruction || instruction.trim().length < 10) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid playbook or instruction too short (minimum 10 characters)',
      }, { status: 400 });
    }

    // Get playbook_refinement prompt
    const promptConfig = getPromptForContext('playbook_refinement');
    const systemPrompt = promptConfig.systemPrompt;

    // Build context message with current playbook state
    const playbookContext = JSON.stringify({
      name: playbook.name,
      description: playbook.description,
      plays: playbook.plays.map(p => ({
        id: p.id,
        sequence: p.sequence,
        title: p.title,
        description: p.description,
        trigger: p.trigger,
        taskTemplate: p.taskTemplate,
        assignment: p.assignment,
        dependencies: p.dependencies
      }))
    }, null, 2);

    const userMessage = `Current Playbook State:
${playbookContext}

User Instruction: ${instruction.trim()}

Analyze the instruction and provide modifications to the playbook.`;

    console.log('🔧 Refining playbook:', playbook.name);
    console.log('📝 Instruction:', instruction.substring(0, 100) + '...');

    // Call LLM
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
        max_tokens: 4000,
      });
    } catch (apiError: any) {
      console.error('❌ Together.ai API Error with 20B model:', apiError);
      // Fallback to 120B if needed
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
            max_tokens: 4000,
            response_format: { type: "json_object" }
          });
        } catch (fallbackError: any) {
          throw new Error(`LLM API error: ${apiError?.message || 'Unknown error'}`);
        }
      } else {
        throw new Error(`LLM API error: ${apiError?.message || 'Unknown error'}`);
      }
    }

    // Parse response
    if (!response.choices || response.choices.length === 0) {
      throw new Error('No choices returned from LLM');
    }

    const message = response.choices[0]?.message;
    const content = (message as any).content || (message as any).text || (message as any).message;
    
    if (!content) {
      throw new Error('No content in LLM response');
    }

    console.log('✅ LLM Refinement response received:', content.substring(0, 200) + '...');

    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      // Try extracting from markdown
      let jsonText = content.trim();
      jsonText = jsonText.replace(/^```(?:json)?\s*\n?/i, '');
      jsonText = jsonText.replace(/\n?```\s*$/, '');
      jsonText = jsonText.trim();
      
      const jsonMatch = jsonText.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
      
      parsed = JSON.parse(jsonText);
    }

    const result = {
      success: true,
      operations: parsed.operations || [],
      summary: parsed.summary || 'No changes',
      model: modelUsed,
      tokensUsed: response.usage?.total_tokens || 0,
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0
    };

    console.log(`✅ Generated ${result.operations.length} operations`);
    console.log(`📋 Summary: ${result.summary}`);
    result.operations.forEach((op: any, idx: number) => {
      console.log(`  Operation ${idx + 1}: ${op.action}${op.playTitle ? ` - "${op.playTitle}"` : op.playId ? ` - ID: ${op.playId}` : ''}`);
      if (op.reasoning) {
        console.log(`    Reasoning: ${op.reasoning.substring(0, 100)}...`);
      }
    });
    console.log(`💰 Token Usage: ${result.tokensUsed} tokens`);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Playbook refinement failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

