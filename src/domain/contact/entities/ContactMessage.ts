import { Email } from '../value-objects/Email';

export interface ContactMessageProps {
  id: string;
  name: string;
  email: Email;
  subject: string;
  message: string;
  createdAt: Date;
}

/**
 * Entity representing a contact form message.
 */
export class ContactMessage {
  private constructor(private readonly props: ContactMessageProps) {}

  static create(props: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt?: Date;
  }): ContactMessage {
    if (!props.id || props.id.trim() === '') {
      throw new Error('Message ID is required');
    }
    if (!props.name || props.name.trim() === '') {
      throw new Error('Name is required');
    }
    if (!props.subject || props.subject.trim() === '') {
      throw new Error('Subject is required');
    }
    if (!props.message || props.message.trim() === '') {
      throw new Error('Message is required');
    }

    const name = props.name.trim();
    if (name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    if (name.length > 100) {
      throw new Error('Name must be less than 100 characters');
    }

    const subject = props.subject.trim();
    if (subject.length < 3) {
      throw new Error('Subject must be at least 3 characters');
    }
    if (subject.length > 200) {
      throw new Error('Subject must be less than 200 characters');
    }

    const message = props.message.trim();
    if (message.length < 10) {
      throw new Error('Message must be at least 10 characters');
    }
    if (message.length > 5000) {
      throw new Error('Message must be less than 5000 characters');
    }

    return new ContactMessage({
      id: props.id.trim(),
      name,
      email: Email.create(props.email),
      subject,
      message,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get emailAddress(): string {
    return this.props.email.getValue();
  }

  get subject(): string {
    return this.props.subject;
  }

  get message(): string {
    return this.props.message;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  getFormattedDate(): string {
    return this.props.createdAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getPreview(maxLength: number = 100): string {
    if (this.props.message.length <= maxLength) {
      return this.props.message;
    }
    return this.props.message.slice(0, maxLength - 3) + '...';
  }
}
