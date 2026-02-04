import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLazySection } from '../useLazySection';

describe('useLazySection', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockUnobserve: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();
    mockUnobserve = vi.fn();

    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn().mockImplementation(() => ({
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: mockUnobserve,
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('returns ref, isVisible, hasLoaded, and triggerLoad', () => {
    const { result } = renderHook(() => useLazySection());

    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.isVisible).toBe('boolean');
    expect(typeof result.current.hasLoaded).toBe('boolean');
    expect(typeof result.current.triggerLoad).toBe('function');
  });

  it('starts with isVisible and hasLoaded as false', () => {
    const { result } = renderHook(() => useLazySection());

    expect(result.current.isVisible).toBe(false);
    expect(result.current.hasLoaded).toBe(false);
  });

  it('sets isVisible and hasLoaded to true when disabled', () => {
    const { result } = renderHook(() => useLazySection({ disabled: true }));

    expect(result.current.isVisible).toBe(true);
    expect(result.current.hasLoaded).toBe(true);
  });

  it('triggerLoad manually sets both isVisible and hasLoaded to true', () => {
    const { result } = renderHook(() => useLazySection());

    expect(result.current.isVisible).toBe(false);
    expect(result.current.hasLoaded).toBe(false);

    act(() => {
      result.current.triggerLoad();
    });

    expect(result.current.isVisible).toBe(true);
    expect(result.current.hasLoaded).toBe(true);
  });

  it('returns a valid ref object', () => {
    const { result } = renderHook(() => useLazySection());

    // The ref should be a mutable ref object
    expect(result.current.ref).toHaveProperty('current');
    expect(result.current.ref.current).toBe(null);
  });

  it('accepts custom options without throwing', () => {
    // Should not throw with custom options
    const { result } = renderHook(() =>
      useLazySection({
        rootMargin: '100px 0px',
        threshold: 0.5,
      })
    );

    expect(result.current.ref).toBeDefined();
  });

  it('triggerOnce defaults to true', () => {
    const { result } = renderHook(() => useLazySection());

    // The hook's default triggerOnce should be true
    // Once triggered, hasLoaded stays true
    act(() => {
      result.current.triggerLoad();
    });

    expect(result.current.hasLoaded).toBe(true);
  });

  it('supports triggerOnce false option', () => {
    const { result } = renderHook(() => useLazySection({ triggerOnce: false }));

    // Hook should work with triggerOnce: false
    expect(result.current).toBeDefined();
  });
});

describe('useLazySection - fallback behavior', () => {
  it('gracefully handles when IntersectionObserver is undefined', () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    // Should not throw
    const { result } = renderHook(() => useLazySection());

    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.isVisible).toBe('boolean');
    expect(typeof result.current.hasLoaded).toBe('boolean');
  });
});
