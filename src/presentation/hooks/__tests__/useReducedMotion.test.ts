import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useReducedMotion } from '../useReducedMotion';

describe('useReducedMotion', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>;
  let changeHandler: (() => void) | null = null;

  beforeEach(() => {
    changeHandler = null;
    mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: (_event: string, handler: () => void) => {
        changeHandler = handler;
      },
      removeEventListener: vi.fn(),
    }));
    vi.stubGlobal('window', {
      matchMedia: mockMatchMedia,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('returns false when user does not prefer reduced motion', () => {
    mockMatchMedia.mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when user prefers reduced motion', () => {
    mockMatchMedia.mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('updates when preference changes', () => {
    let currentMatches = false;
    mockMatchMedia.mockImplementation(() => ({
      get matches() {
        return currentMatches;
      },
      addEventListener: (_event: string, handler: () => void) => {
        changeHandler = handler;
      },
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    // Simulate preference change
    act(() => {
      currentMatches = true;
      changeHandler?.();
    });

    expect(result.current).toBe(true);
  });

  it('calls matchMedia with correct query', () => {
    renderHook(() => useReducedMotion());
    expect(mockMatchMedia).toHaveBeenCalledWith(
      '(prefers-reduced-motion: reduce)'
    );
  });

  it('removes event listener on unmount', () => {
    const removeEventListener = vi.fn();
    mockMatchMedia.mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener,
    }));

    const { unmount } = renderHook(() => useReducedMotion());
    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('handles both true and false preference states correctly', () => {
    // Test that the hook correctly reflects both states
    mockMatchMedia.mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result: resultTrue } = renderHook(() => useReducedMotion());
    expect(resultTrue.current).toBe(true);

    mockMatchMedia.mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result: resultFalse } = renderHook(() => useReducedMotion());
    expect(resultFalse.current).toBe(false);
  });
});
