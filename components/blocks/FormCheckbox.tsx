"use client"

interface FormCheckboxProps {
  title?: string
  data?: {
    label?: string
    required?: boolean
    checked?: boolean
    helpText?: string
    options?: string[]
    type?: "single" | "multiple"
  }
}

export default function FormCheckbox({ 
  title = "Checkbox Input", 
  data = {} 
}: FormCheckboxProps) {
  const { 
    label = "Checkbox Label",
    required = false,
    checked = false,
    helpText = "",
    options = [],
    type = "single"
  } = data

  if (type === "multiple" && options.length > 0) {
    return (
      <div className="space-y-2" style={{ containerType: "inline-size" }}>
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`checkbox-${index}`}
                defaultChecked={false}
                className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor={`checkbox-${index}`} className="text-sm text-foreground">
                {option}
              </label>
            </div>
          ))}
        </div>
        {helpText && (
          <p className="text-xs text-muted-foreground">{helpText}</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-1" style={{ containerType: "inline-size" }}>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="single-checkbox"
          defaultChecked={checked}
          className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
          required={required}
        />
        <label htmlFor="single-checkbox" className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </div>
      {helpText && (
        <p className="text-xs text-muted-foreground ml-6">{helpText}</p>
      )}
    </div>
  )
}
