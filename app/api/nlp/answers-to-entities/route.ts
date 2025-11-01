/**
 * Convert Follow-Up Answers to Entities API
 * 
 * Takes user answers to follow-up questions and converts them
 * into structured EntityExtraction objects for the contract
 */

import { NextRequest, NextResponse } from 'next/server';
import type { EntityExtraction } from '@/app/onboarding-v2/lib/nlp.intents';

export async function POST(request: NextRequest) {
  try {
    const { answers, questions, industry } = await request.json();

    if (!answers || !questions) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert each answer into an entity
    const entities: EntityExtraction[] = [];

    for (const answer of answers) {
      const question = questions.find((q: any) => q.id === answer.questionId);
      if (!question) continue;

      // Create entity based on question type
      const entity = answerToEntity(answer, question, industry);
      if (entity) {
        entities.push(entity);
      }
    }

    return NextResponse.json({
      success: true,
      entities,
    });
  } catch (error) {
    console.error('Answer conversion error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Convert a single answer to an entity
 */
function answerToEntity(
  answer: any,
  question: any,
  industry: string
): EntityExtraction | null {
  const { questionId, answer: value, isOther } = answer;

  // Map question IDs to entity types
  const entityTypeMap: { [key: string]: string } = {
    'product_types': 'product_category',
    'shifts': 'shifts',
    'production_model': 'ops_model',
    'subcontractors': 'subcontractor_usage',
    'subcontractor_stages': 'subcontractor_stage',
    'subcontractor_trades': 'subcontractor_trade',
    'components': 'component_usage',
    'component_tracking': 'tracking_level',
    'garment_variants': 'variant_type',
    'project_types': 'project_type',
    'contract_types': 'contract_type',
    'clearance_levels': 'clearance_level',
  };

  const entityType = entityTypeMap[questionId] || question.entityType;

  // Format the value based on whether it's multi-select
  let formattedValue: any = value;
  let displayText: string;

  if (Array.isArray(value)) {
    // Multi-select - join with commas
    formattedValue = value;
    displayText = value.map((v: string) => {
      const option = question.options?.find((o: any) => o.value === v);
      return option?.label || v;
    }).join(', ');
  } else {
    // Single select
    const option = question.options?.find((o: any) => o.value === value);
    displayText = option?.label || value;
    formattedValue = value;
  }

  return {
    type: entityType,
    value: formattedValue,
    rawText: displayText,
    confidence: isOther ? 2 : 3, // User-selected = high confidence
    provenance: 'user_input',
  };
}







