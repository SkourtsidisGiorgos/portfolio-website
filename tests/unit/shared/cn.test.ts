import { describe, it, expect } from 'vitest';
import { cn } from '@/shared/utils/cn';

describe('cn utility', () => {
  it('should merge basic class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    const includeBar = false;
    const includeBaz = true;
    expect(cn('foo', includeBar && 'bar', 'baz')).toBe('foo baz');
    expect(cn('foo', includeBaz && 'bar', 'baz')).toBe('foo bar baz');
  });

  it('should handle undefined and null values', () => {
    expect(cn('foo', undefined, 'bar', null)).toBe('foo bar');
  });

  it('should merge Tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle object syntax', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('should handle array syntax', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('should handle mixed syntax', () => {
    expect(cn('foo', { bar: true }, ['baz', 'qux'])).toBe('foo bar baz qux');
  });

  it('should return empty string for no arguments', () => {
    expect(cn()).toBe('');
  });

  it('should handle complex Tailwind class conflicts', () => {
    expect(cn('bg-red-500 hover:bg-red-600', 'bg-blue-500')).toBe(
      'hover:bg-red-600 bg-blue-500'
    );
  });
});
