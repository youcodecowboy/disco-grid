/**
 * Mock Data Generator for AI Playground
 * Uses consistent mock database for realistic filtering/sorting/limiting
 */

import type { BlockType } from "@/lib/grid-v2/types"
import { detectDataSource, type DataSource } from './dataSourceMapper'
import { queryMockData, type QueryOptions } from './mockDatabase'

/**
 * Generate mock data for a chart component
 * Now uses the mock database for consistent data
 */
export function generateChartData(prompt: string, dataSource?: DataSource, limit?: number) {
  try {
    const source = dataSource || detectDataSource(prompt)
    
    // Map data source type to mock database
    let dbSource: 'sales' | 'revenue' | 'orders' | 'customers' = 'sales'
    switch (source.type) {
      case 'revenue':
        dbSource = 'revenue'
        break
      case 'sales':
        dbSource = 'sales'
        break
      case 'orders':
        dbSource = 'orders'
        break
      case 'customers':
      case 'users':
        dbSource = 'customers'
        break
      default:
        dbSource = 'sales'
    }
    
    // Query the mock database
    const queryOptions: QueryOptions = {
      limit: limit || 6,
      sortBy: 'date',
      sortOrder: 'asc'
    }
    
    console.log(`📊 Querying ${dbSource} with options:`, queryOptions)
    const records = queryMockData(dbSource, queryOptions)
    
    if (!records || records.length === 0) {
      console.warn(`⚠️  No records found for ${dbSource}, using fallback`)
      throw new Error('No records found')
    }
    
    // Transform to chart format and validate
    const data = records.map(record => ({
      date: record.month || 'Unknown',
      value: record.value || 0
    }))
    
    // Validate that we have valid data
    const hasInvalidData = data.some(item => item.value === undefined || item.date === undefined)
    if (hasInvalidData) {
      console.error('❌ Invalid data detected:', data)
      throw new Error('Generated data contains undefined values')
    }
    
    console.log(`✅ Generated ${data.length} chart data points from ${dbSource}`)
    console.log('   Sample data:', data.slice(0, 3))
    
    return data
  } catch (error) {
    console.error('❌ Error generating chart data:', error)
    console.log('🔄 Falling back to simple mock data')
    
    // Fallback: Generate simple mock data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const count = Math.min(limit || 6, months.length)
    const fallbackData = months.slice(0, count).map((month, i) => ({
      date: month,
      value: Math.round(45000 + (i * 2000) + (Math.random() * 5000))
    }))
    
    console.log('✅ Fallback data generated:', fallbackData.length, 'points')
    console.log('   Sample:', fallbackData.slice(0, 2))
    return fallbackData
  }
}

/**
 * Generate mock data for a table component
 */
export function generateTableData(prompt: string, dataSource?: DataSource) {
  const source = dataSource || detectDataSource(prompt)
  
  let columns, data
  
  switch (source.type) {
    case 'customers':
      columns = [
        { id: 'name', name: 'Name', type: 'text' as const, width: 150 },
        { id: 'email', name: 'Email', type: 'text' as const, width: 200 },
        { id: 'company', name: 'Company', type: 'text' as const, width: 150 },
        { id: 'status', name: 'Status', type: 'status' as const, width: 120 },
        { id: 'lifetime_value', name: 'Lifetime Value', type: 'number' as const, width: 130 },
      ]
      
      const customerNames = ['Sarah Johnson', 'Mike Williams', 'Emily Chen', 'David Martinez', 'Jessica Lee', 'Robert Taylor', 'Amanda Brown', 'Chris Anderson']
      const companies = ['Acme Corp', 'TechStart Inc', 'GlobalCo Ltd', 'SmartSys', 'FutureInc', 'DataFlow', 'CloudVision']
      const customerStatuses = ['active', 'inactive', 'pending']
      
      data = Array.from({ length: 8 }, (_, i) => ({
        id: `row-${i}`,
        name: customerNames[i % customerNames.length],
        email: customerNames[i % customerNames.length].toLowerCase().replace(' ', '.') + '@example.com',
        company: companies[i % companies.length],
        status: i < 6 ? 'active' : customerStatuses[Math.floor(Math.random() * customerStatuses.length)],
        lifetime_value: Math.round(5000 + Math.random() * 45000)
      }))
      break
    
    case 'orders':
      columns = [
        { id: 'orderId', name: 'Order ID', type: 'text' as const, width: 120 },
        { id: 'customer', name: 'Customer', type: 'text' as const, width: 150 },
        { id: 'amount', name: 'Amount', type: 'number' as const, width: 120 },
        { id: 'status', name: 'Status', type: 'status' as const, width: 120 },
        { id: 'date', name: 'Date', type: 'date' as const, width: 120 },
      ]
      
      const orderCustomers = ['Acme Corp', 'TechStart Inc', 'Global Industries', 'Smart Solutions', 'Future Systems', 'DataFlow Inc']
      const orderStatuses = ['completed', 'pending', 'processing', 'shipped']
      
      data = Array.from({ length: 8 }, (_, i) => ({
        id: `row-${i}`,
        orderId: `ORD-${1000 + i}`,
        customer: orderCustomers[i % orderCustomers.length],
        amount: Math.round(500 + Math.random() * 5000),
        status: orderStatuses[i % orderStatuses.length],
        date: new Date(2024, 9, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0]
      }))
      break
    
    case 'products':
      columns = [
        { id: 'product', name: 'Product', type: 'text' as const, width: 180 },
        { id: 'sku', name: 'SKU', type: 'text' as const, width: 120 },
        { id: 'category', name: 'Category', type: 'text' as const, width: 120 },
        { id: 'stock', name: 'Stock', type: 'number' as const, width: 100 },
        { id: 'price', name: 'Price', type: 'number' as const, width: 100 },
      ]
      
      const products = [
        { name: 'Widget Pro', category: 'Electronics' },
        { name: 'Smart Device X', category: 'Technology' },
        { name: 'Premium Kit', category: 'Bundles' },
        { name: 'Standard Unit', category: 'Hardware' },
        { name: 'Deluxe Package', category: 'Bundles' },
        { name: 'Mini Gadget', category: 'Electronics' },
        { name: 'Power Tool', category: 'Hardware' },
        { name: 'Smart Sensor', category: 'Technology' }
      ]
      
      data = products.map((product, i) => ({
        id: `row-${i}`,
        product: product.name,
        sku: `SKU-${1000 + i}`,
        category: product.category,
        stock: Math.round(10 + Math.random() * 500),
        price: Math.round(50 + Math.random() * 500)
      }))
      break
    
    case 'users':
      columns = [
        { id: 'username', name: 'Username', type: 'text' as const, width: 150 },
        { id: 'email', name: 'Email', type: 'text' as const, width: 200 },
        { id: 'role', name: 'Role', type: 'text' as const, width: 120 },
        { id: 'status', name: 'Status', type: 'status' as const, width: 120 },
        { id: 'last_login', name: 'Last Login', type: 'date' as const, width: 120 },
      ]
      
      const usernames = ['jsmith', 'sjohnson', 'mwilliams', 'ebrown', 'djones', 'ldavis', 'rtaylor', 'aclark']
      const roles = ['Admin', 'Editor', 'Viewer', 'Manager']
      const userStatuses = ['active', 'active', 'active', 'active', 'active', 'inactive', 'pending', 'active']
      
      data = Array.from({ length: 8 }, (_, i) => ({
        id: `row-${i}`,
        username: usernames[i],
        email: `${usernames[i]}@company.com`,
        role: roles[i % roles.length],
        status: userStatuses[i],
        last_login: new Date(2024, 9, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0]
      }))
      break
    
    case 'transactions':
      columns = [
        { id: 'transactionId', name: 'Transaction ID', type: 'text' as const, width: 140 },
        { id: 'type', name: 'Type', type: 'text' as const, width: 100 },
        { id: 'amount', name: 'Amount', type: 'number' as const, width: 120 },
        { id: 'status', name: 'Status', type: 'status' as const, width: 120 },
        { id: 'date', name: 'Date', type: 'date' as const, width: 120 },
      ]
      
      const transactionTypes = ['Payment', 'Refund', 'Transfer', 'Withdrawal']
      const transactionStatuses = ['completed', 'pending', 'failed']
      
      data = Array.from({ length: 8 }, (_, i) => ({
        id: `row-${i}`,
        transactionId: `TXN-${10000 + i}`,
        type: transactionTypes[i % transactionTypes.length],
        amount: Math.round(100 + Math.random() * 2000),
        status: i < 6 ? 'completed' : transactionStatuses[Math.floor(Math.random() * transactionStatuses.length)],
        date: new Date(2024, 9, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0]
      }))
      break
    
    case 'employees':
      columns = [
        { id: 'name', name: 'Name', type: 'text' as const, width: 150 },
        { id: 'department', name: 'Department', type: 'text' as const, width: 130 },
        { id: 'position', name: 'Position', type: 'text' as const, width: 150 },
        { id: 'status', name: 'Status', type: 'status' as const, width: 120 },
        { id: 'start_date', name: 'Start Date', type: 'date' as const, width: 120 },
      ]
      
      const employeeNames = ['John Smith', 'Sarah Williams', 'Mike Johnson', 'Emily Davis', 'David Brown', 'Lisa Taylor', 'Robert Wilson', 'Amanda Lee']
      const departments = ['Engineering', 'Sales', 'Marketing', 'Operations']
      const positions = ['Senior Developer', 'Account Manager', 'Marketing Specialist', 'Operations Lead']
      
      data = Array.from({ length: 8 }, (_, i) => ({
        id: `row-${i}`,
        name: employeeNames[i],
        department: departments[i % departments.length],
        position: positions[i % positions.length],
        status: 'active',
        start_date: new Date(2022 + Math.floor(i / 3), Math.floor(Math.random() * 12), 1).toISOString().split('T')[0]
      }))
      break
    
    case 'projects':
      columns = [
        { id: 'project', name: 'Project', type: 'text' as const, width: 180 },
        { id: 'owner', name: 'Owner', type: 'text' as const, width: 130 },
        { id: 'progress', name: 'Progress', type: 'number' as const, width: 100 },
        { id: 'status', name: 'Status', type: 'status' as const, width: 120 },
        { id: 'due_date', name: 'Due Date', type: 'date' as const, width: 120 },
      ]
      
      const projectNames = ['Website Redesign', 'Mobile App Launch', 'API Integration', 'Marketing Campaign', 'Product Development', 'Infrastructure Upgrade', 'Customer Portal', 'Analytics Dashboard']
      const owners = ['Sarah J.', 'Mike W.', 'Emily C.', 'David M.']
      const projectStatuses = ['in_progress', 'completed', 'on_hold', 'pending']
      
      data = Array.from({ length: 8 }, (_, i) => ({
        id: `row-${i}`,
        project: projectNames[i],
        owner: owners[i % owners.length],
        progress: Math.round(20 + Math.random() * 75),
        status: projectStatuses[i % projectStatuses.length],
        due_date: new Date(2024, 10 + Math.floor(i / 2), 15).toISOString().split('T')[0]
      }))
      break
    
    case 'leads':
      columns = [
        { id: 'company', name: 'Company', type: 'text' as const, width: 150 },
        { id: 'contact', name: 'Contact', type: 'text' as const, width: 140 },
        { id: 'value', name: 'Est. Value', type: 'number' as const, width: 120 },
        { id: 'status', name: 'Status', type: 'status' as const, width: 120 },
        { id: 'created', name: 'Created', type: 'date' as const, width: 120 },
      ]
      
      const leadCompanies = ['TechCorp Inc', 'Innovation Labs', 'Digital Dynamics', 'Future Solutions', 'Smart Systems', 'Cloud Ventures', 'Data Insights', 'AI Innovations']
      const contacts = ['John D.', 'Sarah M.', 'Mike T.', 'Emily R.', 'David K.', 'Lisa P.', 'Robert H.', 'Amanda S.']
      const leadStatuses = ['qualified', 'contacted', 'negotiating', 'proposal']
      
      data = Array.from({ length: 8 }, (_, i) => ({
        id: `row-${i}`,
        company: leadCompanies[i],
        contact: contacts[i],
        value: Math.round(10000 + Math.random() * 90000),
        status: leadStatuses[i % leadStatuses.length],
        created: new Date(2024, 9, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0]
      }))
      break
    
    case 'invoices':
      columns = [
        { id: 'invoiceId', name: 'Invoice #', type: 'text' as const, width: 120 },
        { id: 'client', name: 'Client', type: 'text' as const, width: 150 },
        { id: 'amount', name: 'Amount', type: 'number' as const, width: 120 },
        { id: 'status', name: 'Status', type: 'status' as const, width: 120 },
        { id: 'due_date', name: 'Due Date', type: 'date' as const, width: 120 },
      ]
      
      const clients = ['Acme Corp', 'TechStart', 'GlobalCo', 'SmartSys', 'FutureInc', 'DataFlow', 'CloudVision', 'AI Solutions']
      const invoiceStatuses = ['paid', 'pending', 'overdue']
      
      data = Array.from({ length: 8 }, (_, i) => ({
        id: `row-${i}`,
        invoiceId: `INV-${2024}${String(i + 1).padStart(4, '0')}`,
        client: clients[i],
        amount: Math.round(1000 + Math.random() * 9000),
        status: invoiceStatuses[i % invoiceStatuses.length],
        due_date: new Date(2024, 10, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0]
      }))
      break
    
    default:
      // Generic data table
      columns = [
        { id: 'name', name: 'Name', type: 'text' as const, width: 150 },
        { id: 'value', name: 'Value', type: 'number' as const, width: 120 },
        { id: 'status', name: 'Status', type: 'status' as const, width: 120 },
        { id: 'date', name: 'Date', type: 'date' as const, width: 120 },
      ]
      
      const statuses = ['active', 'inactive', 'pending']
      
      data = Array.from({ length: 8 }, (_, i) => ({
        id: `row-${i}`,
        name: `Item ${i + 1}`,
        value: Math.round(100 + Math.random() * 900),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        date: new Date(2024, 9, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0]
      }))
  }
  
  return { columns, data }
}

/**
 * Generate mock data for a metric component
 */
export function generateMetricData(prompt: string, dataSource?: DataSource) {
  const source = dataSource || detectDataSource(prompt)
  
  let value: string
  let delta: string
  
  switch (source.type) {
    case 'revenue':
    case 'sales':
      const revenueValue = 50000 + Math.random() * 150000
      value = `$${(revenueValue / 1000).toFixed(1)}k`
      delta = `+${(5 + Math.random() * 15).toFixed(1)}%`
      break
    
    case 'customers':
      const customerCount = Math.round(500 + Math.random() * 2000)
      value = customerCount.toLocaleString()
      delta = `+${Math.round(10 + Math.random() * 50)}`
      break
    
    case 'users':
      const userCount = Math.round(1000 + Math.random() * 5000)
      value = userCount.toLocaleString()
      delta = `+${Math.round(20 + Math.random() * 100)}`
      break
    
    case 'orders':
      const orderCount = Math.round(100 + Math.random() * 900)
      value = orderCount.toLocaleString()
      delta = `+${(3 + Math.random() * 12).toFixed(1)}%`
      break
    
    case 'products':
      const productCount = Math.round(50 + Math.random() * 200)
      value = productCount.toLocaleString()
      delta = `+${Math.round(5 + Math.random() * 15)}`
      break
    
    case 'transactions':
      const transactionCount = Math.round(200 + Math.random() * 800)
      value = transactionCount.toLocaleString()
      delta = `+${(4 + Math.random() * 16).toFixed(1)}%`
      break
    
    case 'leads':
      const leadCount = Math.round(30 + Math.random() * 120)
      value = leadCount.toLocaleString()
      delta = `+${Math.round(2 + Math.random() * 10)}`
      break
    
    case 'projects':
      const projectCount = Math.round(5 + Math.random() * 25)
      value = projectCount.toLocaleString()
      delta = `+${Math.round(1 + Math.random() * 5)}`
      break
    
    default:
      const genericValue = Math.round(1000 + Math.random() * 9000)
      value = genericValue.toLocaleString()
      delta = `+${(5 + Math.random() * 20).toFixed(1)}%`
  }
  
  // Generate trend data
  const trend = Array.from({ length: 7 }, () => Math.round(10 + Math.random() * 20))
  
  return {
    value,
    delta,
    trend
  }
}

/**
 * Generate mock props for any component type
 */
export function generateMockProps(componentType: BlockType, prompt: string): Record<string, any> {
  switch (componentType) {
    case 'chart.area.interactive':
      return {
        data: generateChartData(prompt)
      }
    
    case 'table.malleable':
      return generateTableData(prompt)
    
    case 'metric.kpi':
      return generateMetricData(prompt)
    
    default:
      return {}
  }
}

