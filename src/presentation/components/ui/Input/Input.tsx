'use client';

import { forwardRef, type InputHTMLAttributes, useId } from 'react';
import { cn } from '@/shared/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-lg px-4 py-2.5',
            'bg-white/5 backdrop-blur-sm',
            'border border-white/10',
            'text-white placeholder:text-gray-500',
            'transition-colors duration-200',
            'focus:ring-primary-500/50 focus:border-primary-500 focus:ring-2 focus:outline-none',
            error &&
              'border-red-500 focus:border-red-500 focus:ring-red-500/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            [error && errorId, hint && hintId].filter(Boolean).join(' ') ||
            undefined
          }
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-sm text-gray-400">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
