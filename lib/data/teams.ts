// Teams & People Management System - Data Models and Mock Data

export type PersonStatus = "Active" | "Inactive" | "On Leave" | "Terminated"
export type DeviceType = "Mobile Phone" | "Tablet" | "Handheld Scanner" | "Wearable" | "Workstation"
export type DeviceStatus = "Active" | "Inactive" | "Maintenance" | "Lost" | "Retired"
export type BatteryStatus = "Charging" | "Discharging" | "Full" | "Low" | "Critical" | "Unknown"
export type ConnectivityStatus = "Online" | "Offline" | "Poor Signal"
export type TeamStatus = "Active" | "Inactive" | "Archived"

export type PerformanceMetrics = {
  overallEfficiency: number
  tasksCompletedOnTime: number
  tasksCompletedLate: number
  averageTaskCompletionTime: number
  qcPassRate: number
  itemsScanned: number
  itemsCompleted: number
  defectRate: number
  itemsPerHour: number
  tasksPerDay: number
  shiftsWorked: number
  hoursWorked: number
  efficiencyTrend: number[]
  volumeTrend: number[]
  teamRank?: number
  globalRank?: number
  lastCalculatedAt: string
}

export type TaskStats = {
  total: number
  completed: number
  inProgress: number
  overdue: number
  averageCompletionTime: number
  completionRate: number
  completedLast7Days: number
  completedLast30Days: number
}

export type ItemStats = {
  itemsScanned: number
  itemsCompleted: number
  componentsScanned: number
  componentsCompleted: number
  scansLast7Days: number
  scansLast30Days: number
}

export type Permission = {
  resource: string
  action: string
  scope: "all" | "team" | "assigned"
}

export type Person = {
  id: string
  email: string
  name: string
  avatar?: string
  phoneNumber?: string
  role: string
  department: string
  teamIds: string[]
  primaryTeamId?: string
  status: PersonStatus
  currentShift?: "Day" | "Night" | "Swing" | "Off"
  performanceMetrics: PerformanceMetrics
  taskStats: TaskStats
  itemStats: ItemStats
  assignedDevices: string[]
  permissions: Permission[]
  tags: string[]
  createdAt: string
  lastActivityAt?: string
}

export type TeamPerformanceMetrics = {
  overallEfficiency: number
  memberCount: number
  activeMembers: number
  tasksCompleted: number
  tasksInProgress: number
  tasksOverdue: number
  taskCompletionRate: number
  averageTaskTime: number
  itemsCompleted: number
  itemsInProgress: number
  itemsScanned: number
  itemsPerHour: number
  qcPassRate: number
  defectRate: number
  reworkRate: number
  aheadOfSchedule: number
  behindSchedule: number
  onSchedule: number
  efficiencyTrend: number[]
  volumeTrend: number[]
  qualityTrend: number[]
  departmentRank?: number
  globalRank?: number
  lastCalculatedAt: string
}

export type Team = {
  id: string
  name: string
  description?: string
  department: string
  location: string
  status: TeamStatus
  memberIds: string[]
  leadIds: string[]
  capacity: number
  capabilities: string[]
  performanceMetrics: TeamPerformanceMetrics
  utilizationRate: number
  assignedDevices: string[]
  color?: string
  icon?: string
  createdAt: string
  lastActiveAt?: string
}

export type DeviceAlert = {
  id: string
  type: "Low Battery" | "Offline" | "Maintenance Due" | "Lost Connection" | "Security"
  severity: "Critical" | "Warning" | "Info"
  message: string
  timestamp: string
  acknowledged: boolean
}

export type Device = {
  id: string
  name: string
  type: DeviceType
  manufacturer?: string
  model?: string
  serialNumber?: string
  assignedToPersonId?: string
  assignedToTeamId?: string
  status: DeviceStatus
  batteryLevel?: number
  batteryStatus: BatteryStatus
  connectivity: ConnectivityStatus
  lastPingAt?: string
  assignedLocation?: string
  usageStats: {
    totalScans: number
    scansToday: number
    averageScansPerDay: number
    uptime: number
    lastUsedAt?: string
  }
  alerts: DeviceAlert[]
  createdAt: string
}

// Mock Data Generation
export function generateMockPeople(): Person[] {
  const names = [
    "Sarah Chen", "Marcus Johnson", "Elena Rodriguez", "James Wilson", 
    "Priya Patel", "David Kim", "Maria Garcia", "Alex Thompson",
    "Lisa Anderson", "Michael Brown", "Jennifer Lee", "Robert Martinez",
    "Amanda White", "Chris Taylor", "Nicole Davis", "Daniel Moore"
  ]
  
  const roles = ["Floor Supervisor", "Production Worker", "QA Inspector", "Team Lead", "Operator"]
  const departments = ["Production", "Quality Control", "Assembly", "Finishing", "Shipping"]
  const shifts = ["Day", "Night", "Swing", "Off"] as const

  return names.map((name, idx) => ({
    id: `person-${idx + 1}`,
    email: name.toLowerCase().replace(" ", ".") + "@factory.com",
    name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    phoneNumber: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    role: roles[Math.floor(Math.random() * roles.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    teamIds: [`team-${Math.floor(idx / 4) + 1}`],
    primaryTeamId: `team-${Math.floor(idx / 4) + 1}`,
    status: "Active" as PersonStatus,
    currentShift: shifts[idx % 4],
    performanceMetrics: {
      overallEfficiency: 75 + Math.random() * 20,
      tasksCompletedOnTime: 40 + Math.floor(Math.random() * 30),
      tasksCompletedLate: Math.floor(Math.random() * 5),
      averageTaskCompletionTime: 30 + Math.random() * 40,
      qcPassRate: 88 + Math.random() * 10,
      itemsScanned: 150 + Math.floor(Math.random() * 200),
      itemsCompleted: 120 + Math.floor(Math.random() * 150),
      defectRate: Math.random() * 3,
      itemsPerHour: 8 + Math.random() * 6,
      tasksPerDay: 12 + Math.random() * 8,
      shiftsWorked: 20 + Math.floor(Math.random() * 5),
      hoursWorked: 160 + Math.floor(Math.random() * 40),
      efficiencyTrend: Array.from({ length: 30 }, () => 70 + Math.random() * 25),
      volumeTrend: Array.from({ length: 30 }, () => 100 + Math.random() * 100),
      teamRank: (idx % 4) + 1,
      globalRank: idx + 1,
      lastCalculatedAt: new Date().toISOString()
    },
    taskStats: {
      total: 50 + Math.floor(Math.random() * 30),
      completed: 40 + Math.floor(Math.random() * 25),
      inProgress: Math.floor(Math.random() * 5),
      overdue: Math.floor(Math.random() * 3),
      averageCompletionTime: 30 + Math.random() * 40,
      completionRate: 85 + Math.random() * 12,
      completedLast7Days: 8 + Math.floor(Math.random() * 5),
      completedLast30Days: 35 + Math.floor(Math.random() * 15)
    },
    itemStats: {
      itemsScanned: 150 + Math.floor(Math.random() * 200),
      itemsCompleted: 120 + Math.floor(Math.random() * 150),
      componentsScanned: 80 + Math.floor(Math.random() * 100),
      componentsCompleted: 65 + Math.floor(Math.random() * 80),
      scansLast7Days: 35 + Math.floor(Math.random() * 20),
      scansLast30Days: 145 + Math.floor(Math.random() * 80)
    },
    assignedDevices: [`device-${idx + 1}`],
    permissions: [
      { resource: "items", action: "scan", scope: "assigned" },
      { resource: "tasks", action: "view", scope: "assigned" }
    ],
    tags: [],
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString()
  }))
}

export function generateMockTeams(): Team[] {
  const teamData = [
    { name: "Alpha Sewing Line", dept: "Production", loc: "Floor A", color: "#3b82f6", icon: "🔵" },
    { name: "Beta Assembly", dept: "Assembly", loc: "Floor B", color: "#8b5cf6", icon: "🟣" },
    { name: "Quality Assurance", dept: "Quality Control", loc: "Floor C", color: "#10b981", icon: "🟢" },
    { name: "Finishing Team", dept: "Finishing", loc: "Floor D", color: "#f59e0b", icon: "🟠" },
    { name: "Shipping & Logistics", dept: "Shipping", loc: "Dock A", color: "#ef4444", icon: "🔴" }
  ]

  return teamData.map((data, idx) => ({
    id: `team-${idx + 1}`,
    name: data.name,
    description: `Specialized team for ${data.dept.toLowerCase()} operations`,
    department: data.dept,
    location: data.loc,
    status: "Active" as TeamStatus,
    memberIds: Array.from({ length: 3 }, (_, i) => `person-${idx * 3 + i + 1}`),
    leadIds: [`person-${idx * 3 + 1}`],
    capacity: 4,
    capabilities: ["Manufacturing", "Quality Control", "Process Optimization"],
    performanceMetrics: {
      overallEfficiency: 80 + Math.random() * 15,
      memberCount: 3,
      activeMembers: 3,
      tasksCompleted: 120 + Math.floor(Math.random() * 50),
      tasksInProgress: 8 + Math.floor(Math.random() * 5),
      tasksOverdue: Math.floor(Math.random() * 3),
      taskCompletionRate: 90 + Math.random() * 8,
      averageTaskTime: 35 + Math.random() * 25,
      itemsCompleted: 350 + Math.floor(Math.random() * 200),
      itemsInProgress: 45 + Math.floor(Math.random() * 30),
      itemsScanned: 450 + Math.floor(Math.random() * 250),
      itemsPerHour: 25 + Math.random() * 15,
      qcPassRate: 92 + Math.random() * 6,
      defectRate: Math.random() * 2.5,
      reworkRate: Math.random() * 3,
      aheadOfSchedule: 15 + Math.floor(Math.random() * 10),
      behindSchedule: Math.floor(Math.random() * 5),
      onSchedule: 25 + Math.floor(Math.random() * 15),
      efficiencyTrend: Array.from({ length: 30 }, () => 75 + Math.random() * 20),
      volumeTrend: Array.from({ length: 30 }, () => 300 + Math.random() * 150),
      qualityTrend: Array.from({ length: 30 }, () => 90 + Math.random() * 8),
      departmentRank: idx + 1,
      globalRank: idx + 1,
      lastCalculatedAt: new Date().toISOString()
    },
    utilizationRate: 75 + Math.random() * 20,
    assignedDevices: Array.from({ length: 3 }, (_, i) => `device-${idx * 3 + i + 1}`),
    color: data.color,
    icon: data.icon,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    lastActiveAt: new Date(Date.now() - Math.random() * 1 * 60 * 60 * 1000).toISOString()
  }))
}

export function generateMockDevices(): Device[] {
  const deviceTypes: DeviceType[] = ["Tablet", "Handheld Scanner", "Mobile Phone"]
  const manufacturers = ["Zebra", "Honeywell", "Samsung", "Apple"]
  const batteryStatuses: BatteryStatus[] = ["Discharging", "Full", "Low", "Charging"]
  const connectivityStatuses: ConnectivityStatus[] = ["Online", "Online", "Online", "Offline", "Poor Signal"]

  return Array.from({ length: 16 }, (_, idx) => {
    const batteryLevel = Math.floor(Math.random() * 100)
    const isOnline = Math.random() > 0.15
    
    return {
      id: `device-${idx + 1}`,
      name: `Device-${String(idx + 1).padStart(3, '0')}`,
      type: deviceTypes[idx % deviceTypes.length],
      manufacturer: manufacturers[idx % manufacturers.length],
      model: `Model-${String.fromCharCode(65 + (idx % 3))}${idx + 100}`,
      serialNumber: `SN${String(10000 + idx).slice(1)}`,
      assignedToPersonId: `person-${idx + 1}`,
      status: isOnline ? "Active" : (Math.random() > 0.5 ? "Inactive" : "Active"),
      batteryLevel,
      batteryStatus: batteryLevel > 80 ? "Full" : batteryLevel > 20 ? "Discharging" : batteryLevel > 10 ? "Low" : "Critical",
      connectivity: isOnline ? "Online" : (Math.random() > 0.5 ? "Offline" : "Poor Signal"),
      lastPingAt: new Date(Date.now() - Math.random() * 30 * 60 * 1000).toISOString(),
      assignedLocation: `Floor ${String.fromCharCode(65 + (idx % 4))}`,
      usageStats: {
        totalScans: 1000 + Math.floor(Math.random() * 5000),
        scansToday: 20 + Math.floor(Math.random() * 80),
        averageScansPerDay: 150 + Math.floor(Math.random() * 100),
        uptime: 85 + Math.random() * 13,
        lastUsedAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString()
      },
      alerts: batteryLevel < 20 ? [{
        id: `alert-${idx}`,
        type: "Low Battery",
        severity: "Warning",
        message: `Device ${idx + 1} battery is below 20%`,
        timestamp: new Date().toISOString(),
        acknowledged: false
      }] : [],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }
  })
}

// Data access functions
export function getAllPeople(): Person[] {
  const cached = typeof window !== 'undefined' ? localStorage.getItem('groovy:people:v1') : null
  if (cached) {
    return JSON.parse(cached)
  }
  const people = generateMockPeople()
  if (typeof window !== 'undefined') {
    localStorage.setItem('groovy:people:v1', JSON.stringify(people))
  }
  return people
}

export function getAllTeams(): Team[] {
  const cached = typeof window !== 'undefined' ? localStorage.getItem('groovy:teams:v1') : null
  if (cached) {
    return JSON.parse(cached)
  }
  const teams = generateMockTeams()
  if (typeof window !== 'undefined') {
    localStorage.setItem('groovy:teams:v1', JSON.stringify(teams))
  }
  return teams
}

export function getAllDevices(): Device[] {
  const cached = typeof window !== 'undefined' ? localStorage.getItem('groovy:devices:v1') : null
  if (cached) {
    return JSON.parse(cached)
  }
  const devices = generateMockDevices()
  if (typeof window !== 'undefined') {
    localStorage.setItem('groovy:devices:v1', JSON.stringify(devices))
  }
  return devices
}

export function getPersonById(id: string): Person | undefined {
  return getAllPeople().find(p => p.id === id)
}

export function getTeamById(id: string): Team | undefined {
  return getAllTeams().find(t => t.id === id)
}

export function getDeviceById(id: string): Device | undefined {
  return getAllDevices().find(d => d.id === id)
}

export function getPeopleByTeamId(teamId: string): Person[] {
  return getAllPeople().filter(p => p.teamIds.includes(teamId))
}

export function getDevicesByTeamId(teamId: string): Device[] {
  return getAllDevices().filter(d => d.assignedToTeamId === teamId)
}

export function getTopPerformers(limit: number = 5): Person[] {
  return getAllPeople()
    .sort((a, b) => b.performanceMetrics.overallEfficiency - a.performanceMetrics.overallEfficiency)
    .slice(0, limit)
}

export function getTopPerformingTeams(limit: number = 3): Team[] {
  return getAllTeams()
    .sort((a, b) => b.performanceMetrics.overallEfficiency - a.performanceMetrics.overallEfficiency)
    .slice(0, limit)
}

export function getDeviceAlerts(): DeviceAlert[] {
  return getAllDevices()
    .flatMap(d => d.alerts)
    .filter(alert => !alert.acknowledged)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

