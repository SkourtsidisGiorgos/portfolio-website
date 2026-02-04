import { ContactMessage } from '../entities/ContactMessage';
import { IEmailService } from './IEmailService';
import { Result } from '@/shared/types/common';

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Domain service for handling contact form submissions.
 * Validates input and coordinates with the email service.
 */
export class ContactService {
  constructor(private readonly emailService: IEmailService) {}

  /**
   * Validate and send a contact message.
   * Creates the domain entity, validates it, and sends via email service.
   */
  async sendMessage(input: ContactFormInput): Promise<Result<ContactMessage>> {
    try {
      // Generate a unique ID for the message
      const id = this.generateMessageId();

      // Create the domain entity (this validates the input)
      const message = ContactMessage.create({
        id,
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      });

      // Send via email service
      await this.emailService.sendContactMessage(message);

      return { success: true, data: message };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * Validate contact form input without sending.
   * Useful for client-side validation feedback.
   */
  validate(input: ContactFormInput): Result<void> {
    try {
      // Try to create the entity to validate
      ContactMessage.create({
        id: 'validation-only',
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      });

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Validation failed'),
      };
    }
  }

  private generateMessageId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `msg-${timestamp}-${random}`;
  }
}
