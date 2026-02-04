import { ContactMessage } from '@/domain/contact/entities/ContactMessage';
import { Email } from '@/domain/contact/value-objects/Email';
import type { ContactService } from '@/domain/portfolio/services/ContactService';
import type {
  ContactFormDTO,
  ContactFormResultDTO,
} from '../dto/ContactFormDTO';

/**
 * Validation error for contact form.
 */
export class ContactValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = 'ContactValidationError';
  }
}

/**
 * Generate a unique message ID.
 */
function generateMessageId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `msg-${timestamp}-${random}`;
}

/**
 * Use case for sending a contact message.
 */
export class SendContactMessage {
  constructor(private contactService: ContactService) {}

  /**
   * Execute the use case to send a contact message.
   * Validates input, creates entity, and sends via email service.
   */
  async execute(input: ContactFormDTO): Promise<ContactFormResultDTO> {
    // Validate input
    this.validate(input);

    try {
      // Create contact message entity with generated ID
      // ContactMessage.create accepts email as string
      const messageId = generateMessageId();
      const message = ContactMessage.create({
        id: messageId,
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      });

      // Send via contact service
      const result = await this.contactService.submitContactForm(message);

      if (result.success) {
        return {
          success: true,
          messageId: message.id,
          error: null,
        };
      } else {
        return {
          success: false,
          messageId: null,
          error: result.error || 'Failed to send message',
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          messageId: null,
          error: error.message,
        };
      }
      return {
        success: false,
        messageId: null,
        error: 'An unexpected error occurred',
      };
    }
  }

  /**
   * Validate contact form input.
   */
  private validate(input: ContactFormDTO): void {
    if (!input.name || input.name.trim().length === 0) {
      throw new ContactValidationError('Name is required', 'name');
    }
    if (input.name.trim().length < 2) {
      throw new ContactValidationError(
        'Name must be at least 2 characters',
        'name'
      );
    }

    if (!input.email || input.email.trim().length === 0) {
      throw new ContactValidationError('Email is required', 'email');
    }
    if (!Email.isValid(input.email)) {
      throw new ContactValidationError('Invalid email address', 'email');
    }

    if (!input.subject || input.subject.trim().length === 0) {
      throw new ContactValidationError('Subject is required', 'subject');
    }
    if (input.subject.trim().length < 3) {
      throw new ContactValidationError(
        'Subject must be at least 3 characters',
        'subject'
      );
    }

    if (!input.message || input.message.trim().length === 0) {
      throw new ContactValidationError('Message is required', 'message');
    }
    if (input.message.trim().length < 10) {
      throw new ContactValidationError(
        'Message must be at least 10 characters',
        'message'
      );
    }
  }
}
