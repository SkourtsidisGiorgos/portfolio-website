import { cn } from '@/shared/utils/cn';

/**
 * Shared styles for form input elements (Input, Textarea)
 */
export const inputBaseStyles = cn(
  'w-full rounded-lg px-4 py-2.5',
  'bg-white/5 backdrop-blur-sm',
  'border border-white/10',
  'text-white placeholder:text-gray-500',
  'transition-colors duration-200',
  'focus:ring-primary-500/50 focus:border-primary-500 focus:ring-2 focus:outline-none',
  'disabled:cursor-not-allowed disabled:opacity-50'
);

export const inputErrorStyles =
  'border-red-500 focus:border-red-500 focus:ring-red-500/50';

/**
 * Builds the aria-describedby attribute value from error and hint IDs
 */
export function buildAriaDescribedBy(
  errorId: string | undefined,
  hintId: string | undefined
): string | undefined {
  const ids = [errorId, hintId].filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
}
