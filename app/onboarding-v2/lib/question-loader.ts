/**
 * Question Loader (v2)
 * 
 * Loads questions from new modular structure with backward compatibility.
 * Supports industry-specific and sub-industry-specific question sets.
 */

import type { Question } from '../types';
import questionRegistry from '../content/question-registry.json';

// LEGACY IMPORTS REMOVED - Only using new registry system
// All legacy questions removed to prevent conflicts

// New structure imports
import baseQuestions from '../content/questions/common/base.json';
import reviewQuestions from '../content/questions/common/review.json';
import manufacturingCommon from '../content/questions/manufacturing/common.json';
import manufacturingOperations from '../content/questions/manufacturing/common/operations.json';
import manufacturingItems from '../content/questions/manufacturing/common/items.json';
import manufacturingWorkflows from '../content/questions/manufacturing/common/workflows.json';
import manufacturingSites from '../content/questions/manufacturing/common/sites.json';
import manufacturingTeams from '../content/questions/manufacturing/common/teams.json';
import manufacturingIntegrations from '../content/questions/manufacturing/common/integrations.json';
import manufacturingAnalytics from '../content/questions/manufacturing/common/analytics.json';
import fashionCompanyQuestions from '../content/questions/manufacturing/fashion/company.json';
import fashionOperationsQuestions from '../content/questions/manufacturing/fashion/operations.json';
import fashionSitesQuestions from '../content/questions/manufacturing/fashion/sites.json';
import fashionTeamsQuestions from '../content/questions/manufacturing/fashion/teams.json';
import fashionIntegrationsQuestions from '../content/questions/manufacturing/fashion/integrations.json';
import fashionAnalyticsQuestions from '../content/questions/manufacturing/fashion/analytics.json';
import generalCompanyQuestions from '../content/questions/manufacturing/general/company.json';
import constructionCommon from '../content/questions/construction/common.json';
import defenseCommon from '../content/questions/defense/common.json';

type QuestionSet = Record<string, Question>;

/**
 * Load questions from new modular structure
 */
function loadQuestionsFromRegistry(
  industry?: string,
  subIndustry?: string
): Question[] {
  const questions: Question[] = [];
  
  // Always load base questions (welcome, industry select)
  questions.push(...Object.values(baseQuestions as QuestionSet));
  
  // If no industry selected, stop here (just welcome + industry select)
  if (!industry) {
    return questions;
  }
  
  // If industry is set but sub-industry is NOT set yet, load the sub-industry selector
  // This happens when user selects "manufacturing" but hasn't chosen fashion/general yet
  if (industry === 'manufacturing' && !subIndustry) {
    // Load manufacturing common questions (which includes sub-industry selector)
    const manufacturingCommonQs = Object.values(manufacturingCommon as QuestionSet);
    questions.push(...manufacturingCommonQs);
    console.log(`[Question Loader] 📋 Industry "${industry}" selected, waiting for sub-industry. Loaded ${manufacturingCommonQs.length} common questions.`);
    return questions;
  }
  
  // Build context key (e.g., "manufacturing.fashion" or "manufacturing.general")
  const contextKey = subIndustry 
    ? `${industry}.${subIndustry}` 
    : `${industry}`;
  
  // Get question set configuration from registry
  const questionSet = (questionRegistry as any).questionSets[contextKey];
  
  if (!questionSet) {
    console.error(`[Question Loader] ❌ No registry entry found for ${contextKey}`);
    console.error(`[Question Loader] Available question sets:`, Object.keys((questionRegistry as any).questionSets));
    // For demo purposes, if fashion is requested but not found, try to load anyway
    if (industry === 'manufacturing' && subIndustry === 'fashion') {
      console.warn(`[Question Loader] ⚠️ Registry entry missing, but loading fashion questions anyway for demo`);
      // Load directly without registry
      questions.push(...Object.values(manufacturingCommon as QuestionSet));
      questions.push(...Object.values(fashionCompanyQuestions as QuestionSet));
      questions.push(...Object.values(fashionOperationsQuestions as QuestionSet));
      questions.push(...Object.values(reviewQuestions as QuestionSet));
      return questions;
    }
    throw new Error(`No question set configured for ${contextKey}. Please check question-registry.json`);
  }
  
  // Track loaded question IDs to prevent duplicates
  const loadedQuestionIds = new Set<string>();
  
  // Load questions in order specified by registry
  console.log(`[Question Loader] 📋 Loading questions for ${contextKey} from registry:`);
  console.log(`[Question Loader] Load order:`, questionSet.loadOrder);
  
  for (const loadPath of questionSet.loadOrder) {
    const questionObj = loadQuestionFile(loadPath);
    if (!questionObj) {
      console.error(`[Question Loader] ❌ Failed to load: ${loadPath}`);
      continue;
    }
    
    // Filter out placeholder questions and duplicates
    const validQuestions = Object.values(questionObj).filter(
      q => {
        if (q.id === 'placeholder') return false;
        if (loadedQuestionIds.has(q.id)) {
          console.warn(`[Question Loader] ⚠️ Skipping duplicate question ID: ${q.id} from ${loadPath}`);
          return false;
        }
        loadedQuestionIds.add(q.id);
        return true;
      }
    );
    
    // Log every question being loaded
    console.log(`[Question Loader] ✅ Loaded ${validQuestions.length} questions from ${loadPath}:`);
    validQuestions.forEach((q: any) => {
      console.log(`  - ${q.id} (section: ${q.section}, prompt: "${q.prompt?.substring(0, 40)}...")`);
    });
    
    questions.push(...validQuestions);
  }
  
  // Always add review questions at the end (with deduplication)
  const reviewQs = Object.values(reviewQuestions as QuestionSet).filter(q => {
    if (loadedQuestionIds.has(q.id)) {
      console.warn(`[Question Loader] ⚠️ Skipping duplicate review question: ${q.id}`);
      return false;
    }
    loadedQuestionIds.add(q.id);
    return true;
  });
  questions.push(...reviewQs);
  
  console.log(`[Question Loader] ✅ Final question count: ${questions.length} (${loadedQuestionIds.size} unique IDs)`);
  
  return questions;
}

/**
 * Load a question file by path (e.g., "manufacturing/common/operations")
 */
function loadQuestionFile(path: string): QuestionSet | null {
  // Map paths to actual imports
  const pathMap: Record<string, QuestionSet> = {
    'common/base': baseQuestions as QuestionSet,
    'common/review': reviewQuestions as QuestionSet,
    'manufacturing/common': manufacturingCommon as QuestionSet,
    'manufacturing/common/operations': manufacturingOperations as QuestionSet,
    'manufacturing/common/items': manufacturingItems as QuestionSet,
    'manufacturing/common/workflows': manufacturingWorkflows as QuestionSet,
    'manufacturing/common/sites': manufacturingSites as QuestionSet,
    'manufacturing/common/teams': manufacturingTeams as QuestionSet,
    'manufacturing/common/integrations': manufacturingIntegrations as QuestionSet,
    'manufacturing/common/analytics': manufacturingAnalytics as QuestionSet,
    'manufacturing/fashion/company': fashionCompanyQuestions as QuestionSet,
    'manufacturing/fashion/operations': fashionOperationsQuestions as QuestionSet,
    'manufacturing/fashion/sites': fashionSitesQuestions as QuestionSet,
    'manufacturing/fashion/teams': fashionTeamsQuestions as QuestionSet,
    'manufacturing/fashion/integrations': fashionIntegrationsQuestions as QuestionSet,
    'manufacturing/fashion/analytics': fashionAnalyticsQuestions as QuestionSet,
    'manufacturing/general/company': generalCompanyQuestions as QuestionSet,
    'construction/common': constructionCommon as QuestionSet,
    'defense/common': defenseCommon as QuestionSet,
  };
  
  return pathMap[path] || null;
}

/**
 * Legacy loader REMOVED - All questions must come from registry
 * This prevents loading of old/duplicate questions
 */

/**
 * Main entry point: Load all questions for a specific industry/sub-industry
 * REGISTRY ONLY - No legacy fallbacks. All questions must be in registry.
 */
export function loadQuestionsForIndustry(
  industry?: string,
  subIndustry?: string
): Question[] {
  // For fashion manufacturing, NEVER use legacy loader - registry is required
  if (industry === 'manufacturing' && subIndustry === 'fashion') {
    try {
      const newQuestions = loadQuestionsFromRegistry(industry, subIndustry);
      if (newQuestions.length === 0) {
        throw new Error('Registry returned 0 questions for manufacturing.fashion');
      }
      console.log(`[Question Loader] ✅ Loaded ${newQuestions.length} questions from registry for ${industry}.${subIndustry}`);
      console.log(`[Question Loader] Operations questions:`, newQuestions.filter(q => q.section === 'operations').length);
      console.log(`[Question Loader] Company questions:`, newQuestions.filter(q => q.section === 'company').length);
      return newQuestions;
    } catch (error) {
      console.error('[Question Loader] ❌ CRITICAL: Failed to load questions for manufacturing.fashion:', error);
      throw error; // Don't fall back - force fix
    }
  }
  
  // For other industries, registry is REQUIRED (no fallback)
  try {
    const newQuestions = loadQuestionsFromRegistry(industry, subIndustry);
    if (newQuestions.length === 0) {
      throw new Error(`Registry returned 0 questions for ${industry}.${subIndustry || 'none'}`);
    }
    console.log(`[Question Loader] ✅ Loaded ${newQuestions.length} questions from registry for ${industry}.${subIndustry || 'none'}`);
    return newQuestions;
  } catch (error) {
    console.error('[Question Loader] ❌ Failed to load questions:', error);
    throw error; // Don't fall back - force fix
  }
}

/**
 * Get question by ID from all banks
 */
export function getQuestionById(
  id: string,
  industry?: string,
  subIndustry?: string
): Question | undefined {
  const allQuestions = loadQuestionsForIndustry(industry, subIndustry);
  return allQuestions.find(q => q.id === id);
}

/**
 * Get questions for a specific section
 */
export function getQuestionsForSection(
  section: string,
  industry?: string,
  subIndustry?: string
): Question[] {
  const allQuestions = loadQuestionsForIndustry(industry, subIndustry);
  return allQuestions.filter(q => q.section === section);
}

/**
 * Get contract metadata for a given industry/sub-industry context
 * Used by LLM and completeness checking
 */
export function getContractMetadata(
  industry?: string,
  subIndustry?: string
): {
  requiredFields: Record<string, string[]>;
  optionalFields: Record<string, string[]>;
} | null {
  if (!industry) return null;
  
  const contextKey = subIndustry 
    ? `${industry}.${subIndustry}` 
    : `${industry}`;
  
  const contractConfig = (questionRegistry as any).contracts[contextKey];
  
  if (!contractConfig) {
    return null;
  }
  
  return {
    requiredFields: contractConfig.requiredFields || {},
    optionalFields: contractConfig.optionalFields || {},
  };
}
