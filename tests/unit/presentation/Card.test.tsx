import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/presentation/components/ui/Card';

describe('Card', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render with glass variant by default', () => {
      render(<Card data-testid="default-card">Card content</Card>);
      const card = screen.getByTestId('default-card');
      expect(card).toHaveClass('bg-white/5');
      expect(card).toHaveClass('backdrop-blur-md');
    });
  });

  describe('variants', () => {
    it('should apply glass variant styles', () => {
      render(<Card variant="glass">Glass card</Card>);
      const card = screen.getByText('Glass card');
      expect(card).toHaveClass('bg-white/5');
      expect(card).toHaveClass('backdrop-blur-md');
    });

    it('should apply solid variant styles', () => {
      render(<Card variant="solid">Solid card</Card>);
      const card = screen.getByText('Solid card');
      expect(card).toHaveClass('bg-gray-800/80');
    });

    it('should apply outline variant styles', () => {
      render(<Card variant="outline">Outline card</Card>);
      const card = screen.getByText('Outline card');
      expect(card).toHaveClass('bg-transparent');
      expect(card).toHaveClass('border-gray-700');
    });
  });

  describe('hover', () => {
    it('should render as motion.div when hover is true', () => {
      render(<Card hover>Hover card</Card>);
      const card = screen.getByText('Hover card');
      // motion.div still renders as a div
      expect(card.tagName).toBe('DIV');
    });

    it('should apply transition styles when hover is enabled', () => {
      render(<Card hover>Hover card</Card>);
      const card = screen.getByText('Hover card');
      expect(card).toHaveClass('transition-shadow');
    });
  });

  describe('custom props', () => {
    it('should accept custom className', () => {
      render(<Card className="custom-class">Custom card</Card>);
      const card = screen.getByText('Custom card');
      expect(card).toHaveClass('custom-class');
    });

    it('should pass additional HTML attributes', () => {
      render(<Card data-testid="custom-card">Test card</Card>);
      expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    });
  });
});

describe('CardHeader', () => {
  it('should render with children', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('should apply default styles', () => {
    render(<CardHeader>Header content</CardHeader>);
    const header = screen.getByText('Header content');
    expect(header).toHaveClass('px-6');
    expect(header).toHaveClass('py-4');
    expect(header).toHaveClass('border-b');
  });

  it('should accept custom className', () => {
    render(<CardHeader className="custom-header">Header</CardHeader>);
    const header = screen.getByText('Header');
    expect(header).toHaveClass('custom-header');
  });
});

describe('CardContent', () => {
  it('should render with children', () => {
    render(<CardContent>Content text</CardContent>);
    expect(screen.getByText('Content text')).toBeInTheDocument();
  });

  it('should apply default styles', () => {
    render(<CardContent>Content text</CardContent>);
    const content = screen.getByText('Content text');
    expect(content).toHaveClass('px-6');
    expect(content).toHaveClass('py-4');
  });

  it('should accept custom className', () => {
    render(<CardContent className="custom-content">Content</CardContent>);
    const content = screen.getByText('Content');
    expect(content).toHaveClass('custom-content');
  });
});

describe('CardFooter', () => {
  it('should render with children', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('should apply default styles', () => {
    render(<CardFooter>Footer content</CardFooter>);
    const footer = screen.getByText('Footer content');
    expect(footer).toHaveClass('px-6');
    expect(footer).toHaveClass('py-4');
    expect(footer).toHaveClass('border-t');
  });

  it('should accept custom className', () => {
    render(<CardFooter className="custom-footer">Footer</CardFooter>);
    const footer = screen.getByText('Footer');
    expect(footer).toHaveClass('custom-footer');
  });
});

describe('Card composition', () => {
  it('should compose Card with Header, Content, and Footer', () => {
    render(
      <Card>
        <CardHeader>Title</CardHeader>
        <CardContent>Body text</CardContent>
        <CardFooter>Actions</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
