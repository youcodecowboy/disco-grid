#!/bin/bash

echo "📋 MOCK WORKFLOW PROMPT EXAMPLES"
echo "=================================="
echo ""

echo "Example 1: T-Shirt Screen Printing"
echo "-----------------------------------"
cat << 'EOF'

PROMPT:
"We run a screen printing business for custom t-shirts. Our process starts with 
design approval where the customer reviews and signs off on the artwork. Then we 
do screen preparation where we create the screens. Next is pre-treatment where 
shirts are sprayed with solution and must dry for 15 minutes. Then printing 
where the design is applied to shirts in batches of 50. After printing, curing 
in heat press for 2 minutes per shirt. Then quality check where we inspect print 
quality and a manager must approve batches over 100 shirts. Finally folding and 
packaging. The design team handles approvals, printing team does the printing, 
and QC team does inspection."

EXPECTED OUTPUT:
{
  "suggestedName": "Custom T-Shirt Screen Printing Workflow",
  "suggestedIndustry": "Fashion Manufacturing",
  "stages": [
    {
      "name": "Design Approval",
      "sequence": 1,
      "type": "sequential",
      "description": "Customer reviews and approves artwork design",
      "suggestedTeam": "Design Team",
      "suggestedInputs": ["photo", "form"],
      "suggestedOutputs": ["approval"],
      "dependencies": []
    },
    {
      "name": "Screen Preparation",
      "sequence": 2,
      "type": "sequential",
      "description": "Create screens for printing design",
      "suggestedTeam": "Screen Prep Team",
      "suggestedInputs": ["form"],
      "suggestedOutputs": ["photo"],
      "dependencies": [
        {
          "type": "approval",
          "description": "Design approval must be received"
        }
      ]
    },
    {
      "name": "Pre-Treatment",
      "sequence": 3,
      "type": "sequential",
      "description": "Spray shirts with solution for better print adhesion",
      "suggestedTeam": "Prep Team",
      "suggestedInputs": ["qr_scan"],
      "suggestedOutputs": ["count"],
      "dependencies": []
    },
    {
      "name": "Printing",
      "sequence": 4,
      "type": "sequential",
      "description": "Apply design to t-shirts using screen printing",
      "suggestedTeam": "Printing Team",
      "suggestedInputs": ["qr_scan", "form"],
      "suggestedOutputs": ["count", "photo"],
      "dependencies": [
        {
          "type": "quantity_threshold",
          "description": "Must have batch of 50 shirts ready"
        }
      ]
    },
    {
      "name": "Heat Press Curing",
      "sequence": 5,
      "type": "sequential",
      "description": "Cure printed shirts in heat press",
      "suggestedTeam": "Printing Team",
      "suggestedInputs": ["qr_scan"],
      "suggestedOutputs": ["count"],
      "dependencies": [
        {
          "type": "time_based",
          "description": "2 minutes per shirt curing time"
        }
      ]
    },
    {
      "name": "Quality Check",
      "sequence": 6,
      "type": "sequential",
      "description": "Inspect print quality and accuracy",
      "suggestedTeam": "QC Team",
      "suggestedInputs": ["photo", "form"],
      "suggestedOutputs": ["approval"],
      "dependencies": [
        {
          "type": "approval",
          "description": "Manager must approve batches over 100 shirts"
        }
      ]
    },
    {
      "name": "Folding and Packaging",
      "sequence": 7,
      "type": "sequential",
      "description": "Fold and package approved shirts",
      "suggestedTeam": "Packaging Team",
      "suggestedInputs": ["qr_scan"],
      "suggestedOutputs": ["count", "sign_off"],
      "dependencies": []
    }
  ],
  "limboZones": [
    {
      "betweenStages": ["Pre-Treatment", "Printing"],
      "dependencies": [
        {
          "type": "time_based",
          "description": "Shirts must dry for 15 minutes after pre-treatment"
        }
      ]
    }
  ]
}

KEY EXTRACTIONS:
✓ 7 sequential stages identified
✓ 3 teams assigned (Design, Printing, QC)
✓ Time delays detected (15 min dry time, 2 min per shirt)
✓ Approval requirements (customer, manager for large batches)
✓ Quantity thresholds (batch of 50, manager approval over 100)
✓ Limbo zone created for drying time

EOF

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Example 2: Furniture Assembly Line"
echo "-----------------------------------"
cat << 'EOF'

PROMPT:
"We manufacture wooden tables. First raw material inspection where we check 
lumber quality. Then cutting where boards are cut to size using CNC machines. 
After cutting, sanding to smooth surfaces. Next is staining where wood is 
colored and must dry for 4 hours. Then assembly where table is put together 
with screws and glue. While assembly happens, we also create the table legs in 
parallel. Once both are done, final assembly combines legs with tabletop. Then 
sealing with protective coating. Finally quality inspection where supervisor 
checks stability and finish quality, and packaging. Carpentry team does cutting 
and sanding, assembly team handles construction, finishing team does staining 
and sealing."

EXPECTED OUTPUT:
{
  "suggestedName": "Wooden Table Manufacturing Workflow",
  "suggestedIndustry": "Furniture Manufacturing",
  "stages": [
    {
      "name": "Raw Material Inspection",
      "sequence": 1,
      "type": "sequential",
      "description": "Inspect lumber for defects and quality",
      "suggestedTeam": "Quality Control Team",
      "suggestedInputs": ["photo", "form"],
      "suggestedOutputs": ["approval", "measurement"],
      "dependencies": []
    },
    {
      "name": "Cutting",
      "sequence": 2,
      "type": "sequential",
      "description": "Cut lumber boards to required dimensions using CNC",
      "suggestedTeam": "Carpentry Team",
      "suggestedInputs": ["qr_scan", "form"],
      "suggestedOutputs": ["measurement", "count"],
      "dependencies": []
    },
    {
      "name": "Sanding",
      "sequence": 3,
      "type": "sequential",
      "description": "Sand wood surfaces to smooth finish",
      "suggestedTeam": "Carpentry Team",
      "suggestedInputs": ["qr_scan"],
      "suggestedOutputs": ["photo"],
      "dependencies": []
    },
    {
      "name": "Staining",
      "sequence": 4,
      "type": "sequential",
      "description": "Apply wood stain for color",
      "suggestedTeam": "Finishing Team",
      "suggestedInputs": ["qr_scan"],
      "suggestedOutputs": ["photo"],
      "dependencies": []
    },
    {
      "name": "Tabletop Assembly",
      "sequence": 5,
      "type": "parallel",
      "description": "Assemble main tabletop structure",
      "suggestedTeam": "Assembly Team",
      "suggestedInputs": ["form"],
      "suggestedOutputs": ["photo"],
      "dependencies": [],
      "parallelWith": ["Table Legs Creation"]
    },
    {
      "name": "Table Legs Creation",
      "sequence": 5,
      "type": "parallel",
      "description": "Create table legs separately",
      "suggestedTeam": "Assembly Team",
      "suggestedInputs": ["form"],
      "suggestedOutputs": ["count", "photo"],
      "dependencies": [],
      "parallelWith": ["Tabletop Assembly"]
    },
    {
      "name": "Final Assembly",
      "sequence": 6,
      "type": "sequential",
      "description": "Combine legs with tabletop",
      "suggestedTeam": "Assembly Team",
      "suggestedInputs": ["photo"],
      "suggestedOutputs": ["photo"],
      "dependencies": [
        {
          "type": "component_completion",
          "description": "Both tabletop and legs must be completed"
        }
      ]
    },
    {
      "name": "Protective Sealing",
      "sequence": 7,
      "type": "sequential",
      "description": "Apply protective coating to finished table",
      "suggestedTeam": "Finishing Team",
      "suggestedInputs": ["qr_scan"],
      "suggestedOutputs": ["photo"],
      "dependencies": []
    },
    {
      "name": "Quality Inspection",
      "sequence": 8,
      "type": "sequential",
      "description": "Supervisor checks stability and finish quality",
      "suggestedTeam": "Quality Control Team",
      "suggestedInputs": ["form", "photo"],
      "suggestedOutputs": ["approval"],
      "dependencies": [
        {
          "type": "approval",
          "description": "Supervisor must approve stability and finish"
        }
      ]
    },
    {
      "name": "Packaging",
      "sequence": 9,
      "type": "sequential",
      "description": "Package approved table for shipment",
      "suggestedTeam": "Packaging Team",
      "suggestedInputs": ["qr_scan"],
      "suggestedOutputs": ["sign_off"],
      "dependencies": []
    }
  ],
  "limboZones": [
    {
      "betweenStages": ["Staining", "Tabletop Assembly"],
      "dependencies": [
        {
          "type": "time_based",
          "description": "Stain must dry for 4 hours before assembly"
        }
      ]
    }
  ]
}

KEY EXTRACTIONS:
✓ 9 stages with PARALLEL execution detected (tabletop + legs)
✓ 4 teams assigned (QC, Carpentry, Assembly, Finishing)
✓ Component completion dependency (both parts must finish)
✓ Time-based drying period (4 hours)
✓ Supervisor approval requirement
✓ Parallel stages identified correctly

EOF

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "🎯 TIPS FOR WRITING GOOD PROMPTS:"
echo ""
echo "1. ✅ Mention teams explicitly ('cutting team', 'QA team')"
echo "2. ✅ Include time delays ('wait 2 hours', 'dry for 30 minutes')"
echo "3. ✅ State approvals clearly ('manager must approve', 'supervisor sign-off')"
echo "4. ✅ Describe sequence ('first', 'then', 'after', 'finally')"
echo "5. ✅ Mention parallel work ('while X happens, we also do Y')"
echo "6. ✅ Include quantities ('batches of 50', 'over 100 items')"
echo "7. ✅ Specify conditions ('for denim only', 'if urgent')"
echo "8. ✅ Note transitions ('between cutting and sewing')"
echo ""
echo "📊 WHAT THE LLM EXTRACTS:"
echo "• Stage names and descriptions"
echo "• Team assignments"
echo "• Sequential vs parallel execution"
echo "• Dependencies (time, approval, task, capacity, quantity, component)"
echo "• Suggested inputs (QR scan, form, photo, etc.)"
echo "• Suggested outputs (approval, count, measurement, etc.)"
echo "• Limbo zones (transitions between stages)"
echo ""
echo "✨ Try these examples in the UI at /workflows-v3/new"











