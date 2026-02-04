'use client';

import { forwardRef, type InputHTMLAttributes, useId } from 'react';
import { cn } from '@/shared/utils/cn';
import {
  inputBaseStyles,
  inputErrorStyles,
  buildAriaDescribedBy,
} from './shared';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = error ? `${id}-error` : undefined;
    const hintId = hint ? `${id}-hint` : undefined;

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
          className={cn(inputBaseStyles, error && inputErrorStyles, className)}
          aria-invalid={!!error}
          aria-describedby={buildAriaDescribedBy(errorId, hintId)}
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
