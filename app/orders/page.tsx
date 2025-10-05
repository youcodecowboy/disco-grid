"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { MOCK_ORDERS, OrderStatus, getOrdersByStatus } from "@/lib/data/orders"
import { OrdersTable } from "@/components/blocks/OrdersTable"

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

const ShoppingCartIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
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

type TabId = "all" | "draft" | "pending" | "accepted" | "in_production" | "completed" | "cancelled"

const TABS: { id: TabId; label: string; status?: OrderStatus }[] = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft", status: "Draft" },
  { id: "pending", label: "Pending", status: "Pending" },
  { id: "accepted", label: "Accepted", status: "Accepted" },
  { id: "in_production", label: "In Production", status: "In Production" },
  { id: "completed", label: "Completed", status: "Completed" },
  { id: "cancelled", label: "Cancelled", status: "Cancelled" },
]

export default function OrdersPage() {
  const router = useRouter()
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter orders based on active tab
  const filteredOrders = useMemo(() => {
    let orders = MOCK_ORDERS

    // Filter by tab
    if (activeTab !== "all") {
      const tab = TABS.find(t => t.id === activeTab)
      if (tab?.status) {
        orders = orders.filter(order => order.status === tab.status)
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      orders = orders.filter(order =>
        order.name.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query) ||
        order.client.toLowerCase().includes(query) ||
        order.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return orders
  }, [activeTab, searchQuery])

  // Calculate stats for current view
  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length
    const inProduction = filteredOrders.filter(o => o.status === "In Production").length
    const overdue = filteredOrders.filter(o => {
      if (o.status === "Completed" || o.status === "Cancelled") return false
      return new Date(o.shipDate) < new Date()
    }).length
    const completionRate = filteredOrders.length > 0
      ? Math.round((filteredOrders.reduce((sum, o) => sum + o.progressPercent, 0) / filteredOrders.length))
      : 0

    return { totalOrders, inProduction, overdue, completionRate }
  }, [filteredOrders])

  const handleCreateOrder = () => {
    router.push("/orders/new")
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
                placeholder="Search orders..."
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
                <ShoppingCartIcon />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Orders</h1>
                  <p className="text-sm text-muted-foreground">Manage production orders</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <FilterIcon />
                  <span className="ml-2">Filter</span>
                </Button>
                <Button variant="outline" size="sm">
                  <DownloadIcon />
                  <span className="ml-2">Export</span>
                </Button>
                <Button onClick={handleCreateOrder} className="bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="mr-2" />
                  Create New Order
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border p-4">
                <div className="text-sm text-gray-600 mb-1">Total Orders</div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <div className="text-sm text-gray-600 mb-1">In Production</div>
                <div className="text-2xl font-bold text-purple-600">{stats.inProduction}</div>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <div className="text-sm text-gray-600 mb-1">Overdue</div>
                <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <div className="text-sm text-gray-600 mb-1">Avg Progress</div>
                <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex gap-8">
              {TABS.map((tab) => {
                const count = tab.id === "all" 
                  ? MOCK_ORDERS.length 
                  : tab.status 
                    ? getOrdersByStatus(tab.status).length 
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

          {/* Orders Table */}
          <div className="bg-white rounded-lg border shadow-sm" style={{ height: "calc(100vh - 420px)" }}>
            {filteredOrders.length > 0 ? (
              <OrdersTable orders={filteredOrders} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <ShoppingCartIcon />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchQuery ? "Try adjusting your search query" : "Get started by creating your first order"}
                </p>
                {!searchQuery && (
                  <Button onClick={handleCreateOrder} className="mt-4">
                    <PlusIcon className="mr-2" />
                    Create New Order
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}