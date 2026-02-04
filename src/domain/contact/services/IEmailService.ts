import type { ContactMessage } from '../entities/ContactMessage';

/**
 * Service interface for sending emails.
 * Implementations should handle the actual email delivery.
 */
export interface IEmailService {
  /**
   * Send a contact message via email.
   * @param message The contact message to send
   * @throws Error if sending fails
   */
  sendContactMessage(message: ContactMessage): Promise<void>;
}
