# Onboarding V2: Question → Prompt Mapping

**Simple 1-to-1 attribution between questions and LLM prompts.**

Each NLP question specifies which prompt context to use via the `promptContext` field.

---

## 📝 Current Mappings

| Question ID | User Sees | Prompt Used | What It Extracts |
|-------------|-----------|-------------|------------------|
| **company_intro_nlp** | "Tell us about your operations" | `company_profile` | company_name, industry, location, team_size, facilities, product_category |
| **operations_model_nlp** | "Describe your production process" | `operations` | ops_model, capacity, shifts, lead_time, seasonality, tracking_level |
| **items_types_nlp** | "What types of items do you produce?" | `items_products` | product_category, component, item_attribute, tracking_level |
| **workflow_process_nlp** | "Describe your production process from start to finish" | `workflows` | workflow_stage, quality_checkpoint, department |
| **teams_structure_nlp** | "Describe your team structure" | `teams_departments` | department, team_size |
| **analytics_metrics_nlp** | "What metrics matter most to you?" | `analytics_metrics` | kpi, customer_segment, report_frequency |

---

## 🗂️ File Structure

```
/app/onboarding-v2/
├── content/
│   └── questions.en.json          ← Questions with promptContext field
├── types.ts                        ← ExtractionContext type definition
└── components/
    └── StepContainer.tsx           ← Uses question.promptContext

/app/api/nlp/extract/
├── prompts.ts                      ← 9 context-specific prompts
└── route.ts                        ← API accepts "context" parameter
```

---

## 🔧 How It Works

### 1. Question Definition (`questions.en.json`)
```json
{
  "company_intro_nlp": {
    "id": "company_intro_nlp",
    "type": "nlp_input",
    "section": "company",
    "promptContext": "company_profile",    ← Specifies which prompt to use
    "prompt": "Tell us about your operations",
    ...
  }
}
```

### 2. Extraction Call (`StepContainer.tsx`)
```typescript
// Simple - just pass the question's promptContext to the LLM
const result = await extractEntitiesWithLLM(currentValue, question.promptContext);
```

### 3. API Route (`/api/nlp/extract/route.ts`)
```typescript
const { text, context } = await request.json();
const promptConfig = getPromptForContext(context); // Gets the specific prompt
```

### 4. Prompt Library (`/api/nlp/extract/prompts.ts`)
```typescript
export const CONTEXT_PROMPTS: Record<ExtractionContext, ContextPromptConfig> = {
  company_profile: {
    entityTypes: ['company_name', 'industry', 'location', ...],
    systemPrompt: "You are an expert at extracting company profile information..."
  },
  // ... 8 more specialized prompts
}
```

---

## ➕ Adding a New Question with LLM Extraction

1. **Add question to `questions.en.json`:**
```json
{
  "integrations_systems_nlp": {
    "id": "integrations_systems_nlp",
    "type": "nlp_input",
    "section": "integrations",
    "promptContext": "integrations",   ← Points to existing prompt
    "prompt": "What systems do you currently use?",
    "helper": "List any ERP, MRP, or other software.",
    "placeholder": "We use SAP for ERP and Excel for production planning...",
    "required": true,
    "mapsTo": "integrations.systems",
    "minLength": 20,
    "maxLength": 300
  }
}
```

2. **That's it!** The system automatically:
   - Uses the `integrations` prompt from `/api/nlp/extract/prompts.ts`
   - Extracts relevant entities (integration, erp_system, mrp_system)
   - Shows confirmation screen with extracted data

---

## 🎯 Benefits

✅ **Simple** - One field (`promptContext`) = entire prompt configuration  
✅ **Flexible** - Multiple questions can share the same prompt  
✅ **Efficient** - 60-70% token reduction vs. generic prompts  
✅ **Maintainable** - Easy to see which prompt each question uses  
✅ **Type-safe** - TypeScript ensures valid prompt contexts  

---

## 📊 Available Prompt Contexts

- `company_profile` - Company info, products, team size, locations
- `operations` - Ops model, capacity, shifts, lead times
- `items_products` - Products, components, attributes
- `workflows` - Process stages, quality checks, departments
- `sites_facilities` - Locations, zones, square footage
- `teams_departments` - Departments, roles, team structure
- `integrations` - ERP, MRP, existing systems
- `analytics_metrics` - KPIs, customer segments, reporting
- `playbooks_tasks` - Recurring tasks, quality checks
- `general` - Fallback for multi-topic questions

---

**Last Updated:** October 17, 2025

