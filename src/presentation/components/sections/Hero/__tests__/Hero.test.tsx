import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Hero } from '../Hero';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
    }: {
      children?: React.ReactNode;
      className?: string;
    }) => <div className={className}>{children}</div>,
  },
  useReducedMotion: vi.fn(() => false),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock HeroCanvas (complex 3D component)
vi.mock('../HeroCanvas', () => ({
  HeroCanvas: () => <div data-testid="hero-canvas">Canvas</div>,
}));

// Mock ScrollIndicator
vi.mock('../ScrollIndicator', () => ({
  ScrollIndicator: () => <div data-testid="scroll-indicator">Scroll</div>,
}));

// Mock useScrollProgress
vi.mock('@/presentation/three/hooks/useScrollProgress', () => ({
  useScrollProgress: vi.fn(() => ({ progress: 0, isScrolling: false })),
}));

describe('Hero', () => {
  it('renders default title', () => {
    render(<Hero />);

    expect(screen.getByText('Giorgos Skourtsidis')).toBeInTheDocument();
  });

  it('renders default subtitle', () => {
    render(<Hero />);

    expect(
      screen.getByText('Big Data & Software Engineer')
    ).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<Hero title="Custom Name" />);

    expect(screen.getByText('Custom Name')).toBeInTheDocument();
  });

  it('renders custom subtitle', () => {
    render(<Hero subtitle="Custom Role" />);

    expect(screen.getByText('Custom Role')).toBeInTheDocument();
  });

  it('renders custom description', () => {
    render(<Hero description="Custom description text" />);

    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('renders HeroCanvas by default', () => {
    render(<Hero />);

    expect(screen.getByTestId('hero-canvas')).toBeInTheDocument();
  });

  it('does not render HeroCanvas when disable3D is true', () => {
    render(<Hero disable3D />);

    expect(screen.queryByTestId('hero-canvas')).not.toBeInTheDocument();
  });

  it('renders scroll indicator by default', () => {
    render(<Hero />);

    expect(screen.getByTestId('scroll-indicator')).toBeInTheDocument();
  });

  it('does not render scroll indicator when showScrollIndicator is false', () => {
    render(<Hero showScrollIndicator={false} />);

    expect(screen.queryByTestId('scroll-indicator')).not.toBeInTheDocument();
  });

  it('renders skip link for accessibility', () => {
    render(<Hero />);

    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('has hero section with correct id', () => {
    const { container } = render(<Hero />);

    const section = container.querySelector('#hero');
    expect(section).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    const buttons = [
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
    ];

    render(<Hero ctaButtons={buttons} />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Hero className="custom-hero" />);

    const section = container.querySelector('#hero');
    expect(section).toHaveClass('custom-hero');
  });

  describe('reduced motion', () => {
    it('disables 3D when reduced motion is preferred', async () => {
      const { useReducedMotion } = await import('framer-motion');
      vi.mocked(useReducedMotion).mockReturnValue(true);

      render(<Hero />);

      expect(screen.queryByTestId('hero-canvas')).not.toBeInTheDocument();
    });
  });
});
