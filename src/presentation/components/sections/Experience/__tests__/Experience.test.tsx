import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Experience } from '../Experience';

// Mock useExperienceTimeline hook
vi.mock('@/presentation/hooks/useExperienceTimeline', () => ({
  useExperienceTimeline: () => ({
    experiences: [
      {
        id: 'exp-1',
        company: 'SWIFT',
        role: 'Big Data Engineer',
        description: ['ETL pipelines'],
        technologies: ['Python', 'Spark'],
        startDate: '2023-11-01',
        endDate: null,
        formattedDateRange: 'Nov 2023 - Present',
        duration: '1 year',
        location: 'Belgium',
        locationDisplay: 'Belgium (Remote)',
        remote: true,
        isCurrent: true,
      },
      {
        id: 'exp-2',
        company: 'Intracom',
        role: 'Software Engineer',
        description: ['Smart City'],
        technologies: ['Java'],
        startDate: '2021-05-01',
        endDate: '2023-10-31',
        formattedDateRange: 'May 2021 - Oct 2023',
        duration: '2 years',
        location: 'Athens',
        locationDisplay: 'Athens',
        remote: false,
        isCurrent: false,
      },
    ],
    totalYears: 4,
    technologies: ['Python', 'Spark', 'Java'],
    selectedExperience: null,
    setSelectedExperience: vi.fn(),
    hoveredExperience: null,
    setHoveredExperience: vi.fn(),
    timelineConfig: {
      nodeScale: 1,
      connectionOpacity: 0.8,
      spacing: 3,
      enableEffects: true,
      enableParticles: true,
      autoRotate: false,
    },
    quality: 'high',
    isWebGLSupported: false, // Force list view for testing
  }),
}));

describe('Experience', () => {
  describe('rendering', () => {
    it('should render section with correct id', () => {
      render(<Experience />);

      const section = document.getElementById('experience');
      expect(section).toBeInTheDocument();
    });

    it('should render section with custom id', () => {
      render(<Experience id="work-experience" />);

      const section = document.getElementById('work-experience');
      expect(section).toBeInTheDocument();
    });

    it('should render section heading', () => {
      render(<Experience />);

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should have aria-labelledby referencing heading', () => {
      render(<Experience />);

      const section = document.getElementById('experience');
      expect(section).toHaveAttribute('aria-labelledby', 'experience-heading');
    });
  });

  describe('content', () => {
    it('should render caption text', () => {
      render(<Experience />);

      expect(screen.getByText(/Professional Journey/i)).toBeInTheDocument();
    });

    it('should render experience list (mobile fallback)', () => {
      render(<Experience />);

      // Since WebGL is mocked as not supported, should show list
      expect(screen.getByText('SWIFT')).toBeInTheDocument();
      expect(screen.getByText('Intracom')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Experience />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Experience className="custom-class" />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-class');
    });
  });
});
