"use client"

import { Team, Person } from "@/lib/data/teams"
import { Users, MapPin, Edit, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

type TeamsTableProps = {
  teams: Team[]
  people: Person[]
  showActions?: boolean
}

export default function TeamsTable({ teams = [], people = [], showActions = true }: TeamsTableProps) {
  const safeTeams = Array.isArray(teams) ? teams : []

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">All Teams</h3>
          <p className="text-xs text-slate-600 mt-0.5">{safeTeams.length} teams • Click to view details</p>
        </div>
        {showActions && (
          <Button size="sm" className="gap-2">
            <Users className="w-4 h-4" />
            Create Team
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Members
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Efficiency
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Tasks
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              {showActions && (
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {safeTeams.map((team) => (
              <tr
                key={team.id}
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => console.log("Navigate to team:", team.id)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: team.color + '20' }}
                    >
                      {team.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {team.name}
                      </div>
                      <div className="text-xs text-slate-600 truncate">{team.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-900">{team.department}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {team.location}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">
                      {team.performanceMetrics.memberCount}
                    </span>
                    <span className="text-xs text-slate-600">
                      / {team.capacity}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-2 w-20">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                        style={{ width: `${team.performanceMetrics.overallEfficiency}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 min-w-[3rem] text-right">
                      {team.performanceMetrics.overallEfficiency.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <span className="font-semibold text-slate-900">
                      {team.performanceMetrics.tasksCompleted}
                    </span>
                    <span className="text-slate-600"> completed</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {team.performanceMetrics.tasksInProgress} in progress
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      team.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {team.status}
                  </span>
                </td>
                {showActions && (
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("Add member to team:", team.id)
                        }}
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("Edit team:", team.id)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("Delete team:", team.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {safeTeams.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-sm font-semibold text-slate-900 mb-1">No teams yet</h3>
            <p className="text-xs text-slate-600 mb-4">Get started by creating your first team</p>
            <Button size="sm">Create Team</Button>
          </div>
        )}
      </div>
    </div>
  )
}

