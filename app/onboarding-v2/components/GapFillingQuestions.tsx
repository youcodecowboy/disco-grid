"use client"

/**
 * Gap-Filling Questions Component
 * 
 * Dynamically generated questions to fill missing required contract fields.
 * Uses LLM to create natural, contextual questions for any gaps.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import type { ContractField } from '../lib/contract-completeness';
import { generateGapFillingQuestions } from '../lib/contract-completeness';

interface GapFillingQuestionsProps {
  missingFields: ContractField[];
  onAnswersProvided: (answers: Record<string, any>) => void;
  onSkip: () => void;
}

export function GapFillingQuestions({ 
  missingFields, 
  onAnswersProvided,
  onSkip 
}: GapFillingQuestionsProps) {
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  
  const gapQuestions = generateGapFillingQuestions(missingFields);
  const currentQuestion = gapQuestions[currentFieldIndex];
  const isLastQuestion = currentFieldIndex === gapQuestions.length - 1;
  
  // Handle answer submission
  const handleAnswer = (value: any) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.fieldPath]: value,
    };
    setAnswers(newAnswers);
    
    if (isLastQuestion) {
      // All gaps filled - submit
      onAnswersProvided(newAnswers);
    } else {
      // Move to next gap question
      setCurrentFieldIndex(prev => prev + 1);
    }
  };
  
  if (missingFields.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          All Set!
        </h3>
        <p className="text-gray-600">
          We have everything we need to build your personalized workspace.
        </p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 mb-4">
          <Sparkles className="h-4 w-4" />
          <span>Smart Gap Filling</span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Just a few more details
        </h2>
        <p className="text-gray-600">
          Question {currentFieldIndex + 1} of {gapQuestions.length}
        </p>
      </div>
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentFieldIndex + 1) / gapQuestions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      {/* Current question */}
      <motion.div
        key={currentFieldIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentQuestion.question}
          </h3>
          <p className="text-sm text-gray-600">
            {currentQuestion.helper}
          </p>
        </div>
        
        {/* Input based on field type */}
        <GapQuestionInput
          fieldPath={currentQuestion.fieldPath}
          onAnswer={handleAnswer}
        />
        
        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip remaining questions
          </button>
          
          {currentFieldIndex > 0 && (
            <button
              onClick={() => setCurrentFieldIndex(prev => prev - 1)}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          )}
        </div>
      </motion.div>
      
      {/* Preview filled answers */}
      {Object.keys(answers).length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                {Object.keys(answers).length} {Object.keys(answers).length === 1 ? 'field' : 'fields'} filled
              </p>
              <p className="text-xs text-green-700 mt-1">
                Your answers are being saved automatically
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Dynamic input component based on field type
 */
function GapQuestionInput({ 
  fieldPath, 
  onAnswer 
}: { 
  fieldPath: string; 
  onAnswer: (value: any) => void;
}) {
  const [value, setValue] = useState('');
  
  const handleSubmit = () => {
    if (!value.trim()) return;
    onAnswer(value);
    setValue('');
  };
  
  // For now, simple text input
  // TODO: Add specialized inputs for different field types
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={3}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.metaKey) {
            handleSubmit();
          }
        }}
      />
      
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Press ⌘+Enter to submit
        </span>
        
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

