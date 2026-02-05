'use client';

import { motion } from 'framer-motion';
import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import { Badge } from '@/presentation/components/ui/Badge';
import { Card, CardContent } from '@/presentation/components/ui/Card';
import { Typography } from '@/presentation/components/ui/Typography';
import { cn } from '@/shared/utils/cn';

export interface ExperienceListProps {
  /** List of experiences */
  experiences: ExperienceDTO[];
  /** Currently selected experience */
  selectedExperience: ExperienceDTO | null;
  /** Callback when an experience is clicked */
  onExperienceClick: (exp: ExperienceDTO) => void;
  /** Additional class names */
  className?: string;
}

/**
 * Single experience card in the list
 */
function ExperienceListItem({
  experience,
  selected,
  onClick,
  delay,
  isLast,
}: {
  experience: ExperienceDTO;
  selected: boolean;
  onClick: () => void;
  delay: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative flex gap-4"
    >
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div
          data-timeline-dot
          className={cn(
            'z-10 h-4 w-4 rounded-full border-2',
            experience.isCurrent
              ? 'border-primary-500 bg-primary-500'
              : 'border-gray-600 bg-gray-800',
            selected &&
              'ring-primary-500/50 ring-2 ring-offset-2 ring-offset-gray-900'
          )}
        />
        {/* Line connecting to next item */}
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-600 to-gray-700" />
        )}
      </div>

      {/* Card content */}
      <div className="flex-1 pb-6">
        <Card
          data-testid="experience-card"
          data-selected={selected}
          variant={selected ? 'solid' : 'glass'}
          hover
          className={cn(
            'cursor-pointer transition-all',
            selected && 'ring-primary-500/50 ring-2'
          )}
          onClick={onClick}
        >
          <CardContent className="p-4">
            {/* Header */}
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <Typography variant="h5" className="mb-0.5">
                  {experience.company}
                </Typography>
                <Typography variant="body-sm" className="text-primary-400">
                  {experience.role}
                </Typography>
              </div>
              {experience.isCurrent && (
                <Badge variant="primary" size="sm">
                  Current
                </Badge>
              )}
            </div>

            {/* Date and location */}
            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                {experience.formattedDateRange}
              </span>
              <span className="text-gray-600">•</span>
              <span>{experience.duration}</span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                {experience.locationDisplay}
              </span>
            </div>

            {/* Description - truncated */}
            <Typography variant="body-sm" muted className="mb-3 line-clamp-2">
              {experience.description[0]}
            </Typography>

            {/* Technologies */}
            <div className="flex flex-wrap gap-1.5">
              {experience.technologies.slice(0, 5).map(tech => (
                <Badge key={tech} variant="default" size="sm" animated={false}>
                  {tech}
                </Badge>
              ))}
              {experience.technologies.length > 5 && (
                <Badge variant="outline" size="sm" animated={false}>
                  +{experience.technologies.length - 5}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

/**
 * Mobile-friendly vertical timeline list of experiences.
 * Shows as a vertical timeline with connected dots and cards.
 */
export function ExperienceList({
  experiences,
  selectedExperience,
  onExperienceClick,
  className,
}: ExperienceListProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {experiences.map((exp, index) => (
        <ExperienceListItem
          key={exp.id}
          experience={exp}
          selected={selectedExperience?.id === exp.id}
          onClick={() => onExperienceClick(exp)}
          delay={index * 0.1}
          isLast={index === experiences.length - 1}
        />
      ))}
    </div>
  );
}
