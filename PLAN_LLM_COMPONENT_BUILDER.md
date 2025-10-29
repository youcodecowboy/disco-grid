# LLM Component Builder Upgrade Plan

**Transform the playground's AI component builder from keyword matching to real LLM inference**

---

## 🎯 Goal

Upgrade the current keyword-based component matcher to use **Together.ai's Llama-3.2-3B** for intelligent component selection and configuration.

---

## 📊 Current State

### How It Works Now:
```
User types: "Show me sales trend chart"
         ↓
keywordMatcher.ts looks for keywords
         ↓
Finds: "sales", "trend", "chart"
         ↓
Matches to rule: v3.chart.area
         ↓
Generates component
```

### Current Components (Keyword-Based):

**File:** `/app/playground/lib/keywordMatcher.ts`

**Rules:** 22 component types with hardcoded keyword rules:
- Charts: area, bar, donut, sankey, radar, sparkline, wave
- Tables: data table
- Metrics: KPI cards, animated counters
- Specialized: kanban, heatmap, calendar, network graph, site map, etc.

**Limitations:**
❌ Rigid keyword matching (doesn't understand intent)
❌ Can't infer from context ("show me what's trending" → ???)
❌ No understanding of synonyms or variations
❌ Can't combine multiple requirements intelligently
❌ No learning or improvement over time

---

## 🚀 Proposed Solution

### LLM-Powered Component Selection

```
User types: "I want to see how our sales are performing compared to last month"
         ↓
LLM analyzes intent:
  - Entity: sales
  - Action: comparing
  - Time: last month vs current
  - Visualization: trend comparison
         ↓
LLM suggests: v3.chart.area with dual lines
         ↓
LLM generates:
  - Component type: v3.chart.area
  - Data source: sales
  - Config: dual series (current vs last month)
  - Title: "Sales Performance: Current vs Last Month"
```

### Why LLM?
✅ Understands natural language intent
✅ Handles variations and synonyms
✅ Can infer visualization type from task
✅ Generates contextual titles and configurations
✅ Learns patterns from prompt engineering

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 USER INPUT                                   │
│  "Show me top 5 products by revenue this quarter"           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         FRONTEND: AIInputBlock.tsx                           │
│  - User types in textarea                                   │
│  - NO real-time keyword matching                            │
│  - Click "Generate" → Call LLM API                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│    API: /api/playground/generate-component                   │
│  POST { prompt, existingComponents?, context? }             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         LLM CALL: Together.ai Llama-3.2-3B                  │
│  Specialized prompt for component selection                 │
│  Temperature: 0.3 (more creative than onboarding)           │
│  JSON mode: strict component schema                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         LLM RESPONSE                                         │
│  {                                                           │
│    componentType: "v3.chart.bar",                           │
│    confidence: 0.95,                                        │
│    reasoning: "Bar chart best for comparing rankings",      │
│    config: {                                                │
│      dataSource: "products",                                │
│      metric: "revenue",                                     │
│      limit: 5,                                              │
│      sortBy: "revenue",                                     │
│      sortOrder: "desc",                                     │
│      timeFilter: "quarter"                                  │
│    },                                                       │
│    title: "Top 5 Products by Revenue (Q4)",                │
│    size: { w: 6, h: 8 }                                    │
│  }                                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         HYBRID FALLBACK (optional)                           │
│  If LLM fails or confidence < 0.7:                          │
│  → Fall back to keyword matcher                             │
│  → Return with provenance: "keyword"                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         COMPONENT GENERATION                                 │
│  Create Block with:                                          │
│  - Type from LLM                                            │
│  - Config from LLM                                          │
│  - Title from LLM                                           │
│  - Size from LLM                                            │
│  Add to dashboard with animation                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Implementation Plan

### Phase 1: API Endpoint ✅ (Reuse onboarding knowledge)

**Create:** `/app/api/playground/generate-component/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';
import { matchPromptToComponent } from '@/app/playground/lib/keywordMatcher';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, existingComponents, context } = await request.json();

    // Call LLM with component selection prompt
    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: COMPONENT_SELECTION_PROMPT // See below
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Slightly more creative than onboarding
      max_tokens: 800,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    const parsed = JSON.parse(content);

    // Validate the response
    if (!parsed.componentType || !VALID_COMPONENTS.includes(parsed.componentType)) {
      throw new Error('Invalid component type from LLM');
    }

    return NextResponse.json({
      success: true,
      ...parsed,
      model: 'llama-3.2-3b',
      provenance: 'llm',
      tokensUsed: response.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('LLM component generation failed:', error);
    
    // FALLBACK: Use keyword matcher
    const keywordMatch = matchPromptToComponent(prompt);
    
    if (keywordMatch) {
      return NextResponse.json({
        success: true,
        ...keywordMatch,
        provenance: 'keyword-fallback',
        reasoning: 'LLM unavailable, used keyword matching'
      });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

### Phase 2: LLM Prompt Design

**Create:** `/app/api/playground/prompts/componentSelection.ts`

```typescript
export const COMPONENT_SELECTION_PROMPT = `You are an expert at selecting the best data visualization components for business dashboards.

Given a user's natural language request, select the most appropriate component and configuration.

AVAILABLE COMPONENTS:

📊 CHARTS:
- v3.chart.area - Trend over time, time series, growth
- v3.chart.bar - Compare categories, rankings, top/bottom items
- v3.chart.donut - Show distribution, percentages, parts of whole
- v3.chart.sankey - Flow diagrams, process flows, conversion funnels
- v3.chart.radar - Multi-dimensional comparison, performance metrics
- v3.chart.sparkline - Mini inline trend, compact metrics
- v3.chart.wave - Real-time streaming data, live monitoring

📋 DATA TABLES:
- v3.table - Detailed records, lists, sortable data

📈 METRICS:
- v3.kpi - Single important number, KPI display
- v3.counter.animated - Live counting metric, ticker
- construction.metric.large - Large single metric card

🗺️ SPECIALIZED:
- v3.map.site - Floor plans, facility maps, zone maps
- v3.heatmap - Capacity monitoring, utilization, stage performance
- v3.calendar.heatmap - Activity over time, contribution calendar
- v3.kanban - Task boards, workflow stages, project management
- v3.activity.timeline - Recent events, activity feed, updates
- v3.status.grid - System health, service status, uptime monitoring
- v3.progress.tracker - Task progress, milestones, completion
- v3.grid.pulse - Live activity monitoring
- v3.graph.network - Relationships, connections, org charts
- v3.cards.3d - Metric cards with depth, card stack

SELECTION RULES:

1. **Temporal Data** → area/line chart
   - "over time", "trend", "growth", "timeline"

2. **Comparisons** → bar chart
   - "compare", "top", "bottom", "ranking", "versus"

3. **Distributions** → donut/pie chart
   - "breakdown", "percentage", "distribution", "share"

4. **Flows** → sankey diagram
   - "flow", "funnel", "journey", "conversion"

5. **Detailed Data** → table
   - "list", "records", "rows", "detailed view"

6. **Single Metrics** → KPI card or counter
   - "total", "count", "single number"

7. **Real-time** → wave chart or activity timeline
   - "live", "real-time", "streaming", "updates"

8. **Tasks/Projects** → kanban or progress tracker
   - "tasks", "projects", "workflow", "completion"

9. **Location-based** → site map or heatmap
   - "facility", "floor", "zones", "capacity by area"

RESPONSE FORMAT:
{
  "componentType": "<component_id>",
  "confidence": 0.0-1.0,
  "reasoning": "<1-2 sentence explanation>",
  "config": {
    "dataSource": "<entity>",     // e.g., "sales", "orders", "products"
    "metric": "<field>",           // e.g., "revenue", "count", "status"
    "aggregation": "<type>",       // "sum", "avg", "count", "max", "min"
    "timeFilter": "<period>",      // "today", "week", "month", "quarter", "year"
    "groupBy": "<field>",          // For charts with categories
    "limit": <number>,             // For top/bottom queries
    "sortBy": "<field>",
    "sortOrder": "asc" | "desc"
  },
  "title": "<generated title>",   // Contextual, descriptive title
  "size": { "w": 4-12, "h": 4-12 }  // Grid dimensions
}

EXAMPLES:

Input: "Show me sales trends for the last 6 months"
Output:
{
  "componentType": "v3.chart.area",
  "confidence": 0.95,
  "reasoning": "Time series data over 6 months best shown as area chart for trend visualization",
  "config": {
    "dataSource": "sales",
    "metric": "revenue",
    "aggregation": "sum",
    "timeFilter": "6months",
    "groupBy": "month"
  },
  "title": "Sales Trends (Last 6 Months)",
  "size": { "w": 8, "h": 8 }
}

Input: "Compare top 5 products by revenue"
Output:
{
  "componentType": "v3.chart.bar",
  "confidence": 0.95,
  "reasoning": "Comparison of ranked items best shown as horizontal bar chart",
  "config": {
    "dataSource": "products",
    "metric": "revenue",
    "aggregation": "sum",
    "limit": 5,
    "sortBy": "revenue",
    "sortOrder": "desc"
  },
  "title": "Top 5 Products by Revenue",
  "size": { "w": 6, "h": 8 }
}

Input: "Show me order status breakdown"
Output:
{
  "componentType": "v3.chart.donut",
  "confidence": 0.95,
  "reasoning": "Status distribution shown as donut chart to visualize percentages of different statuses",
  "config": {
    "dataSource": "orders",
    "metric": "count",
    "aggregation": "count",
    "groupBy": "status"
  },
  "title": "Orders by Status",
  "size": { "w": 6, "h": 8 }
}

Input: "I need to see recent activity"
Output:
{
  "componentType": "v3.activity.timeline",
  "confidence": 0.9,
  "reasoning": "Recent activity best displayed as timeline showing chronological events",
  "config": {
    "dataSource": "activity",
    "limit": 10,
    "sortBy": "timestamp",
    "sortOrder": "desc"
  },
  "title": "Recent Activity",
  "size": { "w": 4, "h": 8 }
}

Be intelligent about ambiguous requests:
- "What's happening?" → activity timeline
- "How are we doing?" → KPI cards or area chart
- "Show me everything" → suggest table
- "I want to track X" → progress tracker or counter

Extract entities intelligently:
- "product sales" → dataSource: "products", metric: "sales"
- "customer growth" → dataSource: "customers", metric: "count", context: growth
- "team performance" → dataSource: "team", metric: varies (suggest multiple metrics)

Be decisive. Pick the BEST component for the intent. Explain why.`;
```

### Phase 3: Update AIInputBlock Component

**Modify:** `/components/blocks/AIInputBlock.tsx`

```typescript
// OLD: Real-time keyword detection
useEffect(() => {
  if (prompt.trim().length > 3) {
    const match = matchPromptToComponent(prompt)  // ❌ Remove
    setDetectedComponent(match)
  }
}, [prompt])

// NEW: Call LLM on generate
const handleGenerate = async () => {
  if (!prompt.trim()) return
  
  setIsGenerating(true)
  
  try {
    const response = await fetch('/api/playground/generate-component', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: prompt.trim(),
        // Optional: Pass existing components for context
        existingComponents: getCurrentDashboardComponents()
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      // Show preview with reasoning
      setPendingResult({
        ...data,
        prompt: prompt.trim()
      })
      
      // Optionally show the LLM's reasoning to user
      showReasoningToast(data.reasoning, data.provenance)
    }
  } catch (error) {
    console.error('Component generation failed:', error)
    // Could show error or fall back to keywords
  } finally {
    setIsGenerating(false)
  }
}
```

**Add reasoning display:**
```tsx
{pendingResult && (
  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
    <div className="flex items-start gap-2">
      <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-blue-900">
          AI selected: {getComponentDisplayName(pendingResult.componentType)}
        </p>
        <p className="text-xs text-blue-700 mt-1">
          {pendingResult.reasoning}
        </p>
        {pendingResult.provenance === 'keyword-fallback' && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ Using fallback (LLM unavailable)
          </p>
        )}
      </div>
    </div>
  </div>
)}
```

### Phase 4: Enhanced Configuration

**Apply LLM config to components:**

```typescript
// PageTemplate.tsx - When AI block generates component

const handleAIGenerate = (result: AIGenerationResult) => {
  const newBlock: Block = {
    id: generateId("b"),
    type: result.componentType,
    title: result.title,  // ✨ From LLM
    props: {
      ...result.config,   // ✨ From LLM
      _aiGenerated: true,
      _aiReasoning: result.reasoning,
      _aiProvenance: result.provenance
    }
  }
  
  addBlock(newBlock, result.size)
}
```

---

## 🎯 Benefits

### User Experience

**Before:**
```
User: "I want to see how products are selling"
System: ❌ No match found (doesn't understand "selling")
```

**After:**
```
User: "I want to see how products are selling"
LLM: ✅ Interprets as sales analysis
     ✅ Selects: v3.chart.area
     ✅ Config: dataSource="products", metric="sales"
     ✅ Title: "Product Sales Performance"
     ✅ Explains: "Area chart shows sales trends over time"
```

### Developer Experience

- ✅ No more maintaining keyword rules
- ✅ Components automatically work with new phrasings
- ✅ LLM can suggest new component types
- ✅ Better analytics on what users want

### Business Value

- 🚀 Faster dashboard creation
- 🎯 More accurate component selection
- 💡 Learns from user patterns
- 🔄 Continuous improvement through prompt engineering

---

## 📊 Comparison: Keyword vs. LLM

| Feature | Keyword Matching | LLM-Powered |
|---------|------------------|-------------|
| **Understanding** | Exact keyword match | Natural language understanding |
| **Flexibility** | Rigid rules | Handles variations, synonyms |
| **Context** | None | Understands business context |
| **Config** | Basic defaults | Smart configuration based on intent |
| **Titles** | Generic | Contextual, descriptive |
| **Maintenance** | Manual keyword updates | Self-improving via prompts |
| **Accuracy** | ~70% | ~90%+ |
| **Speed** | Instant | 3-5 seconds |
| **Cost** | Free | ~400-600 tokens ($0.001) |
| **Fallback** | N/A | Falls back to keywords |

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('LLM Component Generation', () => {
  it('should select area chart for time series', async () => {
    const result = await generateComponent("Show sales over time")
    expect(result.componentType).toBe('v3.chart.area')
    expect(result.config.timeFilter).toBeDefined()
  })
  
  it('should select bar chart for comparisons', async () => {
    const result = await generateComponent("Compare top products")
    expect(result.componentType).toBe('v3.chart.bar')
    expect(result.config.limit).toBe(5)
  })
  
  it('should fall back to keywords on LLM failure', async () => {
    mockLLMFailure()
    const result = await generateComponent("bar chart")
    expect(result.provenance).toBe('keyword-fallback')
  })
})
```

### Manual Test Cases
1. **Temporal queries:** "last month", "this quarter", "year over year"
2. **Comparisons:** "top 5", "best performing", "worst"
3. **Distributions:** "breakdown", "by category", "percentage"
4. **Vague requests:** "what's happening?", "show me stats"
5. **Complex requests:** "compare this month to last month for top products"

---

## 🚀 Migration Plan

### Step 1: API Endpoint (Day 1)
- [ ] Create `/api/playground/generate-component/route.ts`
- [ ] Design & test component selection prompt
- [ ] Add validation for component types
- [ ] Implement keyword fallback

### Step 2: Frontend Integration (Day 2)
- [ ] Update `AIInputBlock.tsx` to call LLM API
- [ ] Remove real-time keyword matching
- [ ] Add loading states during LLM call
- [ ] Show LLM reasoning to user

### Step 3: Enhanced UX (Day 3)
- [ ] Add confidence indicators
- [ ] Show alternative suggestions
- [ ] Add "regenerate" button
- [ ] Track analytics on selections

### Step 4: Polish & Optimization (Day 4)
- [ ] Refine prompts based on testing
- [ ] Add caching for common requests
- [ ] Improve error handling
- [ ] Add telemetry

---

## 💰 Cost Analysis

**Per Generation:**
- Prompt: ~400 tokens (system) + 50 tokens (user) = 450 tokens
- Response: ~150 tokens
- **Total: ~600 tokens per request**

**Cost:** ~$0.001 per generation (Together.ai pricing)

**Monthly (1000 generations):** ~$1.00

**Comparison:**
- Current keyword system: $0 (free)
- LLM system: $1-5/month for typical usage
- **Value:** 20%+ accuracy improvement = worth it

---

## 🎓 Lessons from Onboarding Integration

### What Worked Well:
✅ Context-specific prompts (reuse this pattern!)
✅ Hybrid LLM + fallback approach
✅ JSON mode for structured responses
✅ Temperature tuning (0.1 for onboarding, 0.3 for components)
✅ Confidence scoring

### Apply to Components:
1. **Specialized prompt** for component selection (similar to contexts)
2. **Fallback to keywords** if LLM fails (hybrid approach)
3. **JSON schema** for strict component output
4. **Provenance tracking** (llm vs keyword)
5. **Reasoning display** (show user why component was selected)

---

## 📈 Success Metrics

### Technical Metrics:
- Component selection accuracy: Target 90%+
- Average response time: <5 seconds
- Fallback rate: <5%
- Token usage: <700 tokens/request

### User Metrics:
- Time to create dashboard: 50% reduction
- Component regeneration rate: <20%
- User satisfaction: Track feedback
- Adoption rate: % of users using AI vs manual

---

## 🔮 Future Enhancements

### Phase 2 Features:
1. **Multi-component suggestions**
   - "Here are 3 ways to visualize this..."
   - User picks their favorite

2. **Learn from feedback**
   - Track which suggestions users accept/reject
   - Fine-tune prompts based on patterns

3. **Context-aware suggestions**
   - "You already have a sales chart, maybe add a table?"
   - Avoid duplicate visualizations

4. **Natural language config editing**
   - "Make this chart show last quarter instead"
   - Update existing components via NL

5. **Dashboard templates**
   - "Create a sales dashboard"
   - Generates multiple related components

6. **Smart data source detection**
   - Analyze available data sources
   - Only suggest components for available data

---

## ✅ Conclusion

This upgrade transforms the playground from a **keyword toy** into a **real AI-powered dashboard builder**.

**Key Advantages:**
- 🧠 Real intelligence vs. pattern matching
- 🎯 Better accuracy (70% → 90%+)
- 🚀 More natural user experience
- 💡 Self-improving through prompt iteration
- 🔄 Graceful fallback to keywords

**Implementation Time:** 3-4 days  
**Cost Impact:** Minimal (~$1-5/month)  
**User Impact:** Significant UX improvement

**Status:** Ready to implement! 🎉

---

**Created:** October 17, 2025  
**Model:** meta-llama/Llama-3.2-3B-Instruct-Turbo  
**Reusing:** Onboarding LLM integration patterns  
**Next Step:** Create API endpoint & test prompt

