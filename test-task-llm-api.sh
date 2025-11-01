#!/bin/bash

# Test script for Task LLM Suggestion API
# Usage: ./test-task-llm-api.sh

API_URL="http://localhost:3000/api/tasks-v2/llm-suggest"

echo "🧪 Testing Task LLM Suggestion API"
echo "=================================="
echo ""

# Check if server is running
echo "🔍 Checking if dev server is running..."
if ! curl -s "$API_URL" -X POST -H "Content-Type: application/json" -d '{}' --max-time 2 > /dev/null 2>&1; then
  echo "❌ Server is not running!"
  echo ""
  echo "Please start the dev server first:"
  echo "  npm run dev"
  echo ""
  echo "Then run this script again in another terminal."
  exit 1
fi

echo "✅ Server is running"
echo ""

# Check if TOGETHER_API_KEY is set
if [ -z "$TOGETHER_API_KEY" ]; then
  echo "⚠️  Warning: TOGETHER_API_KEY not set in environment."
  echo "   Set it with: export TOGETHER_API_KEY=your_key"
  echo "   Or create .env.local with: TOGETHER_API_KEY=your_key"
  echo ""
fi

# Test 1: Basic request
echo "📋 Test 1: Basic request (default options)"
echo "-------------------------------------------"
RESPONSE=$(curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\nHTTP_STATUS:%{http_code}" \
  -s)

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo "HTTP Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "200" ]; then
  echo "$BODY" | jq '.success, .suggestions | length, .optimizations | length, .metadata.model' 2>/dev/null || echo "$BODY"
else
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
fi
echo ""

# Test 2: With time horizon
echo "📋 Test 2: With time horizon (14 days)"
echo "----------------------------------------"
RESPONSE=$(curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"timeHorizon": 14}' \
  -w "\nHTTP_STATUS:%{http_code}" \
  -s)

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo "HTTP Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "200" ]; then
  echo "$BODY" | jq '.success, .metadata.timeHorizon, .suggestions | length' 2>/dev/null || echo "$BODY"
else
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
fi
echo ""

# Test 3: Minimal strategy (faster)
echo "📋 Test 3: Minimal strategy (faster, less tokens)"
echo "--------------------------------------------------"
RESPONSE=$(curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"strategy": "minimal"}' \
  -w "\nHTTP_STATUS:%{http_code}" \
  -s)

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo "HTTP Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "200" ]; then
  echo "$BODY" | jq '.success, .suggestions[0] | {title, confidence, priority}' 2>/dev/null || echo "$BODY"
else
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
fi
echo ""

# Test 4: Check response structure
echo "📋 Test 4: Response structure validation"
echo "-----------------------------------------"
RESPONSE=$(curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -s)

if echo "$RESPONSE" | jq '.success' > /dev/null 2>&1; then
  echo "✅ Response is valid JSON"
  echo ""
  echo "Response structure:"
  echo "$RESPONSE" | jq '{
    success: .success,
    suggestions_count: (.suggestions | length),
    optimizations_count: (.optimizations | length),
    has_analysis: (.analysis != null),
    metadata: .metadata
  }' 2>/dev/null
  
  echo ""
  echo "Sample suggestion (first):"
  echo "$RESPONSE" | jq '.suggestions[0] | {
    title,
    confidence,
    priority,
    recommendedTeamLabel,
    rationale
  }' 2>/dev/null || echo "No suggestions in response"
  
  echo ""
  echo "Sample optimization (first):"
  echo "$RESPONSE" | jq '.optimizations[0] | {
    taskTitle,
    action,
    confidence,
    canAutoApply
  }' 2>/dev/null || echo "No optimizations in response"
else
  echo "❌ Response is not valid JSON"
  echo "$RESPONSE"
fi
echo ""

echo "✅ Tests complete!"
echo ""
echo "📊 Expected Response Structure:"
echo "  - success: boolean"
echo "  - suggestions: array of SuggestedTask"
echo "  - optimizations: array of ProcessedOptimization"
echo "  - analysis: object with optimizationOpportunities, riskFactors"
echo "  - metadata: object with model, tokensUsed, durationMs, contextCollectedAt"
