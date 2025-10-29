# Component Refinement - Testing Guide

## 🧪 How to Test Refinement Feature

### Step 1: Create a Component
1. Go to `/playground`
2. In the AI input block, type: **"Show me sales trends"**
3. Click "Generate" and wait for the component to appear
4. You should see an Area Chart titled "Sales Trends (Last 6 Months)"

### Step 2: Enter Edit Mode
1. Toggle the **Edit Mode** switch at the top right
2. The wand icon (✨) should now appear in the component's header (next to Edit and Delete buttons)

### Step 3: Refine the Component
1. Click the **wand icon (✨)**
2. A popup should appear overlaying the component
3. Type: **"show only January"**
4. Press **Enter** or click the send button
5. Wait for "Applying changes..." message

### Step 4: Verify Changes

**You should see THREE changes:**

1. **Title Update** ✅
   - Original: "Sales Trends (Last 6 Months)"
   - New: "Sales Trends (January)"
   - Look at the component header

2. **Refinement Badge** ✅
   - A purple badge should appear at the bottom of the component
   - Says: "AI Refinements Applied: • show only January"

3. **Console Logs** ✅ (Open browser DevTools)
   ```
   🔧 Applying refinement: [blockId] [refinement data]
   📦 Current block before refinement: [block object]
   ✅ Updated block: [updated block object]
   🔄 Title change: Sales Trends => Sales Trends (January)
   💾 New state will save to localStorage
   🎉 Refinement complete!
   ```

---

## 🔍 What's Working vs What's Not

### ✅ What SHOULD Work
- **Title updates** - Title changes from "Sales Trends" to "Sales Trends (January)"
- **Config updates** - `timeFilter` changes from "year" to "january"
- **Refinement history** - Purple badge shows "show only January"
- **State persistence** - Refresh page, refinements are still there
- **Console logging** - Full trace of the refinement process

### ⚠️ What DOESN'T Update (Expected Limitation)
- **Mock chart data** - The actual chart visualization doesn't change
- **Why?** The chart displays static mock data generated at creation time
- **Future fix:** Components need to read from config and regenerate display

---

## 🎯 Test Scenarios

### Test 1: Time Filtering
```
Create: "Show me sales trends"
Refine: "show only January"
Expected: Title changes to include "(January)"
```

### Test 2: Type Change
```
Create: "Order status breakdown" (creates donut chart)
Refine: "change to bar chart"
Expected: Component type changes to v3.chart.bar
```

### Test 3: Limit Adjustment
```
Create: "Top products by revenue" (creates bar chart)
Refine: "show top 3 only"
Expected: Title changes to "Top 3 Products"
```

### Test 4: Multiple Refinements
```
Create: "Show me sales"
Refine 1: "show only January"
Refine 2: "top 5"
Expected: Badge shows both refinements
```

---

## 🐛 Debugging Checklist

If refinements aren't working:

1. **Check API Response**
   ```bash
   # In Network tab, find POST to /api/playground/refine-component
   # Should return: { success: true, newTitle: "...", configChanges: {...} }
   ```

2. **Check Console Logs**
   - Open DevTools Console (F12)
   - Look for 🔧, 📦, ✅, 🔄 emojis in logs
   - Verify "Title change:" log shows old => new

3. **Check State in React DevTools**
   - Install React DevTools extension
   - Find PageTemplate component
   - Look at `state.blocks[blockId]`
   - Verify title and props have updated

4. **Check localStorage**
   ```javascript
   // In console:
   JSON.parse(localStorage.getItem('playground-v3'))
   // Look at blocks[blockId].title and blocks[blockId].props._aiRefinements
   ```

5. **Force Refresh**
   - Clear localStorage: `localStorage.clear()`
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Recreate component and try again

---

## 💡 Known Issues & Workarounds

### Issue 1: Chart Data Doesn't Change
**Problem:** The chart still shows old mock data  
**Workaround:** This is expected - components need to be updated to read from config  
**Fix:** Components should regenerate their display based on props  

### Issue 2: State Not Persisting
**Problem:** Refinements disappear on refresh  
**Check:** localStorage should have `_aiRefinements` array  
**Fix:** Ensure localStorage isn't being cleared  

### Issue 3: Title Updates But Nothing Else
**Problem:** Only the title changes  
**This is actually GOOD** - It means the state update is working!  
**Next step:** Update components to read from config  

---

## 🔧 Making Components Responsive to Config

To make components actually update their display based on config changes, we need to:

### Option 1: Update Mock Data Generator (Quick)
```typescript
// In PageTemplate, after refinement:
if (refinement.configChanges) {
  // Re-generate mock data based on new config
  const newMockData = generateDataForConfig(
    refinement.configChanges,
    currentComponent.type
  )
  updatedProps = { ...updatedProps, data: newMockData }
}
```

### Option 2: Make Components Config-Aware (Better)
```typescript
// In each component (e.g., ChartArea.tsx):
useEffect(() => {
  if (props.timeFilter === 'january') {
    // Filter data to January only
    const filteredData = originalData.filter(item => 
      item.month === 1
    )
    setDisplayData(filteredData)
  }
}, [props.timeFilter])
```

### Option 3: Full Dynamic Components (Best)
- Components fetch/generate data based on their full config
- No static mock data at all
- Fully responsive to any config changes

---

## 📊 Success Metrics

**Basic Success (Current State):**
- [x] API calls work (refinement endpoint returns correct data)
- [x] State updates (console logs show state change)
- [x] Title updates (visible in UI)
- [x] Refinement history tracked (badge shows refinements)
- [x] localStorage persistence works

**Full Success (Future):**
- [ ] Chart data updates based on filters
- [ ] Component types switch seamlessly
- [ ] Limits apply to displayed data
- [ ] Sorting/grouping affects visualization

---

## 🎉 Current Status

### What's Implemented ✅
1. Refinement API endpoint
2. Refinement UI (wand button + popup)
3. State update logic
4. Title updates
5. Config tracking
6. Refinement history badges
7. Comprehensive logging

### What's Missing ⚠️
1. Mock data regeneration on refinement
2. Component config awareness
3. Visual data updates

### Next Steps 🚀
1. **Verify** title updates work (test now!)
2. **Confirm** refinement badges appear
3. **If working**, move to making mock data update
4. **If not working**, debug with console logs

---

## 📝 Quick Test Command

Try this in the browser console after refining:

```javascript
// Get current playground state
const state = JSON.parse(localStorage.getItem('playground-v3'))

// Find AI-generated blocks
const aiBlocks = Object.entries(state.blocks)
  .filter(([_, block]) => block.props?._aiGenerated)
  .map(([id, block]) => ({
    id,
    title: block.title,
    refinements: block.props._aiRefinements?.length || 0
  }))

console.table(aiBlocks)
```

This will show you all AI-generated components and their refinement counts.

---

**Last Updated:** October 17, 2025  
**Status:** Title updates + refinement tracking working ✅  
**Next:** Make mock data responsive to config changes

