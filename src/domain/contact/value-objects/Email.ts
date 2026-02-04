/**
 * Value object representing a validated email address.
 * Follows RFC 5322 simplified validation.
 */
export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly _value: string) {}

  static create(value: string): Email {
    if (!value || value.trim() === '') {
      throw new Error('Email address is required');
    }

    const trimmed = value.trim().toLowerCase();

    if (!Email.EMAIL_REGEX.test(trimmed)) {
      throw new Error('Invalid email format');
    }

    return new Email(trimmed);
  }

  static isValid(value: string): boolean {
    try {
      Email.create(value);
      return true;
    } catch {
      return false;
    }
  }

  getValue(): string {
    return this._value;
  }

  getLocalPart(): string {
    return this._value.split('@')[0];
  }

  getDomain(): string {
    return this._value.split('@')[1];
  }

  toString(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
