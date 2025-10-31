# Question System Refactor - Implementation Example

## Visual Flow

```
User Journey:
1. Welcome Screen
   ↓
2. Industry Selection: "Manufacturing"
   → Loads: common/base.json + manufacturing/common.json
   → Contract: GenerationContractV1 (base structure)
   ↓
3. Sub-Industry Selection: "Fashion"
   → Loads: manufacturing/fashion/company.json + fashion/operations.json + ...
   → Contract: GenerationContractV1 + ManufacturingContract (fashion extension)
   ↓
4. Questions Flow (now contract-aware)
   → company_description_nlp → extracts to company.*
   → company_confirm_extracted → confirms entities
   → company_product_types → REQUIRED for fashion (maps to company.productTypes)
   → ... more fashion-specific questions
   ↓
5. Contract Completeness Check
   → Checks: Is company.productTypes populated? (required for fashion)
   → If missing: Generate follow-up question dynamically
   ↓
6. Review & Generate
```

## Example: Question File Structure

### `content/questions/common/base.json`
```json
{
  "welcome": {
    "id": "welcome",
    "type": "welcome_screen",
    "section": "welcome",
    "industries": [],
    "subIndustries": [],
    "contractMetadata": {
      "requiredFor": ["*"],
      "contractPath": null
    }
  },
  "industry_select": {
    "id": "industry_select",
    "type": "multiple_choice",
    "section": "welcome",
    "industries": [],
    "contractMetadata": {
      "requiredFor": ["*"],
      "contractPath": "company.industry"
    }
  }
}
```

### `content/questions/manufacturing/common.json`
```json
{
  "manufacturing_subindustry": {
    "id": "manufacturing_subindustry",
    "type": "multiple_choice",
    "section": "company",
    "industries": ["manufacturing"],
    "contractMetadata": {
      "requiredFor": ["manufacturing.*"],
      "contractPath": "company.subIndustry"
    }
  },
  "manufacturing_teams_nlp": {
    "id": "manufacturing_teams_nlp",
    "type": "enriched_text",
    "section": "teams",
    "industries": ["manufacturing"],
    "contractMetadata": {
      "requiredFor": ["manufacturing.*"],
      "contractPath": "teams.departments"
    }
  }
}
```

### `content/questions/manufacturing/fashion/company.json`
```json
{
  "company_description_nlp": {
    "id": "company_description_nlp",
    "type": "enriched_text",
    "section": "company",
    "industries": ["manufacturing"],
    "subIndustries": ["fashion"],
    "contractMetadata": {
      "requiredFor": ["manufacturing.fashion"],
      "contractPath": "company.description",
      "contractRequired": true
    },
    "promptContext": "company_profile"
  },
  "company_product_types": {
    "id": "company_product_types",
    "type": "multiple_choice",
    "section": "company",
    "industries": ["manufacturing"],
    "subIndustries": ["fashion"],
    "contractMetadata": {
      "requiredFor": ["manufacturing.fashion"],
      "contractPath": "company.productTypes",
      "contractRequired": true
    },
    "multiSelect": true,
    "options": [
      { "value": "Jeans", "label": "Jeans" },
      { "value": "Jackets", "label": "Jackets" },
      { "value": "Shirts", "label": "Shirts" },
      { "value": "Dresses", "label": "Dresses" },
      { "value": "Skirts", "label": "Skirts" },
      { "value": "Shorts", "label": "Shorts" },
      { "value": "Accessories", "label": "Accessories" },
      { "value": "Other", "label": "Other" }
    ]
  },
  "company_compliance_list": {
    "id": "company_compliance_list",
    "type": "multiple_choice",
    "section": "company",
    "industries": ["manufacturing"],
    "subIndustries": ["fashion"],
    "contractMetadata": {
      "requiredFor": ["manufacturing.fashion"],
      "optionalFor": ["manufacturing.general"],
      "contractPath": "company.complianceList",
      "contractRequired": false
    },
    "multiSelect": true,
    "options": [
      { "value": "BSCI", "label": "BSCI" },
      { "value": "WRAP", "label": "WRAP" },
      { "value": "ISO9001", "label": "ISO 9001" },
      { "value": "ISO14001", "label": "ISO 14001" },
      { "value": "Sedex", "label": "Sedex" },
      { "value": "GOTS", "label": "GOTS" },
      { "value": "Other", "label": "Other" }
    ]
  }
}
```

### `content/questions/manufacturing/general/company.json`
```json
{
  "company_description_nlp": {
    "id": "company_description_nlp",
    "type": "enriched_text",
    "section": "company",
    "industries": ["manufacturing"],
    "subIndustries": ["general"],
    "contractMetadata": {
      "requiredFor": ["manufacturing.general"],
      "contractPath": "company.description",
      "contractRequired": true
    },
    "promptContext": "company_profile"
  },
  "company_product_lines": {
    "id": "company_product_lines",
    "type": "dynamic_list",
    "section": "company",
    "industries": ["manufacturing"],
    "subIndustries": ["general"],
    "contractMetadata": {
      "requiredFor": ["manufacturing.general"],
      "contractPath": "manufacturingExt.general.productLines",
      "contractRequired": true
    }
  }
}
```

## Example: Question Registry

### `content/question-registry.json`
```json
{
  "contracts": {
    "manufacturing.fashion": {
      "baseContract": "GenerationContractV1",
      "extensionContract": "ManufacturingContract",
      "extensionType": "manufacturingExt",
      "requiredSections": ["company", "operations", "items"],
      "requiredFields": {
        "company": ["name", "description", "hqLocation", "manufacturerType", "clientType", "teamSizeTotal", "capacityMonthlyPcs", "productTypes"],
        "operations": ["model", "monthlyCapacity"],
        "items": ["categories", "trackingLevel"]
      },
      "optionalFields": {
        "company": ["foundedYear", "ownBrand", "complianceHas", "decisionMakerTitle"],
        "operations": ["shiftsPerDay", "seasonality"],
        "sites": ["floors"],
        "teams": ["departments"],
        "analytics": ["keyMetrics"]
      }
    },
    "manufacturing.general": {
      "baseContract": "GenerationContractV1",
      "extensionContract": "ManufacturingContract",
      "extensionType": "manufacturingExt",
      "requiredSections": ["company", "operations", "items"],
      "requiredFields": {
        "company": ["name", "description", "hqLocation", "manufacturerType", "teamSizeTotal"],
        "operations": ["model"],
        "items": ["categories"]
      },
      "optionalFields": {
        "company": ["foundedYear"],
        "operations": ["monthlyCapacity", "shiftsPerDay"],
        "items": ["trackingLevel"]
      }
    }
  },
  "questionSets": {
    "manufacturing.fashion": {
      "loadOrder": [
        "common/base",
        "manufacturing/common",
        "manufacturing/fashion/company",
        "manufacturing/fashion/operations",
        "manufacturing/fashion/items",
        "manufacturing/common/workflows",
        "manufacturing/common/sites",
        "manufacturing/common/teams",
        "manufacturing/common/integrations",
        "manufacturing/common/analytics",
        "common/review"
      ],
      "contractPath": "manufacturing.fashion"
    },
    "manufacturing.general": {
      "loadOrder": [
        "common/base",
        "manufacturing/common",
        "manufacturing/general/company",
        "manufacturing/general/operations",
        "manufacturing/general/items",
        "manufacturing/common/workflows",
        "common/review"
      ],
      "contractPath": "manufacturing.general"
    }
  }
}
```

## Example: Updated Question Loader Implementation

```typescript
// app/onboarding-v2/lib/question-loader.ts

import questionRegistry from '../content/question-registry.json';
import type { Industry, SubIndustry } from '../types.contract';
import type { Question } from '../types';

interface QuestionSetConfig {
  loadOrder: string[];
  contractPath: string;
}

interface ContractConfig {
  baseContract: string;
  extensionContract: string;
  extensionType: string;
  requiredSections: string[];
  requiredFields: Record<string, string[]>;
  optionalFields: Record<string, string[]>;
}

/**
 * Get context key for industry/sub-industry
 */
function getContextKey(industry?: Industry, subIndustry?: SubIndustry): string | null {
  if (!industry) return null;
  return subIndustry ? `${industry}.${subIndustry}` : industry;
}

/**
 * Load questions for specific industry/sub-industry combination
 */
export function loadQuestionsForContext(
  industry?: Industry,
  subIndustry?: SubIndustry
): Question[] {
  const contextKey = getContextKey(industry, subIndustry);
  
  if (!contextKey) {
    // No industry selected - load only base questions
    return loadQuestionSet(['common/base']);
  }
  
  const config = questionRegistry.questionSets[contextKey] as QuestionSetConfig | undefined;
  if (!config) {
    console.warn(`No question set found for ${contextKey}, falling back to common`);
    return loadQuestionSet(['common/base']);
  }
  
  // Load questions in specified order
  const questions: Question[] = [];
  for (const setPath of config.loadOrder) {
    try {
      const setQuestions = loadQuestionSet([setPath]);
      questions.push(...setQuestions);
    } catch (error) {
      console.warn(`Failed to load question set: ${setPath}`, error);
    }
  }
  
  return questions;
}

/**
 * Load a specific question set by path
 */
function loadQuestionSet(paths: string[]): Question[] {
  const questions: Question[] = [];
  
  for (const path of paths) {
    try {
      // Dynamic import - in production, this would use proper imports
      // For now, we'll use require which works in Node.js/Next.js
      const questionSet = require(`../content/questions/${path}.json`);
      questions.push(...Object.values(questionSet) as Question[]);
    } catch (error) {
      console.warn(`Failed to load question set: ${path}`, error);
    }
  }
  
  return questions;
}

/**
 * Get contract metadata for current context
 */
export function getContractMetadata(
  industry?: Industry,
  subIndustry?: SubIndustry
): ContractConfig | null {
  const contextKey = getContextKey(industry, subIndustry);
  if (!contextKey) return null;
  
  return (questionRegistry.contracts[contextKey] as ContractConfig) || null;
}

/**
 * Check if a question is required for current context
 */
export function isQuestionRequiredForContext(
  question: Question,
  industry?: Industry,
  subIndustry?: SubIndustry
): boolean {
  const contextKey = getContextKey(industry, subIndustry);
  if (!contextKey || !question.contractMetadata) return false;
  
  const requiredFor = question.contractMetadata.requiredFor || [];
  
  // Check exact match
  if (requiredFor.includes(contextKey)) return true;
  
  // Check wildcard match (e.g., "manufacturing.*")
  const industryOnly = contextKey.split('.')[0];
  if (requiredFor.includes(`${industryOnly}.*`)) return true;
  
  // Check universal match
  if (requiredFor.includes('*')) return true;
  
  return false;
}

/**
 * Get all required contract fields for context
 */
export function getRequiredContractFields(
  industry?: Industry,
  subIndustry?: SubIndustry
): Record<string, string[]> {
  const metadata = getContractMetadata(industry, subIndustry);
  return metadata?.requiredFields || {};
}

/**
 * Get all optional contract fields for context
 */
export function getOptionalContractFields(
  industry?: Industry,
  subIndustry?: SubIndustry
): Record<string, string[]> {
  const metadata = getContractMetadata(industry, subIndustry);
  return metadata?.optionalFields || {};
}
```

## Benefits Demonstrated

1. **Clear Separation**: Fashion questions are in `manufacturing/fashion/`, not in `common`
2. **Contract Awareness**: Each question knows which contract path it maps to
3. **Dynamic Loading**: Only relevant questions are loaded based on context
4. **Completeness Checking**: System knows exactly what's required for fashion vs general
5. **Easy Extension**: Adding a new sub-industry is just creating a new folder + registry entry

## Migration Example

**Before (current):**
```typescript
// Loads ALL questions, filters later
const questions = loadQuestionsForIndustry('manufacturing');
// Fashion questions mixed with general questions
```

**After (proposed):**
```typescript
// Loads only relevant questions for context
const questions = loadQuestionsForContext('manufacturing', 'fashion');
// Only fashion-specific questions loaded
// Contract structure known upfront
const contractMeta = getContractMetadata('manufacturing', 'fashion');
// LLM knows which contract to populate
```

## Next Steps

1. Review this proposal
2. If approved, I'll implement:
   - New directory structure
   - Question registry system
   - Updated question loader
   - Contract-aware LLM integration
   - Migration of existing questions

