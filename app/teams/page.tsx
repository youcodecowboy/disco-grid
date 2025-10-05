"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import { getAllPeople, getAllTeams, getAllDevices, type Team, type Person, type Device } from "@/lib/data/teams"
import { Users, UserPlus, TrendingUp, Activity, Smartphone, MapPin, Mail, Edit, ChevronRight, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function TeamsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState<"teams" | "people" | "devices">("teams")
  const [people, setPeople] = useState<Person[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    setPeople(getAllPeople())
    setTeams(getAllTeams())
    setDevices(getAllDevices())
    setIsLoading(false)
  }, [])

  const totalTeams = teams.length
  const activePeople = people.filter(p => p.status === "Active").length
  const avgEfficiency = teams.length > 0
    ? teams.reduce((sum, t) => sum + (t.performanceMetrics?.overallEfficiency || 0), 0) / teams.length
    : 0
  const onlineDevices = devices.filter(d => d.connectivity === "Online").length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="sticky top-0 z-50 h-14 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
            </div>
            <div className="text-sm text-slate-600">Dashboard</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-1.5 text-sm border-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </Button>
            <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <div
          className="relative"
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          <Sidebar
            sidebarExpanded={sidebarExpanded}
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => setSidebarExpanded(false)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto max-w-[1800px] px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Teams & People</h1>
                <p className="mt-1 text-sm text-slate-600">
                  Manage teams, people, and device assignments
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Person
                </Button>
                <Button size="sm" className="gap-2">
                  <Users className="h-4 w-4" />
                  Create Team
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex items-center gap-1 border-b border-slate-200">
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTab === "teams"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setSelectedTab("teams")}
              >
                Teams
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTab === "people"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setSelectedTab("people")}
              >
                People
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTab === "devices"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setSelectedTab("devices")}
              >
                Devices
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-[1800px] px-8 py-8">
          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={<Users className="h-5 w-5" />}
              label="Total Teams"
              value={totalTeams.toString()}
              delta="+2 this month"
              color="blue"
            />
            <MetricCard
              icon={<Activity className="h-5 w-5" />}
              label="Active People"
              value={activePeople.toString()}
              delta={`${people.length} total`}
              color="emerald"
            />
            <MetricCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Avg Efficiency"
              value={`${avgEfficiency.toFixed(0)}%`}
              delta="+5% this week"
              color="violet"
            />
            <MetricCard
              icon={<Smartphone className="h-5 w-5" />}
              label="Devices Online"
              value={onlineDevices.toString()}
              delta={`${devices.length} total`}
              color="orange"
            />
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder={`Search ${selectedTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tab Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-sm text-slate-600">Loading data...</p>
              </div>
            </div>
          ) : (
            <>
              {selectedTab === "teams" && <TeamsView teams={teams} />}
              {selectedTab === "people" && <PeopleView people={people} />}
              {selectedTab === "devices" && <DevicesView devices={devices} people={people} />}
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

type MetricCardProps = {
  icon: React.ReactNode
  label: string
  value: string
  delta: string
  color: "blue" | "emerald" | "violet" | "orange"
}

function MetricCard({ icon, label, value, delta, color }: MetricCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    violet: "bg-violet-100 text-violet-600",
    orange: "bg-orange-100 text-orange-600"
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{delta}</p>
        </div>
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function TeamsView({ teams }: { teams: Team[] }) {
  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div
          key={team.id}
          className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md"
          onClick={() => console.log("Navigate to team:", team.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Team Icon */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
                style={{ backgroundColor: (team.color || '#3b82f6') + '20' }}
              >
                {team.icon || '👥'}
              </div>

              {/* Team Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {team.name || 'Unnamed Team'}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    team.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {team.status || 'Unknown'}
                  </span>
                </div>
                {team.description && (
                  <p className="mt-1 text-sm text-slate-600">{team.description}</p>
                )}
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {team.location || 'Unknown'}
                  </span>
                  <span>•</span>
                  <span>{team.department || 'Unknown'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {team.performanceMetrics?.memberCount || 0} / {team.capacity || 0} members
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {team.performanceMetrics?.overallEfficiency?.toFixed(0) || 0}%
                  </div>
                  <div className="text-xs text-slate-600">Efficiency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {team.performanceMetrics?.tasksCompleted || 0}
                  </div>
                  <div className="text-xs text-slate-600">Tasks Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {team.performanceMetrics?.itemsCompleted || 0}
                  </div>
                  <div className="text-xs text-slate-600">Items Done</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("Edit team")
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PeopleView({ people }: { people: Person[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {people.map((person) => (
        <div
          key={person.id}
          className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md"
          onClick={() => console.log("Navigate to person:", person.id)}
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-slate-200 ring-2 ring-white">
              {person.avatar ? (
                <Image
                  src={person.avatar}
                  alt={person.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Users className="h-6 w-6 text-slate-400" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {person.name}
                </h4>
                <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  person.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                }`}>
                  {person.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{person.role}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-slate-500 truncate">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{person.email}</span>
              </div>
              
              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {person.performanceMetrics.overallEfficiency.toFixed(0)}%
                  </div>
                  <div className="text-xs text-slate-600">Efficiency</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {person.taskStats.completed} / {person.taskStats.total}
                  </div>
                  <div className="text-xs text-slate-600">Tasks</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log("Edit person")
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DevicesView({ devices, people }: { devices: Device[]; people: Person[] }) {
  const getBatteryColor = (level: number | undefined) => {
    if (!level) return "text-slate-400"
    if (level < 20) return "text-red-600"
    if (level < 50) return "text-orange-600"
    return "text-emerald-600"
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {devices.map((device) => (
        <div
          key={device.id}
          className="rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-slate-400" />
                <h4 className="font-semibold text-slate-900">{device.name}</h4>
              </div>
              <p className="mt-1 text-sm text-slate-600">{device.type}</p>
              
              {/* Status */}
              <div className="mt-3 flex items-center gap-3">
                <div className={`flex items-center gap-1.5 text-xs ${
                  device.connectivity === "Online" ? "text-emerald-600" : "text-slate-400"
                }`}>
                  <div className={`h-2 w-2 rounded-full ${
                    device.connectivity === "Online" ? "bg-emerald-600" : "bg-slate-400"
                  }`} />
                  {device.connectivity}
                </div>
                <span className="text-xs text-slate-400">•</span>
                <div className={`text-xs font-medium ${getBatteryColor(device.batteryLevel)}`}>
                  {device.batteryLevel}% Battery
                </div>
              </div>

              {/* Assigned */}
              {device.assignedToPersonId && (
                <div className="mt-2 text-xs text-slate-600">
                  Assigned to {people.find(p => p.id === device.assignedToPersonId)?.name || "Unknown"}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}