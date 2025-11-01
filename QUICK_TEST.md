# Quick Test Guide for Task LLM API

## Prerequisites

1. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Server should start on http://localhost:3000

2. **Set TOGETHER_API_KEY** (if not already set):
   ```bash
   export TOGETHER_API_KEY=your_api_key_here
   ```
   Or add to `.env.local`:
   ```
   TOGETHER_API_KEY=your_api_key_here
   ```

## Running Tests

### Option 1: Use the test script
```bash
./test-task-llm-api.sh
```

### Option 2: Manual curl tests

#### Basic Test (default options)
```bash
curl -X POST http://localhost:3000/api/tasks-v2/llm-suggest \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.'
```

#### Test with time horizon
```bash
curl -X POST http://localhost:3000/api/tasks-v2/llm-suggest \
  -H "Content-Type: application/json" \
  -d '{"timeHorizon": 14}' | jq '.'
```

#### Test with team filter
```bash
curl -X POST http://localhost:3000/api/tasks-v2/llm-suggest \
  -H "Content-Type: application/json" \
  -d '{"teamIds": ["team-1"]}' | jq '.'
```

#### Test with optimization weights
```bash
curl -X POST http://localhost:3000/api/tasks-v2/llm-suggest \
  -H "Content-Type: application/json" \
  -d '{
    "optimizationWeights": {
      "capacityUtilization": 0.5,
      "timelineOptimization": 0.3,
      "processEfficiency": 0.2
    }
  }' | jq '.'
```

#### Test minimal strategy (faster)
```bash
curl -X POST http://localhost:3000/api/tasks-v2/llm-suggest \
  -H "Content-Type: application/json" \
  -d '{"strategy": "minimal"}' | jq '.'
```

## Expected Response Structure

```json
{
  "success": true,
  "suggestions": [
    {
      "id": "suggest-...",
      "title": "Task title",
      "description": "Task description",
      "rationale": "Why this task is needed",
      "recommendedTeamId": "team-1",
      "recommendedTeamLabel": "Team Name",
      "suggestedDueDate": "2025-10-15T10:00:00Z",
      "priority": "high",
      "confidence": 0.85,
      "estimatedMinutes": 120,
      "tags": ["tag1", "tag2"],
      "linkedContext": "Context label",
      "contextType": "order",
      "contextId": "order-id",
      "expectedOutcome": "Expected result",
      "highlights": ["Point 1", "Point 2"],
      "createdAt": "2025-10-10T10:00:00Z"
    }
  ],
  "optimizations": [
    {
      "taskId": "task-id",
      "taskTitle": "Current task title",
      "action": "reschedule",
      "currentValue": "Current value",
      "suggestedValue": "New value",
      "rationale": "Why this optimization helps",
      "confidence": 0.80,
      "expectedImpact": "Expected improvement",
      "requiresApproval": true,
      "canAutoApply": false,
      "processedAt": "2025-10-10T10:00:00Z"
    }
  ],
  "analysis": {
    "totalContextItems": 150,
    "optimizationOpportunities": ["Opportunity 1", "Opportunity 2"],
    "riskFactors": ["Risk 1", "Risk 2"]
  },
  "metadata": {
    "model": "openai/gpt-oss-20b",
    "tokensUsed": 2500,
    "durationMs": 3500,
    "contextCollectedAt": "2025-10-10T10:00:00Z",
    "timeHorizon": 7,
    "totalContextItems": 150
  }
}
```

## Validation Checklist

- [ ] Response has `success: true`
- [ ] `suggestions` is an array
- [ ] `optimizations` is an array
- [ ] Each suggestion has required fields (title, rationale, confidence, priority)
- [ ] Each optimization has required fields (taskId, action, rationale, confidence)
- [ ] Confidence scores are between 0 and 1
- [ ] Priority values are valid (critical, high, medium, low)
- [ ] Team IDs match existing teams
- [ ] Context types are valid
- [ ] Metadata includes model, tokensUsed, durationMs

## Troubleshooting

1. **401 Unauthorized**: Check TOGETHER_API_KEY is set
2. **500 Internal Server Error**: Check server logs for details
3. **Empty suggestions**: Normal if context doesn't indicate need for new tasks
4. **Slow response**: LLM calls take 3-10 seconds typically

