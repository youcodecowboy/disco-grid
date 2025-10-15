"use client"

interface DataTableV3Props {
  title?: string
  columns?: string[]
  rows?: string[][]
}

export default function DataTableV3({ title, columns = [], rows = [] }: DataTableV3Props) {
  if (columns.length === 0 || rows.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-slate-500 text-sm">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-slate-50 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-slate-900"
                  >
                    {cellIndex === 0 ? (
                      <span className="font-semibold text-blue-600">{cell}</span>
                    ) : cellIndex === 2 ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cell.toLowerCase().includes('complete') || cell.toLowerCase().includes('ship')
                          ? 'bg-emerald-100 text-emerald-800'
                          : cell.toLowerCase().includes('production') || cell.toLowerCase().includes('cutting')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cell}
                      </span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with count */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{rows.length}</span> {rows.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>
    </div>
  )
}


