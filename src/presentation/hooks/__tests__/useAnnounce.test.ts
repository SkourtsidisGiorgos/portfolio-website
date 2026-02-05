import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { announceToScreenReader } from '@/shared/utils/a11y';
import { useAnnounce } from '../useAnnounce';

// Mock the a11y module
vi.mock('@/shared/utils/a11y', () => ({
  announceToScreenReader: vi.fn(),
}));

describe('useAnnounce', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns announce, announcement, and clearAnnouncement', () => {
    const { result } = renderHook(() => useAnnounce());

    expect(typeof result.current.announce).toBe('function');
    expect(typeof result.current.clearAnnouncement).toBe('function');
    expect(result.current.announcement).toBeNull();
  });

  it('starts with null announcement', () => {
    const { result } = renderHook(() => useAnnounce());
    expect(result.current.announcement).toBeNull();
  });

  it('announce sets announcement state', () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current.announce('Test message');
    });

    expect(result.current.announcement).toEqual({
      message: 'Test message',
      politeness: 'polite',
    });
  });

  it('announce calls announceToScreenReader', () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current.announce('Test message');
    });

    expect(announceToScreenReader).toHaveBeenCalledWith(
      'Test message',
      'polite'
    );
  });

  it('announce supports assertive politeness', () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current.announce('Urgent message', 'assertive');
    });

    expect(result.current.announcement).toEqual({
      message: 'Urgent message',
      politeness: 'assertive',
    });
    expect(announceToScreenReader).toHaveBeenCalledWith(
      'Urgent message',
      'assertive'
    );
  });

  it('clearAnnouncement resets announcement to null', () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current.announce('Test message');
    });

    expect(result.current.announcement).not.toBeNull();

    act(() => {
      result.current.clearAnnouncement();
    });

    expect(result.current.announcement).toBeNull();
  });

  it('multiple announcements update state correctly', () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current.announce('First message');
    });

    expect(result.current.announcement?.message).toBe('First message');

    act(() => {
      result.current.announce('Second message', 'assertive');
    });

    expect(result.current.announcement).toEqual({
      message: 'Second message',
      politeness: 'assertive',
    });
  });

  it('announce and clearAnnouncement are stable references', () => {
    const { result, rerender } = renderHook(() => useAnnounce());

    const firstAnnounce = result.current.announce;
    const firstClear = result.current.clearAnnouncement;

    rerender();

    expect(result.current.announce).toBe(firstAnnounce);
    expect(result.current.clearAnnouncement).toBe(firstClear);
  });
});
