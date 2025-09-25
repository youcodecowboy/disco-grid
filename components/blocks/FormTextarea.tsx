"use client"

interface FormTextareaProps {
  title?: string
  data?: {
    label?: string
    placeholder?: string
    required?: boolean
    value?: string
    helpText?: string
    rows?: number
    maxLength?: number
  }
}

export default function FormTextarea({ 
  title = "Textarea Input", 
  data = {} 
}: FormTextareaProps) {
  const { 
    label = "Description",
    placeholder = "Enter details...",
    required = false,
    value = "",
    helpText = "",
    rows = 3,
    maxLength
  } = data

  return (
    <div className="space-y-1" style={{ containerType: "inline-size" }}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <textarea
        defaultValue={value}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background 
                 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
        required={required}
      />
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
      {maxLength && (
        <p className="text-xs text-muted-foreground text-right">
          0 / {maxLength} characters
        </p>
      )}
    </div>
  )
}
