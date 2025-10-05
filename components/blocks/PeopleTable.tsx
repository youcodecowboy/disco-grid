"use client"

import { Person } from "@/lib/data/teams"
import { User, Mail, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type PeopleTableProps = {
  people: Person[]
  showActions?: boolean
}

export default function PeopleTable({ people = [], showActions = true }: PeopleTableProps) {
  const safePeople = Array.isArray(people) ? people : []

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">All People</h3>
          <p className="text-xs text-slate-600 mt-0.5">{safePeople.length} people • Click to view profile</p>
        </div>
        {showActions && (
          <Button size="sm" className="gap-2">
            <User className="w-4 h-4" />
            Add Person
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Department
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
            {safePeople.map((person) => (
              <tr
                key={person.id}
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => console.log("Navigate to person:", person.id)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 ring-2 ring-white">
                      {person.avatar ? (
                        <Image
                          src={person.avatar}
                          alt={person.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {person.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{person.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-900">{person.role}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{person.department}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-2 w-16">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                        style={{ width: `${person.performanceMetrics.overallEfficiency}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 min-w-[3rem] text-right">
                      {person.performanceMetrics.overallEfficiency.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <span className="font-semibold text-slate-900">
                      {person.taskStats.completed}
                    </span>
                    <span className="text-slate-600"> / {person.taskStats.total}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        person.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : person.status === "On Leave"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {person.status}
                    </span>
                    {person.currentShift && person.currentShift !== "Off" && (
                      <span className="text-xs text-slate-600">• {person.currentShift}</span>
                    )}
                  </div>
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
                          console.log("Edit person:", person.id)
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
                          console.log("Remove person:", person.id)
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

        {safePeople.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <User className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-sm font-semibold text-slate-900 mb-1">No people yet</h3>
            <p className="text-xs text-slate-600 mb-4">Add your first team member to get started</p>
            <Button size="sm">Add Person</Button>
          </div>
        )}
      </div>
    </div>
  )
}

