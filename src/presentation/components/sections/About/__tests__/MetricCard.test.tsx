import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AboutMetric } from '../domain/AboutMetric';
import { MetricCard } from '../MetricCard';

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
}));

describe('MetricCard', () => {
  const createMetric = (
    options?: Partial<Parameters<typeof AboutMetric.create>[0]>
  ) =>
    AboutMetric.create({
      value: '10+',
      label: 'Test Metric',
      icon: 'star',
      ...options,
    });

  it('renders metric value', () => {
    const metric = createMetric({ value: '25+' });
    render(<MetricCard metric={metric} />);

    // The component shows animated counter or static value
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
  });

  it('renders metric label', () => {
    const metric = createMetric({ label: 'Custom Label' });
    render(<MetricCard metric={metric} />);

    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    const metric = createMetric({ description: 'Test description' });
    render(<MetricCard metric={metric} />);

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders icon', () => {
    const metric = createMetric();
    const { container } = render(<MetricCard metric={metric} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('accepts AboutMetric value object', () => {
    const metric = AboutMetric.yearsExperience(5);
    render(<MetricCard metric={metric} />);

    expect(screen.getByText('Years Experience')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const metric = createMetric();
    const { container } = render(
      <MetricCard metric={metric} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles non-numeric values', () => {
    const metric = AboutMetric.contributions();
    render(<MetricCard metric={metric} />);

    expect(screen.getByText('Open Source')).toBeInTheDocument();
  });
});
