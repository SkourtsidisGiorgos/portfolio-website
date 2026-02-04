import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ScrollIndicator } from '../ScrollIndicator';

// Mock useScrollProgress hook
vi.mock('@/presentation/three/hooks/useScrollProgress', () => ({
  useScrollProgress: vi.fn(() => ({
    progress: 0,
    scrollY: 0,
    direction: null,
    velocity: 0,
    isScrolling: false,
  })),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      'aria-hidden': ariaHidden,
    }: {
      children?: React.ReactNode;
      className?: string;
      'aria-hidden'?: boolean | 'true' | 'false';
    }) => (
      <div className={className} aria-hidden={ariaHidden}>
        {children}
      </div>
    ),
  },
}));

describe('ScrollIndicator', () => {
  it('renders with default text', () => {
    render(<ScrollIndicator />);

    expect(screen.getByText('Scroll to explore')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<ScrollIndicator text="Keep scrolling" />);

    expect(screen.getByText('Keep scrolling')).toBeInTheDocument();
  });

  it('renders arrow icon', () => {
    render(<ScrollIndicator />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has aria-hidden attribute', () => {
    const { container } = render(<ScrollIndicator />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies custom className', () => {
    const { container } = render(<ScrollIndicator className="custom-class" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  describe('visibility based on scroll', () => {
    it('should be visible when progress is 0', async () => {
      const { useScrollProgress } =
        await import('@/presentation/three/hooks/useScrollProgress');
      vi.mocked(useScrollProgress).mockReturnValue({
        progress: 0,
        scrollY: 0,
        direction: null,
        velocity: 0,
        isScrolling: false,
      });

      const { container } = render(<ScrollIndicator />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should hide when progress exceeds threshold', async () => {
      const { useScrollProgress } =
        await import('@/presentation/three/hooks/useScrollProgress');
      vi.mocked(useScrollProgress).mockReturnValue({
        progress: 0.2,
        scrollY: 200,
        direction: 'down',
        velocity: 1,
        isScrolling: false,
      });

      const { container } = render(<ScrollIndicator hideThreshold={0.1} />);
      expect(container.firstChild).toBeNull();
    });
  });
});
