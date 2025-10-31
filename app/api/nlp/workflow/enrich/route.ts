/**
 * Workflow Enrichment API Route
 * 
 * Analyzes workflow for gaps and generates follow-up questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeWorkflowGaps, isWorkflowComplete, type GeneratedWorkflow } from '@/lib/llm/workflow-enrichment/gap-analyzer';
import { generateEnrichmentQuestions, type EnrichmentQuestion } from '@/lib/llm/workflow-enrichment/question-generator';

export async function POST(request: NextRequest) {
  try {
    const { workflow, originalInput } = await request.json() as {
      workflow: GeneratedWorkflow;
      originalInput: string;
    };

    if (!workflow || !workflow.stages || workflow.stages.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid workflow structure'
      }, { status: 400 });
    }

    // Analyze workflow for gaps
    const gaps = analyzeWorkflowGaps(workflow);
    
    // Check if workflow is complete
    const completeness = isWorkflowComplete(gaps, false);

    // Generate follow-up questions for gaps
    let questions: EnrichmentQuestion[] = [];
    let questionTokenUsage = { input: 0, output: 0, total: 0 };
    
    if (gaps.length > 0) {
      const questionResult = await generateEnrichmentQuestions({
        originalInput,
        workflow,
        gaps
      });
      questions = questionResult.questions;
      if (questionResult.tokenUsage) {
        questionTokenUsage = questionResult.tokenUsage;
      }
    }

    // Sort questions by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    questions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    const enrichmentCost = (questionTokenUsage.input / 1_000_000) * 0.05 + (questionTokenUsage.output / 1_000_000) * 0.20;

    return NextResponse.json({
      success: true,
      gaps,
      questions,
      completeness: {
        complete: completeness.complete,
        blockingGaps: completeness.blockingGaps.length,
        warnings: completeness.warnings.length
      },
      summary: {
        totalGaps: gaps.length,
        criticalGaps: gaps.filter(g => g.severity === 'critical').length,
        highGaps: gaps.filter(g => g.severity === 'high').length,
        mediumGaps: gaps.filter(g => g.severity === 'medium').length,
        lowGaps: gaps.filter(g => g.severity === 'low').length
      },
      tokenUsage: {
        input: questionTokenUsage.input,
        output: questionTokenUsage.output,
        total: questionTokenUsage.total,
        cost: enrichmentCost
      }
    });

  } catch (error) {
    console.error('❌ Workflow enrichment failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

