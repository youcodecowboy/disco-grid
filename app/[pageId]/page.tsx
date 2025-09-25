"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Settings } from "lucide-react"
import BlockRenderer from "@/components/BlockRenderer"
import { LayoutScaffold, GridSurface, BlockShell, QuickEditControls, V2BlockEditModal } from "@/components/grid-v2"
import { SlotEditModal } from "@/components/grid-v2/SlotEditModal"
import { useGrid } from "@/lib/grid-v2"
import { createBlockConfig, getBlockDefinition, getMockPropsForSource } from "@/lib/block-registry"
import { createBlankPreset, getPreset } from "@/lib/grid-v2/presets"
import { Button } from "@/components/ui/button"
import type { BlockConfig } from "@/lib/grid-v2"
import { DataProviderProvider } from "@/lib/data/context"

const formatPageName = (pageId: string) =>
  pageId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())

export default function DynamicPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.pageId as string
  const storageKey = useMemo(() => `page-${pageId}`, [pageId])
  const pageTitle = pageId === "v2" ? "Dashboard V2" : formatPageName(pageId)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<BlockConfig | null>(null)
  const [slotEditModalOpen, setSlotEditModalOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<{
    blockId: string
    slotId: string
    blockType: string
    slotDefinition?: any
  } | null>(null)

  const initialState = useMemo(() => {
    const preset = getPreset(pageId)
    if (preset) {
      if (preset.blocks.overview && pageId !== "onboarding") {
        preset.blocks.overview.title = `${pageTitle} Overview`
      }
      return preset
    }
    return createBlankPreset(pageTitle)
  }, [pageId, pageTitle])

  const {
    state,
    draggedBlock,
    dragPreview,
    gridRef,
    maxY,
    toggleMode,
    addBlock,
    deleteBlock,
    extendBlock,
    updateBlock,
    setBlockConfig,
    setBlockProps,
    replaceBlockType,
    toggleBlockCollapse,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleResizeStart,
  } = useGrid(initialState, storageKey)

  const handleOpenEditModal = (blockId: string) => {
    const block = state.blocks[blockId]
    if (!block) return
    setEditingBlock(block)
    setEditModalOpen(true)
  }

  const handleReplaceBlock = (next: BlockConfig) => {
    if (!editingBlock) return
    const targetId = editingBlock.id
    setBlockConfig(targetId, { ...next, id: targetId })
    setEditingBlock(null)
    setEditModalOpen(false)
  }

  const handleAddExtension = (next: BlockConfig) => {
    if (!editingBlock) return
    extendBlock(editingBlock.id, next)
  }

  const handleSlotClick = (blockId: string, slotId: string) => {
    const block = state.blocks[blockId]
    if (!block) return

    const blockDefinition = getBlockDefinition(block.type)
    const slotDefinition = blockDefinition?.slots?.find((slot) => slot.id === slotId)

    setEditingSlot({ blockId, slotId, blockType: block.type, slotDefinition })
    setSlotEditModalOpen(true)
  }

  const handleSlotBlockReplace = (next: BlockConfig) => {
    if (!editingSlot) return

    const block = state.blocks[editingSlot.blockId]
    if (!block) return

    const nextSlots = {
      ...(block.slots || {}),
      [editingSlot.slotId]: next,
    }

    updateBlock(editingSlot.blockId, { slots: nextSlots })
    setSlotEditModalOpen(false)
    setEditingSlot(null)
  }

  const handleAddBlock = () => {
    const newBlock = createBlockConfig("note")
    addBlock(newBlock)
  }

  const actionButtons = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <Link href="/pages">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => router.refresh()}>
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={toggleMode} className="gap-2">
          <Settings className="h-4 w-4" />
          {state.mode === "edit" ? "View Mode" : "Edit Mode"}
        </Button>
      </div>
    ),
    [router, state.mode, toggleMode],
  )

  return (
    <DataProviderProvider>
      <LayoutScaffold pageTitle={pageTitle} pageSubtext="Custom page builder" actions={actionButtons} className="h-screen">
        <div className="space-y-6">
          <GridSurface
            ref={gridRef}
            mode={state.mode}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            maxY={maxY}
            dragPreview={dragPreview}
            className="relative"
          >
            {state.layout.map((item) => {
              const block = state.blocks[item.i]
              if (!block) return null

              const definition = getBlockDefinition(block.type)

              const controls = (
                <QuickEditControls
                  block={block}
                  definition={definition}
                  onVariantChange={(variantType) => replaceBlockType(item.i, variantType)}
                  onPropChange={(partial) => {
                    const nextProps = { ...(block.props || {}), ...partial }
                    updateBlock(item.i, { props: nextProps })
                  }}
                  onToggleSize={() => toggleBlockCollapse(item.i)}
                  onOpenFullEdit={() => handleOpenEditModal(item.i)}
                  onDataSourceChange={(source) => {
                    const definition = getBlockDefinition(block.type)
                    const preserveKeys = ["timeRange", "density"] as const
                    const preserved = preserveKeys.reduce<Record<string, unknown>>((acc, key) => {
                      if (block.props && key in (block.props as Record<string, unknown>)) {
                        acc[key] = (block.props as Record<string, unknown>)[key]
                      }
                      return acc
                    }, {})

                    if (source) {
                      const mockProps = getMockPropsForSource(block.type, source) || {}
                      setBlockProps(item.i, { ...mockProps, ...preserved, source })
                      return
                    }

                    const defaults = definition?.defaultProps ? { ...definition.defaultProps } : undefined
                    if (defaults) {
                      setBlockProps(item.i, { ...defaults, ...preserved })
                    } else {
                      setBlockProps(item.i, preserved)
                    }
                  }}
                  onExtend={undefined}
                  onDelete={state.mode === "edit" ? () => deleteBlock(item.i) : undefined}
                />
              )

              const enhancedBlock = {
                ...block,
                props: {
                  ...block.props,
                  isEditMode: state.mode === "edit",
                  onSlotClick: (slotId: string) => handleSlotClick(item.i, slotId),
                },
              }

              return (
                <BlockShell
                  key={item.i}
                  blockId={item.i}
                  title={block.title || "Untitled"}
                  mode={state.mode}
                  gridPos={item}
                  draggedBlock={draggedBlock}
                  onDragStart={handleDragStart}
                  onResizeStart={handleResizeStart}
                  controls={state.mode === "edit" ? controls : undefined}
                  onToggleCollapse={state.mode === "edit" ? toggleBlockCollapse : undefined}
                >
                  <BlockRenderer block={enhancedBlock} />
                </BlockShell>
              )
            })}
          </GridSurface>

          {state.mode === "edit" && (
            <div
              className="border-2 border-dashed border-muted-foreground/25 p-12 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={handleAddBlock}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">＋</span>
                <span className="text-sm text-muted-foreground">Add Block</span>
              </div>
            </div>
          )}
        </div>

        <V2BlockEditModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setEditingBlock(null)
          }}
          block={editingBlock}
          onReplace={handleReplaceBlock}
          onAddExtension={handleAddExtension}
        />

       <SlotEditModal
         open={slotEditModalOpen}
         slotInfo={editingSlot}
          onClose={() => {
            setSlotEditModalOpen(false)
            setEditingSlot(null)
          }}
          onReplace={handleSlotBlockReplace}
        />
      </LayoutScaffold>
    </DataProviderProvider>
  )
}
