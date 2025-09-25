"use client"

import { createContext, useContext, useEffect, useMemo, useState, useCallback, type PropsWithChildren } from "react"
import { DEFAULT_PROVIDER_ID, getProvider } from "./registry"
import type { DataContextValue } from "./types"

const DataProviderContext = createContext<DataContextValue | undefined>(undefined)

interface ProviderProps {
  providerId?: string
}

export function DataProviderProvider({ providerId = DEFAULT_PROVIDER_ID, children }: PropsWithChildren<ProviderProps>) {
  const provider = useMemo(() => getProvider(providerId), [providerId])
  const [sources, setSources] = useState<DataContextValue["sources"]>([])

  const refreshSources = useCallback(async () => {
    const list = await provider.listSources()
    setSources(list)
  }, [provider])

  useEffect(() => {
    refreshSources()
  }, [refreshSources])

  const value = useMemo<DataContextValue>(() => ({
    providerId,
    provider,
    sources,
    refreshSources,
  }), [providerId, provider, sources, refreshSources])

  return <DataProviderContext.Provider value={value}>{children}</DataProviderContext.Provider>
}

export function useDataContext() {
  const context = useContext(DataProviderContext)
  if (!context) {
    throw new Error("useDataContext must be used within a DataProviderProvider")
  }
  return context
}
