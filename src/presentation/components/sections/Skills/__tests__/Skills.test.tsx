import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Skills } from '../Skills';

// Mock useSkillsGlobe hook
vi.mock('@/presentation/hooks/useSkillsGlobe', () => ({
  useSkillsGlobe: () => ({
    skills: [
      {
        id: 'skill-python',
        name: 'Python',
        category: 'languages',
        proficiency: 'expert',
        yearsOfExperience: 5,
        icon: null,
        hasIcon: () => false,
        getProficiencyLevel: () => 4,
        getProficiencyPercentage: () => 100,
        isExpert: () => true,
        isAdvanced: () => true,
        getCategoryLabel: () => 'Languages',
      },
      {
        id: 'skill-spark',
        name: 'Apache Spark',
        category: 'bigdata',
        proficiency: 'expert',
        yearsOfExperience: 4,
        icon: null,
        hasIcon: () => false,
        getProficiencyLevel: () => 4,
        getProficiencyPercentage: () => 100,
        isExpert: () => true,
        isAdvanced: () => true,
        getCategoryLabel: () => 'Big Data',
      },
    ],
    categories: [
      { id: 'languages', label: 'Languages', count: 1 },
      { id: 'bigdata', label: 'Big Data', count: 1 },
    ],
    selectedCategory: null,
    setSelectedCategory: vi.fn(),
    selectedSkill: null,
    setSelectedSkill: vi.fn(),
    hoveredSkill: null,
    setHoveredSkill: vi.fn(),
    filteredSkills: [],
    globeConfig: {
      radius: 3,
      rotationSpeed: 0.1,
      nodeScale: 1,
      showConnections: true,
      enableEffects: true,
    },
    quality: 'high',
    isWebGLSupported: false, // Force list fallback for testing
  }),
}));

describe('Skills', () => {
  it('renders section with correct id', () => {
    const { container } = render(<Skills />);

    const section = container.querySelector('#skills');
    expect(section).toBeInTheDocument();
  });

  it('renders section heading', () => {
    render(<Skills />);

    expect(screen.getByText('Technology Stack')).toBeInTheDocument();
  });

  it('renders caption', () => {
    render(<Skills />);

    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<Skills />);

    expect(
      screen.getByText(/Explore my technical expertise/)
    ).toBeInTheDocument();
  });

  it('renders category filter', () => {
    render(<Skills />);

    expect(screen.getByText('All')).toBeInTheDocument();
    // Use getAllByText since categories appear in filter and list
    expect(screen.getAllByText('Languages').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Big Data').length).toBeGreaterThan(0);
  });

  it('renders skills list (fallback)', () => {
    render(<Skills />);

    // Should show skill names in the list
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Apache Spark')).toBeInTheDocument();
  });

  it('has correct aria-labelledby for accessibility', () => {
    const { container } = render(<Skills />);

    const section = container.querySelector('#skills');
    expect(section).toHaveAttribute('aria-labelledby', 'skills-heading');
  });

  it('accepts custom id', () => {
    const { container } = render(<Skills id="custom-skills" />);

    const section = container.querySelector('#custom-skills');
    expect(section).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Skills className="custom-class" />);

    const section = container.querySelector('#skills');
    expect(section).toHaveClass('custom-class');
  });
});
