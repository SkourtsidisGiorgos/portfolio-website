import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactService } from '@/domain/contact/services/ContactService';
import { IEmailService } from '@/domain/contact/services/IEmailService';
import { ContactMessage } from '@/domain/contact/entities/ContactMessage';

describe('ContactService', () => {
  let mockEmailService: IEmailService;
  let contactService: ContactService;

  const validInput = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Hello there',
    message: 'This is a test message with enough characters.',
  };

  beforeEach(() => {
    mockEmailService = {
      sendContactMessage: vi.fn().mockResolvedValue(undefined),
    };
    contactService = new ContactService(mockEmailService);
  });

  describe('sendMessage', () => {
    it('should send a valid message successfully', async () => {
      const result = await contactService.sendMessage(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(ContactMessage);
        expect(result.data.name).toBe('John Doe');
        expect(result.data.emailAddress).toBe('john@example.com');
      }
      expect(mockEmailService.sendContactMessage).toHaveBeenCalledTimes(1);
    });

    it('should generate a unique message ID', async () => {
      const result1 = await contactService.sendMessage(validInput);
      const result2 = await contactService.sendMessage(validInput);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      if (result1.success && result2.success) {
        expect(result1.data.id).not.toBe(result2.data.id);
        expect(result1.data.id).toMatch(/^msg-[a-z0-9]+-[a-z0-9]+$/);
      }
    });

    it('should return error for invalid email', async () => {
      const result = await contactService.sendMessage({
        ...validInput,
        email: 'invalid',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('email');
      }
      expect(mockEmailService.sendContactMessage).not.toHaveBeenCalled();
    });

    it('should return error for empty name', async () => {
      const result = await contactService.sendMessage({
        ...validInput,
        name: '',
      });

      expect(result.success).toBe(false);
      expect(mockEmailService.sendContactMessage).not.toHaveBeenCalled();
    });

    it('should return error for short message', async () => {
      const result = await contactService.sendMessage({
        ...validInput,
        message: 'Hi',
      });

      expect(result.success).toBe(false);
      expect(mockEmailService.sendContactMessage).not.toHaveBeenCalled();
    });

    it('should return error if email service fails', async () => {
      mockEmailService.sendContactMessage = vi
        .fn()
        .mockRejectedValue(new Error('Email service unavailable'));

      const result = await contactService.sendMessage(validInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Email service unavailable');
      }
    });
  });

  describe('validate', () => {
    it('should return success for valid input', () => {
      const result = contactService.validate(validInput);

      expect(result.success).toBe(true);
    });

    it('should return error for invalid input', () => {
      const result = contactService.validate({
        ...validInput,
        email: 'invalid',
      });

      expect(result.success).toBe(false);
    });

    it('should not call email service', () => {
      contactService.validate(validInput);

      expect(mockEmailService.sendContactMessage).not.toHaveBeenCalled();
    });
  });
});
