import { ContactMessage } from '@/domain/contact/entities/ContactMessage';
import type { ContactService } from '@/domain/contact/services/ContactService';
import { Email } from '@/domain/contact/value-objects/Email';
import { ValidationError, getErrorMessage } from '@/shared/errors';
import { generateMessageId } from '@/shared/utils/id';
import { validateFields } from '@/shared/utils/validation';
import type {
  ContactFormDTO,
  ContactFormResultDTO,
} from '../dto/ContactFormDTO';

/**
 * Validation error for contact form.
 * Extends the shared ValidationError for consistent error handling.
 */
export class ContactValidationError extends ValidationError {
  constructor(message: string, field: string) {
    super(message, field);
    this.name = 'ContactValidationError';
    // Fix prototype chain for proper instanceof checks
    Object.setPrototypeOf(this, ContactValidationError.prototype);
  }
}

/** Validation rules for contact form */
const CONTACT_FORM_VALIDATION = {
  name: { minLength: 2 },
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  subject: { minLength: 3 },
  message: { minLength: 10 },
} as const;

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
      return {
        success: false,
        messageId: null,
        error: getErrorMessage(error),
      };
    }
  }

  /**
   * Validate contact form input using declarative rules.
   */
  private validate(input: ContactFormDTO): void {
    validateFields(
      [
        {
          field: 'name',
          value: input.name,
          required: true,
          minLength: CONTACT_FORM_VALIDATION.name.minLength,
        },
        {
          field: 'email',
          value: input.email,
          required: true,
          customValidator: v => Email.isValid(v as string),
          customMessage: 'Invalid email address',
        },
        {
          field: 'subject',
          value: input.subject,
          required: true,
          minLength: CONTACT_FORM_VALIDATION.subject.minLength,
        },
        {
          field: 'message',
          value: input.message,
          required: true,
          minLength: CONTACT_FORM_VALIDATION.message.minLength,
        },
      ],
      { ErrorClass: ContactValidationError }
    );
  }
}
