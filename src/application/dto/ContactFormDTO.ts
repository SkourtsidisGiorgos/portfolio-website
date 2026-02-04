/**
 * Data Transfer Object for Contact Form input.
 * Represents user input from the contact form.
 */
export interface ContactFormDTO {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Result of a contact form submission.
 */
export interface ContactFormResultDTO {
  success: boolean;
  messageId: string | null;
  error: string | null;
}
