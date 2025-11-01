'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { MOCK_DATA_SOURCES } from '@/lib/dashboard-generation/questions'

interface DataSourcePickerProps {
  onSelect: (selected: string[]) => void
  multiSelect?: boolean
  selected?: string[]
}

export function DataSourcePicker({ 
  onSelect, 
  multiSelect = true,
  selected = []
}: DataSourcePickerProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>(selected)

  const handleToggle = (value: string) => {
    let newSelected: string[]
    
    if (multiSelect) {
      if (selectedSources.includes(value)) {
        newSelected = selectedSources.filter(s => s !== value)
      } else {
        newSelected = [...selectedSources, value]
      }
    } else {
      newSelected = [value]
    }
    
    setSelectedSources(newSelected)
    onSelect(newSelected)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {MOCK_DATA_SOURCES.map((source) => {
        const isSelected = selectedSources.includes(source.value)
        
        return (
          <motion.button
            key={source.value}
            onClick={() => handleToggle(source.value)}
            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Selection indicator */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
            
            {/* Icon */}
            <div className="text-3xl mb-2">{source.icon}</div>
            
            {/* Label */}
            <div className="font-medium text-sm text-gray-900 mb-1">
              {source.label}
            </div>
            
            {/* Description */}
            <div className="text-xs text-gray-500">
              {source.description}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}







