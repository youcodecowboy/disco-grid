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
    case "table.generic":
      return {
        data: Array.from({ length: 8 }, (_, i) => ({
          name: `Item ${i + 1}`,
          value: `Value ${i + 1}`,
          updated: new Date(Date.now() - i * 86400000).toLocaleDateString(),
        })),
      }
    case "metric.kpi":
      const random = seedRandom(blockId)
      return {
        value: `$${(random() * 10000 + 1000).toFixed(0)}`,
        delta: `${random() > 0.5 ? "+" : "-"}${(random() * 20).toFixed(1)}%`,
        trend: Array.from({ length: 7 }, () => random() * 100),
      }
    case "chart.line":
      return { series: mockSeries(blockId, 7, 1) }
    case "chart.bar":
      return { series: mockSeries(blockId, 5, 2) }
    case "chart.area":
      return { series: mockSeries(blockId, 7, 1) }
    case "chart.donut":
      return { slices: mockDonut(blockId) }
    case "activity.timeline":
      return { events: mockActivity(blockId) }
    case "messages.preview":
      return { messages: mockMessages(blockId) }
    case "commands.quick":
      return {
        commands: ["Create Order", "Add Note", "Generate Report", "Export CSV", "Send Email", "Update Status"],
      }
    case "kanban.simple":
      return mockKanban(blockId)
    case "calendar.mini":
      return mockCalendar(blockId)
    default:
      return {}
  }
}

export function defaultTitleForType(type: string): string {
  const titles: Record<string, string> = {
    "table.orders": "Recent Orders",
    "table.generic": "Data Table",
    "metric.kpi": "KPI Metric",
    "chart.line": "Line Chart",
    "chart.bar": "Bar Chart",
    "chart.area": "Area Chart",
    "chart.donut": "Breakdown",
    "activity.timeline": "Recent Activity",
    "messages.preview": "Messages",
    "commands.quick": "Quick Actions",
    "kanban.simple": "Task Board",
    "calendar.mini": "Calendar",
  }

  return titles[type] || "New Block"
}
