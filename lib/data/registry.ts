import { mockProvider, MOCK_PROVIDER_ID } from "./mockProvider"
import type { DataProvider } from "./types"

const providers = new Map<string, DataProvider>([[MOCK_PROVIDER_ID, mockProvider]])

export function registerProvider(provider: DataProvider) {
  providers.set(provider.id, provider)
}

export function getProvider(id: string): DataProvider {
  const provider = providers.get(id)
  if (!provider) {
    throw new Error(`Data provider not registered: ${id}`)
  }
  return provider
}

export function listProviders() {
  return Array.from(providers.values())
}

export const DEFAULT_PROVIDER_ID = MOCK_PROVIDER_ID
