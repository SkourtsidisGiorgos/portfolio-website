import { getErrorMessage } from '@/shared/errors';
import type { Result } from '@/shared/types/common';
import { generateMessageId } from '@/shared/utils/id';
import { ContactMessage } from '../entities/ContactMessage';
import type { IEmailService } from './IEmailService';

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormResult {
  success: boolean;
  error?: string;
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
      const id = generateMessageId();

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

  /**
   * Submit a pre-validated contact form message.
   * Used by the application layer use case.
   */
  async submitContactForm(message: ContactMessage): Promise<ContactFormResult> {
    try {
      await this.emailService.sendContactMessage(message);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  }
}
