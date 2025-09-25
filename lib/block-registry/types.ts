import type { BlockType, BlockConfig } from "@/lib/grid-v2/types"
import type { ZodTypeAny } from "zod"

export type BlockCategory =
  | "metrics"
  | "charts"
  | "tables"
  | "activity"
  | "content"
  | "system"
  | "materials"
  | "messages"
  | "layout"
  | "navigation"
  | "forms"

export interface BlockDefinition {
  type: BlockType
  label: string
  category: BlockCategory
  description?: string
  defaultSize?: { w: number; h: number }
  defaultTitle?: string
  defaultProps?: BlockConfig["props"]
  icon?: string
  schema?: ZodTypeAny
  variants?: BlockType[]
  controls?: string[]
  slots?: BlockSlotDefinition[]
}

export type BlockRegistry = Partial<Record<BlockType, BlockDefinition>>

export interface CreateBlockOptions {
  id?: string
  title?: string
  props?: BlockConfig["props"]
  extensions?: BlockConfig["extensions"]
  slots?: BlockConfig["slots"]
}

export interface BlockSlotDefinition {
  id: string
  label: string
  description?: string
  allowedTypes?: BlockType[]
  allowedCategories?: BlockCategory[]
  defaultType?: BlockType
}
