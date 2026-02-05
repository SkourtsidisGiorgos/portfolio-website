import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  FOCUSABLE_SELECTORS,
  generateAriaId,
  resetAriaIdCounter,
  getFocusableElements,
  isInteractiveElement,
  announceToScreenReader,
  trapFocus,
} from '../a11y';

describe('a11y utilities', () => {
  describe('FOCUSABLE_SELECTORS', () => {
    it('includes common focusable element selectors', () => {
      expect(FOCUSABLE_SELECTORS).toContain('a[href]');
      expect(FOCUSABLE_SELECTORS).toContain('button:not([disabled])');
      expect(FOCUSABLE_SELECTORS).toContain('input:not([disabled])');
      expect(FOCUSABLE_SELECTORS).toContain('[tabindex]:not([tabindex="-1"])');
    });
  });

  describe('generateAriaId', () => {
    beforeEach(() => {
      resetAriaIdCounter();
    });

    it('generates unique IDs with default prefix', () => {
      const id1 = generateAriaId();
      const id2 = generateAriaId();
      expect(id1).toBe('aria-1');
      expect(id2).toBe('aria-2');
    });

    it('generates unique IDs with custom prefix', () => {
      const id1 = generateAriaId('modal');
      const id2 = generateAriaId('dialog');
      expect(id1).toBe('modal-1');
      expect(id2).toBe('dialog-2');
    });

    it('increments counter across different prefixes', () => {
      const id1 = generateAriaId('a');
      const id2 = generateAriaId('b');
      const id3 = generateAriaId('a');
      expect(id1).toBe('a-1');
      expect(id2).toBe('b-2');
      expect(id3).toBe('a-3');
    });
  });

  describe('getFocusableElements', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it('returns empty array for null container', () => {
      expect(getFocusableElements(null)).toEqual([]);
    });

    it('returns focusable elements', () => {
      container.innerHTML = `
        <button>Click me</button>
        <a href="/test">Link</a>
        <input type="text" />
        <div>Not focusable</div>
      `;
      const elements = getFocusableElements(container);
      expect(elements).toHaveLength(3);
    });

    it('excludes disabled elements', () => {
      container.innerHTML = `
        <button>Enabled</button>
        <button disabled>Disabled</button>
      `;
      const elements = getFocusableElements(container);
      expect(elements).toHaveLength(1);
    });

    it('excludes hidden elements', () => {
      container.innerHTML = `
        <button>Visible</button>
        <button style="display: none">Hidden</button>
        <button style="visibility: hidden">Also Hidden</button>
      `;
      const elements = getFocusableElements(container);
      expect(elements).toHaveLength(1);
    });

    it('includes elements with tabindex', () => {
      container.innerHTML = `
        <div tabindex="0">Focusable div</div>
        <div tabindex="-1">Not focusable</div>
      `;
      const elements = getFocusableElements(container);
      expect(elements).toHaveLength(1);
    });
  });

  describe('isInteractiveElement', () => {
    it('returns false for null', () => {
      expect(isInteractiveElement(null)).toBe(false);
    });

    it('returns true for button', () => {
      const button = document.createElement('button');
      expect(isInteractiveElement(button)).toBe(true);
    });

    it('returns false for disabled button', () => {
      const button = document.createElement('button');
      button.setAttribute('disabled', '');
      expect(isInteractiveElement(button)).toBe(false);
    });

    it('returns true for anchor with href', () => {
      const anchor = document.createElement('a');
      anchor.setAttribute('href', '/test');
      expect(isInteractiveElement(anchor)).toBe(true);
    });

    it('returns false for anchor without href', () => {
      const anchor = document.createElement('a');
      expect(isInteractiveElement(anchor)).toBe(false);
    });

    it('returns true for input', () => {
      const input = document.createElement('input');
      expect(isInteractiveElement(input)).toBe(true);
    });

    it('returns true for element with positive tabindex', () => {
      const div = document.createElement('div');
      div.setAttribute('tabindex', '0');
      expect(isInteractiveElement(div)).toBe(true);
    });

    it('returns false for element with tabindex -1', () => {
      const div = document.createElement('div');
      div.setAttribute('tabindex', '-1');
      expect(isInteractiveElement(div)).toBe(false);
    });

    it('returns true for contenteditable element', () => {
      const div = document.createElement('div');
      div.setAttribute('contenteditable', 'true');
      expect(isInteractiveElement(div)).toBe(true);
    });

    it('returns true for elements with interactive roles', () => {
      const div = document.createElement('div');
      div.setAttribute('role', 'button');
      expect(isInteractiveElement(div)).toBe(true);
    });

    it('returns false for non-interactive elements', () => {
      const div = document.createElement('div');
      expect(isInteractiveElement(div)).toBe(false);
    });
  });

  describe('announceToScreenReader', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('creates a live region with message', () => {
      announceToScreenReader('Test message');

      // Find the live region
      const liveRegion = document.querySelector('[aria-live]');
      expect(liveRegion).toBeTruthy();
      expect(liveRegion?.getAttribute('aria-live')).toBe('polite');
      expect(liveRegion?.getAttribute('role')).toBe('status');

      // Cleanup
      vi.advanceTimersByTime(1500);
    });

    it('uses assertive politeness when specified', () => {
      announceToScreenReader('Urgent message', 'assertive');

      const liveRegion = document.querySelector('[aria-live="assertive"]');
      expect(liveRegion).toBeTruthy();

      // Cleanup
      vi.advanceTimersByTime(1500);
    });

    it('removes live region after timeout', () => {
      announceToScreenReader('Test message');

      expect(document.querySelector('[aria-live]')).toBeTruthy();

      vi.advanceTimersByTime(1500);

      expect(document.querySelector('[aria-live]')).toBeFalsy();
    });
  });

  describe('trapFocus', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement('div');
      container.innerHTML = `
        <button id="first">First</button>
        <button id="middle">Middle</button>
        <button id="last">Last</button>
      `;
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it('returns cleanup function for null container', () => {
      const cleanup = trapFocus(null);
      expect(typeof cleanup).toBe('function');
      cleanup(); // Should not throw
    });

    it('returns cleanup function for valid container', () => {
      const cleanup = trapFocus(container);
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('traps focus on Tab at last element', () => {
      const cleanup = trapFocus(container);
      const firstButton = container.querySelector('#first') as HTMLElement;
      const lastButton = container.querySelector('#last') as HTMLElement;

      lastButton.focus();
      expect(document.activeElement).toBe(lastButton);

      // Simulate Tab key
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(tabEvent, 'preventDefault');
      document.dispatchEvent(tabEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(firstButton);

      cleanup();
    });

    it('traps focus on Shift+Tab at first element', () => {
      const cleanup = trapFocus(container);
      const firstButton = container.querySelector('#first') as HTMLElement;
      const lastButton = container.querySelector('#last') as HTMLElement;

      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      // Simulate Shift+Tab key
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(tabEvent, 'preventDefault');
      document.dispatchEvent(tabEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(lastButton);

      cleanup();
    });

    it('allows normal Tab navigation in the middle', () => {
      const cleanup = trapFocus(container);
      const middleButton = container.querySelector('#middle') as HTMLElement;

      middleButton.focus();

      // Simulate Tab key
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(tabEvent, 'preventDefault');
      document.dispatchEvent(tabEvent);

      // Should not prevent default when in middle
      expect(preventDefaultSpy).not.toHaveBeenCalled();

      cleanup();
    });

    it('cleanup removes event listener', () => {
      const cleanup = trapFocus(container);
      const lastButton = container.querySelector('#last') as HTMLElement;
      const firstButton = container.querySelector('#first') as HTMLElement;

      cleanup();

      lastButton.focus();
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });
      document.dispatchEvent(tabEvent);

      // Focus should not have moved to first button
      expect(document.activeElement).toBe(lastButton);
    });
  });
});
