# Question System Refactor Proposal

## Problem Statement

Current issues:
- Fashion-specific questions (product types, compliance) are in `questions.common.json`
- No clear separation between common, industry-specific, and sub-industry-specific questions
- LLM doesn't know which contract structure to populate
- Dynamic follow-ups can't reliably check what's missing from the contract
- Hard to maintain and extend for new industries/sub-industries

## Proposed Solution: Hierarchical Question Registry with Contract Mapping

### 1. File Structure

```
app/onboarding-v2/content/
├── questions/
│   ├── common/
│   │   └── base.json                    # Welcome, industry_select, review (truly universal)
│   ├── manufacturing/
│   │   ├── common.json                  # Manufacturing questions that apply to all sub-industries
│   │   ├── fashion/
│   │   │   ├── company.json            # Fashion-specific company questions
│   │   │   ├── operations.json         # Fashion-specific operations questions
│   │   │   ├── items.json              # Fashion-specific items questions
│   │   │   └── ...
│   │   └── general/
│   │       ├── company.json            # General manufacturing company questions
│   │       └── ...
│   ├── construction/
│   │   ├── common.json
│   │   └── ...
│   └── defense/
│       ├── common.json
│       └── ...
└── question-registry.json              # Central registry mapping (industry, subIndustry) → question sets
```

### 2. Question Registry (`question-registry.json`)

Central mapping that defines:
- Which question sets to load for each (industry, subIndustry) combination
- Which contract structure corresponds to each combination
- Required vs optional question sections

```json
{
  "contracts": {
    "manufacturing.fashion": {
      "baseContract": "GenerationContractV1",
      "extensionContract": "ManufacturingContract",
      "extensionType": "manufacturingExt",
      "requiredSections": ["company", "operations", "items", "workflows"],
      "optionalSections": ["sites", "teams", "integrations", "analytics"]
    },
    "manufacturing.general": {
      "baseContract": "GenerationContractV1",
      "extensionContract": "ManufacturingContract",
      "extensionType": "manufacturingExt",
      "requiredSections": ["company", "operations", "items"],
      "optionalSections": ["workflows", "sites", "teams"]
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
        "manufacturing/common/workflows",
        "common/review"
      ],
      "contractPath": "manufacturing.general"
    }
  }
}
```

### 3. Enhanced Question Metadata

Each question gets contract-aware metadata:

```json
{
  "company_product_types": {
    "id": "company_product_types",
    "type": "multiple_choice",
    "section": "company",
    "prompt": "What products do you primarily produce?",
    "mapsTo": "company.productTypes",
    "required": true,
    
    // NEW: Contract awareness
    "contractMetadata": {
      "requiredFor": ["manufacturing.fashion"],  // Only required for fashion
      "optionalFor": ["manufacturing.general"],  // Optional for general
      "contractPath": "company.productTypes",    // Where this maps in contract
      "contractRequired": true,                  // Is this field required in contract?
      "skipIfCommitted": true                    // Skip if already extracted
    },
    
    // Industry filtering (existing)
    "industries": ["manufacturing"],
    "subIndustries": ["fashion"],
    
    "options": [...]
  }
}
```

### 4. Updated Question Loader

```typescript
// app/onboarding-v2/lib/question-loader.ts

import questionRegistry from '../content/question-registry.json';
import type { Industry, SubIndustry } from '../types.contract';
import type { Question } from '../types';

/**
 * Load questions for specific industry/sub-industry combination
 */
export function loadQuestionsForContext(
  industry?: Industry,
  subIndustry?: SubIndustry
): Question[] {
  if (!industry) {
    // No industry selected - load only base/common questions
    return loadQuestionSet(['common/base']);
  }
  
  const contextKey = subIndustry 
    ? `${industry}.${subIndustry}` 
    : `${industry}`;
  
  const config = questionRegistry.questionSets[contextKey];
  if (!config) {
    console.warn(`No question set found for ${contextKey}, falling back to common`);
    return loadQuestionSet(['common/base']);
  }
  
  // Load questions in specified order
  const questions: Question[] = [];
  for (const setPath of config.loadOrder) {
    const setQuestions = loadQuestionSet([setPath]);
    questions.push(...setQuestions);
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
      // Dynamic import based on path
      // e.g., "manufacturing/fashion/company" → import from content/questions/manufacturing/fashion/company.json
      const questionSet = require(`../content/questions/${path}.json`);
      questions.push(...Object.values(questionSet));
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
) {
  if (!industry) return null;
  
  const contextKey = subIndustry 
    ? `${industry}.${subIndustry}` 
    : `${industry}`;
  
  return questionRegistry.contracts[contextKey] || null;
}
```

### 5. Contract-Aware LLM Integration

```typescript
// app/onboarding-v2/lib/llm-contract-aware.ts

import { getContractMetadata } from './question-loader';
import type { GenerationContractV1, Industry, SubIndustry } from '../types.contract';

/**
 * Get LLM prompt context that includes contract structure awareness
 */
export function getContractAwarePromptContext(
  contract: GenerationContractV1,
  context: ExtractionContext
): string {
  const metadata = getContractMetadata(
    contract.company.industry,
    contract.company.subIndustry
  );
  
  if (!metadata) {
    return getStandardPrompt(context);
  }
  
  // Enhance prompt with contract structure awareness
  const contractInfo = `
CONTRACT STRUCTURE TO POPULATE:
- Base Contract: ${metadata.baseContract}
- Extension Contract: ${metadata.extensionContract}
- Extension Type: ${metadata.extensionType}
- Required Sections: ${metadata.requiredSections.join(', ')}
- Optional Sections: ${metadata.optionalSections.join(', ')}

When extracting entities, map them to the appropriate contract paths.
Required fields MUST be extracted with high confidence (>= 2).
Optional fields can be extracted with lower confidence (>= 1).
  `;
  
  return `${getStandardPrompt(context)}\n\n${contractInfo}`;
}
```

### 6. Contract Completeness Checker Enhancement

```typescript
// app/onboarding-v2/lib/contract-completeness.ts

import { getContractMetadata } from './question-loader';
import type { GenerationContractV1 } from '../types.contract';

/**
 * Check what's missing from contract based on context
 */
export function analyzeContractCompleteness(
  contract: GenerationContractV1
): CompletenessReport {
  const metadata = getContractMetadata(
    contract.company.industry,
    contract.company.subIndustry
  );
  
  if (!metadata) {
    return { complete: false, missingRequired: [], missingOptional: [] };
  }
  
  const missingRequired: string[] = [];
  const missingOptional: string[] = [];
  
  // Check required sections
  for (const section of metadata.requiredSections) {
    const sectionComplete = checkSectionCompleteness(contract, section, metadata);
    if (!sectionComplete.complete) {
      missingRequired.push(...sectionComplete.missingFields);
    }
  }
  
  // Check optional sections (lower priority)
  for (const section of metadata.optionalSections) {
    const sectionComplete = checkSectionCompleteness(contract, section, metadata);
    if (!sectionComplete.complete) {
      missingOptional.push(...sectionComplete.missingFields);
    }
  }
  
  return {
    complete: missingRequired.length === 0,
    missingRequired,
    missingOptional,
    contractMetadata: metadata
  };
}
```

### 7. Migration Strategy

**Phase 1: Create new structure**
1. Create new directory structure
2. Move questions to appropriate locations
3. Create question-registry.json

**Phase 2: Update loaders**
1. Update question-loader.ts to use new registry
2. Update contract-factory.ts to use registry for contract structure
3. Update LLM prompts to be contract-aware

**Phase 3: Enhance features**
1. Update contract completeness checker
2. Enhance dynamic follow-up questions with contract awareness
3. Add validation based on contract requirements

**Phase 4: Cleanup**
1. Deprecate old question files
2. Remove old question loading logic
3. Update all references

## Benefits

1. **Clear separation**: Common vs industry vs sub-industry questions
2. **Contract awareness**: LLM knows which structure to populate
3. **Maintainability**: Easy to add new industries/sub-industries
4. **Type safety**: Contract structure enforced at runtime
5. **Better completeness**: Know exactly what's missing from contract
6. **Dynamic follow-ups**: Can generate questions based on missing contract fields

## Example: Fashion Manufacturing Flow

1. User selects "Manufacturing" → loads base + manufacturing/common
2. User selects "Fashion" → loads manufacturing/fashion/* questions
3. System knows to use `ManufacturingContract` with `fashion` extension
4. LLM extracts entities mapping to fashion-specific contract paths
5. Completeness checker knows `company.productTypes` is required for fashion
6. Dynamic follow-ups generate if `company.productTypes` is missing

## Implementation Priority

1. **High**: Create new file structure and registry
2. **High**: Update question loader to use registry
3. **Medium**: Update LLM prompts with contract awareness
4. **Medium**: Enhance contract completeness checker
5. **Low**: Migrate existing questions (can be done incrementally)

