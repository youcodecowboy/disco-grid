// Mock data generators with deterministic seeding based on block ID
export function seedRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  return () => {
    hash = (hash * 1664525 + 1013904223) & 0xffffffff
    return (hash >>> 0) / 0xffffffff
  }
}

export function mockOrders(blockId = "default") {
  const random = seedRandom(blockId)
  const customers = [
    "John Doe",
    "Jane Smith",
    "Bob Johnson",
    "Alice Brown",
    "Charlie Wilson",
    "Diana Ross",
    "Frank Miller",
    "Grace Lee",
  ]
  const statuses = ["Completed", "Processing", "Shipped", "Pending"]

  return Array.from({ length: 8 }, (_, i) => ({
    id: `#${1234 + i}`,
    customer: customers[Math.floor(random() * customers.length)],
    amount: `$${(random() * 500 + 50).toFixed(2)}`,
    status: statuses[Math.floor(random() * statuses.length)],
  }))
}

export function mockSeries(blockId = "default", days = 7, seriesCount = 1) {
  const random = seedRandom(blockId)
  const today = new Date()

  return Array.from({ length: seriesCount }, (_, seriesIndex) => ({
    name: seriesCount === 1 ? "Data" : `Series ${seriesIndex + 1}`,
    points: Array.from({ length: days }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (days - 1 - i))
      return {
        x: date.toISOString().split("T")[0],
        y: Math.floor(random() * 100 + 20),
      }
    }),
  }))
}

export function mockKPI(blockId = "default", label = "Value") {
  const rnd = seedRandom(blockId + label)
  const sign = rnd() > 0.5 ? 1 : -1
  const deltaAbs = (rnd() * 5).toFixed(1)
  const base = Math.floor(rnd() * 5000 + 20)
  const trend = Array.from({ length: 7 }, () => Math.floor(rnd() * 30 + 5))
  return {
    value: base.toLocaleString(),
    delta: `${sign > 0 ? "+" : "-"}${deltaAbs}%`,
    trend
  }
}

export function mockSlices(blockId = "default", labels: string[] = ["A", "B", "C", "D"]) {
  const rnd = seedRandom(blockId)
  return labels.map(l => ({ label: l, value: Math.floor(rnd() * 40 + 10) }))
}

export function mockDonut(blockId = "default") {
  const random = seedRandom(blockId)
  const labels = ["Desktop", "Mobile", "Tablet", "Other"]

  return labels.map((label) => ({
    label,
    value: Math.floor(random() * 40 + 10),
  }))
}

export function mockActivity(blockId = "default") {
  const random = seedRandom(blockId)
  const events = [
    "User logged in",
    "Order created",
    "Payment processed",
    "Email sent",
    "Report generated",
    "Data exported",
    "Settings updated",
    "Account verified",
    "File uploaded",
    "Task completed",
  ]
  const types = ["system", "user", "admin"]

  return Array.from({ length: 10 }, (_, i) => {
    const date = new Date()
    date.setMinutes(date.getMinutes() - i * 15)

    return {
      id: i + 1,
      title: events[Math.floor(random() * events.length)],
      timestamp: date.toISOString(),
      type: types[Math.floor(random() * types.length)],
    }
  })
}

export function mockMessages(blockId = "default") {
  const random = seedRandom(blockId)
  const senders = ["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson", "Emma Brown", "Frank Miller"]
  const subjects = [
    "Meeting tomorrow",
    "Project update",
    "Invoice #1234",
    "Welcome aboard!",
    "System maintenance",
    "New feature release",
  ]

  return Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    sender: senders[Math.floor(random() * senders.length)],
    subject: subjects[Math.floor(random() * subjects.length)],
    preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    time: `${Math.floor(random() * 12 + 1)}:${String(Math.floor(random() * 60)).padStart(2, "0")} ${random() > 0.5 ? "AM" : "PM"}`,
    unread: i < 4, // First 4 are unread
  }))
}

export function mockKanban(blockId = "default") {
  const random = seedRandom(blockId)
  const tasks = [
    "Update homepage design",
    "Fix login bug",
    "Add payment integration",
    "Write documentation",
    "Test mobile app",
    "Deploy to production",
    "Review pull request",
    "Update dependencies",
  ]

  return {
    columns: [
      {
        title: "Backlog",
        items: Array.from({ length: 3 }, (_, i) => ({
          id: `backlog-${i}`,
          title: tasks[Math.floor(random() * tasks.length)],
          meta: `Task ${i + 1}`,
        })),
      },
      {
        title: "In Progress",
        items: Array.from({ length: 2 }, (_, i) => ({
          id: `progress-${i}`,
          title: tasks[Math.floor(random() * tasks.length)],
          meta: `Task ${i + 4}`,
        })),
      },
      {
        title: "Done",
        items: Array.from({ length: 3 }, (_, i) => ({
          id: `done-${i}`,
          title: tasks[Math.floor(random() * tasks.length)],
          meta: `Task ${i + 6}`,
        })),
      },
    ],
  }
}

export function mockCalendar(blockId = "default", monthOffset = 0) {
  const random = seedRandom(blockId + monthOffset)
  const today = new Date()
  const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const daysInMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate()

  return {
    month: targetMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    days: Array.from({ length: daysInMonth }, (_, i) => ({
      date: i + 1,
      events: Math.floor(random() * 4), // 0-3 events per day
      isToday:
        targetMonth.getMonth() === today.getMonth() &&
        targetMonth.getFullYear() === today.getFullYear() &&
        i + 1 === today.getDate(),
    })),
  }
}

// Default props generators for each block type
export function defaultPropsForType(type: string, blockId = "default"): Record<string, any> {
  switch (type) {
    case "table.orders":
      return { orders: mockOrders(blockId) }
    case "table.malleable":
      return {
        columns: [
          { id: "name", name: "Task Name", type: "text", width: 200 },
          { id: "status", name: "Status", type: "status", width: 120 },
          { id: "priority", name: "Priority", type: "select", width: 100, options: ["Low", "Medium", "High"] },
          { id: "dueDate", name: "Due Date", type: "date", width: 120 },
          { id: "progress", name: "Progress", type: "number", width: 100 }
        ],
        data: [
          { id: "1", name: "Design Review", status: "active", priority: "High", dueDate: "2024-12-25", progress: 75 },
          { id: "2", name: "Material Sourcing", status: "pending", priority: "Medium", dueDate: "2024-12-28", progress: 45 },
          { id: "3", name: "Quality Testing", status: "completed", priority: "High", dueDate: "2024-12-22", progress: 100 }
        ]
      }
    case "calendar":
      return {
        events: [
          { id: "1", title: "Team Meeting", date: new Date(2024, 11, 20), type: "meeting", description: "Weekly sync" },
          { id: "2", title: "Product Launch", date: new Date(2024, 11, 25), type: "deadline", description: "Final prep" },
          { id: "3", title: "Quality Review", date: new Date(2024, 11, 22), type: "task", description: "Review batch" }
        ]
      }
    case "chart.area":
      return { series: mockSeries(blockId, 14, 1) }
    case "chart.line":
      const ls = mockSeries(blockId, 10, 1)[0]
      return { data: ls.points.map(p => ({ name: p.x.slice(5), value: p.y })) }
    case "chart.bar":
      return { series: mockSeries(blockId, 8, 2) }
    case "chart.donut":
      return { slices: mockSlices(blockId, ["A", "B", "C", "D"]) }
    case "chart.scatter":
      return {
        points: Array.from({ length: 20 }, (_, i) => ({ x: i * 5 + 10, y: 60 + (i % 5) * 5 })),
        xAxis: { label: "Workload", min: 0, max: 100 },
        yAxis: { label: "Performance", min: 0, max: 100 },
        categories: ["Engineering", "Design", "Product"]
      }
    case "chart.area.interactive":
      return {} // Chart data is handled internally
    case "activity.timeline":
      return { events: mockActivity(blockId) }
    case "metric":
      const random = seedRandom(blockId)
      return {
        value: `${(random() * 20 + 80).toFixed(1)}%`,
        delta: `${random() > 0.5 ? "+" : "-"}${(random() * 5).toFixed(1)}% vs last week`
      }
    case "note":
      return {
        body: `# Welcome to Your Dashboard! 🚀

**Groovy** is your AI-powered workspace where you can create, customize, and organize everything exactly how you want it.

## ✨ What You Can Do:
- **🎯 Drag & Drop** - Move any component anywhere
- **📏 Resize** - Click and drag the blue handles
- **🎨 Customize** - Click the edit button to change colors, data, and more
- **🤖 AI Assistant** - Click the robot button to create new components
- **➕ Add More** - Click the expand button to add extensions

*This is YOUR workspace - make it perfect for you!* ✨`
      }
    case "metric.kpi":
      return mockKPI(blockId, "KPI")
    default:
      return {}
  }
}

export function defaultTitleForType(type: string): string {
  const titles: Record<string, string> = {
    "table.orders": "Production Table",
    "table.malleable": "Table",
    "calendar": "Calendar",
    "chart.area.interactive": "Area Chart",
    "chart.area": "Area Chart",
    "chart.line": "Line Chart",
    "chart.bar": "Bar Chart",
    "chart.donut": "Donut Chart",
    "chart.scatter": "Scatter Plot",
    "activity.timeline": "Activity Timeline",
    "metric": "Metric",
    "metric.kpi": "KPI",
    "note": "Note",
  }

  return titles[type] || "New Block"
}
