"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface KanbanCard {
  id: string
  title: string
  description?: string
  assignee?: string
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
}

interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
  color: string
}

interface KanbanV3Props {
  title?: string
  columns?: KanbanColumn[]
}

// Generate default kanban data
function generateDefaultColumns(): KanbanColumn[] {
  return [
    {
      id: 'todo',
      title: 'To Do',
      color: 'slate',
      cards: [
        { id: '1', title: 'Design new landing page', assignee: 'Sarah J.', priority: 'high', tags: ['Design', 'UI'] },
        { id: '2', title: 'Update documentation', assignee: 'Mike W.', priority: 'medium', tags: ['Docs'] },
        { id: '3', title: 'Client meeting prep', assignee: 'Emily C.', priority: 'high', tags: ['Meeting'] },
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'blue',
      cards: [
        { id: '4', title: 'Implement payment gateway', assignee: 'David M.', priority: 'high', tags: ['Backend', 'API'] },
        { id: '5', title: 'Mobile app testing', assignee: 'Lisa P.', priority: 'medium', tags: ['QA', 'Mobile'] },
      ]
    },
    {
      id: 'review',
      title: 'Review',
      color: 'amber',
      cards: [
        { id: '6', title: 'Homepage redesign', assignee: 'Sarah J.', priority: 'medium', tags: ['Design', 'Review'] },
        { id: '7', title: 'API optimization', assignee: 'Mike W.', priority: 'low', tags: ['Backend'] },
      ]
    },
    {
      id: 'done',
      title: 'Done',
      color: 'emerald',
      cards: [
        { id: '8', title: 'Database migration', assignee: 'David M.', priority: 'high', tags: ['Backend', 'DB'] },
        { id: '9', title: 'User authentication', assignee: 'Emily C.', priority: 'high', tags: ['Auth'] },
        { id: '10', title: 'Email templates', assignee: 'Lisa P.', priority: 'low', tags: ['Frontend'] },
      ]
    },
  ]
}

const priorityConfig = {
  low: { color: 'text-slate-600', bg: 'bg-slate-100', label: 'Low' },
  medium: { color: 'text-amber-700', bg: 'bg-amber-100', label: 'Med' },
  high: { color: 'text-red-700', bg: 'bg-red-100', label: 'High' }
}

const columnColorConfig = {
  slate: { bg: 'bg-slate-100', border: 'border-slate-300', header: 'bg-slate-200' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-300', header: 'bg-blue-100' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-300', header: 'bg-amber-100' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-300', header: 'bg-emerald-100' },
}

export default function KanbanV3({ title, columns }: KanbanV3Props) {
  const kanbanColumns = columns || generateDefaultColumns()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  // Calculate stats
  const totalCards = kanbanColumns.reduce((sum, col) => sum + col.cards.length, 0)
  const completedCards = kanbanColumns.find(col => col.id === 'done')?.cards.length || 0
  const completionRate = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-slate-600">
                {completedCards} / {totalCards} Complete
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
                <span className="font-semibold text-slate-900">{completionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex gap-4 p-6 min-w-max">
          {kanbanColumns.map((column, colIndex) => {
            const colorConfig = columnColorConfig[column.color as keyof typeof columnColorConfig] || columnColorConfig.slate

            return (
              <div
                key={column.id}
                className="flex flex-col w-80 flex-shrink-0"
              >
                {/* Column Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: colIndex * 0.1 }}
                  className={`${colorConfig.header} rounded-t-lg px-4 py-3 border-2 ${colorConfig.border} border-b-0`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{column.title}</h4>
                    <span className="text-sm font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full">
                      {column.cards.length}
                    </span>
                  </div>
                </motion.div>

                {/* Cards Container */}
                <div className={`flex-1 ${colorConfig.bg} border-2 ${colorConfig.border} border-t-0 rounded-b-lg p-3 space-y-3 overflow-y-auto`}>
                  <AnimatePresence>
                    {column.cards.map((card, cardIndex) => {
                      const isHovered = hoveredCard === card.id

                      return (
                        <motion.div
                          key={card.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: (colIndex * 0.1) + (cardIndex * 0.05) }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm cursor-move
                                   hover:shadow-md transition-shadow"
                          onMouseEnter={() => setHoveredCard(card.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h5 className="font-semibold text-slate-900 text-sm flex-1">
                              {card.title}
                            </h5>
                            {card.priority && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                             ${priorityConfig[card.priority].bg}
                                             ${priorityConfig[card.priority].color}`}>
                                {priorityConfig[card.priority].label}
                              </span>
                            )}
                          </div>

                          {/* Card Description */}
                          {card.description && (
                            <p className="text-xs text-slate-600 mb-3">
                              {card.description}
                            </p>
                          )}

                          {/* Card Footer */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                            {/* Tags */}
                            {card.tags && card.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {card.tags.slice(0, 2).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Assignee */}
                            {card.assignee && (
                              <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 
                                             flex items-center justify-center text-xs font-bold text-white">
                                  {card.assignee.split(' ').map(n => n[0]).join('')}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Drag indicator (show on hover) */}
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute top-2 right-2"
                            >
                              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                              </svg>
                            </motion.div>
                          )}
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>

                  {/* Empty state */}
                  {column.cards.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm">
                      No cards in this column
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


