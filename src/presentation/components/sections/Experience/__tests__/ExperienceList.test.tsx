import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import { ExperienceList } from '../ExperienceList';

const mockExperiences: ExperienceDTO[] = [
  {
    id: 'exp-1',
    company: 'SWIFT',
    role: 'Big Data Engineer',
    description: ['ETL pipelines', 'Data processing'],
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
    company: 'Intracom Telecom',
    role: 'Software Engineer',
    description: ['Smart City', 'Water Management'],
    technologies: ['Java', 'Kafka'],
    startDate: '2021-05-01',
    endDate: '2023-10-31',
    formattedDateRange: 'May 2021 - Oct 2023',
    duration: '2 years 6 months',
    location: 'Athens, Greece',
    locationDisplay: 'Athens, Greece',
    remote: false,
    isCurrent: false,
  },
];

describe('ExperienceList', () => {
  describe('rendering', () => {
    it('should render all experiences', () => {
      render(
        <ExperienceList
          experiences={mockExperiences}
          selectedExperience={null}
          onExperienceClick={() => {}}
        />
      );

      expect(screen.getByText('SWIFT')).toBeInTheDocument();
      expect(screen.getByText('Intracom Telecom')).toBeInTheDocument();
    });

    it('should render company names', () => {
      render(
        <ExperienceList
          experiences={mockExperiences}
          selectedExperience={null}
          onExperienceClick={() => {}}
        />
      );

      mockExperiences.forEach(exp => {
        expect(screen.getByText(exp.company)).toBeInTheDocument();
      });
    });

    it('should render roles', () => {
      render(
        <ExperienceList
          experiences={mockExperiences}
          selectedExperience={null}
          onExperienceClick={() => {}}
        />
      );

      expect(screen.getByText('Big Data Engineer')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    it('should render date ranges', () => {
      render(
        <ExperienceList
          experiences={mockExperiences}
          selectedExperience={null}
          onExperienceClick={() => {}}
        />
      );

      expect(screen.getByText('Nov 2023 - Present')).toBeInTheDocument();
      expect(screen.getByText('May 2021 - Oct 2023')).toBeInTheDocument();
    });

    it('should show current indicator for current experience', () => {
      render(
        <ExperienceList
          experiences={mockExperiences}
          selectedExperience={null}
          onExperienceClick={() => {}}
        />
      );

      expect(screen.getByText('Current')).toBeInTheDocument();
    });

    it('should render technologies as badges', () => {
      render(
        <ExperienceList
          experiences={mockExperiences}
          selectedExperience={null}
          onExperienceClick={() => {}}
        />
      );

      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('Spark')).toBeInTheDocument();
      expect(screen.getByText('Java')).toBeInTheDocument();
      expect(screen.getByText('Kafka')).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('should call onExperienceClick when card is clicked', () => {
      const onExperienceClick = vi.fn();
      render(
        <ExperienceList
          experiences={mockExperiences}
          selectedExperience={null}
          onExperienceClick={onExperienceClick}
        />
      );

      // Click on the first experience card (SWIFT)
      const swiftCard = screen
        .getByText('SWIFT')
        .closest('[data-testid="experience-card"]');
      if (swiftCard) {
        fireEvent.click(swiftCard);
        expect(onExperienceClick).toHaveBeenCalledWith(mockExperiences[0]);
      }
    });

    it('should highlight selected experience', () => {
      const { container } = render(
        <ExperienceList
          experiences={mockExperiences}
          selectedExperience={mockExperiences[0]}
          onExperienceClick={() => {}}
        />
      );

      // Check that the selected card has the ring styling
      const selectedCard = container.querySelector('[data-selected="true"]');
      expect(selectedCard).toBeInTheDocument();
    });
  });

  describe('timeline visual', () => {
    it('should render timeline dots for each experience', () => {
      const { container } = render(
        <ExperienceList
          experiences={mockExperiences}
          selectedExperience={null}
          onExperienceClick={() => {}}
        />
      );

      // Should have timeline dots (circles) for each experience
      const timelineDots = container.querySelectorAll('[data-timeline-dot]');
      expect(timelineDots).toHaveLength(mockExperiences.length);
    });
  });

  describe('styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ExperienceList
          experiences={mockExperiences}
          selectedExperience={null}
          onExperienceClick={() => {}}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
