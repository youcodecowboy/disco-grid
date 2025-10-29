/**
 * Enriched Text Input Component
 * 
 * Pattern: Short Answer → Clarifying Question → AI Enrichment → Confirm
 * Shows AI-generated context in blue, allows user to confirm or edit
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Edit2, Loader2 } from 'lucide-react';

interface EnrichedTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  helper?: string;
  industry?: string;
  clarificationOptions?: {
    question: string;
    options: Array<{ value: string; label: string }>;
  };
  minLength?: number;
}

export function EnrichedTextInput({
  value,
  onChange,
  placeholder = "Tell us more...",
  label,
  helper,
  industry = "manufacturing",
  clarificationOptions,
  minLength = 10,
}: EnrichedTextInputProps) {
  const [originalText, setOriginalText] = useState('');
  const [enrichedText, setEnrichedText] = useState('');
  const [showClarification, setShowClarification] = useState(false);
  const [selectedClarification, setSelectedClarification] = useState<string | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [enrichmentParts, setEnrichmentParts] = useState<{ text: string; isAI: boolean }[]>([]);
  
  const handleBlur = () => {
    // Check if text is short/vague and we have clarification options
    if (
      value.trim().length >= minLength &&
      value.trim().length < 100 &&
      clarificationOptions &&
      !enrichedText
    ) {
      setOriginalText(value);
      setShowClarification(true);
    }
  };
  
  const handleClarificationSelect = async (clarificationValue: string) => {
    setSelectedClarification(clarificationValue);
    setShowClarification(false);
    setIsEnriching(true);
    
    try {
      // Call enrichment API
      const response = await fetch('/api/nlp/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText: originalText,
          clarification: clarificationValue,
          industry: industry,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Enrichment failed');
      }
      
      const data = await response.json();
      
      if (data.success && data.enrichedText) {
        setEnrichedText(data.enrichedText);
        setEnrichmentParts(data.parts || []);
        onChange(data.enrichedText);
        setIsEditing(false);
      } else {
        throw new Error('No enriched text returned');
      }
    } catch (error) {
      console.error('Enrichment error:', error);
      // Fallback: just use original text
      setEnrichedText(originalText);
      onChange(originalText);
      setIsEditing(false);
    } finally {
      setIsEnriching(false);
    }
  };
  
  const handleConfirm = () => {
    setIsEditing(false);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setEnrichedText('');
    setEnrichmentParts([]);
  };
  
  const handleSkipEnrichment = () => {
    setShowClarification(false);
    setEnrichedText(originalText);
    onChange(originalText);
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-3">
      {label && (
        <div>
          <label className="text-sm font-medium text-slate-900">{label}</label>
          {helper && <p className="text-xs text-slate-500 mt-1">{helper}</p>}
        </div>
      )}
      
      {/* Loading state */}
      {isEnriching && (
        <div className="flex items-center justify-center py-8 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="flex items-center gap-3 text-blue-700">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">AI is enhancing your answer...</span>
          </div>
        </div>
      )}
      
      {/* Clarification options */}
      <AnimatePresence>
        {showClarification && clarificationOptions && !isEnriching && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-900">{clarificationOptions.question}</p>
                <p className="text-xs text-purple-700 mt-1">This helps us provide better context</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {clarificationOptions.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleClarificationSelect(option.value)}
                  className="px-4 py-2 bg-white hover:bg-purple-100 border-2 border-purple-300 rounded-lg text-sm font-medium text-purple-900 transition-colors"
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleSkipEnrichment}
              className="text-xs text-purple-600 hover:text-purple-700 mt-3 underline"
              type="button"
            >
              Skip this step
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Input/Display area */}
      {!isEnriching && (
        <>
          {isEditing ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={handleBlur}
              placeholder={placeholder}
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm resize-none"
            />
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-900 uppercase tracking-wide">AI Enhanced</span>
                </div>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-800 font-medium"
                  type="button"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </button>
              </div>
              
              <div className="text-sm leading-relaxed">
                {enrichmentParts.length > 0 ? (
                  enrichmentParts.map((part, index) => (
                    <span
                      key={index}
                      className={part.isAI ? 'text-blue-700 font-medium' : 'text-slate-900'}
                    >
                      {part.text}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-900">{enrichedText || value}</span>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Confirmation button */}
      {isEditing && value.trim().length >= minLength && !showClarification && !enrichedText && (
        <button
          onClick={handleConfirm}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          type="button"
        >
          <Check className="h-4 w-4" />
          Looks good
        </button>
      )}
    </div>
  );
}

