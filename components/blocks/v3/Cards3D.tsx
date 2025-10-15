"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Card3DItem {
  id: string
  title: string
  subtitle?: string
  value: string
  icon?: string
  color: string
  gradient: string
}

interface Cards3DV3Props {
  title?: string
  cards?: Card3DItem[]
}

// Generate default 3D card data
function generateDefaultCards(): Card3DItem[] {
  return [
    {
      id: '1',
      title: 'Total Revenue',
      subtitle: 'Last 30 Days',
      value: '$125,430',
      icon: '💰',
      color: 'from-blue-500 to-blue-700',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-700'
    },
    {
      id: '2',
      title: 'Active Users',
      subtitle: 'Currently Online',
      value: '12,543',
      icon: '👥',
      color: 'from-emerald-500 to-emerald-700',
      gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-700'
    },
    {
      id: '3',
      title: 'Completed Tasks',
      subtitle: 'This Week',
      value: '487',
      icon: '✓',
      color: 'from-purple-500 to-purple-700',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-700'
    },
    {
      id: '4',
      title: 'New Orders',
      subtitle: 'Awaiting Processing',
      value: '89',
      icon: '📦',
      color: 'from-orange-500 to-orange-700',
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-700'
    },
    {
      id: '5',
      title: 'Customer Satisfaction',
      subtitle: 'Average Rating',
      value: '4.8/5',
      icon: '⭐',
      color: 'from-amber-500 to-amber-700',
      gradient: 'bg-gradient-to-br from-amber-500 to-amber-700'
    }
  ]
}

export default function Cards3DV3({ title, cards }: Cards3DV3Props) {
  const cardData = cards || generateDefaultCards()
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const selectedCardData = cardData.find(c => c.id === selectedCard)

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}

      {/* 3D Card Stack */}
      <div className="flex-1 p-8 overflow-auto perspective-1000">
        <div className="relative h-full flex items-center justify-center">
          {/* Cards in 3D stack */}
          <div className="relative w-full max-w-md h-64">
            {cardData.map((card, index) => {
              const isSelected = selectedCard === card.id
              const isHovered = hoveredCard === card.id
              const totalCards = cardData.length
              const stackOffset = (totalCards - index - 1) * 8
              const rotateOffset = (totalCards - index - 1) * 2
              const zIndex = isSelected ? 1000 : totalCards - index

              return (
                <motion.div
                  key={card.id}
                  className={`absolute inset-0 cursor-pointer rounded-2xl shadow-2xl ${card.gradient} text-white
                           ${isSelected ? 'z-50' : ''}`}
                  style={{
                    zIndex,
                    transformStyle: 'preserve-3d',
                  }}
                  initial={{
                    y: stackOffset,
                    rotateX: -rotateOffset,
                    scale: 1 - (index * 0.05)
                  }}
                  animate={{
                    y: isSelected ? -50 : (isHovered ? stackOffset - 10 : stackOffset),
                    rotateX: isSelected ? 0 : -rotateOffset,
                    scale: isSelected ? 1.1 : (isHovered ? 1 - (index * 0.05) + 0.02 : 1 - (index * 0.05)),
                    rotateY: isSelected ? 0 : 0,
                    z: isSelected ? 100 : 0
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }}
                  whileHover={{
                    scale: isSelected ? 1.1 : 1 - (index * 0.05) + 0.05,
                  }}
                  onClick={() => setSelectedCard(isSelected ? null : card.id)}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card Content */}
                  <div className="h-full p-8 flex flex-col justify-between relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                                       radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                      }} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      {card.icon && (
                        <motion.div
                          className="text-5xl mb-4"
                          animate={{
                            scale: isSelected ? [1, 1.2, 1] : 1,
                            rotate: isSelected ? [0, 360] : 0
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          {card.icon}
                        </motion.div>
                      )}

                      {/* Title */}
                      <h4 className="text-xl font-bold mb-1">{card.title}</h4>
                      {card.subtitle && (
                        <p className="text-sm opacity-90">{card.subtitle}</p>
                      )}
                    </div>

                    {/* Value */}
                    <motion.div
                      className="text-5xl font-bold relative z-10"
                      animate={{
                        scale: isSelected ? 1.1 : 1
                      }}
                    >
                      {card.value}
                    </motion.div>

                    {/* Shine effect on hover */}
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                    )}

                    {/* Selected indicator */}
                    {isSelected && (
                      <motion.div
                        className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                      >
                        <span className="text-2xl">✓</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Detail Panel (when card is selected) */}
          <AnimatePresence>
            {selectedCardData && (
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-64 bg-white rounded-lg shadow-2xl p-6"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold text-slate-900">Details</h4>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Metric</p>
                    <p className="text-xl font-bold text-slate-900">{selectedCardData.title}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-1">Current Value</p>
                    <p className="text-3xl font-bold text-slate-900">{selectedCardData.value}</p>
                  </div>

                  {selectedCardData.subtitle && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Period</p>
                      <p className="text-base text-slate-700">{selectedCardData.subtitle}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Click the card again to close this panel
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
          <span>💡 Click on any card to view details</span>
          <span>•</span>
          <span>Hover to preview</span>
        </div>
      </div>
    </div>
  )
}


