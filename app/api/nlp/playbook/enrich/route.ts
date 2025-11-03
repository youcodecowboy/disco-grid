/**
 * Playbook Enrichment API Route
 * 
 * Analyzes playbook for gaps and generates follow-up questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzePlaybookGaps, isPlaybookComplete, type GeneratedPlaybook } from '@/lib/playbooks/llm-enrichment/gap-analyzer';
import { generateEnrichmentQuestions, type EnrichmentQuestion } from '@/lib/playbooks/llm-enrichment/question-generator';

export async function POST(request: NextRequest) {
  try {
    const { playbook, originalInput } = await request.json() as {
      playbook: GeneratedPlaybook;
      originalInput: string;
    };

    if (!playbook || !playbook.plays || playbook.plays.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid playbook structure'
      }, { status: 400 });
    }

    // Analyze playbook for gaps
    const gaps = analyzePlaybookGaps(playbook);
    
    // Check if playbook is complete
    const completeness = isPlaybookComplete(gaps, false);

    // Generate follow-up questions for gaps
    let questions: EnrichmentQuestion[] = [];
    let questionTokenUsage = { input: 0, output: 0, total: 0 };
    
    if (gaps.length > 0) {
      const questionResult = await generateEnrichmentQuestions({
        originalInput,
        playbook,
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
    console.error('❌ Playbook enrichment failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

