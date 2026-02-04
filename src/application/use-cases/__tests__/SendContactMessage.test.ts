import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ContactFormDTO } from '@/application/dto/ContactFormDTO';
import { ContactService } from '@/domain/contact/services/ContactService';
import type { IEmailService } from '@/domain/contact/services/IEmailService';
import {
  SendContactMessage,
  ContactValidationError,
} from '../SendContactMessage';

describe('SendContactMessage', () => {
  let useCase: SendContactMessage;
  let mockEmailService: IEmailService;
  let contactService: ContactService;

  const validInput: ContactFormDTO = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'This is a test message with enough characters.',
  };

  beforeEach(() => {
    mockEmailService = {
      sendContactMessage: vi.fn().mockResolvedValue(undefined),
    };
    contactService = new ContactService(mockEmailService);
    useCase = new SendContactMessage(contactService);
  });

  describe('execute', () => {
    it('returns success result with messageId when email is sent', async () => {
      const result = await useCase.execute(validInput);

      expect(result.success).toBe(true);
      expect(result.messageId).toBeTruthy();
      expect(result.error).toBeNull();
    });

    it('calls email service with contact message', async () => {
      await useCase.execute(validInput);

      expect(mockEmailService.sendContactMessage).toHaveBeenCalledTimes(1);
      const calledWith = (
        mockEmailService.sendContactMessage as ReturnType<typeof vi.fn>
      ).mock.calls[0][0];
      expect(calledWith.name).toBe('John Doe');
      expect(calledWith.emailAddress).toBe('john@example.com');
      expect(calledWith.subject).toBe('Test Subject');
    });

    it('returns error result when email service fails', async () => {
      (
        mockEmailService.sendContactMessage as ReturnType<typeof vi.fn>
      ).mockRejectedValue(new Error('Email service unavailable'));

      const result = await useCase.execute(validInput);

      expect(result.success).toBe(false);
      expect(result.messageId).toBeNull();
      expect(result.error).toBe('Email service unavailable');
    });
  });

  describe('validation', () => {
    it('throws error for empty name', async () => {
      const input = { ...validInput, name: '' };

      await expect(useCase.execute(input)).rejects.toThrow(
        ContactValidationError
      );
    });

    it('throws error for name shorter than 2 characters', async () => {
      const input = { ...validInput, name: 'J' };

      await expect(useCase.execute(input)).rejects.toThrow(
        ContactValidationError
      );
    });

    it('throws error for invalid email format', async () => {
      const input = { ...validInput, email: 'invalid-email' };

      await expect(useCase.execute(input)).rejects.toThrow(
        ContactValidationError
      );
    });

    it('throws error for empty email', async () => {
      const input = { ...validInput, email: '' };

      await expect(useCase.execute(input)).rejects.toThrow(
        ContactValidationError
      );
    });

    it('throws error for empty subject', async () => {
      const input = { ...validInput, subject: '' };

      await expect(useCase.execute(input)).rejects.toThrow(
        ContactValidationError
      );
    });

    it('throws error for subject shorter than 3 characters', async () => {
      const input = { ...validInput, subject: 'Hi' };

      await expect(useCase.execute(input)).rejects.toThrow(
        ContactValidationError
      );
    });

    it('throws error for empty message', async () => {
      const input = { ...validInput, message: '' };

      await expect(useCase.execute(input)).rejects.toThrow(
        ContactValidationError
      );
    });

    it('throws error for message shorter than 10 characters', async () => {
      const input = { ...validInput, message: 'Short' };

      await expect(useCase.execute(input)).rejects.toThrow(
        ContactValidationError
      );
    });

    it('accepts valid input at minimum lengths', async () => {
      const input: ContactFormDTO = {
        name: 'Jo',
        email: 'a@b.co',
        subject: 'Sub',
        message: 'Ten chars!',
      };

      const result = await useCase.execute(input);

      expect(result.success).toBe(true);
    });
  });
});
