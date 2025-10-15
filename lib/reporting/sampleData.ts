/**
 * Sample Data for Report Previews
 * Realistic mock data to demonstrate report blocks
 */

export const sampleOrders = [
  {
    id: 'ORD-001',
    client: 'Horizon Apparel',
    orderName: 'Spring Collection 2025',
    status: 'In Production',
    itemsCount: 450,
    deadline: '2025-10-25',
    shipDate: '2025-10-25',
    completedItems: 320,
    totalValue: 45000,
  },
  {
    id: 'ORD-002',
    client: 'Urban Threads',
    orderName: 'Winter Essentials',
    status: 'Completed',
    itemsCount: 280,
    deadline: '2025-10-15',
    shipDate: '2025-10-15',
    completedItems: 280,
    totalValue: 32000,
  },
  {
    id: 'ORD-003',
    client: 'Coastal Wear',
    orderName: 'Summer Basics',
    status: 'In Production',
    itemsCount: 520,
    deadline: '2025-11-01',
    shipDate: '2025-11-01',
    completedItems: 180,
    totalValue: 58000,
  },
  {
    id: 'ORD-004',
    client: 'Metro Fashion',
    orderName: 'Fall Preview Line',
    status: 'Completed',
    itemsCount: 340,
    deadline: '2025-10-10',
    shipDate: '2025-10-10',
    completedItems: 340,
    totalValue: 39000,
  },
  {
    id: 'ORD-005',
    client: 'Horizon Apparel',
    orderName: 'Accessories Pack',
    status: 'In Production',
    itemsCount: 150,
    deadline: '2025-10-28',
    shipDate: '2025-10-28',
    completedItems: 85,
    totalValue: 12000,
  },
];

export const sampleKPIs = {
  totalOrders: 42,
  completedOrders: 28,
  inProduction: 12,
  overdueOrders: 2,
  completionRate: 89,
  onTimeDelivery: 94,
  totalItems: 1740,
  completedItems: 1205,
  averageOrderValue: 37200,
  totalRevenue: 186000,
};

export const sampleChartData = {
  dailyCompletion: [
    { date: 'Oct 8', completed: 45, target: 50 },
    { date: 'Oct 9', completed: 52, target: 50 },
    { date: 'Oct 10', completed: 48, target: 50 },
    { date: 'Oct 11', completed: 61, target: 50 },
    { date: 'Oct 12', completed: 55, target: 50 },
    { date: 'Oct 13', completed: 58, target: 50 },
    { date: 'Oct 14', completed: 63, target: 50 },
  ],
  ordersByClient: [
    { client: 'Horizon Apparel', orders: 12, revenue: 142000 },
    { client: 'Urban Threads', orders: 8, revenue: 98000 },
    { client: 'Coastal Wear', orders: 10, revenue: 125000 },
    { client: 'Metro Fashion', orders: 7, revenue: 89000 },
    { client: 'Vista Brands', orders: 5, revenue: 62000 },
  ],
  statusBreakdown: [
    { name: 'Completed', value: 28, color: '#10b981' },
    { name: 'In Production', value: 12, color: '#3b82f6' },
    { name: 'Overdue', value: 2, color: '#ef4444' },
  ],
};

export const sampleTimeline = [
  {
    id: 'TL-001',
    title: 'Spring Collection 2025',
    client: 'Horizon Apparel',
    date: '2025-10-25',
    status: 'on-track',
    itemsCount: 450,
  },
  {
    id: 'TL-002',
    title: 'Accessories Pack',
    client: 'Horizon Apparel',
    date: '2025-10-28',
    status: 'on-track',
    itemsCount: 150,
  },
  {
    id: 'TL-003',
    title: 'Summer Basics',
    client: 'Coastal Wear',
    date: '2025-11-01',
    status: 'at-risk',
    itemsCount: 520,
  },
  {
    id: 'TL-004',
    title: 'Holiday Collection',
    client: 'Urban Threads',
    date: '2025-11-05',
    status: 'on-track',
    itemsCount: 380,
  },
  {
    id: 'TL-005',
    title: 'Winter Refresh',
    client: 'Metro Fashion',
    date: '2025-11-10',
    status: 'on-track',
    itemsCount: 290,
  },
];

export const sampleComparison = [
  {
    label: 'Total Orders',
    current: 42,
    previous: 38,
    change: 10.5,
    format: 'number' as const,
  },
  {
    label: 'Completed Orders',
    current: 28,
    previous: 24,
    change: 16.7,
    format: 'number' as const,
  },
  {
    label: 'Completion Rate',
    current: 89,
    previous: 85,
    change: 4.7,
    format: 'percent' as const,
  },
  {
    label: 'Total Revenue',
    current: 186000,
    previous: 162000,
    change: 14.8,
    format: 'currency' as const,
  },
  {
    label: 'On-Time Delivery',
    current: 94,
    previous: 91,
    change: 3.3,
    format: 'percent' as const,
  },
];

export const sampleGauge = {
  completionRate: {
    value: 89,
    max: 100,
    label: 'Completion Rate',
    colorZones: [
      { min: 0, max: 70, color: '#ef4444' },
      { min: 70, max: 90, color: '#f59e0b' },
      { min: 90, max: 100, color: '#10b981' },
    ],
  },
  efficiency: {
    value: 87,
    max: 100,
    label: 'Efficiency Score',
    colorZones: [
      { min: 0, max: 70, color: '#ef4444' },
      { min: 70, max: 90, color: '#f59e0b' },
      { min: 90, max: 100, color: '#10b981' },
    ],
  },
  onTimeDelivery: {
    value: 94,
    max: 100,
    label: 'On-Time Delivery',
    colorZones: [
      { min: 0, max: 70, color: '#ef4444' },
      { min: 70, max: 90, color: '#f59e0b' },
      { min: 90, max: 100, color: '#10b981' },
    ],
  },
  qualityScore: {
    value: 92,
    max: 100,
    label: 'Quality Score',
    colorZones: [
      { min: 0, max: 70, color: '#ef4444' },
      { min: 70, max: 90, color: '#f59e0b' },
      { min: 90, max: 100, color: '#10b981' },
    ],
  },
};

