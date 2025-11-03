/**
 * Playbook Enrichment Question Generator
 * 
 * Uses LLM to generate natural, contextual follow-up questions based on playbook gaps.
 */

import Together from 'together-ai';
import type { PlaybookGap } from './gap-analyzer';
import type { Play } from '../types';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export interface EnrichmentQuestion {
  id: string;
  question: string;
  type: 'trigger' | 'assignment' | 'task' | 'dependency' | 'general';
  playIndex?: number;
  playTitle?: string;
  playId?: string;
  field?: string;
  options?: string[]; // For multiple choice questions
  required: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface QuestionGenerationContext {
  originalInput: string;
  playbook: {
    suggestedName?: string;
    suggestedDescription?: string;
    plays: Play[];
  };
  gaps: PlaybookGap[];
}

/**
 * Generate natural, contextual follow-up questions from playbook gaps
 */
export async function generateEnrichmentQuestions(
  context: QuestionGenerationContext
): Promise<{ questions: EnrichmentQuestion[]; tokenUsage?: { input: number; output: number; total: number } }> {
  const prompt = buildQuestionGenerationPrompt(context);

  try {
    const response = await together.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: prompt
        },
        {
          role: "user",
          content: `Generate follow-up questions to enrich this playbook. Focus on the highest priority gaps first.`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const tokenUsage = {
      input: response.usage?.prompt_tokens || 0,
      output: response.usage?.completion_tokens || 0,
      total: response.usage?.total_tokens || 0
    };

    console.log('💰 Question generation token usage:', tokenUsage);
    console.log(`   Cost: $${((tokenUsage.input / 1_000_000) * 0.05 + (tokenUsage.output / 1_000_000) * 0.20).toFixed(6)}`);

    console.log('📊 Question generation response:', {
      hasChoices: !!response.choices,
      choicesLength: response.choices?.length,
      hasMessage: !!response.choices?.[0]?.message,
      messageKeys: response.choices?.[0]?.message ? Object.keys(response.choices[0].message) : []
    });

    // Check response structure
    if (!response.choices || response.choices.length === 0) {
      console.warn('⚠️ No choices in question generation response, using fallback');
      return { questions: generateFallbackQuestions(context.gaps) };
    }

    const message = response.choices[0]?.message;
    if (!message) {
      console.warn('⚠️ No message in question generation response, using fallback');
      return { questions: generateFallbackQuestions(context.gaps) };
    }

    const content = (message as any).content || (message as any).text || (message as any).message;
    if (!content) {
      console.warn('⚠️ No content in question generation response, using fallback');
      return { questions: generateFallbackQuestions(context.gaps) };
    }

    console.log('✅ Question generation content received:', content.substring(0, 200) + '...');

    // Parse questions from response
    const questions = parseQuestionsFromResponse(content, context.gaps);
    
    return { questions, tokenUsage };
  } catch (error) {
    console.error('❌ Question generation failed:', error);
    // Fallback to simple questions based on gaps (no token cost)
    return { questions: generateFallbackQuestions(context.gaps) };
  }
}

/**
 * Build prompt for question generation
 */
function buildQuestionGenerationPrompt(context: QuestionGenerationContext): string {
  const { originalInput, playbook, gaps } = context;

  return `You are an expert at generating natural, contextual follow-up questions to enrich playbook automation specifications.

CONTEXT:
Original user input: "${originalInput}"

Generated playbook "${playbook.suggestedName || 'Untitled'}" has ${playbook.plays.length} plays.

GAPS IDENTIFIED:
${gaps.map((gap, i) => `
${i + 1}. [${gap.severity.toUpperCase()}] ${gap.type}
   Play: ${gap.playTitle || 'N/A'}
   Issue: ${gap.message}
   Suggestion: ${gap.suggestion || 'None'}
${gap.context ? `   Context: ${JSON.stringify(gap.context)}` : ''}
`).join('\n')}

TASK:
Generate natural, conversational follow-up questions to fill these gaps. Prioritize critical and high-severity gaps first.

QUESTION FORMAT:
Return questions as a JSON array:
[
  {
    "question": "Natural, conversational question",
    "type": "trigger|assignment|task|dependency|general",
    "playIndex": 0,
    "playTitle": "Play Title",
    "playId": "play-id",
    "field": "trigger.workflowId",
    "options": ["Option 1", "Option 2"], // Optional, for multiple choice
    "required": true,
    "priority": "critical|high|medium|low"
  }
]

RULES:
- Questions should be natural and conversational, not technical
- Group related questions together
- Provide options when possible (e.g., "Procurement team, Technical team, or another team?")
- Prioritize critical/high severity gaps
- Keep questions concise and specific
- Reference the play title when relevant
- Use context from gaps to make questions more specific

EXAMPLES:

Workflow ID gap: "Play 'Order fabric' references workflow 'Cut & Sew' but workflow ID is missing"
Question: "Which workflow should trigger the 'Order fabric' play? Is it the 'Cut & Sew Apparel' workflow, or another workflow?"

Team ID gap: "Play 'Order fabric' is assigned to team 'Procurement' but team ID is missing"
Question: "Which team should be assigned to 'Order fabric'? Is it the Procurement team, or another team?"

Role ID gap: "Play 'Finalize pattern' is assigned to role 'Pattern Maker' but role ID is missing"
Question: "Which role should be assigned to 'Finalize pattern'? Is it the Pattern Maker role, or another role?"

Task completion trigger gap: "Play 'Print patterns' uses task completion trigger but task identifier is missing"
Question: "Which task should trigger 'Print patterns'? Should it trigger when a specific task completes?"

Generate questions now:`;
}

/**
 * Parse questions from LLM response
 */
function parseQuestionsFromResponse(
  content: string,
  gaps: PlaybookGap[]
): EnrichmentQuestion[] {
  try {
    // Try to extract JSON from markdown code blocks
    let jsonText = content.trim();
    jsonText = jsonText.replace(/^```(?:json)?\s*\n?/i, '');
    jsonText = jsonText.replace(/\n?```\s*$/, '');
    jsonText = jsonText.trim();

    // Try to find JSON array
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonText);
    
    if (Array.isArray(parsed)) {
      return parsed.map((q: any, index: number) => ({
        id: `q-${Date.now()}-${index}`,
        question: q.question || q.text || '',
        type: q.type || 'general',
        playIndex: q.playIndex,
        playTitle: q.playTitle,
        playId: q.playId,
        field: q.field,
        options: q.options || [],
        required: q.required !== false,
        priority: q.priority || 'medium'
      })).filter((q: EnrichmentQuestion) => q.question.length > 0);
    }
  } catch (error) {
    console.error('Failed to parse questions from LLM response:', error);
  }

  // Fallback to simple questions
  return generateFallbackQuestions(gaps);
}

/**
 * Generate simple fallback questions when LLM fails
 */
function generateFallbackQuestions(gaps: PlaybookGap[]): EnrichmentQuestion[] {
  return gaps
    .filter(gap => gap.severity === 'critical' || gap.severity === 'high')
    .map((gap, index) => ({
      id: `fallback-${Date.now()}-${index}`,
      question: gap.suggestion || gap.message + ' Can you provide more details?',
      type: mapGapTypeToQuestionType(gap.type),
      playIndex: gap.playIndex,
      playTitle: gap.playTitle,
      playId: gap.playId,
      ...(gap.field && { field: gap.field }),
      options: [],
      required: gap.severity === 'critical' || gap.severity === 'high',
      priority: gap.severity as 'critical' | 'high' | 'medium' | 'low'
    }));
}

function mapGapTypeToQuestionType(gapType: string): EnrichmentQuestion['type'] {
  if (gapType.includes('trigger')) return 'trigger';
  if (gapType.includes('assignment')) return 'assignment';
  if (gapType.includes('task')) return 'task';
  if (gapType.includes('dependency')) return 'dependency';
  return 'general';
}

