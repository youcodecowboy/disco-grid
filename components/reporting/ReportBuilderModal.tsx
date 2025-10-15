'use client';

import { useState } from 'react';
import { X, Sparkles, FileText, BarChart3, TrendingUp, Calendar, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockAIRecommendations, dataSourceSuggestions } from '@/lib/reporting/mockData';
import type { DataSourceType } from '@/lib/reporting/types';

interface ReportBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportBuilderModal({ isOpen, onClose }: ReportBuilderModalProps) {
  const [step, setStep] = useState<'data-source' | 'recommendations' | 'canvas'>('data-source');
  const [selectedDataSources, setSelectedDataSources] = useState<DataSourceType[]>([]);

  if (!isOpen) return null;

  const handleDataSourceToggle = (source: DataSourceType) => {
    setSelectedDataSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const handleContinueToRecommendations = () => {
    if (selectedDataSources.length > 0) {
      setStep('recommendations');
    }
  };

  const getRecommendationsForDataSources = () => {
    // In real implementation, this would use AI to generate recommendations
    // For now, return all mock recommendations
    return mockAIRecommendations;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Report Builder</h2>
              <p className="text-sm text-muted-foreground">
                AI-powered report creation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step === 'recommendations' && (
              <Button variant="outline" onClick={() => setStep('data-source')}>
                Back
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === 'data-source' && (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Select Data Sources</h3>
                  <p className="text-muted-foreground">
                    Choose the data you want to include in your report. Our AI will recommend the best visualizations and layouts.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {Object.entries(dataSourceSuggestions).map(([key, source]) => {
                    const isSelected = selectedDataSources.includes(key as DataSourceType);
                    return (
                      <Card 
                        key={key}
                        className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                        }`}
                        onClick={() => handleDataSourceToggle(key as DataSourceType)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                            {key === 'orders' && <FileText className="w-6 h-6" />}
                            {key === 'items' && <Layout className="w-6 h-6" />}
                            {key === 'teams' && <BarChart3 className="w-6 h-6" />}
                            {key === 'tasks' && <Calendar className="w-6 h-6" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-foreground">{source.label}</h4>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {source.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {source.commonReports.map(report => (
                                <span 
                                  key={report}
                                  className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                                >
                                  {report}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t pt-6">
                  <div className="text-sm text-muted-foreground">
                    {selectedDataSources.length > 0 ? (
                      <>Selected {selectedDataSources.length} data source{selectedDataSources.length > 1 ? 's' : ''}</>
                    ) : (
                      <>Select at least one data source to continue</>
                    )}
                  </div>
                  <Button 
                    size="lg"
                    disabled={selectedDataSources.length === 0}
                    onClick={handleContinueToRecommendations}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Recommendations
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 'recommendations' && (
            <div className="p-8">
              <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="text-2xl font-bold">AI Recommendations</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Based on your selected data sources, here are the most relevant report types
                  </p>
                </div>

                <div className="space-y-4">
                  {getRecommendationsForDataSources().map((rec) => (
                    <Card key={rec.id} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold">{rec.reportType}</h4>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {rec.confidence}% match
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {rec.reasoning}
                          </p>

                          {/* Suggested Blocks Preview */}
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Includes:</p>
                            <ul className="space-y-1">
                              {rec.suggestedBlocks.slice(0, 4).map((block, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <span className="w-1 h-1 rounded-full bg-primary" />
                                  {block.type.split('.')[1].charAt(0).toUpperCase() + block.type.split('.')[1].slice(1)}: {block.reasoning}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Metadata */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span>Suggested Schedule: {rec.suggestedSchedule.frequency}</span>
                            <span>•</span>
                            <span>Used {rec.usageCount} times</span>
                            <span>•</span>
                            <span>⭐ {rec.averageRating.toFixed(1)} rating</span>
                          </div>

                          <div className="flex gap-2">
                            <Button onClick={() => setStep('canvas')}>
                              Use This Template
                            </Button>
                            <Button variant="outline">
                              Customize
                            </Button>
                            <Button variant="ghost">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline" onClick={() => setStep('canvas')}>
                    <Layout className="w-4 h-4 mr-2" />
                    Start from Scratch
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 'canvas' && (
            <div className="p-8">
              <div className="text-center">
                <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Report Canvas</h3>
                <p className="text-muted-foreground mb-6">
                  Interactive report builder canvas coming soon...
                </p>
                <div className="space-y-2 text-sm text-muted-foreground max-w-md mx-auto">
                  <p>• Drag and drop analytics components</p>
                  <p>• Configure data sources and filters</p>
                  <p>• Preview report in real-time</p>
                  <p>• Set up scheduling and distribution</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex items-center justify-between bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Step {step === 'data-source' ? '1' : step === 'recommendations' ? '2' : '3'} of 3
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {step === 'canvas' && (
              <Button>
                Save Draft
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


