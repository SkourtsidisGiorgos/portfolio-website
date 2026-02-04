import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import { TimelineNav } from '../TimelineNav';

const mockExperiences: ExperienceDTO[] = [
  {
    id: 'exp-1',
    company: 'Company A',
    role: 'Engineer',
    description: [],
    technologies: [],
    startDate: '2023-01-01',
    endDate: null,
    formattedDateRange: 'Jan 2023 - Present',
    duration: '1 year',
    location: 'City',
    locationDisplay: 'City',
    remote: false,
    isCurrent: true,
  },
  {
    id: 'exp-2',
    company: 'Company B',
    role: 'Developer',
    description: [],
    technologies: [],
    startDate: '2022-01-01',
    endDate: '2022-12-31',
    formattedDateRange: 'Jan 2022 - Dec 2022',
    duration: '1 year',
    location: 'City',
    locationDisplay: 'City',
    remote: false,
    isCurrent: false,
  },
  {
    id: 'exp-3',
    company: 'Company C',
    role: 'Intern',
    description: [],
    technologies: [],
    startDate: '2021-01-01',
    endDate: '2021-12-31',
    formattedDateRange: 'Jan 2021 - Dec 2021',
    duration: '1 year',
    location: 'City',
    locationDisplay: 'City',
    remote: false,
    isCurrent: false,
  },
];

describe('TimelineNav', () => {
  describe('rendering', () => {
    it('should render navigation dots for each experience', () => {
      render(
        <TimelineNav
          experiences={mockExperiences}
          activeIndex={0}
          onSelect={() => {}}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('should apply active state to the correct dot', () => {
      render(
        <TimelineNav
          experiences={mockExperiences}
          activeIndex={1}
          onSelect={() => {}}
        />
      );

      const buttons = screen.getAllByRole('button');
      // Second button should have aria-current
      expect(buttons[1]).toHaveAttribute('aria-current', 'true');
    });

    it('should show company names as accessible labels', () => {
      render(
        <TimelineNav
          experiences={mockExperiences}
          activeIndex={0}
          onSelect={() => {}}
        />
      );

      expect(
        screen.getByRole('button', { name: /Company A/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Company B/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Company C/i })
      ).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('should call onSelect when a dot is clicked', () => {
      const onSelect = vi.fn();
      render(
        <TimelineNav
          experiences={mockExperiences}
          activeIndex={0}
          onSelect={onSelect}
        />
      );

      fireEvent.click(screen.getAllByRole('button')[2]);

      expect(onSelect).toHaveBeenCalledWith(2);
    });

    it('should call onSelect with correct index for each button', () => {
      const onSelect = vi.fn();
      render(
        <TimelineNav
          experiences={mockExperiences}
          activeIndex={0}
          onSelect={onSelect}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button, index) => {
        fireEvent.click(button);
        expect(onSelect).toHaveBeenLastCalledWith(index);
      });
    });
  });

  describe('keyboard navigation', () => {
    it('should navigate right with ArrowRight key', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <TimelineNav
          experiences={mockExperiences}
          activeIndex={0}
          onSelect={onSelect}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons[0].focus();
      await user.keyboard('{ArrowRight}');

      expect(onSelect).toHaveBeenCalledWith(1);
    });

    it('should navigate left with ArrowLeft key', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <TimelineNav
          experiences={mockExperiences}
          activeIndex={1}
          onSelect={onSelect}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons[1].focus();
      await user.keyboard('{ArrowLeft}');

      expect(onSelect).toHaveBeenCalledWith(0);
    });

    it('should not go below 0 with ArrowLeft', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <TimelineNav
          experiences={mockExperiences}
          activeIndex={0}
          onSelect={onSelect}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons[0].focus();
      await user.keyboard('{ArrowLeft}');

      // Should not call onSelect when at boundary
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should not exceed max index with ArrowRight', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <TimelineNav
          experiences={mockExperiences}
          activeIndex={2}
          onSelect={onSelect}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons[2].focus();
      await user.keyboard('{ArrowRight}');

      // Should not call onSelect when at boundary
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper role navigation', () => {
      render(
        <TimelineNav
          experiences={mockExperiences}
          activeIndex={0}
          onSelect={() => {}}
        />
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have aria-label on the nav element', () => {
      render(
        <TimelineNav
          experiences={mockExperiences}
          activeIndex={0}
          onSelect={() => {}}
        />
      );

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Timeline navigation'
      );
    });
  });

  describe('styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <TimelineNav
          experiences={mockExperiences}
          activeIndex={0}
          onSelect={() => {}}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
