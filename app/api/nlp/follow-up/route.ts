/**
 * Dynamic Follow-Up Questions API
 * 
 * Analyzes extracted entities and generates intelligent follow-up questions
 * to collect additional information and enrich the onboarding contract
 */

import { NextRequest, NextResponse } from 'next/server';
import type { EntityExtraction } from '@/app/onboarding-v2/lib/nlp.intents';

interface FollowUpQuestion {
  id: string;
  question: string;
  entityType: string;
  options: Array<{
    value: string;
    label: string;
    emoji?: string;
  }>;
  allowOther: boolean;
  multiSelect?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { entities, industry, previousAnswers, triggeredBy } = await request.json();

    if (!entities || !industry) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate follow-up questions based on what's missing or vague
    const questions = generateFollowUpQuestions(
      entities,
      industry,
      previousAnswers || [],
      triggeredBy
    );

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error('Follow-up generation error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Generate follow-up questions based on extracted entities and industry
 */
function generateFollowUpQuestions(
  entities: EntityExtraction[],
  industry: string,
  previousAnswers: any[],
  triggeredBy?: string
): FollowUpQuestion[] {
  const questions: FollowUpQuestion[] = [];
  const answeredQuestions = new Set(previousAnswers.map((a: any) => a.questionId));

  // If this was triggered by a specific answer, generate conditional follow-ups
  if (triggeredBy) {
    const triggerAnswer = previousAnswers.find((a: any) => a.questionId === triggeredBy);
    if (triggerAnswer) {
      const conditionalQuestions = generateConditionalQuestions(
        triggerAnswer,
        industry,
        entities
      );
      return conditionalQuestions;
    }
  }

  // Check what entities we have
  const hasProduct = entities.some(e => e.type === 'product');
  const hasCapacity = entities.some(e => e.type === 'capacity');
  const hasLocation = entities.some(e => e.type === 'location');
  const hasTeamSize = entities.some(e => e.type === 'team_size');

  // Manufacturing-specific questions
  if (industry === 'manufacturing') {
    // If they mentioned products but not specific types
    if (hasProduct && !answeredQuestions.has('product_types')) {
      const productEntity = entities.find(e => e.type === 'product');
      questions.push({
        id: 'product_types',
        question: `What type of ${productEntity?.value || 'products'} do you manufacture?`,
        entityType: 'product_category',
        options: [
          { value: 'apparel_garments', label: 'Finished Garments', emoji: '👕' },
          { value: 'apparel_fabric', label: 'Fabric/Textiles', emoji: '🧵' },
          { value: 'consumer_goods', label: 'Consumer Products', emoji: '📦' },
          { value: 'industrial_parts', label: 'Industrial Components', emoji: '⚙️' },
        ],
        allowOther: true,
        multiSelect: false,
      });
    }

    // If they mentioned capacity but not shifts
    if (hasCapacity && !answeredQuestions.has('shifts')) {
      questions.push({
        id: 'shifts',
        question: 'How many shifts do you run per day?',
        entityType: 'shifts',
        options: [
          { value: '1', label: '1 shift (8 hours/day)', emoji: '☀️' },
          { value: '2', label: '2 shifts (16 hours/day)', emoji: '🌓' },
          { value: '3', label: '3 shifts (24/7 operation)', emoji: '🌙' },
        ],
        allowOther: false,
        multiSelect: false,
      });
    }

    // Production model question
    if (!answeredQuestions.has('production_model')) {
      questions.push({
        id: 'production_model',
        question: 'What\'s your production model?',
        entityType: 'ops_model',
        options: [
          { value: 'MTO', label: 'Make-to-Order', emoji: '📝' },
          { value: 'MTS', label: 'Make-to-Stock', emoji: '📊' },
          { value: 'hybrid', label: 'Hybrid (both)', emoji: '🔄' },
        ],
        allowOther: false,
        multiSelect: false,
      });
    }

    // Subcontractors question
    if (!answeredQuestions.has('subcontractors')) {
      questions.push({
        id: 'subcontractors',
        question: 'Do you use subcontractors?',
        entityType: 'subcontractors',
        options: [
          { value: 'yes', label: 'Yes, we use subcontractors', emoji: '🤝' },
          { value: 'no', label: 'No, all in-house', emoji: '🏭' },
        ],
        allowOther: false,
        multiSelect: false,
      });
    }

    // Components question
    if (hasProduct && !answeredQuestions.has('components')) {
      questions.push({
        id: 'components',
        question: 'Do your products have components or sub-parts?',
        entityType: 'components',
        options: [
          { value: 'yes', label: 'Yes, multiple components', emoji: '🧩' },
          { value: 'no', label: 'No, simple items', emoji: '📦' },
        ],
        allowOther: false,
        multiSelect: false,
      });
    }
  }

  // Construction-specific questions
  if (industry === 'construction') {
    if (!answeredQuestions.has('project_types')) {
      questions.push({
        id: 'project_types',
        question: 'What types of projects do you work on?',
        entityType: 'project_type',
        options: [
          { value: 'residential', label: 'Residential', emoji: '🏘️' },
          { value: 'commercial', label: 'Commercial', emoji: '🏢' },
          { value: 'infrastructure', label: 'Infrastructure', emoji: '🌉' },
          { value: 'industrial', label: 'Industrial', emoji: '🏭' },
        ],
        allowOther: true,
        multiSelect: true,
      });
    }

    if (!answeredQuestions.has('subcontractors')) {
      questions.push({
        id: 'subcontractors',
        question: 'Do you work with subcontractors?',
        entityType: 'subcontractors',
        options: [
          { value: 'yes', label: 'Yes, regularly', emoji: '👷' },
          { value: 'no', label: 'No, direct labor only', emoji: '🏗️' },
        ],
        allowOther: false,
        multiSelect: false,
      });
    }
  }

  // Defense-specific questions
  if (industry === 'defense') {
    if (!answeredQuestions.has('contract_types')) {
      questions.push({
        id: 'contract_types',
        question: 'What type of contracts do you typically handle?',
        entityType: 'contract_type',
        options: [
          { value: 'rd', label: 'R&D / Development', emoji: '🔬' },
          { value: 'manufacturing', label: 'Manufacturing', emoji: '🏭' },
          { value: 'services', label: 'Services', emoji: '🛠️' },
          { value: 'maintenance', label: 'Maintenance & Support', emoji: '🔧' },
        ],
        allowOther: true,
        multiSelect: true,
      });
    }

    if (!answeredQuestions.has('clearance_levels')) {
      questions.push({
        id: 'clearance_levels',
        question: 'What security clearance levels are required?',
        entityType: 'clearance',
        options: [
          { value: 'confidential', label: 'Confidential', emoji: '🔒' },
          { value: 'secret', label: 'Secret', emoji: '🔐' },
          { value: 'top_secret', label: 'Top Secret', emoji: '🛡️' },
        ],
        allowOther: false,
        multiSelect: true,
      });
    }
  }

  // Limit to 3-5 questions max to avoid overwhelming user
  return questions.slice(0, 5);
}

/**
 * Generate conditional follow-ups based on a specific answer
 */
function generateConditionalQuestions(
  triggerAnswer: any,
  industry: string,
  entities: EntityExtraction[]
): FollowUpQuestion[] {
  const questions: FollowUpQuestion[] = [];

  // If they said they use subcontractors, ask which stages
  if (triggerAnswer.questionId === 'subcontractors' && triggerAnswer.answer === 'yes') {
    if (industry === 'manufacturing') {
      questions.push({
        id: 'subcontractor_stages',
        question: 'Which stages do you subcontract?',
        entityType: 'subcontractor_stage',
        options: [
          { value: 'cutting', label: 'Cutting', emoji: '✂️' },
          { value: 'sewing', label: 'Sewing', emoji: '🧵' },
          { value: 'washing', label: 'Washing/Finishing', emoji: '💧' },
          { value: 'packaging', label: 'Packaging', emoji: '📦' },
        ],
        allowOther: true,
        multiSelect: true,
      });
    } else if (industry === 'construction') {
      questions.push({
        id: 'subcontractor_trades',
        question: 'Which trades do you subcontract?',
        entityType: 'subcontractor_trade',
        options: [
          { value: 'electrical', label: 'Electrical', emoji: '⚡' },
          { value: 'plumbing', label: 'Plumbing', emoji: '🚰' },
          { value: 'hvac', label: 'HVAC', emoji: '🌡️' },
          { value: 'framing', label: 'Framing', emoji: '🔨' },
        ],
        allowOther: true,
        multiSelect: true,
      });
    }
  }

  // If they said yes to components, ask about tracking
  if (triggerAnswer.questionId === 'components' && triggerAnswer.answer === 'yes') {
    questions.push({
      id: 'component_tracking',
      question: 'How do you want to track components?',
      entityType: 'tracking_level',
      options: [
        { value: 'unit', label: 'Per unit (serial numbers)', emoji: '🔢' },
        { value: 'batch', label: 'Per batch (lot numbers)', emoji: '📦' },
        { value: 'order', label: 'Per order only', emoji: '📋' },
      ],
      allowOther: false,
      multiSelect: false,
    });
  }

  // If they selected apparel garments, ask about variants
  if (triggerAnswer.questionId === 'product_types' && triggerAnswer.answer === 'apparel_garments') {
    questions.push({
      id: 'garment_variants',
      question: 'Do you produce multiple sizes and colors?',
      entityType: 'variants',
      options: [
        { value: 'yes_both', label: 'Yes, sizes and colors', emoji: '🎨' },
        { value: 'sizes_only', label: 'Only sizes', emoji: '📏' },
        { value: 'colors_only', label: 'Only colors', emoji: '🌈' },
        { value: 'no', label: 'No variants', emoji: '⚪' },
      ],
      allowOther: false,
      multiSelect: false,
    });
  }

  return questions;
}

