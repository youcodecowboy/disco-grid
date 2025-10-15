/**
 * Print Queue Management
 * 
 * Track print jobs and label print status
 */

import { PrintableItem } from '@/components/labels/BulkLabelPrintTable'

const PRINT_STATUS_KEY = 'groovy:label-print-status:v1'

export interface PrintStatus {
  itemCodeId: string
  printedQuantity: number
  totalQuantity: number
  lastPrintedAt: string
}

/**
 * Get print status for all items
 */
export function getAllPrintStatus(): Record<string, PrintStatus> {
  try {
    const stored = localStorage.getItem(PRINT_STATUS_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to load print status:', error)
    return {}
  }
}

/**
 * Update print status for an item
 */
export function updatePrintStatus(itemCodeId: string, printedQuantity: number, totalQuantity: number) {
  try {
    const allStatus = getAllPrintStatus()
    allStatus[itemCodeId] = {
      itemCodeId,
      printedQuantity,
      totalQuantity,
      lastPrintedAt: new Date().toISOString()
    }
    localStorage.setItem(PRINT_STATUS_KEY, JSON.stringify(allStatus))
  } catch (error) {
    console.error('Failed to save print status:', error)
  }
}

/**
 * Mark items as fully printed
 */
export function markItemsAsPrinted(itemCodeIds: string[], quantities: Record<string, number>) {
  const allStatus = getAllPrintStatus()
  
  itemCodeIds.forEach(id => {
    const totalQuantity = quantities[id] || 0
    allStatus[id] = {
      itemCodeId: id,
      printedQuantity: totalQuantity,
      totalQuantity,
      lastPrintedAt: new Date().toISOString()
    }
  })
  
  localStorage.setItem(PRINT_STATUS_KEY, JSON.stringify(allStatus))
}

/**
 * Reset print status for an item
 */
export function resetPrintStatus(itemCodeId: string) {
  const allStatus = getAllPrintStatus()
  delete allStatus[itemCodeId]
  localStorage.setItem(PRINT_STATUS_KEY, JSON.stringify(allStatus))
}

/**
 * Get printable items with status
 */
export function getPrintableItemsWithStatus(itemCodes: any[]): PrintableItem[] {
  const printStatus = getAllPrintStatus()
  
  return itemCodes.map(itemCode => {
    const status = printStatus[itemCode.id] || {
      printedQuantity: 0,
      totalQuantity: itemCode.quantity,
      lastPrintedAt: undefined
    }
    
    return {
      id: itemCode.id,
      itemCodeId: itemCode.id,
      name: itemCode.name,
      code: itemCode.code,
      orderId: itemCode.orderId,
      orderName: itemCode.orderName,
      totalQuantity: itemCode.quantity,
      printedQuantity: status.printedQuantity,
      lastPrintedAt: status.lastPrintedAt
    }
  })
}

