// Standardized block component interfaces

export interface BlockProps {
  title?: string
  data: any
  className?: string
  hideTitle?: boolean // When true, component should not render its own header
  [key: string]: any // Allow additional props
}

export interface MetricData {
  value: string
  delta: string
  trend: number[]
  timeRange?: string
}

export interface TableData {
  columns: string[] | Column[]
  rows?: any[][]
  data?: any[]
}

export interface Column {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'status' | 'select'
  options?: string[]
  width?: number
  required?: boolean
}

export interface ActivityData {
  activities: {
    id?: number
    time: string
    user: string
    action: string
    status?: string
    type?: string
  }[]
}

export interface CalendarData {
  events: {
    date: string
    title: string
    type: string
  }[]
}

export interface ChartData {
  labels?: string[]
  datasets?: any[]
  data?: any
  [key: string]: any
}
