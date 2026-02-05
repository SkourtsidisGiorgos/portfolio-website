import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingFallback, ErrorFallback, ErrorIcons } from '../CanvasFallback';

describe('LoadingFallback', () => {
  it('renders with default message', () => {
    render(<LoadingFallback />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingFallback message="Loading 3D scene..." />);

    expect(screen.getByText('Loading 3D scene...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <LoadingFallback className="custom-loading" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-loading');
  });

  it('uses transparent background by default', () => {
    const { container } = render(<LoadingFallback />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('bg-transparent');
  });

  it('applies primary background when specified', () => {
    const { container } = render(<LoadingFallback background="primary" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('bg-background-primary');
  });

  it('renders spinner with correct size (sm)', () => {
    const { container } = render(<LoadingFallback spinnerSize="sm" />);

    const spinner = container.querySelector('[class*="animate-spin"]');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('renders spinner with correct size (md)', () => {
    const { container } = render(<LoadingFallback spinnerSize="md" />);

    const spinner = container.querySelector('[class*="animate-spin"]');
    expect(spinner).toHaveClass('h-10', 'w-10');
  });

  it('renders spinner with correct size (lg)', () => {
    const { container } = render(<LoadingFallback spinnerSize="lg" />);

    const spinner = container.querySelector('[class*="animate-spin"]');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });

  it('is accessible with role status', () => {
    render(<LoadingFallback message="Loading test..." />);

    const statusElement = screen.getByRole('status');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveAttribute('aria-live', 'polite');
    expect(statusElement).toHaveAttribute('aria-label', 'Loading test...');
  });
});

describe('ErrorFallback', () => {
  it('renders with default message', () => {
    render(<ErrorFallback />);

    expect(
      screen.getByText('3D visualization requires WebGL support.')
    ).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<ErrorFallback message="Custom error message" />);

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders with default hint', () => {
    render(<ErrorFallback />);

    expect(
      screen.getByText('Please use a modern browser with WebGL enabled.')
    ).toBeInTheDocument();
  });

  it('renders with custom hint', () => {
    render(<ErrorFallback hint="View list below instead." />);

    expect(screen.getByText('View list below instead.')).toBeInTheDocument();
  });

  it('does not render hint when set to empty string', () => {
    render(<ErrorFallback hint="" />);

    // Should not find the hint text element
    expect(
      screen.queryByText('Please use a modern browser with WebGL enabled.')
    ).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ErrorFallback className="custom-error" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-error');
  });

  it('uses transparent background by default', () => {
    const { container } = render(<ErrorFallback />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('bg-transparent');
  });

  it('applies primary background when specified', () => {
    const { container } = render(<ErrorFallback background="primary" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('bg-background-primary');
  });

  it('renders default globe icon', () => {
    const { container } = render(<ErrorFallback />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(
      <ErrorFallback icon={<span data-testid="custom-icon">Icon</span>} />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders ErrorIcons.computer (emoji)', () => {
    const { container } = render(<ErrorFallback icon={ErrorIcons.computer} />);

    // The emoji icon is inside an aria-hidden container, so we search by text content
    const emojiElement = container.querySelector('[aria-label="Computer"]');
    expect(emojiElement).toBeInTheDocument();
  });

  it('renders ErrorIcons.database', () => {
    const { container } = render(<ErrorFallback icon={ErrorIcons.database} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders ErrorIcons.briefcase', () => {
    const { container } = render(<ErrorFallback icon={ErrorIcons.briefcase} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('is accessible with role alert', () => {
    render(<ErrorFallback />);

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveAttribute('aria-live', 'polite');
  });
});

describe('ErrorIcons', () => {
  it('exports all icon types', () => {
    expect(ErrorIcons.globe).toBeDefined();
    expect(ErrorIcons.database).toBeDefined();
    expect(ErrorIcons.briefcase).toBeDefined();
    expect(ErrorIcons.computer).toBeDefined();
  });
});
