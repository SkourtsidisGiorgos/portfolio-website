/**
 * Generate a unique message ID.
 * Format: msg-{timestamp}-{random}
 */
export function generateMessageId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `msg-${timestamp}-${random}`;
}
