"use client"

import React from 'react'
import { Workflow, TrendingUp, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface WorkflowData {
  name: string
  itemCount: number
  activeItems: number
  completedToday: number
  color: 'blue' | 'purple' | 'green' | 'orange'
}

interface WorkflowOverviewProps {
  workflows?: WorkflowData[]
  title?: string
}

export default function WorkflowOverview({ workflows = [], title }: WorkflowOverviewProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      progress: 'bg-blue-500'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      progress: 'bg-purple-500'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      progress: 'bg-green-500'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      progress: 'bg-orange-500'
    }
  }

  const totalItems = workflows.reduce((sum, w) => sum + w.itemCount, 0)

  return (
    <div className="h-full flex flex-col p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{totalItems} items across {workflows.length} workflows</p>
        </div>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Workflow className="h-4 w-4" />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-auto">
        {workflows.map((workflow, index) => {
          const colors = colorClasses[workflow.color]
          const activePercentage = (workflow.activeItems / workflow.itemCount) * 100

          return (
            <div 
              key={index} 
              className={`${colors.bg} ${colors.border} border rounded-xl p-4 hover:shadow-sm transition-shadow`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    {workflow.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">{workflow.itemCount}</span> total items
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-medium">{workflow.activeItems}</span> active
                    </span>
                  </div>
                </div>
                
                <Badge variant="outline" className={`${colors.text} text-xs`}>
                  {workflow.activeItems} / {workflow.itemCount}
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-600">Active progress</span>
                  <span className="text-xs font-medium text-slate-900">{activePercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                  <div 
                    className={`${colors.progress} h-full rounded-full transition-all`}
                    style={{ width: `${activePercentage}%` }}
                  />
                </div>
              </div>

              {/* Completed today */}
              <div className={`flex items-center gap-2 ${colors.text} text-xs font-medium`}>
                <CheckCircle className="h-3.5 w-3.5" />
                <span>{workflow.completedToday} completed today</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


