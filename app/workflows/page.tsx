'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search, Play, Save,
    RotateCcw,
    Bot
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import WorkflowCard from '@/components/blocks/WorkflowCard';
import WorkflowConnection from '@/components/blocks/WorkflowConnection';

interface WorkflowStep {
  id: string;
  title: string;
  type: 'input' | 'process' | 'output' | 'decision';
  config: {
    qrScanning?: boolean;
    photoInput?: boolean;
    textInput?: boolean;
    approval?: boolean;
    notification?: boolean;
  };
  position: { x: number; y: number; w: number; h: number };
  isActive?: boolean;
  isCompleted?: boolean;
}

interface WorkflowConnection {
  from: string;
  to: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

export default function WorkflowsPage() {
  const [workflowInput, setWorkflowInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [workflowConnections, setWorkflowConnections] = useState<WorkflowConnection[]>([]);
  const [isWorkflowSaved, setIsWorkflowSaved] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [draggedStep, setDraggedStep] = useState<string | null>(null);
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [showAddStep, setShowAddStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepType, setNewStepType] = useState<'input' | 'process' | 'output' | 'decision'>('process');
  const gridRef = useRef<HTMLDivElement>(null);

  // Predefined workflow templates
  const workflowTemplates = {
    'denim-factory': [
      { title: 'Order Input', type: 'input' as const, config: { qrScanning: true, textInput: true } },
      { title: 'Material Planning', type: 'process' as const, config: { approval: true } },
      { title: 'Cutting Process', type: 'process' as const, config: { photoInput: true } },
      { title: 'Sewing Process', type: 'process' as const, config: { photoInput: true } },
      { title: 'Quality Check', type: 'decision' as const, config: { approval: true } },
      { title: 'Packaging', type: 'output' as const, config: { qrScanning: true } }
    ],
    'customer-service': [
      { title: 'Inquiry Input', type: 'input' as const, config: { textInput: true } },
      { title: 'Agent Assignment', type: 'process' as const, config: { approval: true } },
      { title: 'Research & Solution', type: 'process' as const, config: { textInput: true } },
      { title: 'Follow Up', type: 'output' as const, config: { notification: true } }
    ],
    'product-development': [
      { title: 'Ideation Input', type: 'input' as const, config: { textInput: true, photoInput: true } },
      { title: 'Research Phase', type: 'process' as const, config: { textInput: true } },
      { title: 'Design Review', type: 'decision' as const, config: { approval: true } },
      { title: 'Prototype', type: 'process' as const, config: { photoInput: true } },
      { title: 'Testing', type: 'process' as const, config: { approval: true } },
      { title: 'Launch', type: 'output' as const, config: { notification: true } }
    ]
  };

  const handleCreateWorkflow = () => {
    if (workflowInput.trim()) {
      setIsCreating(true);
      
      // Determine which template to use based on input
      let template = workflowTemplates['denim-factory']; // default
      const input = workflowInput.toLowerCase();
      
      if (input.includes('customer service') || input.includes('inquiry')) {
        template = workflowTemplates['customer-service'];
      } else if (input.includes('product development') || input.includes('ideation')) {
        template = workflowTemplates['product-development'];
      } else if (input.includes('denim') || input.includes('factory') || input.includes('manufacturing')) {
        template = workflowTemplates['denim-factory'];
      }

      // Simulate AI processing with 2-second delay
      setTimeout(() => {
        const newSteps: WorkflowStep[] = template.map((step, index) => ({
          id: `step-${index}`,
          title: step.title,
          type: step.type,
          config: step.config,
          position: {
            x: (index % 3) * 4,
            y: Math.floor(index / 3) * 6 + 4, // Shift down by 4 grid units to avoid overlap
            w: 3,
            h: 4
          },
          isActive: index === 0,
          isCompleted: false
        }));

        const newConnections: WorkflowConnection[] = [];
        for (let i = 0; i < newSteps.length - 1; i++) {
          newConnections.push({
            from: newSteps[i].id,
            to: newSteps[i + 1].id,
            isActive: false,
            isCompleted: false
          });
        }

        setWorkflowSteps(newSteps);
        setWorkflowConnections(newConnections);
        setCurrentStep(0);
        setIsCreating(false);
        setIsWorkflowSaved(false);
      }, 2000);
    }
  };

  const handleConfigChange = (stepId: string, newConfig: any) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, config: newConfig } : step
    ));
  };

  const handleToggleStep = (stepId: string) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, isActive: !step.isActive } : step
    ));
  };

  const handleSaveWorkflow = () => {
    setIsWorkflowSaved(true);
    // In a real app, this would save to backend
  };

  const handleRunWorkflow = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentStep(0);
    
    // Simulate workflow execution
    const runStep = (stepIndex: number) => {
      if (stepIndex >= workflowSteps.length) {
        setIsRunning(false);
        return;
      }

      // Mark current step as active and previous as completed
      setWorkflowSteps(prev => prev.map((step, index) => ({
        ...step,
        isActive: index === stepIndex,
        isCompleted: index < stepIndex
      })));

      // Update connections
      setWorkflowConnections(prev => prev.map((conn, index) => ({
        ...conn,
        isActive: index === stepIndex - 1,
        isCompleted: index < stepIndex - 1
      })));

      setCurrentStep(stepIndex);

      // Move to next step after 1.5 seconds
      setTimeout(() => runStep(stepIndex + 1), 1500);
    };

    runStep(0);
  };

  const handleResetWorkflow = () => {
    setWorkflowSteps([]);
    setWorkflowConnections([]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsWorkflowSaved(false);
    setWorkflowInput('');
  };

  const handleAddStep = () => {
    if (newStepTitle.trim()) {
      const newStep: WorkflowStep = {
        id: `step-${Date.now()}`,
        title: newStepTitle,
        type: newStepType,
        config: {
          qrScanning: false,
          photoInput: false,
          textInput: false,
          approval: false,
          notification: false
        },
        position: {
          x: (workflowSteps.length % 3) * 4,
          y: Math.floor(workflowSteps.length / 3) * 6 + 4, // Shift down by 4 grid units to avoid overlap
          w: 3,
          h: 4
        },
        isActive: false,
        isCompleted: false
      };

      setWorkflowSteps(prev => [...prev, newStep]);
      setNewStepTitle('');
      setNewStepType('process');
      setShowAddStep(false);
    }
  };

  const handleDeleteStep = (stepId: string) => {
    setWorkflowSteps(prev => prev.filter(step => step.id !== stepId));
    setWorkflowConnections(prev => prev.filter(conn => conn.from !== stepId && conn.to !== stepId));
  };

  // Drag and drop functionality
  const handleDragStart = (e: React.DragEvent, stepId: string) => {
    const step = workflowSteps.find(s => s.id === stepId);
    if (!step) return;

    setDraggedStep(stepId);
    setDragPreview({ x: step.position.x, y: step.position.y, w: step.position.w, h: step.position.h });
    
    e.dataTransfer.effectAllowed = "move";
    
    // Add visual feedback
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "0.8";
    draggedElement.style.transform = "rotate(2deg) scale(1.02)";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    if (!draggedStep || !gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate grid position
    const totalWidth = rect.width;
    const gridUnitWidth = totalWidth / 12;
    const rowHeight = 40;
    
    const newX = Math.max(0, Math.min(9, Math.floor(mouseX / gridUnitWidth))); // Max 9 to fit 3-width cards
    const newY = Math.max(0, Math.floor(mouseY / rowHeight));

    setDragPreview(prev => {
      if (!prev) return null;
      return { ...prev, x: newX, y: newY };
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedStep || !dragPreview) return;

    // Update the step position
    setWorkflowSteps(prev => prev.map(step => 
      step.id === draggedStep 
        ? { ...step, position: { ...step.position, x: dragPreview.x, y: dragPreview.y } }
        : step
    ));

    // Reset drag state
    setDraggedStep(null);
    setDragPreview(null);

    // Remove visual feedback
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "";
    draggedElement.style.transform = "";
  };

  return (
    <div className="min-h-screen bg-background bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:28px_28px]">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
            </div>
            <div className="text-sm text-muted-foreground">Workflows</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <Input 
                type="text" 
                placeholder="Search workflows..." 
                className="pl-10 pr-4 py-1.5 text-sm border-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10 h-4 w-4" />
            </div>
            {workflowSteps.length > 0 && (
              <>
                <Button 
                  onClick={() => setShowAddStep(!showAddStep)}
                  variant="outline"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 text-sm"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
                <Button 
                  onClick={handleSaveWorkflow}
                  disabled={isWorkflowSaved}
                  className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 text-sm ${
                    isWorkflowSaved 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isWorkflowSaved ? 'Saved' : 'Save Workflow'}
                </Button>
                <Button 
                  onClick={handleRunWorkflow}
                  disabled={isRunning}
                  variant="outline"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 text-sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run Workflow'}
                </Button>
                <Button 
                  onClick={handleResetWorkflow}
                  variant="outline"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar 
          sidebarExpanded={sidebarExpanded}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        />

        {/* Main Content */}
        <main className={`flex-1 p-4 transition-all duration-200 ${sidebarExpanded ? 'ml-60' : 'ml-16'}`}>
          {/* Title Section */}
          <div className="mb-4 pb-2 border-b-2">
            <div className="flex items-center gap-2 text-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <span className="font-medium">Workflows</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">Create and manage your business processes</span>
            </div>
          </div>

          {/* AI Input Section */}
          {workflowSteps.length === 0 && (
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="max-w-2xl w-full">
                <div className="bg-card text-card-foreground shadow-sm border-2 rounded-lg">
                  <div className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Bot className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">AI Workflow Creator</h2>
                    <p className="text-muted-foreground mb-6">
                      Describe your business process in natural language, and AI will create an interactive workflow for you.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Describe your workflow... (e.g., 'We run a denim factory and our process is: we plan, cut, sew, wash, finish, and pack')"
                          value={workflowInput}
                          onChange={(e) => setWorkflowInput(e.target.value)}
                          className="h-16 text-base pl-4 pr-16 rounded-lg border-2 focus:border-purple-500 transition-colors"
                        />
                        <Button 
                          onClick={handleCreateWorkflow}
                          disabled={!workflowInput.trim() || isCreating}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-12 w-12 bg-purple-500 hover:bg-purple-600 rounded-md"
                        >
                          {isCreating ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <Bot className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-3">Try these examples:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => setWorkflowInput("We run a denim factory and our process is: we plan, cut, sew, wash, finish, and pack")}
                          >
                            Denim Factory
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => setWorkflowInput("Our customer service workflow: receive inquiry, assign agent, research issue, provide solution, follow up")}
                          >
                            Customer Service
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => setWorkflowInput("Product development: ideation, research, design, prototype, test, launch")}
                          >
                            Product Development
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6 mt-6">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <Bot className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="text-sm font-medium">AI-Powered</div>
                          <div className="text-xs text-muted-foreground">AI creates and configures your workflow</div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Play className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="text-sm font-medium">Interactive</div>
                          <div className="text-xs text-muted-foreground">Real-time workflow visualization and editing</div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                            <Save className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="text-sm font-medium">Configurable</div>
                          <div className="text-xs text-muted-foreground">Customize each step with specific features</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Processing Animation */}
          {isCreating && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Bot className="h-10 w-10 text-white animate-bounce" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI is creating your workflow...</h3>
                <p className="text-muted-foreground mb-4">Analyzing your process and generating workflow steps</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Add Step Form */}
          {showAddStep && workflowSteps.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Add New Workflow Step</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Step Title</label>
                  <Input
                    type="text"
                    placeholder="Enter step title..."
                    value={newStepTitle}
                    onChange={(e) => setNewStepTitle(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="w-40">
                  <label className="block text-sm font-medium mb-2">Step Type</label>
                  <select
                    value={newStepType}
                    onChange={(e) => setNewStepType(e.target.value as any)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="input">Input</option>
                    <option value="process">Process</option>
                    <option value="decision">Decision</option>
                    <option value="output">Output</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddStep}
                    disabled={!newStepTitle.trim()}
                    className="h-10 px-4"
                  >
                    Add Step
                  </Button>
                  <Button 
                    onClick={() => setShowAddStep(false)}
                    variant="outline"
                    className="h-10 px-4"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Workflow Grid */}
          {workflowSteps.length > 0 && !isCreating && (
            <div 
              ref={gridRef}
              className="relative bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:28px_28px]"
              style={{ minHeight: '600px' }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Drag Preview */}
              {dragPreview && (
                <div
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: `calc(${(dragPreview.x / 12) * 100}% + ${dragPreview.x > 0 ? "8px" : "0px"})`,
                    top: `${dragPreview.y * 40 + (dragPreview.y > 0 ? 8 : 0)}px`,
                    width: `calc(${(dragPreview.w / 12) * 100}% - ${dragPreview.x + dragPreview.w < 12 ? "8px" : "0px"})`,
                    height: `${dragPreview.h * 40 - 8}px`,
                  }}
                >
                  <div className="w-full h-full border-2 border-blue-500 border-dashed bg-blue-50/30 rounded-lg shadow-lg animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg"></div>
                    <div className="absolute top-2 left-2 text-xs text-blue-600 font-medium bg-white/80 px-2 py-1 rounded">
                      Drop here
                    </div>
                  </div>
                </div>
              )}

              {/* Workflow Connections */}
              {workflowConnections.map((connection, index) => {
                const fromStep = workflowSteps.find(step => step.id === connection.from);
                const toStep = workflowSteps.find(step => step.id === connection.to);
                
                if (!fromStep || !toStep) return null;

                return (
                  <WorkflowConnection
                    key={index}
                    from={{
                      x: fromStep.position.x * 100 + 200,
                      y: fromStep.position.y * 40 + 100
                    }}
                    to={{
                      x: toStep.position.x * 100 + 200,
                      y: toStep.position.y * 40 + 100
                    }}
                    isActive={connection.isActive}
                    isCompleted={connection.isCompleted}
                  />
                );
              })}

              {/* Workflow Steps */}
              {workflowSteps.map((step) => (
                <div
                  key={step.id}
                  className={`absolute transition-all duration-200 ${
                    draggedStep === step.id ? "z-30" : "z-10"
                  }`}
                  style={{
                    left: `calc(${(step.position.x / 12) * 100}% + ${step.position.x > 0 ? "8px" : "0px"})`,
                    top: `${step.position.y * 40 + (step.position.y > 0 ? 8 : 0)}px`,
                    width: `calc(${(step.position.w / 12) * 100}% - ${step.position.x + step.position.w < 12 ? "8px" : "0px"})`,
                    height: `${step.position.h * 40 - 8}px`,
                    transform: draggedStep === step.id ? "rotate(2deg) scale(1.02)" : "rotate(0deg) scale(1)",
                    opacity: draggedStep === step.id ? 0.8 : 1,
                    filter: draggedStep === step.id ? "drop-shadow(0 10px 20px rgba(0,0,0,0.2))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  }}
                >
                  <WorkflowCard
                    id={step.id}
                    title={step.title}
                    type={step.type}
                    config={step.config}
                    isActive={step.isActive}
                    isCompleted={step.isCompleted}
                    onConfigChange={handleConfigChange}
                    onToggle={handleToggleStep}
                    onDelete={handleDeleteStep}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, step.id)}
                    onDragEnd={handleDrop}
                  />
                </div>
              ))}

              {/* Workflow Status */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Workflow Status</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Step {currentStep + 1} of {workflowSteps.length}
                </div>
                {isRunning && (
                  <div className="text-xs text-blue-600 mt-1">
                    Running workflow...
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  💡 Drag cards to rearrange
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
