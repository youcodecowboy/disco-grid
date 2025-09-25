"use client"

import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  id: string
  label: string
  href?: string
  isActive?: boolean
}

interface NavBreadcrumbsProps {
  title?: string
  data?: {
    items?: BreadcrumbItem[]
    showHome?: boolean
    separator?: "chevron" | "slash"
  }
}

export default function NavBreadcrumbs({ 
  title = "Breadcrumbs", 
  data = {} 
}: NavBreadcrumbsProps) {
  const { 
    items = [
      { id: "1", label: "Dashboard", href: "/" },
      { id: "2", label: "Orders", href: "/orders" },
      { id: "3", label: "Order #1234", isActive: true }
    ],
    showHome = true,
    separator = "chevron"
  } = data

  const SeparatorIcon = separator === "chevron" ? ChevronRight : () => <span>/</span>

  return (
    <div className="h-full flex flex-col" style={{ containerType: "inline-size" }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-foreground truncate">{title}</h3>
      </div>
      
      <nav className="flex items-center space-x-1 overflow-hidden" aria-label="Breadcrumb">
        {showHome && (
          <>
            <a
              href="/"
              className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Home"
            >
              <Home className="h-3 w-3" />
            </a>
            {items.length > 0 && (
              <SeparatorIcon className="h-3 w-3 text-muted-foreground/50" />
            )}
          </>
        )}
        
        <ol className="flex items-center space-x-1 overflow-hidden">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center space-x-1 overflow-hidden">
              {index > 0 && (
                <SeparatorIcon className="h-3 w-3 text-muted-foreground/50 flex-shrink-0" />
              )}
              
              {item.isActive ? (
                <span 
                  className="text-xs font-medium text-foreground truncate"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || "#"}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors truncate"
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
      
      <div className="mt-auto pt-2 text-[10px] text-muted-foreground/60">
        {items.length} level{items.length !== 1 ? 's' : ''} deep
      </div>
    </div>
  )
}
