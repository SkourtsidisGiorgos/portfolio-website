import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactMessage } from '@/domain/contact/entities/ContactMessage';
import { ResendEmailService } from '../ResendEmailService';

// Create module-level mock
const mockSend = vi.fn();

// Mock Resend SDK with a class-based implementation
vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = {
        send: mockSend,
      };
    },
  };
});

describe('ResendEmailService', () => {
  let service: ResendEmailService;

  const createTestMessage = () =>
    ContactMessage.create({
      id: 'test-id-123',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message with enough characters.',
    });

  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null });
    service = new ResendEmailService('test-api-key', 'test@example.com');
  });

  describe('sendContactMessage', () => {
    it('sends email with correct parameters', async () => {
      const message = createTestMessage();

      await service.sendContactMessage(message);

      expect(mockSend).toHaveBeenCalledWith({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'test@example.com',
        replyTo: 'john@example.com',
        subject: `[Portfolio Contact] Test Subject`,
        html: expect.stringContaining('John Doe'),
      });
    });

    it('includes sender information in email body', async () => {
      const message = createTestMessage();

      await service.sendContactMessage(message);

      const call = mockSend.mock.calls[0][0];
      expect(call.html).toContain('john@example.com');
      expect(call.html).toContain('This is a test message');
    });

    it('throws error when Resend API fails', async () => {
      mockSend.mockResolvedValue({
        data: null,
        error: { message: 'API Error', name: 'api_error' },
      });
      const message = createTestMessage();

      await expect(service.sendContactMessage(message)).rejects.toThrow(
        'Failed to send email: API Error'
      );
    });

    it('throws error when Resend throws exception', async () => {
      mockSend.mockRejectedValue(new Error('Network error'));
      const message = createTestMessage();

      await expect(service.sendContactMessage(message)).rejects.toThrow(
        'Email service error: Network error'
      );
    });
  });

  describe('constructor', () => {
    it('throws error when API key is missing', () => {
      expect(() => new ResendEmailService('', 'test@example.com')).toThrow(
        'Resend API key is required'
      );
    });

    it('throws error when contact email is missing', () => {
      expect(() => new ResendEmailService('api-key', '')).toThrow(
        'Contact email is required'
      );
    });
  });
});
