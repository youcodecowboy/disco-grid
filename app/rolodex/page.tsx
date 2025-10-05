"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { MOCK_CONTACTS, ContactCategory, getContactsByCategory } from "@/lib/data/contacts"
import { ContactCard } from "@/components/blocks/ContactCard"

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className || "h-5 w-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className || "h-5 w-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M5 12h14" strokeWidth={2} />
    <path d="M12 5v14" strokeWidth={2} />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const BellIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const DownloadIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

const FilterIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
)

type TabId = "all" | "clients" | "vendors" | "internal" | "prospects" | "partners"

const TABS: { id: TabId; label: string; category?: ContactCategory }[] = [
  { id: "all", label: "All" },
  { id: "clients", label: "Clients", category: "Client" },
  { id: "vendors", label: "Vendors", category: "Vendor" },
  { id: "internal", label: "Internal", category: "Internal" },
  { id: "prospects", label: "Prospects", category: "Prospect" },
  { id: "partners", label: "Partners", category: "Partner" },
]

export default function RolodexPage() {
  const router = useRouter()
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "name" | "relationship">("recent")

  // Filter contacts based on active tab and search
  const filteredContacts = useMemo(() => {
    let contacts = MOCK_CONTACTS

    // Filter by tab
    if (activeTab !== "all") {
      const tab = TABS.find(t => t.id === activeTab)
      if (tab?.category) {
        contacts = contacts.filter(contact => contact.category === tab.category)
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      contacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.organization?.toLowerCase().includes(query) ||
        contact.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Sort contacts
    contacts = [...contacts].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "relationship") {
        const strengthOrder = { Strong: 3, Moderate: 2, Weak: 1, Unknown: 0 }
        return strengthOrder[b.relationshipStrength] - strengthOrder[a.relationshipStrength]
      } else {
        // Sort by recent (lastContactDate)
        const dateA = a.lastContactDate ? new Date(a.lastContactDate).getTime() : 0
        const dateB = b.lastContactDate ? new Date(b.lastContactDate).getTime() : 0
        return dateB - dateA
      }
    })

    return contacts
  }, [activeTab, searchQuery, sortBy])

  // Calculate stats
  const stats = useMemo(() => {
    const totalContacts = filteredContacts.length
    const clients = MOCK_CONTACTS.filter(c => c.category === "Client").length
    const vendors = MOCK_CONTACTS.filter(c => c.category === "Vendor").length
    const internal = MOCK_CONTACTS.filter(c => c.category === "Internal").length
    const prospects = MOCK_CONTACTS.filter(c => c.category === "Prospect").length
    const strongRelationships = MOCK_CONTACTS.filter(c => c.relationshipStrength === "Strong").length

    return { totalContacts, clients, vendors, internal, prospects, strongRelationships }
  }, [filteredContacts])

  const handleAddContact = () => {
    router.push("/rolodex/new")
  }

  const handleContactClick = (contactId: string) => {
    // TODO: Navigate to contact detail page
    alert(`Opening contact detail: ${contactId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
            </div>
            <div className="text-sm text-muted-foreground">Dashboard</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-1.5 text-sm border-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10 h-4 w-4" />
            </div>
            <Button variant="ghost" size="icon" title="Notifications">
              <BellIcon />
            </Button>
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar 
          sidebarExpanded={sidebarExpanded}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        />

        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <UsersIcon />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Rolodex</h1>
                  <p className="text-sm text-muted-foreground">Your business relationships</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none cursor-pointer"
                  >
                    <option value="recent">Recent</option>
                    <option value="name">Name</option>
                    <option value="relationship">Relationship</option>
                  </select>
                </div>
                <Button variant="outline" size="sm">
                  <FilterIcon />
                  <span className="ml-2">Filter</span>
                </Button>
                <Button variant="outline" size="sm">
                  <DownloadIcon />
                  <span className="ml-2">Export</span>
                </Button>
                <Button onClick={handleAddContact} className="bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="mr-2" />
                  Add Contact
                </Button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              <div className="bg-white rounded-lg border p-4">
                <div className="text-sm text-gray-600 mb-1">Total Contacts</div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalContacts}</div>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <div className="text-sm text-gray-600 mb-1">Clients</div>
                <div className="text-2xl font-bold text-blue-600">{stats.clients}</div>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <div className="text-sm text-gray-600 mb-1">Vendors</div>
                <div className="text-2xl font-bold text-purple-600">{stats.vendors}</div>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <div className="text-sm text-gray-600 mb-1">Internal</div>
                <div className="text-2xl font-bold text-green-600">{stats.internal}</div>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <div className="text-sm text-gray-600 mb-1">Prospects</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.prospects}</div>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <div className="text-sm text-gray-600 mb-1">Strong Bonds</div>
                <div className="text-2xl font-bold text-pink-600">{stats.strongRelationships}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-8">
              {TABS.map((tab) => {
                const count = tab.id === "all" 
                  ? MOCK_CONTACTS.length 
                  : tab.category 
                    ? getContactsByCategory(tab.category).length 
                    : 0

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Contact Cards Grid */}
          {filteredContacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onClick={() => handleContactClick(contact.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center bg-white rounded-lg border-2 border-dashed">
              <UsersIcon />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No contacts found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery ? "Try adjusting your search query" : "Get started by adding your first contact"}
              </p>
              {!searchQuery && (
                <Button onClick={handleAddContact} className="mt-4">
                  <PlusIcon className="mr-2" />
                  Add Contact
                </Button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
