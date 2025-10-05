import { OrderStatus, getOrderStatusColor } from "@/lib/data/orders"

type OrderStatusBadgeProps = {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className = "" }: OrderStatusBadgeProps) {
  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusColor(status)} ${className}`}>
      {status}
    </span>
  )
}
