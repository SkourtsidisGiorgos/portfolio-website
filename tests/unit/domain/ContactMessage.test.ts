import { describe, it, expect } from 'vitest';
import { ContactMessage } from '@/domain/contact/entities/ContactMessage';

describe('ContactMessage', () => {
  const validProps = {
    id: 'msg-1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Hello there',
    message: 'This is a test message with enough characters.',
  };

  describe('create', () => {
    it('should create a message with valid props', () => {
      const message = ContactMessage.create(validProps);
      expect(message.id).toBe('msg-1');
      expect(message.name).toBe('John Doe');
      expect(message.emailAddress).toBe('john@example.com');
    });

    it('should set createdAt to now if not provided', () => {
      const before = new Date();
      const message = ContactMessage.create(validProps);
      const after = new Date();
      expect(message.createdAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      );
      expect(message.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should use provided createdAt', () => {
      const date = new Date('2024-01-15');
      const message = ContactMessage.create({ ...validProps, createdAt: date });
      expect(message.createdAt.getTime()).toBe(date.getTime());
    });

    it('should throw for missing ID', () => {
      expect(() => ContactMessage.create({ ...validProps, id: '' })).toThrow(
        'Message ID is required'
      );
    });

    it('should throw for missing name', () => {
      expect(() => ContactMessage.create({ ...validProps, name: '' })).toThrow(
        'Name is required'
      );
    });

    it('should throw for name too short', () => {
      expect(() => ContactMessage.create({ ...validProps, name: 'J' })).toThrow(
        'Name must be at least 2 characters'
      );
    });

    it('should throw for name too long', () => {
      expect(() =>
        ContactMessage.create({ ...validProps, name: 'a'.repeat(101) })
      ).toThrow('Name must be less than 100 characters');
    });

    it('should throw for missing subject', () => {
      expect(() =>
        ContactMessage.create({ ...validProps, subject: '' })
      ).toThrow('Subject is required');
    });

    it('should throw for subject too short', () => {
      expect(() =>
        ContactMessage.create({ ...validProps, subject: 'Hi' })
      ).toThrow('Subject must be at least 3 characters');
    });

    it('should throw for message too short', () => {
      expect(() =>
        ContactMessage.create({ ...validProps, message: 'Short' })
      ).toThrow('Message must be at least 10 characters');
    });

    it('should throw for invalid email', () => {
      expect(() =>
        ContactMessage.create({ ...validProps, email: 'invalid' })
      ).toThrow('Invalid email format');
    });
  });

  describe('getPreview', () => {
    it('should return full message if short', () => {
      const message = ContactMessage.create(validProps);
      expect(message.getPreview(200)).toBe(validProps.message);
    });

    it('should truncate long message', () => {
      const longMessage = 'a'.repeat(200);
      const message = ContactMessage.create({
        ...validProps,
        message: longMessage,
      });
      const preview = message.getPreview(50);
      expect(preview).toHaveLength(50);
      expect(preview.endsWith('...')).toBe(true);
    });
  });

  describe('getFormattedDate', () => {
    it('should format the date', () => {
      const message = ContactMessage.create({
        ...validProps,
        createdAt: new Date('2024-01-15T10:30:00'),
      });
      expect(message.getFormattedDate()).toContain('January');
      expect(message.getFormattedDate()).toContain('2024');
    });
  });
});
