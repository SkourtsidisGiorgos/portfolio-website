import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { About } from '../About';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      ...props
    }: {
      children?: React.ReactNode;
      className?: string;
    }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  useInView: vi.fn(() => true),
  useReducedMotion: vi.fn(() => false),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}));

// Mock useAboutData hook
vi.mock('@/presentation/hooks/useAboutData', () => ({
  useAboutData: () => ({
    profile: {
      name: 'Test User',
      title: 'Test Engineer',
      location: 'Test City',
      availability: 'Remote',
      summary: 'Test summary text',
      social: {
        github: 'https://github.com/test',
        linkedin: 'https://linkedin.com/in/test',
        email: 'mailto:test@test.com',
      },
    },
    metrics: [
      {
        value: '4+',
        label: 'Years Experience',
        icon: 'clock',
        numericValue: 4,
      },
      { value: '15+', label: 'Projects', icon: 'folder', numericValue: 15 },
    ],
    highlights: [
      { id: '1', title: 'Focus', content: 'Testing', icon: 'graduation' },
    ],
    isLoading: false,
  }),
}));

describe('About', () => {
  it('renders section with correct id', () => {
    const { container } = render(<About />);

    const section = container.querySelector('#about');
    expect(section).toBeInTheDocument();
  });

  it('renders section heading', () => {
    render(<About />);

    expect(screen.getByText('Building Data Solutions')).toBeInTheDocument();
  });

  it('renders profile name', () => {
    render(<About />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('renders profile title', () => {
    render(<About />);

    expect(screen.getByText('Test Engineer')).toBeInTheDocument();
  });

  it('renders summary text', () => {
    render(<About />);

    expect(screen.getByText('Test summary text')).toBeInTheDocument();
  });

  it('renders metric cards', () => {
    render(<About />);

    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('renders highlight cards', () => {
    render(<About />);

    expect(screen.getByText('Focus')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<About />);

    const githubLink = screen.getByLabelText('GitHub Profile');
    const linkedinLink = screen.getByLabelText('LinkedIn Profile');
    const emailLink = screen.getByLabelText('Email Contact');

    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    expect(emailLink).toBeInTheDocument();
  });

  it('has correct aria-labelledby for accessibility', () => {
    const { container } = render(<About />);

    const section = container.querySelector('#about');
    expect(section).toHaveAttribute('aria-labelledby', 'about-heading');
  });

  it('accepts custom id', () => {
    const { container } = render(<About id="custom-about" />);

    const section = container.querySelector('#custom-about');
    expect(section).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<About className="custom-class" />);

    const section = container.querySelector('#about');
    expect(section).toHaveClass('custom-class');
  });
});
