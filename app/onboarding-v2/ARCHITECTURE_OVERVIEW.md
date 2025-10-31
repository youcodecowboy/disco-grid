# Onboarding V2 Architecture Overview

**Purpose**: This document explains the architecture, data flow, and scaling considerations for the dynamic onboarding system that collects user information and generates personalized applications.

---

## Executive Summary

The onboarding system is a **contract-driven, LLM-enhanced, dynamic question engine** that:
1. Collects business information through intelligent, context-aware questions
2. Uses LLM extraction to parse natural language inputs
3. Builds a complete `GenerationContractV1` that serves as the blueprint for generating a customized application
4. Enables cross-section question skipping based on previously answered data
5. Supports multiple industries and sub-industries with question registry system

**Key Innovation**: Questions are dynamically loaded and filtered based on:
- Industry/sub-industry selection
- Previously committed contract data (smart skipping)
- Conditional logic dependencies
- Missing required fields detection

---

## System Architecture

### 1. Question Registry System

**Location**: `app/onboarding-v2/content/question-registry.json`

The registry defines which question sets load for each industry/sub-industry combination:

```json
{
  "questionSets": {
    "manufacturing.fashion": {
      "loadOrder": [
        "common/base",
        "manufacturing/fashion/company",
        "manufacturing/fashion/operations",
        "manufacturing/fashion/sites",
        "manufacturing/fashion/teams",
        "manufacturing/fashion/integrations",
        "manufacturing/fashion/analytics",
        "common/review"
      ],
      "contractPath": "manufacturing.fashion"
    }
  }
}
```

**Key Features**:
- Hierarchical structure: `industry/subIndustry`
- Modular question sets (one JSON file per section)
- Explicit load order
- Industry-specific contract extensions

**File Structure**:
```
content/questions/
├── common/
│   ├── base.json          # Welcome, industry select
│   └── review.json        # Review screen
└── manufacturing/
    └── fashion/
        ├── company.json
        ├── operations.json
        ├── sites.json
        ├── teams.json
        ├── integrations.json
        └── analytics.json
```

---

### 2. Question Loading Engine

**Location**: `app/onboarding-v2/lib/question-loader.ts`

**Function**: `loadQuestionsForIndustry(industry, subIndustry?)`

**Process**:
1. Determines which question sets to load based on industry/sub-industry
2. Loads question files in order
3. Deduplicates questions by ID
4. Filters questions based on industry/sub-industry matching
5. Returns filtered, ordered question array

**Deduplication**: Uses `Set<questionId>` to prevent duplicate questions from multiple sources.

**Loading Logic**:
```typescript
// Initial state: No industry selected
→ Load: common/base (welcome + industry select)

// Industry selected, no sub-industry (manufacturing)
→ Load: manufacturing/common (sub-industry selector)

// Industry + sub-industry selected (manufacturing.fashion)
→ Load: All question sets in loadOrder for manufacturing.fashion
```

---

### 3. Question Engine (Filtering Logic)

**Location**: `app/onboarding-v2/lib/question-engine.ts`

**Purpose**: Determines which questions should be shown to the user based on:
- Industry/sub-industry match
- Conditional dependencies (`showIf` logic)
- Already answered (`skipIfCommitted`)
- Required vs optional

**Key Functions**:

#### `shouldShowQuestion(question, contract, industry, subIndustry)`
Checks:
1. **Industry Match**: `question.industries.includes(industry)`
2. **Sub-Industry Match**: `question.subIndustries?.includes(subIndustry)`
3. **Dependencies Met**: `conditional.dependsOn` value matches `showIf`
4. **Already Answered**: `skipIfCommitted && contract field exists`

#### `getNextVisibleQuestionIndex(currentIndex, allQuestions, contract)`
Finds the next question that passes `shouldShowQuestion()`.

---

### 4. Dynamic Question Features

#### A. Conditional Questions
Questions appear/disappear based on previous answers:

```json
{
  "id": "operations_subcontract_stages",
  "conditional": {
    "dependsOn": "operations.subcontract_use",
    "showIf": true
  }
}
```

**Logic**: If `contract.operations.subcontract_use === true`, show this question.

#### B. Dynamic Options
Options populated from contract data:

```json
{
  "id": "operations_subcontract_stages",
  "dynamicOptionsFrom": "operations.stages_list"
}
```

**Logic**: Pulls `contract.operations.stages_list` array and creates options for each stage.

#### C. Smart Skipping
Questions skip if data already exists:

```json
{
  "id": "company_team_size_confirm",
  "skipIfCommitted": true,
  "mapsTo": "company.teamSizeTotal"
}
```

**Logic**: If `contract.company.teamSizeTotal` is already set, skip this question.

#### D. Reference Previous Values
Questions can reference earlier answers:

```json
{
  "id": "teams_total_people_confirm",
  "type": "confirm_number",
  "referenceField": "company.teamSizeTotal"
}
```

**Logic**: Shows "You mentioned earlier you have about 47 people total. Does that number still sound correct?"

---

### 5. LLM Integration

**Location**: `app/api/nlp/extract/prompts.ts` + `app/api/nlp/extract/route.ts`

#### Context-Specific Prompts
Each section has a focused LLM prompt that only extracts relevant entities:

- `company_profile` - Company info, products, capacity
- `operations` - Production flow, stages, planning
- `sites_facilities` - Locations, floors, zones
- `teams_departments` - Departments, roles, communication
- `integrations` - Systems, tools, data flow
- `analytics_metrics` - KPIs, dashboards, preferences

**Benefits**:
- Reduced token usage (60-80% reduction per call)
- Higher accuracy (focused extraction)
- Clear entity type definitions

#### Extraction Flow

1. **User Input**: Natural language answer to question
2. **LLM Extraction**: `/api/nlp/extract` endpoint
   - Uses context-specific prompt based on `question.promptContext`
   - Extracts entities with confidence scores
   - Returns JSON array of entities
3. **Confirmation Flow**: User confirms/rejects extracted entities
4. **Commitment**: Confirmed entities written to contract

**Entity Format**:
```json
{
  "type": "company_name",
  "value": "Istanbul Textiles Co.",
  "confidence": 3,
  "rawText": "We're Istanbul Textiles Co."
}
```

**Confidence Levels**:
- `3` = Explicit (clearly stated)
- `2` = Implied (can be inferred)
- `1` = Low confidence (may need confirmation)

---

### 6. Contract Storage & Data Model

**Storage**: Currently localStorage (mock application)

**Structure**: `GenerationContractV1` TypeScript interface

**Location**: `app/onboarding-v2/store/onboardingStore.ts` (Zustand store)

#### Data Flow

```
User Input
    ↓
StepContainer (UI Component)
    ↓
onboardingStore.updateContract()
    ↓
localStorage.setItem('onboarding_contract')
    ↓
Contract persists across page refreshes
```

#### Contract Sections & Dependencies

**Section Dependencies** (later sections reference earlier ones):

1. **Company** → **Operations**: Company size affects capacity questions
2. **Operations** → **Sites**: Stages inform zone questions
3. **Sites** → **Teams**: Floors inform department distribution
4. **Teams** → **Integrations**: Communication tools inform integration options
5. **Analytics** → **Design**: KPIs inform dashboard widgets

**Cross-Section References**:
- `analytics.alert_kpis` ← references `analytics.kpis_priority`
- `design.grid_layout_config` ← references `analytics.kpis_priority` + `analytics.default_dashboards`
- `teams.total_people_confirm` ← references `company.teamSizeTotal`

---

### 7. Question Type System

**Location**: `app/onboarding-v2/types.ts`

**Question Types**:
- `text_input` - Simple text
- `nlp_input` - Natural language (triggers LLM extraction)
- `multiple_choice` - Single or multi-select
- `yes_no` - Boolean
- `confirm_number` - Confirm/reject previous value
- `department_sizes` - Form table (dynamic rows)
- `color_picker` - Brand color selection
- `grid_layout_builder` - Dashboard widget arrangement
- `file_upload` - Logo/document upload

**Rendering**: `StepContainer.tsx` switches on `question.type` to render appropriate component.

---

### 8. Contract Completeness Analysis

**Location**: `app/onboarding-v2/lib/contract-completeness.ts`

**Purpose**: Identifies missing required fields to generate gap-filling questions.

**Process**:
1. Gets field definitions from registry (`requiredFields`, `optionalFields`)
2. Checks each required field against contract
3. Returns list of missing fields
4. Generates targeted questions for missing data

**Usage**: Used in "Gap Filling" stage before review to ensure completeness.

---

## Data Model Deep Dive

### Contract Structure

```typescript
interface GenerationContractV1 {
  version: "1.0.0";
  
  company: {
    // Identity
    name: string;
    industry: Industry;
    subIndustry?: SubIndustry;
    
    // Business details
    manufacturerType?: "MTO" | "Stock" | "WhiteLabel" | "Mixed";
    productTypes?: Array<"Jeans" | "Jackets" | ...>;
    capacityMonthlyPcs?: number;
    
    // ... 30+ fields
  };
  
  operations: {
    stages_list?: string[];           // ["Cutting", "Sewing", ...]
    stage_durations?: Record<string, number>;  // {"Cutting": 0.5, ...}
    subcontract_use?: boolean;
    subcontract_stages?: string[];    // References stages_list
    // ... 20+ fields
  };
  
  sites: {
    count?: number;
    list?: Array<{
      name: string;
      floors?: Array<{
        name: string;
        zones?: Array<{
          tag?: "Cutting" | "Sewing" | ...;
          people_count?: number;
        }>;
      }>;
    }>;
    flow_between_floors?: boolean;
    // ... 15+ fields
  };
  
  teams: {
    departments_list?: string[];       // ["Cutting", "Sewing", ...]
    department_sizes?: Record<string, number>;  // {"Cutting": 8, ...}
    supervisors?: Array<{
      department: string;              // References departments_list
      name: string;
    }>;
    // ... 20+ fields
  };
  
  integrations: {
    production_system?: "Paper" | "Spreadsheet" | "ERP" | ...;
    communication_tools?: string[];    // ["WhatsApp", "Email"]
    // ... 20+ fields
  };
  
  analytics: {
    default_dashboards?: string[];     // ["Production", "Quality"]
    kpis_priority?: string[];          // ["Output", "Efficiency"]
    alert_kpis?: string[];             // References kpis_priority
    // ... 15+ fields
  };
  
  design: {
    brand_primary?: string;           // Hex color
    grid_layout_config?: {
      widgets?: Array<{
        metric?: string;               // References analytics.kpis_priority
        size: string;
      }>;
    };
    // ... 10+ fields
  };
  
  metadata: {
    idempotencyKey: string;           // Unique identifier
    committedFields: string[];         // ["company.name", "operations.stages_list"]
    extractedEntities: any[];          // Raw LLM extractions
  };
}
```

### Data Relationships

**One-to-Many**:
- `company.productTypes` → Multiple products
- `operations.stages_list` → Multiple stages
- `sites.list[].floors[].zones` → Multiple zones per floor
- `teams.departments_list` → Multiple departments

**References**:
- `operations.subcontract_stages` references `operations.stages_list`
- `teams.supervisors[].department` references `teams.departments_list`
- `analytics.alert_kpis` references `analytics.kpis_priority`
- `design.grid_layout_config.widgets[].metric` references `analytics.kpis_priority`

**Hierarchical**:
- `sites.list[].floors[].zones[]` - Three-level nesting
- `teams.supervisors[].department` - References array element

---

## Storage & Persistence Strategy

### Current Implementation (Mock)

**Storage**: Browser localStorage
**Key**: `onboarding_contract`
**Format**: JSON stringified `GenerationContractV1`

**Update Frequency**: After every question answer

**Pros**:
- Simple, works immediately
- Persists across refreshes
- No backend required

**Cons**:
- Limited to single browser/device
- No versioning
- No conflict resolution

### Production Requirements

For scaling to multiple users generating applications:

#### 1. Database Schema

```sql
CREATE TABLE onboarding_contracts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  idempotency_key UUID UNIQUE NOT NULL,
  industry VARCHAR(50) NOT NULL,
  sub_industry VARCHAR(50),
  contract_data JSONB NOT NULL,
  version VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL,  -- 'draft', 'completed', 'generated'
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_contracts_user ON onboarding_contracts(user_id);
CREATE INDEX idx_contracts_status ON onboarding_contracts(status);
CREATE INDEX idx_contracts_industry ON onboarding_contracts(industry, sub_industry);
```

#### 2. API Endpoints

```
POST   /api/onboarding/contracts          # Create new contract
GET    /api/onboarding/contracts/:id     # Get contract
PUT    /api/onboarding/contracts/:id     # Update contract
POST   /api/onboarding/contracts/:id/commit  # Commit section
POST   /api/onboarding/contracts/:id/generate  # Generate application
```

#### 3. Versioning Strategy

**Contract Version**: Track `GenerationContractV1.version` in metadata
**Contract Schema Version**: Separate from contract version (for migrations)

**Migration Path**:
- Old contracts maintain original structure
- New contracts use latest schema
- Conversion functions migrate old → new when accessed

#### 4. Conflict Resolution

**Optimistic Locking**:
- Store `updated_at` timestamp
- On update, check `updated_at` matches
- If mismatch, return conflict error
- Frontend resolves conflict (show diff, allow merge)

---

## Application Generation from Contract

### Process Flow

```
Completed Contract
    ↓
Contract Validation (ensure all required fields)
    ↓
Application Template Selection
    ↓
Configuration Generation
    ↓
Resource Provisioning
    ↓
Application Deployment
    ↓
User Access Provisioned
```

### Contract → Application Mapping

#### 1. Dashboard Generation

```typescript
// From contract.analytics
const dashboards = contract.analytics.default_dashboards.map(name => ({
  id: `dashboard-${name.toLowerCase()}`,
  title: name,
  layout: contract.analytics.default_dashboard_type,
  widgets: generateWidgetsForDashboard(name, contract)
}));

// Widgets from contract.design.grid_layout_config
const widgets = contract.design.grid_layout_config.widgets.map(w => ({
  type: w.type,
  metric: w.metric,
  size: parseSize(w.size),  // "2x2" → {cols: 2, rows: 2}
  chartType: contract.analytics.visual_preference
}));
```

#### 2. Workflow Configuration

```typescript
// From contract.operations
const workflow = {
  stages: contract.operations.stages_list.map((name, idx) => ({
    id: `stage-${idx}`,
    name,
    duration: contract.operations.stage_durations[name],
    qcCheckpoint: contract.operations.qc_stages.includes(name)
  })),
  bufferTime: contract.operations.stage_buffer_use ? 0.5 : 0
};
```

#### 3. User Permissions

```typescript
// From contract.teams
const permissions = contract.teams.supervisors.map(s => ({
  userId: generateUserId(s.name),
  department: s.department,
  role: 'supervisor',
  alertChannels: contract.teams.communication_tools,
  autoAssignIssues: contract.teams.auto_assign_issues
}));
```

#### 4. Integration Setup

```typescript
// From contract.integrations
const integrations = {
  production: {
    system: contract.integrations.production_system,
    name: contract.integrations.production_system_name
  },
  orders: {
    platform: contract.integrations.order_platforms[0],  // Shopify
    webhookUrl: generateWebhookUrl()
  },
  communication: contract.integrations.communication_tools
};
```

#### 5. UI Theme

```typescript
// From contract.design
const theme = {
  primaryColor: contract.design.brand_primary,
  logo: contract.design.brand_logo_url,
  density: contract.design.ui_density,
  theme: contract.design.theme_style,
  interactionStyle: contract.design.interaction_style
};
```

---

## Scaling Considerations

### 1. Question Registry Growth

**Challenge**: As industries/sub-industries grow, registry becomes large.

**Solution**:
- Keep registry in database (not JSON file)
- Cache registry in Redis
- Lazy-load question sets on demand
- Version question sets independently

### 2. LLM Token Usage

**Current**: Context-specific prompts reduce tokens by 60-80%

**Optimization**:
- Cache common extractions
- Batch similar questions
- Use smaller models for simple extractions
- Fallback to rule-based extraction for high-confidence patterns

### 3. Contract Size

**Current**: ~10-20KB JSON per contract

**At Scale**:
- Store in JSONB column (PostgreSQL)
- Index frequently queried fields
- Archive old contracts
- Compress large nested arrays

### 4. Question Engine Performance

**Current**: Filters questions in-memory on every navigation

**Optimization**:
- Pre-compute visible questions for current contract state
- Cache filtered question lists
- Use binary search for question lookup
- Lazy-load question content

### 5. Application Generation Load

**When**: User completes onboarding → generate application

**Strategy**:
- Queue generation jobs (background processing)
- Use event-driven architecture
- Generate in stages (instant access → full features)
- Cache generated templates

### 6. Multi-Tenancy

**Requirements**:
- Each user gets isolated application instance
- Contract data scoped to user
- Shared question registry (read-only)
- User-specific customizations

**Database Design**:
```sql
-- User isolation
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  tenant_id UUID NOT NULL
);

-- Contract scoping
ALTER TABLE onboarding_contracts 
ADD CONSTRAINT fk_user 
FOREIGN KEY (user_id) REFERENCES users(id);

-- Application instances
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  contract_id UUID NOT NULL,
  user_id UUID NOT NULL,
  status VARCHAR(20),
  config JSONB,
  FOREIGN KEY (contract_id) REFERENCES onboarding_contracts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Dynamic Behavior Examples

### Example 1: Cross-Section Skipping

**Scenario**: User mentions departments in Company section

```typescript
// Question in Company section (nlp_input)
"What types of products do you make?"
→ LLM extracts: ["Jeans", "Jackets"]

// Later, Operations question:
"Which production stages involve these products?"
→ This question's options dynamically include "Jeans" and "Jackets"
→ If user already mentioned stages elsewhere, question may skip
```

### Example 2: Conditional Cascade

```typescript
// Question 1: "Do you subcontract any production?"
contract.operations.subcontract_use = true

// Question 2 appears: "Which stages are subcontracted?"
// Options dynamically populate from contract.operations.stages_list

// Question 3 appears: "Do you work with the same partners regularly?"
// Only shows if Question 2 has answers
```

### Example 3: Reference Previous Values

```typescript
// Company section: "How many employees?"
contract.company.teamSizeTotal = 47

// Teams section: "You mentioned earlier you have about 47 people total. Correct?"
// Shows confirmation with previous value pre-filled
// If user says "No", shows text input to update
```

---

## Key Engineering Decisions

### 1. Why Registry System?

**Problem**: Different industries need different questions.

**Solution**: Hierarchical registry allows:
- Industry-specific question sets
- Shared common questions
- Easy extension (add new industry = add new registry entry)

### 2. Why Contract-Driven?

**Problem**: Need to track completeness and enable smart skipping.

**Solution**: Contract as single source of truth:
- Questions reference contract paths (`mapsTo`)
- Engine checks contract state to filter questions
- LLM uses contract to identify missing fields

### 3. Why Context-Specific LLM Prompts?

**Problem**: Large token usage, lower accuracy with generic prompts.

**Solution**: Focused prompts:
- Each section has specialized prompt
- Reduces tokens by 60-80%
- Higher accuracy (focused entity types)
- Clearer extraction rules

### 4. Why Zustand Store?

**Problem**: Need reactive state management with persistence.

**Solution**: Zustand provides:
- Simple API
- localStorage persistence built-in
- TypeScript support
- Small bundle size

---

## Testing Strategy

### Unit Tests
- Question loader (deduplication, filtering)
- Question engine (conditional logic, skipping)
- Contract completeness (missing field detection)

### Integration Tests
- Full onboarding flow (all sections)
- LLM extraction → confirmation → commitment
- Dynamic question appearance/disappearance

### E2E Tests
- Complete user journey (welcome → review)
- Cross-section data references
- Contract persistence

---

## Future Enhancements

1. **A/B Testing**: Test different question wordings
2. **Question Analytics**: Track which questions cause drop-offs
3. **Progressive Saving**: Auto-save after each question
4. **Offline Support**: Queue answers when offline, sync when online
5. **Multi-Language**: Translate questions and contract fields
6. **Contract V2**: Support schema evolution

---

## Summary

The onboarding system is a **dynamic, contract-driven question engine** that:

1. **Loads questions** based on industry/sub-industry registry
2. **Filters questions** based on contract state and dependencies
3. **Extracts entities** using context-specific LLM prompts
4. **Stores data** in a unified contract structure
5. **Enables skipping** based on previously answered questions
6. **Generates applications** from completed contracts

**Key Innovation**: Questions adapt to user's answers, creating a personalized experience while collecting comprehensive business data for application generation.

The contract serves as the **blueprint** for generating a fully customized application instance, with every feature configured based on the user's specific business context.

