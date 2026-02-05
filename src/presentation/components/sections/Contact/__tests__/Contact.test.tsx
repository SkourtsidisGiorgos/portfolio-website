import React, { forwardRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Contact } from '../Contact';

// Mock framer-motion with proper element support
vi.mock('framer-motion', () => {
  const createMotionComponent = (Element: string) => {
    return forwardRef(function MotionComponent(
      props: Record<string, unknown>,
      ref: React.Ref<HTMLElement>
    ) {
      const {
        children,
        className,
        animate: _animate,
        initial: _initial,
        exit: _exit,
        transition: _transition,
        whileHover: _whileHover,
        whileTap: _whileTap,
        variants: _variants,
        ...rest
      } = props;
      return React.createElement(
        Element,
        { className, ref, ...rest },
        children as React.ReactNode
      );
    });
  };

  return {
    motion: {
      div: createMotionComponent('div'),
      button: createMotionComponent('button'),
      span: createMotionComponent('span'),
      a: createMotionComponent('a'),
      p: createMotionComponent('p'),
      h1: createMotionComponent('h1'),
      h2: createMotionComponent('h2'),
      h3: createMotionComponent('h3'),
      section: createMotionComponent('section'),
    },
    useInView: vi.fn(() => true),
    useReducedMotion: vi.fn(() => false),
    AnimatePresence: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

// Mock site config
vi.mock('@/shared/config/site.config', () => ({
  siteConfig: {
    author: {
      email: 'test@example.com',
      location: 'Test City',
    },
    social: {
      github: 'https://github.com/testuser',
      linkedin: 'https://linkedin.com/in/testuser',
      email: 'mailto:test@example.com',
    },
  },
}));

describe('Contact', () => {
  it('renders section with correct id', () => {
    const { container } = render(<Contact />);

    const section = container.querySelector('#contact');
    expect(section).toBeInTheDocument();
  });

  it('renders section heading', () => {
    render(<Contact />);

    expect(screen.getByText("Let's Work Together")).toBeInTheDocument();
  });

  it('renders contact form section', () => {
    render(<Contact />);

    expect(screen.getByText('Send a Message')).toBeInTheDocument();
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    // Use getByRole for form input to distinguish from email social link
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
  });

  it('renders contact info', () => {
    render(<Contact />);

    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test City')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<Contact />);

    expect(screen.getByText('Follow Me')).toBeInTheDocument();
    expect(screen.getByLabelText('View my GitHub profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Connect on LinkedIn')).toBeInTheDocument();
  });

  it('has correct aria-labelledby for accessibility', () => {
    const { container } = render(<Contact />);

    const section = container.querySelector('#contact');
    expect(section).toHaveAttribute('aria-labelledby', 'contact-heading');
  });

  it('accepts custom id', () => {
    const { container } = render(<Contact id="custom-contact" />);

    const section = container.querySelector('#custom-contact');
    expect(section).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Contact className="custom-class" />);

    const section = container.querySelector('#contact');
    expect(section).toHaveClass('custom-class');
  });
});
