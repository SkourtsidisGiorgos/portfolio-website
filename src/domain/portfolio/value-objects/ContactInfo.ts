/**
 * Value object representing contact information.
 */
export class ContactInfo {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(
    private readonly _email: string,
    private readonly _phone: string | null,
    private readonly _location: string
  ) {}

  static create(
    email: string,
    location: string,
    phone?: string | null
  ): ContactInfo {
    if (!email || !ContactInfo.EMAIL_REGEX.test(email)) {
      throw new Error('Invalid email format');
    }

    if (!location || location.trim() === '') {
      throw new Error('Location is required');
    }

    return new ContactInfo(email.toLowerCase(), phone ?? null, location.trim());
  }

  get email(): string {
    return this._email;
  }

  get phone(): string | null {
    return this._phone;
  }

  get location(): string {
    return this._location;
  }

  hasPhone(): boolean {
    return this._phone !== null;
  }

  getEmailDomain(): string {
    return this._email.split('@')[1];
  }

  equals(other: ContactInfo): boolean {
    return (
      this._email === other._email &&
      this._phone === other._phone &&
      this._location === other._location
    );
  }
}
