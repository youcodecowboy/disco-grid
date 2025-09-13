"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    QrCode,
    Camera,
    FileText,
    CheckCircle,
    Settings,
    ArrowRight,
    Play,
    Pause,
    RotateCcw,
    Trash2,
    Clock,
    User,
    AlertCircle
} from 'lucide-react'

interface WorkflowCardProps {
  id: string
  title: string
  type: 'input' | 'process' | 'output' | 'decision'
  config: {
    qrScanning?: boolean
    photoInput?: boolean
    textInput?: boolean
    approval?: boolean
    notification?: boolean
  }
  isActive?: boolean
  isCompleted?: boolean
  onConfigChange?: (id: string, config: any) => void
  onToggle?: (id: string) => void
  onDelete?: (id: string) => void
  className?: string
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
}

export default function WorkflowCard({
  id,
  title,
  type,
  config,
  isActive = false,
  isCompleted = false,
  onConfigChange,
  onToggle,
  onDelete,
  className = "",
  draggable = false,
  onDragStart,
  onDragEnd
}: WorkflowCardProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  const getTypeIcon = () => {
    switch (type) {
      case 'input':
        return <FileText className="h-4 w-4" />
      case 'process':
        return <Settings className="h-4 w-4" />
      case 'output':
        return <CheckCircle className="h-4 w-4" />
      case 'decision':
        return <ArrowRight className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case 'input':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'process':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'output':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'decision':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-500'
    if (isActive) return 'bg-blue-500'
    return 'bg-gray-300'
  }

  const handleConfigToggle = (key: keyof typeof config) => {
    if (onConfigChange) {
      onConfigChange(id, {
        ...config,
        [key]: !config[key]
      })
    }
  }

  return (
    <Card 
      className={`relative transition-all duration-200 hover:shadow-md cursor-move group ${className}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Connection indicator */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
        <div className={`w-4 h-4 rounded-full border-2 border-white ${getStatusColor()}`} />
      </div>
      
      {/* Drag indicator */}
      {draggable && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded ${getTypeColor()}`}>
              {getTypeIcon()}
            </div>
            <div>
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <div className="text-xs text-muted-foreground capitalize">{type} Step</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
            >
              <Settings className="h-3 w-3" />
            </Button>
            {onToggle && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onToggle(id)}
              >
                {isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                onClick={() => onDelete(id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Configuration panel */}
        {isConfigOpen && (
          <div className="space-y-2 mb-3 p-2 bg-gray-50 rounded border">
            <div className="text-xs font-medium text-gray-600 mb-2">Configuration</div>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.qrScanning || false}
                  onChange={() => handleConfigToggle('qrScanning')}
                  className="rounded"
                />
                <QrCode className="h-3 w-3" />
                QR Scan
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.photoInput || false}
                  onChange={() => handleConfigToggle('photoInput')}
                  className="rounded"
                />
                <Camera className="h-3 w-3" />
                Photo
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.textInput || false}
                  onChange={() => handleConfigToggle('textInput')}
                  className="rounded"
                />
                <FileText className="h-3 w-3" />
                Text
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.approval || false}
                  onChange={() => handleConfigToggle('approval')}
                  className="rounded"
                />
                <CheckCircle className="h-3 w-3" />
                Approval
              </label>
            </div>
          </div>
        )}

        {/* Active features display */}
        <div className="flex flex-wrap gap-1">
          {config.qrScanning && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              <QrCode className="h-2 w-2 mr-1" />
              QR
            </Badge>
          )}
          {config.photoInput && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              <Camera className="h-2 w-2 mr-1" />
              Photo
            </Badge>
          )}
          {config.textInput && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              <FileText className="h-2 w-2 mr-1" />
              Text
            </Badge>
          )}
          {config.approval && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              <CheckCircle className="h-2 w-2 mr-1" />
              Approval
            </Badge>
          )}
        </div>

        {/* Step Details */}
        <div className="space-y-2 mt-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Est. 5-10 min</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <User className="h-3 w-3" />
              <span>1 person</span>
            </div>
          </div>
          
          {/* Priority indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-orange-600">Medium Priority</span>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <span className="text-xs text-gray-500">
              {isCompleted ? 'Completed' : isActive ? 'Active' : 'Ready'}
            </span>
          </div>
          {type === 'process' && (
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
