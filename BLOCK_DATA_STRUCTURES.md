# Block Data Structures

This document defines the standardized data structures for all block types to ensure consistency across all pages.

## Overview

All blocks use the `props` property to store their data. All block components now use a standardized interface to eliminate prop mismatches and ensure true reusability.

## Standardized Component Interface

All block components now use this consistent interface:

```typescript
interface BlockProps {
  title?: string
  data: any
  className?: string
  [key: string]: any // Allow additional props
}
```

This eliminates the constant mismatch issues between different components expecting different prop structures.

## Block Types and Data Structures

### Metric Blocks

#### metric.kpi, metric.chart, metric.items
```typescript
{
  id: "block-id",
  type: "metric.kpi" | "metric.chart" | "metric.items",
  title: "Metric Title",
  props: {
    value: string,        // e.g., "1,234", "87%", "$12.5K"
    delta: string,        // e.g., "+12%", "-5%", "No change"
    trend: number[]       // Array of numbers for chart visualization
  }
}
```

**Example:**
```typescript
{
  id: "sales-metric",
  type: "metric.kpi",
  title: "Total Sales",
  props: {
    value: "1,234",
    delta: "+12%",
    trend: [100, 120, 110, 130, 125, 140, 1234]
  }
}
```

### Table Blocks

#### table.malleable
Supports multiple data formats for maximum compatibility:

**Format 1: Simple arrays (recommended for new pages)**
```typescript
{
  id: "table-id",
  type: "table.malleable",
  title: "Table Title",
  props: {
    columns: string[],    // Array of column names
    rows: any[][]         // Array of row arrays
  }
}
```

**Format 2: Structured objects (for advanced use)**
```typescript
{
  id: "table-id",
  type: "table.malleable",
  title: "Table Title",
  props: {
    columns: Column[],    // Array of Column objects
    data: TableData[]     // Array of data objects
  }
}
```

**Column Object:**
```typescript
{
  id: string,             // Unique column identifier
  name: string,           // Display name
  type: 'text' | 'number' | 'date' | 'status' | 'select',
  options?: string[],     // For select type
  width?: number,
  required?: boolean
}
```

**TableData Object:**
```typescript
{
  id: string,             // Unique row identifier
  [key: string]: any      // Column values
}
```

**Examples:**

Simple format:
```typescript
{
  id: "team-table",
  type: "table.malleable",
  title: "Team Members",
  props: {
    columns: ["Name", "Role", "Team", "Status", "Performance"],
    rows: [
      ["John Smith", "Developer", "Engineering", "Active", "95%"],
      ["Sarah Johnson", "Designer", "Design", "Active", "88%"]
    ]
  }
}
```

Structured format:
```typescript
{
  id: "team-table",
  type: "table.malleable",
  title: "Team Members",
  props: {
    columns: [
      { id: "name", name: "Name", type: "text" },
      { id: "role", name: "Role", type: "text" },
      { id: "status", name: "Status", type: "status" }
    ],
    data: [
      { id: "1", name: "John Smith", role: "Developer", status: "Active" },
      { id: "2", name: "Sarah Johnson", role: "Designer", status: "Active" }
    ]
  }
}
```

### Chart Blocks

#### chart.line, chart.bar, chart.area, chart.donut
```typescript
{
  id: "chart-id",
  type: "chart.line" | "chart.bar" | "chart.area" | "chart.donut",
  title: "Chart Title",
  props: {
    data: any,            // Chart-specific data structure
    // Additional chart properties as needed
  }
}
```

### Activity Timeline

#### activity.timeline
```typescript
{
  id: "timeline-id",
  type: "activity.timeline",
  title: "Recent Activity",
  props: {
    activities: {
      time: string,       // e.g., "2 hours ago", "1 day ago"
      user: string,       // User name
      action: string      // Action description
    }[]
  }
}
```

**Example:**
```typescript
{
  id: "activity-timeline",
  type: "activity.timeline",
  title: "Recent Activity",
  props: {
    activities: [
      { time: "2 hours ago", user: "John Smith", action: "Completed task #1234" },
      { time: "4 hours ago", user: "Sarah Johnson", action: "Updated design mockups" }
    ]
  }
}
```

### Calendar Blocks

#### calendar, calendar.mini
```typescript
{
  id: "calendar-id",
  type: "calendar" | "calendar.mini",
  title: "Calendar Title",
  props: {
    events: {
      date: string,       // ISO date string
      title: string,      // Event title
      type: string        // Event type
    }[]
  }
}
```

**Example:**
```typescript
{
  id: "team-calendar",
  type: "calendar.mini",
  title: "Team Events",
  props: {
    events: [
      { date: "2024-01-15", title: "Sprint Planning", type: "meeting" },
      { date: "2024-01-18", title: "Design Review", type: "review" }
    ]
  }
}
```

## Standardized Component Usage

All components now receive data consistently:

```typescript
// Before (inconsistent)
<MetricKPI block={block} />
<ActivityTimeline data={block.props} />
<TableMalleable columns={...} data={...} />

// After (standardized)
<MetricKPI title={block.title} data={block.props} />
<ActivityTimeline title={block.title} data={block.props} />
<TableMalleable title={block.title} data={block.props} />
```

## Data Normalization

The BlockRenderer component automatically normalizes data to ensure compatibility:

### TableMalleable Normalization
- Converts simple column arrays to Column objects
- Converts row arrays to data objects with IDs
- Handles both `columns/rows` and `columns/data` formats
- Ensures data is always an array for filtering

### Fallback Values
All components have fallback values for missing data:
- Empty arrays for missing data
- Default values for missing properties
- Graceful degradation for malformed data

## Best Practices

1. **Use simple formats for new pages** - Prefer `columns: string[]` and `rows: any[][]` for tables
2. **Consistent property names** - Always use `props` for block data
3. **Provide fallback values** - Include default values for optional properties
4. **Unique IDs** - Ensure all blocks and data rows have unique identifiers
5. **Type safety** - Use TypeScript interfaces when possible

## Migration Guide

### From old data format to new format:
```typescript
// Old format (deprecated)
{
  data: { ... }  // ❌ Don't use
}

// New format (recommended)
{
  props: { ... }  // ✅ Use this
}
```

### From table.rows to table.data:
```typescript
// Old format (still supported)
{
  props: {
    columns: ["Name", "Role"],
    rows: [["John", "Dev"], ["Sarah", "Design"]]
  }
}

// New format (also supported)
{
  props: {
    columns: [{ id: "name", name: "Name", type: "text" }],
    data: [{ id: "1", name: "John", role: "Dev" }]
  }
}
```

## Error Handling

The BlockRenderer includes comprehensive error handling:
- Validates data types before processing
- Provides fallback values for missing data
- Gracefully handles malformed data structures
- Logs warnings for debugging

This ensures that pages don't break when data structures are inconsistent or incomplete.
