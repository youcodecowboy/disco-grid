'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface TableCell {
  value: string
}

interface TableRow {
  id: string
  cells: TableCell[]
}

interface TableData {
  columns: string[]
  rows: TableRow[]
}

interface EditableTableProps {
  data: TableData
  onChange: (data: TableData) => void
}

export default function EditableTable({ data, onChange }: EditableTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...data.rows]
    newRows[rowIndex].cells[colIndex] = { value }
    onChange({ ...data, rows: newRows })
  }

  const handleColumnNameChange = (colIndex: number, value: string) => {
    const newColumns = [...data.columns]
    newColumns[colIndex] = value
    onChange({ ...data, columns: newColumns })
  }

  const handleAddRow = () => {
    const newRow: TableRow = {
      id: `row-${Date.now()}`,
      cells: data.columns.map(() => ({ value: '' }))
    }
    onChange({ ...data, rows: [...data.rows, newRow] })
  }

  const handleAddColumn = () => {
    const newColumns = [...data.columns, `Column ${data.columns.length + 1}`]
    const newRows = data.rows.map(row => ({
      ...row,
      cells: [...row.cells, { value: '' }]
    }))
    onChange({ columns: newColumns, rows: newRows })
  }

  const handleRemoveRow = (rowIndex: number) => {
    if (data.rows.length === 1) return // Keep at least one row
    const newRows = data.rows.filter((_, i) => i !== rowIndex)
    onChange({ ...data, rows: newRows })
  }

  const handleRemoveColumn = (colIndex: number) => {
    if (data.columns.length === 1) return // Keep at least one column
    const newColumns = data.columns.filter((_, i) => i !== colIndex)
    const newRows = data.rows.map(row => ({
      ...row,
      cells: row.cells.filter((_, i) => i !== colIndex)
    }))
    onChange({ columns: newColumns, rows: newRows })
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-8"></th>
              {data.columns.map((column, colIndex) => (
                <th
                  key={colIndex}
                  className="relative group"
                  onMouseEnter={() => setHoveredCol(colIndex)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  <div className="flex items-center justify-between p-2 border border-slate-200 bg-slate-50 min-w-[120px]">
                    <input
                      type="text"
                      value={column}
                      onChange={(e) => handleColumnNameChange(colIndex, e.target.value)}
                      className="flex-1 text-sm font-semibold text-slate-700 bg-transparent border-none outline-none"
                      placeholder="Column name"
                    />
                    {hoveredCol === colIndex && data.columns.length > 1 && (
                      <button
                        onClick={() => handleRemoveColumn(colIndex)}
                        className="ml-2 p-1 hover:bg-slate-200 rounded transition-colors"
                        title="Remove column"
                      >
                        <Trash2 className="h-3 w-3 text-slate-500" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-12 border border-slate-200 bg-slate-50">
                <button
                  onClick={handleAddColumn}
                  className="w-full p-2 hover:bg-slate-100 transition-colors"
                  title="Add column"
                >
                  <Plus className="h-4 w-4 text-slate-400 mx-auto" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className="group"
                onMouseEnter={() => setHoveredRow(rowIndex)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="w-8 border border-slate-200 bg-slate-50 text-center">
                  <div className="flex items-center justify-center">
                    <GripVertical className="h-3 w-3 text-slate-300" />
                    {hoveredRow === rowIndex && data.rows.length > 1 && (
                      <button
                        onClick={() => handleRemoveRow(rowIndex)}
                        className="ml-1 p-0.5 hover:bg-slate-200 rounded transition-colors"
                        title="Remove row"
                      >
                        <Trash2 className="h-3 w-3 text-slate-500" />
                      </button>
                    )}
                  </div>
                </td>
                {row.cells.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-slate-200 p-0">
                    <input
                      type="text"
                      value={cell.value}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      className="w-full p-2 text-sm text-slate-900 bg-transparent border-none outline-none focus:bg-slate-50 min-w-[120px]"
                      placeholder="Enter value"
                    />
                  </td>
                ))}
                <td className="w-12 border border-slate-200"></td>
              </tr>
            ))}
            <tr>
              <td className="border border-slate-200 bg-slate-50"></td>
              {data.columns.map((_, colIndex) => (
                <td key={colIndex} className="border border-slate-200 bg-slate-50"></td>
              ))}
              <td className="w-12 border border-slate-200 bg-slate-50">
                <button
                  onClick={handleAddRow}
                  className="w-full p-2 hover:bg-slate-100 transition-colors"
                  title="Add row"
                >
                  <Plus className="h-4 w-4 text-slate-400 mx-auto" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Quick actions */}
      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={handleAddRow}
          className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add row
        </button>
        <button
          onClick={handleAddColumn}
          className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add column
        </button>
        <span className="ml-auto text-slate-400">
          {data.rows.length} rows × {data.columns.length} columns
        </span>
      </div>
    </div>
  )
}

