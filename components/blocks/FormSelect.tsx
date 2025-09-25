"use client"

interface FormSelectProps {
  title?: string
  data?: {
    label?: string
    placeholder?: string
    required?: boolean
    options?: string[]
    value?: string
    helpText?: string
    multiple?: boolean
  }
}

export default function FormSelect({ 
  title = "Select Input", 
  data = {} 
}: FormSelectProps) {
  const { 
    label = "Select Option",
    placeholder = "Choose an option...",
    required = false,
    options = ["Option 1", "Option 2", "Option 3"],
    value = "",
    helpText = "",
    multiple = false
  } = data

  return (
    <div className="space-y-1" style={{ containerType: "inline-size" }}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <select
        defaultValue={value}
        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background 
                 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        required={required}
        multiple={multiple}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  )
}
