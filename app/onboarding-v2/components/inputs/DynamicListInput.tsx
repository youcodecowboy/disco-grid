/**
 * Dynamic List Input Component
 * 
 * Beautiful "Lego-style" additive UI for building lists
 * User types value, "+" button appears, click to add more
 */

'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DynamicListInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  label?: string;
  helper?: string;
}

export function DynamicListInput({
  value = [],
  onChange,
  placeholder = "Add item...",
  maxItems = 20,
  label,
  helper,
}: DynamicListInputProps) {
  const [currentInput, setCurrentInput] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  
  const handleAdd = () => {
    if (currentInput.trim() && value.length < maxItems) {
      onChange([...value, currentInput.trim()]);
      setCurrentInput('');
    }
  };
  
  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };
  
  return (
    <div className="space-y-3">
      {label && (
        <div>
          <label className="text-sm font-medium text-slate-900">{label}</label>
          {helper && <p className="text-xs text-slate-500 mt-1">{helper}</p>}
        </div>
      )}
      
      {/* Existing items as pills */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {value.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="group relative"
              >
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                  <span className="text-sm font-medium">{item}</span>
                  <button
                    onClick={() => handleRemove(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-blue-200 rounded"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Input for new item */}
      {value.length < maxItems && (
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm"
            />
          </div>
          
          <motion.button
            type="button"
            onClick={handleAdd}
            disabled={!currentInput.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center h-10 w-10 rounded-lg transition-all ${
              currentInput.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Plus className="h-5 w-5" />
          </motion.button>
        </div>
      )}
      
      {/* Item count */}
      {value.length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{value.length} {value.length === 1 ? 'item' : 'items'} added</span>
          {maxItems && value.length < maxItems && (
            <span>Up to {maxItems - value.length} more</span>
          )}
        </div>
      )}
    </div>
  );
}

