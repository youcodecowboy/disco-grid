/**
 * Dashboard Generation API Endpoint
 * 
 * Generates complete dashboard layouts with multiple components
 * using LLM-powered intelligent design.
 */

import { NextRequest, NextResponse } from 'next/server'
import Together from 'together-ai'
import { DASHBOARD_GENERATION_PROMPT } from '../prompts/dashboardGeneration'

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
})

// Use PageTemplate-compatible types
type GridPos = {
  x: number
  y: number
  w: number
  h: number
  i: string
}

type Block = {
  id: string
  type: string
  title?: string
  props?: Record<string, any>
  extensions?: Block[]
}

type DashboardState = {
  mode: "edit" | "save"
  layout: GridPos[]
  blocks: Record<string, Block>
}

interface DashboardGenerationRequest {
  dashboardId: string
  dashboardName: string
  description: string
  dataSources: string[]
  layoutDensity: 'compact' | 'comfortable' | 'spacious'
  componentDataSources?: Record<string, string>
  additionalRequirements?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: DashboardGenerationRequest = await request.json()
    
    const {
      dashboardId,
      dashboardName,
      description,
      dataSources,
      layoutDensity = 'comfortable',
      componentDataSources = {},
      additionalRequirements = ''
    } = body

    if (!description || !description.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Description is required'
      }, { status: 400 })
    }

    // Build the user prompt
    const userPrompt = `
Dashboard Name: ${dashboardName}
Description: ${description}
Primary Data Sources: ${dataSources.join(', ')}
Layout Density: ${layoutDensity}
${componentDataSources && Object.keys(componentDataSources).length > 0 
  ? `Component-specific Data: ${JSON.stringify(componentDataSources)}` 
  : ''
}
${additionalRequirements ? `Additional Requirements: ${additionalRequirements}` : ''}

Create a complete dashboard layout following all guidelines and best practices.
`.trim()

    console.log('🎨 Generating dashboard:', dashboardName)
    console.log('📝 User prompt:', userPrompt)

    try {
      const response = await together.chat.completions.create({
        model: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
        messages: [
          {
            role: "system",
            content: DASHBOARD_GENERATION_PROMPT
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.4,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from LLM')
      }

      console.log('✅ LLM Response received')
      
      const parsed = JSON.parse(content)
      
      // Validate the response structure
      if (!parsed.layout || !parsed.blocks) {
        throw new Error('Invalid response structure: missing layout or blocks')
      }

      // Ensure all layout items have corresponding blocks
      const layoutIds = new Set(parsed.layout.map((item: any) => item.i))
      const blockIds = new Set(Object.keys(parsed.blocks))
      
      if (layoutIds.size !== blockIds.size) {
        console.warn('⚠️ Layout and blocks count mismatch')
      }

      // CRITICAL: Validate and fix data structures for V3 components
      Object.values(parsed.blocks).forEach((block: any) => {
        if (block.type.startsWith('v3.chart.')) {
          // Ensure charts have data arrays
          if (!block.props) block.props = {}
          if (!block.props.data || !Array.isArray(block.props.data) || block.props.data.length === 0) {
            console.warn(`⚠️ Fixing empty data for ${block.type}`)
            // Generate sample data based on chart type
            if (block.type === 'v3.chart.area' || block.type === 'v3.chart.bar') {
              block.props.data = [
                { name: 'Jan', value: 4500 },
                { name: 'Feb', value: 5200 },
                { name: 'Mar', value: 4800 },
                { name: 'Apr', value: 5500 },
                { name: 'May', value: 6200 },
                { name: 'Jun', value: 5800 }
              ]
            } else if (block.type === 'v3.chart.donut') {
              block.props.data = [
                { name: 'Completed', value: 65 },
                { name: 'In Progress', value: 25 },
                { name: 'Pending', value: 10 }
              ]
            }
          }
        } else if (block.type === 'v3.table') {
          // Ensure tables have columns and rows
          if (!block.props) block.props = {}
          if (!block.props.columns || !Array.isArray(block.props.columns) || block.props.columns.length === 0) {
            console.warn(`⚠️ Fixing empty table columns for ${block.id}`)
            block.props.columns = [
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'status', label: 'Status' }
            ]
          }
          if (!block.props.rows || !Array.isArray(block.props.rows) || block.props.rows.length === 0) {
            console.warn(`⚠️ Fixing empty table rows for ${block.id}`)
            block.props.rows = [
              { id: '#001', name: 'Item 1', status: 'Active' },
              { id: '#002', name: 'Item 2', status: 'Pending' },
              { id: '#003', name: 'Item 3', status: 'Completed' }
            ]
          }
        }
      })

      // Create the complete dashboard state
      const dashboardState: DashboardState = {
        layout: parsed.layout,
        blocks: parsed.blocks,
        mode: 'edit'
      }

      console.log('✨ Dashboard generated successfully:', {
        componentCount: parsed.layout.length,
        blockTypes: Object.values(parsed.blocks).map((b: any) => b.type)
      })

      return NextResponse.json({
        success: true,
        state: dashboardState,
        reasoning: parsed.reasoning || 'Dashboard generated successfully',
        metadata: {
          componentCount: parsed.layout.length,
          model: 'llama-3.2-3b',
          tokensUsed: response.usage?.total_tokens || 0
        }
      })

    } catch (llmError) {
      console.error('❌ LLM dashboard generation failed:', llmError)
      
      // FALLBACK: Create a simple default dashboard
      const fallbackState = createFallbackDashboard(
        dashboardName,
        description,
        dataSources,
        layoutDensity
      )

      return NextResponse.json({
        success: true,
        state: fallbackState,
        reasoning: 'Created using fallback template (LLM unavailable)',
        metadata: {
          componentCount: fallbackState.layout.length,
          model: 'fallback',
          tokensUsed: 0
        }
      })
    }

  } catch (error) {
    console.error('💥 Dashboard generation endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * Create a beautiful fallback dashboard when LLM fails
 * Uses V3 components and best practices with proper mock data
 */
function createFallbackDashboard(
  name: string,
  description: string,
  dataSources: string[],
  density: string
): DashboardState {
  const primaryDataSource = dataSources[0] || 'analytics'
  
  // Generate sample data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const areaChartData = months.slice(0, 8).map((name, i) => ({
    name,
    value: Math.floor(25000 + Math.random() * 15000 + i * 3000)
  }))
  
  const barChartData = [
    { name: 'Product A', value: 4500 },
    { name: 'Product B', value: 3800 },
    { name: 'Product C', value: 3200 },
    { name: 'Product D', value: 2900 },
    { name: 'Product E', value: 2400 }
  ]
  
  const donutChartData = [
    { name: 'Completed', value: 65 },
    { name: 'In Progress', value: 25 },
    { name: 'Pending', value: 10 }
  ]
  
  // Professional layout: KPIs on top, large chart, side-by-side charts, full-width table
  const layout: GridPos[] = [
    // Top row: 4 KPI cards (standard best practice)
    { i: 'kpi-1', x: 0, y: 0, w: 3, h: 4 },
    { i: 'kpi-2', x: 3, y: 0, w: 3, h: 4 },
    { i: 'kpi-3', x: 6, y: 0, w: 3, h: 4 },
    { i: 'kpi-4', x: 9, y: 0, w: 3, h: 4 },
    // Large prominent area chart
    { i: 'chart-primary', x: 0, y: 4, w: 12, h: 10 },
    // Side-by-side secondary charts
    { i: 'chart-bar', x: 0, y: 14, w: 6, h: 8 },
    { i: 'chart-donut', x: 6, y: 14, w: 6, h: 8 },
    // Full-width table at bottom
    { i: 'table-main', x: 0, y: 22, w: 12, h: 10 }
  ]

  const blocks: Record<string, Block> = {
    'kpi-1': {
      id: 'kpi-1',
      type: 'v3.kpi',
      title: 'Total Revenue',
      props: {
        title: 'Total Revenue',
        value: '$125,430',
        change: '+12.5%',
        trend: 'up',
        subtitle: 'vs last month'
      }
    },
    'kpi-2': {
      id: 'kpi-2',
      type: 'v3.kpi',
      title: 'Active Orders',
      props: {
        title: 'Active Orders',
        value: '1,234',
        change: '+8.2%',
        trend: 'up',
        subtitle: 'vs last month'
      }
    },
    'kpi-3': {
      id: 'kpi-3',
      type: 'v3.kpi',
      title: 'Completion Rate',
      props: {
        title: 'Completion Rate',
        value: '94.2%',
        change: '+2.1%',
        trend: 'up',
        subtitle: 'vs last month'
      }
    },
    'kpi-4': {
      id: 'kpi-4',
      type: 'v3.kpi',
      title: 'Customer Satisfaction',
      props: {
        title: 'Customer Satisfaction',
        value: '4.8/5',
        change: '+0.3',
        trend: 'up',
        subtitle: 'vs last month'
      }
    },
    'chart-primary': {
      id: 'chart-primary',
      type: 'v3.chart.area',
      title: `${name} - Performance Trends`,
      props: {
        data: areaChartData
      }
    },
    'chart-bar': {
      id: 'chart-bar',
      type: 'v3.chart.bar',
      title: 'Top Categories',
      props: {
        data: barChartData
      }
    },
    'chart-donut': {
      id: 'chart-donut',
      type: 'v3.chart.donut',
      title: 'Status Distribution',
      props: {
        data: donutChartData
      }
    },
    'table-main': {
      id: 'table-main',
      type: 'v3.table',
      title: 'Detailed Records',
      props: {
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
          { key: 'value', label: 'Value' }
        ],
        rows: [
          { id: '#001', name: 'Item Alpha', status: 'Active', value: '$2,400' },
          { id: '#002', name: 'Item Beta', status: 'Pending', value: '$1,850' },
          { id: '#003', name: 'Item Gamma', status: 'Completed', value: '$3,200' },
          { id: '#004', name: 'Item Delta', status: 'Active', value: '$1,950' },
          { id: '#005', name: 'Item Epsilon', status: 'Active', value: '$2,750' }
        ]
      }
    }
  }

  return { 
    layout, 
    blocks,
    mode: 'edit' as const
  }
}

