"use client"

import { Team } from "@/lib/data/teams"
import { TrendingUp, TrendingDown, Users, CheckCircle2 } from "lucide-react"

type TeamPerformanceLeaderboardProps = {
  teams: Team[]
  limit?: number
}

export default function TeamPerformanceLeaderboard({ teams, limit = 5 }: TeamPerformanceLeaderboardProps) {
  // Ensure teams is an array before sorting
  const safeTeams = Array.isArray(teams) ? teams : []
  const topTeams = safeTeams
    .sort((a, b) => b.performanceMetrics.overallEfficiency - a.performanceMetrics.overallEfficiency)
    .slice(0, limit)

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-sm font-semibold text-slate-900">Top Performing Teams</h3>
        <p className="text-xs text-slate-600 mt-1">Ranked by overall efficiency</p>
      </div>

      {/* Leaderboard */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {topTeams.map((team, idx) => {
            const efficiency = team.performanceMetrics.overallEfficiency
            const trend = team.performanceMetrics.efficiencyTrend
            const isImproving = trend[trend.length - 1] > trend[trend.length - 7]
            const rankColors = ["bg-yellow-100 text-yellow-700", "bg-slate-100 text-slate-700", "bg-orange-100 text-orange-700"]
            const rankColor = idx < 3 ? rankColors[idx] : "bg-slate-50 text-slate-600"

            return (
              <div
                key={team.id}
                className="group flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
              >
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${rankColor} flex items-center justify-center font-bold text-lg`}>
                  {idx + 1}
                </div>

                {/* Team Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{team.icon}</span>
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{team.name}</h4>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {team.performanceMetrics.memberCount} members
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {team.performanceMetrics.tasksCompleted} tasks
                    </span>
                  </div>
                </div>

                {/* Efficiency Score */}
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {efficiency.toFixed(0)}%
                    </span>
                    {isImproving ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">efficiency</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
