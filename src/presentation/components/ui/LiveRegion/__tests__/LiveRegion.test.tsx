import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LiveRegion } from '../LiveRegion';

describe('LiveRegion', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with aria-live attribute', () => {
    render(<LiveRegion message="Test message" />);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
  });

  it('renders message content', () => {
    render(<LiveRegion message="Test message" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders nothing when message is null', () => {
    render(<LiveRegion message={null} />);
    const region = screen.getByRole('status');
    expect(region).toBeEmptyDOMElement();
  });

  it('uses assertive politeness when specified', () => {
    render(<LiveRegion message="Urgent!" politeness="assertive" />);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'assertive');
  });

  it('has aria-atomic attribute', () => {
    render(<LiveRegion message="Test" />);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-atomic', 'true');
  });

  it('is visually hidden by default', () => {
    render(<LiveRegion message="Hidden message" />);
    const region = screen.getByRole('status');
    expect(region).toHaveClass('absolute');
    expect(region).toHaveClass('h-px');
    expect(region).toHaveClass('w-px');
  });

  it('is visible when visuallyHidden is false', () => {
    render(<LiveRegion message="Visible message" visuallyHidden={false} />);
    const region = screen.getByRole('status');
    expect(region).not.toHaveClass('absolute');
    expect(region).not.toHaveClass('h-px');
  });

  it('applies custom className', () => {
    render(
      <LiveRegion
        message="Test"
        visuallyHidden={false}
        className="custom-class"
      />
    );
    const region = screen.getByRole('status');
    expect(region).toHaveClass('custom-class');
  });

  it('auto-clears message after specified time', () => {
    const onClear = vi.fn();
    render(
      <LiveRegion
        message="Temporary message"
        clearAfter={3000}
        onClear={onClear}
      />
    );

    expect(screen.getByText('Temporary message')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Temporary message')).not.toBeInTheDocument();
    expect(onClear).toHaveBeenCalled();
  });

  it('does not auto-clear when clearAfter is 0', () => {
    const onClear = vi.fn();
    render(
      <LiveRegion
        message="Permanent message"
        clearAfter={0}
        onClear={onClear}
      />
    );

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(screen.getByText('Permanent message')).toBeInTheDocument();
    expect(onClear).not.toHaveBeenCalled();
  });

  it('updates message when prop changes', () => {
    const { rerender } = render(<LiveRegion message="First message" />);
    expect(screen.getByText('First message')).toBeInTheDocument();

    rerender(<LiveRegion message="Second message" />);
    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.queryByText('First message')).not.toBeInTheDocument();
  });

  it('resets clear timer when message changes', () => {
    const onClear = vi.fn();
    const { rerender } = render(
      <LiveRegion message="First" clearAfter={3000} onClear={onClear} />
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Change message before timer completes
    rerender(
      <LiveRegion message="Second" clearAfter={3000} onClear={onClear} />
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Should still have the second message (timer restarted)
    expect(screen.getByText('Second')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Now it should be cleared
    expect(onClear).toHaveBeenCalled();
  });
});
