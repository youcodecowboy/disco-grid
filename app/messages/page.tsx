"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search, Inbox, Send, Archive, Trash2, Star, Clock, PlusCircle, X,
  Paperclip, Package, Workflow as WorkflowIcon, ShoppingCart, ChevronLeft,
  Reply, Forward, MoreVertical, Mail, Users, Building2, Zap, Settings,
  Filter, Tag, AlertCircle
} from "lucide-react"

type Message = {
  id: string
  from: { name: string; email: string; isExternal?: boolean }
  to: string[]
  subject: string
  body: string
  timestamp: string
  priority: "normal" | "high" | "urgent"
  status: "unread" | "read" | "archived"
  starred: boolean
  labels: string[]
  attachments: Array<{ id: string; type: string; name: string; reference: string }>
}

const MOCK_INTERNAL_USERS = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@groovy.app", team: "Production" },
  { id: "2", name: "Marcus Johnson", email: "marcus.j@groovy.app", team: "Logistics" },
  { id: "3", name: "Elena Rodriguez", email: "elena.r@groovy.app", team: "Quality" },
  { id: "4", name: "David Kim", email: "david.kim@groovy.app", team: "Planning" },
  { id: "5", name: "Lisa Patel", email: "lisa.patel@groovy.app", team: "Compliance" },
]

const MOCK_EXTERNAL_CONTACTS = [
  { id: "ext-1", name: "Horizon Apparel Co.", email: "orders@horizonapparel.com", type: "Client" },
  { id: "ext-2", name: "Pacific Textiles Factory", email: "production@pacifictex.com", type: "Supplier" },
  { id: "ext-3", name: "QuickShip Logistics", email: "dispatch@quickship.com", type: "Partner" },
  { id: "ext-4", name: "Atlas Activewear", email: "procurement@atlasactive.com", type: "Client" },
]

const MOCK_MESSAGES: Message[] = [
  {
    id: "msg-001",
    from: { name: "Sarah Chen", email: "sarah.chen@groovy.app" },
    to: ["you@groovy.app"],
    subject: "Aurora order production update",
    body: "Hi team,\n\nI wanted to give you a quick update on the Aurora Flight Jacket production. We're currently on schedule and expect to complete cutting by end of week.\n\nThe fabric quality looks excellent and QA has already approved the first batch. Please let me know if you need any additional details.\n\nBest,\nSarah",
    timestamp: "2025-09-30T10:30:00",
    priority: "normal",
    status: "unread",
    starred: false,
    labels: ["Production Updates"],
    attachments: [{ id: "att-001", type: "order", name: "Aurora Flight Jacket", reference: "ORD-2025-001" }]
  },
  {
    id: "msg-002",
    from: { name: "Pacific Textiles Factory", email: "production@pacifictex.com", isExternal: true },
    to: ["you@groovy.app", "sarah.chen@groovy.app"],
    subject: "Material shipment delayed - Atlas project",
    body: "Dear Team,\n\nWe regret to inform you that the Atlas Cargo Pant material shipment will be delayed by 2 business days due to customs processing.\n\nNew expected delivery: October 4th, 2025\n\nWe apologize for any inconvenience and will provide tracking updates.\n\nBest regards,\nPacific Textiles Production Team",
    timestamp: "2025-09-30T09:15:00",
    priority: "urgent",
    status: "read",
    starred: true,
    labels: ["Urgent", "Supplier Communication"],
    attachments: [
      { id: "att-002", type: "order", name: "Atlas Cargo Pant", reference: "ORD-2025-002" },
      { id: "att-003", type: "item", name: "Premium Denim Fabric", reference: "ITM-FAB-001" }
    ]
  },
  {
    id: "msg-003",
    from: { name: "Elena Rodriguez", email: "elena.r@groovy.app" },
    to: ["you@groovy.app"],
    subject: "QA workflow improvements proposal",
    body: "Hello,\n\nI've been reviewing our QA Sprint Process and have some suggestions for improvements. Can we schedule a meeting this week to discuss?\n\nI think we can reduce inspection time by 20% with some minor adjustments to the workflow stages.\n\nThanks,\nElena",
    timestamp: "2025-09-29T16:45:00",
    priority: "normal",
    status: "read",
    starred: false,
    labels: ["Process Improvement"],
    attachments: [{ id: "att-004", type: "workflow", name: "QA Sprint Process", reference: "WF-QA-SPRINT" }]
  },
]

export default function MessagesPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"message" | "compose" | "reply">("message")
  const [autoReportDrawerOpen, setAutoReportDrawerOpen] = useState(false)
  
  // Compose state
  const [composeTo, setComposeTo] = useState<string[]>([])
  const [composeCc, setComposeCc] = useState<string[]>([])
  const [composeBcc, setComposeBcc] = useState<string[]>([])
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [composeSubject, setComposeSubject] = useState("")
  const [composeBody, setComposeBody] = useState("")
  const [composePriority, setComposePriority] = useState<"normal" | "high" | "urgent">("normal")
  const [composeAttachments, setComposeAttachments] = useState<any[]>([])
  const [showRecipientPicker, setShowRecipientPicker] = useState<"to" | "cc" | "bcc" | null>(null)
  const [recipientFilter, setRecipientFilter] = useState<"all" | "internal" | "external">("all")

  const unreadCount = messages.filter(m => m.status === "unread").length

  const handleCompose = () => {
    setViewMode("compose")
    setSelectedMessage(null)
    setComposeTo([])
    setComposeCc([])
    setComposeBcc([])
    setShowCc(false)
    setShowBcc(false)
    setComposeSubject("")
    setComposeBody("")
    setComposePriority("normal")
    setComposeAttachments([])
  }

  const handleReply = () => {
    if (!selectedMessage) return
    setViewMode("reply")
    setComposeTo([selectedMessage.from.email])
    setComposeCc([])
    setComposeBcc([])
    setShowCc(false)
    setShowBcc(false)
    setComposeSubject(`Re: ${selectedMessage.subject}`)
    setComposeBody(`\n\n---\nOn ${new Date(selectedMessage.timestamp).toLocaleString()}, ${selectedMessage.from.name} wrote:\n${selectedMessage.body}`)
    setComposePriority("normal")
    setComposeAttachments([])
  }

  const handleSendMessage = () => {
    console.log("Sending message:", { 
      to: composeTo, 
      cc: composeCc, 
      bcc: composeBcc, 
      subject: composeSubject, 
      body: composeBody,
      priority: composePriority 
    })
    // Reset form and return to message view
    setViewMode("message")
    setComposeTo([])
    setComposeCc([])
    setComposeBcc([])
    setShowCc(false)
    setShowBcc(false)
    setComposeSubject("")
    setComposeBody("")
    setComposePriority("normal")
    setComposeAttachments([])
  }

  const handleCancelCompose = () => {
    setViewMode("message")
    setComposeTo([])
    setComposeCc([])
    setComposeBcc([])
    setShowCc(false)
    setShowBcc(false)
    setComposeSubject("")
    setComposeBody("")
    setComposePriority("normal")
    setComposeAttachments([])
  }

  const handleAddRecipient = (email: string, field: "to" | "cc" | "bcc") => {
    if (field === "to" && !composeTo.includes(email)) {
      setComposeTo([...composeTo, email])
    } else if (field === "cc" && !composeCc.includes(email)) {
      setComposeCc([...composeCc, email])
    } else if (field === "bcc" && !composeBcc.includes(email)) {
      setComposeBcc([...composeBcc, email])
    }
    setShowRecipientPicker(null)
  }

  const handleRemoveRecipient = (email: string, field: "to" | "cc" | "bcc") => {
    if (field === "to") {
      setComposeTo(composeTo.filter(e => e !== email))
    } else if (field === "cc") {
      setComposeCc(composeCc.filter(e => e !== email))
    } else if (field === "bcc") {
      setComposeBcc(composeBcc.filter(e => e !== email))
    }
  }

  const filteredRecipients = () => {
    const internal = MOCK_INTERNAL_USERS.map(u => ({ ...u, isInternal: true }))
    const external = MOCK_EXTERNAL_CONTACTS.map(c => ({ ...c, isInternal: false, team: c.type }))
    
    const all = [...internal, ...external]
    
    if (recipientFilter === "internal") return internal
    if (recipientFilter === "external") return external
    return all
  }

  const handleToggleStar = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ))
  }

  const handleArchive = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: "archived" as const } : msg
    ))
    setSelectedMessage(null)
  }

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
    setSelectedMessage(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-700 border-red-200"
      case "high": return "bg-orange-100 text-orange-700 border-orange-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "order": return <ShoppingCart className="h-4 w-4" />
      case "workflow": return <WorkflowIcon className="h-4 w-4" />
      case "item": return <Package className="h-4 w-4" />
      default: return <Paperclip className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar
          sidebarExpanded={sidebarExpanded}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        />
        
        <div className="flex flex-1 flex-col bg-slate-50">
          <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex h-14 items-center justify-between px-4 md:px-8">
              <div className="flex items-center gap-3">
                <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
                <div className="h-6 w-px bg-slate-300" />
                <h1 className="text-lg font-semibold text-slate-900">Messages</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                <Button variant="outline" onClick={() => setAutoReportDrawerOpen(true)}>
                  <Zap className="mr-2 h-4 w-4" /> Auto Reports
                </Button>
                <Button onClick={handleCompose}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Compose
                </Button>
              </div>
            </div>
          </header>

          <main className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-56 border-r bg-white p-4">
              <nav className="space-y-1">
                <button className="flex w-full items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                  <div className="flex items-center gap-2">
                    <Inbox className="h-4 w-4" />
                    <span>Inbox</span>
                  </div>
                  {unreadCount > 0 && (
                    <Badge className="bg-blue-600 text-white">{unreadCount}</Badge>
                  )}
                </button>
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <Send className="h-4 w-4" />
                  <span>Sent</span>
                </button>
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <Star className="h-4 w-4" />
                  <span>Starred</span>
                </button>
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <Archive className="h-4 w-4" />
                  <span>Archived</span>
                </button>
              </nav>

              <div className="mt-6 border-t pt-4">
                <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Labels
                </div>
                <div className="space-y-1">
                  <button className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Production Updates
                  </button>
                  <button className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    Urgent
                  </button>
                  <button className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    Supplier Communication
                  </button>
                  <button className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    Process Improvement
                  </button>
                </div>
              </div>
            </div>

            {/* Message List */}
            <div className="w-96 border-r bg-white overflow-y-auto">
              <div className="divide-y">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full border-l-4 p-4 text-left transition hover:bg-slate-50 ${
                      selectedMessage?.id === message.id
                        ? "border-l-blue-600 bg-slate-50"
                        : message.status === "unread"
                        ? "border-l-blue-400 bg-blue-50/30"
                        : "border-l-transparent"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`truncate text-sm ${message.status === "unread" ? "font-semibold" : "font-medium"}`}>
                            {message.from.name}
                          </p>
                          {message.from.isExternal && (
                            <Building2 className="h-3 w-3 text-slate-400" title="External contact" />
                          )}
                        </div>
                        <p className="truncate text-xs text-slate-500">{message.from.email}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {message.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                        {message.attachments.length > 0 && <Paperclip className="h-4 w-4 text-slate-400" />}
                      </div>
                    </div>
                    
                    <p className={`mb-1 truncate text-sm ${message.status === "unread" ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                      {message.subject}
                    </p>
                    
                    <p className="mb-2 line-clamp-2 text-xs text-slate-500">{message.body}</p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />
                        {new Date(message.timestamp).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                      </div>
                      {message.labels.map((label) => (
                        <Badge key={label} variant="outline" className="text-[10px] px-1.5 py-0">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Detail / Compose Area */}
            <div className="flex-1 bg-white overflow-y-auto">
              {viewMode === "compose" || viewMode === "reply" ? (
                <div className="h-full flex flex-col">
                  {/* Compose Header */}
                  <div className="border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {viewMode === "reply" ? "Reply" : "New Message"}
                      </h2>
                      <Button variant="ghost" size="icon" onClick={handleCancelCompose}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Compose Form */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* To */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="block text-sm font-medium text-slate-700">To</label>
                        <div className="flex gap-2 text-xs">
                          {!showCc && (
                            <button
                              onClick={() => setShowCc(true)}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              + Cc
                            </button>
                          )}
                          {!showBcc && (
                            <button
                              onClick={() => setShowBcc(true)}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              + Bcc
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <div className="flex flex-wrap gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 min-h-[42px]">
                          {composeTo.map((email) => (
                            <span key={email} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                              {email}
                              <button onClick={() => handleRemoveRecipient(email, "to")} className="hover:text-blue-900">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                          <button
                            onClick={() => setShowRecipientPicker("to")}
                            className="text-sm text-slate-500 hover:text-slate-700"
                          >
                            + Add recipient
                          </button>
                        </div>
                        
                        {showRecipientPicker === "to" && (
                          <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg">
                            <div className="border-b p-2 flex gap-1">
                              <Button
                                variant={recipientFilter === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setRecipientFilter("all")}
                              >
                                All
                              </Button>
                              <Button
                                variant={recipientFilter === "internal" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setRecipientFilter("internal")}
                              >
                                <Users className="mr-1 h-3 w-3" /> Internal
                              </Button>
                              <Button
                                variant={recipientFilter === "external" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setRecipientFilter("external")}
                              >
                                <Building2 className="mr-1 h-3 w-3" /> External
                              </Button>
                            </div>
                            <div className="max-h-60 overflow-auto">
                              {filteredRecipients().map((contact) => (
                                <button
                                  key={contact.id}
                                  onClick={() => handleAddRecipient(contact.email, "to")}
                                  disabled={composeTo.includes(contact.email)}
                                  className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-slate-50 disabled:opacity-50"
                                >
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-medium">
                                    {contact.name.split(' ').map((n: string) => n[0]).join('')}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                                      {!('isInternal' in contact && contact.isInternal) && (
                                        <Building2 className="h-3 w-3 text-slate-400" />
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-500">{contact.email} · {contact.team}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cc */}
                    {showCc && (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Cc</label>
                        <div className="relative">
                          <div className="flex flex-wrap gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 min-h-[42px]">
                            {composeCc.map((email) => (
                              <span key={email} className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                                {email}
                                <button onClick={() => handleRemoveRecipient(email, "cc")} className="hover:text-purple-900">
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                            <button
                              onClick={() => setShowRecipientPicker("cc")}
                              className="text-sm text-slate-500 hover:text-slate-700"
                            >
                              + Add Cc
                            </button>
                          </div>
                          
                          {showRecipientPicker === "cc" && (
                            <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg">
                              <div className="border-b p-2 flex gap-1">
                                <Button
                                  variant={recipientFilter === "all" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setRecipientFilter("all")}
                                >
                                  All
                                </Button>
                                <Button
                                  variant={recipientFilter === "internal" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setRecipientFilter("internal")}
                                >
                                  <Users className="mr-1 h-3 w-3" /> Internal
                                </Button>
                                <Button
                                  variant={recipientFilter === "external" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setRecipientFilter("external")}
                                >
                                  <Building2 className="mr-1 h-3 w-3" /> External
                                </Button>
                              </div>
                              <div className="max-h-60 overflow-auto">
                                {filteredRecipients().map((contact) => (
                                  <button
                                    key={contact.id}
                                    onClick={() => handleAddRecipient(contact.email, "cc")}
                                    disabled={composeCc.includes(contact.email)}
                                    className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-slate-50 disabled:opacity-50"
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-medium">
                                      {contact.name.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                                        {!('isInternal' in contact && contact.isInternal) && (
                                          <Building2 className="h-3 w-3 text-slate-400" />
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-500">{contact.email} · {contact.team}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bcc */}
                    {showBcc && (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Bcc</label>
                        <div className="relative">
                          <div className="flex flex-wrap gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 min-h-[42px]">
                            {composeBcc.map((email) => (
                              <span key={email} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                {email}
                                <button onClick={() => handleRemoveRecipient(email, "bcc")} className="hover:text-slate-900">
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                            <button
                              onClick={() => setShowRecipientPicker("bcc")}
                              className="text-sm text-slate-500 hover:text-slate-700"
                            >
                              + Add Bcc
                            </button>
                          </div>
                          
                          {showRecipientPicker === "bcc" && (
                            <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg">
                              <div className="border-b p-2 flex gap-1">
                                <Button
                                  variant={recipientFilter === "all" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setRecipientFilter("all")}
                                >
                                  All
                                </Button>
                                <Button
                                  variant={recipientFilter === "internal" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setRecipientFilter("internal")}
                                >
                                  <Users className="mr-1 h-3 w-3" /> Internal
                                </Button>
                                <Button
                                  variant={recipientFilter === "external" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setRecipientFilter("external")}
                                >
                                  <Building2 className="mr-1 h-3 w-3" /> External
                                </Button>
                              </div>
                              <div className="max-h-60 overflow-auto">
                                {filteredRecipients().map((contact) => (
                                  <button
                                    key={contact.id}
                                    onClick={() => handleAddRecipient(contact.email, "bcc")}
                                    disabled={composeBcc.includes(contact.email)}
                                    className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-slate-50 disabled:opacity-50"
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-medium">
                                      {contact.name.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                                        {!('isInternal' in contact && contact.isInternal) && (
                                          <Building2 className="h-3 w-3 text-slate-400" />
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-500">{contact.email} · {contact.team}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Subject */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Subject</label>
                      <Input
                        placeholder="Enter subject"
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                      />
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
                      <select
                        value={composePriority}
                        onChange={(e) => setComposePriority(e.target.value as "normal" | "high" | "urgent")}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    {/* Body */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
                      <textarea
                        placeholder="Type your message..."
                        value={composeBody}
                        onChange={(e) => setComposeBody(e.target.value)}
                        className="min-h-[300px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  {/* Compose Footer */}
                  <div className="border-t px-6 py-4">
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        <Paperclip className="mr-2 h-4 w-4" /> Attach
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancelCompose}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSendMessage}
                          disabled={composeTo.length === 0 || !composeSubject.trim()}
                        >
                          <Send className="mr-2 h-4 w-4" /> Send Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedMessage ? (
                <div className="h-full flex flex-col">
                  {/* Action Bar - Like Gmail */}
                  <div className="border-b px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleReply}>
                        <Reply className="mr-2 h-4 w-4" /> Reply
                      </Button>
                      <Button variant="outline" size="sm">
                        <Forward className="mr-2 h-4 w-4" /> Forward
                      </Button>
                      <div className="ml-auto flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStar(selectedMessage.id)}
                        >
                          <Star className={`h-4 w-4 ${
                            selectedMessage.starred ? "fill-yellow-400 text-yellow-400" : ""
                          }`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleArchive(selectedMessage.id)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(selectedMessage.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Message Header */}
                  <div className="border-b p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <h2 className="text-2xl font-semibold text-slate-900">{selectedMessage.subject}</h2>
                      <div className="flex gap-2">
                        {selectedMessage.labels.map((label) => (
                          <Badge key={label} className="bg-blue-100 text-blue-700 border-blue-200">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                        {selectedMessage.from.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900">{selectedMessage.from.name}</p>
                          {selectedMessage.from.isExternal && (
                            <Badge variant="outline" className="text-xs">
                              <Building2 className="mr-1 h-3 w-3" /> External
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          to {selectedMessage.to.join(", ")}
                        </p>
                      </div>
                      <p className="text-sm text-slate-500">
                        {new Date(selectedMessage.timestamp).toLocaleString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 p-6">
                    <div className="prose prose-slate max-w-none">
                      {selectedMessage.body.split('\n').map((line, i) => (
                        <p key={i}>{line || <br />}</p>
                      ))}
                    </div>

                    {/* Attachments */}
                    {selectedMessage.attachments.length > 0 && (
                      <div className="mt-6 border-t pt-6">
                        <h3 className="mb-3 text-sm font-semibold text-slate-700">
                          Attachments ({selectedMessage.attachments.length})
                        </h3>
                        <div className="space-y-2">
                          {selectedMessage.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                                {getAttachmentIcon(attachment.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-medium text-slate-900">{attachment.name}</p>
                                <p className="text-xs text-slate-500">
                                  {attachment.type.charAt(0).toUpperCase() + attachment.type.slice(1)} · {attachment.reference}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">View</Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Inbox className="mx-auto mb-4 h-16 w-16" />
                    <p className="text-lg">Select a message to read</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Auto Report Drawer */}
      {autoReportDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-slate-900/40"
            onClick={() => setAutoReportDrawerOpen(false)}
          />
          <div className="w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 border-b bg-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Automatic Reports</h2>
                <p className="text-sm text-slate-500">Configure automated email reports and notifications</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAutoReportDrawerOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Coming Soon</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Automatic report generation will allow you to schedule regular updates, set triggers based on production events, and send notifications to internal teams and external partners.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Planned Features</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3 p-3 rounded-lg border border-slate-200">
                    <Zap className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-slate-900">Event Triggers</p>
                      <p className="text-xs text-slate-600">Send emails when production milestones are reached</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg border border-slate-200">
                    <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-slate-900">Scheduled Reports</p>
                      <p className="text-xs text-slate-600">Daily, weekly, or monthly summary emails</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg border border-slate-200">
                    <Filter className="h-5 w-5 text-purple-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-slate-900">Custom Filters</p>
                      <p className="text-xs text-slate-600">Filter by order, workflow, team, or priority</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg border border-slate-200">
                    <Users className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-slate-900">Recipient Groups</p>
                      <p className="text-xs text-slate-600">Send to internal teams or external partners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}