import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Typography } from '@/presentation/components/ui/Typography';

describe('Typography', () => {
  describe('rendering', () => {
    it('should render with default variant', () => {
      render(<Typography>Default text</Typography>);
      const element = screen.getByText('Default text');
      expect(element.tagName).toBe('P');
    });

    it('should render with children', () => {
      render(<Typography>Hello World</Typography>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should render h1 variant', () => {
      render(<Typography variant="h1">Heading 1</Typography>);
      const element = screen.getByText('Heading 1');
      expect(element.tagName).toBe('H1');
      expect(element).toHaveClass('text-4xl');
    });

    it('should render h2 variant', () => {
      render(<Typography variant="h2">Heading 2</Typography>);
      const element = screen.getByText('Heading 2');
      expect(element.tagName).toBe('H2');
      expect(element).toHaveClass('text-3xl');
    });

    it('should render h3 variant', () => {
      render(<Typography variant="h3">Heading 3</Typography>);
      const element = screen.getByText('Heading 3');
      expect(element.tagName).toBe('H3');
      expect(element).toHaveClass('text-2xl');
    });

    it('should render h4 variant', () => {
      render(<Typography variant="h4">Heading 4</Typography>);
      const element = screen.getByText('Heading 4');
      expect(element.tagName).toBe('H4');
    });

    it('should render h5 variant', () => {
      render(<Typography variant="h5">Heading 5</Typography>);
      const element = screen.getByText('Heading 5');
      expect(element.tagName).toBe('H5');
    });

    it('should render h6 variant', () => {
      render(<Typography variant="h6">Heading 6</Typography>);
      const element = screen.getByText('Heading 6');
      expect(element.tagName).toBe('H6');
    });

    it('should render body-lg variant', () => {
      render(<Typography variant="body-lg">Large body text</Typography>);
      const element = screen.getByText('Large body text');
      expect(element).toHaveClass('text-lg');
    });

    it('should render body-sm variant', () => {
      render(<Typography variant="body-sm">Small body text</Typography>);
      const element = screen.getByText('Small body text');
      expect(element).toHaveClass('text-sm');
    });

    it('should render caption variant', () => {
      render(<Typography variant="caption">Caption text</Typography>);
      const element = screen.getByText('Caption text');
      expect(element.tagName).toBe('SPAN');
      expect(element).toHaveClass('text-xs');
    });
  });

  describe('custom element', () => {
    it('should render with custom element via as prop', () => {
      render(<Typography as="div">Custom element</Typography>);
      const element = screen.getByText('Custom element');
      expect(element.tagName).toBe('DIV');
    });

    it('should render as span', () => {
      render(<Typography as="span">Span element</Typography>);
      const element = screen.getByText('Span element');
      expect(element.tagName).toBe('SPAN');
    });
  });

  describe('styles', () => {
    it('should apply gradient style', () => {
      render(<Typography gradient>Gradient text</Typography>);
      const element = screen.getByText('Gradient text');
      expect(element).toHaveClass('bg-gradient-to-r');
      expect(element).toHaveClass('bg-clip-text');
      expect(element).toHaveClass('text-transparent');
    });

    it('should apply muted style', () => {
      render(<Typography muted>Muted text</Typography>);
      const element = screen.getByText('Muted text');
      expect(element).toHaveClass('text-gray-400');
    });

    it('should apply default white text color', () => {
      render(<Typography>White text</Typography>);
      const element = screen.getByText('White text');
      expect(element).toHaveClass('text-white');
    });

    it('should not apply default color when gradient', () => {
      render(<Typography gradient>Gradient text</Typography>);
      const element = screen.getByText('Gradient text');
      expect(element).not.toHaveClass('text-white');
    });

    it('should not apply default color when muted', () => {
      render(<Typography muted>Muted text</Typography>);
      const element = screen.getByText('Muted text');
      expect(element).not.toHaveClass('text-white');
    });
  });

  describe('custom props', () => {
    it('should accept custom className', () => {
      render(<Typography className="custom-class">Custom</Typography>);
      const element = screen.getByText('Custom');
      expect(element).toHaveClass('custom-class');
    });

    it('should pass additional HTML attributes', () => {
      render(<Typography data-testid="custom-typography">Test</Typography>);
      expect(screen.getByTestId('custom-typography')).toBeInTheDocument();
    });

    it('should pass id attribute', () => {
      render(<Typography id="my-text">Test</Typography>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('id', 'my-text');
    });
  });
});
