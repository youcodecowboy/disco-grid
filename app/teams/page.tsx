"use client"

import PageTemplate from "@/components/PageTemplate"
import { DashboardState } from "@/lib/useGridSystem"

// Teams page initial state - using standardized data structures
const teamsInitialState: DashboardState = {
  mode: "edit",
  layout: [
    { i: "teams-overview", x: 0, y: 0, w: 3, h: 2 },
    { i: "teams-performance", x: 3, y: 0, w: 3, h: 2 },
    { i: "teams-active", x: 6, y: 0, w: 3, h: 2 },
    { i: "teams-table", x: 0, y: 2, w: 12, h: 4 },
    { i: "teams-activity", x: 0, y: 6, w: 8, h: 3 },
    { i: "teams-calendar", x: 8, y: 6, w: 4, h: 3 },
    { i: "teams-capacity", x: 0, y: 4, w: 4, h: 2 },
    { i: "teams-welcome", x: 4, y: 4, w: 8, h: 2 }
  ],
  blocks: {
    "teams-overview": {
      id: "teams-overview",
      type: "metric.kpi",
      title: "Total Teams",
      props: {
        value: "12",
        delta: "+2",
        trend: [8, 9, 10, 11, 12, 13, 12]
      }
    },
    "teams-performance": {
      id: "teams-performance",
      type: "metric.chart",
      title: "Team Performance",
      props: {
        value: "87%",
        delta: "+5%",
        trend: [82, 84, 85, 86, 87, 88, 87]
      }
    },
    "teams-active": {
      id: "teams-active",
      type: "metric.items",
      title: "Active Members",
      props: {
        value: "156",
        delta: "+12",
        trend: [140, 145, 150, 152, 154, 155, 156]
      }
    },
    "teams-table": {
      id: "teams-table",
      type: "table.malleable",
      title: "Team Members",
      props: {
        columns: ["Name", "Role", "Team", "Status", "Performance"],
        rows: [
          ["John Smith", "Developer", "Engineering", "Active", "95%"],
          ["Sarah Johnson", "Designer", "Design", "Active", "88%"],
          ["Mike Wilson", "Manager", "Product", "Active", "92%"],
          ["Lisa Brown", "Developer", "Engineering", "Active", "87%"],
          ["David Lee", "Designer", "Design", "Active", "91%"],
          ["Emma Davis", "QA Engineer", "Testing", "Active", "89%"],
          ["Alex Chen", "DevOps", "Infrastructure", "Active", "94%"],
          ["Maria Garcia", "Product Manager", "Product", "Active", "90%"]
        ]
      }
    },
    "teams-activity": {
      id: "teams-activity",
      type: "activity.timeline",
      title: "Recent Activity",
      props: {
        activities: [
          { time: "2 hours ago", user: "John Smith", action: "Completed task #1234", status: "success" },
          { time: "4 hours ago", user: "Sarah Johnson", action: "Updated design mockups", status: "success" },
          { time: "6 hours ago", user: "Mike Wilson", action: "Scheduled team meeting", status: "info" },
          { time: "1 day ago", user: "Lisa Brown", action: "Submitted code review", status: "success" },
          { time: "1 day ago", user: "David Lee", action: "Fixed critical bug", status: "warning" },
          { time: "2 days ago", user: "Emma Davis", action: "Completed testing phase", status: "success" }
        ]
      }
    },
    "teams-calendar": {
      id: "teams-calendar",
      type: "calendar.mini",
      title: "Team Events",
      props: {
        month: "January 2024",
        days: [
          { date: 1, events: 0, isToday: false },
          { date: 2, events: 0, isToday: false },
          { date: 3, events: 0, isToday: false },
          { date: 4, events: 0, isToday: false },
          { date: 5, events: 0, isToday: false },
          { date: 6, events: 0, isToday: false },
          { date: 7, events: 0, isToday: false },
          { date: 8, events: 0, isToday: false },
          { date: 9, events: 0, isToday: false },
          { date: 10, events: 0, isToday: false },
          { date: 11, events: 0, isToday: false },
          { date: 12, events: 0, isToday: false },
          { date: 13, events: 0, isToday: false },
          { date: 14, events: 0, isToday: false },
          { date: 15, events: 1, isToday: false },
          { date: 16, events: 0, isToday: false },
          { date: 17, events: 0, isToday: false },
          { date: 18, events: 1, isToday: false },
          { date: 19, events: 0, isToday: false },
          { date: 20, events: 1, isToday: false },
          { date: 21, events: 0, isToday: false },
          { date: 22, events: 0, isToday: false },
          { date: 23, events: 0, isToday: false },
          { date: 24, events: 0, isToday: false },
          { date: 25, events: 0, isToday: false },
          { date: 26, events: 0, isToday: false },
          { date: 27, events: 0, isToday: false },
          { date: 28, events: 0, isToday: false },
          { date: 29, events: 0, isToday: false },
          { date: 30, events: 0, isToday: false },
          { date: 31, events: 0, isToday: false }
        ]
      }
    },
    "teams-capacity": {
      id: "teams-capacity",
      type: "capacity.tracker",
      title: "Team Capacity",
      props: {
        totalCapacity: 100,
        usedCapacity: 78,
        availableCapacity: 22,
        teams: [
          { name: "Engineering", capacity: 40, used: 35, color: "bg-blue-500" },
          { name: "Design", capacity: 25, used: 20, color: "bg-purple-500" },
          { name: "Product", capacity: 20, used: 15, color: "bg-green-500" },
          { name: "QA", capacity: 15, used: 8, color: "bg-orange-500" }
        ],
        overallUtilization: 78
      }
    },
    "teams-welcome": {
      id: "teams-welcome",
      type: "note",
      title: "Quick Note",
      props: {
        body: `# 👥 Welcome to Team Management! 🚀

**Unlock the full power of team collaboration** with our comprehensive team management system.

## ✨ Teams Page Superpowers:

**🎯 Team Overview & Analytics:**
• **Real-time Metrics** - Track team performance, member count, and activity levels
• **Visual Dashboards** - Beautiful charts showing team trends and productivity
• **Quick Insights** - Instant visibility into team health and performance

**👥 Member Management:**
• **Team Member Profiles** - Complete member information with roles and performance
• **Role Assignment** - Easily assign and manage team roles and responsibilities
• **Performance Tracking** - Monitor individual and team performance metrics
• **Status Management** - Track active, inactive, and project-specific statuses

**📊 Advanced Team Analytics:**
• **Performance Trends** - Historical data showing team improvement over time
• **Activity Monitoring** - Real-time activity feeds and team engagement
• **Resource Allocation** - Optimize team assignments and workload distribution
• **Productivity Insights** - Identify high-performing teams and improvement areas

**🎨 Customizable Team Views:**
• **Drag & Drop Layout** - Arrange team information exactly how you need it
• **Resizable Components** - Scale charts and tables to fit your workflow
• **Personalized Dashboards** - Create team-specific views for different stakeholders
• **Real-time Updates** - See changes instantly across all team views

## 🚀 Getting Started with Teams:

**1. Explore Your Teams:**
• Review current team structure and member distribution
• Analyze performance metrics and identify trends
• Understand team dynamics and collaboration patterns

**2. Customize Your View:**
• Drag and resize blocks to create your perfect layout
• Add new team metrics and analytics as needed
• Personalize the dashboard for your specific needs

**3. Manage Team Operations:**
• Use "Add Team" to create new teams and departments
• Click "Manage Teams" to configure team settings and permissions
• Edit team member information and performance data

**4. Monitor & Optimize:**
• Track team performance in real-time
• Identify bottlenecks and improvement opportunities
• Celebrate team successes and achievements

## 💡 Team Management Best Practices:

**🎯 Effective Team Leadership:**
• **Clear Communication** - Use the activity feed to keep teams informed
• **Performance Reviews** - Leverage metrics for objective performance discussions
• **Resource Planning** - Use analytics to optimize team assignments
• **Continuous Improvement** - Monitor trends to identify growth opportunities

**📈 Data-Driven Decisions:**
• **Performance Metrics** - Use real-time data to make informed decisions
• **Trend Analysis** - Identify patterns and predict future needs
• **Team Optimization** - Balance workloads and maximize productivity
• **Success Measurement** - Track progress toward team and organizational goals

*Your teams are your greatest asset - let's make them unstoppable!* ✨`
      }
    }
  }
}

export default function TeamsPage() {
  return (
    <PageTemplate
      pageTitle="Teams"
      pageSubtext="Manage team members and performance"
      storageKey="groovy:teams:v1"
      frozenStorageKey="groovy:teams:frozen"
      initialState={teamsInitialState}
      showFilters={true}
      functionButtons={[
        {
          label: "Add Team",
          variant: "default",
          onClick: () => {
            // TODO: Implement add team functionality
            console.log("Add Team clicked")
          }
        },
        {
          label: "Manage Teams",
          variant: "outline",
          onClick: () => {
            // TODO: Implement manage teams modal
            console.log("Manage Teams clicked")
          }
        }
      ]}
    />
  )
}
