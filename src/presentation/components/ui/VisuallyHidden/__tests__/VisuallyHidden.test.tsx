import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisuallyHidden } from '../VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders children', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    expect(screen.getByText('Hidden text')).toBeInTheDocument();
  });

  it('renders as span by default', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    const element = screen.getByText('Hidden text');
    expect(element.tagName.toLowerCase()).toBe('span');
  });

  it('renders as custom element when specified', () => {
    render(<VisuallyHidden as="div">Hidden text</VisuallyHidden>);
    const element = screen.getByText('Hidden text');
    expect(element.tagName.toLowerCase()).toBe('div');
  });

  it('applies sr-only styles by default', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    const element = screen.getByText('Hidden text');

    expect(element).toHaveClass('absolute');
    expect(element).toHaveClass('h-px');
    expect(element).toHaveClass('w-px');
    expect(element).toHaveClass('overflow-hidden');
  });

  it('applies focus-visible styles when focusable', () => {
    render(<VisuallyHidden focusable>Skip to content</VisuallyHidden>);
    const element = screen.getByText('Skip to content');

    expect(element).toHaveClass('focus:relative');
    expect(element).toHaveClass('focus:h-auto');
    expect(element).toHaveClass('focus:w-auto');
  });

  it('merges custom className', () => {
    render(
      <VisuallyHidden className="custom-class">Hidden text</VisuallyHidden>
    );
    const element = screen.getByText('Hidden text');
    expect(element).toHaveClass('custom-class');
  });

  it('can be used as a link when focusable', () => {
    render(
      <VisuallyHidden as="a" focusable>
        Skip to main content
      </VisuallyHidden>
    );
    const element = screen.getByText('Skip to main content');
    expect(element.tagName.toLowerCase()).toBe('a');
  });

  it('is accessible to screen readers', () => {
    render(<VisuallyHidden>Screen reader text</VisuallyHidden>);
    // The text should be in the document
    expect(screen.getByText('Screen reader text')).toBeInTheDocument();
  });
});
