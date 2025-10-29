"use client"

/**
 * Generation Modal Component
 * 
 * Full-screen modal showing animated generation progress
 * Inspired by Disco training modal with realistic staged progress
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Workflow, BarChart3, Sparkles } from 'lucide-react';
import type { GenerationContractV1 } from '../types.contract';
import { useOnboardingStore } from '../store/onboardingStore';

interface GenerationModalProps {
  progress: number;
  contract: GenerationContractV1;
}

type Stage = 'collecting' | 'data' | 'items' | 'teams' | 'analytics' | 'sites' | 'finalizing';

/**
 * Get industry-specific generation stages
 */
function getStagesForIndustry(industry: string): Array<{
  id: Stage;
  name: string;
  icon: any;
  color: string;
  duration: number;
  progressStart: number;
  progressEnd: number;
}> {
  const baseStages = [
    {
      id: 'collecting' as Stage,
      name: 'Collecting Configuration',
      icon: Sparkles,
      color: 'blue',
      duration: 2000,
      progressStart: 0,
      progressEnd: 15,
    },
  ];
  
  const industryStages = {
    manufacturing: [
      {
        id: 'items' as Stage,
        name: 'Configuring Items & SKUs',
        icon: Package,
        color: 'purple',
        duration: 4000,
        progressStart: 15,
        progressEnd: 35,
      },
      {
        id: 'data' as Stage,
        name: 'Setting Up Production Lines',
        icon: Workflow,
        color: 'indigo',
        duration: 3000,
        progressStart: 35,
        progressEnd: 55,
      },
      {
        id: 'teams' as Stage,
        name: 'Organizing Teams',
        icon: Package,
        color: 'green',
        duration: 3000,
        progressStart: 55,
        progressEnd: 70,
      },
      {
        id: 'sites' as Stage,
        name: 'Mapping Floor Plan',
        icon: Package,
        color: 'orange',
        duration: 2000,
        progressStart: 70,
        progressEnd: 85,
      },
    ],
    construction: [
      {
        id: 'data' as Stage,
        name: 'Creating Project Structure',
        icon: Package,
        color: 'purple',
        duration: 4000,
        progressStart: 15,
        progressEnd: 35,
      },
      {
        id: 'items' as Stage,
        name: 'Setting Up Materials Tracking',
        icon: Package,
        color: 'indigo',
        duration: 3000,
        progressStart: 35,
        progressEnd: 55,
      },
      {
        id: 'teams' as Stage,
        name: 'Configuring Subcontractors',
        icon: Package,
        color: 'green',
        duration: 3000,
        progressStart: 55,
        progressEnd: 75,
      },
    ],
    defense: [
      {
        id: 'data' as Stage,
        name: 'Establishing Contracts & Deliverables',
        icon: Package,
        color: 'purple',
        duration: 4000,
        progressStart: 15,
        progressEnd: 35,
      },
      {
        id: 'items' as Stage,
        name: 'Configuring Specifications',
        icon: Package,
        color: 'indigo',
        duration: 3000,
        progressStart: 35,
        progressEnd: 55,
      },
      {
        id: 'teams' as Stage,
        name: 'Setting Up Security & Access',
        icon: Package,
        color: 'red',
        duration: 3000,
        progressStart: 55,
        progressEnd: 75,
      },
    ],
  };
  
  const finalStages = [
    {
      id: 'analytics' as Stage,
      name: 'Building Dashboards',
      icon: BarChart3,
      color: 'cyan',
      duration: 2000,
      progressStart: industry === 'manufacturing' ? 85 : 75,
      progressEnd: industry === 'manufacturing' ? 95 : 90,
    },
    {
      id: 'finalizing' as Stage,
      name: 'Finalizing Workspace',
      icon: CheckCircle2,
      color: 'emerald',
      duration: 2000,
      progressStart: industry === 'manufacturing' ? 95 : 90,
      progressEnd: 100,
    },
  ];
  
  return [
    ...baseStages,
    ...(industryStages[industry as keyof typeof industryStages] || industryStages.manufacturing),
    ...finalStages,
  ];
}

export function GenerationModal({ progress, contract }: GenerationModalProps) {
  const { updateGenerationProgress } = useOnboardingStore();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [message, setMessage] = useState('Organizing your configuration...');
  
  // Get industry-specific stages
  const STAGES = getStagesForIndustry(contract.company.industry);
  const currentStage = STAGES[currentStageIndex];
  const StageIcon = currentStage?.icon || Sparkles;
  
  // Simulate realistic progress
  useEffect(() => {
    let currentProgress = 0;
    let stageIndex = 0;
    
    const runStage = (stage: typeof STAGES[0]) => {
      setCurrentStageIndex(stageIndex);
      
      // Update messages during this stage
      const messages = getStageMessages(stage.id, contract);
      let messageIndex = 0;
      
      const messageInterval = setInterval(() => {
        if (messageIndex < messages.length) {
          setMessage(messages[messageIndex]);
          messageIndex++;
        }
      }, stage.duration / messages.length);
      
      // Animate progress for this stage
      const startProgress = stage.progressStart;
      const endProgress = stage.progressEnd;
      const steps = 50;
      const stepDuration = stage.duration / steps;
      let step = 0;
      
      const progressInterval = setInterval(() => {
        step++;
        const stageProgress = (step / steps);
        currentProgress = startProgress + (endProgress - startProgress) * stageProgress;
        
        updateGenerationProgress(Math.min(currentProgress, 100));
        
        if (step >= steps) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          
          // Move to next stage
          stageIndex++;
          if (stageIndex < STAGES.length) {
            runStage(STAGES[stageIndex]);
          }
        }
      }, stepDuration);
    };
    
    // Start first stage
    runStage(STAGES[0]);
    
    return () => {
      // Cleanup handled by individual intervals
    };
  }, [contract, updateGenerationProgress]);
  
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r from-${currentStage.color}-500 to-${currentStage.color}-600 p-8 text-white`}>
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{
                rotate: currentStage.id === 'collecting' || currentStage.id === 'data' ? 360 : 0,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <StageIcon className="h-10 w-10" />
            </motion.div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">
            {currentStage.name}
          </h2>
          <p className="text-center text-white/90">
            {message}
          </p>
        </div>
        
        {/* Progress */}
        <div className="p-8">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-slate-600 font-medium">Building your workspace</span>
            <span className="text-slate-900 font-bold">{Math.round(progress)}%</span>
          </div>
          
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Stage indicators */}
          <div className="flex justify-between mt-6">
            {STAGES.map((stage, index) => {
              const StageIcon = stage.icon;
              const isComplete = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              
              return (
                <div key={stage.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                      isComplete
                        ? 'bg-green-100 text-green-600'
                        : isCurrent
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <StageIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs text-slate-600 hidden sm:block text-center max-w-[80px]">
                    {stage.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Generate contextual messages for each stage based on industry
 */
function getStageMessages(stage: Stage, contract: GenerationContractV1): string[] {
  const industry = contract.company.industry;
  
  switch (stage) {
    case 'collecting':
      return [
        'Organizing your configuration...',
        'Validating settings...',
        'Preparing workspace structure...',
      ];
      
    case 'items':
      if (industry === 'manufacturing') {
        const itemCount = contract.items.categories.length * 10;
        return [
          `Creating ${itemCount} product records...`,
          'Generating SKU structures...',
          'Setting up attributes and variants...',
          'Linking components and BOMs...',
        ];
      } else if (industry === 'construction') {
        const materialCount = contract.items.categories.length;
        return [
          `Setting up ${materialCount} material categories...`,
          'Configuring material tracking...',
          'Establishing supplier links...',
        ];
      } else {
        return [
          'Configuring deliverable tracking...',
          'Setting up specifications...',
          'Establishing traceability...',
        ];
      }
      
    case 'data':
      if (industry === 'manufacturing') {
        const lineCount = contract.manufacturingExt?.production?.lineCount || 2;
        return [
          `Configuring ${lineCount} production lines...`,
          'Setting up work centers...',
          'Establishing capacity models...',
        ];
      } else if (industry === 'construction') {
        const projectCount = contract.constructionExt?.concurrentProjects || 5;
        return [
          `Setting up ${projectCount} project templates...`,
          'Configuring project phases...',
          'Establishing milestone tracking...',
        ];
      } else {
        return [
          'Establishing contract structure...',
          'Configuring deliverables tracking...',
          'Setting up program management...',
        ];
      }
      
    case 'teams':
      const deptCount = contract.teams.departments.length;
      if (industry === 'manufacturing') {
        return [
          `Organizing ${deptCount} departments...`,
          'Setting up floor worker access...',
          'Configuring shift management...',
        ];
      } else if (industry === 'construction') {
        return [
          `Configuring ${deptCount} teams...`,
          'Setting up subcontractor access...',
          'Establishing project roles...',
        ];
      } else {
        return [
          `Organizing ${deptCount} teams...`,
          'Configuring security clearances...',
          'Setting up access controls...',
        ];
      }
      
    case 'sites':
      return [
        'Mapping facility layout...',
        'Configuring zones and areas...',
        'Setting up location tracking...',
      ];
      
    case 'analytics':
      const metricCount = contract.analytics.keyMetrics.length;
      return [
        `Configuring ${metricCount} key metrics...`,
        'Creating analytics views...',
        'Setting up KPI cards...',
        'Designing custom reports...',
      ];
      
    case 'finalizing':
      return [
        'Applying final touches...',
        'Optimizing performance...',
        'Almost ready...',
        'Done!',
      ];
      
    default:
      return ['Processing...'];
  }
}

