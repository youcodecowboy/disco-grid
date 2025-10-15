// Capacity calculation utilities

import { FACTORY_CAPACITY, type ItemProfile, type CapacityWarning } from "./types"
import { MOCK_ORDERS } from "@/lib/data/orders"
import { addMonths, parseISO } from "date-fns"

export function calculateRequiredMonths(quantity: number): number {
  return Math.ceil(quantity / FACTORY_CAPACITY)
}

export function calculateRequiredCapacity(quantity: number): number {
  return (quantity / FACTORY_CAPACITY) * 100 // percentage
}

export function checkCapacityWarnings(items: ItemProfile[]): CapacityWarning[] {
  const warnings: CapacityWarning[] = []
  
  // Check total order capacity
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const requiredMonths = calculateRequiredMonths(totalQuantity)
  const capacityPercent = calculateRequiredCapacity(totalQuantity)
  
  if (capacityPercent > 100) {
    warnings.push({
      type: "error",
      message: `${totalQuantity.toLocaleString()} units exceeds ${FACTORY_CAPACITY.toLocaleString()}/month capacity (${requiredMonths} months required)`,
      itemIds: items.map(i => i.id)
    })
  } else if (capacityPercent > 80) {
    warnings.push({
      type: "warning",
      message: `${totalQuantity.toLocaleString()} units is ${Math.round(capacityPercent)}% of monthly capacity`,
      itemIds: items.map(i => i.id)
    })
  } else {
    warnings.push({
      type: "info",
      message: `${totalQuantity.toLocaleString()} units is ${Math.round(capacityPercent)}% of monthly capacity`,
      itemIds: items.map(i => i.id)
    })
  }
  
  // Check individual items
  items.forEach(item => {
    if (item.quantity > FACTORY_CAPACITY) {
      const months = calculateRequiredMonths(item.quantity)
      warnings.push({
        type: "warning",
        message: `${item.name}: ${item.quantity.toLocaleString()} units requires ${months} months`,
        itemIds: [item.id]
      })
    }
  })
  
  return warnings
}

export function getExistingOrdersTimeline() {
  // Return mock existing orders for calendar visualization
  return MOCK_ORDERS
    .filter(order => order.status === "In Production" || order.status === "Accepted")
    .map(order => ({
      id: order.id,
      name: order.name,
      startDate: parseISO(order.startDate),
      endDate: parseISO(order.shipDate),
      quantity: order.totalLineItems,
      color: "#94a3b8" // slate-400
    }))
}

export function calculateSuggestedStartDate(items: ItemProfile[]): Date {
  // Calculate suggested start date based on existing orders
  const existingOrders = getExistingOrdersTimeline()
  const now = new Date()
  
  if (existingOrders.length === 0) {
    return now
  }
  
  // Find the latest end date of existing orders
  const latestEndDate = existingOrders.reduce((latest, order) => {
    return order.endDate > latest ? order.endDate : latest
  }, now)
  
  // Suggest starting after the latest order with 1 week buffer
  return addMonths(latestEndDate, 0.25) // ~1 week
}

