import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { CategoryInfo } from '@/presentation/hooks/useSkillsGlobe';
import { SkillCategoryFilter } from '../SkillCategoryFilter';

const mockCategories: CategoryInfo[] = [
  { id: 'languages', label: 'Languages', count: 4 },
  { id: 'bigdata', label: 'Big Data', count: 4 },
  { id: 'devops', label: 'DevOps', count: 3 },
];

describe('SkillCategoryFilter', () => {
  it('renders all category buttons', () => {
    render(
      <SkillCategoryFilter
        categories={mockCategories}
        selected={null}
        onSelect={() => {}}
      />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Big Data')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
  });

  it('shows total count on All button', () => {
    render(
      <SkillCategoryFilter
        categories={mockCategories}
        selected={null}
        onSelect={() => {}}
      />
    );

    // Total count is 4 + 4 + 3 = 11
    expect(screen.getByText('11')).toBeInTheDocument();
  });

  it('shows count for each category', () => {
    render(
      <SkillCategoryFilter
        categories={mockCategories}
        selected={null}
        onSelect={() => {}}
      />
    );

    // DevOps has count 3
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onSelect when category is clicked', () => {
    const onSelect = vi.fn();
    render(
      <SkillCategoryFilter
        categories={mockCategories}
        selected={null}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText('Languages'));
    expect(onSelect).toHaveBeenCalledWith('languages');
  });

  it('calls onSelect with null when All is clicked', () => {
    const onSelect = vi.fn();
    render(
      <SkillCategoryFilter
        categories={mockCategories}
        selected="languages"
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText('All'));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('has radiogroup role for accessibility', () => {
    render(
      <SkillCategoryFilter
        categories={mockCategories}
        selected={null}
        onSelect={() => {}}
      />
    );

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('marks selected button with aria-checked', () => {
    render(
      <SkillCategoryFilter
        categories={mockCategories}
        selected="bigdata"
        onSelect={() => {}}
      />
    );

    const allButton = screen.getByRole('radio', { name: /All/i });
    const bigDataButton = screen.getByRole('radio', { name: /Big Data/i });

    expect(allButton).toHaveAttribute('aria-checked', 'false');
    expect(bigDataButton).toHaveAttribute('aria-checked', 'true');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SkillCategoryFilter
        categories={mockCategories}
        selected={null}
        onSelect={() => {}}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
