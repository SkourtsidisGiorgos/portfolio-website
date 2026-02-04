import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SendContactMessage } from '@/application/use-cases/SendContactMessage';
import { ContactService } from '@/domain/contact/services/ContactService';
import type { IEmailService } from '@/domain/contact/services/IEmailService';
import { ConsoleEmailService } from '@/infrastructure/email/ConsoleEmailService';
import { ResendEmailService } from '@/infrastructure/email/ResendEmailService';

// Input validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(5000),
});

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check rate limit for an IP address.
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * Get the client IP from request headers.
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

/**
 * Create email service based on environment.
 */
function createEmailService(): IEmailService {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (apiKey && contactEmail) {
    return new ResendEmailService(apiKey, contactEmail);
  }

  // Fallback to console logging in development
  console.warn(
    'Missing RESEND_API_KEY or CONTACT_EMAIL. Using console email service.'
  );
  return new ConsoleEmailService();
}

/**
 * POST /api/contact
 * Handle contact form submissions.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Validate input
    const parseResult = contactFormSchema.safeParse(body);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Create dependencies and use case
    const emailService = createEmailService();
    const contactService = new ContactService(emailService);
    const sendContactMessage = new SendContactMessage(contactService);

    // Execute use case
    const result = await sendContactMessage.execute(parseResult.data);

    if (result.success) {
      return NextResponse.json(
        { success: true, messageId: result.messageId },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send message' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
