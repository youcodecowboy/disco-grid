# LLM Reference Library

**Purpose:** Centralized source of truth for enum definitions and natural language → structured data mappings used across all LLM integrations.

## Overview

This library provides:
1. **Enum Definitions** - All canonical values used in the application
2. **Natural Language Mappings** - Comprehensive mappings from user input to enum values
3. **Component Mappings** - Natural language → dashboard component type mappings
4. **Helper Functions** - Utilities for mapping natural language to structured data

## Structure

```
lib/llm/references/
├── enums.ts              # All enum definitions (canonical values)
├── mappings.ts           # Natural language → enum mappings
├── component-mappings.ts # Natural language → component type mappings
├── index.ts             # Main exports
└── README.md            # This file
```

## Usage

### Importing Enums

```typescript
import { OPERATIONS_MODELS, WORKFLOW_STAGES, DEPARTMENTS } from '@/lib/llm/references';

// Use in prompts or validation
const opsModel = OPERATIONS_MODELS.MTO; // 'MTO'
```

### Mapping Natural Language to Enums

```typescript
import { mapNaturalLanguageToEnum, NL_TO_OPS_MODEL } from '@/lib/llm/references';

// Map user input to canonical value
const userInput = "we make custom orders";
const opsModel = mapNaturalLanguageToEnum(userInput, NL_TO_OPS_MODEL);
// Returns: 'MTO'
```

### Component Selection

```typescript
import { mapNaturalLanguageToComponent, getComponentCandidates } from '@/lib/llm/references';

// Get component type from user request
const userRequest = "show me sales trends over time";
const componentType = mapNaturalLanguageToComponent(userRequest);
// Returns: 'v3.chart.area'

// Get multiple candidates with confidence
const candidates = getComponentCandidates(userRequest);
// Returns: [{ componentType: 'v3.chart.area', confidence: 1.0, reason: '...' }]
```

## Mappings Available

### Operations & Production
- `NL_TO_OPS_MODEL` - Operations model (MTO/MTS/hybrid)
- `NL_TO_MANUFACTURER_TYPE` - Manufacturer type
- `NL_TO_PLANNING_METHOD` - Planning method
- `NL_TO_DAILY_PLANNING_STYLE` - Daily planning style

### Workflows & Stages
- `NL_TO_WORKFLOW_STAGE` - Workflow stage names
- `NL_TO_DEPARTMENT` - Department names
- `NL_TO_WORKFLOW_INPUT_TYPE` - Workflow input types
- `NL_TO_WORKFLOW_OUTPUT_TYPE` - Workflow output types
- `NL_TO_WORKFLOW_DEPENDENCY_TYPE` - Workflow dependency types

### Teams & Communication
- `NL_TO_SHIFT_STRUCTURE` - Shift structures
- `NL_TO_COMMUNICATION_METHOD` - Communication methods
- `NL_TO_TRAINING_METHOD` - Training methods
- `NL_TO_PERFORMANCE_TRACKING` - Performance tracking types

### Systems & Integrations
- `NL_TO_PRODUCTION_SYSTEM` - Production system types
- `NL_TO_INVENTORY_SYSTEM` - Inventory system types
- `NL_TO_ORDER_SYSTEM` - Order system types
- `NL_TO_ACCOUNTING_SYSTEM` - Accounting system types

### And many more...

See `mappings.ts` for the complete list.

## Benefits

1. **Consistency** - Single source of truth for all mappings
2. **Maintainability** - Update mappings in one place
3. **Accuracy** - Comprehensive mappings improve LLM extraction accuracy
4. **Testability** - Easy to test and validate mappings
5. **Documentation** - Serves as documentation for valid values

## Future Enhancements

- [ ] Add validation schemas (Zod)
- [ ] Add examples for each mapping
- [ ] Add confidence scoring
- [ ] Add multi-language support
- [ ] Generate prompt snippets from mappings

## Integration with LLM Prompts

Instead of embedding mappings in prompts, reference this library:

```typescript
// OLD (in prompt):
// Mapping: "made to order" → MTO, "custom order" → MTO, ...

// NEW (reference library):
import { NL_TO_OPS_MODEL } from '@/lib/llm/references';

const prompt = `Extract operations model. Valid values: ${Object.values(OPERATIONS_MODELS).join(', ')}.
Mappings: ${JSON.stringify(NL_TO_OPS_MODEL, null, 2)}`;
```

## Contributing

When adding new mappings:
1. Add enum definition to `enums.ts`
2. Add natural language mappings to `mappings.ts`
3. Update this README if needed
4. Export from `index.ts`

