/**
 * LLM-Powered Entity Extraction with Keyword Fallback
 * 
 * Uses Together.ai's Llama model for intelligent extraction,
 * with graceful fallback to keyword-based patterns.
 */

import { extractEntities } from './nlp.intents';
import type { EntityExtraction } from './nlp.intents';

export type ExtractionContext = 
  | 'company_profile'
  | 'operations'
  | 'items_products'
  | 'workflows'
  | 'sites_facilities'
  | 'teams_departments'
  | 'integrations'
  | 'analytics_metrics'
  | 'playbooks_tasks'
  | 'general';

export interface ExtractionResult {
  entities: EntityExtraction[];
  source: 'llm' | 'keyword' | 'hybrid';
  llmUsed: boolean;
  error?: string;
  tokensUsed?: number;
  context?: ExtractionContext;
}

/**
 * Extract entities using keyword-first strategy with LLM refinement
 * @param text - The natural language input to extract from
 * @param context - Optional context to focus extraction (reduces token usage by 60-80%)
 */
export async function extractEntitiesWithLLM(
  text: string, 
  context?: ExtractionContext
): Promise<ExtractionResult> {
  // STEP 1: Run keyword extraction first (fast, local, no API cost)
  const keywordEntities = extractEntities(text);
  
  // STEP 2: Check confidence scores
  const highConfidenceEntities = keywordEntities.filter(e => e.confidence === 3);
  const lowConfidenceEntities = keywordEntities.filter(e => e.confidence < 3);
  
  // STEP 3: If all keyword matches are high confidence, use them directly
  if (lowConfidenceEntities.length === 0 && highConfidenceEntities.length > 0) {
    console.log('✅ Using keyword extraction only (all high confidence)');
    return {
      entities: keywordEntities,
      source: 'keyword',
      llmUsed: false,
      context: context || 'general'
    };
  }
  
  // STEP 4: Call LLM for refinement on low-confidence or missing entities
  try {
    console.log(`🤖 Calling LLM to refine ${lowConfidenceEntities.length} low-confidence entities...`);
    
    const response = await fetch('/api/nlp/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, context })
    });

    if (!response.ok) {
      throw new Error(`LLM API failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.entities && data.entities.length > 0) {
      // STEP 5: Merge - LLM takes priority
      const merged = mergeEntitiesWithLLMPriority(data.entities, keywordEntities);
      
      console.log(`✨ Merged ${merged.length} entities (${data.entities.length} from LLM, ${keywordEntities.length} from keywords)`);
      
      return {
        entities: merged,
        source: 'hybrid',
        llmUsed: true,
        tokensUsed: data.tokensUsed,
        context: context || 'general'
      };
    } else {
      throw new Error('LLM returned no entities');
    }
  } catch (error) {
    console.error('⚠️ LLM extraction failed, using keyword results:', error instanceof Error ? error.message : 'Unknown error');
    
    // Fallback to keyword-based extraction
    return {
      entities: keywordEntities,
      source: 'keyword',
      llmUsed: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Merge LLM and keyword entities with LLM taking priority
 * Strategy: LLM results always preferred, keyword only fills gaps
 */
function mergeEntitiesWithLLMPriority(
  llmEntities: EntityExtraction[], 
  keywordEntities: EntityExtraction[]
): EntityExtraction[] {
  // Start with all LLM entities (they have priority)
  const merged = llmEntities.map(e => ({
    ...e,
    provenance: 'llm' as const
  }));
  
  // Track what types LLM already found
  const llmTypeSet = new Set(llmEntities.map(e => e.type));
  
  // Add keyword entities that LLM didn't find (by type, not exact value)
  // This avoids duplicates like "Istanbul" + "Istanbul, Turkey"
  keywordEntities.forEach(keywordEntity => {
    // Skip if LLM already extracted this type
    if (llmTypeSet.has(keywordEntity.type)) {
      return;
    }
    
    // Add keyword entity (only if LLM didn't find this type)
    merged.push({
      ...keywordEntity,
      provenance: 'keyword' as const
    });
    
    // Track this type so we don't add duplicates
    llmTypeSet.add(keywordEntity.type);
  });

  return merged;
}

/**
 * Legacy merge function (kept for backwards compatibility)
 * Prefer using mergeEntitiesWithLLMPriority instead
 */
function mergeEntities(
  llmEntities: EntityExtraction[], 
  keywordEntities: EntityExtraction[]
): EntityExtraction[] {
  return mergeEntitiesWithLLMPriority(llmEntities, keywordEntities);
}

