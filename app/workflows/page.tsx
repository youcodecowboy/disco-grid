'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Package, 
  CheckCircle, 
  MessageSquare, 
  Plus,
  ArrowRight,
  Lightbulb,
  Zap,
  Target,
  Settings,
  X,
  Search,
  Filter,
  Tag,
  Calendar,
  TrendingUp,
  FileText,
  DollarSign,
  Workflow,
  Play,
  Clock,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function WorkflowsPage() {
  const [workflowInput, setWorkflowInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleCreateWorkflow = () => {
    if (workflowInput.trim()) {
      setIsCreating(true);
      // Simulate AI processing
      setTimeout(() => setIsCreating(false), 2000);
    }
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
            <Button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 text-sm">
              Save
            </Button>
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

          {/* Empty State with Central AI Input */}
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="max-w-2xl w-full">
              <Card className="bg-card text-card-foreground shadow-sm border-2">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Workflow className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-semibold mb-2">Create Your First Workflow</CardTitle>
                  <p className="text-muted-foreground">
                    Describe your business process in natural language, and AI will create an interactive workflow for you.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
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
                          <ArrowRight className="h-5 w-5" />
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

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <Play className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-sm font-medium">Natural Language</div>
                        <div className="text-xs text-muted-foreground">Describe your process in plain English</div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <Zap className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="text-sm font-medium">AI-Powered</div>
                        <div className="text-xs text-muted-foreground">AI creates and configures your workflow</div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                          <Settings className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="text-sm font-medium">Interactive</div>
                        <div className="text-xs text-muted-foreground">Real-time workflow visualization and editing</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
