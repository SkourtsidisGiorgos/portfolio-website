import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '@/presentation/components/ui/Badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      render(<Badge>TypeScript</Badge>);
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should render with icon', () => {
      render(<Badge icon={<span data-testid="icon">+</span>}>React</Badge>);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should apply default variant styles', () => {
      render(<Badge variant="default">Default</Badge>);
      const badge = screen.getByText('Default');
      expect(badge).toHaveClass('bg-white/10');
      expect(badge).toHaveClass('text-gray-300');
    });

    it('should apply primary variant styles', () => {
      render(<Badge variant="primary">Primary</Badge>);
      const badge = screen.getByText('Primary');
      expect(badge).toHaveClass('bg-primary-500/20');
      expect(badge).toHaveClass('text-primary-300');
    });

    it('should apply secondary variant styles', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      const badge = screen.getByText('Secondary');
      expect(badge).toHaveClass('bg-accent-500/20');
      expect(badge).toHaveClass('text-accent-300');
    });

    it('should apply outline variant styles', () => {
      render(<Badge variant="outline">Outline</Badge>);
      const badge = screen.getByText('Outline');
      expect(badge).toHaveClass('bg-transparent');
      expect(badge).toHaveClass('border-white/20');
    });
  });

  describe('sizes', () => {
    it('should apply small size styles', () => {
      render(<Badge size="sm">Small</Badge>);
      const badge = screen.getByText('Small');
      expect(badge).toHaveClass('px-2');
      expect(badge).toHaveClass('py-0.5');
      expect(badge).toHaveClass('text-xs');
    });

    it('should apply medium size styles', () => {
      render(<Badge size="md">Medium</Badge>);
      const badge = screen.getByText('Medium');
      expect(badge).toHaveClass('px-2.5');
      expect(badge).toHaveClass('py-1');
      expect(badge).toHaveClass('text-sm');
    });

    it('should apply large size styles', () => {
      render(<Badge size="lg">Large</Badge>);
      const badge = screen.getByText('Large');
      expect(badge).toHaveClass('px-3');
      expect(badge).toHaveClass('py-1.5');
      expect(badge).toHaveClass('text-base');
    });
  });

  describe('animation', () => {
    it('should render as span when animated is false', () => {
      render(<Badge animated={false}>Static</Badge>);
      const badge = screen.getByText('Static');
      expect(badge.tagName).toBe('SPAN');
    });

    it('should render as motion.span when animated is true', () => {
      render(<Badge animated>Animated</Badge>);
      const badge = screen.getByText('Animated');
      // motion.span still renders as SPAN
      expect(badge.tagName).toBe('SPAN');
    });
  });

  describe('styling', () => {
    it('should apply rounded-full class', () => {
      render(<Badge>Rounded</Badge>);
      const badge = screen.getByText('Rounded');
      expect(badge).toHaveClass('rounded-full');
    });

    it('should apply font-medium class', () => {
      render(<Badge>Font</Badge>);
      const badge = screen.getByText('Font');
      expect(badge).toHaveClass('font-medium');
    });
  });

  describe('custom props', () => {
    it('should accept custom className', () => {
      render(<Badge className="custom-badge">Custom</Badge>);
      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('custom-badge');
    });

    it('should pass additional HTML attributes', () => {
      render(<Badge data-testid="tech-badge">Python</Badge>);
      expect(screen.getByTestId('tech-badge')).toBeInTheDocument();
    });
  });
});
