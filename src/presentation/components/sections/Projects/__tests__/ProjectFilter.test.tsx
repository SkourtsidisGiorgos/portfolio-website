import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProjectFilter, type FilterOption } from '../ProjectFilter';

describe('ProjectFilter', () => {
  const defaultOptions: FilterOption[] = [
    { id: 'all', label: 'All Projects', count: 10 },
    { id: 'oss', label: 'Open Source', count: 4 },
    { id: 'professional', label: 'Professional', count: 4 },
    { id: 'personal', label: 'Personal', count: 2 },
  ];

  it('renders all filter options', () => {
    render(
      <ProjectFilter
        options={defaultOptions}
        selected="all"
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText('All Projects')).toBeInTheDocument();
    expect(screen.getByText('Open Source')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('renders count badges for each option', () => {
    render(
      <ProjectFilter
        options={defaultOptions}
        selected="all"
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText('10')).toBeInTheDocument();
    // There are two options with count 4
    expect(screen.getAllByText('4')).toHaveLength(2);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onSelect when filter button is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <ProjectFilter
        options={defaultOptions}
        selected="all"
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByText('Open Source'));

    expect(handleSelect).toHaveBeenCalledWith('oss');
  });

  it('has correct aria-checked for selected option', () => {
    render(
      <ProjectFilter
        options={defaultOptions}
        selected="oss"
        onSelect={vi.fn()}
      />
    );

    const ossButton = screen.getByText('Open Source').closest('button');
    expect(ossButton).toHaveAttribute('aria-checked', 'true');

    const allButton = screen.getByText('All Projects').closest('button');
    expect(allButton).toHaveAttribute('aria-checked', 'false');
  });

  it('has radiogroup role on container', () => {
    render(
      <ProjectFilter
        options={defaultOptions}
        selected="all"
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('has radio role on each button', () => {
    render(
      <ProjectFilter
        options={defaultOptions}
        selected="all"
        onSelect={vi.fn()}
      />
    );

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(4);
  });

  it('applies custom className', () => {
    const { container } = render(
      <ProjectFilter
        options={defaultOptions}
        selected="all"
        onSelect={vi.fn()}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles empty options array', () => {
    const { container } = render(
      <ProjectFilter options={[]} selected="all" onSelect={vi.fn()} />
    );

    expect(container.querySelector('[role="radiogroup"]')).toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });
});
