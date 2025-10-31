/**
 * Workflow Enrichment Question Generator
 * 
 * Uses LLM to generate natural, contextual follow-up questions based on workflow gaps.
 */

import Together from 'together-ai';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export interface EnrichmentQuestion {
  id: string;
  question: string;
  type: 'input' | 'output' | 'team' | 'dependency' | 'description' | 'general';
  stageIndex?: number;
  stageName?: string;
  limboZoneIndex?: number;
  field?: string;
  options?: string[]; // For multiple choice questions
  required: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface QuestionGenerationContext {
  originalInput: string;
  workflow: {
    stages: Array<{
      name: string;
      sequence: number;
      type: string;
      description?: string;
      suggestedTeam?: string;
      suggestedInputs?: string[];
      suggestedOutputs?: string[];
    }>;
    limboZones: Array<{
      betweenStages: string[];
      dependencies?: Array<{ type: string; description: string }>;
    }>;
  };
  gaps: Array<{
    type: string;
    severity: string;
    stageIndex?: number;
    stageName?: string;
    message: string;
    suggestion?: string;
  }>;
}

/**
 * Generate natural, contextual follow-up questions from workflow gaps
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
          content: `Generate follow-up questions to enrich this workflow. Focus on the highest priority gaps first.`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      // Don't use response_format - model may return structured text
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

    // Check response structure (20B model may return content differently)
    if (!response.choices || response.choices.length === 0) {
      console.warn('⚠️ No choices in question generation response, using fallback');
      return { questions: generateFallbackQuestions(context.gaps) };
    }

    const message = response.choices[0]?.message;
    if (!message) {
      console.warn('⚠️ No message in question generation response, using fallback');
      return { questions: generateFallbackQuestions(context.gaps) };
    }

    // Check all possible content fields (same as workflow generation)
    const content = (message as any).content || (message as any).text || (message as any).message;
    if (!content) {
      console.warn('⚠️ No content in question generation response, using fallback');
      console.log('Message structure:', Object.keys(message));
      // Fallback to simple questions - this is fine, fallback works well
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
  const { originalInput, workflow, gaps } = context;

  return `You are an expert at generating natural, contextual follow-up questions to enrich workflow specifications.

CONTEXT:
Original user input: "${originalInput}"

Generated workflow has ${workflow.stages.length} stages and ${workflow.limboZones.length} limbo zones.

GAPS IDENTIFIED:
${gaps.map((gap, i) => `
${i + 1}. [${gap.severity.toUpperCase()}] ${gap.type}
   Stage: ${gap.stageName || 'N/A'}
   Issue: ${gap.message}
   Suggestion: ${gap.suggestion || 'None'}
`).join('\n')}

TASK:
Generate natural, conversational follow-up questions to fill these gaps. Prioritize critical and high-severity gaps first.

QUESTION FORMAT:
Return questions as a JSON array:
[
  {
    "question": "Natural, conversational question",
    "type": "input|output|team|dependency|description|general",
    "stageIndex": 0,
    "stageName": "Stage Name",
    "field": "suggestedInputs",
    "options": ["Option 1", "Option 2"], // Optional, for multiple choice
    "required": true,
    "priority": "critical|high|medium|low"
  }
]

RULES:
- Questions should be natural and conversational, not technical
- Group related questions together
- Provide options when possible (e.g., "QR scan, form entry, or photo?")
- Prioritize critical/high severity gaps
- Keep questions concise and specific
- Reference the stage name when relevant

EXAMPLES:

Input gap: "Stage 'Cutting' has no input requirements"
Question: "How do workers start the Cutting stage? Do they scan a QR code, fill out a form, or take a photo?"

Team gap: "Stage 'Sewing' has no team assigned"
Question: "Which team handles the Sewing stage? Is it the production team, sewing department, or another team?"

Dependency gap: "Dependency 'manager approval' is not linked"
Question: "For the manager approval dependency, should this be linked to a specific approval task, or is it a general sign-off?"

Generate questions now:`;
}

/**
 * Parse questions from LLM response
 */
function parseQuestionsFromResponse(
  content: string,
  gaps: QuestionGenerationContext['gaps']
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
        stageIndex: q.stageIndex,
        stageName: q.stageName,
        limboZoneIndex: q.limboZoneIndex,
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
function generateFallbackQuestions(gaps: QuestionGenerationContext['gaps']): EnrichmentQuestion[] {
  return gaps
    .filter(gap => gap.severity === 'critical' || gap.severity === 'high')
    .map((gap, index) => ({
      id: `fallback-${Date.now()}-${index}`,
      question: gap.suggestion || gap.message + ' Can you provide more details?',
      type: mapGapTypeToQuestionType(gap.type),
      stageIndex: gap.stageIndex,
      stageName: gap.stageName,
      ...(gap.limboZoneIndex !== undefined && { limboZoneIndex: gap.limboZoneIndex }),
      ...(gap.field && { field: gap.field }),
      options: [],
      required: gap.severity === 'critical' || gap.severity === 'high',
      priority: gap.severity as 'critical' | 'high' | 'medium' | 'low'
    }));
}

function mapGapTypeToQuestionType(gapType: string): EnrichmentQuestion['type'] {
  if (gapType.includes('input')) return 'input';
  if (gapType.includes('output')) return 'output';
  if (gapType.includes('team')) return 'team';
  if (gapType.includes('dependency')) return 'dependency';
  if (gapType.includes('description')) return 'description';
  return 'general';
}

