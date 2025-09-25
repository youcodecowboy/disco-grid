"use client"

import { Upload, File, X } from "lucide-react"
import { useState } from "react"

interface FormUploadProps {
  title?: string
  data?: {
    label?: string
    required?: boolean
    helpText?: string
    accept?: string
    multiple?: boolean
    maxSize?: number
    maxFiles?: number
  }
}

export default function FormUpload({ 
  title = "File Upload", 
  data = {} 
}: FormUploadProps) {
  const { 
    label = "Upload Files",
    required = false,
    helpText = "Drag and drop files here or click to browse",
    accept = "*/*",
    multiple = false,
    maxSize = 10, // MB
    maxFiles = 1
  } = data

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles(prev => [...prev, ...files].slice(0, maxFiles))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles(prev => [...prev, ...files].slice(0, maxFiles))
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-2" style={{ containerType: "inline-size" }}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-border/80'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          required={required && uploadedFiles.length === 0}
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-foreground">{helpText}</div>
          <div className="text-xs text-muted-foreground">
            Max {maxSize}MB per file • {multiple ? `Up to ${maxFiles} files` : 'Single file'}
          </div>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-foreground">
            Uploaded Files ({uploadedFiles.length})
          </div>
          {uploadedFiles.map((file, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
            >
              <div className="flex items-center gap-2 min-w-0">
                <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-medium text-foreground truncate">
                    {file.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
