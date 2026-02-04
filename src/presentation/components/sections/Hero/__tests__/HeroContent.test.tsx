import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroContent } from '../HeroContent';

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

describe('HeroContent', () => {
  const defaultProps = {
    title: 'John Doe',
    subtitle: 'Software Engineer',
  };

  it('renders title', () => {
    render(<HeroContent {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<HeroContent {...defaultProps} />);

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <HeroContent {...defaultProps} description="Building amazing things" />
    );

    expect(screen.getByText('Building amazing things')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<HeroContent {...defaultProps} />);

    // Check that only title and subtitle are in the document
    expect(
      screen.queryByText('Building amazing things')
    ).not.toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    const buttons = [
      { label: 'View Work', href: '#work' },
      { label: 'Contact', href: '#contact' },
    ];

    render(<HeroContent {...defaultProps} ctaButtons={buttons} />);

    expect(screen.getByText('View Work')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('does not render buttons when array is empty', () => {
    render(<HeroContent {...defaultProps} ctaButtons={[]} />);

    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  it('uses h1 for title', () => {
    render(<HeroContent {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('John Doe');
  });

  it('applies custom className', () => {
    const { container } = render(
      <HeroContent {...defaultProps} className="custom-class" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('renders buttons as links', () => {
    const buttons = [
      { label: 'Primary', href: '#1', variant: 'primary' as const },
      { label: 'Outline', href: '#2', variant: 'outline' as const },
    ];

    render(<HeroContent {...defaultProps} ctaButtons={buttons} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '#1');
    expect(links[1]).toHaveAttribute('href', '#2');
  });
});
