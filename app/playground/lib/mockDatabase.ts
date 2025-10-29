/**
 * Mock Database - Consistent data source for all components
 * 
 * This acts like a real database - components query and filter this data
 * instead of generating random data each time.
 */

export interface MockDataRecord {
  id: string
  date: string
  month: string
  monthNum: number
  year: number
  category: string
  value: number
  status: string
  name: string
}

/**
 * SALES DATA - 12 months of consistent sales data
 */
export const MOCK_SALES_DATA: MockDataRecord[] = [
  { id: 's1', date: '2024-01-15', month: 'Jan', monthNum: 1, year: 2024, category: 'Product A', value: 49344, status: 'completed', name: 'Product A' },
  { id: 's2', date: '2024-02-15', month: 'Feb', monthNum: 2, year: 2024, category: 'Product B', value: 46415, status: 'completed', name: 'Product B' },
  { id: 's3', date: '2024-03-15', month: 'Mar', monthNum: 3, year: 2024, category: 'Product C', value: 47285, status: 'completed', name: 'Product C' },
  { id: 's4', date: '2024-04-15', month: 'Apr', monthNum: 4, year: 2024, category: 'Product D', value: 45512, status: 'completed', name: 'Product D' },
  { id: 's5', date: '2024-05-15', month: 'May', monthNum: 5, year: 2024, category: 'Product E', value: 48890, status: 'completed', name: 'Product E' },
  { id: 's6', date: '2024-06-15', month: 'Jun', monthNum: 6, year: 2024, category: 'Product F', value: 51234, status: 'completed', name: 'Product F' },
  { id: 's7', date: '2024-07-15', month: 'Jul', monthNum: 7, year: 2024, category: 'Product G', value: 52100, status: 'completed', name: 'Product G' },
  { id: 's8', date: '2024-08-15', month: 'Aug', monthNum: 8, year: 2024, category: 'Product H', value: 50890, status: 'completed', name: 'Product H' },
  { id: 's9', date: '2024-09-15', month: 'Sep', monthNum: 9, year: 2024, category: 'Product I', value: 53400, status: 'completed', name: 'Product I' },
  { id: 's10', date: '2024-10-15', month: 'Oct', monthNum: 10, year: 2024, category: 'Product J', value: 54200, status: 'completed', name: 'Product J' },
  { id: 's11', date: '2024-11-15', month: 'Nov', monthNum: 11, year: 2024, category: 'Product K', value: 55600, status: 'completed', name: 'Product K' },
  { id: 's12', date: '2024-12-15', month: 'Dec', monthNum: 12, year: 2024, category: 'Product L', value: 58000, status: 'completed', name: 'Product L' },
]

/**
 * REVENUE DATA - 12 months by source
 */
export const MOCK_REVENUE_DATA: MockDataRecord[] = [
  { id: 'r1', date: '2024-01-15', month: 'Jan', monthNum: 1, year: 2024, category: 'Direct Sales', value: 49344, status: 'active', name: 'Direct Sales' },
  { id: 'r2', date: '2024-02-15', month: 'Feb', monthNum: 2, year: 2024, category: 'Partnerships', value: 46415, status: 'active', name: 'Partnerships' },
  { id: 'r3', date: '2024-03-15', month: 'Mar', monthNum: 3, year: 2024, category: 'Subscriptions', value: 47285, status: 'active', name: 'Subscriptions' },
  { id: 'r4', date: '2024-04-15', month: 'Apr', monthNum: 4, year: 2024, category: 'Consulting', value: 45512, status: 'active', name: 'Consulting' },
  { id: 'r5', date: '2024-05-15', month: 'May', monthNum: 5, year: 2024, category: 'Licenses', value: 48890, status: 'active', name: 'Licenses' },
  { id: 'r6', date: '2024-06-15', month: 'Jun', monthNum: 6, year: 2024, category: 'Services', value: 51234, status: 'active', name: 'Services' },
  { id: 'r7', date: '2024-07-15', month: 'Jul', monthNum: 7, year: 2024, category: 'E-commerce', value: 52100, status: 'active', name: 'E-commerce' },
  { id: 'r8', date: '2024-08-15', month: 'Aug', monthNum: 8, year: 2024, category: 'Affiliates', value: 50890, status: 'active', name: 'Affiliates' },
  { id: 'r9', date: '2024-09-15', month: 'Sep', monthNum: 9, year: 2024, category: 'Ads', value: 53400, status: 'active', name: 'Ads' },
  { id: 'r10', date: '2024-10-15', month: 'Oct', monthNum: 10, year: 2024, category: 'Sponsorships', value: 54200, status: 'active', name: 'Sponsorships' },
  { id: 'r11', date: '2024-11-15', month: 'Nov', monthNum: 11, year: 2024, category: 'Events', value: 55600, status: 'active', name: 'Events' },
  { id: 'r12', date: '2024-12-15', month: 'Dec', monthNum: 12, year: 2024, category: 'Training', value: 58000, status: 'active', name: 'Training' },
]

/**
 * ORDERS DATA - 24 orders
 */
export const MOCK_ORDERS_DATA: MockDataRecord[] = [
  { id: 'o1', date: '2024-01-05', month: 'Jan', monthNum: 1, year: 2024, category: 'Electronics', value: 1250, status: 'completed', name: 'Order #1001' },
  { id: 'o2', date: '2024-01-12', month: 'Jan', monthNum: 1, year: 2024, category: 'Clothing', value: 890, status: 'completed', name: 'Order #1002' },
  { id: 'o3', date: '2024-02-03', month: 'Feb', monthNum: 2, year: 2024, category: 'Home', value: 2100, status: 'completed', name: 'Order #1003' },
  { id: 'o4', date: '2024-02-18', month: 'Feb', monthNum: 2, year: 2024, category: 'Electronics', value: 3400, status: 'pending', name: 'Order #1004' },
  { id: 'o5', date: '2024-03-08', month: 'Mar', monthNum: 3, year: 2024, category: 'Sports', value: 1560, status: 'completed', name: 'Order #1005' },
  { id: 'o6', date: '2024-03-22', month: 'Mar', monthNum: 3, year: 2024, category: 'Books', value: 450, status: 'completed', name: 'Order #1006' },
  { id: 'o7', date: '2024-04-10', month: 'Apr', monthNum: 4, year: 2024, category: 'Electronics', value: 2890, status: 'shipped', name: 'Order #1007' },
  { id: 'o8', date: '2024-04-25', month: 'Apr', monthNum: 4, year: 2024, category: 'Clothing', value: 1200, status: 'completed', name: 'Order #1008' },
  { id: 'o9', date: '2024-05-14', month: 'May', monthNum: 5, year: 2024, category: 'Home', value: 3200, status: 'completed', name: 'Order #1009' },
  { id: 'o10', date: '2024-05-28', month: 'May', monthNum: 5, year: 2024, category: 'Electronics', value: 4100, status: 'completed', name: 'Order #1010' },
  { id: 'o11', date: '2024-06-07', month: 'Jun', monthNum: 6, year: 2024, category: 'Sports', value: 1890, status: 'processing', name: 'Order #1011' },
  { id: 'o12', date: '2024-06-19', month: 'Jun', monthNum: 6, year: 2024, category: 'Books', value: 670, status: 'completed', name: 'Order #1012' },
  { id: 'o13', date: '2024-07-11', month: 'Jul', monthNum: 7, year: 2024, category: 'Electronics', value: 5200, status: 'completed', name: 'Order #1013' },
  { id: 'o14', date: '2024-07-23', month: 'Jul', monthNum: 7, year: 2024, category: 'Clothing', value: 990, status: 'completed', name: 'Order #1014' },
  { id: 'o15', date: '2024-08-09', month: 'Aug', monthNum: 8, year: 2024, category: 'Home', value: 2700, status: 'completed', name: 'Order #1015' },
  { id: 'o16', date: '2024-08-21', month: 'Aug', monthNum: 8, year: 2024, category: 'Electronics', value: 3800, status: 'shipped', name: 'Order #1016' },
  { id: 'o17', date: '2024-09-05', month: 'Sep', monthNum: 9, year: 2024, category: 'Sports', value: 2100, status: 'completed', name: 'Order #1017' },
  { id: 'o18', date: '2024-09-17', month: 'Sep', monthNum: 9, year: 2024, category: 'Books', value: 520, status: 'completed', name: 'Order #1018' },
  { id: 'o19', date: '2024-10-12', month: 'Oct', monthNum: 10, year: 2024, category: 'Electronics', value: 4500, status: 'pending', name: 'Order #1019' },
  { id: 'o20', date: '2024-10-26', month: 'Oct', monthNum: 10, year: 2024, category: 'Clothing', value: 1100, status: 'completed', name: 'Order #1020' },
  { id: 'o21', date: '2024-11-08', month: 'Nov', monthNum: 11, year: 2024, category: 'Home', value: 3600, status: 'completed', name: 'Order #1021' },
  { id: 'o22', date: '2024-11-20', month: 'Nov', monthNum: 11, year: 2024, category: 'Electronics', value: 5100, status: 'completed', name: 'Order #1022' },
  { id: 'o23', date: '2024-12-10', month: 'Dec', monthNum: 12, year: 2024, category: 'Sports', value: 2300, status: 'processing', name: 'Order #1023' },
  { id: 'o24', date: '2024-12-22', month: 'Dec', monthNum: 12, year: 2024, category: 'Books', value: 780, status: 'completed', name: 'Order #1024' },
]

/**
 * CUSTOMERS DATA - 15 customers
 */
export const MOCK_CUSTOMERS_DATA: MockDataRecord[] = [
  { id: 'c1', date: '2024-01-10', month: 'Jan', monthNum: 1, year: 2024, category: 'Enterprise', value: 125000, status: 'active', name: 'Acme Corp' },
  { id: 'c2', date: '2024-02-15', month: 'Feb', monthNum: 2, year: 2024, category: 'SMB', value: 45000, status: 'active', name: 'TechStart Inc' },
  { id: 'c3', date: '2024-03-20', month: 'Mar', monthNum: 3, year: 2024, category: 'Enterprise', value: 180000, status: 'active', name: 'Global Industries' },
  { id: 'c4', date: '2024-04-05', month: 'Apr', monthNum: 4, year: 2024, category: 'Startup', value: 12000, status: 'active', name: 'Smart Solutions' },
  { id: 'c5', date: '2024-05-12', month: 'May', monthNum: 5, year: 2024, category: 'SMB', value: 67000, status: 'active', name: 'Future Systems' },
  { id: 'c6', date: '2024-06-18', month: 'Jun', monthNum: 6, year: 2024, category: 'Enterprise', value: 210000, status: 'active', name: 'DataFlow Inc' },
  { id: 'c7', date: '2024-07-22', month: 'Jul', monthNum: 7, year: 2024, category: 'Startup', value: 8900, status: 'inactive', name: 'CloudVision' },
  { id: 'c8', date: '2024-08-08', month: 'Aug', monthNum: 8, year: 2024, category: 'SMB', value: 52000, status: 'active', name: 'AI Solutions' },
  { id: 'c9', date: '2024-09-14', month: 'Sep', monthNum: 9, year: 2024, category: 'Enterprise', value: 195000, status: 'active', name: 'Innovation Labs' },
  { id: 'c10', date: '2024-10-20', month: 'Oct', monthNum: 10, year: 2024, category: 'Startup', value: 15000, status: 'pending', name: 'Digital Dynamics' },
  { id: 'c11', date: '2024-11-05', month: 'Nov', monthNum: 11, year: 2024, category: 'SMB', value: 78000, status: 'active', name: 'Smart Systems' },
  { id: 'c12', date: '2024-12-12', month: 'Dec', monthNum: 12, year: 2024, category: 'Enterprise', value: 230000, status: 'active', name: 'Cloud Ventures' },
  { id: 'c13', date: '2024-01-25', month: 'Jan', monthNum: 1, year: 2024, category: 'Startup', value: 9500, status: 'inactive', name: 'Data Insights' },
  { id: 'c14', date: '2024-03-30', month: 'Mar', monthNum: 3, year: 2024, category: 'SMB', value: 58000, status: 'active', name: 'Tech Innovations' },
  { id: 'c15', date: '2024-05-28', month: 'May', monthNum: 5, year: 2024, category: 'Enterprise', value: 175000, status: 'active', name: 'Future Corp' },
]

/**
 * Query the mock database with filters
 */
export interface QueryOptions {
  limit?: number
  sortBy?: 'value' | 'date' | 'name'
  sortOrder?: 'asc' | 'desc'
  filterMonth?: number
  filterStatus?: string
  filterCategory?: string
}

export function queryMockData(
  dataSource: 'sales' | 'revenue' | 'orders' | 'customers',
  options: QueryOptions = {}
): MockDataRecord[] {
  // Get the base dataset
  let data: MockDataRecord[]
  switch (dataSource) {
    case 'sales':
      data = [...MOCK_SALES_DATA]
      break
    case 'revenue':
      data = [...MOCK_REVENUE_DATA]
      break
    case 'orders':
      data = [...MOCK_ORDERS_DATA]
      break
    case 'customers':
      data = [...MOCK_CUSTOMERS_DATA]
      break
    default:
      data = [...MOCK_SALES_DATA]
  }

  // Apply filters
  if (options.filterMonth !== undefined) {
    data = data.filter(record => record.monthNum === options.filterMonth)
  }
  if (options.filterStatus) {
    data = data.filter(record => record.status === options.filterStatus)
  }
  if (options.filterCategory) {
    data = data.filter(record => record.category === options.filterCategory)
  }

  // Apply sorting
  if (options.sortBy) {
    data.sort((a, b) => {
      const aVal = a[options.sortBy!]
      const bVal = b[options.sortBy!]
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return options.sortOrder === 'desc' ? -comparison : comparison
    })
  }

  // Apply limit
  if (options.limit !== undefined && options.limit > 0) {
    data = data.slice(0, options.limit)
  }

  return data
}

