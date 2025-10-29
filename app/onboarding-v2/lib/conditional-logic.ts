/**
 * Conditional Logic Engine
 * 
 * Determines which questions should be shown based on previous answers.
 * This allows for dynamic, branching onboarding flows.
 */

import type { GenerationContractV1 } from '../types.contract';
import type { Question } from '../types';
import { shouldSkipQuestion, analyzeContractCompleteness } from './contract-completeness';

/**
 * Evaluate if a question should be shown based on contract state
 */
export function shouldShowQuestion(question: Question, contract: GenerationContractV1): boolean {
  // SPECIAL CASE: Gap filling question - only show if there are missing required fields
  if (question.type === 'gap_filling') {
    const completeness = analyzeContractCompleteness(contract);
    const shouldShow = completeness.missingRequired.length > 0;
    console.log(`🔍 Gap filling: ${completeness.missingRequired.length} missing fields, showing: ${shouldShow}`);
    return shouldShow;
  }

  // SMART SKIP: If this question's data is already satisfied from previous answers, skip it
  if (shouldSkipQuestion(contract, question.mapsTo)) {
    console.log(`⏭️ Skipping question "${question.id}" - data already provided`);
    return false;
  }

  // No conditional logic - show the question
  if (!question.conditional) {
    return true;
  }

  const { dependsOn, showIf } = question.conditional;

  // Get the value of the dependency field
  const dependencyValue = getValueFromPath(contract, dependsOn);

  // Compare with showIf condition
  if (typeof showIf === 'boolean') {
    return dependencyValue === showIf;
  }

  if (Array.isArray(showIf)) {
    return showIf.includes(dependencyValue);
  }

  return dependencyValue === showIf;
}

/**
 * Get a nested value from an object using dot notation
 */
function getValueFromPath(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

/**
 * Filter questions based on conditional logic
 */
export function filterVisibleQuestions(questions: Question[], contract: GenerationContractV1): Question[] {
  return questions.filter(q => shouldShowQuestion(q, contract));
}

/**
 * Get the next visible question index
 */
export function getNextVisibleQuestionIndex(
  questions: Question[],
  currentIndex: number,
  contract: GenerationContractV1
): number {
  const visibleQuestions = filterVisibleQuestions(questions, contract);
  const currentQuestion = questions[currentIndex];
  const currentVisibleIndex = visibleQuestions.findIndex(q => q.id === currentQuestion?.id);

  if (currentVisibleIndex === -1 || currentVisibleIndex >= visibleQuestions.length - 1) {
    return questions.length; // No more questions
  }

  const nextVisibleQuestion = visibleQuestions[currentVisibleIndex + 1];
  return questions.findIndex(q => q.id === nextVisibleQuestion.id);
}

/**
 * Get the previous visible question index
 */
export function getPreviousVisibleQuestionIndex(
  questions: Question[],
  currentIndex: number,
  contract: GenerationContractV1
): number {
  const visibleQuestions = filterVisibleQuestions(questions, contract);
  const currentQuestion = questions[currentIndex];
  const currentVisibleIndex = visibleQuestions.findIndex(q => q.id === currentQuestion?.id);

  if (currentVisibleIndex <= 0) {
    return 0; // Already at the first visible question
  }

  const prevVisibleQuestion = visibleQuestions[currentVisibleIndex - 1];
  return questions.findIndex(q => q.id === prevVisibleQuestion.id);
}

/**
 * Check if a section should be accessible based on conditional logic
 */
export function isSectionAccessible(
  sectionId: string,
  questions: Question[],
  contract: GenerationContractV1
): boolean {
  const sectionQuestions = questions.filter(q => q.section === sectionId);
  
  // If any question in the section is visible, the section is accessible
  return sectionQuestions.some(q => shouldShowQuestion(q, contract));
}

