import type { SiteMap } from "./types"

const STORAGE_KEY = "groovy:site-map:v1"

export function saveSiteMap(siteMap: SiteMap): void {
  // Only save on client
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(siteMap))
  } catch (error) {
    console.error("Failed to save site map:", error)
  }
}

export function loadSiteMap(): SiteMap | null {
  // Only load on client
  if (typeof window === "undefined") return null
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null
    return JSON.parse(data) as SiteMap
  } catch (error) {
    console.error("Failed to load site map:", error)
    return null
  }
}

export function clearSiteMap(): void {
  // Only clear on client
  if (typeof window === "undefined") return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear site map:", error)
  }
}

