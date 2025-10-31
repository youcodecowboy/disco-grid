#!/bin/bash
# Test API endpoints for contract-aware follow-up questions

echo "🧪 Testing Follow-Up API with Contract Awareness"
echo "=================================================="
echo ""

# Test 1: Empty contract (should generate basic follow-ups)
echo "TEST 1: Follow-up API with empty contract"
echo "------------------------------------------"
curl -s -X POST http://localhost:3000/api/nlp/follow-up \
  -H "Content-Type: application/json" \
  -d '{
    "entities": [
      {"type": "company_name", "value": "Test Company", "confidence": 3}
    ],
    "industry": "manufacturing",
    "subIndustry": "fashion",
    "contract": {
      "company": {
        "industry": "manufacturing",
        "subIndustry": "fashion"
      }
    },
    "previousAnswers": []
  }' | jq -r '.questions | length as $len | "Generated \($len) follow-up questions"'

echo ""
echo ""

# Test 2: Contract with some data (should check missing fields)
echo "TEST 2: Follow-up API with partial contract"
echo "---------------------------------------------"
curl -s -X POST http://localhost:3000/api/nlp/follow-up \
  -H "Content-Type: application/json" \
  -d '{
    "entities": [
      {"type": "company_name", "value": "Test Company", "confidence": 3},
      {"type": "location", "value": "Istanbul", "confidence": 3}
    ],
    "industry": "manufacturing",
    "subIndustry": "fashion",
    "contract": {
      "company": {
        "industry": "manufacturing",
        "subIndustry": "fashion",
        "name": "Test Company",
        "hqLocation": "Istanbul, Türkiye",
        "manufacturerType": "MTO",
        "clientType": "Brands",
        "teamSizeTotal": 45,
        "capacityMonthlyPcs": 25000,
        "productTypes": ["Jeans"]
      }
    },
    "previousAnswers": []
  }' | jq -r '.questions | if length > 0 then "Generated \(length) follow-up questions" else "No follow-ups needed (contract mostly complete)" end'

echo ""
echo ""

# Test 3: Check what questions would be loaded for fashion manufacturing
echo "TEST 3: Question Loading (checking skipIfCommitted)"
echo "----------------------------------------------------"
echo "Checking if questions with skipIfCommitted work correctly..."
echo ""
echo "Questions that should skip when data is provided:"
grep -r "skipIfCommitted.*true" content/questions/manufacturing/fashion/company.json | head -5 | sed 's/.*"id": "\([^"]*\)".*/\1/' | while read qid; do
  echo "  - $qid"
done

echo ""
echo "✅ Tests completed!"
echo ""
echo "Note: Start dev server (npm run dev) to test API endpoints"

