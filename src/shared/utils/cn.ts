import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and merges Tailwind CSS classes using tailwind-merge.
 * This utility handles conditional classes and resolves Tailwind class conflicts.
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (px-4 wins)
 * cn('text-red-500', condition && 'text-blue-500')
 * cn({ 'bg-primary': isActive }, 'hover:bg-secondary')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
