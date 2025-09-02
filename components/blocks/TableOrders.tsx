import type { Block } from "@/app/page"

interface Order {
  id: string
  customer: string
  amount: string
  status: string
}

interface Props {
  block: Block
}

export default function TableOrders({ block }: Props) {
  const orders = block.props?.orders || []

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
        <div>Order ID</div>
        <div>Customer</div>
        <div>Amount</div>
        <div>Status</div>
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {orders.map((order: Order, i: number) => (
          <div key={i} className="grid grid-cols-4 gap-2 text-xs">
            <div className="font-mono">{order.id}</div>
            <div className="truncate">{order.customer}</div>
            <div className="font-medium">{order.amount}</div>
            <div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  order.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
