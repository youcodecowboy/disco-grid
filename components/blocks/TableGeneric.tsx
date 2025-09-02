import type { Block } from "@/app/page"

interface DataRow {
  name: string
  value: string
  updated: string
}

interface Props {
  block: Block
}

export default function TableGeneric({ block }: Props) {
  const data = block.props?.data || []

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
        <div>Name</div>
        <div>Value</div>
        <div>Updated</div>
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {data.map((row: DataRow, i: number) => (
          <div key={i} className="grid grid-cols-3 gap-2 text-xs">
            <div className="truncate">{row.name}</div>
            <div className="font-medium">{row.value}</div>
            <div className="text-muted-foreground">{row.updated}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
