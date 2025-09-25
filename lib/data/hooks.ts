import { useDataContext } from "./context"

export function useDataSources() {
  const { sources, refreshSources } = useDataContext()
  return { sources, refreshSources }
}

export function useDataProvider() {
  const { provider } = useDataContext()
  return provider
}
