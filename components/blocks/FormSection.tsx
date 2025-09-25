"use client"

interface FormSectionProps {
  title?: string
  data?: {
    heading?: string
    description?: string
    divider?: boolean
    spacing?: "sm" | "md" | "lg"
  }
}

export default function FormSection({ 
  title = "Form Section", 
  data = {} 
}: FormSectionProps) {
  const { 
    heading = "Section Title",
    description = "",
    divider = true,
    spacing = "md"
  } = data

  const spacingClasses = {
    sm: "py-2",
    md: "py-4", 
    lg: "py-6"
  }

  return (
    <div 
      className={`${spacingClasses[spacing]} ${divider ? 'border-t border-border' : ''}`}
      style={{ containerType: "inline-size" }}
    >
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{heading}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}
