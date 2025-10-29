#!/bin/bash

echo "🧪 Testing Workflow Refinement API"
echo "=================================="
echo ""

# Test 1: Team Assignment
echo "📋 Test 1: Team Assignment Question"
echo "Question: Which team is responsible for the Cutting stage?"
echo "Answer: the cutting team"
echo ""

curl -X POST http://localhost:3000/api/nlp/workflow/refine \
  -H "Content-Type: application/json" \
  -d '{
    "stage": {
      "id": "stage-1",
      "name": "Cutting",
      "sequence": 1,
      "type": "sequential",
      "teamId": "",
      "inputs": [],
      "outputs": [],
      "dependencies": [],
      "estimatedDuration": 0
    },
    "question": "Which team or department is responsible for the Cutting stage?",
    "answer": "the cutting team",
    "field": "teamId"
  }' | jq '.'

echo ""
echo "---"
echo ""

# Test 2: Inputs
echo "📋 Test 2: Input Requirements"
echo "Question: What input is required to BEGIN the Cutting stage?"
echo "Answer: scan the fabric roll QR code"
echo ""

curl -X POST http://localhost:3000/api/nlp/workflow/refine \
  -H "Content-Type: application/json" \
  -d '{
    "stage": {
      "id": "stage-1",
      "name": "Cutting",
      "sequence": 1,
      "type": "sequential",
      "teamId": "Cutting Team",
      "inputs": [],
      "outputs": [],
      "dependencies": [],
      "estimatedDuration": 0
    },
    "question": "What input or action is required to BEGIN the Cutting stage?",
    "answer": "scan the fabric roll QR code",
    "field": "inputs"
  }' | jq '.'

echo ""
echo "---"
echo ""

# Test 3: Dependencies (none)
echo "📋 Test 3: Dependencies (none)"
echo "Question: Are there any conditions that must be met before Cutting can start?"
echo "Answer: none"
echo ""

curl -X POST http://localhost:3000/api/nlp/workflow/refine \
  -H "Content-Type: application/json" \
  -d '{
    "stage": {
      "id": "stage-1",
      "name": "Cutting",
      "sequence": 1,
      "type": "sequential",
      "teamId": "Cutting Team",
      "inputs": [{"id": "1", "type": "qr_scan", "label": "Scan QR", "required": true}],
      "outputs": [],
      "dependencies": [],
      "estimatedDuration": 0
    },
    "question": "Are there any conditions or dependencies that must be met before Cutting can start?",
    "answer": "none",
    "field": "dependencies"
  }' | jq '.'

echo ""
echo "---"
echo ""

# Test 4: Duration
echo "📋 Test 4: Duration Estimation"
echo "Question: How long does the Cutting stage typically take?"
echo "Answer: about 2 hours"
echo ""

curl -X POST http://localhost:3000/api/nlp/workflow/refine \
  -H "Content-Type: application/json" \
  -d '{
    "stage": {
      "id": "stage-1",
      "name": "Cutting",
      "sequence": 1,
      "type": "sequential",
      "teamId": "Cutting Team",
      "inputs": [{"id": "1", "type": "qr_scan", "label": "Scan QR", "required": true}],
      "outputs": [],
      "dependencies": [],
      "estimatedDuration": 0
    },
    "question": "How long does the Cutting stage typically take?",
    "answer": "about 2 hours",
    "field": "estimatedDuration"
  }' | jq '.'

echo ""
echo "✅ Tests complete!"
