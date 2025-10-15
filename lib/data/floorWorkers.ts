/**
 * Floor Workers Mock Data
 * 
 * Worker profiles with performance metrics for the Floor input application
 */

export type WorkerMetrics = {
  tasksCompleted: number
  itemsScanned: number
  hoursWorked: number
  qualityScore: number      // 0-100
  efficiencyRating: number   // 0-100
}

export type FloorWorker = {
  id: string
  name: string
  role: string
  team: string
  avatar: string              // Initials
  todayMetrics: WorkerMetrics
  weekMetrics: WorkerMetrics
  monthMetrics: WorkerMetrics
  shiftStart: string          // ISO timestamp
  currentLocation: string
}

export const MOCK_FLOOR_WORKERS: FloorWorker[] = [
  {
    id: "worker-001",
    name: "Maria Rodriguez",
    role: "Floor Supervisor",
    team: "Production Ops",
    avatar: "MR",
    shiftStart: new Date().toISOString().split('T')[0] + 'T08:00:00Z',
    currentLocation: "Factory A - Sewing Line A",
    todayMetrics: {
      tasksCompleted: 12,
      itemsScanned: 34,
      hoursWorked: 6.5,
      qualityScore: 98,
      efficiencyRating: 95
    },
    weekMetrics: {
      tasksCompleted: 58,
      itemsScanned: 156,
      hoursWorked: 38,
      qualityScore: 96,
      efficiencyRating: 94
    },
    monthMetrics: {
      tasksCompleted: 245,
      itemsScanned: 687,
      hoursWorked: 160,
      qualityScore: 97,
      efficiencyRating: 95
    }
  },
  {
    id: "worker-002",
    name: "James Chen",
    role: "QC Inspector",
    team: "Quality Control",
    avatar: "JC",
    shiftStart: new Date().toISOString().split('T')[0] + 'T07:00:00Z',
    currentLocation: "Factory A - QC Station",
    todayMetrics: {
      tasksCompleted: 8,
      itemsScanned: 45,
      hoursWorked: 7.5,
      qualityScore: 99,
      efficiencyRating: 92
    },
    weekMetrics: {
      tasksCompleted: 42,
      itemsScanned: 234,
      hoursWorked: 40,
      qualityScore: 98,
      efficiencyRating: 93
    },
    monthMetrics: {
      tasksCompleted: 189,
      itemsScanned: 1023,
      hoursWorked: 168,
      qualityScore: 99,
      efficiencyRating: 94
    }
  },
  {
    id: "worker-003",
    name: "Alex Kim",
    role: "Production Operator",
    team: "Production Ops",
    avatar: "AK",
    shiftStart: new Date().toISOString().split('T')[0] + 'T09:00:00Z',
    currentLocation: "Factory A - Cutting",
    todayMetrics: {
      tasksCompleted: 6,
      itemsScanned: 18,
      hoursWorked: 5.5,
      qualityScore: 94,
      efficiencyRating: 88
    },
    weekMetrics: {
      tasksCompleted: 34,
      itemsScanned: 98,
      hoursWorked: 32,
      qualityScore: 93,
      efficiencyRating: 89
    },
    monthMetrics: {
      tasksCompleted: 156,
      itemsScanned: 445,
      hoursWorked: 152,
      qualityScore: 94,
      efficiencyRating: 90
    }
  }
]

// For demo purposes, we'll use the first worker as the current user
export const CURRENT_FLOOR_WORKER = MOCK_FLOOR_WORKERS[0]

export function getFloorWorkerById(id: string): FloorWorker | undefined {
  return MOCK_FLOOR_WORKERS.find(w => w.id === id)
}

export function calculateShiftDuration(shiftStart: string): {
  hours: number
  minutes: number
  seconds: number
  totalHours: number
} {
  const start = new Date(shiftStart)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  const totalSeconds = Math.floor(diffMs / 1000)
  
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const totalHours = Number((diffMs / (1000 * 60 * 60)).toFixed(1))
  
  return {
    hours,
    minutes,
    seconds,
    totalHours
  }
}

