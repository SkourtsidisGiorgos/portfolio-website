import React, { forwardRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactForm } from '../ContactForm';

// Mock framer-motion with proper element support
vi.mock('framer-motion', () => {
  // Create a handler for motion elements
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
    AnimatePresence: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ContactForm', () => {
  const user = userEvent.setup();

  const fillForm = async () => {
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(
      screen.getByLabelText(/message/i),
      'This is a test message with enough characters to pass validation.'
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, messageId: 'test-id' }),
    });
  });

  it('renders all form fields', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<ContactForm />);

    expect(
      screen.getByRole('button', { name: /send message/i })
    ).toBeInTheDocument();
  });

  it('shows validation errors for empty fields on blur', async () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });
  });

  it('shows validation error for short message', async () => {
    render(<ContactForm />);

    const messageInput = screen.getByLabelText(/message/i);
    await user.type(messageInput, 'Short');
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/message must be at least 20 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<ContactForm />);

    await fillForm();

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('John Doe'),
      });
    });
  });

  it('shows success message after successful submission', async () => {
    render(<ContactForm />);

    await fillForm();
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();
    });
  });

  it('shows error message when submission fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ success: false, error: 'Server error' }),
    });

    render(<ContactForm />);

    await fillForm();
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(
            () => resolve({ ok: true, json: () => ({ success: true }) }),
            1000
          )
        )
    );

    render(<ContactForm />);

    await fillForm();
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(
      screen.getByRole('button', { name: /sending/i })
    ).toBeInTheDocument();
  });

  it('allows sending another message after success', async () => {
    render(<ContactForm />);

    await fillForm();
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', { name: /send another message/i })
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('calls onSubmitSuccess callback after successful submission', async () => {
    const onSubmitSuccess = vi.fn();
    render(<ContactForm onSubmitSuccess={onSubmitSuccess} />);

    await fillForm();
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(onSubmitSuccess).toHaveBeenCalled();
    });
  });

  it('has accessible form with aria-label', () => {
    render(<ContactForm />);

    expect(
      screen.getByRole('form', { name: /contact form/i })
    ).toBeInTheDocument();
  });

  it('marks required fields with aria-required', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/name/i)).toHaveAttribute(
      'aria-required',
      'true'
    );
    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      'aria-required',
      'true'
    );
    expect(screen.getByLabelText(/subject/i)).toHaveAttribute(
      'aria-required',
      'true'
    );
    expect(screen.getByLabelText(/message/i)).toHaveAttribute(
      'aria-required',
      'true'
    );
  });
});
