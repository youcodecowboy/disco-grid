export interface DataSourceDefinition {
  id: string
  table: string
  label: string
  description?: string
  fields?: string[]
  domain?: string
}

export interface DataBinding {
  provider: string
  source: string
  params?: Record<string, unknown>
}

export interface DataProvider {
  id: string
  label: string
  description?: string
  listSources(): Promise<DataSourceDefinition[]>
  getSource(id: string): Promise<DataSourceDefinition | null>
  fetch<T = unknown>(binding: DataBinding): Promise<T>
}

export interface DataContextValue {
  providerId: string
  provider: DataProvider
  sources: DataSourceDefinition[]
  refreshSources: () => Promise<void>
}
