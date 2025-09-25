# Data Binding Contract — 24/09/25 16:25

## Purpose
Establish a lightweight, front-end–only data provider abstraction so grid pages can describe where a block’s data originates without coupling to a backend implementation yet. This mirrors the roadmap requirement for data-source agnosticism and unlocks wiring real providers later.

## Location
- Types: `lib/data/types.ts`
- Mock provider: `lib/data/mockProvider.ts`
- Registry helpers: `lib/data/registry.ts`
- React context & hooks: `lib/data/context.tsx`, `lib/data/hooks.ts`

## Contract
```ts
interface DataSourceDefinition {
  id: string;        // e.g. "mock:orders"
  table: string;     // canonical table key
  label: string;     // human readable name
  description?: string;
  fields?: string[]; // optional field hints
  domain?: string;   // optional grouping (Operations, Materials, etc.)
}

interface DataBinding {
  provider: string;  // registered provider ID ("mock")
  source: string;    // source identifier ("mock:orders")
  params?: Record<string, unknown>; // future query/filters
}

interface DataProvider {
  id: string;
  label: string;
  description?: string;
  listSources(): Promise<DataSourceDefinition[]>;
  getSource(id: string): Promise<DataSourceDefinition | null>;
  fetch<T = unknown>(binding: DataBinding): Promise<T>;
}
```

## Usage
- Wrap grid surfaces in `DataProviderProvider` (defaults to the mock provider) to expose provider + source catalog via React context.
- Call `useDataSources()` inside UI (e.g., the v2 `BlockEditModal`) to enumerate available sources. Each source follows the contract above.
- Blocks store bindings in props as `{ source: { type: providerId; table } }`; in the interim we stick with `type: "mock"` + table string.
- When future backend support arrives, register a real provider with `registerProvider()`; UI stays unchanged.

## Mock Provider
`mockProvider` hydrates data from `lib/block-registry/mockData.ts`, yielding sources for `orders`, `items`, `suppliers`, `production_runs`, etc. `fetch()` simply returns the seeded dataset—sufficient for previews and quick-edit interactions.

## Next Steps
- Allow providers to declare capabilities (supports live updates, supports queries) so UI can adjust affordances.
- Extend DataBinding to include query builder metadata once onboarding and agents can author them.
- Move source-domain metadata to config so onboarding can tailor catalogs per vertical.

*Documented 24/09/25 16:25.*
