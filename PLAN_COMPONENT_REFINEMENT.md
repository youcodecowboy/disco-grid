# AI Component Refinement - Implementation Plan

## 🎯 Feature Overview

**Goal:** Allow users to refine existing AI-generated components through natural language follow-ups instead of deleting and recreating them.

**User Story:** "As a user, I want to modify an existing chart by asking 'show only January data' or 'change to bar chart' without starting over."

---

## 🎨 User Experience Flow

### Current (Without Refinement)
```
1. User: "Show me sales trends"
2. AI: Creates area chart
3. User wants to filter to January
4. User must DELETE chart
5. User must type ENTIRE new prompt: "Show me January sales trends"
6. AI creates new chart
❌ Tedious, loses context, feels clunky
```

### Proposed (With Refinement)
```
1. User: "Show me sales trends"
2. AI: Creates area chart with full data
3. User clicks "Refine" button on chart
4. Small input appears: "How would you like to modify this?"
5. User: "show only January"
6. AI: Updates chart in place, filters to January
7. History preserved: "Originally: sales trends | Refined: January only"
✅ Fast, contextual, feels magical
```

---

## 🏗️ Technical Architecture

### New Components

```
/app/api/playground/
├── prompts/
│   ├── componentSelection.ts (existing)
│   └── componentRefinement.ts (NEW) ← Refinement-focused prompt
├── generate-component/
│   └── route.ts (existing)
└── refine-component/
    └── route.ts (NEW) ← Refinement endpoint

/components/
├── blocks/
│   └── ComponentRefinementInput.tsx (NEW) ← Small inline input
└── PageTemplate.tsx (MODIFY) ← Add refine button + logic
```

---

## 📝 Implementation Steps

### Phase 1: Refinement System Prompt

**Create:** `/app/api/playground/prompts/componentRefinement.ts`

This prompt is **different** from component selection:
- **Focus:** Modifications, not creation
- **Context-aware:** Knows current component state
- **Operations:** Filter, transform, change type, adjust config

**Prompt structure:**
```typescript
export const COMPONENT_REFINEMENT_PROMPT = `You are an expert at refining data visualizations based on user feedback.

You are given:
1. CURRENT COMPONENT: Type, configuration, title, data
2. USER REQUEST: Natural language modification

Your job: Determine how to modify the component.

MODIFICATION TYPES:

1. DATA FILTERING
   - Time: "show only January", "last 30 days", "Q4 only"
   - Value: "top 5 only", "over $1000", "completed items"
   - Category: "just products", "exclude returns"

2. VISUALIZATION CHANGE
   - Type: "change to bar chart", "make it a donut", "show as table"
   - Size: "make it bigger", "compact view", "full width"
   - Style: "add trend line", "show percentages", "stack bars"

3. CONFIGURATION ADJUSTMENT
   - Sorting: "sort by revenue", "alphabetical", "newest first"
   - Grouping: "group by month", "break down by category"
   - Aggregation: "show average instead", "total per day"

4. TITLE/LABEL UPDATE
   - "rename to X", "better title", "more descriptive"

RESPONSE FORMAT:
{
  "modificationType": "filter" | "changeType" | "configAdjust" | "titleUpdate" | "combination",
  "newComponentType": "<component_id_if_changed>",
  "configChanges": {
    "timeFilter": "...",
    "limit": number,
    "filterCriteria": {...},
    // only changed fields
  },
  "newTitle": "<updated_title>",
  "reasoning": "<explain what changed and why>",
  "confidence": 0.0-1.0
}

EXAMPLES:

Current: { type: "v3.chart.area", title: "Sales Trends", config: { dataSource: "sales" } }
Request: "show only January"
Response:
{
  "modificationType": "filter",
  "newComponentType": "v3.chart.area",
  "configChanges": {
    "timeFilter": "january",
    "filterCriteria": { "month": 1 }
  },
  "newTitle": "Sales Trends (January)",
  "reasoning": "Added time filter to show only January data while keeping area chart visualization",
  "confidence": 0.95
}

Current: { type: "v3.chart.donut", title: "Orders by Status" }
Request: "change to bar chart"
Response:
{
  "modificationType": "changeType",
  "newComponentType": "v3.chart.bar",
  "configChanges": {},
  "newTitle": "Orders by Status",
  "reasoning": "Changed visualization from donut to bar chart for better comparison of status counts",
  "confidence": 0.98
}

Current: { type: "v3.chart.bar", title: "Top Products", config: { limit: 10 } }
Request: "show top 3 only"
Response:
{
  "modificationType": "configAdjust",
  "newComponentType": "v3.chart.bar",
  "configChanges": {
    "limit": 3
  },
  "newTitle": "Top 3 Products",
  "reasoning": "Reduced limit from 10 to 3 to focus on top performers",
  "confidence": 0.99
}

Current: { type: "v3.table", title: "All Orders" }
Request: "only show completed orders"
Response:
{
  "modificationType": "filter",
  "newComponentType": "v3.table",
  "configChanges": {
    "filterCriteria": { "status": "completed" }
  },
  "newTitle": "Completed Orders",
  "reasoning": "Added status filter to show only completed orders",
  "confidence": 0.95
}

Be smart about ambiguous requests:
- "make it better" → suggest specific improvements
- "show more" → increase limit or expand timeframe
- "simplify" → reduce data points or change to simpler viz

Always preserve the user's intent while improving clarity.`;
```

---

### Phase 2: Refinement API Endpoint

**Create:** `/app/api/playground/refine-component/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';
import { COMPONENT_REFINEMENT_PROMPT } from '../prompts/componentRefinement';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { 
      refinementPrompt,
      currentComponent 
    } = await request.json();

    // Validate inputs
    if (!refinementPrompt || !currentComponent) {
      return NextResponse.json({
        success: false,
        error: 'Refinement prompt and current component are required'
      }, { status: 400 });
    }

    // Build context message with current component state
    const contextMessage = `
CURRENT COMPONENT:
Type: ${currentComponent.type}
Title: ${currentComponent.title}
Config: ${JSON.stringify(currentComponent.config, null, 2)}

USER REQUEST: ${refinementPrompt}
`;

    // Call LLM with refinement prompt
    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: COMPONENT_REFINEMENT_PROMPT
        },
        {
          role: "user",
          content: contextMessage
        }
      ],
      temperature: 0.2, // Lower than creation (0.3) for more precise modifications
      max_tokens: 600,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from LLM');
    }

    const parsed = JSON.parse(content);

    // Validate confidence
    if (parsed.confidence < 0.6) {
      return NextResponse.json({
        success: false,
        error: 'Unable to understand refinement request. Please be more specific.',
        suggestion: 'Try: "show only January" or "change to bar chart"'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      modificationType: parsed.modificationType,
      newComponentType: parsed.newComponentType,
      configChanges: parsed.configChanges,
      newTitle: parsed.newTitle,
      reasoning: parsed.reasoning,
      confidence: parsed.confidence,
      provenance: 'llm-refinement',
      model: 'llama-3.2-3b',
      tokensUsed: response.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('Component refinement failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

---

### Phase 3: Refinement UI Component

**Create:** `/components/blocks/ComponentRefinementInput.tsx`

```tsx
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ComponentRefinementInputProps {
  blockId: string
  currentComponent: {
    type: string
    title: string
    config: Record<string, any>
  }
  onRefine: (result: any) => void
  onCancel: () => void
}

export function ComponentRefinementInput({
  blockId,
  currentComponent,
  onRefine,
  onCancel
}: ComponentRefinementInputProps) {
  const [prompt, setPrompt] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRefine = async () => {
    if (!prompt.trim() || isRefining) return

    setError(null)
    setIsRefining(true)

    try {
      const response = await fetch('/api/playground/refine-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refinementPrompt: prompt.trim(),
          currentComponent
        })
      })

      const data = await response.json()

      if (data.success) {
        onRefine(data)
      } else {
        setError(data.error || 'Failed to refine component')
      }
    } catch (err) {
      console.error('Refinement failed:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsRefining(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleRefine()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg"
    >
      <div className="flex items-center gap-2 mb-2">
        <Wand2 className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-medium text-purple-900">
          Refine this component
        </span>
        <button
          onClick={onCancel}
          className="ml-auto text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 'show only January' or 'change to bar chart'"
          className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded 
                   focus:outline-none focus:border-purple-500"
          autoFocus
          disabled={isRefining}
        />
        <Button
          onClick={handleRefine}
          disabled={!prompt.trim() || isRefining}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isRefining ? 'Refining...' : <Send className="w-4 h-4" />}
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      <p className="mt-2 text-xs text-gray-500">
        Original: {currentComponent.title}
      </p>
    </motion.div>
  )
}
```

---

### Phase 4: Add Refine Button to Components

**Modify:** `/components/PageTemplate.tsx`

Add refine button to component card header:

```tsx
// Add state for refinement
const [refiningBlock, setRefiningBlock] = useState<string | null>(null)

// In the component card rendering:
<CardHeader className="flex-shrink-0 flex flex-row items-center justify-between py-3 px-4">
  <CardTitle className="text-base font-semibold">
    {block.title}
  </CardTitle>
  
  <div className="flex items-center gap-2">
    {/* Show Refine button if AI-generated */}
    {block.props?._aiGenerated && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setRefiningBlock(item.i)}
        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
      >
        <Wand2 className="w-4 h-4" />
      </Button>
    )}
    
    {/* Existing edit/delete buttons */}
    {/* ... */}
  </div>
</CardHeader>

{/* Refinement input (shows below title when active) */}
<AnimatePresence>
  {refiningBlock === item.i && (
    <ComponentRefinementInput
      blockId={item.i}
      currentComponent={{
        type: block.type,
        title: block.title,
        config: block.props || {}
      }}
      onRefine={(result) => handleComponentRefinement(item.i, result)}
      onCancel={() => setRefiningBlock(null)}
    />
  )}
</AnimatePresence>
```

---

### Phase 5: Refinement Logic

**Modify:** `/components/PageTemplate.tsx`

Add handler for refinement:

```tsx
const handleComponentRefinement = (blockId: string, refinement: any) => {
  setState(prev => {
    const currentBlock = prev.blocks[blockId]
    if (!currentBlock) return prev

    // Merge config changes
    const updatedConfig = {
      ...currentBlock.props,
      ...refinement.configChanges,
      _aiRefinements: [
        ...(currentBlock.props?._aiRefinements || []),
        {
          prompt: refinement.prompt,
          modificationType: refinement.modificationType,
          timestamp: new Date().toISOString()
        }
      ]
    }

    // Update block
    const updatedBlock = {
      ...currentBlock,
      type: refinement.newComponentType || currentBlock.type,
      title: refinement.newTitle || currentBlock.title,
      props: updatedConfig
    }

    return {
      ...prev,
      blocks: {
        ...prev.blocks,
        [blockId]: updatedBlock
      }
    }
  })

  // Close refinement input
  setRefiningBlock(null)

  // Show success toast (optional)
  console.log('Component refined:', refinement.reasoning)
}
```

---

## 📊 Refinement Types Supported

### 1. Time Filtering
- "show only January"
- "last 30 days"
- "Q4 data"
- "this year"

### 2. Value Filtering
- "top 3 only"
- "over $1000"
- "completed items"
- "exclude returns"

### 3. Visualization Type Change
- "change to bar chart"
- "make it a table"
- "show as donut"

### 4. Configuration Adjustments
- "sort by revenue"
- "alphabetical order"
- "group by month"
- "show averages"

### 5. Limit Changes
- "show more items"
- "top 10"
- "reduce to 5"

### 6. Title Updates
- "rename to Sales Overview"
- "better title"
- "more descriptive"

---

## 🎯 Key Features

### Context Preservation
✅ Knows current component state  
✅ Understands modification intent  
✅ Preserves unrelated config  
✅ Updates only what's needed

### Refinement History
✅ Stores all refinements in `_aiRefinements[]`  
✅ Tracks: prompt, type, timestamp  
✅ Enables "undo" functionality (future)

### Smart Inference
✅ "show more" → increases limit intelligently  
✅ "simplify" → suggests appropriate changes  
✅ "make better" → contextual improvements

### Error Handling
✅ Low confidence (<0.6) → asks for clarification  
✅ Provides suggestions for better prompts  
✅ Graceful fallback

---

## 💰 Cost Analysis

**Per Refinement:**
- System prompt: ~1000 tokens (smaller than creation)
- Context: ~200 tokens (current component state)
- User prompt: ~20 tokens
- Response: ~100 tokens
- **Total: ~1300 tokens = $0.00026**

**Comparison:**
- Create new component: 2200 tokens = $0.00044
- Refine existing: 1300 tokens = $0.00026
- **Savings: 40% per refinement vs recreation**

---

## 🧪 Test Scenarios

### Test 1: Time Filtering
```
Original: "Show me sales trends"
Refine: "show only January"
Expected: Adds timeFilter, updates title
```

### Test 2: Limit Change
```
Original: "Top products by revenue"
Refine: "top 3 only"
Expected: Changes limit from 10 to 3
```

### Test 3: Type Change
```
Original: "Order status" (donut chart)
Refine: "change to bar chart"
Expected: Changes componentType, preserves config
```

### Test 4: Multiple Changes
```
Original: "Sales by region"
Refine: "show only Q4, sort by value"
Expected: Adds filter + changes sort
```

---

## 📈 Success Metrics

- [ ] Refinement accuracy: 85%+
- [ ] Response time: < 4 seconds
- [ ] User refinements: 30%+ of AI components get refined
- [ ] Refinement success rate: 90%+ (not deleted after refinement)
- [ ] Token usage: < 1500 tokens per refinement

---

## 🚀 Rollout Plan

### Week 1: Core Infrastructure
- [ ] Create refinement system prompt
- [ ] Build refinement API endpoint
- [ ] Add validation and error handling

### Week 2: UI Implementation
- [ ] Create ComponentRefinementInput component
- [ ] Add Refine button to component cards
- [ ] Wire up refinement logic in PageTemplate

### Week 3: Testing & Polish
- [ ] Test all refinement types
- [ ] Add loading states and animations
- [ ] Implement refinement history tracking
- [ ] Add success/error feedback

### Week 4: Documentation & Launch
- [ ] Update AI_PLAYGROUND_COMPONENT_GUIDE.md
- [ ] Create refinement examples guide
- [ ] Add to development changelog
- [ ] Soft launch to power users

---

## 🔮 Future Enhancements

### Phase 2 Features
1. **Undo/Redo** - Revert to previous states
2. **Refinement Suggestions** - "You might also want to..."
3. **Batch Refinements** - Apply to multiple components
4. **Voice Refinements** - "Hey, show only January"
5. **Refinement Templates** - Common modifications (filter, sort, etc.)

---

## ✅ Summary

**What:** Natural language refinement of existing AI-generated components  
**Why:** Faster iteration, better UX, less deletion/recreation  
**How:** New API endpoint with context-aware prompting  
**Cost:** ~$0.00026 per refinement (40% cheaper than recreation)  
**Timeline:** 3-4 weeks for full implementation  
**Impact:** Transforms playground from "one-shot" to "iterative" creation

This feature makes the AI playground feel **truly intelligent** - it remembers what you built and helps you evolve it! 🪄✨

