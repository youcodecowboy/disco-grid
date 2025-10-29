/**
 * Dynamic Follow-Up Questions Component
 * 
 * Subtle, optional questions that appear above entity confirmation
 * to help enrich the data without feeling mandatory
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import type { EntityExtraction } from '../lib/nlp.intents';

interface FollowUpQuestion {
  id: string;
  question: string;
  entityType: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  allowOther: boolean;
  multiSelect?: boolean;
  triggeredBy?: string;
}

interface QuestionAnswer {
  questionId: string;
  answer: string | string[];
  isOther?: boolean;
}

interface DynamicFollowUpQuestionsProps {
  extractedEntities: EntityExtraction[];
  industry: string;
  onComplete: (answers: QuestionAnswer[], newEntities: EntityExtraction[]) => void;
}

export function DynamicFollowUpQuestions({
  extractedEntities,
  industry,
  onComplete,
}: DynamicFollowUpQuestionsProps) {
  const [questions, setQuestions] = useState<FollowUpQuestion[]>([]);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [otherInput, setOtherInput] = useState<{ [key: string]: string }>({});
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({});
  const [dismissed, setDismissed] = useState(false);

  // Load initial questions on mount
  useEffect(() => {
    loadFollowUpQuestions();
  }, []);

  const loadFollowUpQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/nlp/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entities: extractedEntities,
          industry,
          previousAnswers: answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to load follow-up questions');
      }

      const data = await response.json();
      
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        // No follow-up questions needed
        onComplete([], []);
      }
    } catch (error) {
      console.error('Error loading follow-up questions:', error);
      // Fallback: no questions, just complete
      onComplete([], []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (questionId: string, answer: string | string[], isOther: boolean = false) => {
    const newAnswer: QuestionAnswer = {
      questionId,
      answer,
      isOther,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // Convert this single answer to entity and update parent immediately
    const currentQuestion = questions.find(q => q.id === questionId);
    if (currentQuestion) {
      const singleEntity = answerToEntity(newAnswer, currentQuestion, industry);
      if (singleEntity) {
        // Call onComplete with this single new entity (adds to confirmation in real-time)
        onComplete([newAnswer], [singleEntity]);
      }
    }

    // Check if this answer should trigger more questions
    setIsGeneratingMore(true);
    try {
      const response = await fetch('/api/nlp/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entities: extractedEntities,
          industry,
          previousAnswers: updatedAnswers,
          triggeredBy: questionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.questions && data.questions.length > 0) {
          const newQuestions = data.questions.map((q: FollowUpQuestion) => ({
            ...q,
            triggeredBy: questionId,
          }));
          
          const updatedQuestions = [
            ...questions.slice(0, currentQuestionIndex + 1),
            ...newQuestions,
            ...questions.slice(currentQuestionIndex + 1),
          ];
          
          setQuestions(updatedQuestions);
        }
      }
    } catch (error) {
      console.error('Error generating follow-up questions:', error);
    } finally {
      setIsGeneratingMore(false);
    }

    // Move to next question or add final open-ended question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Check if we already added the final question
      const hasFinalQuestion = questions.some(q => q.id === 'final_anything_else');
      
      if (!hasFinalQuestion) {
        // Add final open-ended question
        const finalQuestion: FollowUpQuestion = {
          id: 'final_anything_else',
          question: 'Is there anything else you\'d like to tell us about your operations?',
          entityType: 'additional_info',
          options: [],
          allowOther: true,
          multiSelect: false,
        };
        
        setQuestions([...questions, finalQuestion]);
        setCurrentQuestionIndex(questions.length); // Move to the new final question
      } else {
        // User answered the final question - dismiss with thank you
        setTimeout(() => {
          setDismissed(true);
          onComplete(updatedAnswers, []);
        }, 300);
      }
    }
  };

  // Handle "Other" custom text input - extract entities via LLM and generate more follow-ups
  const handleOtherAnswer = async (questionId: string, customText: string) => {
    try {
      // Step 1: Extract entities from custom text using LLM
      const extractResponse = await fetch('/api/nlp/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: customText,
          context: 'follow_up_other',
          industry,
        }),
      });

      if (extractResponse.ok) {
        const extractData = await extractResponse.json();
        
        // Add extracted entities to confirmation
        if (extractData.entities && extractData.entities.length > 0) {
          extractData.entities.forEach((entity: any) => {
            onComplete([], [entity]);
          });
        }
      }

      // Step 2: Store the answer
      const newAnswer: QuestionAnswer = {
        questionId,
        answer: customText,
        isOther: true,
      };
      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);

      // Step 3: Generate more follow-up questions based on this answer
      const followUpResponse = await fetch('/api/nlp/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entities: extractedEntities,
          industry,
          previousAnswers: updatedAnswers,
          triggeredBy: questionId,
          customText, // Send the custom text for analysis
        }),
      });

      if (followUpResponse.ok) {
        const followUpData = await followUpResponse.json();
        
        if (followUpData.success && followUpData.questions && followUpData.questions.length > 0) {
          const newQuestions = followUpData.questions.map((q: FollowUpQuestion) => ({
            ...q,
            triggeredBy: questionId,
          }));
          
          const updatedQuestions = [
            ...questions.slice(0, currentQuestionIndex + 1),
            ...newQuestions,
            ...questions.slice(currentQuestionIndex + 1),
          ];
          
          setQuestions(updatedQuestions);
        }
      }

      // Move to next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
      
      // Clear the input
      setOtherInput({ ...otherInput, [questionId]: '' });
      
    } catch (error) {
      console.error('Error handling other answer:', error);
      // Fallback: just record the answer and move on
      handleAnswer(questionId, customText, true);
    }
  };

  // Helper function to convert answer to entity (inline version of API logic)
  const answerToEntity = (
    answer: QuestionAnswer,
    question: FollowUpQuestion,
    industry: string
  ): EntityExtraction | null => {
    const { questionId, answer: value, isOther } = answer;

    // Map question IDs to entity types
    const entityTypeMap: { [key: string]: string } = {
      'product_types': 'product_category',
      'shifts': 'shifts',
      'production_model': 'ops_model',
      'subcontractors': 'subcontractor_usage',
      'subcontractor_stages': 'subcontractor_stage',
      'subcontractor_trades': 'subcontractor_trade',
      'components': 'component_usage',
      'component_tracking': 'tracking_level',
      'garment_variants': 'variant_type',
      'project_types': 'project_type',
      'contract_types': 'contract_type',
      'clearance_levels': 'clearance_level',
    };

    const entityType = entityTypeMap[questionId] || question.entityType;

    // Format the value based on whether it's multi-select
    let formattedValue: any = value;
    let displayText: string;

    if (Array.isArray(value)) {
      formattedValue = value;
      displayText = value.map((v: string) => {
        const option = question.options?.find((o: any) => o.value === v);
        return option?.label || v;
      }).join(', ');
    } else {
      const option = question.options?.find((o: any) => o.value === value);
      displayText = option?.label || value;
      formattedValue = value;
    }

    return {
      type: entityType,
      value: formattedValue,
      rawText: displayText,
      confidence: isOther ? 2 : 3,
      provenance: 'user_input',
    };
  };

  const convertAnswersToEntities = async (allAnswers: QuestionAnswer[]) => {
    try {
      const response = await fetch('/api/nlp/answers-to-entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: allAnswers,
          questions,
          industry,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onComplete(allAnswers, data.entities || []);
      } else {
        onComplete(allAnswers, []);
      }
    } catch (error) {
      console.error('Error converting answers to entities:', error);
      onComplete(allAnswers, []);
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(answers, []);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onComplete(answers, []);
  };

  const handleOptionToggle = (questionId: string, optionValue: string) => {
    const current = selectedOptions[questionId] || [];
    const newSelection = current.includes(optionValue)
      ? current.filter(v => v !== optionValue)
      : [...current, optionValue];
    
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: newSelection,
    });
  };

  if (isLoading || dismissed) {
    return null;
  }

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isFinalQuestion = currentQuestion?.id === 'final_anything_else';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="mb-6"
      >
        <div className={`rounded-lg p-4 relative ${
          isFinalQuestion 
            ? 'bg-green-50/50 border border-green-200' 
            : 'bg-blue-50/50 border border-blue-200'
        }`}>
          {/* Dismiss button - only show if not final question */}
          {!isFinalQuestion && (
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              title="Skip follow-up questions"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Header */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-1.5 w-1.5 rounded-full ${isFinalQuestion ? 'bg-green-500' : 'bg-blue-500'}`}></div>
              <h4 className="text-sm font-medium text-gray-900">
                {isFinalQuestion ? 'Final question' : 'Quick follow-up'}
              </h4>
              {!isFinalQuestion && (
                <span className="text-xs text-gray-500">
                  ({currentQuestionIndex + 1}/{questions.length})
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700">{currentQuestion.question}</p>
            {isFinalQuestion && (
              <p className="text-xs text-gray-600 mt-1">
                Optional - you can skip this if you've shared everything
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.multiSelect
                  ? (selectedOptions[currentQuestion.id] || []).includes(option.value)
                  : false;

                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (currentQuestion.multiSelect) {
                        handleOptionToggle(currentQuestion.id, option.value);
                      } else {
                        handleAnswer(currentQuestion.id, option.value, false);
                      }
                    }}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}

              {/* Other option */}
              {currentQuestion.allowOther && (
                <>
                  {otherInput[currentQuestion.id] === undefined ? (
                    <button
                      onClick={() => {
                        setOtherInput({ ...otherInput, [currentQuestion.id]: '' });
                      }}
                      className="px-3 py-1.5 text-sm rounded-md border border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all"
                    >
                      Other...
                    </button>
                  ) : (
                    <div className="w-full mt-3 space-y-2">
                      <textarea
                        value={otherInput[currentQuestion.id]}
                        onChange={(e) =>
                          setOtherInput({
                            ...otherInput,
                            [currentQuestion.id]: e.target.value,
                          })
                        }
                        placeholder="Tell us more... (the more detail, the better we can help)"
                        className="w-full min-h-[80px] px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-y"
                        autoFocus
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          💡 We'll analyze your answer and may ask more follow-up questions
                        </span>
                        <button
                          onClick={async () => {
                            if (otherInput[currentQuestion.id]?.trim()) {
                              setIsGeneratingMore(true);
                              await handleOtherAnswer(currentQuestion.id, otherInput[currentQuestion.id]);
                              setIsGeneratingMore(false);
                            }
                          }}
                          disabled={!otherInput[currentQuestion.id]?.trim() || isGeneratingMore}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2"
                        >
                          {isGeneratingMore ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span>Analyzing...</span>
                            </>
                          ) : (
                            <span>Continue</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Multi-select continue button */}
            {currentQuestion.multiSelect && (selectedOptions[currentQuestion.id] || []).length > 0 && (
              <button
                onClick={() => {
                  const selected = selectedOptions[currentQuestion.id] || [];
                  handleAnswer(currentQuestion.id, selected, false);
                }}
                disabled={isGeneratingMore}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2"
              >
                {isGeneratingMore ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            )}

            {/* Skip link */}
            <div className="pt-2">
              <button
                onClick={handleSkip}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {isFinalQuestion ? 'No, that\'s everything' : 'Skip this question'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
