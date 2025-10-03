"use client"

import { useState, type PropsWithChildren, type ReactNode } from "react"
import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { gridContainerClass } from "@/lib/grid/container"

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className || "h-5 w-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const BellIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const Avatar = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>
)

const AvatarFallback = ({ children }: { children: ReactNode }) => (
  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">{children}</div>
)

interface LayoutScaffoldProps {
  pageTitle: string
  pageSubtext?: string
  actions?: ReactNode
  headerActions?: ReactNode
  children: ReactNode
}

export function LayoutScaffold({
  pageTitle,
  pageSubtext = "",
  actions,
  headerActions,
  children,
}: PropsWithChildren<LayoutScaffoldProps>) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className={gridContainerClass("flex h-full items-center justify-between px-4", "full")}
        >
          <div className="flex items-center gap-3">
            <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
            <div className="h-6 w-px bg-slate-300" />
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:flex items-center">
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-1.5 text-sm border-2 rounded-md w-48 md:w-64"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10 h-4 w-4" />
            </div>
            {headerActions}
            <Button variant="ghost" size="icon" title="Notifications">
              <BellIcon />
            </Button>
            <Avatar>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar
          sidebarExpanded={sidebarExpanded}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        />

        <main className="flex-1 p-4 pt-6">
          {actions && (
            <div className={gridContainerClass("mb-4 pb-2 border-b-2", "full")}
            >
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-2">{actions}</div>
              </div>
            </div>
          )}

          <div className={gridContainerClass("px-4", "full")}>{children}</div>
       </main>
      </div>
    </div>
  )
}
