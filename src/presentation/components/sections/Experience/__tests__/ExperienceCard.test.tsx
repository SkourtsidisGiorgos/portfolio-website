import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import { ExperienceCard } from '../ExperienceCard';

const mockExperience: ExperienceDTO = {
  id: 'exp-swift',
  company: 'SWIFT',
  role: 'Big Data Engineer',
  description: [
    'Designing and implementing ETL pipelines',
    'Working with Apache NiFi',
    'Deploying on Kubernetes',
  ],
  technologies: ['Python', 'Spark', 'Kubernetes', 'Docker'],
  startDate: '2023-11-01',
  endDate: null,
  formattedDateRange: 'Nov 2023 - Present',
  duration: '1 year',
  location: 'Belgium',
  locationDisplay: 'Belgium (Remote)',
  remote: true,
  isCurrent: true,
};

describe('ExperienceCard', () => {
  describe('rendering', () => {
    it('should render empty state when experience is null', () => {
      render(<ExperienceCard experience={null} />);

      expect(screen.getByText(/select an experience/i)).toBeInTheDocument();
    });

    it('should render company name when experience is provided', () => {
      render(<ExperienceCard experience={mockExperience} />);

      expect(screen.getByText('SWIFT')).toBeInTheDocument();
    });

    it('should render role', () => {
      render(<ExperienceCard experience={mockExperience} />);

      expect(screen.getByText('Big Data Engineer')).toBeInTheDocument();
    });

    it('should render formatted date range', () => {
      render(<ExperienceCard experience={mockExperience} />);

      expect(screen.getByText('Nov 2023 - Present')).toBeInTheDocument();
    });

    it('should render duration', () => {
      render(<ExperienceCard experience={mockExperience} />);

      expect(screen.getByText(/1 year/i)).toBeInTheDocument();
    });

    it('should render location with remote indicator', () => {
      render(<ExperienceCard experience={mockExperience} />);

      expect(screen.getByText('Belgium (Remote)')).toBeInTheDocument();
    });

    it('should render all description items', () => {
      render(<ExperienceCard experience={mockExperience} />);

      expect(
        screen.getByText(/Designing and implementing ETL pipelines/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Working with Apache NiFi/i)).toBeInTheDocument();
      expect(screen.getByText(/Deploying on Kubernetes/i)).toBeInTheDocument();
    });

    it('should render technology badges', () => {
      render(<ExperienceCard experience={mockExperience} />);

      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('Spark')).toBeInTheDocument();
      expect(screen.getByText('Kubernetes')).toBeInTheDocument();
      expect(screen.getByText('Docker')).toBeInTheDocument();
    });

    it('should show current position indicator for current experience', () => {
      render(<ExperienceCard experience={mockExperience} />);

      expect(screen.getByText('Current')).toBeInTheDocument();
    });
  });

  describe('close button', () => {
    it('should render close button when onClose is provided', () => {
      const onClose = vi.fn();
      render(<ExperienceCard experience={mockExperience} onClose={onClose} />);

      expect(
        screen.getByRole('button', { name: /close/i })
      ).toBeInTheDocument();
    });

    it('should not render close button when onClose is not provided', () => {
      render(<ExperienceCard experience={mockExperience} />);

      expect(
        screen.queryByRole('button', { name: /close/i })
      ).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<ExperienceCard experience={mockExperience} onClose={onClose} />);

      fireEvent.click(screen.getByRole('button', { name: /close/i }));

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('animation', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ExperienceCard experience={mockExperience} className="custom-class" />
      );

      // Check that motion.div receives the className
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
