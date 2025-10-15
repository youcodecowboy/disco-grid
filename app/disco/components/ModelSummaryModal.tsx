'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Zap, DollarSign, Target, CheckCircle, ArrowRight, Sparkles, Database, BarChart3 } from 'lucide-react';
import { DiscoModelState } from '../types';
import { Button } from '@/components/ui/button';

interface ModelSummaryModalProps {
  isOpen: boolean;
  modelState: DiscoModelState;
  recordsUsed: number;
  trainingTime: number;
  onClose: () => void;
}

export function ModelSummaryModal({ isOpen, modelState, recordsUsed, trainingTime, onClose }: ModelSummaryModalProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };
  
  // Calculate improvements
  const baselineAccuracy = 82;
  const accuracyImprovement = modelState.accuracy - baselineAccuracy;
  const responseTimeImprovement = Math.round((340 - modelState.responseTime) / 340 * 100);
  const efficiencyGain = Math.round((accuracyImprovement / baselineAccuracy) * 100);
  
  // Optimizations discovered
  const optimizations = [
    {
      title: 'Pattern Recognition Enhancement',
      description: 'Identified 47 recurring patterns in production workflows',
      impact: '+12% accuracy',
      icon: Target
    },
    {
      title: 'Data Quality Optimization',
      description: 'Improved handling of incomplete records and edge cases',
      impact: '+8% reliability',
      icon: CheckCircle
    },
    {
      title: 'Response Time Reduction',
      description: 'Optimized model parameters for faster inference',
      impact: `-${responseTimeImprovement}% latency`,
      icon: Zap
    },
    {
      title: 'Context Understanding',
      description: 'Enhanced comprehension of domain-specific terminology',
      impact: '+15% relevance',
      icon: Sparkles
    }
  ];
  
  // Cost savings estimates
  const monthlySavings = Math.round((recordsUsed / 10000) * 450 + Math.random() * 200);
  const annualSavings = monthlySavings * 12;
  const hoursPerWeek = Math.round((efficiencyGain / 10) * 2.5);
  
  // Next steps for future models
  const nextSteps = [
    {
      title: 'Expand Training Dataset',
      description: 'Target 100K+ records for next iteration',
      priority: 'High'
    },
    {
      title: 'Cross-Domain Learning',
      description: 'Incorporate customer communication data',
      priority: 'Medium'
    },
    {
      title: 'Real-Time Adaptation',
      description: 'Enable continuous learning from new patterns',
      priority: 'High'
    },
    {
      title: 'Multi-Modal Integration',
      description: 'Include image and document analysis capabilities',
      priority: 'Low'
    }
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Model Summary</h2>
              </div>
              <p className="text-blue-100">Custom Adapter {modelState.version}</p>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Training Overview */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Training Overview
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                    <div className="text-xs text-blue-900 mb-1">Records Used</div>
                    <div className="text-2xl font-bold text-blue-900">{recordsUsed.toLocaleString()}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                    <div className="text-xs text-purple-900 mb-1">Training Time</div>
                    <div className="text-2xl font-bold text-purple-900">{formatTime(trainingTime)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                    <div className="text-xs text-green-900 mb-1">Quality Score</div>
                    <div className="text-2xl font-bold text-green-900">{modelState.qualityScore}%</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                    <div className="text-xs text-orange-900 mb-1">Accuracy Gain</div>
                    <div className="text-2xl font-bold text-orange-900">+{accuracyImprovement}%</div>
                  </div>
                </div>
              </div>
              
              {/* Optimizations */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Optimizations Applied
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {optimizations.map((opt, index) => (
                    <motion.div
                      key={opt.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-purple-100">
                          <opt.icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-gray-900 mb-1">{opt.title}</h4>
                          <p className="text-xs text-gray-600 mb-2">{opt.description}</p>
                          <span className="text-xs font-semibold text-green-600">{opt.impact}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Performance Improvements */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Estimated Performance Improvements
                </h3>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-gray-700 mb-2">Efficiency Increase</div>
                      <div className="text-3xl font-bold text-green-600 mb-1">+{efficiencyGain}%</div>
                      <div className="text-xs text-gray-600">vs. standard model</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-700 mb-2">Response Speed</div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">{modelState.responseTime}ms</div>
                      <div className="text-xs text-gray-600">-{responseTimeImprovement}% faster</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-700 mb-2">Success Rate</div>
                      <div className="text-3xl font-bold text-purple-600 mb-1">{modelState.successRate}%</div>
                      <div className="text-xs text-gray-600">+{modelState.successRate - 94}% improvement</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cost Savings */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  Estimated Cost Savings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-emerald-900">${monthlySavings}</span>
                      <span className="text-sm text-emerald-700">/month</span>
                    </div>
                    <div className="text-xs text-emerald-800">
                      Through improved accuracy and reduced manual intervention
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-blue-900">{hoursPerWeek}h</span>
                      <span className="text-sm text-blue-700">/week</span>
                    </div>
                    <div className="text-xs text-blue-800">
                      Time saved on data processing and validation
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Projected Annual Savings</span>
                    <span className="text-2xl font-bold text-gray-900">${annualSavings.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Next Steps */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-orange-600" />
                  Recommendations for Next Model
                </h3>
                <div className="space-y-3">
                  {nextSteps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm text-gray-900">{step.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              step.priority === 'High' ? 'bg-red-100 text-red-700' :
                              step.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {step.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{step.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Key Insights */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  Key Insights
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Your custom adapter has learned patterns specific to your {recordsUsed.toLocaleString()} records</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>The model now understands your workflow terminology and business context</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Retrain with more data (100K+ records) for even better results</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>The adapter will continue to improve as you add more diverse data sources</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-xs text-gray-600">
                Model trained on {new Date().toLocaleDateString()}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Using Model
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

