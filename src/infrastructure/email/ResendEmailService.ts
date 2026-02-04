import { Resend } from 'resend';
import type { ContactMessage } from '@/domain/contact/entities/ContactMessage';
import type { IEmailService } from '@/domain/contact/services/IEmailService';
import { InfrastructureError } from '@/shared/errors';

/**
 * Resend-based email service implementation.
 * Implements IEmailService interface following Dependency Inversion Principle.
 * Single Responsibility: Only handles email sending via Resend API.
 */
export class ResendEmailService implements IEmailService {
  private readonly resend: Resend;
  private readonly contactEmail: string;

  constructor(apiKey: string, contactEmail: string) {
    if (!apiKey || apiKey.trim() === '') {
      throw new InfrastructureError(
        'Resend API key is required',
        'ResendEmailService'
      );
    }
    if (!contactEmail || contactEmail.trim() === '') {
      throw new InfrastructureError(
        'Contact email is required',
        'ResendEmailService'
      );
    }

    this.resend = new Resend(apiKey);
    this.contactEmail = contactEmail.trim();
  }

  /**
   * Send a contact message via Resend.
   * @param message The contact message to send
   * @throws InfrastructureError if sending fails
   */
  async sendContactMessage(message: ContactMessage): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: this.contactEmail,
        replyTo: message.emailAddress,
        subject: `[Portfolio Contact] ${message.subject}`,
        html: this.buildEmailHtml(message),
      });

      if (error) {
        throw new InfrastructureError(
          `Failed to send email: ${error.message}`,
          'ResendEmailService'
        );
      }

      // Log success for debugging (in production, consider proper logging)
      if (data) {
        // Using warn as info is not allowed by eslint config
        console.warn(`Email sent successfully. ID: ${data.id}`);
      }
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error;
      }
      throw new InfrastructureError(
        `Email service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ResendEmailService'
      );
    }
  }

  /**
   * Build HTML email content from contact message.
   */
  private buildEmailHtml(message: ContactMessage): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #00bcd4, #7c3aed); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 16px; }
    .label { font-weight: 600; color: #555; margin-bottom: 4px; }
    .value { background: white; padding: 12px; border-radius: 4px; border: 1px solid #e0e0e0; }
    .message-content { white-space: pre-wrap; }
    .footer { margin-top: 20px; font-size: 12px; color: #888; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      <p style="margin: 8px 0 0;">Portfolio Website</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From</div>
        <div class="value">${this.escapeHtml(message.name)} &lt;${this.escapeHtml(message.emailAddress)}&gt;</div>
      </div>
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${this.escapeHtml(message.subject)}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="value message-content">${this.escapeHtml(message.message)}</div>
      </div>
      <div class="field">
        <div class="label">Submitted</div>
        <div class="value">${message.getFormattedDate()}</div>
      </div>
    </div>
    <div class="footer">
      <p>Message ID: ${message.id}</p>
      <p>Reply directly to this email to respond to ${this.escapeHtml(message.name)}.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Escape HTML special characters to prevent XSS.
   */
  private escapeHtml(text: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, char => htmlEscapes[char]);
  }
}
