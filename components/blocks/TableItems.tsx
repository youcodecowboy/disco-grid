import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Settings,
  Filter
} from 'lucide-react'

interface Item {
  id: string
  name: string
  description: string
  category: string
  stock: number
  price: number
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
  lastUpdated: string
  supplier: string
  sku: string
}

interface Column {
  key: keyof Item
  label: string
  visible: boolean
  sortable: boolean
  width?: string
}

interface Props {
  items?: Item[]
  showColumnCustomization?: boolean
}

export default function TableItems({ items = [], showColumnCustomization = true }: Props) {
  const [sortColumn, setSortColumn] = useState<keyof Item | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [columns, setColumns] = useState<Column[]>([
    { key: 'name', label: 'Item Name', visible: true, sortable: true, width: 'w-1/4' },
    { key: 'category', label: 'Category', visible: true, sortable: true, width: 'w-1/6' },
    { key: 'stock', label: 'Stock', visible: true, sortable: true, width: 'w-1/12' },
    { key: 'price', label: 'Price', visible: true, sortable: true, width: 'w-1/12' },
    { key: 'status', label: 'Status', visible: true, sortable: true, width: 'w-1/6' },
    { key: 'supplier', label: 'Supplier', visible: false, sortable: true, width: 'w-1/6' },
    { key: 'sku', label: 'SKU', visible: false, sortable: true, width: 'w-1/8' },
    { key: 'lastUpdated', label: 'Updated', visible: false, sortable: true, width: 'w-1/8' },
  ])

  // Mock data if none provided
  const mockItems: Item[] = [
    {
      id: '1',
      name: 'Denim Jeans',
      description: 'Blue, 32x32',
      category: 'Clothing',
      stock: 156,
      price: 89.99,
      status: 'In Stock',
      lastUpdated: '2024-01-15',
      supplier: 'Fashion Co.',
      sku: 'DJ-BL-32'
    },
    {
      id: '2',
      name: 'Cotton T-Shirt',
      description: 'White, Large',
      category: 'Clothing',
      stock: 89,
      price: 24.99,
      status: 'In Stock',
      lastUpdated: '2024-01-14',
      supplier: 'Textile Inc.',
      sku: 'CT-WH-L'
    },
    {
      id: '3',
      name: 'Leather Belt',
      description: 'Brown, 36"',
      category: 'Accessories',
      stock: 12,
      price: 45.00,
      status: 'Low Stock',
      lastUpdated: '2024-01-13',
      supplier: 'Leather Works',
      sku: 'LB-BR-36'
    },
    {
      id: '4',
      name: 'Sneakers',
      description: 'Black, Size 10',
      category: 'Footwear',
      stock: 67,
      price: 129.99,
      status: 'In Stock',
      lastUpdated: '2024-01-12',
      supplier: 'Shoe Co.',
      sku: 'SN-BK-10'
    },
    {
      id: '5',
      name: 'Hoodie',
      description: 'Gray, XL',
      category: 'Clothing',
      stock: 34,
      price: 59.99,
      status: 'In Stock',
      lastUpdated: '2024-01-11',
      supplier: 'Fashion Co.',
      sku: 'HD-GR-XL'
    }
  ]

  const displayItems = items.length > 0 ? items : mockItems

  const handleSort = (column: keyof Item) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedItems = [...displayItems].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aVal = a[sortColumn]
    const bVal = b[sortColumn]
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    return 0
  })

  const toggleColumnVisibility = (columnKey: keyof Item) => {
    setColumns(cols => 
      cols.map(col => 
        col.key === columnKey 
          ? { ...col, visible: !col.visible }
          : col
      )
    )
  }

  const getStatusBadge = (status: Item['status']) => {
    const variants = {
      'In Stock': 'secondary',
      'Low Stock': 'destructive',
      'Out of Stock': 'outline'
    } as const
    
    return (
      <Badge variant={variants[status]} className="text-xs whitespace-nowrap">
        {status}
      </Badge>
    )
  }

  const visibleColumns = columns.filter(col => col.visible)

  return (
    <div className="space-y-4">
      {/* Table Header with Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Items ({sortedItems.length})</h3>
          {showColumnCustomization && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="h-8"
            >
              <Settings className="h-3 w-3 mr-1" />
              Columns
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </Button>
          <Button size="sm" className="h-8">
            Add Item
          </Button>
        </div>
      </div>

      {/* Column Customization Panel */}
      {showColumnSettings && showColumnCustomization && (
        <div className="p-3 bg-muted/50 rounded-lg border">
          <div className="text-xs font-medium mb-2">Customize Columns</div>
          <div className="grid grid-cols-4 gap-2">
            {columns.map(column => (
              <label key={column.key} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={() => toggleColumnVisibility(column.key)}
                  className="rounded"
                />
                {column.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                {visibleColumns.map(column => (
                  <th 
                    key={column.key}
                    className={`text-left py-3 px-4 font-medium ${column.width || ''} ${
                      column.sortable ? 'cursor-pointer hover:bg-muted/70' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && sortColumn === column.key && (
                        sortDirection === 'asc' 
                          ? <ChevronUp className="h-3 w-3" />
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="text-left py-3 px-4 font-medium w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  {visibleColumns.map(column => (
                    <td key={column.key} className="py-3 px-4">
                      {column.key === 'name' ? (
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                            <Package className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{item.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                          </div>
                        </div>
                      ) : column.key === 'category' ? (
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      ) : column.key === 'status' ? (
                        getStatusBadge(item.status)
                      ) : column.key === 'price' ? (
                        `$${item.price.toFixed(2)}`
                      ) : column.key === 'stock' ? (
                        <span className={item.stock < 20 ? 'text-red-600 font-medium' : ''}>
                          {item.stock}
                        </span>
                      ) : (
                        item[column.key]
                      )}
                    </td>
                  ))}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
