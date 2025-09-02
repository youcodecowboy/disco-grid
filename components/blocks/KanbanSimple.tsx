import type { Block } from "@/app/page"

interface KanbanItem {
  id: string
  title: string
  meta: string
}

interface KanbanColumn {
  title: string
  items: KanbanItem[]
}

interface Props {
  block: Block
}

export default function KanbanSimple({ block }: Props) {
  const { columns = [] } = block.props || {}

  return (
    <div className="p-4 grid grid-cols-3 gap-4 h-full">
      {columns.map((column: KanbanColumn, i: number) => (
        <div key={i} className="flex flex-col">
          <div className="text-xs font-medium text-muted-foreground mb-2 pb-1 border-b">
            {column.title} ({column.items.length})
          </div>
          <div className="space-y-2 flex-1">
            {column.items.map((item: KanbanItem) => (
              <div key={item.id} className="p-2 bg-muted/30 rounded border text-xs">
                <div className="font-medium mb-1">{item.title}</div>
                <div className="text-muted-foreground">{item.meta}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
