import { mockDataMap } from "@/lib/block-registry/mockData"
import type { DataBinding, DataProvider, DataSourceDefinition } from "./types"

const MOCK_PROVIDER_ID = "mock"

const toLabel = (table: string) =>
  table
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")

const mockSources: DataSourceDefinition[] = Object.keys(mockDataMap)
  .filter((key) => key !== "default")
  .map((key) => ({
    id: `${MOCK_PROVIDER_ID}:${key}`,
    table: key,
    label: toLabel(key),
    domain: key.includes("materials") ? "Materials" : key.includes("production") ? "Operations" : undefined,
  }))

const mockProvider: DataProvider = {
  id: MOCK_PROVIDER_ID,
  label: "Mock Data",
  description: "Seeded fixture data for demo and onboarding flows.",
  async listSources() {
    return mockSources
  },
  async getSource(id: string) {
    return mockSources.find((source) => source.id === id) ?? null
  },
  async fetch<T = unknown>(binding: DataBinding): Promise<T> {
    const table = binding.source.replace(`${MOCK_PROVIDER_ID}:`, "") as keyof typeof mockDataMap
    const dataset = mockDataMap[table]
    if (!dataset) {
      return Promise.reject(new Error(`Mock dataset not found for source ${binding.source}`))
    }
    return dataset as T
  },
}

export { mockProvider, MOCK_PROVIDER_ID }
