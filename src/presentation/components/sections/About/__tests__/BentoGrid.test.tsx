import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BentoCell } from '../BentoCell';
import { BentoGrid } from '../BentoGrid';

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
}));

describe('BentoGrid', () => {
  it('renders children in grid', () => {
    render(
      <BentoGrid>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </BentoGrid>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('applies grid class', () => {
    const { container } = render(
      <BentoGrid>
        <div>Child</div>
      </BentoGrid>
    );

    expect(container.firstChild).toHaveClass('grid');
  });

  it('applies custom columns', () => {
    const { container } = render(
      <BentoGrid columns={2}>
        <div>Child</div>
      </BentoGrid>
    );

    expect(container.firstChild).toHaveClass('md:grid-cols-2');
  });

  it('applies custom gap', () => {
    const { container } = render(
      <BentoGrid gap="lg">
        <div>Child</div>
      </BentoGrid>
    );

    expect(container.firstChild).toHaveClass('gap-6');
  });

  it('accepts custom className', () => {
    const { container } = render(
      <BentoGrid className="custom-class">
        <div>Child</div>
      </BentoGrid>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with BentoCell children', () => {
    render(
      <BentoGrid>
        <BentoCell>
          <span data-testid="cell-content">Cell content</span>
        </BentoCell>
      </BentoGrid>
    );

    expect(screen.getByTestId('cell-content')).toBeInTheDocument();
  });
});

describe('BentoCell', () => {
  it('renders children', () => {
    render(
      <BentoCell>
        <span data-testid="content">Content</span>
      </BentoCell>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('applies glassmorphism styles', () => {
    const { container } = render(
      <BentoCell>
        <span>Content</span>
      </BentoCell>
    );

    expect(container.firstChild).toHaveClass('bg-white/5');
    expect(container.firstChild).toHaveClass('backdrop-blur-md');
    expect(container.firstChild).toHaveClass('border');
  });

  it('applies small size', () => {
    const { container } = render(
      <BentoCell size="small">
        <span>Content</span>
      </BentoCell>
    );

    expect(container.firstChild).toHaveClass('col-span-1');
  });

  it('applies large size with span', () => {
    const { container } = render(
      <BentoCell size="large">
        <span>Content</span>
      </BentoCell>
    );

    expect(container.firstChild).toHaveClass('md:col-span-2');
  });

  it('accepts custom className', () => {
    const { container } = render(
      <BentoCell className="custom-cell">
        <span>Content</span>
      </BentoCell>
    );

    expect(container.firstChild).toHaveClass('custom-cell');
  });

  it('renders without hover when disabled', () => {
    const { container } = render(
      <BentoCell hover={false}>
        <span>Content</span>
      </BentoCell>
    );

    // Without hover, it should still render but as a plain div
    expect(container.firstChild).toBeInTheDocument();
  });
});
