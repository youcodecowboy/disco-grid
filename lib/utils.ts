import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate stable IDs for hydration safety
let idCounter = 0
export function generateId(prefix: string = "id"): string {
  idCounter++
  return `${prefix}-${idCounter}-${Math.random().toString(36).substr(2, 9)}`
}
