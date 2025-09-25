import type { BlockConfig, BlockType } from "@/lib/grid-v2/types"
import { generateId } from "@/lib/utils"
import { blockRegistry } from "./definitions"
import type { BlockDefinition, BlockRegistry, BlockSlotDefinition, CreateBlockOptions } from "./types"
import { getMockPropsForSource } from "./mockData"
import type { ZodError } from "zod"

const DEFAULT_SIZE = { w: 6, h: 8 }
const DEFAULT_TITLE = "Untitled"
const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production"

function warnValidation(type: BlockType, error: ZodError) {
  if (!isDev) return
  console.warn(
    `[block-registry] Invalid props provided for block type "${type}". Falling back to defaults.`,
    error.flatten().fieldErrors,
  )
}

function mergeProps(
  type: BlockType,
  definition: BlockDefinition | undefined,
  overrides?: BlockConfig["props"],
): BlockConfig["props"] {
  const schema = definition?.schema
  const baseProps = { ...(definition?.defaultProps || {}) }
  const merged = { ...baseProps, ...(overrides || {}) }

  if (!schema) {
    return merged
  }

  const parsed = schema.safeParse(merged)
  if (parsed.success) {
    return parsed.data
  }

  warnValidation(type, parsed.error)

  const fallback = schema.safeParse(baseProps)
  if (fallback.success) {
    return fallback.data
  }

  return baseProps
}

export function getBlockDefinition(type: BlockType): BlockDefinition | undefined {
  return blockRegistry[type]
}

export function listBlockDefinitions(): BlockDefinition[] {
  return Object.values(blockRegistry).filter(Boolean) as BlockDefinition[]
}

export function createBlockConfig(type: BlockType, options: CreateBlockOptions = {}): BlockConfig {
  const definition = getBlockDefinition(type)

  const title = options.title ?? definition?.defaultTitle ?? DEFAULT_TITLE
  const props = mergeProps(type, definition, options.props)
  const extensions = options.extensions?.map((ext) =>
    createBlockConfig(ext.type, {
      id: ext.id,
      title: ext.title,
      props: ext.props,
      extensions: ext.extensions,
      slots: ext.slots,
    }),
  )

  const slots = normalizeSlots(definition?.slots, options.slots, options.id || type)

  return {
    id: options.id || "",
    type,
    title,
    props,
    extensions,
    slots,
  }
}

function normalizeSlots(
  definitions: BlockSlotDefinition[] | undefined,
  overrides: BlockConfig["slots"],
  parentId: string,
): BlockConfig["slots"] | undefined {
  if (!definitions?.length && !overrides) {
    return undefined
  }

  const result: Record<string, BlockConfig | null> = {}
  const provided = overrides ?? {}

  const hydrateChild = (slotId: string, child: BlockConfig | null | undefined, fallbackType?: BlockType) => {
    if (!child && !fallbackType) {
      result[slotId] = null
      return
    }

    const source = child ?? { id: `${parentId}-${slotId}-${generateId("slot")}`, type: fallbackType! }
    result[slotId] = createBlockConfig(source.type, {
      id: source.id,
      title: source.title,
      props: source.props,
      extensions: source.extensions,
      slots: source.slots,
    })
  }

  definitions?.forEach((definition) => {
    const providedChild = provided[definition.id]
    hydrateChild(definition.id, providedChild, definition.defaultType)
  })

  Object.entries(provided).forEach(([slotId, child]) => {
    if (slotId in result) return
    hydrateChild(slotId, child)
  })

  return result
}

export function defaultBlockSize(type: BlockType): { w: number; h: number } {
  return getBlockDefinition(type)?.defaultSize || DEFAULT_SIZE
}

export function getBlockVariants(type: BlockType): BlockType[] {
  return getBlockDefinition(type)?.variants || []
}

export type { BlockDefinition, BlockRegistry }
export { blockRegistry }
export { getMockPropsForSource }
