import { describe, it, expect } from 'vitest';
import { Email } from '@/domain/contact/value-objects/Email';

describe('Email', () => {
  describe('create', () => {
    it('should create an email with valid address', () => {
      const email = Email.create('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should lowercase the email', () => {
      const email = Email.create('Test@Example.COM');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const email = Email.create('  test@example.com  ');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should throw for empty email', () => {
      expect(() => Email.create('')).toThrow('Email address is required');
    });

    it('should throw for whitespace only', () => {
      expect(() => Email.create('   ')).toThrow('Email address is required');
    });

    it('should throw for invalid format - no @', () => {
      expect(() => Email.create('testexample.com')).toThrow(
        'Invalid email format'
      );
    });

    it('should throw for invalid format - no domain', () => {
      expect(() => Email.create('test@')).toThrow('Invalid email format');
    });

    it('should throw for invalid format - no local part', () => {
      expect(() => Email.create('@example.com')).toThrow(
        'Invalid email format'
      );
    });
  });

  describe('isValid', () => {
    it('should return true for valid email', () => {
      expect(Email.isValid('test@example.com')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(Email.isValid('invalid')).toBe(false);
    });
  });

  describe('getLocalPart', () => {
    it('should return the local part', () => {
      const email = Email.create('user@example.com');
      expect(email.getLocalPart()).toBe('user');
    });
  });

  describe('getDomain', () => {
    it('should return the domain', () => {
      const email = Email.create('user@example.com');
      expect(email.getDomain()).toBe('example.com');
    });
  });

  describe('toString', () => {
    it('should return the email address', () => {
      const email = Email.create('test@example.com');
      expect(email.toString()).toBe('test@example.com');
    });
  });

  describe('equals', () => {
    it('should return true for equal emails', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('TEST@EXAMPLE.COM');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('other@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
