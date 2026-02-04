'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import { Badge } from '@/presentation/components/ui/Badge';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/presentation/components/ui/Card';
import { Typography } from '@/presentation/components/ui/Typography';

export interface ExperienceCardProps {
  /** Selected experience (null shows empty state) */
  experience: ExperienceDTO | null;
  /** Callback to close the panel */
  onClose?: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * Detail card showing selected experience information.
 * Slides in with animation when an experience is selected.
 */
export function ExperienceCard({
  experience,
  onClose,
  className,
}: ExperienceCardProps) {
  return (
    <AnimatePresence mode="wait">
      {experience ? (
        <motion.div
          key={experience.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className={className}
        >
          <Card variant="glass" hover={false}>
            <CardHeader className="relative">
              {/* Close button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close details"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              <div className="pr-8">
                {/* Company and role */}
                <div className="flex items-start gap-3">
                  {/* Current position indicator */}
                  {experience.isCurrent && (
                    <span className="bg-primary-500 mt-1.5 h-3 w-3 rounded-full" />
                  )}
                  <div>
                    <Typography variant="h4" className="mb-1">
                      {experience.company}
                    </Typography>
                    <Typography variant="body" className="text-primary-400">
                      {experience.role}
                    </Typography>
                  </div>
                </div>

                {/* Date and duration */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" size="sm">
                    {experience.formattedDateRange}
                  </Badge>
                  <Badge variant="default" size="sm">
                    {experience.duration}
                  </Badge>
                  {experience.isCurrent && (
                    <Badge variant="primary" size="sm">
                      Current
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Location */}
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-400"
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
                <Typography variant="body-sm" muted>
                  {experience.locationDisplay}
                </Typography>
              </div>

              {/* Description */}
              <div>
                <Typography variant="body-sm" muted className="mb-2">
                  Key Responsibilities
                </Typography>
                <ul className="space-y-1.5">
                  {experience.description.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1.5 text-xs">•</span>
                      <Typography variant="body-sm" className="text-gray-300">
                        {item}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div>
                <Typography variant="body-sm" muted className="mb-2">
                  Technologies
                </Typography>
                <div className="flex flex-wrap gap-1.5">
                  {experience.technologies.map(tech => (
                    <Badge key={tech} variant="primary" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={className}
        >
          <Card variant="glass" hover={false}>
            <CardContent className="py-8 text-center">
              <div className="text-primary-500/50 mb-3">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <Typography variant="body" muted>
                Select an experience to see details
              </Typography>
              <Typography variant="body-sm" muted className="mt-1">
                Click on any node on the timeline
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ExperienceCard;
