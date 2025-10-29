/**
 * Gap Analysis Test API
 * 
 * Analyzes a contract and returns missing required fields + generated questions
 */

import { NextRequest, NextResponse } from 'next/server';
import type { GenerationContractV1 } from '@/app/onboarding-v2/types.contract';
import { analyzeContractCompleteness, generateGapFillingQuestions } from '@/app/onboarding-v2/lib/contract-completeness';

export async function POST(request: NextRequest) {
  try {
    const { contract } = await request.json() as { contract: Partial<GenerationContractV1> };

    if (!contract) {
      return NextResponse.json({ 
        success: false, 
        error: 'Contract is required' 
      }, { status: 400 });
    }

    // Analyze completeness
    const completeness = analyzeContractCompleteness(contract as GenerationContractV1);
    
    // Generate gap-filling questions
    const gapQuestions = generateGapFillingQuestions(completeness.missingRequired);
    
    return NextResponse.json({
      success: true,
      analysis: {
        overallComplete: completeness.overallComplete,
        percentComplete: completeness.percentComplete,
        totalRequired: completeness.requiredFields.length,
        satisfiedRequired: completeness.requiredFields.filter(f => f.satisfied).length,
        missingCount: completeness.missingRequired.length,
      },
      missingFields: completeness.missingRequired.map(f => ({
        path: f.path,
        description: f.description,
        currentValue: f.value,
      })),
      generatedQuestions: gapQuestions,
      lowConfidenceFields: completeness.lowConfidenceFields.map(f => ({
        path: f.path,
        description: f.description,
        value: f.value,
        confidence: f.confidence,
      })),
    });

  } catch (error) {
    console.error('Gap analysis failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

