import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle,
  ShoppingCart,
  Tag,
  BarChart3
} from 'lucide-react'

interface MetricCard {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
  color: string
  description?: string
}

interface Props {
  metrics?: MetricCard[]
}

export default function MetricItems({ metrics }: Props) {
  const defaultMetrics: MetricCard[] = [
    {
      title: 'Total Items',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: <Package className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: 'text-blue-600',
      description: 'from last month'
    },
    {
      title: 'Categories',
      value: '89',
      change: '+3',
      changeType: 'positive',
      icon: <Tag className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: 'text-green-600',
      description: 'active categories'
    },
    {
      title: 'Low Stock Items',
      value: '23',
      change: '-5',
      changeType: 'positive',
      icon: <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: 'text-orange-600',
      description: 'needs attention'
    },
    {
      title: 'Total Value',
      value: '$45.2K',
      change: '+8.5%',
      changeType: 'positive',
      icon: <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: 'text-purple-600',
      description: 'inventory value'
    }
  ]

  const displayMetrics = metrics || defaultMetrics

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
      case 'negative':
        return <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3" />
      default:
        return null
    }
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 md:gap-4">
      {displayMetrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow h-full overflow-hidden">
          {/* Large cards: Full layout with header and description */}
          <div className="hidden md:block h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-1 md:p-2 rounded-lg bg-muted ${metric.color}`}>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent className="p-2 md:p-3 lg:p-4">
              <div className="space-y-1">
                <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 text-xs">
                  {metric.changeType !== 'neutral' && getChangeIcon(metric.changeType)}
                  <span className={getChangeColor(metric.changeType)}>
                    {metric.change}
                  </span>
                  {metric.description && (
                    <span className="text-muted-foreground">
                      {metric.description}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </div>

          {/* Medium cards: Compact layout */}
          <div className="hidden sm:block md:hidden h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0.5 sm:pb-1">
              <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-0.5 sm:p-1 rounded-lg bg-muted ${metric.color}`}>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent className="p-1.5 sm:p-2">
              <div className="space-y-0.5">
                <div className="text-sm md:text-base lg:text-lg font-bold">{metric.value}</div>
                <div className="flex items-center gap-0.5 text-[10px]">
                  {metric.changeType !== 'neutral' && getChangeIcon(metric.changeType)}
                  <span className={getChangeColor(metric.changeType)}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </div>

          {/* Small cards: Minimal layout - just value and icon */}
          <div className="block sm:hidden h-full">
            <CardContent className="p-1 flex flex-col justify-center h-full">
              <div className="flex items-center justify-between mb-0.5">
                <div className="text-xs font-bold">{metric.value}</div>
                <div className={`p-0.5 rounded bg-muted ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-[8px]">
                {metric.changeType !== 'neutral' && getChangeIcon(metric.changeType)}
                <span className={getChangeColor(metric.changeType)}>
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}
