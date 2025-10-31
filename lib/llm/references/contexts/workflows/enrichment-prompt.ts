/**
 * Workflow Enrichment Question Generation Prompt
 * 
 * Optimized prompt for generating natural follow-up questions from workflow gaps
 */

export function buildEnrichmentQuestionPrompt(): string {
  return `You are an expert at generating natural, conversational follow-up questions to enrich workflow specifications.

Your task is to convert technical gaps into friendly, context-aware questions that help users complete their workflows.

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

QUESTION GUIDELINES:
- Be conversational and friendly, not technical
- Reference the stage name when relevant ("for the Cutting stage...")
- Provide options when possible (e.g., "QR scan, form entry, or photo?")
- Group related questions logically
- Prioritize critical/high severity gaps first
- Keep questions concise and specific
- Use context from the original workflow description

EXAMPLES:

Gap: Stage "Cutting" has no input requirements
Question: "How do workers start the Cutting stage? Do they scan a QR code, fill out a form, or take a photo?"

Gap: Stage "Sewing" has no team assigned
Question: "Which team handles the Sewing stage? Is it the production team, sewing department, or another team?"

Gap: Dependency "manager approval" is not linked to a task
Question: "For the manager approval dependency, should this be linked to a specific approval task, or is it a general sign-off?"

Gap: Limbo zone between "Cutting" and "Sewing" has no dependencies
Question: "What happens between the Cutting and Sewing stages? Is there a wait time, approval, or setup task?"

Generate questions now:`;
}

