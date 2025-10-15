"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Users, X } from "lucide-react"
import type { PlayAssignment } from "@/lib/playbooks/types"
import { MOCK_USERS, MOCK_ROLES } from "@/lib/playbooks/mockData"
import { MOCK_TEAMS } from "@/lib/tasks-v2/mockData"

interface AssignmentPickerProps {
  value: PlayAssignment
  onChange: (assignment: PlayAssignment) => void
}

export function AssignmentPicker({ value, onChange }: AssignmentPickerProps) {
  const [mode, setMode] = useState<"specific_people" | "role_team">(value.type)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const handleModeChange = (newMode: "specific_people" | "role_team") => {
    setMode(newMode)
    
    if (newMode === "specific_people") {
      onChange({
        type: "specific_people",
        userIds: [],
      })
    } else {
      onChange({
        type: "role_team",
        mode: "team",
      })
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-700">Assign To</label>

      {/* Mode Toggle */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => handleModeChange("specific_people")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "specific_people"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <User className="h-4 w-4" />
          Specific People
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("role_team")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "role_team"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="h-4 w-4" />
          Role / Team
        </button>
      </div>

      {/* Specific People Mode */}
      {mode === "specific_people" && value.type === "specific_people" && (
        <SpecificPeopleAssignment
          assignment={value}
          onChange={onChange}
          showDropdown={showUserDropdown}
          setShowDropdown={setShowUserDropdown}
        />
      )}

      {/* Role/Team Mode */}
      {mode === "role_team" && value.type === "role_team" && (
        <RoleTeamAssignment assignment={value} onChange={onChange} />
      )}
    </div>
  )
}

function SpecificPeopleAssignment({
  assignment,
  onChange,
  showDropdown,
  setShowDropdown,
}: {
  assignment: Extract<PlayAssignment, { type: "specific_people" }>
  onChange: (assignment: PlayAssignment) => void
  showDropdown: boolean
  setShowDropdown: (show: boolean) => void
}) {
  const selectedUsers = MOCK_USERS.filter((u) => assignment.userIds.includes(u.id))
  const availableUsers = MOCK_USERS.filter((u) => !assignment.userIds.includes(u.id))

  const handleAddUser = (userId: string) => {
    onChange({
      ...assignment,
      userIds: [...assignment.userIds, userId],
    })
  }

  const handleRemoveUser = (userId: string) => {
    onChange({
      ...assignment,
      userIds: assignment.userIds.filter((id) => id !== userId),
    })
  }

  return (
    <div className="space-y-2">
      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <Badge
              key={user.id}
              className="rounded-full bg-slate-100 text-slate-700 pl-1 pr-2 py-1 text-sm font-medium hover:bg-slate-200 cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="h-5 w-5 rounded-full mr-1.5"
              />
              {user.name}
              <button
                type="button"
                onClick={() => handleRemoveUser(user.id)}
                className="ml-1 hover:text-slate-900"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add User Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 py-1"
        >
          <User className="h-4 w-4" />
          Add person
        </button>

        {showDropdown && availableUsers.length > 0 && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute top-full left-0 mt-1 w-64 rounded-lg border border-slate-200 bg-white shadow-lg p-2 z-20">
              <div className="space-y-1">
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      handleAddUser(user.id)
                      setShowDropdown(false)
                    }}
                    className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-50"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {selectedUsers.length === 0 && (
        <p className="text-xs text-slate-500">No people assigned yet</p>
      )}
    </div>
  )
}

function RoleTeamAssignment({
  assignment,
  onChange,
}: {
  assignment: Extract<PlayAssignment, { type: "role_team" }>
  onChange: (assignment: PlayAssignment) => void
}) {
  return (
    <div className="space-y-3">
      {/* Role vs Team Toggle */}
      <Select
        value={assignment.mode}
        onValueChange={(val) =>
          onChange({
            ...assignment,
            mode: val as "team" | "role",
            teamId: undefined,
            teamName: undefined,
            roleId: undefined,
            roleName: undefined,
          })
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="team">Assign to team</SelectItem>
          <SelectItem value="role">Assign to role</SelectItem>
        </SelectContent>
      </Select>

      {/* Team Selector */}
      {assignment.mode === "team" && (
        <Select
          value={assignment.teamId || ""}
          onValueChange={(val) => {
            const team = MOCK_TEAMS.find((t) => t.id === val)
            onChange({
              ...assignment,
              teamId: val,
              teamName: team?.name,
            })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a team..." />
          </SelectTrigger>
          <SelectContent>
            {MOCK_TEAMS.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: team.color }}
                  />
                  {team.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Role Selector */}
      {assignment.mode === "role" && (
        <Select
          value={assignment.roleId || ""}
          onValueChange={(val) => {
            const role = MOCK_ROLES.find((r) => r.id === val)
            onChange({
              ...assignment,
              roleId: val,
              roleName: role?.name,
            })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role..." />
          </SelectTrigger>
          <SelectContent>
            {MOCK_ROLES.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Display selected assignment */}
      {assignment.mode === "team" && assignment.teamName && (
        <div className="rounded-lg border border-sky-200 bg-sky-50/50 p-3">
          <div className="flex items-center gap-2 text-sm text-sky-700">
            <Users className="h-4 w-4" />
            <span>Will be assigned to <strong>{assignment.teamName}</strong> team</span>
          </div>
        </div>
      )}

      {assignment.mode === "role" && assignment.roleName && (
        <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3">
          <div className="flex items-center gap-2 text-sm text-purple-700">
            <User className="h-4 w-4" />
            <span>Will be assigned to anyone with <strong>{assignment.roleName}</strong> role</span>
          </div>
        </div>
      )}
    </div>
  )
}

