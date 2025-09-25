"use client"

interface FormInputProps {
  title?: string
  data?: {
    label?: string
    placeholder?: string
    type?: "text" | "email" | "password" | "number" | "tel" | "url"
    required?: boolean
    value?: string
    helpText?: string
  }
}

export default function FormInput({ 
  title = "Text Input", 
  data = {} 
}: FormInputProps) {
  const { 
    label = "Input Label",
    placeholder = "Enter text...",
    type = "text",
    required = false,
    value = "",
    helpText = ""
  } = data

  return (
    <div className="space-y-1" style={{ containerType: "inline-size" }}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background 
                 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        required={required}
      />
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  )
}
