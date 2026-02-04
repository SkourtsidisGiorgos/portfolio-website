import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Container } from '@/presentation/components/layout/Container';

describe('Container', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      render(<Container>Content</Container>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should apply default xl size', () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-7xl');
    });
  });

  describe('sizes', () => {
    it('should apply sm size', () => {
      render(
        <Container size="sm" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-3xl');
    });

    it('should apply md size', () => {
      render(
        <Container size="md" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-5xl');
    });

    it('should apply lg size', () => {
      render(
        <Container size="lg" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-6xl');
    });

    it('should apply xl size', () => {
      render(
        <Container size="xl" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-7xl');
    });

    it('should apply full size', () => {
      render(
        <Container size="full" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-full');
    });
  });

  describe('styling', () => {
    it('should apply base styles', () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('mx-auto');
      expect(container).toHaveClass('w-full');
      expect(container).toHaveClass('px-4');
    });

    it('should accept custom className', () => {
      render(
        <Container className="custom-class" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('custom-class');
    });
  });
});
