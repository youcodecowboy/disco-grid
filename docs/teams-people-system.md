# Teams & People Management System Blueprint — 05/10/25

## Mission
- Build a comprehensive people and device management hub that serves as the operational nerve center for factory, warehouse, and field operations.
- Provide deep analytics on team and individual performance, efficiency, and task completion across all workflows, items, and orders.
- Enable unlimited user accounts with robust permission systems and device assignment without seat-based pricing constraints.
- Create a domain-agnostic team structure that adapts to fashion manufacturing, construction, defense, and any operational environment.
- Integrate seamlessly with Task Master, Items, Orders, Workflows, and Hardware to provide a 360° view of people and their work.

## Experience Principles
- **Analytics-First Landing**: The Teams page is not just user management—it's a performance dashboard showing top teams, efficiency metrics, and actionable insights.
- **People as Assets**: Treat workers, managers, and stakeholders as first-class entities with rich profiles, assignment histories, and performance trajectories.
- **Device-Aware Operations**: Hardware (mobile scanners, tablets, wearables) is assigned to people and teams with real-time tracking of connectivity, battery, and usage.
- **Permission Granularity**: Fine-grained permissions allow precise control over who can view, edit, scan, approve, or manage different aspects of the system.
- **Domain Flexibility**: Whether managing seamstresses, construction crews, or armory staff, the same system adapts to different roles, workflows, and KPIs.

## Personas & Primary Jobs
- **Operations Manager**: Views cross-team performance, identifies bottlenecks, reassigns workloads, and optimizes resource allocation.
- **Team Lead**: Monitors their team's progress, assigns tasks, tracks device usage, and ensures SLA adherence.
- **HR / Admin**: Creates users, manages permissions, assigns teams, provisions hardware, and maintains organizational structure.
- **Executive / Stakeholder**: Reviews high-level team analytics, efficiency trends, and workforce utilization for strategic planning.
- **Floor Worker**: Views their assigned tasks, checks in/out of shifts, scans items, and reports progress (via mobile).

## Core Entities

### 1. Person (User)
**Purpose:** Individual human account with authentication, permissions, and work history

```typescript
type Person = {
  id: string                      // UUID
  email: string
  name: string
  avatar?: string
  phoneNumber?: string
  
  // Organizational
  role: string                    // "Floor Worker", "Team Lead", "QA Inspector", "Manager", "Admin"
  department: string              // "Production", "Quality Control", "Shipping", "Admin"
  teamIds: string[]               // Assigned to multiple teams
  primaryTeamId?: string          // Default team
  employeeId?: string             // External HR system ID
  hireDate?: string
  
  // Status
  status: "Active" | "Inactive" | "On Leave" | "Terminated"
  shiftSchedule?: ShiftSchedule
  currentShift?: "Day" | "Night" | "Swing" | "Off"
  
  // Permissions (role-based + custom overrides)
  permissions: Permission[]
  permissionOverrides?: PermissionOverride[]
  
  // Device assignments
  assignedDevices: DeviceAssignment[]
  primaryDevice?: string          // Device ID
  
  // Performance & activity
  performanceMetrics: PerformanceMetrics
  taskStats: TaskStats
  itemStats: ItemStats
  activityLog: ActivityEntry[]
  
  // Contact preferences
  notificationSettings: NotificationPreferences
  timezone: string
  language: string
  
  // Metadata
  customAttributes: Array<{ field: string; value: string }>
  tags: string[]                  // "Certified Welder", "Bilingual", "Forklift Certified"
  notes?: string
  
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  lastActivityAt?: string
}

type ShiftSchedule = {
  type: "Fixed" | "Rotating" | "Flexible"
  shifts: Array<{
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"
    startTime: string             // "06:00"
    endTime: string               // "14:00"
  }>
  timezone: string
}

type PerformanceMetrics = {
  // Efficiency
  overallEfficiency: number       // 0-100%
  tasksCompletedOnTime: number
  tasksCompletedLate: number
  averageTaskCompletionTime: number  // Minutes
  
  // Quality
  qcPassRate: number              // 0-100%
  itemsScanned: number
  itemsCompleted: number
  defectRate: number
  
  // Volume
  itemsPerHour: number
  tasksPerDay: number
  shiftsWorked: number
  hoursWorked: number
  
  // Trends (last 30 days)
  efficiencyTrend: number[]       // Daily efficiency scores
  volumeTrend: number[]           // Daily item completion counts
  
  // Rankings
  teamRank?: number               // Rank within team
  globalRank?: number             // Rank across org
  
  lastCalculatedAt: string
}

type TaskStats = {
  total: number
  completed: number
  inProgress: number
  overdue: number
  averageCompletionTime: number   // Minutes
  completionRate: number          // 0-100%
  
  // By priority
  criticalCompleted: number
  highCompleted: number
  mediumCompleted: number
  lowCompleted: number
  
  // Recent activity
  completedLast7Days: number
  completedLast30Days: number
}

type ItemStats = {
  itemsScanned: number
  itemsCompleted: number
  componentsScanned: number
  componentsCompleted: number
  
  // By workflow stage
  stageCompletions: Record<string, number>
  
  // Recent activity
  scansLast7Days: number
  scansLast30Days: number
}

type Permission = {
  resource: string                // "items", "orders", "tasks", "teams", "workflows"
  action: string                  // "view", "create", "edit", "delete", "scan", "approve"
  scope: "all" | "team" | "assigned"  // What they can access
  conditions?: Record<string, any>     // Additional constraints
}

type PermissionOverride = {
  resource: string
  action: string
  granted: boolean                // true = allow, false = deny
  reason?: string
  expiresAt?: string
}

type NotificationPreferences = {
  channels: Array<"email" | "sms" | "push" | "in_app">
  taskAssignments: boolean
  taskDueSoon: boolean
  taskOverdue: boolean
  itemUpdates: boolean
  teamAnnouncements: boolean
  systemAlerts: boolean
  quietHours?: { start: string; end: string; timezone: string }
}
```

### 2. Team
**Purpose:** Organizational unit grouping people with shared goals, workflows, and accountability

```typescript
type Team = {
  id: string                      // UUID
  name: string                    // "Sewing Line A", "QA Team 2", "Shipping Crew"
  description?: string
  
  // Hierarchy
  parentTeamId?: string           // For nested teams
  department: string              // "Production", "Quality", "Logistics"
  location: string                // Physical location or facility
  
  // Status
  status: "Active" | "Inactive" | "Archived"
  
  // Members
  memberIds: string[]             // Person IDs
  leadIds: string[]               // Team leads (subset of members)
  managerIds: string[]            // Managers overseeing team
  capacity: number                // Max team size
  
  // Specialization
  capabilities: string[]          // "Cut & Sew", "Leather Working", "Quality Inspection"
  certifications: string[]        // "ISO 9001", "OSHA Certified"
  equipmentAccess: string[]       // "Industrial Sewing Machines", "Laser Cutters"
  
  // Work assignment
  assignedWorkflowIds: string[]   // Workflows this team handles
  assignedOrderIds: string[]      // Active orders
  assignedItemCodes: string[]     // Items currently assigned
  
  // Performance & analytics
  performanceMetrics: TeamPerformanceMetrics
  utilizationRate: number         // 0-100%
  
  // Devices
  assignedDevices: DeviceAssignment[]
  
  // Schedule
  shiftSchedule?: ShiftSchedule
  workingHours?: { start: string; end: string }
  
  // Metadata
  customAttributes: Array<{ field: string; value: string }>
  tags: string[]
  color?: string                  // For visual identification
  icon?: string
  
  createdAt: string
  updatedAt: string
  lastActiveAt?: string
}

type TeamPerformanceMetrics = {
  // Overall
  overallEfficiency: number       // 0-100%
  memberCount: number
  activeMembers: number
  
  // Tasks
  tasksCompleted: number
  tasksInProgress: number
  tasksOverdue: number
  taskCompletionRate: number      // 0-100%
  averageTaskTime: number         // Minutes
  
  // Items
  itemsCompleted: number
  itemsInProgress: number
  itemsScanned: number
  itemsPerHour: number
  
  // Quality
  qcPassRate: number              // 0-100%
  defectRate: number
  reworkRate: number
  
  // Efficiency benchmarks
  aheadOfSchedule: number         // # of items/tasks ahead
  behindSchedule: number          // # of items/tasks behind
  onSchedule: number
  
  // Trends (last 30 days)
  efficiencyTrend: number[]
  volumeTrend: number[]
  qualityTrend: number[]
  
  // Rankings
  departmentRank?: number
  globalRank?: number
  
  lastCalculatedAt: string
}
```

### 3. Device
**Purpose:** Hardware (phones, tablets, scanners, wearables) assigned to people/teams for floor operations

```typescript
type Device = {
  id: string                      // UUID or MAC address
  name: string                    // "Scanner-A-01", "Tablet-Floor-3"
  type: "Mobile Phone" | "Tablet" | "Handheld Scanner" | "Wearable" | "Workstation"
  
  // Hardware info
  manufacturer?: string           // "Zebra", "Honeywell", "Apple", "Samsung"
  model?: string
  serialNumber?: string
  osVersion?: string
  appVersion?: string
  
  // Assignment
  assignedToPersonId?: string     // Currently assigned to person
  assignedToTeamId?: string       // Pooled to team
  assignmentType: "Individual" | "Team Pool" | "Shared"
  assignedAt?: string
  
  // Status & health
  status: "Active" | "Inactive" | "Maintenance" | "Lost" | "Retired"
  batteryLevel?: number           // 0-100%
  batteryStatus: "Charging" | "Discharging" | "Full" | "Low" | "Critical" | "Unknown"
  connectivity: "Online" | "Offline" | "Poor Signal"
  lastPingAt?: string
  
  // Location
  lastKnownLocation?: {
    lat: number
    lon: number
    accuracy: number              // Meters
    timestamp: string
  }
  locationHistory?: Array<{
    lat: number
    lon: number
    timestamp: string
  }>
  assignedLocation?: string       // "Sewing Floor A", "Warehouse B"
  
  // Usage stats
  usageStats: {
    totalScans: number
    scansToday: number
    averageScansPerDay: number
    uptime: number                // Percentage
    lastUsedAt?: string
  }
  
  // Maintenance
  maintenanceSchedule?: {
    lastMaintenance?: string
    nextMaintenance?: string
    maintenanceInterval: number   // Days
  }
  alerts: DeviceAlert[]
  
  // Configuration
  capabilities: string[]          // "QR Scanner", "NFC", "Camera", "GPS"
  installedApps: string[]
  
  // Metadata
  purchaseDate?: string
  warrantyExpiry?: string
  cost?: number
  notes?: string
  
  createdAt: string
  updatedAt: string
}

type DeviceAssignment = {
  deviceId: string
  personId?: string
  teamId?: string
  assignedAt: string
  assignedBy: string
  expiresAt?: string
  notes?: string
}

type DeviceAlert = {
  id: string
  type: "Low Battery" | "Offline" | "Maintenance Due" | "Lost Connection" | "Security"
  severity: "Critical" | "Warning" | "Info"
  message: string
  timestamp: string
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
}
```

### 4. Assignment (Task/Item/Order → Person/Team)
**Purpose:** Links work (tasks, items, orders) to people and teams with accountability tracking

```typescript
type WorkAssignment = {
  id: string
  
  // What is assigned
  workType: "Task" | "Item" | "Order" | "Workflow Stage"
  workId: string                  // Task ID, Item Code ID, Order ID, etc.
  workName: string                // Display name
  
  // Who it's assigned to
  assigneeType: "Person" | "Team"
  assigneeId: string              // Person ID or Team ID
  assigneeName: string
  
  // Assignment details
  role: "Owner" | "Collaborator" | "Reviewer" | "Watcher"
  assignedBy: string              // Person ID who made assignment
  assignedAt: string
  
  // Status
  status: "Pending" | "Accepted" | "In Progress" | "Completed" | "Rejected"
  acceptedAt?: string
  startedAt?: string
  completedAt?: string
  
  // Tracking
  estimatedDuration?: number      // Minutes
  actualDuration?: number         // Minutes
  effort?: number                 // 0-100% estimated effort
  priority: "Critical" | "High" | "Medium" | "Low"
  
  // Performance
  completedOnTime?: boolean
  qualityScore?: number           // 0-100%
  notes?: string
  
  // Context
  orderId?: string
  itemCodeId?: string
  workflowId?: string
  stageId?: string
  
  createdAt: string
  updatedAt: string
}
```

## Integration Points

### 1. Task Master Integration
- **Task Assignments**: Tasks from `/tasks` automatically create `WorkAssignment` records linking to people/teams
- **Performance Tracking**: Task completion data feeds into `Person.taskStats` and `Team.performanceMetrics`
- **Analytics Roll-up**: Teams page aggregates task metrics to show:
  - Tasks completed per person/team
  - Average task completion time
  - On-time vs. late completion rates
  - Task overdue alerts
- **Calendar View**: Team calendar shows tasks assigned to team members with workload visualization
- **Ownership**: Every task has `owning_team_id` (from Task Master) which links to Team entity

### 2. Items System Integration
- **Item Assignments**: Items and line items can be assigned to teams/people during order creation or production
- **Scan Tracking**: Every QR scan captures `scannedBy` (person ID) and feeds into `Person.itemStats`
- **Workflow Stage Ownership**: Each workflow stage has an owner (person/team) from item profiles
- **Performance Metrics**:
  - Items scanned per person/team
  - Items completed per person/team
  - Workflow stage completion times
  - Quality metrics (defect rates, rework)
- **Floor App**: Mobile scanning links device → person → item for full traceability

### 3. Orders Integration
- **Order Ownership**: Orders have `owner` and `assignedTeam` fields that reference Person and Team entities
- **Item Assignments**: When order items are assigned to teams during order creation, `WorkAssignment` records are created
- **Contacts**: Order contacts (from `contacts` array) can be internal (Person) or external (Client)
- **Notifications**: Order milestone notifications sent to assigned team members based on their `notificationSettings`

### 4. Workflows Integration
- **Stage Ownership**: Each workflow stage can have `allowedRoles` that map to Person roles
- **Capability Matching**: Teams with specific `capabilities` can be auto-assigned to matching workflows
- **Parallel Work**: Complex items with parallel component workflows can distribute work across multiple teams
- **Stage Completion**: Workflow stage completions tracked per person for performance analytics

### 5. Hardware/Device Integration
- **Device Assignment**: Devices assigned to people/teams for scanning, task updates, form submissions
- **Usage Tracking**: Monitor which devices are used for which scans/tasks
- **Health Monitoring**: Real-time battery, connectivity, and location tracking
- **Fleet Management**: View all devices, assign/unassign, track maintenance schedules
- **Offline Sync**: Device connectivity status affects work assignment strategies

## Page Structure & UX

### Landing View: Teams Analytics Dashboard
**Route:** `/app/teams/page.tsx` (existing page, enhanced)

**Default Layout (Malleable Grid):**

#### Top Row: Key Metrics (3 cards)
1. **Total Teams** - Count, trend, new teams this month
2. **Active Members** - Total people, trend, utilization rate
3. **Overall Efficiency** - Aggregate efficiency across all teams, trend

#### Second Row: Performance Blocks
1. **Top Performing Teams** (table/leaderboard)
   - Team name, efficiency %, tasks completed, items scanned, trend
   - Click team → Navigate to Team Detail page
   
2. **Top Performing Individuals** (table/leaderboard)
   - Person name, team, efficiency %, tasks/items completed, trend
   - Click person → Navigate to Person Detail page

3. **Bottom Performing Teams** (with context)
   - Teams behind schedule
   - Show blockers/reasons
   - Quick actions to reassign work

#### Third Row: Filtering & Analysis
1. **Team Filtering Panel**
   - Filter by department, location, capability, status
   - Filter by efficiency range, utilization
   - Date range selector
   
2. **Performance Charts**
   - Efficiency trends over time (line chart)
   - Task completion rates (bar chart)
   - Quality metrics (donut chart for pass/fail rates)

#### Fourth Row: Real-Time Activity
1. **Recent Scans/Activity Timeline**
   - Who scanned what, when
   - Task completions
   - Device activity
   
2. **Alerts & Issues**
   - Overdue tasks
   - Low-performing teams
   - Device issues (low battery, offline)
   - People on leave or inactive

#### Fifth Row: Device Management
1. **Device Fleet Overview**
   - Total devices, online/offline
   - Battery levels (heatmap)
   - Maintenance due
   - Click device → Device detail modal

2. **Device Assignments**
   - Who has what device
   - Unassigned devices
   - Usage statistics

#### Sixth Row: Team List (Malleable Table)
- All teams with: Name, Members, Efficiency, Tasks, Items, Status, Devices
- Click row → Navigate to Team Detail page
- Bulk actions: Assign work, message team, export data

#### Action Buttons (Top Right)
- **Add Person** - Create new user account
- **Add Team** - Create new team
- **Manage Devices** - Device fleet management
- **Import Users** - Bulk CSV import
- **Permissions** - Role & permission management

### Team Detail Page
**Route:** `/app/teams/[teamId]/page.tsx`

**Malleable Grid Layout:**

#### Header Block (Fixed)
- Team name, description, status badge
- Member count, lead(s), location
- Quick actions: Edit team, Add member, Assign work, Message team

#### Performance Dashboard
1. **Team KPI Cards**
   - Efficiency %, trend
   - Tasks completed/in progress/overdue
   - Items scanned/completed
   - Quality metrics (QC pass rate, defect rate)

2. **Efficiency Over Time** (chart)
   - 30-day trend
   - Compare to department average
   - Compare to org average

3. **Workload Distribution**
   - Visual breakdown of member workloads
   - Who's overloaded vs. underutilized
   - Recommended rebalancing actions

#### Members Table
- Name, role, efficiency, tasks, items, status, devices
- Click row → Navigate to Person Detail page
- Inline actions: Reassign work, message, edit permissions

#### Assigned Work
1. **Active Tasks** (from Task Master)
   - Tasks assigned to team members
   - Due dates, priorities, status
   - Overdue alerts

2. **Assigned Items** (from Items system)
   - Items currently assigned to team
   - Workflow stages team owns
   - Progress indicators

3. **Orders** (from Orders system)
   - Orders team is working on
   - Delivery timelines
   - Order progress

#### Devices Assigned to Team
- Device list with status, battery, connectivity
- Assign/unassign devices
- Device health alerts

#### Team Calendar
- Shift schedules
- Task deadlines
- Member availability (leave, shifts)

#### Activity Timeline
- Recent team activity
- Scans, completions, milestones
- Audit trail

### Person Detail Page
**Route:** `/app/teams/people/[personId]/page.tsx`

**Malleable Grid Layout:**

#### Header Block (Fixed)
- Name, avatar, role, team(s)
- Status (active, on shift, off shift)
- Contact info, employee ID
- Quick actions: Edit profile, Assign task, Message, View schedule

#### Performance Dashboard
1. **Individual KPIs**
   - Efficiency %, rank in team, rank globally
   - Tasks completed (today, week, month)
   - Items scanned/completed
   - Quality score

2. **Performance Trends** (charts)
   - Efficiency over time
   - Volume over time (items/tasks per day)
   - Quality metrics

3. **Rankings**
   - Show person's rank within team
   - Show global rank
   - Compare to team average

#### Assigned Work
1. **My Tasks** (from Task Master)
   - Current tasks, priorities, due dates
   - Overdue alerts
   - Task completion history

2. **Assigned Items** (from Items system)
   - Items person is working on
   - Workflow stages owned by person
   - Recent scans

3. **Work History** (timeline)
   - Historical assignments
   - Completion records
   - Notes and feedback

#### Devices
- Assigned devices (primary + shared)
- Device status, battery, last used
- Scan history from each device

#### Schedule & Availability
- Shift schedule
- Time off requests
- Working hours

#### Permissions & Access
- Current role and permissions
- Resource access (what they can view/edit)
- Permission overrides
- Audit log of permission changes

#### Activity Log
- Comprehensive activity history
- Scans, task completions, edits
- Login history

### Device Management View
**Route:** `/app/teams/devices` or modal overlay

**Layout:**

#### Device Fleet Overview
1. **Status Summary**
   - Total devices, active, inactive, maintenance
   - Battery health overview (% of devices below thresholds)
   - Connectivity status (online/offline/poor signal)

2. **Device Map** (if GPS enabled)
   - Show device locations on facility map
   - Color-coded by status/battery

3. **Alerts Dashboard**
   - Low battery alerts
   - Offline devices
   - Maintenance due
   - Lost devices (no ping in X hours)

#### Device List (Table)
- Name, type, assigned to, battery, connectivity, last ping, status
- Click row → Device detail modal
- Bulk actions: Assign, unassign, send maintenance alert

#### Device Detail Modal
- Device info (model, serial, OS version)
- Assignment history
- Battery & connectivity charts
- Usage stats (scans, uptime)
- Location history (map)
- Maintenance schedule
- Actions: Assign/unassign, retire, report lost

## Data Model Summary

### Relationships
```
Person
├── memberOf → Team (many-to-many)
├── assignedDevices → Device (one-to-many)
├── workAssignments → WorkAssignment (one-to-many)
├── taskAssignments → Task (via Task Master)
├── itemScans → LineItem (via Item system)
└── activityLog → ActivityEntry

Team
├── members → Person (many-to-many)
├── assignedDevices → Device (one-to-many)
├── workAssignments → WorkAssignment (one-to-many)
├── assignedOrders → Order (many-to-many)
├── assignedItems → ItemCode (many-to-many)
└── assignedWorkflows → Workflow (many-to-many)

Device
├── assignedToPerson → Person (many-to-one)
├── assignedToTeam → Team (many-to-one)
├── usageHistory → DeviceUsageLog
└── alerts → DeviceAlert

WorkAssignment (bridge entity)
├── assignee → Person OR Team
├── task → Task (optional)
├── item → ItemCode (optional)
├── order → Order (optional)
└── workflowStage → WorkflowStage (optional)
```

### Storage Strategy
- **localStorage** (MVP/prototype): `groovy:teams:v1`, `groovy:people:v1`, `groovy:devices:v1`
- **Future database**: Separate tables for Person, Team, Device, WorkAssignment, DeviceAlert, ActivityEntry
- **Real-time sync**: WebSocket for live device status, activity updates, performance metrics

## Key Features & Capabilities

### 1. Unlimited Users (Usage-Based Pricing)
- No seat limits - create as many users as needed
- Pricing based on scans, items, tasks, not user count
- Encourages full team adoption
- Supports seasonal/temporary workers without cost concerns

### 2. Dynamic Performance Analytics
- Real-time efficiency calculations
- Automatic ranking/leaderboards
- Trend analysis (daily, weekly, monthly)
- Benchmark against team/department/organization averages
- Exportable reports for management

### 3. Granular Permissions System
- Role-based access control (RBAC)
  - Pre-defined roles: Admin, Manager, Team Lead, Floor Worker, QA Inspector, Viewer
  - Custom roles with fine-grained permissions
- Resource-level permissions (items, orders, tasks, teams, workflows)
- Action-level permissions (view, create, edit, delete, scan, approve)
- Scope-level permissions (all, team, assigned only)
- Per-user overrides for exceptions
- Permission audit trail

### 4. Device Fleet Management
- Assign devices to individuals or team pools
- Real-time battery & connectivity monitoring
- Location tracking (GPS-enabled devices)
- Usage analytics (scans per day, uptime)
- Maintenance scheduling
- Lost device alerts
- Remote device configuration (future)

### 5. Work Assignment & Balancing
- Assign tasks, items, orders to people/teams
- Visual workload indicators
- Auto-balancing suggestions (AI-powered, future)
- Skill/capability matching
- Capacity tracking (prevent overload)
- Reassignment workflows

### 6. Shift & Schedule Management
- Define shift schedules (fixed, rotating, flexible)
- Track who's on shift
- Availability tracking (time off, sick leave)
- Shift handoff procedures
- Calendar integration

### 7. Integration with Task Master
- Tasks assigned to teams/people automatically appear in Teams analytics
- Task completion feeds performance metrics
- Workload visualization based on task volume
- Task-based efficiency calculations

### 8. Integration with Items & Scanning
- Every scan captured with person ID + device ID
- Scan frequency contributes to performance scores
- Workflow stage ownership tracked per person
- Quality metrics (defects, rework) attributed to individuals/teams

### 9. Communication & Notifications
- In-app notifications
- Email/SMS alerts
- Push notifications (mobile)
- Configurable per user
- Team announcements
- @mentions in tasks/items

### 10. Domain-Agnostic Design
- Customizable roles (not hardcoded to manufacturing)
- Flexible capabilities/certifications
- Malleable attributes for people and teams
- Adaptable performance metrics based on industry
- Custom KPIs per organization

## Implementation Roadmap

### Phase 0: Foundation (Weeks 1-2)
- Define TypeScript types for Person, Team, Device, WorkAssignment
- Create mock data generators
- Set up localStorage storage keys
- Build basic CRUD operations

### Phase 1: Teams Landing Page (Weeks 3-4)
- Enhance existing `/app/teams/page.tsx` with analytics
- Build team performance metrics blocks
- Add device fleet overview
- Implement filtering and search
- Create "Add Team" and "Add Person" modals

### Phase 2: Team Detail Page (Weeks 5-6)
- Create `/app/teams/[teamId]/page.tsx`
- Build team performance dashboard
- Implement members table
- Add assigned work sections
- Device assignment interface

### Phase 3: Person Detail Page (Weeks 7-8)
- Create `/app/teams/people/[personId]/page.tsx`
- Build individual performance dashboard
- Implement work history and activity log
- Add permissions management UI
- Schedule/availability view

### Phase 4: Device Management (Weeks 9-10)
- Build device fleet overview
- Real-time status monitoring (simulate for MVP)
- Device assignment workflows
- Alert system for battery/connectivity
- Maintenance scheduling

### Phase 5: Permissions & Roles (Weeks 11-12)
- Implement role-based permission system
- Build role editor UI
- Permission override mechanism
- Audit trail for permission changes
- Integration with other modules (lock down based on permissions)

### Phase 6: Integration Hooks (Weeks 13-14)
- Connect Task Master assignments to WorkAssignment
- Link item scans to Person.itemStats
- Aggregate order assignments
- Workflow stage ownership tracking
- Real-time metric calculations

### Phase 7: Analytics & Reporting (Weeks 15-16)
- Advanced performance calculations
- Efficiency algorithms
- Ranking/leaderboard logic
- Trend analysis
- Export capabilities (CSV, PDF reports)

### Phase 8: Hardware Integration (Weeks 17+)
- Real device connectivity (via API)
- Battery/connectivity monitoring (actual hardware)
- GPS tracking integration
- Device provisioning automation
- Mobile app device pairing

## Analytics & Metrics Formulas

### Efficiency Score Calculation
```typescript
function calculatePersonEfficiency(person: Person): number {
  const taskScore = (person.taskStats.completedOnTime / person.taskStats.total) * 40
  const volumeScore = Math.min((person.itemStats.scansLast30Days / expectedScansPerMonth) * 30, 30)
  const qualityScore = person.performanceMetrics.qcPassRate * 0.30
  
  return Math.min(taskScore + volumeScore + qualityScore, 100)
}

function calculateTeamEfficiency(team: Team): number {
  const memberEfficiencies = team.memberIds.map(id => getPersonEfficiency(id))
  const avgMemberEfficiency = memberEfficiencies.reduce((a, b) => a + b, 0) / memberEfficiencies.length
  
  const taskCompletionRate = team.performanceMetrics.taskCompletionRate * 0.40
  const qualityScore = team.performanceMetrics.qcPassRate * 0.30
  const scheduleAdherence = (team.performanceMetrics.onSchedule / 
    (team.performanceMetrics.onSchedule + team.performanceMetrics.behindSchedule)) * 0.30
  
  return (avgMemberEfficiency * 0.50) + (taskCompletionRate + qualityScore + scheduleAdherence) * 0.50
}
```

### Utilization Rate
```typescript
function calculateUtilization(team: Team): number {
  const totalCapacity = team.capacity * 8 * 5 // 8 hours/day, 5 days/week
  const actualHoursWorked = team.members.reduce((sum, member) => 
    sum + member.performanceMetrics.hoursWorked, 0)
  
  return (actualHoursWorked / totalCapacity) * 100
}
```

### Performance Ranking
```typescript
function rankPeople(people: Person[]): Person[] {
  return people
    .sort((a, b) => b.performanceMetrics.overallEfficiency - a.performanceMetrics.overallEfficiency)
    .map((person, index) => ({
      ...person,
      performanceMetrics: {
        ...person.performanceMetrics,
        globalRank: index + 1
      }
    }))
}
```

## Security & Compliance

### Data Privacy
- Personal information (email, phone) accessible only to HR/Admin roles
- Performance data visible to person, their team lead, and managers
- Audit logs for all profile access
- GDPR compliance (right to be forgotten, data export)

### Authentication
- Email/password authentication
- SSO integration (future)
- Two-factor authentication (2FA) for admin roles
- Session management
- Device pairing (NFC badge, future)

### Audit Trail
- All permission changes logged
- Work assignments tracked
- Performance metric calculation history
- Device assignment changes
- Login/logout events

## Open Questions

1. **Overtime & Labor Rules**: Do we need to track overtime, breaks, labor law compliance?
2. **Payroll Integration**: Should performance metrics integrate with payroll systems?
3. **Training & Certifications**: Track training completion, certification expiry, skill development?
4. **Multi-Facility Support**: How do we handle people working across multiple locations?
5. **External Workers**: How do we model contractors, vendors, temporary staff differently from full-time employees?
6. **Capacity Planning**: Should we build AI-powered capacity planning and demand forecasting?
7. **Mobile Team App**: Do team members need a dedicated mobile app beyond the Floor App for item scanning?
8. **Real-Time Collaboration**: Should team pages support real-time multi-user editing (like Figma)?

## Success Metrics

### Adoption
- 95%+ of workforce has active accounts
- 80%+ of teams using analytics dashboard weekly
- Average 10+ logins per user per week

### Performance Visibility
- Management can identify top/bottom performers in <2 clicks
- Real-time efficiency data available within 1 minute of activity
- 100% of work assignments traceable to individuals

### Hardware Utilization
- 90%+ device uptime
- <5% devices with critical battery/connectivity issues
- Device-to-person ratio optimized (minimize idle devices)

### System Health
- Teams page loads in <500ms
- Real-time updates reflected in <1 second
- 99.9% uptime for team/person data access

## Next Steps

1. **Stakeholder Review**: Validate data model and feature priorities
2. **Prototype Wireframes**: Design key screens (Teams landing, Team detail, Person detail)
3. **Mock Data Generation**: Build realistic test data for 50+ people, 10+ teams, 30+ devices
4. **Begin Phase 0**: Implement TypeScript types and data access layer
5. **Define Permission Matrix**: Document all roles and their permission sets
6. **Hardware Requirements**: Spec out actual device hardware for pilot rollout

---

*Document created: October 5, 2025*  
*Status: Planning - Ready for Review*  
*Next Review: After stakeholder validation*
