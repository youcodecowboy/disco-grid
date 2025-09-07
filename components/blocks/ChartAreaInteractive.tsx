"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const chartData = [
  { date: "Jan 01", production: 245, efficiency: 87, quality: 94, delivery: 91 },
  { date: "Jan 02", production: 267, efficiency: 89, quality: 96, delivery: 93 },
  { date: "Jan 03", production: 238, efficiency: 85, quality: 92, delivery: 88 },
  { date: "Jan 04", production: 275, efficiency: 92, quality: 98, delivery: 96 },
  { date: "Jan 05", production: 289, efficiency: 94, quality: 99, delivery: 98 },
  { date: "Jan 06", production: 256, efficiency: 91, quality: 96, delivery: 94 },
  { date: "Jan 07", production: 242, efficiency: 88, quality: 95, delivery: 91 },
  { date: "Jan 08", production: 309, efficiency: 96, quality: 99, delivery: 97 },
  { date: "Jan 09", production: 259, efficiency: 90, quality: 93, delivery: 89 },
  { date: "Jan 10", production: 261, efficiency: 91, quality: 95, delivery: 92 },
  { date: "Jan 11", production: 327, efficiency: 95, quality: 98, delivery: 96 },
  { date: "Jan 12", production: 292, efficiency: 93, quality: 97, delivery: 94 },
  { date: "Jan 13", production: 342, efficiency: 97, quality: 99, delivery: 98 },
  { date: "Jan 14", production: 237, efficiency: 87, quality: 92, delivery: 89 },
  { date: "Jan 15", production: 220, efficiency: 85, quality: 90, delivery: 87 },
  { date: "Jan 16", production: 238, efficiency: 88, quality: 93, delivery: 90 },
  { date: "Jan 17", production: 346, efficiency: 98, quality: 99, delivery: 99 },
  { date: "Jan 18", production: 364, efficiency: 96, quality: 98, delivery: 97 },
  { date: "Jan 19", production: 243, efficiency: 89, quality: 94, delivery: 91 },
  { date: "Jan 20", production: 189, efficiency: 82, quality: 88, delivery: 85 },
  { date: "Jan 21", production: 237, efficiency: 87, quality: 92, delivery: 89 },
  { date: "Jan 22", production: 224, efficiency: 86, quality: 91, delivery: 88 },
  { date: "Jan 23", production: 238, efficiency: 88, quality: 93, delivery: 90 },
  { date: "Jan 24", production: 387, efficiency: 97, quality: 99, delivery: 98 },
  { date: "Jan 25", production: 215, efficiency: 84, quality: 89, delivery: 86 },
  { date: "Jan 26", production: 175, efficiency: 80, quality: 85, delivery: 82 },
  { date: "Jan 27", production: 383, efficiency: 96, quality: 98, delivery: 97 },
  { date: "Jan 28", production: 222, efficiency: 86, quality: 91, delivery: 88 },
  { date: "Jan 29", production: 315, efficiency: 94, quality: 97, delivery: 95 },
  { date: "Jan 30", production: 354, efficiency: 95, quality: 98, delivery: 96 },
]

interface ChartAreaInteractiveProps {
  block?: any
}

export function ChartAreaInteractive({ block }: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState("30d")

  const filteredData = chartData.filter((item, index) => {
    if (timeRange === "7d") {
      return index >= chartData.length - 7
    } else if (timeRange === "14d") {
      return index >= chartData.length - 14
    }
    return true // 30d - show all data
  })

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 space-y-0 border-b py-3 px-4">
        <div className="grid flex-1 gap-1">
          <h3 className="font-semibold text-sm">Manufacturing Analytics</h3>
          <p className="text-xs text-muted-foreground">
            Production metrics and performance indicators
          </p>
        </div>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="w-[120px] h-8 text-xs border rounded-md px-2 bg-background"
        >
          <option value="30d">Last 30 days</option>
          <option value="14d">Last 14 days</option>
          <option value="7d">Last 7 days</option>
        </select>
      </div>
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorDelivery" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="production" 
              stackId="1"
              stroke="#3b82f6" 
              fill="url(#colorProduction)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="efficiency" 
              stackId="2"
              stroke="#10b981" 
              fill="url(#colorEfficiency)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="quality" 
              stackId="3"
              stroke="#8b5cf6" 
              fill="url(#colorQuality)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="delivery" 
              stackId="4"
              stroke="#f59e0b" 
              fill="url(#colorDelivery)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
