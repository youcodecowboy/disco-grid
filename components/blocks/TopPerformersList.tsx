"use client"

import { Person } from "@/lib/data/teams"
import { Award, TrendingUp, Package, CheckCircle } from "lucide-react"
import Image from "next/image"

type TopPerformersListProps = {
  people: Person[]
  limit?: number
}

export default function TopPerformersList({ people, limit = 8 }: TopPerformersListProps) {
  // Ensure people is an array before sorting
  const safePeople = Array.isArray(people) ? people : []
  const topPeople = safePeople
    .sort((a, b) => b.performanceMetrics.overallEfficiency - a.performanceMetrics.overallEfficiency)
    .slice(0, limit)

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          Top Performers
        </h3>
        <p className="text-xs text-slate-600 mt-1">Individual excellence this month</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto">
        <div className="divide-y divide-slate-100">
          {topPeople.map((person, idx) => {
            const efficiency = person.performanceMetrics.overallEfficiency

            return (
              <div
                key={person.id}
                className="group flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-6 text-center">
                  <span className="text-sm font-bold text-slate-400">#{idx + 1}</span>
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0 relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 ring-2 ring-white">
                    {person.avatar && (
                      <Image
                        src={person.avatar}
                        alt={person.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {idx < 3 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] ring-2 ring-white">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">{person.name}</h4>
                  <p className="text-xs text-slate-600">{person.role}</p>
                </div>

                {/* Stats */}
                <div className="flex-shrink-0 flex items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    <span>{person.itemStats.itemsCompleted}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{person.taskStats.completed}</span>
                  </div>
                </div>

                {/* Efficiency */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-slate-900">{efficiency.toFixed(0)}%</div>
                  <div className="flex items-center justify-end gap-1 text-xs text-emerald-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>High</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
