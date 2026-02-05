import { useRef } from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFocusManagement } from '../useFocusManagement';

describe('useFocusManagement', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <button id="first">First</button>
      <input id="middle" type="text" />
      <button id="last">Last</button>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  it('returns focusFirst and focusLast functions', () => {
    const { result } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      return useFocusManagement({ containerRef, enabled: false });
    });

    expect(typeof result.current.focusFirst).toBe('function');
    expect(typeof result.current.focusLast).toBe('function');
  });

  it('focuses first element when enabled', () => {
    const firstButton = container.querySelector('#first') as HTMLElement;

    renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      return useFocusManagement({ containerRef, enabled: true });
    });

    expect(document.activeElement).toBe(firstButton);
  });

  it('focuses initial focus element when provided', () => {
    const middleInput = container.querySelector('#middle') as HTMLElement;

    renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      const initialFocusRef = useRef<HTMLElement>(middleInput);
      return useFocusManagement({
        containerRef,
        enabled: true,
        initialFocusRef,
      });
    });

    expect(document.activeElement).toBe(middleInput);
  });

  it('does not focus when disabled', () => {
    const previousActive = document.activeElement;

    renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      return useFocusManagement({ containerRef, enabled: false });
    });

    expect(document.activeElement).toBe(previousActive);
  });

  it('traps focus on Tab at last element', () => {
    const firstButton = container.querySelector('#first') as HTMLElement;
    const lastButton = container.querySelector('#last') as HTMLElement;

    renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      return useFocusManagement({ containerRef, enabled: true });
    });

    lastButton.focus();
    expect(document.activeElement).toBe(lastButton);

    // Simulate Tab key
    act(() => {
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });
      Object.defineProperty(tabEvent, 'preventDefault', {
        value: vi.fn(),
        writable: true,
      });
      document.dispatchEvent(tabEvent);
    });

    expect(document.activeElement).toBe(firstButton);
  });

  it('traps focus on Shift+Tab at first element', () => {
    const firstButton = container.querySelector('#first') as HTMLElement;
    const lastButton = container.querySelector('#last') as HTMLElement;

    renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      return useFocusManagement({ containerRef, enabled: true });
    });

    firstButton.focus();
    expect(document.activeElement).toBe(firstButton);

    // Simulate Shift+Tab key
    act(() => {
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      });
      Object.defineProperty(tabEvent, 'preventDefault', {
        value: vi.fn(),
        writable: true,
      });
      document.dispatchEvent(tabEvent);
    });

    expect(document.activeElement).toBe(lastButton);
  });

  it('restores focus on cleanup when restoreFocus is true', () => {
    const outsideButton = document.createElement('button');
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const { unmount } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      return useFocusManagement({
        containerRef,
        enabled: true,
        restoreFocus: true,
      });
    });

    // Focus should be inside container
    expect(document.activeElement).not.toBe(outsideButton);

    unmount();

    // Focus should be restored
    expect(document.activeElement).toBe(outsideButton);

    document.body.removeChild(outsideButton);
  });

  it('does not restore focus when restoreFocus is false', () => {
    const outsideButton = document.createElement('button');
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const { unmount } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      return useFocusManagement({
        containerRef,
        enabled: true,
        restoreFocus: false,
      });
    });

    unmount();

    // Focus should NOT be restored to outside button
    expect(document.activeElement).not.toBe(outsideButton);

    document.body.removeChild(outsideButton);
  });

  it('focusFirst focuses the first element', () => {
    const firstButton = container.querySelector('#first') as HTMLElement;
    const lastButton = container.querySelector('#last') as HTMLElement;

    const { result } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      return useFocusManagement({ containerRef, enabled: false });
    });

    lastButton.focus();

    act(() => {
      result.current.focusFirst();
    });

    expect(document.activeElement).toBe(firstButton);
  });

  it('focusLast focuses the last element', () => {
    const lastButton = container.querySelector('#last') as HTMLElement;

    const { result } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      return useFocusManagement({ containerRef, enabled: false });
    });

    act(() => {
      result.current.focusLast();
    });

    expect(document.activeElement).toBe(lastButton);
  });
});
