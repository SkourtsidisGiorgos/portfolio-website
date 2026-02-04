import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input, Textarea } from '@/presentation/components/ui/Input';

describe('Input', () => {
  describe('rendering', () => {
    it('should render input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter email" />);
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error message', () => {
      render(<Input error="Email is required" />);
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should apply error styles', () => {
      render(<Input error="Invalid email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('should set aria-invalid when error', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should not set aria-invalid when no error', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('hint', () => {
    it('should show hint text', () => {
      render(<Input hint="Enter a valid email" />);
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    });

    it('should hide hint when error is shown', () => {
      render(<Input hint="Hint text" error="Error text" />);
      expect(screen.queryByText('Hint text')).not.toBeInTheDocument();
      expect(screen.getByText('Error text')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('should call onChange handler', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('should update value', () => {
      render(<Input defaultValue="initial" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial');
    });
  });

  describe('accessibility', () => {
    it('should have aria-describedby linking to error', () => {
      render(<Input id="email" error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });

    it('should have aria-describedby linking to hint', () => {
      render(<Input id="email" hint="Hint" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-hint');
    });

    it('should accept custom className', () => {
      render(<Input className="custom-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
    });
  });
});

describe('Textarea', () => {
  describe('rendering', () => {
    it('should render textarea element', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
    });

    it('should render with label', () => {
      render(<Textarea label="Message" />);
      expect(screen.getByLabelText('Message')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Textarea placeholder="Enter message" />);
      expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument();
    });

    it('should render with default rows', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '4');
    });

    it('should render with custom rows', () => {
      render(<Textarea rows={6} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '6');
    });
  });

  describe('error state', () => {
    it('should show error message', () => {
      render(<Textarea error="Message is required" />);
      expect(screen.getByText('Message is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should apply error styles', () => {
      render(<Textarea error="Invalid" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-red-500');
    });
  });

  describe('hint', () => {
    it('should show hint text', () => {
      render(<Textarea hint="Minimum 10 characters" />);
      expect(screen.getByText('Minimum 10 characters')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onChange handler', () => {
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'test message' } });
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should set aria-invalid when error', () => {
      render(<Textarea error="Error" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('should accept custom className', () => {
      render(<Textarea className="custom-textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-textarea');
    });
  });
});
