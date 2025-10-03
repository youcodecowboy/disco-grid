import type { Block } from "@/app/page"

interface DataRow {
  name: string
  value: string
  updated: string
}

interface Props {
  block: Block
  isEditing?: boolean
}

export default function TableGeneric({ block, isEditing = false }: Props) {
  const data = block.props?.data || []
  const source = block.props?.source as string | undefined

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white ring-1 ring-slate-200">
      {(block.title || source || isEditing) && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            {block.title && <h3 className="text-sm font-semibold text-slate-900">{block.title}</h3>}
            {source && <p className="text-xs text-slate-500">{source}</p>}
          </div>
          {isEditing && (
            <span className="text-xs text-slate-400">Structured data source</span>
          )}
        </div>
      )}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-3 gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 border-b border-slate-200 pb-2">
          <div>Name</div>
          <div>Value</div>
          <div>Updated</div>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-4 pb-4">
        <div className="space-y-2">
          {data.map((row: DataRow, i: number) => (
            <div key={i} className="grid grid-cols-3 gap-2 text-sm text-slate-700">
              <div className="truncate font-medium text-slate-900">{row.name}</div>
              <div className="truncate">{row.value}</div>
              <div className="text-xs text-slate-500">{row.updated}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
