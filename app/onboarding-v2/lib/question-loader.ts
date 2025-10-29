/**
 * Question Loader
 * 
 * Loads and merges question banks based on industry selection
 */

import type { Question } from '../types';
import commonQuestions from '../content/questions.common.json';
import manufacturingQuestions from '../content/questions.manufacturing.json';
import constructionQuestions from '../content/questions.construction.json';
import defenseQuestions from '../content/questions.defense.json';

/**
 * Load all questions for a specific industry
 * If no industry selected yet, load ALL questions from all banks
 * (They'll be filtered by industry later via the question engine)
 */
export function loadQuestionsForIndustry(industry?: string): Question[] {
  const questions: Question[] = [];
  
  // Get common questions WITHOUT review questions (they go at the end)
  const commonQs = Object.values(commonQuestions);
  const reviewQuestions = commonQs.filter(q => q.section === 'review');
  const nonReviewCommon = commonQs.filter(q => q.section !== 'review');
  
  // Add common questions (excluding review)
  questions.push(...nonReviewCommon);
  
  // If industry is selected, add only that industry's questions
  if (industry === 'manufacturing') {
    questions.push(...Object.values(manufacturingQuestions));
  } else if (industry === 'construction') {
    questions.push(...Object.values(constructionQuestions));
  } else if (industry === 'defense') {
    questions.push(...Object.values(defenseQuestions));
  } else {
    // No industry selected yet - load ALL questions
    // The question engine will filter them based on industry match
    questions.push(...Object.values(manufacturingQuestions));
    questions.push(...Object.values(constructionQuestions));
    questions.push(...Object.values(defenseQuestions));
  }
  
  // ALWAYS add review questions at the very END
  questions.push(...reviewQuestions);
  
  return questions;
}

/**
 * Get question by ID from all banks
 */
export function getQuestionById(id: string, industry?: string): Question | undefined {
  const allQuestions = loadQuestionsForIndustry(industry);
  return allQuestions.find(q => q.id === id);
}

/**
 * Get questions for a specific section
 */
export function getQuestionsForSection(section: string, industry?: string): Question[] {
  const allQuestions = loadQuestionsForIndustry(industry);
  return allQuestions.filter(q => q.section === section);
}

