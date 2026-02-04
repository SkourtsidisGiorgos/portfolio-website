import { z } from 'zod';

/**
 * Zod validation schema for the contact form.
 * Provides client-side validation with consistent rules.
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(20, 'Message must be at least 20 characters')
    .max(5000, 'Message must be less than 5000 characters'),
});

/**
 * TypeScript type inferred from the schema.
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Default values for the contact form.
 */
export const contactFormDefaults: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};
