/**
 * Accessibility Utility Functions
 *
 * Centralized utilities for WCAG 2.1 AA compliance.
 * Used across components for consistent accessibility patterns.
 *
 * @module a11y
 */

/**
 * CSS selector for all focusable elements.
 * Extracted from ProjectModal focus trap implementation.
 */
export const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Counter for generating unique ARIA IDs
 */
let ariaIdCounter = 0;

/**
 * Generates a unique ARIA-compatible ID with optional prefix.
 *
 * @param prefix - Optional prefix for the ID (default: 'aria')
 * @returns A unique ID string
 *
 * @example
 * generateAriaId('modal') // 'modal-1'
 * generateAriaId() // 'aria-2'
 */
export function generateAriaId(prefix = 'aria'): string {
  ariaIdCounter += 1;
  return `${prefix}-${ariaIdCounter}`;
}

/**
 * Resets the ARIA ID counter (for testing purposes).
 * @internal
 */
export function resetAriaIdCounter(): void {
  ariaIdCounter = 0;
}

/**
 * Gets all focusable elements within a container.
 *
 * @param container - The container element to search within
 * @returns Array of focusable HTML elements
 *
 * @example
 * const modal = document.querySelector('.modal');
 * const focusable = getFocusableElements(modal);
 */
export function getFocusableElements(
  container: HTMLElement | null
): HTMLElement[] {
  if (!container) return [];

  const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
  return Array.from(elements).filter(el => {
    // Filter out elements that are not visible or have display: none
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
}

/**
 * Set of interactive HTML tag names.
 */
const INTERACTIVE_TAGS = new Set([
  'a',
  'button',
  'input',
  'select',
  'textarea',
]);

/**
 * Set of ARIA roles that imply interactivity.
 */
const INTERACTIVE_ROLES = new Set([
  'button',
  'link',
  'checkbox',
  'radio',
  'switch',
  'tab',
  'menuitem',
  'option',
]);

/**
 * Checks if an interactive tag element is actually interactive.
 */
function isInteractiveTag(element: Element, tagName: string): boolean {
  if (element.hasAttribute('disabled')) return false;
  if (tagName === 'a' && !element.hasAttribute('href')) return false;
  return true;
}

/**
 * Checks if an element is interactive (focusable and clickable).
 *
 * @param element - The element to check
 * @returns true if the element is interactive
 *
 * @example
 * isInteractiveElement(document.querySelector('button')) // true
 * isInteractiveElement(document.querySelector('div')) // false
 */
export function isInteractiveElement(element: Element | null): boolean {
  if (!element) return false;

  const tagName = element.tagName.toLowerCase();

  // Check for native interactive elements
  if (INTERACTIVE_TAGS.has(tagName)) {
    return isInteractiveTag(element, tagName);
  }

  // Check for tabindex
  const tabindex = element.getAttribute('tabindex');
  if (tabindex !== null && tabindex !== '-1') return true;

  // Check for contenteditable
  if (element.hasAttribute('contenteditable')) return true;

  // Check for role that implies interactivity
  const role = element.getAttribute('role');
  if (role && INTERACTIVE_ROLES.has(role)) return true;

  return false;
}

/**
 * Politeness level for screen reader announcements.
 */
export type AnnoucementPoliteness = 'polite' | 'assertive';

/**
 * Announces a message to screen readers programmatically.
 * Creates a live region, announces, then removes it after a delay.
 *
 * @param message - The message to announce
 * @param politeness - 'polite' (default) or 'assertive'
 *
 * @example
 * announceToScreenReader('Form submitted successfully');
 * announceToScreenReader('Error: Please fill all required fields', 'assertive');
 */
export function announceToScreenReader(
  message: string,
  politeness: AnnoucementPoliteness = 'polite'
): void {
  if (typeof document === 'undefined') return;

  // Create a live region
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', politeness);
  liveRegion.setAttribute('aria-atomic', 'true');

  // Visually hide but keep accessible
  Object.assign(liveRegion.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  });

  document.body.appendChild(liveRegion);

  // Set message after a brief delay to ensure screen reader picks it up
  requestAnimationFrame(() => {
    liveRegion.textContent = message;
  });

  // Remove after announcement has been made
  setTimeout(() => {
    if (liveRegion.parentNode) {
      liveRegion.parentNode.removeChild(liveRegion);
    }
  }, 1000);
}

/**
 * Traps focus within a container element.
 * Returns cleanup function to remove listeners.
 *
 * @param container - The container to trap focus within
 * @returns Cleanup function
 *
 * @example
 * const cleanup = trapFocus(modalRef.current);
 * // Later...
 * cleanup();
 */
export function trapFocus(container: HTMLElement | null): () => void {
  if (!container) return () => {};

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}
