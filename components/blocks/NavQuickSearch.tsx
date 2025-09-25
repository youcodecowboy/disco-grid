"use client"

import { useState } from "react"
import { Search, Clock, ArrowUpRight } from "lucide-react"

interface SearchResult {
  id: string
  title: string
  type: string
  description?: string
  url?: string
  timestamp?: string
}

interface NavQuickSearchProps {
  title?: string
  data?: {
    placeholder?: string
    recentSearches?: string[]
    popularResults?: SearchResult[]
    showRecent?: boolean
  }
}

export default function NavQuickSearch({ 
  title = "Quick Search", 
  data = {} 
}: NavQuickSearchProps) {
  const { 
    placeholder = "Search orders, items, customers...",
    recentSearches = ["Order #1234", "Acme Denim", "Pending items"],
    popularResults = [
      { id: "1", title: "Order #1234", type: "Order", description: "Acme Denim - In Progress", url: "/orders/1234" },
      { id: "2", title: "Denim Panel", type: "Item", description: "156 in stock", url: "/items/denim-panel" },
      { id: "3", title: "Acme Denim", type: "Customer", description: "Active customer", url: "/customers/acme" }
    ],
    showRecent = true
  } = data

  const [searchValue, setSearchValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const showResults = isFocused && (searchValue.length > 0 || showRecent)

  return (
    <div className="h-full flex flex-col" style={{ containerType: "inline-size" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground truncate">{title}</h3>
      </div>
      
      <div className="relative flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder={placeholder}
            className="w-full pl-7 pr-3 py-1.5 text-xs border border-border rounded-md 
                     bg-background text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
            {searchValue.length === 0 && showRecent && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground mb-1">
                  <Clock className="h-2.5 w-2.5" />
                  Recent
                </div>
                {recentSearches.slice(0, 3).map((search, index) => (
                  <button
                    key={index}
                    className="w-full text-left text-xs p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setSearchValue(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}
            
            {searchValue.length > 0 && (
              <div className="p-2">
                <div className="text-[10px] font-medium text-muted-foreground mb-1">Results</div>
                {popularResults
                  .filter(result => 
                    result.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                    result.type.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .slice(0, 4)
                  .map((result) => (
                    <a
                      key={result.id}
                      href={result.url || "#"}
                      className="block p-1.5 hover:bg-muted rounded transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-foreground truncate group-hover:text-primary">
                            {result.title}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {result.type} • {result.description}
                          </div>
                        </div>
                        <ArrowUpRight className="h-2.5 w-2.5 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-1" />
                      </div>
                    </a>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-2 text-[10px] text-muted-foreground/60">
        Search across {popularResults.length} items
      </div>
    </div>
  )
}
