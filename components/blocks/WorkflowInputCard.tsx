"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Workflow,
    ArrowRight,
    Bot,
    Building2,
    Users,
    Lightbulb,
    ChevronDown
} from 'lucide-react'

interface WorkflowInputCardProps {
  onCreateWorkflow: (workflowType: string, customDescription?: string) => void
  isCreating: boolean
}

const workflowTemplates = [
  {
    id: 'denim-factory',
    title: 'Manufacturing Process',
    description: 'Denim factory workflow with planning, cutting, sewing, finishing, and packaging',
    icon: Building2,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    example: 'We run a denim factory and our process is: we plan, cut, sew, wash, finish, and pack'
  },
  {
    id: 'customer-service',
    title: 'Customer Service',
    description: 'Support workflow with inquiry handling, agent assignment, and follow-up',
    icon: Users,
    color: 'bg-green-100 text-green-800 border-green-200',
    example: 'Our customer service workflow: receive inquiry, assign agent, research issue, provide solution, follow up'
  },
  {
    id: 'product-development',
    title: 'Product Development',
    description: 'Development process from ideation to launch with testing and review',
    icon: Lightbulb,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    example: 'Product development: ideation, research, design, prototype, test, launch'
  }
]

export default function WorkflowInputCard({ onCreateWorkflow, isCreating }: WorkflowInputCardProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [customDescription, setCustomDescription] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleCreate = () => {
    if (selectedTemplate) {
      const template = workflowTemplates.find(t => t.id === selectedTemplate)
      onCreateWorkflow(selectedTemplate, template?.example)
    } else if (customDescription.trim()) {
      onCreateWorkflow('custom', customDescription)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setShowCustomInput(false)
    setCustomDescription('')
  }

  const handleCustomToggle = () => {
    setShowCustomInput(!showCustomInput)
    setSelectedTemplate('')
    setCustomDescription('')
  }

  const canCreate = selectedTemplate || customDescription.trim()

  return (
    <Card className="bg-card text-card-foreground shadow-sm border-2 max-w-4xl mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <Workflow className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-semibold mb-2">Create Your Workflow</CardTitle>
        <p className="text-muted-foreground">
          Choose a template or describe your process in natural language, and AI will create an interactive workflow for you.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Template Selection */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-3">Choose a Workflow Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {workflowTemplates.map((template) => {
                const IconComponent = template.icon
                return (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${template.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h4 className="font-medium">{template.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      Example: "{template.example}"
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Custom Input Toggle */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleCustomToggle}
              className="inline-flex items-center gap-2"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showCustomInput ? 'rotate-180' : ''}`} />
              {showCustomInput ? 'Hide Custom Input' : 'Or Describe Your Own Process'}
            </Button>
          </div>

          {/* Custom Description Input */}
          {showCustomInput && (
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Describe Your Process</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tell us about your business process in natural language
                </p>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g., 'We run a restaurant and our process is: take orders, prepare food, serve customers, clean tables, process payments'"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="h-16 text-base pl-4 pr-16 rounded-lg border-2 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Create Button */}
        <div className="text-center">
          <Button 
            onClick={handleCreate}
            disabled={!canCreate || isCreating}
            className="h-12 px-8 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-medium"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Workflow...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Create Workflow
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </Button>
        </div>

        {/* Features */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Workflow className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm font-medium">AI-Powered</div>
              <div className="text-xs text-muted-foreground">AI creates and configures your workflow</div>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <ArrowRight className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-sm font-medium">Interactive</div>
              <div className="text-xs text-muted-foreground">Real-time workflow visualization and editing</div>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Bot className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-sm font-medium">Configurable</div>
              <div className="text-xs text-muted-foreground">Customize each step with specific features</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

