import { describe, it, expect } from 'vitest';
import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import { TimelineNode, COMPANY_COLORS } from '../domain/TimelineNode';

const mockCurrentExperience: ExperienceDTO = {
  id: 'exp-swift',
  company: 'SWIFT',
  role: 'Big Data Engineer',
  description: ['ETL pipelines', 'Apache NiFi'],
  technologies: ['Python', 'Spark', 'Kubernetes'],
  startDate: '2023-11-01',
  endDate: null,
  formattedDateRange: 'Nov 2023 - Present',
  duration: '1 year',
  location: 'Belgium',
  locationDisplay: 'Belgium (Remote)',
  remote: true,
  isCurrent: true,
};

const mockPastExperience: ExperienceDTO = {
  id: 'exp-intracom',
  company: 'Intracom Telecom',
  role: 'Software Engineer',
  description: ['Smart City', 'Water Management'],
  technologies: ['Python', 'Java', 'Kafka'],
  startDate: '2021-05-01',
  endDate: '2023-10-31',
  formattedDateRange: 'May 2021 - Oct 2023',
  duration: '2 years 6 months',
  location: 'Athens, Greece',
  locationDisplay: 'Athens, Greece',
  remote: false,
  isCurrent: false,
};

describe('TimelineNode', () => {
  describe('factory method fromExperience', () => {
    it('should create a TimelineNode from experience at first position', () => {
      const node = TimelineNode.fromExperience(mockCurrentExperience, 0, 3, 3);

      expect(node.experience).toBe(mockCurrentExperience);
      expect(node.index).toBe(0);
      expect(node.isCurrent).toBe(true);
      // First node should be on the left side of the timeline
      expect(node.position.x).toBeLessThan(0);
    });

    it('should create a TimelineNode at middle position', () => {
      const node = TimelineNode.fromExperience(mockPastExperience, 1, 3, 3);

      expect(node.index).toBe(1);
      // Middle node should be near center
      expect(Math.abs(node.position.x)).toBeLessThan(1);
    });

    it('should create a TimelineNode at last position', () => {
      const node = TimelineNode.fromExperience(mockPastExperience, 2, 3, 3);

      expect(node.index).toBe(2);
      // Last node should be on the right side
      expect(node.position.x).toBeGreaterThan(0);
    });

    it('should position nodes with correct spacing', () => {
      const spacing = 4;
      const node1 = TimelineNode.fromExperience(
        mockCurrentExperience,
        0,
        3,
        spacing
      );
      const node2 = TimelineNode.fromExperience(
        mockPastExperience,
        1,
        3,
        spacing
      );

      const distance = Math.abs(node2.position.x - node1.position.x);
      expect(distance).toBeCloseTo(spacing, 1);
    });
  });

  describe('color', () => {
    it('should assign primary color to current position', () => {
      const node = TimelineNode.fromExperience(mockCurrentExperience, 0, 1, 3);

      // Current position should have primary color (cyan)
      expect(node.color.toHex()).toBe(COMPANY_COLORS.current);
    });

    it('should assign faded color to past positions', () => {
      const node = TimelineNode.fromExperience(mockPastExperience, 0, 1, 3);

      // Past position should have past color
      expect(node.color.toHex()).toBe(COMPANY_COLORS.past);
    });
  });

  describe('size calculation', () => {
    it('should calculate larger size for longer duration', () => {
      // 2 years 6 months
      const longNode = TimelineNode.fromExperience(mockPastExperience, 0, 1, 3);

      // Current (1 year)
      const shortNode = TimelineNode.fromExperience(
        mockCurrentExperience,
        0,
        1,
        3
      );

      expect(longNode.size).toBeGreaterThan(shortNode.size);
    });

    it('should have size within expected range (0.4-0.6)', () => {
      const node = TimelineNode.fromExperience(mockCurrentExperience, 0, 1, 3);

      expect(node.size).toBeGreaterThanOrEqual(0.4);
      expect(node.size).toBeLessThanOrEqual(0.6);
    });
  });

  describe('position', () => {
    it('should have slight vertical wave variation', () => {
      const nodes = [0, 1, 2].map(i =>
        TimelineNode.fromExperience(mockCurrentExperience, i, 3, 3)
      );

      // Y positions should vary (wave effect)
      const yValues = nodes.map(n => n.position.y);
      const allSame = yValues.every(y => y === yValues[0]);
      expect(allSame).toBe(false);
    });

    it('should have z position at 0 (flat timeline)', () => {
      const node = TimelineNode.fromExperience(mockCurrentExperience, 0, 1, 3);

      expect(node.position.z).toBe(0);
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const node = TimelineNode.fromExperience(mockCurrentExperience, 0, 1, 3);

      expect(() => {
        // @ts-expect-error - testing immutability
        node._experience = null;
      }).toThrow();
    });
  });

  describe('equality', () => {
    it('should be equal to another node with same experience id', () => {
      const node1 = TimelineNode.fromExperience(mockCurrentExperience, 0, 1, 3);
      const node2 = TimelineNode.fromExperience(mockCurrentExperience, 0, 1, 3);

      expect(node1.equals(node2)).toBe(true);
    });

    it('should not be equal to node with different experience id', () => {
      const node1 = TimelineNode.fromExperience(mockCurrentExperience, 0, 1, 3);
      const node2 = TimelineNode.fromExperience(mockPastExperience, 0, 1, 3);

      expect(node1.equals(node2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const node = TimelineNode.fromExperience(mockCurrentExperience, 0, 1, 3);
      const str = node.toString();

      expect(str).toContain('TimelineNode');
      expect(str).toContain('SWIFT');
    });
  });
});
