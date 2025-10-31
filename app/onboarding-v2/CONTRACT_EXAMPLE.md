# Complete Generation Contract Example

This document shows what a fully completed `GenerationContractV1` looks like after a user completes all onboarding sections for Fashion Manufacturing.

## Example: Fashion Manufacturing Company

```json
{
  "version": "1.0.0",
  
  "company": {
    "name": "Istanbul Textiles Co.",
    "description": "Premium denim and garment manufacturer serving European fashion brands",
    "industry": "manufacturing",
    "subIndustry": "fashion",
    "locations": [
      {
        "city": "Istanbul",
        "country": "Türkiye",
        "timezone": "Europe/Istanbul",
        "prov": "manual",
        "conf": 3
      }
    ],
    "hqLocation": "Istanbul, Türkiye",
    "size": "50-200",
    "facilities": "multi",
    "foundedYear": 2015,
    "manufacturerType": "MTO",
    "clientType": "Brands",
    "ownBrand": false,
    "salesChannels": ["Online", "Wholesale"],
    "teamSizeTotal": 47,
    "teamSplit": true,
    "teamSplitProduction": 35,
    "teamSplitManagement": 12,
    "capacityMonthlyPcs": 25000,
    "productTypes": ["Jeans", "Jackets", "Shirts"],
    "primaryProduct": "Premium Denim Jeans",
    "materialsList": ["Cotton Denim", "Zippers", "Thread", "Buttons"],
    "demandSpikesMonths": [2, 3, 8, 9],
    "slowMonths": [11, 0],
    "decisionMakerTitle": "Operations Manager",
    "biggestChallengeText": "Delays caused by poor visibility into production status and material shortages",
    "challengeCategory": "ProductionFlow",
    "longTermGoalText": "Expand capacity by 40% while maintaining quality standards",
    "goalCategory": "Expand",
    "success12moText": "Reduce lead times by 25% and increase on-time delivery to 95%",
    "enableKpiTracking": true,
    "complianceHas": true,
    "complianceList": ["BSCI", "ISO9001"],
    "complianceMarkets": ["EU", "UK"],
    "complianceReminders": true
  },
  
  "operations": {
    "overview_text": "We operate a made-to-order production flow starting with material receiving, followed by cutting, sewing, washing, finishing, QC, and packing. Items move between floors using carts and elevators.",
    "stages_list": ["Cutting", "Sewing", "Washing", "Finishing", "QC", "Packing"],
    "stage_durations": {
      "Cutting": 0.5,
      "Sewing": 8.0,
      "Washing": 24.0,
      "Finishing": 2.0,
      "QC": 1.0,
      "Packing": 0.5
    },
    "stage_buffer_use": true,
    "subcontract_use": true,
    "subcontract_stages": ["Washing"],
    "subcontract_partners_consistent": true,
    "planning_method": "Spreadsheet",
    "daily_planning_style": "ByOrder",
    "target_output_metric": true,
    "target_output_qty": 1200,
    "track_materials_internally": true,
    "inventory_levels_tracked": ["Raw", "WIP", "Finished"],
    "storage_system": "DefinedBins",
    "qr_or_barcode_use": "Barcodes",
    "qc_stages": ["QC"],
    "qc_record_defects": true,
    "defect_rate_estimate": 3.2,
    "total_lead_time_days": 7,
    "delay_bottleneck_stage": "Washing",
    "data_tracking_method": "Spreadsheet",
    "data_tracking_tool": "Excel",
    "data_entry_frequency": "Daily",
    "biggest_bottleneck_text": "Washing stage causes delays because items go to external vendor and tracking is lost",
    "bottleneck_type": "Coordination",
    "auto_reports_interest": true,
    "auto_report_frequency": "Weekly",
    "delay_alert_interest": true
  },
  
  "sites": {
    "count": 1,
    "list": [
      {
        "name": "Main Factory",
        "address": "Istanbul, Türkiye",
        "is_primary": true,
        "handles_shipping": true,
        "floors_count": 3,
        "floors": [
          {
            "name": "Cutting & Sewing",
            "zones": [
              {
                "name": "Cutting Area",
                "tag": "Cutting",
                "people_count": 10,
                "has_machines": true,
                "machine_count": 6,
                "machine_types": ["Cutting"],
                "has_storage": false
              },
              {
                "name": "Sewing Line 1",
                "tag": "Sewing",
                "people_count": 12,
                "has_machines": true,
                "machine_count": 20,
                "machine_types": ["Sewing"],
                "has_storage": true,
                "storage_type": "Racks",
                "storage_capacity_estimate": 400
              }
            ],
            "total_people": 22
          },
          {
            "name": "Finishing & QC",
            "zones": [
              {
                "name": "Washing Zone",
                "tag": "Washing",
                "people_count": 6
              },
              {
                "name": "Finishing",
                "tag": "Finishing",
                "people_count": 8
              },
              {
                "name": "QC and Packing",
                "tag": "QC",
                "people_count": 5
              }
            ],
            "total_people": 19
          },
          {
            "name": "Storage & Dispatch",
            "zones": [
              {
                "name": "Finished Goods Storage",
                "tag": "Storage",
                "people_count": 4,
                "has_storage": true,
                "storage_type": "Bins",
                "storage_capacity_estimate": 1200
              },
              {
                "name": "Dispatch Dock",
                "tag": "Loading",
                "people_count": 2
              }
            ],
            "total_people": 6
          }
        ]
      }
    ],
    "flow_between_floors": true,
    "flow_transport_methods": ["Carts", "Elevator"],
    "high_movement_floors": ["Cutting & Sewing", "Finishing & QC"],
    "external_flow": true,
    "external_flow_locations": "Local Washer",
    "external_flow_duration_days": 2,
    "external_return_floor": true,
    "receiving_area_exists": true,
    "receiving_floor": "Ground Floor",
    "receiving_responsible": "Logistics Coordinator",
    "dispatch_area_exists": "LoadingDock",
    "dispatch_wait_time": 0.5,
    "shifts_count": 2,
    "shifts_shared_workstations": true,
    "environment_tracking_interest": false,
    "bottleneck_location_text": "Items often pile up between sewing and washing because of limited carts.",
    "bottleneck_cause": "Space"
  },
  
  "teams": {
    "departments": [],
    "floorAppEnabled": false,
    "total_people": 47,
    "departments_list": ["Cutting", "Sewing", "Finishing", "QC", "Packing", "Admin"],
    "department_sizes": {
      "Cutting": 8,
      "Sewing": 20,
      "Finishing": 6,
      "QC": 5,
      "Packing": 4,
      "Admin": 4
    },
    "supervisors": [
      {"department": "Cutting", "name": "Ahmet"},
      {"department": "Sewing", "name": "Meryem"},
      {"department": "QC", "name": "Selim"}
    ],
    "reporting_lines": [
      {"from": "Meryem", "to": "Production Manager"},
      {"from": "Selim", "to": "Operations Manager"}
    ],
    "role_types": ["Operators", "Supervisors", "QualityInspectors", "Admin", "Management"],
    "role_counts": {
      "Operators": 35,
      "Supervisors": 4,
      "QualityInspectors": 3,
      "Admin": 3,
      "Management": 2
    },
    "shift_structure": "TwoShifts",
    "shift_lead_overlap": true,
    "communication_method": "WhatsApp",
    "communication_tool": "WhatsApp Groups",
    "meeting_frequency": "Weekly",
    "training_method": "Shadowing",
    "training_host_interest": true,
    "cross_training_level": "Medium",
    "cross_training_links": ["Cutting", "Sewing", "Finishing"],
    "issue_ownership_style": "Supervisor",
    "auto_assign_issues": true,
    "performance_tracking": "Team",
    "performance_metrics": ["Output", "Quality"],
    "rewards_exist": true,
    "rewards_method": "Monthly bonus for meeting efficiency target",
    "hiring_method": "Referral",
    "management_focus_text": "Improve communication between shifts and reduce rework by 20%.",
    "management_kpi_tracking": true
  },
  
  "integrations": {
    "systems": [],
    "apiAccess": false,
    "digital_tools_level": "Basic (Excel/Sheets)",
    "production_system": "Spreadsheet",
    "production_system_name": "Excel",
    "inventory_system": "Paper",
    "order_system": "ECommerce",
    "order_platforms": ["Shopify"],
    "accounting_system": "QuickBooks",
    "communication_tools": ["WhatsApp", "Email"],
    "file_storage_system": ["GoogleDrive", "LocalComputer"],
    "reporting_method": "ExcelDashboards",
    "reporting_frequency": "Weekly",
    "data_sharing_partners": true,
    "data_sharing_format": ["Spreadsheet", "Email"],
    "data_backup_method": "CloudAuto",
    "data_backup_frequency": "Daily",
    "data_challenges_text": "Everything is scattered across files and folders, no single view of progress.",
    "priority_issue_flag": true,
    "integration_interest": "We'd like to integrate with Shopify orders and QuickBooks invoices later."
  },
  
  "analytics": {
    "audience": ["ops"],
    "keyMetrics": [],
    "chartPreference": "trends",
    "reportFrequency": "realtime",
    "default_dashboard_type": "Mixed",
    "default_dashboards": ["Production", "Quality", "Orders"],
    "show_kpi_header": true,
    "kpis_priority": ["Output", "Efficiency", "LeadTime"],
    "kpis_update_frequency": "Daily",
    "visual_preference": "BarCharts",
    "auto_visual_suggestions": true,
    "alert_preferences": true,
    "alert_kpis": ["LeadTime", "Output"],
    "alert_channels": ["InApp", "WhatsApp"],
    "auto_reports_enable": true,
    "auto_report_frequency": "Weekly",
    "auto_report_recipients": ["Me", "Supervisors"]
  },
  
  "design": {
    "brand_colors": true,
    "brand_primary": "#0045FF",
    "brand_logo_url": "https://example.com/logo.png",
    "ui_density": "Balanced",
    "theme_style": "Auto",
    "grid_layout_interest": true,
    "grid_layout_config": {
      "rows": 3,
      "columns": 4,
      "widgets": [
        {"type": "KPI", "metric": "LeadTime", "size": "1x1"},
        {"type": "Chart", "metric": "Output", "visual": "BarCharts", "size": "2x2"},
        {"type": "Table", "metric": "Orders", "size": "3x2"}
      ]
    },
    "interaction_style": "Conversational"
  },
  
  "items": {
    "categories": [],
    "trackingLevel": "batch",
    "attributes": [
      {"key": "name", "type": "text", "required": true},
      {"key": "code", "type": "text", "required": true},
      {"key": "quantity", "type": "number", "required": true}
    ]
  },
  
  "workflows": {
    "stages": []
  },
  
  "metadata": {
    "idempotencyKey": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "completedAt": "2024-12-19T11:45:00.000Z",
    "lastStep": "review",
    "branchingLog": [],
    "extractedEntities": [],
    "committedFields": [
      "company.name",
      "company.industry",
      "company.subIndustry",
      "operations.stages_list",
      "sites.count",
      "teams.total_people",
      "integrations.digital_tools_level",
      "analytics.default_dashboards"
    ]
  }
}
```

## Contract Structure Overview

### Core Sections
1. **company** - Business identity, size, products, compliance
2. **operations** - Production flow, stages, planning, tracking
3. **sites** - Physical locations, floors, zones, flow
4. **teams** - Departments, roles, shifts, communication
5. **integrations** - Current systems, data flow, pain points
6. **analytics** - Dashboard preferences, KPIs, reports
7. **design** - Brand identity, UI preferences, layout

### Storage & Provenance
Every field tracks:
- **prov** (provenance): `"nlp"` | `"manual"` | `"default"`
- **conf** (confidence): `0` (unknown) | `1` (low) | `2` (medium) | `3` (high)

### Metadata
- **idempotencyKey**: Unique identifier for this contract instance
- **committedFields**: Array of field paths that have been explicitly confirmed
- **extractedEntities**: Raw LLM extractions before confirmation
- **branchingLog**: Decision tree of conditional logic applied


