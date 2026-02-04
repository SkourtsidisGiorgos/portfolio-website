/**
 * Generate a unique message ID.
 * Format: msg-{timestamp}-{random}
 */
export function generateMessageId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `msg-${timestamp}-${random}`;
}

/**
 * Generate a unique ID with a custom prefix.
 * @param prefix - The prefix for the ID (e.g., 'exp', 'proj', 'skill')
 */
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
}
