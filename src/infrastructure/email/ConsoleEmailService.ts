import type { ContactMessage } from '@/domain/contact/entities/ContactMessage';
import type { IEmailService } from '@/domain/contact/services/IEmailService';

/**
 * Console-based email service for development.
 * Logs email content to console instead of sending.
 */
export class ConsoleEmailService implements IEmailService {
  async sendContactMessage(message: ContactMessage): Promise<void> {
    console.warn('='.repeat(50));
    console.warn('📧 Contact Form Submission (Development Mode)');
    console.warn('='.repeat(50));
    console.warn(`From: ${message.name} <${message.email.toString()}>`);
    console.warn(`Subject: ${message.subject}`);
    console.warn('-'.repeat(50));
    console.warn('Message:');
    console.warn(message.message);
    console.warn('='.repeat(50));
    console.warn(`Message ID: ${message.id}`);
    console.warn(`Timestamp: ${message.createdAt.toISOString()}`);
    console.warn('='.repeat(50));
  }
}
