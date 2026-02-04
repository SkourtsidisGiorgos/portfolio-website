import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useMediaQuery, useIsMobile } from '@/presentation/hooks/useMediaQuery';
import { useScrollTo } from '@/presentation/hooks/useScrollSpy';

describe('useScrollTo', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a scrollTo function', () => {
    const { result } = renderHook(() => useScrollTo());
    expect(typeof result.current).toBe('function');
  });

  it('should scroll to element by id', () => {
    // Create a mock element
    const mockElement = document.createElement('div');
    mockElement.id = 'test-section';
    Object.defineProperty(mockElement, 'offsetTop', { value: 500 });
    document.body.appendChild(mockElement);

    const { result } = renderHook(() => useScrollTo());

    act(() => {
      result.current('test-section');
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 420, // 500 - 80 (default offset)
      behavior: 'smooth',
    });

    document.body.removeChild(mockElement);
  });

  it('should scroll with custom offset', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'test-section';
    Object.defineProperty(mockElement, 'offsetTop', { value: 500 });
    document.body.appendChild(mockElement);

    const { result } = renderHook(() => useScrollTo());

    act(() => {
      result.current('test-section', 100);
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 400, // 500 - 100
      behavior: 'smooth',
    });

    document.body.removeChild(mockElement);
  });

  it('should not scroll if element not found', () => {
    const { result } = renderHook(() => useScrollTo());

    act(() => {
      result.current('non-existent');
    });

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});

describe('useMediaQuery', () => {
  let currentMatches: boolean;
  let changeListeners: Array<() => void>;

  beforeEach(() => {
    currentMatches = false;
    changeListeners = [];
    const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
      get matches() {
        return currentMatches;
      },
      media: query,
      addEventListener: (_event: string, listener: () => void) => {
        changeListeners.push(listener);
      },
      removeEventListener: (_event: string, listener: () => void) => {
        const index = changeListeners.indexOf(listener);
        if (index > -1) changeListeners.splice(index, 1);
      },
    }));
    window.matchMedia = mockMatchMedia as typeof window.matchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false when query does not match', () => {
    currentMatches = false;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('should return true when query matches', () => {
    currentMatches = true;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('should update when media query changes', () => {
    currentMatches = false;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      currentMatches = true;
      changeListeners.forEach(listener => listener());
    });

    expect(result.current).toBe(true);
  });
});

describe('useIsMobile', () => {
  beforeEach(() => {
    const mockMatchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.matchMedia = mockMatchMedia as typeof window.matchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true on mobile (below md breakpoint)', () => {
    // When min-width: 768px does NOT match, we're on mobile
    // The beforeEach sets matches: false, so this should return true (is mobile)
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return false on desktop (at or above md breakpoint)', () => {
    // Override for this test to simulate desktop
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true, // min-width: 768px matches
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as typeof window.matchMedia;

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
