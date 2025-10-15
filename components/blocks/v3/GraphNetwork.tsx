"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface NetworkNode {
  id: string
  label: string
  group: number // for color coding
  size?: number // relative size
}

interface NetworkEdge {
  source: string
  target: string
  weight?: number // thickness
}

interface NetworkGraphV3Props {
  title?: string
  nodes?: NetworkNode[]
  edges?: NetworkEdge[]
}

// Generate default network data (e.g., team collaboration network)
function generateDefaultData(): { nodes: NetworkNode[]; edges: NetworkEdge[] } {
  const nodes: NetworkNode[] = [
    // Core team (group 0)
    { id: 'ceo', label: 'CEO', group: 0, size: 25 },
    { id: 'cto', label: 'CTO', group: 0, size: 22 },
    { id: 'cfo', label: 'CFO', group: 0, size: 20 },
    
    // Engineering (group 1)
    { id: 'eng1', label: 'Senior Dev', group: 1, size: 18 },
    { id: 'eng2', label: 'Dev Lead', group: 1, size: 18 },
    { id: 'eng3', label: 'Frontend', group: 1, size: 15 },
    { id: 'eng4', label: 'Backend', group: 1, size: 15 },
    
    // Design (group 2)
    { id: 'des1', label: 'Lead Designer', group: 2, size: 18 },
    { id: 'des2', label: 'UI Designer', group: 2, size: 15 },
    
    // Marketing (group 3)
    { id: 'mkt1', label: 'Marketing Head', group: 3, size: 18 },
    { id: 'mkt2', label: 'Content', group: 3, size: 15 },
    
    // Sales (group 4)
    { id: 'sales1', label: 'Sales Lead', group: 4, size: 18 },
    { id: 'sales2', label: 'Account Mgr', group: 4, size: 15 },
  ]

  const edges: NetworkEdge[] = [
    // CEO connections
    { source: 'ceo', target: 'cto', weight: 5 },
    { source: 'ceo', target: 'cfo', weight: 5 },
    { source: 'ceo', target: 'mkt1', weight: 3 },
    { source: 'ceo', target: 'sales1', weight: 3 },
    
    // CTO to engineering
    { source: 'cto', target: 'eng1', weight: 4 },
    { source: 'cto', target: 'eng2', weight: 4 },
    { source: 'cto', target: 'des1', weight: 3 },
    
    // Engineering team
    { source: 'eng1', target: 'eng3', weight: 3 },
    { source: 'eng1', target: 'eng4', weight: 3 },
    { source: 'eng2', target: 'eng3', weight: 3 },
    { source: 'eng2', target: 'eng4', weight: 3 },
    { source: 'eng3', target: 'des2', weight: 4 },
    
    // Design team
    { source: 'des1', target: 'des2', weight: 4 },
    { source: 'des1', target: 'eng3', weight: 3 },
    
    // Marketing and Sales
    { source: 'mkt1', target: 'mkt2', weight: 3 },
    { source: 'mkt1', target: 'sales1', weight: 4 },
    { source: 'sales1', target: 'sales2', weight: 3 },
    { source: 'cfo', target: 'sales1', weight: 2 },
  ]

  return { nodes, edges }
}

// Group colors
const groupColors = [
  'rgb(239, 68, 68)',    // Red - Leadership
  'rgb(59, 130, 246)',   // Blue - Engineering
  'rgb(168, 85, 247)',   // Purple - Design
  'rgb(34, 197, 94)',    // Green - Marketing
  'rgb(251, 146, 60)',   // Orange - Sales
  'rgb(236, 72, 153)',   // Pink - Other
]

export default function GraphNetworkV3({ title, nodes, edges }: NetworkGraphV3Props) {
  const { nodes: networkNodes, edges: networkEdges } = nodes && edges 
    ? { nodes, edges } 
    : generateDefaultData()
  
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null)
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({})

  // Layout: Force-directed simulation (simplified)
  useEffect(() => {
    const width = 600
    const height = 400
    const centerX = width / 2
    const centerY = height / 2

    // Simple circular layout grouped by group
    const groups = new Set(networkNodes.map(n => n.group))
    const groupCount = groups.size
    const positions: Record<string, { x: number; y: number }> = {}

    const nodesByGroup: Record<number, NetworkNode[]> = {}
    networkNodes.forEach(node => {
      if (!nodesByGroup[node.group]) nodesByGroup[node.group] = []
      nodesByGroup[node.group].push(node)
    })

    Object.entries(nodesByGroup).forEach(([groupStr, groupNodes]) => {
      const group = parseInt(groupStr)
      const groupAngle = (2 * Math.PI / groupCount) * group
      const groupRadius = 120
      const groupCenterX = centerX + groupRadius * Math.cos(groupAngle)
      const groupCenterY = centerY + groupRadius * Math.sin(groupAngle)

      groupNodes.forEach((node, i) => {
        const angle = (2 * Math.PI / groupNodes.length) * i
        const radius = 40
        positions[node.id] = {
          x: groupCenterX + radius * Math.cos(angle),
          y: groupCenterY + radius * Math.sin(angle),
        }
      })
    })

    setNodePositions(positions)
  }, [networkNodes])

  // Calculate stats
  const totalConnections = networkEdges.length
  const avgConnections = (totalConnections * 2) / networkNodes.length

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-slate-600">
                <span className="font-semibold text-slate-900">{networkNodes.length}</span> nodes
              </div>
              <div className="text-slate-600">
                <span className="font-semibold text-slate-900">{totalConnections}</span> connections
              </div>
              <div className="text-slate-600">
                Avg: <span className="font-semibold text-slate-900">{avgConnections.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Graph */}
      <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-slate-50">
        <svg
          viewBox="0 0 600 400"
          className="w-full h-full"
          style={{ maxWidth: '700px', maxHeight: '500px' }}
        >
          {/* Edges */}
          <g>
            {networkEdges.map((edge, i) => {
              const source = nodePositions[edge.source]
              const target = nodePositions[edge.target]
              
              if (!source || !target) return null

              const edgeId = `${edge.source}-${edge.target}`
              const isHovered = hoveredEdge === edgeId || 
                              hoveredNode === edge.source || 
                              hoveredNode === edge.target
              const strokeWidth = (edge.weight || 1) * 1.5

              return (
                <motion.line
                  key={edgeId}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHovered ? 'rgb(100, 116, 139)' : 'rgb(203, 213, 225)'}
                  strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: i * 0.02 }}
                  onMouseEnter={() => setHoveredEdge(edgeId)}
                  onMouseLeave={() => setHoveredEdge(null)}
                  className="cursor-pointer"
                />
              )
            })}
          </g>

          {/* Nodes */}
          <g>
            {networkNodes.map((node, i) => {
              const pos = nodePositions[node.id]
              if (!pos) return null

              const isHovered = hoveredNode === node.id
              const color = groupColors[node.group % groupColors.length]
              const radius = node.size || 15

              // Check if this node is connected to hovered node
              const isConnected = hoveredNode && networkEdges.some(
                e => (e.source === hoveredNode && e.target === node.id) ||
                     (e.target === hoveredNode && e.source === node.id)
              )

              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer"
                >
                  {/* Outer ring for hover */}
                  {(isHovered || isConnected) && (
                    <motion.circle
                      cx={pos.x}
                      cy={pos.y}
                      r={radius + 6}
                      fill="none"
                      stroke={color}
                      strokeWidth={2}
                      opacity={0.5}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}

                  {/* Node circle */}
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius}
                    fill={color}
                    stroke="white"
                    strokeWidth={3}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.05 + 0.3 }}
                    className={isHovered ? 'drop-shadow-xl' : 'drop-shadow-md'}
                  />

                  {/* Node label */}
                  <motion.text
                    x={pos.x}
                    y={pos.y + radius + 14}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-slate-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.05 + 0.5 }}
                  >
                    {node.label}
                  </motion.text>

                  {/* Hover tooltip with connection count */}
                  {isHovered && (() => {
                    const connections = networkEdges.filter(
                      e => e.source === node.id || e.target === node.id
                    ).length

                    return (
                      <motion.g
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <rect
                          x={pos.x - 50}
                          y={pos.y - radius - 40}
                          width={100}
                          height={30}
                          fill="rgb(15, 23, 42)"
                          rx={6}
                          className="drop-shadow-xl"
                        />
                        <text
                          x={pos.x}
                          y={pos.y - radius - 20}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-bold fill-white"
                        >
                          {connections} connection{connections !== 1 ? 's' : ''}
                        </text>
                      </motion.g>
                    )
                  })()}
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {/* Legend Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {Array.from(new Set(networkNodes.map(n => n.group))).map(group => {
            const groupNode = networkNodes.find(n => n.group === group)
            if (!groupNode) return null
            
            const color = groupColors[group % groupColors.length]
            const groupNames = ['Leadership', 'Engineering', 'Design', 'Marketing', 'Sales', 'Other']
            
            return (
              <div key={group} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-slate-600">{groupNames[group] || `Group ${group}`}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


