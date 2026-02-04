import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loader } from '@/presentation/components/ui/Loader';

describe('Loader', () => {
  describe('rendering', () => {
    it('should render with status role', () => {
      render(<Loader />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have default aria-label', () => {
      render(<Loader />);
      const loader = screen.getByRole('status');
      expect(loader).toHaveAttribute('aria-label', 'Loading...');
    });

    it('should have custom aria-label', () => {
      render(<Loader label="Processing..." />);
      const loader = screen.getByRole('status');
      expect(loader).toHaveAttribute('aria-label', 'Processing...');
    });

    it('should render screen reader text', () => {
      render(<Loader />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      const srText = screen.getByText('Loading...');
      expect(srText).toHaveClass('sr-only');
    });

    it('should render custom screen reader text', () => {
      render(<Loader label="Submitting form..." />);
      expect(screen.getByText('Submitting form...')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should apply small size styles', () => {
      render(<Loader size="sm" />);
      const loader = screen.getByRole('status');
      const spinner = loader.firstElementChild;
      expect(spinner).toHaveClass('w-4');
      expect(spinner).toHaveClass('h-4');
    });

    it('should apply medium size styles', () => {
      render(<Loader size="md" />);
      const loader = screen.getByRole('status');
      const spinner = loader.firstElementChild;
      expect(spinner).toHaveClass('w-6');
      expect(spinner).toHaveClass('h-6');
    });

    it('should apply large size styles', () => {
      render(<Loader size="lg" />);
      const loader = screen.getByRole('status');
      const spinner = loader.firstElementChild;
      expect(spinner).toHaveClass('w-8');
      expect(spinner).toHaveClass('h-8');
    });
  });

  describe('styling', () => {
    it('should have rounded-full class on spinner', () => {
      render(<Loader />);
      const loader = screen.getByRole('status');
      const spinner = loader.firstElementChild;
      expect(spinner).toHaveClass('rounded-full');
    });

    it('should have border styles', () => {
      render(<Loader />);
      const loader = screen.getByRole('status');
      const spinner = loader.firstElementChild;
      expect(spinner).toHaveClass('border-2');
      expect(spinner).toHaveClass('border-current');
      expect(spinner).toHaveClass('border-t-transparent');
    });
  });

  describe('custom props', () => {
    it('should accept custom className', () => {
      render(<Loader className="custom-loader" />);
      const loader = screen.getByRole('status');
      expect(loader).toHaveClass('custom-loader');
    });
  });
});
