# Operations Questions Debug Guide

## Current Status

The fashion operations questions file (`app/onboarding-v2/content/questions/manufacturing/fashion/operations.json`) contains **30 questions** matching your MD specification.

## Debugging Steps

1. **Check Browser Console** - Look for these logs:
   ```
   [Question Loader] ✅ Loaded X questions from registry for manufacturing.fashion
   [Question Loader] Operations questions: 30
   [Question Loader] 🔍 Operations questions from manufacturing/fashion/operations: 30
   [Question Loader] ALL operations IDs: [...]
   ```

2. **Check Question Filtering** - Look for:
   ```
   [Onboarding] 📊 Question Summary:
     Operations loaded: 30, Operations visible: X
   ```
   If `visible` < `loaded`, questions are being filtered out.

3. **Check Filter Reasons** - Look for:
   ```
   [Question Engine] ❌ Skipping operations question "X": industry mismatch
   [Question Engine] ❌ Skipping operations question "X": dependencies not met
   [Question Engine] ⏭️ Skipping operations question "X": already answered
   ```

## Common Issues

### Issue 1: Operations fields already committed
**Symptom**: Operations questions have `skipIfCommitted: true` and are skipped
**Fix**: Check if operations fields are being set during company section

### Issue 2: Old questions from legacy files
**Symptom**: Seeing `operations_model_nlp`, `operations_shifts`, `operations_seasonality`
**Fix**: Already fixed - these now have `subIndustries: ["general"]` so they won't show for fashion

### Issue 3: Questions appearing in wrong order
**Symptom**: Operations questions mixed with company questions
**Fix**: Check question order in registry loadOrder

## Expected Operations Questions (30 total)

1. `operations_overview_nlp` - "Can you walk me through how production flows..."
2. `operations_stages_confirm` - "We identified these stages..."
3. `operations_stage_durations` - "Let's set approximate times..."
4. `operations_stage_buffer_use` - "Would you like to include buffer time..."
5. `operations_subcontract_use` - "Do you subcontract any part..."
6. `operations_subcontract_stages` - "Which stages or tasks..."
7. `operations_subcontract_partners_consistent` - "Are these consistent partners..."
8. `operations_planning_method` - "How do you plan production..."
9. `operations_planning_method_other` - "Please describe your planning method"
10. `operations_daily_planning_style` - "Do you plan by order, by batch..."
11. `operations_target_output_metric` - "Do you have a daily or weekly target..."
12. `operations_target_output_qty` - "Roughly how many units..."
13. `operations_track_materials_internally` - "Do you track materials..."
14. `operations_inventory_levels_tracked` - "Do you track raw materials, WIP..."
15. `operations_storage_system` - "How do you store goods..."
16. `operations_storage_system_other` - "Please describe your storage system"
17. `operations_qr_or_barcode_use` - "Do you currently use barcodes..."
18. `operations_qc_stages` - "At which stages do you perform quality checks..."
19. `operations_qc_record_defects` - "Do you record reasons for defects..."
20. `operations_defect_rate_estimate` - "Roughly what % require rework..."
21. `operations_total_lead_time_days` - "From start to finish, how long..."
22. `operations_delay_bottleneck_stage` - "Which stage causes the most delay..."
23. `operations_data_tracking_method` - "How do you currently record..."
24. `operations_data_tracking_tool` - "What tool..."
25. `operations_data_entry_frequency` - "How often is production data updated..."
26. `operations_biggest_bottleneck_text` - "What part causes the most delays..."
27. `operations_bottleneck_type` - "Would you say it's related to people..."
28. `operations_auto_reports_interest` - "Would you like Groovy to automatically send..."
29. `operations_auto_report_frequency` - "How often..."
30. `operations_delay_alert_interest` - "Would you like to be alerted..."

## Next Steps

1. Refresh browser with dev mode ON
2. Check console logs - they will tell you exactly what's happening
3. Share the console output so we can identify the exact issue

