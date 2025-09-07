import React from 'react'

interface CapacityData {
  totalCapacity: number
  usedCapacity: number
  availableCapacity: number
  teams: Array<{
    name: string
    capacity: number
    used: number
    color: string
  }>
  overallUtilization: number
}

interface CapacityTrackerProps {
  title?: string
  data?: CapacityData
}

export default function CapacityTracker({ 
  title = "Capacity Tracker", 
  data 
}: CapacityTrackerProps) {
  const defaultData: CapacityData = {
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

  const capacityData = data || defaultData
  const utilizationPercentage = capacityData.overallUtilization

  return (
    <div className="h-full flex flex-col p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900 truncate flex-1 min-w-0 mr-2">
          {title}
        </h3>
        <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500 flex-shrink-0">
          {utilizationPercentage}% used
        </div>
      </div>

      {/* Overall Capacity Bar */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-600">
            Overall Capacity
          </span>
          <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium text-gray-900">
            {capacityData.usedCapacity}/{capacityData.totalCapacity}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${utilizationPercentage}%` }}
          />
        </div>
      </div>

      {/* Team Breakdown */}
      <div className="flex-1 space-y-2 sm:space-y-3">
        {capacityData.teams.map((team, index) => {
          const teamUtilization = (team.used / team.capacity) * 100
          return (
            <div key={index} className="flex items-center space-x-2 sm:space-x-3">
              {/* Team Color Indicator */}
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${team.color} flex-shrink-0`} />
              
              {/* Team Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-700 truncate">
                    {team.name}
                  </span>
                  <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500 flex-shrink-0">
                    {team.used}/{team.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1 sm:h-1.5">
                  <div 
                    className={`${team.color} h-full rounded-full transition-all duration-300`}
                    style={{ width: `${teamUtilization}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Capacity Status */}
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-600">
            Available
          </span>
          <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium text-green-600">
            {capacityData.availableCapacity} units
          </span>
        </div>
      </div>
    </div>
  )
}

