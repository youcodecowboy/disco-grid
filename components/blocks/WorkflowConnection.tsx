"use client"


interface WorkflowConnectionProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
  isActive?: boolean
  isCompleted?: boolean
  className?: string
}

export default function WorkflowConnection({
  from,
  to,
  isActive = false,
  isCompleted = false,
  className = ""
}: WorkflowConnectionProps) {
  // Calculate connection path
  const getConnectionPath = () => {
    const startX = from.x + 100 // Center of source card
    const startY = from.y + 60  // Bottom of source card
    const endX = to.x + 100     // Center of target card
    const endY = to.y + 20      // Top of target card

    // Create a curved path
    const midY = startY + (endY - startY) / 2
    const controlY = midY - 20

    return `M ${startX} ${startY} Q ${startX} ${controlY} ${endX} ${endY}`
  }

  const getConnectionColor = () => {
    if (isCompleted) return '#10b981' // green-500
    if (isActive) return '#3b82f6'    // blue-500
    return '#d1d5db'                  // gray-300
  }

  const getConnectionWidth = () => {
    if (isActive) return 3
    return 2
  }

  return (
    <svg
      className={`absolute pointer-events-none ${className}`}
      style={{
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}
    >
      <defs>
        <marker
          id={`arrowhead-${isActive ? 'active' : 'inactive'}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={getConnectionColor()}
          />
        </marker>
      </defs>
      
      <path
        d={getConnectionPath()}
        stroke={getConnectionColor()}
        strokeWidth={getConnectionWidth()}
        fill="none"
        strokeDasharray={isActive ? "0" : "5,5"}
        markerEnd={`url(#arrowhead-${isActive ? 'active' : 'inactive'})`}
        className={`transition-all duration-500 ${
          isActive ? 'animate-pulse' : ''
        }`}
      />
      
      {/* Animated flow indicator */}
      {isActive && (
        <circle
          r="3"
          fill={getConnectionColor()}
          className="animate-ping"
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={getConnectionPath()}
          />
        </circle>
      )}
    </svg>
  )
}

