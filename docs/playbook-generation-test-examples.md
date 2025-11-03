# Playbook Generation Test Examples

## Example 1: Order Acceptance Playbook (Comprehensive)

**Prompt:**
```
When an order is accepted, we need to:
1. Order fabric from supplier (assigned to Procurement team, high priority, takes about 60 minutes)
2. Order trims and accessories like buttons, zippers, and labels (assigned to Procurement team, high priority)
3. Finalize and grade pattern for all sizes (assigned to Pattern Maker role, critical priority, takes 3 hours)
4. After the pattern is finalized, print patterns for all sizes on the plotter (assigned to Technical Team, high priority)
5. Schedule fabric inspection 3 days after order acceptance (assigned to QC Inspector role, medium priority)
6. Create purchase order for thread and needles (assigned to Procurement team, medium priority)

The playbook should be called "Order Acceptance Playbook" and it automates all the prep work when we accept a new order.
```

**Expected Output Structure:**
- 6 plays total
- All triggered by `order_accepted`
- Mix of team and role assignments
- One dependency: Play 4 depends on Play 3
- Various priorities (critical, high, medium)
- Date-based trigger for Play 5 (3 days after order acceptance)

---

## Example 2: Workflow Stage-Based Playbook

**Prompt:**
```
When items enter the cutting stage in our "Denim Manufacturing" workflow:
1. Change thread color on all sewing machines to match the order (assigned to Sewing Team, high priority, 20 minutes)
2. Rest fabric for 24 hours after unwrapping (assigned to Cutting Team, medium priority)
3. Perform shrinkage test on sample fabric (assigned to QC Inspector role, critical priority, takes 90 minutes)
4. After fabric rests for 24 hours, lay fabric on cutting table (assigned to Cutting Team, high priority)

This is the "Cutting Stage Preparation Playbook".
```

**Expected Output Structure:**
- 4 plays total
- All triggered by `workflow_stage_change` with:
  - workflowName: "Denim Manufacturing"
  - stageName: "cutting" or "Cutting"
  - condition: "enters"
- One dependency: Play 4 depends on Play 2
- Mix of team and role assignments

---

## Example 3: Time-Based Maintenance Playbook

**Prompt:**
```
Every Monday at 7am, perform weekly machine maintenance check on all sewing machines (assigned to Maintenance Technician role, medium priority, takes 2 hours).

Every Wednesday at 8am, calibrate the automated cutting equipment (assigned to specific people: James Park and Aisha Patel, high priority, takes 60 minutes).

Every first day of the month at 9am, run monthly inventory audit (assigned to Warehouse Team, medium priority).

Call this "Weekly Maintenance Routines".
```

**Expected Output Structure:**
- 3 plays total
- All triggered by `time_based`:
  - Play 1: frequency: "weekly", time: "07:00", weekday: 1 (Monday)
  - Play 2: frequency: "weekly", time: "08:00", weekday: 3 (Wednesday)
  - Play 3: frequency: "monthly", time: "09:00", dayOfMonth: 1
- Mix of role and specific_people assignments

---

## Example 4: Task Completion Trigger Playbook

**Prompt:**
```
After the task "Finalize and grade pattern" completes, trigger these tasks:
1. Print patterns for all sizes (assigned to Technical Team, high priority)
2. Review pattern accuracy (assigned to Pattern Maker role, critical priority)
3. Get manager approval for pattern (assigned to Production Manager role, high priority)

Then after "Print patterns" completes, create a task to cut sample pieces (assigned to Cutting Team, medium priority).

This is the "Pattern Completion Follow-up" playbook.
```

**Expected Output Structure:**
- 4 plays total
- Plays 1-3 triggered by `task_completion` with taskTitle: "Finalize and grade pattern"
- Play 4 triggered by `task_completion` with taskTitle: "Print patterns"
- Dependencies: Play 4 depends on Play 1

---

## Example 5: Mixed Triggers with Dependencies

**Prompt:**
```
When an order is accepted:
1. Order fabric (Procurement team, high priority)
2. Order trims (Procurement team, high priority)
3. Finalize pattern (Pattern Maker role, critical priority)

After "Finalize pattern" completes:
4. Print patterns (Technical Team, high priority)

When items enter the cutting stage:
5. Change thread color (Sewing Team, high priority)
6. Rest fabric for 24 hours (Cutting Team, medium priority)

After fabric rests (play 6), lay fabric on table (Cutting Team, high priority).

3 days after order acceptance, inspect incoming fabric (QC Inspector role, medium priority).

Name this "Complete Order Prep Playbook".
```

**Expected Output Structure:**
- 8 plays total
- Mix of triggers:
  - Plays 1-3: `order_accepted`
  - Play 4: `task_completion` (depends on Play 3)
  - Plays 5-6: `workflow_stage_change` (cutting stage)
  - Play 7: `task_completion` (depends on Play 6)
  - Play 8: `date_based` (3 days after order acceptance)
- Complex dependency chain: 4 → 3, 7 → 6

---

## Example 6: Simple Single Trigger Playbook

**Prompt:**
```
When an order is accepted, create a task to review order specifications (assigned to Production Manager role, high priority, takes 30 minutes). This should be called "Order Review Playbook".
```

**Expected Output Structure:**
- 1 play total
- Trigger: `order_accepted`
- Assignment: role-based (Production Manager)
- Priority: high
- Duration: 30 minutes

---

## Testing Checklist

When testing, verify:

1. **Trigger Extraction:**
   - ✅ "when order is accepted" → `order_accepted`
   - ✅ "when item enters [stage]" → `workflow_stage_change` with correct condition
   - ✅ "after [task] completes" → `task_completion` with taskTitle
   - ✅ "X days after order acceptance" → `date_based` with relativeOffset
   - ✅ "every Monday at 7am" → `time_based` with frequency, time, weekday

2. **Assignment Extraction:**
   - ✅ Team names extracted correctly
   - ✅ Role names extracted correctly
   - ✅ Specific people names extracted (if mentioned)

3. **Dependencies:**
   - ✅ "after [play] completes" creates dependency
   - ✅ Dependency links correctly by play title

4. **Task Templates:**
   - ✅ Priority extracted (critical, high, medium, low)
   - ✅ Duration extracted (minutes/hours)
   - ✅ Tags extracted (if mentioned)

5. **Enrichment Questions:**
   - ✅ Missing workflow IDs trigger questions
   - ✅ Missing team/role IDs trigger questions
   - ✅ Questions are prioritized correctly

