/**
 * Suggestion Store
 * 
 * Stores and manages LLM-generated suggestions and optimizations.
 * Tracks lifecycle, user actions, and caching.
 */

import type { SuggestedTask } from '../types'
import type { ProcessedOptimization } from './suggestionProcessor'

export interface SuggestionStoreEntry {
  suggestion: SuggestedTask
  status: 'pending' | 'approved' | 'dismissed' | 'created'
  userAction?: {
    userId: string
    action: 'approved' | 'dismissed' | 'created'
    timestamp: string
  }
  createdAsTaskId?: string // If approved and created as task
}

export interface OptimizationStoreEntry {
  optimization: ProcessedOptimization
  status: 'pending' | 'applied' | 'rejected' | 'auto_applied'
  userAction?: {
    userId: string
    action: 'applied' | 'rejected'
    timestamp: string
  }
  appliedAt?: string
}

export interface ContextSnapshot {
  id: string
  contextHash: string // Hash of context data to detect changes
  generatedAt: string
  suggestions: SuggestedTask[]
  optimizations: ProcessedOptimization[]
  ttl: number // Time to live in minutes
}

/**
 * In-memory suggestion store
 * In production, this would be backed by persistent storage (Convex/DB)
 */
class SuggestionStore {
  private suggestions: Map<string, SuggestionStoreEntry> = new Map()
  private optimizations: Map<string, OptimizationStoreEntry> = new Map()
  private snapshots: Map<string, ContextSnapshot> = new Map()

  /**
   * Store suggestions from LLM analysis
   */
  storeSuggestions(
    suggestions: SuggestedTask[],
    contextHash: string,
    ttlMinutes: number = 60
  ): void {
    for (const suggestion of suggestions) {
      this.suggestions.set(suggestion.id, {
        suggestion,
        status: 'pending'
      })
    }

    // Store snapshot
    const snapshotId = `snapshot-${Date.now()}`
    this.snapshots.set(snapshotId, {
      id: snapshotId,
      contextHash,
      generatedAt: new Date().toISOString(),
      suggestions,
      optimizations: [],
      ttl: ttlMinutes
    })

    // Clean up old snapshots
    this.cleanupSnapshots()
  }

  /**
   * Store optimizations from LLM analysis
   */
  storeOptimizations(
    optimizations: ProcessedOptimization[],
    contextHash: string,
    ttlMinutes: number = 60
  ): void {
    for (const optimization of optimizations) {
      this.optimizations.set(optimization.taskId, {
        optimization,
        status: optimization.canAutoApply ? 'auto_applied' : 'pending'
      })
    }

    // Update snapshot if exists
    const latestSnapshot = this.getLatestSnapshot()
    if (latestSnapshot && latestSnapshot.contextHash === contextHash) {
      latestSnapshot.optimizations = optimizations
    }
  }

  /**
   * Get pending suggestions
   */
  getPendingSuggestions(): SuggestedTask[] {
    const entries = Array.from(this.suggestions.values())
      .filter(e => e.status === 'pending')
      .map(e => e.suggestion)
      .sort((a, b) => b.confidence - a.confidence) // Highest confidence first

    return entries
  }

  /**
   * Get pending optimizations
   */
  getPendingOptimizations(): ProcessedOptimization[] {
    const entries = Array.from(this.optimizations.values())
      .filter(e => e.status === 'pending')
      .map(e => e.optimization)
      .sort((a, b) => b.confidence - a.confidence) // Highest confidence first

    return entries
  }

  /**
   * Get auto-applied optimizations
   */
  getAutoAppliedOptimizations(): ProcessedOptimization[] {
    const entries = Array.from(this.optimizations.values())
      .filter(e => e.status === 'auto_applied')
      .map(e => e.optimization)

    return entries
  }

  /**
   * Approve a suggestion
   */
  approveSuggestion(suggestionId: string, userId: string): void {
    const entry = this.suggestions.get(suggestionId)
    if (entry) {
      entry.status = 'approved'
      entry.userAction = {
        userId,
        action: 'approved',
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Dismiss a suggestion
   */
  dismissSuggestion(suggestionId: string, userId: string): void {
    const entry = this.suggestions.get(suggestionId)
    if (entry) {
      entry.status = 'dismissed'
      entry.userAction = {
        userId,
        action: 'dismissed',
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Mark suggestion as created (converted to task)
   */
  markSuggestionCreated(suggestionId: string, taskId: string, userId: string): void {
    const entry = this.suggestions.get(suggestionId)
    if (entry) {
      entry.status = 'created'
      entry.createdAsTaskId = taskId
      entry.userAction = {
        userId,
        action: 'created',
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Apply an optimization
   */
  applyOptimization(taskId: string, userId: string): void {
    const entry = this.optimizations.get(taskId)
    if (entry) {
      entry.status = 'applied'
      entry.appliedAt = new Date().toISOString()
      entry.userAction = {
        userId,
        action: 'applied',
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Reject an optimization
   */
  rejectOptimization(taskId: string, userId: string): void {
    const entry = this.optimizations.get(taskId)
    if (entry) {
      entry.status = 'rejected'
      entry.userAction = {
        userId,
        action: 'rejected',
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Check if context snapshot is still valid
   */
  isSnapshotValid(contextHash: string): boolean {
    const snapshot = this.getLatestSnapshot()
    if (!snapshot) return false

    // Check if hash matches (context hasn't changed)
    if (snapshot.contextHash !== contextHash) return false

    // Check if TTL hasn't expired
    const generatedAt = new Date(snapshot.generatedAt)
    const expiresAt = new Date(generatedAt.getTime() + snapshot.ttl * 60 * 1000)
    return new Date() < expiresAt
  }

  /**
   * Get latest snapshot
   */
  getLatestSnapshot(): ContextSnapshot | null {
    const snapshots = Array.from(this.snapshots.values())
    if (snapshots.length === 0) return null

    return snapshots.sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    )[0]
  }

  /**
   * Clean up expired snapshots
   */
  private cleanupSnapshots(): void {
    const now = new Date()
    for (const [id, snapshot] of this.snapshots.entries()) {
      const generatedAt = new Date(snapshot.generatedAt)
      const expiresAt = new Date(generatedAt.getTime() + snapshot.ttl * 60 * 1000)
      if (now > expiresAt) {
        this.snapshots.delete(id)
      }
    }
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalSuggestions: number
    pendingSuggestions: number
    approvedSuggestions: number
    dismissedSuggestions: number
    totalOptimizations: number
    pendingOptimizations: number
    appliedOptimizations: number
    autoAppliedOptimizations: number
  } {
    const suggestions = Array.from(this.suggestions.values())
    const optimizations = Array.from(this.optimizations.values())

    return {
      totalSuggestions: suggestions.length,
      pendingSuggestions: suggestions.filter(s => s.status === 'pending').length,
      approvedSuggestions: suggestions.filter(s => s.status === 'approved').length,
      dismissedSuggestions: suggestions.filter(s => s.status === 'dismissed').length,
      totalOptimizations: optimizations.length,
      pendingOptimizations: optimizations.filter(o => o.status === 'pending').length,
      appliedOptimizations: optimizations.filter(o => o.status === 'applied').length,
      autoAppliedOptimizations: optimizations.filter(o => o.status === 'auto_applied').length
    }
  }

  /**
   * Clear all data (useful for testing)
   */
  clear(): void {
    this.suggestions.clear()
    this.optimizations.clear()
    this.snapshots.clear()
  }
}

// Singleton instance
export const suggestionStore = new SuggestionStore()

/**
 * Generate context hash for change detection
 */
export function generateContextHash(context: any): string {
  // Simple hash function - in production, use crypto.createHash
  const str = JSON.stringify(context)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(36)
}

