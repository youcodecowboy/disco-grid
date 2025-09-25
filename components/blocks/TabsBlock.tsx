"use client"

import { useMemo, useState } from "react"

interface TabConfig {
  id: string
  label: string
  description?: string
  content?: string
}

interface TabsBlockProps {
  title?: string
  data?: {
    tabs?: TabConfig[]
    defaultTab?: string
  }
}

export function TabsBlock({ title = "Tabs", data }: TabsBlockProps) {
  const tabs = useMemo<TabConfig[]>(
    () =>
      data?.tabs?.length
        ? data.tabs
        : [
            { id: "overview", label: "Overview", content: "Configure tab content via the registry." },
            { id: "details", label: "Details", content: "You can map another block here later." },
          ],
    [data?.tabs],
  )

  const initialTab = data?.defaultTab && tabs.some((tab) => tab.id === data.defaultTab) ? data.defaultTab : tabs[0]?.id
  const [activeTab, setActiveTab] = useState<string | undefined>(initialTab)

  if (!tabs.length) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-md">
        No tabs configured yet.
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="pb-2">
        <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
      </div>
      <div className="flex items-center gap-2 border-b border-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto pt-3 text-sm text-muted-foreground">
        {tabs.map((tab) => (
          <div key={tab.id} role="tabpanel" hidden={activeTab !== tab.id} className="space-y-2">
            {tab.description && <p className="text-xs text-muted-foreground">{tab.description}</p>}
            <p className="text-sm leading-relaxed">
              {tab.content || "Placeholder tab content. Hook into the component engine to render nested blocks here."}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
