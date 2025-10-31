"use client"

/**
 * Step Container Component
 * 
 * Wraps each question/step with consistent layout and animations
 */

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Question } from '../types';
import { useOnboardingStore } from '../store/onboardingStore';
import { FloorPlanBuilder } from './builders/FloorPlanBuilder';
import { LegoAttributeBuilder } from './builders/LegoAttributeBuilder';
import { WorkflowStagesBuilder } from './builders/WorkflowStagesBuilder';
import { IntegrationsGrid } from './builders/IntegrationsGrid';
import { TeamsBuilder } from './builders/TeamsBuilder';
import { MetricsSelector } from './builders/MetricsSelector';
import { ReviewPage } from './ReviewPage';
import { ConfirmationFlow } from './ConfirmationFlow';
import { GapFillingQuestions } from './GapFillingQuestions';
import { DynamicListInput } from './inputs/DynamicListInput';
// Removed legacy import: import questionsData from '../content/questions.en.json';
import { type EntityExtraction } from '../lib/nlp.intents';
import { extractEntitiesWithLLM } from '../lib/llm-extraction';
import { analyzeContractCompleteness } from '../lib/contract-completeness';

interface StepContainerProps {
  question: Question;
  allQuestions?: Question[];
}

    /**
     * NLP Input Component with Entity Extraction
     */
    function NLPInput({ question, currentValue, handleUpdate }: { 
      question: any; 
      currentValue: string; 
      handleUpdate: (value: any) => void;
    }) {
      const { contract, updateContract, uiState } = useOnboardingStore();
      const [extractedData, setExtractedData] = useState<EntityExtraction[]>([]);
      const [extractionMethod, setExtractionMethod] = useState<'llm' | 'keyword' | 'hybrid' | null>(null);
      const [exampleIndex, setExampleIndex] = useState(0);

      // Auto-fill demo data if demo mode is active and field is empty
      useEffect(() => {
        if (uiState.demoMode && !currentValue) {
          import('../lib/demo-data').then(({ getDemoValueForQuestion }) => {
            const demoValue = getDemoValueForQuestion(question.id);
            if (demoValue && typeof demoValue === 'string') {
              handleUpdate(demoValue);
            }
          });
        }
      }, [uiState.demoMode, question.id]);

      // Rotating examples based on industry
      const getExamples = () => {
        const industry = contract.company.industry;
        
        if (industry === 'manufacturing') {
          return [
            "We manufacture denim jeans in Istanbul, producing 10,000 units per month with 45 employees",
            "Our facility in Los Angeles makes activewear - leggings, sports bras, and tops. We run 2 shifts and have 30 people",
            "We're a furniture manufacturer in North Carolina. We build custom tables and chairs with a team of 20 craftsmen"
          ];
        } else if (industry === 'construction') {
          return [
            "We build residential homes in Austin, typically 5-10 projects at a time with 50 employees",
            "Commercial construction company focused on retail spaces. Based in Chicago with 75 workers",
            "We handle infrastructure projects - roads and bridges. Team of 100+ across multiple states"
          ];
        } else if (industry === 'defense') {
          return [
            "We manufacture radar components for the DoD. Facility in Virginia with Secret clearance",
            "Defense contractor providing maintenance services for aircraft. 60 employees, all cleared",
            "We develop software for military applications. R&D team of 25 in California"
          ];
        }
        
        return [
          "Tell us what you make, where you're located, and how many people work with you",
          "Include details about your products, capacity, and team size for best results",
          "The more specific you are, the better we can customize your workspace"
        ];
      };

      const examples = getExamples();

      // Rotate examples every 4 seconds
      useEffect(() => {
        const interval = setInterval(() => {
          setExampleIndex((prev) => (prev + 1) % examples.length);
        }, 4000);
        
        return () => clearInterval(interval);
      }, [examples.length]);

      // Expose extraction function to parent via window for the Continue button to call
      useEffect(() => {
        // Store extraction function on window so handleNext can access it
        (window as any).__nlpExtractFunction = async () => {
          if (!currentValue || currentValue.length < 50) {
            return { success: true, entities: [] }; // Allow continuation
          }

          try {
            // Use LLM extraction with question-specific prompt (1-to-1 mapping)
            const result = await extractEntitiesWithLLM(currentValue, question.promptContext);
            
            setExtractedData(result.entities);
            setExtractionMethod(result.source);
            
            // Get the latest contract state and update
            const currentContract = useOnboardingStore.getState().contract;
            
            // Store extracted entities in the contract for the next step
            updateContract({
              metadata: {
                ...(currentContract as any).metadata,
                extractedEntities: result.entities,
                extractionMethod: result.source,
                llmTokensUsed: result.tokensUsed,
              },
            } as any);
            
            return { success: true, entities: result.entities };
          } catch (error) {
            console.error('Entity extraction failed:', error);
            setExtractedData([]);
            setExtractionMethod('keyword');
            return { success: false, error };
          }
        };

        return () => {
          delete (window as any).__nlpExtractFunction;
        };
      }, [currentValue, updateContract]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 3) return 'bg-green-100 border-green-300 text-green-700';
    if (confidence >= 2) return 'bg-blue-100 border-blue-300 text-blue-700';
    return 'bg-yellow-100 border-yellow-300 text-yellow-700';
  };

      const getConfidenceLabel = (confidence: number) => {
        if (confidence >= 3) return 'High';
        if (confidence >= 2) return 'Medium';
        return 'Low';
      };

      const getEntityTypeLabel = (type: string): string => {
        const labels: { [key: string]: string } = {
          company: 'Company',
          product: 'Product',
          industry: 'Industry',
          location: 'Location',
          team_size: 'Team Size',
          capacity: 'Capacity',
          ops_model: 'Ops Model',
          shifts: 'Shifts',
          lead_time: 'Lead Time',
          department: 'Department',
          workflow_stage: 'Workflow',
          kpi: 'KPI',
        };
        return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      };

      return (
        <div>
          <textarea
            placeholder={question.placeholder}
            value={currentValue || ''}
            onChange={(e) => handleUpdate(e.target.value)}
            className="w-full min-h-[120px] px-4 py-3 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none bg-white transition-colors"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>
              {question.minLength && `Recommended: ${question.minLength}+ characters`}
            </span>
            <span>{currentValue?.length || 0} / {question.maxLength || 500}</span>
          </div>

          {/* Helper text */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>💡</span>
              <span>Click Continue when ready. AI will analyze your input and ask follow-up questions.</span>
            </div>
            
            {/* Rotating examples */}
            {!currentValue && (
              <motion.div
                key={exampleIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="text-xs font-medium text-blue-900 mb-1">Example:</div>
                <div className="text-xs text-blue-700 italic">"{examples[exampleIndex]}"</div>
              </motion.div>
            )}
          </div>

          {extractedData.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs font-medium text-gray-700 mb-2">
                Detected {extractedData.length} {extractedData.length === 1 ? 'item' : 'items'}:
              </div>
              <div className="space-y-2">
                {extractedData.map((entity, index) => (
                  <div key={index} className={`p-2 border rounded-lg ${getConfidenceColor(entity.confidence)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-xs font-medium mb-0.5">
                          {getEntityTypeLabel(entity.type)}
                        </div>
                        <div className="text-xs opacity-90">
                          {typeof entity.value === 'object' 
                            ? (entity.value.city 
                                ? `${entity.value.city}${entity.value.state ? ', ' + entity.value.state : ''}`
                                : JSON.stringify(entity.value))
                            : entity.value?.toString()}
                        </div>
                      </div>
                      <div className="ml-2">
                        <span className="text-xs px-1.5 py-0.5 bg-white/50 rounded font-medium">
                          {getConfidenceLabel(entity.confidence)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">
                  ✓ Click Continue to review and edit this information
                </div>
                {extractionMethod && (
                  <div className="flex items-center gap-1.5">
                    {extractionMethod === 'llm' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                        <span>🤖</span>
                        <span>AI Powered</span>
                      </span>
                    )}
                    {extractionMethod === 'hybrid' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        <span>🔀</span>
                        <span>AI + Patterns</span>
                      </span>
                    )}
                    {extractionMethod === 'keyword' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                        <span>🔤</span>
                        <span>Pattern Match</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

      {currentValue?.length < 50 && currentValue?.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-xs text-yellow-800">
            Please write at least 50 characters for AI analysis. Current: {currentValue.length}/50
          </div>
        </div>
      )}
      
      {currentValue?.length >= 50 && extractedData.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-xs text-yellow-800">
            Couldn't detect specific information. Try mentioning things like your location, products, capacity, team size, or industry.
          </div>
        </div>
      )}
    </div>
  );
}

export function StepContainer({ question, allQuestions = [] }: StepContainerProps) {
  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Use two-column layout for most question types
  const useTwoColumn = ['text_input', 'yes_no', 'multiple_choice', 'nlp_input', 'file_upload'].includes(question.type);
  
  // Full width for special builders
  const useFullWidth = ['floor_plan_builder', 'lego_attributes', 'workflow_stages', 'integrations_grid', 'teams_builder', 'metrics_selector', 'review_summary', 'welcome_screen'].includes(question.type);
  
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.15 }}
      className="w-full"
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        {useTwoColumn ? (
          <div className="grid grid-cols-12 gap-12">
            {/* Left column - Instructions */}
            <div className="col-span-4">
              {question.section !== 'welcome' && (
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                  {question.section}
                </div>
              )}
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {question.prompt}
              </h2>
              
              {question.subtitle && (
                <p className="text-sm text-gray-600 mb-4">
                  {question.subtitle}
                </p>
              )}
              
              {question.helper && (
                <p className="text-sm text-gray-500">
                  {question.helper}
                </p>
              )}
            </div>
            
            {/* Right column - Input */}
            <div className="col-span-8">
              <QuestionRenderer question={question} allQuestions={allQuestions} />
            </div>
          </div>
        ) : useFullWidth ? (
          /* Full width for special question types */
          <div>
            {question.section !== 'welcome' && (
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                {question.section}
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {question.prompt}
            </h2>
            
            {question.subtitle && (
              <p className="text-base text-gray-600 mb-4">
                {question.subtitle}
              </p>
            )}
            
            {question.helper && (
              <p className="text-sm text-gray-500 mb-8">
                {question.helper}
              </p>
            )}
            
            <div className="mt-8">
              <QuestionRenderer question={question} allQuestions={allQuestions} />
            </div>
          </div>
        ) : (
          /* Default single column for other types */
          <div className="max-w-4xl mx-auto">
            {question.section !== 'welcome' && (
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                {question.section}
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {question.prompt}
            </h2>
            
            {question.subtitle && (
              <p className="text-base text-gray-600 mb-4">
                {question.subtitle}
              </p>
            )}
            
            {question.helper && (
              <p className="text-sm text-gray-500 mb-8">
                {question.helper}
              </p>
            )}
            
            <div className="mt-8">
              <QuestionRenderer question={question} allQuestions={allQuestions} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Render the appropriate input component based on question type
 */
function QuestionRenderer({ question, allQuestions = [] }: { question: Question; allQuestions?: Question[] }) {
  const { contract, updateContract, jumpToStep, nextStep, uiState } = useOnboardingStore();
  const questions = allQuestions; // Use passed questions instead of legacy import
  
  // Auto-fill demo data on mount if demo mode is active
  useEffect(() => {
    if (uiState.demoMode && question.mapsTo) {
      import('../lib/demo-data').then(({ getDemoValueForQuestion }) => {
        const demoValue = getDemoValueForQuestion(question.id);
        if (demoValue !== undefined && demoValue !== null) {
          // Check if value is already set
          const currentValue = getCurrentValue();
          if (!currentValue || currentValue === '' || (Array.isArray(currentValue) && currentValue.length === 0)) {
            handleUpdate(demoValue);
          }
        }
      });
    }
  }, [uiState.demoMode, question.id]);
  
  // Get current value from contract using the question's mapsTo path
  const getCurrentValue = () => {
    if (!question.mapsTo) return undefined;
    
    // For wildcard paths, read from metadata
    if (question.mapsTo.includes('*')) {
      return (contract as any).metadata?.[`rawInput_${question.id}`];
    }
    
    const path = question.mapsTo.split('.');
    let value: any = contract;
    
    for (const key of path) {
      value = value?.[key];
    }
    
    return value;
  };
  
  // Update contract at the mapsTo path
  const handleUpdate = (value: any) => {
    if (!question.mapsTo) return;
    
    const path = question.mapsTo.split('.');
    
    // Special handling for wildcard paths (e.g., "company.*")
    // These are typically used for NLP extraction questions where the value
    // will be parsed and distributed to multiple fields
    if (question.mapsTo.includes('*')) {
      // For wildcard paths, store the raw text in metadata for later extraction
      // The NLP extraction flow will parse this and populate the actual fields
      updateContract({
        metadata: {
          ...(contract as any).metadata,
          [`rawInput_${question.id}`]: value,
        },
      } as any);
      return;
    }
    
    // Build nested update object that MERGES with existing data
    const updates: any = {};
    let current = updates;
    let contractCurrent: any = contract;
    
    for (let i = 0; i < path.length - 1; i++) {
      // Preserve existing data at this level
      current[path[i]] = { ...contractCurrent?.[path[i]] };
      contractCurrent = contractCurrent?.[path[i]];
      current = current[path[i]];
    }
    
    // Set the final value
    current[path[path.length - 1]] = value;
    
    updateContract(updates);
  };
  
  const currentValue = getCurrentValue();
  
  switch (question.type) {
    case 'welcome_screen':
      return (
        <div className="text-center py-12 max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="h-16 w-16 bg-blue-600 rounded-lg mx-auto flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            This will take about <strong>30 minutes</strong>. We'll ask questions about your business
            <br />to create a customized workspace tailored to your needs.
          </p>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900 mb-1">9</div>
              <div className="text-xs text-gray-600">Sections</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900 mb-1">~30</div>
              <div className="text-xs text-gray-600">Questions</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900 mb-1">1</div>
              <div className="text-xs text-gray-600">Custom App</div>
            </div>
          </div>
        </div>
      );
      
        case 'nlp_input':
          return <NLPInput question={question} currentValue={currentValue as string} handleUpdate={handleUpdate} />;
      
    case 'text_input':
      return (
        <input
          type="text"
          placeholder={question.placeholder}
          value={(currentValue as string) || ''}
          onChange={(e) => handleUpdate(e.target.value)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white transition-colors"
        />
      );
      
    case 'yes_no':
      return (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleUpdate(true)}
            className={`relative px-8 py-5 text-base font-medium border-2 rounded-lg transition-all ${
              currentValue === true
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <div className="text-xl mb-2">👍</div>
            <div>Yes</div>
            {currentValue === true && (
              <div className="absolute top-2 right-2 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
          <button
            onClick={() => handleUpdate(false)}
            className={`relative px-8 py-5 text-base font-medium border-2 rounded-lg transition-all ${
              currentValue === false
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
            }`}
          >
            <div className="text-xl mb-2">👎</div>
            <div>No</div>
            {currentValue === false && (
              <div className="absolute top-2 right-2 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        </div>
      );
      
    case 'multiple_choice':
      // Handle dynamic options from contract
      let options = question.options || [];
      if ((question as any).dynamicOptionsFrom) {
        const dynamicPath = (question as any).dynamicOptionsFrom.split('.');
        let dynamicValue: any = contract;
        for (const key of dynamicPath) {
          dynamicValue = dynamicValue?.[key];
        }
        
        if (Array.isArray(dynamicValue) && dynamicValue.length > 0) {
          // Convert array of strings to option format
          options = dynamicValue.map((stage: string) => ({
            value: stage,
            label: stage,
            description: `${stage} stage`,
          }));
        }
      }
      
      const isMultiSelect = question.multiSelect === true;
      const selectedValues = isMultiSelect 
        ? (Array.isArray(currentValue) ? currentValue : [])
        : (currentValue !== undefined && currentValue !== null ? [currentValue] : []);
      
      return (
        <div className="space-y-2.5">
          {options.map((option) => {
            const isSelected = isMultiSelect
              ? selectedValues.includes(option.value)
              : (currentValue === option.value || currentValue === option.value.toString());
            
            return (
              <button
                key={option.value.toString()}
                onClick={() => {
                  if (isMultiSelect) {
                    // Toggle in array
                    const newValues = isSelected
                      ? selectedValues.filter(v => v !== option.value)
                      : [...selectedValues, option.value];
                    handleUpdate(newValues);
                  } else {
                    handleUpdate(option.value);
                  }
                }}
                className={`group w-full text-left px-5 py-4 border rounded-lg transition-all bg-white ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`flex-shrink-0 w-5 h-5 border-2 rounded-full transition-colors flex items-center justify-center ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {isSelected && (
                      <div className="h-2.5 w-2.5 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-base text-gray-900">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      );
      
    case 'file_upload':
      return (
        <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-gray-50 transition-all cursor-pointer bg-white">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  handleUpdate(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {currentValue ? (
            <div className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentValue as string}
                alt="Uploaded logo"
                className="h-20 w-20 object-contain mx-auto rounded border border-gray-200"
              />
              <p className="text-xs text-gray-600">Click to change</p>
            </div>
          ) : (
            <>
              <svg className="h-10 w-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</p>
            </>
          )}
        </label>
      );
      
    case 'floor_plan_builder':
      return (
        <FloorPlanBuilder
          value={currentValue as any}
          onChange={(floors) => handleUpdate(floors)}
        />
      );
    
    case 'lego_attributes':
      return (
        <LegoAttributeBuilder
          value={currentValue as any}
          onChange={(attributes) => handleUpdate(attributes)}
        />
      );
    
    case 'workflow_stages':
      // Handle both workflows.stages (array) and operations.stage_durations (object)
      const isOperationsDurations = question.mapsTo === 'operations.stage_durations';
      
      if (isOperationsDurations) {
        // Convert operations.stage_durations (Record<string, number>) to WorkflowStage[]
        const stagesList = (contract as any).operations?.stages_list || [];
        const durationsObj = (currentValue as Record<string, number>) || {};
        
        const stagesArray = stagesList.map((name: string) => ({
          name,
          durationHours: durationsObj[name] || undefined,
          ownerDept: undefined,
          quality: null,
        }));
        
        return (
          <WorkflowStagesBuilder
            value={stagesArray}
            onChange={(stages) => {
              // Convert back to Record<string, number>
              const durations: Record<string, number> = {};
              stages.forEach((stage) => {
                if (stage.durationHours !== undefined) {
                  durations[stage.name] = stage.durationHours;
                }
              });
              handleUpdate(durations);
            }}
          />
        );
      }
      
      return (
        <WorkflowStagesBuilder
          value={currentValue as any}
          onChange={(stages) => handleUpdate(stages)}
        />
      );
    
    case 'integrations_grid':
      return (
        <IntegrationsGrid
          value={currentValue as any}
          onChange={(integrations) => handleUpdate(integrations)}
        />
      );
    
    case 'teams_builder':
      return (
        <TeamsBuilder
          value={currentValue as any}
          onChange={(teams) => handleUpdate(teams)}
        />
      );
    
    case 'confirm_number':
      // Confirm number question with reference to previous value
      const referencePath = (question as any).referenceField;
      let referenceValue: any = undefined;
      if (referencePath) {
        const path = referencePath.split('.');
        let value: any = contract;
        for (const key of path) {
          value = value?.[key];
        }
        referenceValue = value;
      }
      
      const promptText = referenceValue !== undefined 
        ? question.prompt.replace('{previous_value}', referenceValue.toString())
        : question.prompt;
      
      return (
        <div className="space-y-4">
          <p className="text-base text-gray-700 mb-4">{promptText}</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                if (referenceValue !== undefined) {
                  handleUpdate(referenceValue);
                } else {
                  handleUpdate(true);
                }
              }}
              className={`px-6 py-4 text-base font-medium border-2 rounded-lg transition-all ${
                currentValue === referenceValue || currentValue === true
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              Yes, correct
            </button>
            <button
              onClick={() => handleUpdate(false)}
              className={`px-6 py-4 text-base font-medium border-2 rounded-lg transition-all ${
                currentValue === false
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
              }`}
            >
              No, update
            </button>
          </div>
        </div>
      );
    
    case 'department_sizes':
    case 'role_counts':
      // Form table for department/role sizes
      const dynamicPath = (question as any).dynamicOptionsFrom;
      let items: string[] = [];
      if (dynamicPath) {
        const path = dynamicPath.split('.');
        let value: any = contract;
        for (const key of path) {
          value = value?.[key];
        }
        if (Array.isArray(value)) {
          items = value;
        }
      }
      
      const sizes = currentValue as Record<string, number> || {};
      
      return (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex-1 font-medium text-gray-900">{item}</div>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={sizes[item] || ''}
                onChange={(e) => {
                  const newSizes = {
                    ...sizes,
                    [item]: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  };
                  // Remove undefined values
                  Object.keys(newSizes).forEach(key => {
                    if (newSizes[key] === undefined) {
                      delete newSizes[key];
                    }
                  });
                  handleUpdate(newSizes);
                }}
                className="w-24 px-3 py-2 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <div className="text-sm text-gray-500">people</div>
            </div>
          ))}
        </div>
      );
    
    case 'supervisors_list':
      // Supervisors list builder
      const supervisorsPath = (question as any).dynamicOptionsFrom;
      let departments: string[] = [];
      if (supervisorsPath) {
        const path = supervisorsPath.split('.');
        let value: any = contract;
        for (const key of path) {
          value = value?.[key];
        }
        if (Array.isArray(value)) {
          departments = value;
        }
      }
      
      const supervisors = currentValue as Array<{ department: string; name: string }> || [];
      
      return (
        <div className="space-y-3">
          {departments.map((dept) => {
            const supervisor = supervisors.find(s => s.department === dept);
            return (
              <div key={dept} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex-1 font-medium text-gray-900">{dept}</div>
                <input
                  type="text"
                  placeholder="Supervisor name"
                  value={supervisor?.name || ''}
                  onChange={(e) => {
                    const newSupervisors = supervisors.filter(s => s.department !== dept);
                    if (e.target.value.trim()) {
                      newSupervisors.push({ department: dept, name: e.target.value.trim() });
                    }
                    handleUpdate(newSupervisors);
                  }}
                  className="flex-1 px-3 py-2 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            );
          })}
        </div>
      );
    
    case 'metrics_selector':
      return (
        <MetricsSelector
          value={currentValue as any}
          onChange={(metrics) => handleUpdate(metrics)}
          industry={(contract as any)?.company?.industry || 'manufacturing'}
        />
      );
    
    case 'color_picker':
      return (
        <div className="space-y-4">
          <input
            type="color"
            value={(currentValue as string) || '#0045FF'}
            onChange={(e) => handleUpdate(e.target.value)}
            className="w-24 h-24 rounded-lg border-2 border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            placeholder="#0045FF"
            value={(currentValue as string) || ''}
            onChange={(e) => {
              // Validate hex color
              if (/^#[0-9A-F]{6}$/i.test(e.target.value) || e.target.value === '') {
                handleUpdate(e.target.value);
              }
            }}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white font-mono"
          />
          <p className="text-sm text-gray-500">Enter a hex color code or use the color picker</p>
        </div>
      );
    
    case 'grid_layout_builder':
      // Grid layout builder - can use existing grid-based component or create simple version
      // For now, create a basic grid layout interface
      const gridConfig = currentValue as any || { rows: 3, columns: 4, widgets: [] };
      const kpisFromContract = (contract as any)?.analytics?.kpis_priority || [];
      const dashboardsFromContract = (contract as any)?.analytics?.default_dashboards || [];
      
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select widgets and arrange them on your dashboard grid. You can customize this later.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grid Rows</label>
              <input
                type="number"
                min="2"
                max="6"
                value={gridConfig.rows || 3}
                onChange={(e) => handleUpdate({
                  ...gridConfig,
                  rows: parseInt(e.target.value, 10)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grid Columns</label>
              <input
                type="number"
                min="2"
                max="6"
                value={gridConfig.columns || 4}
                onChange={(e) => handleUpdate({
                  ...gridConfig,
                  columns: parseInt(e.target.value, 10)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Available Widgets:</p>
            <div className="flex flex-wrap gap-2">
              {kpisFromContract.length > 0 && kpisFromContract.map((kpi: string) => (
                <button
                  key={kpi}
                  onClick={() => {
                    const newWidgets = [...(gridConfig.widgets || []), {
                      type: 'KPI',
                      metric: kpi,
                      size: '1x1'
                    }];
                    handleUpdate({ ...gridConfig, widgets: newWidgets });
                  }}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                  + {kpi} KPI
                </button>
              ))}
              {dashboardsFromContract.length > 0 && dashboardsFromContract.map((dashboard: string) => (
                <button
                  key={dashboard}
                  onClick={() => {
                    const newWidgets = [...(gridConfig.widgets || []), {
                      type: 'Dashboard',
                      metric: dashboard,
                      size: '2x2'
                    }];
                    handleUpdate({ ...gridConfig, widgets: newWidgets });
                  }}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                  + {dashboard} Dashboard
                </button>
              ))}
            </div>
          </div>
          {gridConfig.widgets && gridConfig.widgets.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Widgets:</p>
              <div className="space-y-2">
                {gridConfig.widgets.map((widget: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded">
                    <span className="text-sm">{widget.type}: {widget.metric} ({widget.size})</span>
                    <button
                      onClick={() => {
                        const newWidgets = gridConfig.widgets.filter((_: any, i: number) => i !== idx);
                        handleUpdate({ ...gridConfig, widgets: newWidgets });
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    
    case 'gap_filling':
      // Analyze contract to find missing required fields
      const completeness = analyzeContractCompleteness(contract);
      
      return (
        <GapFillingQuestions
          missingFields={completeness.missingRequired}
          onAnswersProvided={(answers) => {
            // Apply gap-filled answers to contract
            Object.entries(answers).forEach(([path, value]) => {
              // Parse path and update contract
              const parts = path.split('.');
              if (parts.length === 2) {
                const [section, field] = parts;
                updateContract({
                  [section]: {
                    ...(contract as any)[section],
                    [field]: value,
                  },
                } as any);
              }
            });
            
            // Move to review
            nextStep();
          }}
          onSkip={() => {
            // Skip gap filling and go straight to review
            nextStep();
          }}
        />
      );
    
    case 'review_summary':
      return (
        <ReviewPage
          contract={contract as any}
          onEdit={(sectionId) => {
            // Find first question in this section (using loaded questions)
            const firstQuestionIndex = questions.findIndex((q: any) => {
              // Map review section IDs to actual section IDs
              const sectionMapping: { [key: string]: string } = {
                'company': 'company',
                'operations': 'operations',
                'items': 'items',
                'workflows': 'workflows',
                'sites': 'sites',
                'teams': 'teams',
                'integrations': 'integrations',
                'analytics': 'analytics',
              };
              return q.section === sectionMapping[sectionId];
            });
            
            if (firstQuestionIndex !== -1) {
              jumpToStep(firstQuestionIndex);
            }
          }}
        />
      );
      
        case 'confirm_entities':
          const extractedEntities = (contract as any).metadata?.extractedEntities || [];
          
          return (
            <ConfirmationFlow
              extractedEntities={extractedEntities}
              industry={contract.company.industry || 'manufacturing'}
              subIndustry={contract.company.subIndustry || undefined}
              contract={contract}
              onConfirm={(confirmedEntities) => {
                
                // Apply confirmed entities to contract
                confirmedEntities.forEach((entity: EntityExtraction) => {
                  switch (entity.type) {
                    // COMPANY INFO
                    case 'company_name':
                      updateContract({
                        company: {
                          ...(contract as any).company,
                          name: entity.value,
                        },
                      } as any);
                      break;
                    
                    case 'team_size':
                      updateContract({
                        company: {
                          ...(contract as any).company,
                          size: entity.value < 10 ? '<10' : entity.value < 50 ? '10-50' : entity.value < 200 ? '50-200' : '200+',
                        },
                      } as any);
                      break;
                    
                    case 'location':
                      const currentLocations = (contract as any).company?.locations || [];
                      updateContract({
                        company: {
                          ...(contract as any).company,
                          locations: [
                            ...currentLocations,
                            {
                              city: entity.value.city,
                              state: entity.value.state,
                              country: entity.value.country || 'USA',
                              timezone: entity.value.timezone,
                              prov: 'nlp' as const,
                              conf: entity.confidence,
                            },
                          ],
                        },
                      } as any);
                      break;
                    
                    case 'industry':
                      updateContract({
                        company: {
                          ...(contract as any).company,
                          industry: entity.value,
                        },
                      } as any);
                      break;
                    
                    case 'facilities':
                      updateContract({
                        company: {
                          ...(contract as any).company,
                          facilities: entity.value,
                        },
                      } as any);
                      break;
                    
                    // OPERATIONS
                    case 'capacity':
                      updateContract({
                        operations: {
                          ...(contract as any).operations,
                          monthlyCapacity: entity.value,
                        },
                      } as any);
                      break;
                    
                    case 'ops_model':
                      updateContract({
                        operations: {
                          ...(contract as any).operations,
                          model: entity.value,
                        },
                      } as any);
                      break;
                    
                    case 'shifts':
                      updateContract({
                        operations: {
                          ...(contract as any).operations,
                          shiftsPerDay: entity.value,
                        },
                      } as any);
                      break;
                    
                    case 'lead_time':
                      updateContract({
                        operations: {
                          ...(contract as any).operations,
                          leadTimes: {
                            avgDays: entity.value,
                            prov: 'nlp' as const,
                            conf: entity.confidence,
                          },
                        },
                      } as any);
                      break;
                    
                    case 'seasonality':
                      updateContract({
                        operations: {
                          ...(contract as any).operations,
                          seasonality: {
                            months: entity.value,
                          },
                        },
                      } as any);
                      break;
                    
                    // NEW OPERATIONS ENTITIES
                    case 'overview_text':
                      updateContract({
                        operations: {
                          ...(contract as any).operations,
                          overview_text: entity.value,
                        },
                      } as any);
                      break;
                    
                    case 'stages_list':
                      // stages_list can be an array - extract all stages
                      const currentStagesList = (contract as any).operations?.stages_list || [];
                      if (Array.isArray(entity.value)) {
                        // If value is array, merge it
                        const merged = [...new Set([...currentStagesList, ...entity.value])];
                        updateContract({
                          operations: {
                            ...(contract as any).operations,
                            stages_list: merged,
                          },
                        } as any);
                      } else if (!currentStagesList.includes(entity.value)) {
                        // If single value, add to array
                        updateContract({
                          operations: {
                            ...(contract as any).operations,
                            stages_list: [...currentStagesList, entity.value],
                          },
                        } as any);
                      }
                      break;
                    
                    case 'stage_durations':
                      // stage_durations is an object mapping stage names to hours
                      const currentDurations = (contract as any).operations?.stage_durations || {};
                      if (typeof entity.value === 'object' && !Array.isArray(entity.value)) {
                        updateContract({
                          operations: {
                            ...(contract as any).operations,
                            stage_durations: { ...currentDurations, ...entity.value },
                          },
                        } as any);
                      }
                      break;
                    
                    case 'planning_method':
                      updateContract({
                        operations: {
                          ...(contract as any).operations,
                          planning_method: entity.value,
                        },
                      } as any);
                      break;
                    
                    case 'track_materials_internally':
                      updateContract({
                        operations: {
                          ...(contract as any).operations,
                          track_materials_internally: entity.value,
                        },
                      } as any);
                      break;
                    
                    case 'qr_or_barcode_use':
                      updateContract({
                        operations: {
                          ...(contract as any).operations,
                          qr_or_barcode_use: entity.value,
                        },
                      } as any);
                      break;
                    
                    case 'qc_stages':
                      const currentQcStages = (contract as any).operations?.qc_stages || [];
                      if (Array.isArray(entity.value)) {
                        const mergedQc = [...new Set([...currentQcStages, ...entity.value])];
                        updateContract({
                          operations: {
                            ...(contract as any).operations,
                            qc_stages: mergedQc,
                          },
                        } as any);
                      } else if (!currentQcStages.includes(entity.value)) {
                        updateContract({
                          operations: {
                            ...(contract as any).operations,
                            qc_stages: [...currentQcStages, entity.value],
                          },
                        } as any);
                      }
                      break;
                    
                    case 'total_lead_time_days':
                      updateContract({
                        operations: {
                          ...(contract as any).operations,
                          total_lead_time_days: entity.value,
                        },
                      } as any);
                      break;
                    
                    case 'data_tracking_method':
                      updateContract({
                        operations: {
                          ...(contract as any).operations,
                          data_tracking_method: entity.value,
                        },
                      } as any);
                      break;
                    
                    case 'biggest_bottleneck_text':
                      updateContract({
                        operations: {
                          ...(contract as any).operations,
                          biggest_bottleneck_text: entity.value,
                        },
                      } as any);
                      break;
                    
                    // PRODUCTS & ITEMS
                    case 'product_category':
                    case 'product':
                      const currentCategories = (contract as any).items?.categories || [];
                      if (!currentCategories.includes(entity.value)) {
                        updateContract({
                          items: {
                            ...(contract as any).items,
                            categories: [...currentCategories, entity.value],
                          },
                        } as any);
                      }
                      break;
                    
                    case 'tracking_level':
                      updateContract({
                        items: {
                          ...(contract as any).items,
                          trackingLevel: entity.value,
                        },
                      } as any);
                      break;
                    
                    case 'component':
                      const currentComponents = (contract as any).items?.components || [];
                      updateContract({
                        items: {
                          ...(contract as any).items,
                          components: [
                            ...currentComponents,
                            {
                              name: entity.value,
                              attributes: [],
                            },
                          ],
                        },
                      } as any);
                      break;
                    
                    case 'item_attribute':
                      const currentAttributes = (contract as any).items?.attributes || [];
                      if (!currentAttributes.find((a: any) => a.key === entity.value)) {
                        updateContract({
                          items: {
                            ...(contract as any).items,
                            attributes: [
                              ...currentAttributes,
                              {
                                key: entity.value,
                                type: 'text',
                                required: false,
                              },
                            ],
                          },
                        } as any);
                      }
                      break;
                    
                    // WORKFLOWS
                    case 'workflow_stage':
                      const currentStages = (contract as any).workflows?.stages || [];
                      if (!currentStages.find((s: any) => s.name === entity.value)) {
                        updateContract({
                          workflows: {
                            ...(contract as any).workflows,
                            stages: [
                              ...currentStages,
                              {
                                name: entity.value,
                                durationHours: undefined,
                                ownerDept: undefined,
                                quality: null,
                              },
                            ],
                          },
                        } as any);
                      }
                      break;
                    
                    case 'department':
                      const currentDepartments = Array.isArray((contract as any).teams?.departments) 
                        ? (contract as any).teams.departments 
                        : [];
                      if (!currentDepartments.find((d: any) => d.name === entity.value)) {
                        updateContract({
                          teams: {
                            ...(contract as any).teams,
                            departments: [
                              ...currentDepartments,
                              {
                                name: entity.value,
                                roles: [],
                                access: 'edit',
                              },
                            ],
                          },
                        } as any);
                      }
                      break;
                    
                    case 'quality_checkpoint':
                      // Add to last workflow stage's quality criteria
                      const stages = (contract as any).workflows?.stages || [];
                      if (stages.length > 0) {
                        const lastStage = stages[stages.length - 1];
                        lastStage.quality = lastStage.quality || { checkpoint: true, criteria: [] };
                        if (!lastStage.quality.criteria.includes(entity.value)) {
                          lastStage.quality.criteria.push(entity.value);
                        }
                        updateContract({
                          workflows: {
                            ...(contract as any).workflows,
                            stages,
                          },
                        } as any);
                      }
                      break;
                    
                    // ANALYTICS & METRICS
                    case 'kpi':
                      const currentMetrics = (contract as any).analytics?.keyMetrics || [];
                      if (!currentMetrics.includes(entity.value)) {
                        updateContract({
                          analytics: {
                            ...(contract as any).analytics,
                            keyMetrics: [...currentMetrics, entity.value],
                          },
                        } as any);
                      }
                      break;
                    
                    case 'customer_segment':
                      // Map customer segments to audience types
                      const audienceMap: Record<string, string> = {
                        'executives': 'exec',
                        'operations': 'ops',
                        'floor': 'floor',
                        'partners': 'partners',
                        'retailers': 'partners',
                        'b2b': 'partners',
                      };
                      const audienceType = audienceMap[entity.value.toLowerCase()] || 'ops';
                      const currentAudience = (contract as any).analytics?.audience || [];
                      if (!currentAudience.includes(audienceType)) {
                        updateContract({
                          analytics: {
                            ...(contract as any).analytics,
                            audience: [...currentAudience, audienceType],
                          },
                        } as any);
                      }
                      break;
                    
                    case 'report_frequency':
                      updateContract({
                        analytics: {
                          ...(contract as any).analytics,
                          reportFrequency: entity.value,
                        },
                      } as any);
                      break;
                    
                    // INTEGRATIONS
                    case 'integration':
                    case 'erp_system':
                    case 'mrp_system':
                      const currentSystems = (contract as any).integrations?.systems || [];
                      const systemType = entity.type === 'erp_system' ? 'erp' : entity.type === 'mrp_system' ? 'mrp' : 'custom';
                      if (!currentSystems.find((s: any) => s.name === entity.value)) {
                        updateContract({
                          integrations: {
                            ...(contract as any).integrations || {},
                            systems: [
                              ...currentSystems,
                              {
                                type: systemType,
                                name: entity.value,
                                priority: 'soon',
                              },
                            ],
                            apiAccess: (contract as any).integrations?.apiAccess ?? false,
                          },
                        } as any);
                      }
                      break;
                    
                    // PLAYBOOKS
                    case 'playbook_task':
                      const currentTasks = (contract as any).playbooks?.orderOnAccepted || [];
                      updateContract({
                        playbooks: {
                          ...(contract as any).playbooks || {},
                          orderOnAccepted: [
                            ...currentTasks,
                            {
                              task: entity.value,
                              dept: 'Operations',
                            },
                          ],
                        },
                      } as any);
                      break;
                  }
                });
                
                // Track which fields were committed
                const fieldMap: { [key: string]: string } = {
                  'company_name': 'company.name',
                  'location': 'company.locations',
                  'team_size': 'company.size',
                  'capacity': 'operations.monthlyCapacity',
                  'shifts': 'operations.shiftsPerDay',
                  'ops_model': 'operations.model',
                  'product': 'items.categories',
                  'product_category': 'items.categories',
                  'tracking_level': 'items.trackingLevel',
                  'subcontractor_usage': 'operations.subcontractors',
                  'subcontractor_stage': 'operations.subcontractorStages',
                  'component_usage': 'items.components',
                  'department': 'teams.departments',
                  // New operations fields
                  'overview_text': 'operations.overview_text',
                  'stages_list': 'operations.stages_list',
                  'stage_durations': 'operations.stage_durations',
                  'planning_method': 'operations.planning_method',
                  'track_materials_internally': 'operations.track_materials_internally',
                  'qr_or_barcode_use': 'operations.qr_or_barcode_use',
                  'qc_stages': 'operations.qc_stages',
                  'total_lead_time_days': 'operations.total_lead_time_days',
                  'data_tracking_method': 'operations.data_tracking_method',
                  'biggest_bottleneck_text': 'operations.biggest_bottleneck_text',
                };
                
                const newCommittedFields = confirmedEntities
                  .map(e => fieldMap[e.type])
                  .filter(Boolean);
                
                const existingCommitted = (contract as any).metadata?.committedFields || [];
                const allCommitted = [...new Set([...existingCommitted, ...newCommittedFields])];
                
                // Update metadata with committed fields
                updateContract({
                  metadata: {
                    ...(contract as any).metadata,
                    committedFields: allCommitted,
                  },
                } as any);
                
                // Move to next step automatically
                nextStep();
              }}
              onSkip={() => {
                // Just move to next step without applying entities
                nextStep();
              }}
            />
          );

        case 'final_confirmation':
          return (
            <div className="text-center py-12 max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="h-24 w-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-2xl">
                  <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <p className="text-xl text-gray-600 mb-4">
                This will take about <strong>20 seconds</strong>
              </p>
              <p className="text-sm text-gray-500 mb-10">
                You can always customize further after generation
              </p>

              <button className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105">
                {question.cta || 'Continue'}
              </button>
            </div>
          );

    case 'enriched_text':
      // enriched_text behaves like nlp_input - it needs entity extraction on Continue
      return <NLPInput question={question} currentValue={currentValue as string} handleUpdate={handleUpdate} />;
    
    case 'dynamic_list':
      return (
        <DynamicListInput
          value={(currentValue as string[]) || []}
          onChange={handleUpdate}
          placeholder={question.placeholder}
          maxItems={question.maxItems || 20}
          label={question.prompt}
          helper={question.helper}
        />
      );

        default:
      return (
        <div className="p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center max-w-2xl mx-auto">
          <p className="text-gray-600 mb-2">
            Question type: <code className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">{question.type}</code>
          </p>
          <p className="text-sm text-gray-500">Component will be implemented in the next phase</p>
        </div>
      );
  }
}
