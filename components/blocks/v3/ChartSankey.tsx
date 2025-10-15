"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

interface SankeyNode {
  id: string
  label: string
  value: number
  color: string
}

interface SankeyLink {
  source: string
  target: string
  value: number
}

interface SankeyV3Props {
  title?: string
  nodes?: SankeyNode[]
  links?: SankeyLink[]
}

// Generate default sankey data (e.g., customer journey or revenue flow)
function generateDefaultData(): { nodes: SankeyNode[]; links: SankeyLink[] } {
  const nodes: SankeyNode[] = [
    // Sources
    { id: 'organic', label: 'Organic Search', value: 450, color: 'rgb(34, 197, 94)' },
    { id: 'paid', label: 'Paid Ads', value: 320, color: 'rgb(59, 130, 246)' },
    { id: 'social', label: 'Social Media', value: 280, color: 'rgb(168, 85, 247)' },
    { id: 'referral', label: 'Referrals', value: 150, color: 'rgb(236, 72, 153)' },
    
    // Middle stages
    { id: 'landing', label: 'Landing Page', value: 700, color: 'rgb(251, 146, 60)' },
    { id: 'product', label: 'Product Page', value: 500, color: 'rgb(251, 146, 60)' },
    
    // Outcomes
    { id: 'signup', label: 'Sign Up', value: 350, color: 'rgb(132, 204, 22)' },
    { id: 'purchase', label: 'Purchase', value: 250, color: 'rgb(16, 185, 129)' },
    { id: 'bounce', label: 'Bounce', value: 600, color: 'rgb(239, 68, 68)' },
  ]

  const links: SankeyLink[] = [
    // Source to landing
    { source: 'organic', target: 'landing', value: 300 },
    { source: 'organic', target: 'product', value: 150 },
    { source: 'paid', target: 'landing', value: 200 },
    { source: 'paid', target: 'product', value: 120 },
    { source: 'social', target: 'landing', value: 200 },
    { source: 'social', target: 'product', value: 80 },
    { source: 'referral', target: 'product', value: 150 },
    
    // Landing/Product to outcomes
    { source: 'landing', target: 'signup', value: 200 },
    { source: 'landing', target: 'bounce', value: 500 },
    { source: 'product', target: 'signup', value: 150 },
    { source: 'product', target: 'purchase', value: 250 },
    { source: 'product', target: 'bounce', value: 100 },
  ]

  return { nodes, links }
}

export default function ChartSankeyV3({ title, nodes, links }: SankeyV3Props) {
  const { nodes: sankeyNodes, links: sankeyLinks } = nodes && links 
    ? { nodes, links } 
    : generateDefaultData()
  
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Calculate node positions (3 columns for this simplified layout)
  const columns = 3
  const nodesByColumn: Record<number, SankeyNode[]> = {}
  
  // Group nodes into columns based on their connections
  const sourceNodes = new Set(sankeyLinks.map(l => l.source))
  const targetNodes = new Set(sankeyLinks.map(l => l.target))
  const middleNodes = new Set<string>()
  
  sankeyLinks.forEach(link => {
    if (sourceNodes.has(link.target) && targetNodes.has(link.target)) {
      middleNodes.add(link.target)
    }
  })

  sankeyNodes.forEach(node => {
    if (middleNodes.has(node.id)) {
      nodesByColumn[1] = [...(nodesByColumn[1] || []), node]
    } else if (sourceNodes.has(node.id) && !targetNodes.has(node.id)) {
      nodesByColumn[0] = [...(nodesByColumn[0] || []), node]
    } else {
      nodesByColumn[2] = [...(nodesByColumn[2] || []), node]
    }
  })

  // Calculate total value for sizing
  const totalValue = sankeyNodes.reduce((sum, node) => sum + node.value, 0)
  const avgValue = totalValue / sankeyNodes.length

  // Layout constants
  const svgWidth = 800
  const svgHeight = 500
  const nodeWidth = 20
  const columnGap = (svgWidth - nodeWidth * columns) / (columns + 1)

  // Position nodes
  const nodePositions: Record<string, { x: number; y: number; height: number }> = {}
  
  Object.entries(nodesByColumn).forEach(([colIndex, colNodes]) => {
    const col = parseInt(colIndex)
    const x = columnGap + (col * (columnGap + nodeWidth))
    const totalColValue = colNodes.reduce((sum, n) => sum + n.value, 0)
    const availableHeight = svgHeight - 40
    let currentY = 20

    colNodes.forEach(node => {
      const heightRatio = node.value / totalColValue
      const height = Math.max(30, heightRatio * availableHeight)
      
      nodePositions[node.id] = { x, y: currentY, height }
      currentY += height + 10
    })
  })

  // Calculate link paths
  const getLinkPath = (link: SankeyLink): string => {
    const source = nodePositions[link.source]
    const target = nodePositions[link.target]
    
    if (!source || !target) return ''

    const sourceX = source.x + nodeWidth
    const sourceY = source.y + source.height / 2
    const targetX = target.x
    const targetY = target.y + target.height / 2

    const curvature = 0.5
    const xi = (targetX - sourceX) * curvature
    
    return `M${sourceX},${sourceY} C${sourceX + xi},${sourceY} ${targetX - xi},${targetY} ${targetX},${targetY}`
  }

  // Calculate stats
  const totalFlow = sankeyLinks.reduce((sum, link) => sum + link.value, 0)
  const avgFlowPerLink = Math.round(totalFlow / sankeyLinks.length)

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Title Header */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-slate-600">
                Total Flow: <span className="font-semibold text-slate-900">{totalFlow.toLocaleString()}</span>
              </div>
              <div className="text-slate-600">
                Avg: <span className="font-semibold text-slate-900">{avgFlowPerLink}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sankey Diagram */}
      <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-slate-50">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
          style={{ maxWidth: '800px', maxHeight: '500px' }}
        >
          {/* Links */}
          <g>
            {sankeyLinks.map((link, i) => {
              const source = sankeyNodes.find(n => n.id === link.source)
              const target = sankeyNodes.find(n => n.id === link.target)
              if (!source || !target) return null

              const linkId = `${link.source}-${link.target}`
              const isHovered = hoveredLink === linkId || hoveredNode === link.source || hoveredNode === link.target
              const strokeWidth = Math.max(2, (link.value / avgValue) * 20)

              return (
                <motion.path
                  key={linkId}
                  d={getLinkPath(link)}
                  fill="none"
                  stroke={source.color}
                  strokeWidth={strokeWidth}
                  opacity={isHovered ? 0.7 : 0.3}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredLink(linkId)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="cursor-pointer transition-opacity"
                />
              )
            })}
          </g>

          {/* Nodes */}
          <g>
            {sankeyNodes.map((node, i) => {
              const pos = nodePositions[node.id]
              if (!pos) return null

              const isHovered = hoveredNode === node.id

              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer"
                >
                  {/* Node rectangle */}
                  <motion.rect
                    x={pos.x}
                    y={pos.y}
                    width={nodeWidth}
                    height={pos.height}
                    fill={node.color}
                    rx={4}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={isHovered ? 'drop-shadow-lg' : 'drop-shadow-sm'}
                  />

                  {/* Node label */}
                  <motion.text
                    x={pos.x + nodeWidth + 8}
                    y={pos.y + pos.height / 2}
                    dominantBaseline="middle"
                    className="text-xs font-semibold fill-slate-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                  >
                    {node.label}
                  </motion.text>

                  {/* Node value */}
                  <motion.text
                    x={pos.x + nodeWidth + 8}
                    y={pos.y + pos.height / 2 + 14}
                    dominantBaseline="middle"
                    className="text-xs fill-slate-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                  >
                    {node.value.toLocaleString()}
                  </motion.text>

                  {/* Hover tooltip */}
                  {isHovered && (
                    <motion.g
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <rect
                        x={pos.x - 60}
                        y={pos.y - 40}
                        width={100}
                        height={30}
                        fill="rgb(15, 23, 42)"
                        rx={6}
                        className="drop-shadow-xl"
                      />
                      <text
                        x={pos.x - 10}
                        y={pos.y - 20}
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="text-xs font-bold fill-white"
                      >
                        {node.value.toLocaleString()} items
                      </text>
                    </motion.g>
                  )}
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {/* Legend Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
          <span>💡 Hover over nodes and links to highlight flows</span>
          <span>•</span>
          <span>Line thickness represents volume</span>
        </div>
      </div>
    </div>
  )
}


