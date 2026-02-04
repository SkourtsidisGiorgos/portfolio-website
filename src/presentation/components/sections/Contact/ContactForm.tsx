'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Input,
  Textarea,
  Button,
  Typography,
} from '@/presentation/components/ui';
import { cn } from '@/shared/utils/cn';
import {
  contactFormSchema,
  contactFormDefaults,
  type ContactFormData,
} from './ContactFormSchema';

export interface ContactFormProps {
  className?: string;
  onSubmitSuccess?: () => void;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface SubmitResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Contact form with validation and submission handling.
 * Uses react-hook-form for form state and Zod for validation.
 * Accessible with proper labels, error messages, and focus management.
 */
export function ContactForm({ className, onSubmitSuccess }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstErrorRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contactFormDefaults,
    mode: 'onBlur',
  });

  // Focus first error field
  useEffect(() => {
    if (Object.keys(errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.focus();
    }
  }, [errors]);

  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      setStatus('submitting');
      setSubmitError(null);

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result: SubmitResponse = await response.json();

        if (!response.ok || !result.success) {
          // Handle validation errors from server
          if (result.errors) {
            result.errors.forEach(({ field, message }) => {
              if (field in contactFormDefaults) {
                setError(field as keyof ContactFormData, { message });
              }
            });
          }
          setSubmitError(
            result.error || 'Failed to send message. Please try again.'
          );
          setStatus('error');
          return;
        }

        setStatus('success');
        reset();
        onSubmitSuccess?.();
      } catch {
        setSubmitError(
          'Network error. Please check your connection and try again.'
        );
        setStatus('error');
      }
    },
    [reset, setError, onSubmitSuccess]
  );

  const handleReset = useCallback(() => {
    setStatus('idle');
    setSubmitError(null);
    reset();
  }, [reset]);

  // Success state
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'rounded-xl bg-white/5 p-8 text-center backdrop-blur-sm',
          className
        )}
        role="status"
        aria-live="polite"
      >
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <svg
            className="h-8 w-8 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <Typography variant="h4" className="mb-2">
          Message Sent!
        </Typography>
        <Typography variant="body" muted className="mb-6">
          Thank you for reaching out. I&apos;ll get back to you as soon as
          possible.
        </Typography>
        <Button variant="outline" onClick={handleReset}>
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-6', className)}
      noValidate
      aria-label="Contact form"
    >
      {/* Error banner */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border border-red-500/30 bg-red-500/10 p-4"
            role="alert"
          >
            <Typography variant="body-sm" className="text-red-400">
              {submitError}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          {...register('name')}
          label="Name"
          placeholder="Your name"
          error={errors.name?.message}
          autoComplete="name"
          required
          aria-required="true"
        />

        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="your@email.com"
          error={errors.email?.message}
          autoComplete="email"
          required
          aria-required="true"
        />
      </div>

      <Input
        {...register('subject')}
        label="Subject"
        placeholder="What's this about?"
        error={errors.subject?.message}
        required
        aria-required="true"
      />

      <Textarea
        {...register('message')}
        label="Message"
        placeholder="Tell me about your project or idea..."
        rows={6}
        error={errors.message?.message}
        required
        aria-required="true"
      />

      <div className="flex items-center justify-between gap-4">
        <Typography variant="body-sm" muted>
          All fields are required
        </Typography>
        <Button
          type="submit"
          isLoading={status === 'submitting'}
          loadingText="Sending..."
          disabled={!isDirty || (Object.keys(errors).length > 0 && !isValid)}
        >
          Send Message
        </Button>
      </div>
    </form>
  );
}
