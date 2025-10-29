/**
 * Idempotency Key Generation
 * 
 * Ensures that generation can be safely re-run with the same key
 * without creating duplicate data.
 */

/**
 * Generate a unique idempotency key
 */
export function generateIdempotencyKey(): string {
  // UUID v4 implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validate an idempotency key format
 */
export function isValidIdempotencyKey(key: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(key);
}

/**
 * Store idempotency key for a generation session
 */
export function storeIdempotencyKey(key: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('groovy:generation:idempotency', key);
}

/**
 * Retrieve stored idempotency key
 */
export function getStoredIdempotencyKey(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('groovy:generation:idempotency');
}

/**
 * Clear idempotency key (after successful generation)
 */
export function clearIdempotencyKey(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('groovy:generation:idempotency');
}

