/**
 * Intelligent Question Engine
 * 
 * Determines which questions to show based on:
 * 1. Industry-specific routing
 * 2. Previously answered/committed data in contract
 * 3. Conditional logic rules
 */

import type { GenerationContractV1 } from '../types.contract';
import { hasContractValue, isFieldCommitted } from './contract-factory';

export interface Question {
  id: string;
  type: string;
  section: string;
  prompt: string;
  subtitle?: string;
  helper?: string;
  required: boolean;
  mapsTo: string | null;
  industries?: Array<'manufacturing' | 'construction' | 'defense'>; // If specified, only show for these industries
  subIndustries?: Array<'fashion' | 'general'>; // If specified, only show for these sub-industries
  conditional?: {
    dependsOn: string; // Question ID or contract path
    showIf: any; // Value that must match
  };
  skipIfCommitted?: boolean; // Skip if this field path is already committed
  [key: string]: any;
}

/**
 * Check if a question should be shown based on industry
 */
export function matchesIndustry(question: Question, contract: GenerationContractV1): boolean {
  // If no industry filter, show to all
  if (!question.industries || question.industries.length === 0) {
    return true;
  }
  
  // Check if current industry matches
  if (!question.industries.includes(contract.company.industry)) {
    return false;
  }
  
  // Check sub-industry if specified
  // Only filter OUT if sub-industry is set AND doesn't match
  // If sub-industry not set yet, show the question (they'll select it soon)
  if (question.subIndustries && question.subIndustries.length > 0) {
    if (contract.company.subIndustry && !question.subIndustries.includes(contract.company.subIndustry)) {
      // Sub-industry is set but doesn't match - filter out
      return false;
    }
    // Either sub-industry not set yet, or it matches - show the question
  }
  
  return true;
}

/**
 * Check if question's dependencies are met
 */
export function dependenciesMet(question: Question, contract: GenerationContractV1, allQuestions: Question[]): boolean {
  if (!question.conditional) {
    return true;
  }
  
  const { dependsOn, showIf } = question.conditional;
  
  // Check if dependsOn is a question ID or contract path
  const dependencyQuestion = allQuestions.find(q => q.id === dependsOn);
  
  if (dependencyQuestion) {
    // It's a question ID - check if that question's mapped value matches
    if (!dependencyQuestion.mapsTo) {
      return false;
    }
    
    const value = getValueByPath(contract, dependencyQuestion.mapsTo);
    return value === showIf;
  } else {
    // It's a contract path - check directly
    const value = getValueByPath(contract, dependsOn);
    return value === showIf;
  }
}

/**
 * Check if question should be skipped because data is already committed
 */
export function alreadyAnswered(question: Question, contract: GenerationContractV1): boolean {
  // ONLY skip if question explicitly says to skip when committed
  // This is opt-in behavior, not default
  if (question.skipIfCommitted !== true) {
    return false;
  }
  
  // If question doesn't map to contract, never skip
  if (!question.mapsTo) {
    return false;
  }
  
  // Check if field is committed AND has a value
  const isCommitted = isFieldCommitted(contract, question.mapsTo);
  const hasValue = hasContractValue(contract, question.mapsTo);
  
  // Only skip if BOTH committed AND has value
  return isCommitted && hasValue;
}

/**
 * Main function: Should this question be shown?
 */
export function shouldShowQuestion(
  question: Question,
  contract: GenerationContractV1,
  allQuestions: Question[]
): boolean {
  // Check industry match
  if (!matchesIndustry(question, contract)) {
    return false;
  }
  
  // Check dependencies
  if (!dependenciesMet(question, contract, allQuestions)) {
    return false;
  }
  
  // Check if already answered
  if (alreadyAnswered(question, contract)) {
    return false;
  }
  
  return true;
}

/**
 * Filter list of questions to only those that should be shown
 */
export function filterVisibleQuestions(
  questions: Question[],
  contract: GenerationContractV1
): Question[] {
  return questions.filter(q => shouldShowQuestion(q, contract, questions));
}

/**
 * Get the next visible question index
 */
export function getNextVisibleQuestionIndex(
  questions: Question[],
  currentIndex: number,
  contract: GenerationContractV1
): number {
  console.log(`[Question Engine] Looking for next question after index ${currentIndex}`);
  console.log(`[Question Engine] Total questions: ${questions.length}`);
  console.log(`[Question Engine] Current industry: ${contract.company.industry}, sub: ${contract.company.subIndustry}`);
  
  // Log the next 10 questions to see what they are
  console.log('[Question Engine] Next 10 questions:');
  for (let i = currentIndex + 1; i < Math.min(currentIndex + 11, questions.length); i++) {
    console.log(`  Q${i}: ${questions[i]?.id} (section: ${questions[i]?.section})`);
  }
  
  for (let i = currentIndex + 1; i < questions.length; i++) {
    const question = questions[i];
    const shouldShow = shouldShowQuestion(question, contract, questions);
    
    if (i < currentIndex + 10) { // Log first 10 checks
      const industryMatch = matchesIndustry(question, contract);
      const depsOk = dependenciesMet(question, contract, questions);
      const answered = alreadyAnswered(question, contract);
      
      console.log(`[Question Engine] Q${i} "${question.id}": ${shouldShow ? '✅ SHOW' : '❌ SKIP'}`);
      if (!shouldShow) {
        console.log(`    Industry match: ${industryMatch}, Dependencies: ${depsOk}, Already answered: ${answered}`);
        if (question.industries) {
          console.log(`    Question industries: ${JSON.stringify(question.industries)}`);
        }
      }
    }
    
    if (shouldShow) {
      console.log(`[Question Engine] ✅ Found next visible question at index ${i}: "${question.id}"`);
      return i;
    }
  }
  
  console.log(`[Question Engine] ❌ No more visible questions, returning ${questions.length}`);
  return questions.length; // No more questions
}

/**
 * Get the previous visible question index
 */
export function getPreviousVisibleQuestionIndex(
  questions: Question[],
  currentIndex: number,
  contract: GenerationContractV1
): number {
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (shouldShowQuestion(questions[i], contract, questions)) {
      return i;
    }
  }
  return 0; // At the start
}

/**
 * Helper: Get value from object by dot-notation path
 */
function getValueByPath(obj: any, path: string): any {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value === undefined || value === null) {
      return undefined;
    }
    value = value[key];
  }
  
  return value;
}

/**
 * Get progress through visible questions
 */
export function getQuestionProgress(
  questions: Question[],
  currentIndex: number,
  contract: GenerationContractV1
): { current: number; total: number; percentage: number } {
  const visibleQuestions = filterVisibleQuestions(questions, contract);
  const currentQuestion = questions[currentIndex];
  const visibleIndex = visibleQuestions.findIndex(q => q.id === currentQuestion?.id);
  
  const current = visibleIndex >= 0 ? visibleIndex + 1 : 1;
  const total = visibleQuestions.length;
  const percentage = Math.round((current / total) * 100);
  
  return { current, total, percentage };
}

