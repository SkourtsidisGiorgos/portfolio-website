'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/domain/portfolio/entities/Project';
import { Badge } from '@/presentation/components/ui/Badge';
import { Button } from '@/presentation/components/ui/Button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/presentation/components/ui/Card';
import { Typography } from '@/presentation/components/ui/Typography';
import { cn } from '@/shared/utils/cn';

export interface ProjectCardProps {
  /** Project entity */
  project: Project;
  /** Whether the card is selected */
  selected?: boolean;
  /** Click handler */
  onClick?: (project: Project) => void;
  /** Animation delay (in seconds) */
  delay?: number;
  /** Additional class names */
  className?: string;
}

/**
 * Type badge color mapping
 */
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  oss: { bg: 'bg-success-500/20', text: 'text-success-400' },
  professional: { bg: 'bg-accent-500/20', text: 'text-accent-400' },
  personal: { bg: 'bg-primary-500/20', text: 'text-primary-400' },
};

/**
 * Type labels
 */
const TYPE_LABELS: Record<string, string> = {
  oss: 'Open Source',
  professional: 'Professional',
  personal: 'Personal',
};

/**
 * GitHub icon component
 */
function GitHubIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z" />
    </svg>
  );
}

/**
 * External link icon component
 */
function ExternalLinkIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );
}

/**
 * 2D Project card for grid display.
 * Uses existing Card, Badge, Button components (DRY).
 */
export function ProjectCard({
  project,
  selected = false,
  onClick,
  delay = 0,
  className,
}: ProjectCardProps) {
  const typeColor = TYPE_COLORS[project.type] || TYPE_COLORS.personal;
  const typeLabel = TYPE_LABELS[project.type] || project.type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      <Card
        variant="glass"
        hover
        className={cn(
          'h-full cursor-pointer transition-all duration-200',
          selected && 'ring-primary-500 ring-2'
        )}
        onClick={() => onClick?.(project)}
      >
        <CardContent className="flex h-full flex-col p-5">
          {/* Header with type badge and featured indicator */}
          <div className="mb-3 flex items-start justify-between">
            <Badge
              variant="outline"
              size="sm"
              className={cn(typeColor.bg, typeColor.text, 'border-0')}
            >
              {typeLabel}
            </Badge>
            {project.featured && (
              <Badge
                variant="secondary"
                size="sm"
                className="bg-amber-500/20 text-amber-400"
              >
                Featured
              </Badge>
            )}
          </div>

          {/* Title */}
          <Typography variant="h4" className="mb-2 line-clamp-2">
            {project.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body"
            muted
            className="mb-4 line-clamp-3 flex-grow"
          >
            {project.description}
          </Typography>

          {/* Technologies */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.technologies.items.slice(0, 4).map(tech => (
              <Badge key={tech} variant="default" size="sm">
                {tech}
              </Badge>
            ))}
            {project.technologies.count > 4 && (
              <Badge variant="default" size="sm" className="opacity-70">
                +{project.technologies.count - 4}
              </Badge>
            )}
          </div>
        </CardContent>

        {/* Footer with links */}
        {(project.hasGithub() || project.hasLiveDemo()) && (
          <CardFooter className="flex gap-2 pt-0">
            {project.hasGithub() && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<GitHubIcon />}
                onClick={e => {
                  e.stopPropagation();
                  window.open(
                    project.githubUrl!,
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
              >
                Code
              </Button>
            )}
            {project.hasLiveDemo() && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ExternalLinkIcon />}
                onClick={e => {
                  e.stopPropagation();
                  window.open(
                    project.liveUrl!,
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
              >
                Demo
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}

export default ProjectCard;
